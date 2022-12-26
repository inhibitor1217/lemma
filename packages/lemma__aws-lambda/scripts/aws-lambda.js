#!/usr/bin/env node

const fs = require('fs/promises');
const util = require('util');
const _exec = util.promisify(require('child_process').exec);
const path = require('path');

const zipFileName = 'build.zip';
const logGroupName = (functionName) => `/aws/lambda/${functionName}`;
const iamRoleName = (functionName) => `lambda-${functionName}-role`;
const iamRoleArn = (functionName, awsUserId = '000000000000') => `arn:aws:iam::${awsUserId}:role/${iamRoleName(functionName)}`;

const exec = (command, ...args) => {
  const msg = [command, ...args.map((arg) => `\t${arg}`)].join(' \\\n');
  console.log(`\x1b[2mRun: ${msg}\x1b[0m`);
  return _exec([command, ...args].join(' '));
};

require('yargs')
  .scriptName('aws-lambda')
  .usage('$0 <cmd> [args]')
  .command(
    'clean',
    'Clean the deployed resources',
    (yargs) => {
      yargs.positional('stage', {
        describe: 'The stage to deploy the lambda function to',
        type: 'string',
        default: 'local',
      });
      yargs.positional('functionName', {
        describe: 'The name of the lambda function',
        type: 'string',
      });
      yargs.positional('region', {
        describe: 'The region to deploy the lambda function to',
        type: 'string',
        default: 'ap-northeast-2',
      });
    },
    async (argv) => {
      const { stage, functionName, region } = argv;

      const awsCommand = stage === 'local' ? 'awslocal' : 'aws';

      // Delete log group
      console.log('Deleting log group...');
      await exec(`${awsCommand} logs delete-log-group`, `--region ${region}`, `--log-group-name ${logGroupName(functionName)}`);

      // Delete IAM Role
      console.log('Deleting IAM Role...');
      await exec(`${awsCommand} iam delete-role`, `--region ${region}`, `--role-name ${iamRoleName(functionName)}`);

      // Delete Lambda Function
      console.log('Deleting Lambda Function...');
      await exec(`${awsCommand} lambda delete-function`, `--region ${region}`, `--function-name ${functionName}`);
    }
  )
  .command(
    'deploy',
    'Deploy a lambda function',
    (yargs) => {
      yargs.positional('stage', {
        describe: 'The stage to deploy the lambda function to',
        type: 'string',
        default: 'local',
      });
      yargs.positional('functionName', {
        describe: 'The name of the lambda function',
        type: 'string',
      });
      yargs.positional('region', {
        describe: 'The region to deploy the lambda function to',
        type: 'string',
        default: 'ap-northeast-2',
      });
      yargs.positional('buildDir', {
        describe: 'The directory containing the lambda function',
        type: 'string',
        default: './build',
      });
      yargs.positional('iamRolePolicyDocumentPath', {
        describe: 'The path to the IAM role policy document',
        type: 'string',
        default: './res/iam-role.json',
      });
      yargs.positional('envFile', {
        describe: 'The path to the environment variables file (only for local stage)',
        type: 'string',
        default: './.env.local',
      });
      yargs.positional('prismaRuntime', {
        describe: 'Whether to include the Prisma runtime',
        type: 'boolean',
        default: false,
      });
    },
    async (argv) => {
      const { stage, functionName, region, buildDir, iamRolePolicyDocumentPath, envFile, prismaRuntime } = argv;

      const awsCommand = stage === 'local' ? 'awslocal' : 'aws';

      if (prismaRuntime) {
        // Copy Prisma runtime into build directory
        console.log('Resolving Prisma runtime...');

        const prismaClientRuntimePath = path.resolve(__dirname, '..', '..', 'lemma__prisma-client', 'dist');
        const prismaLibDestinationPath = path.resolve(buildDir, 'node_modules', '@lemma', 'prisma-client');

        const excludedPatterns = [
          '*.d.ts',
          '*-browser.js',
          '*-esm.js',
          'libquery_engine-debian-*',
          'libquery_engine-macos-*',
          'libquery_engine-windows-*',
        ];

        await exec(`mkdir -p ${prismaLibDestinationPath}`);
        await exec(
          `rsync -a --exclude ${excludedPatterns
            .map((pattern) => `'${pattern}'`)
            .join(' --exclude ')} ${prismaClientRuntimePath}/ ${prismaLibDestinationPath}/`
        );
      }

      // Create zip file
      console.log('Creating zip file...');
      await exec(`cd ${buildDir} && zip -r ../${zipFileName} .`);
      const zipFilePath = path.resolve(buildDir, '..', zipFileName);

      console.log(`Creating AWS IAM Role for ${functionName}...`);

      // Delete IAM Policies for existing IAM Role
      const existingPolicies = await exec(
        `${awsCommand} iam list-role-policies`,
        `--region ${region}`,
        `--role-name ${iamRoleName(functionName)}`
      )
        .then((res) => JSON.parse(res.stdout))
        .catch(() => false);

      if (existingPolicies) {
        for (const policyName of existingPolicies.PolicyNames) {
          await exec(
            `${awsCommand} iam delete-role-policy`,
            `--region ${region}`,
            `--role-name ${iamRoleName(functionName)}`,
            `--policy-name ${policyName}`
          );
        }
      }

      // Delete existing IAM Role
      if (
        await exec(`${awsCommand} iam get-role`, `--region ${region}`, `--role-name ${iamRoleName(functionName)}`).catch(
          () => false
        )
      ) {
        await exec(`${awsCommand} iam delete-role`, `--region ${region}`, `--role-name ${iamRoleName(functionName)}`);
      }

      // Parse IAM Role Policy Document
      const { AssumeRolePolicyDocument, Policies } = JSON.parse(await fs.readFile(iamRolePolicyDocumentPath, 'utf8'));

      // Create IAM Role
      await exec(
        `${awsCommand} iam create-role`,
        `--region ${region}`,
        `--role-name ${iamRoleName(functionName)}`,
        `--assume-role-policy-document '${JSON.stringify(AssumeRolePolicyDocument)}'`
      );

      // Attach IAM Role Policy
      for (const { PolicyName, PolicyDocument } of Policies) {
        await exec(
          `${awsCommand} iam put-role-policy`,
          `--region ${region}`,
          `--role-name ${iamRoleName(functionName)}`,
          `--policy-name ${PolicyName}`,
          `--policy-document '${JSON.stringify(PolicyDocument)}'`
        );
      }

      // Create CloudWatch Log Group, if it doesn't exist
      console.log(`Creating CloudWatch Log Group for ${functionName}...`);
      if (
        await exec(
          `${awsCommand} logs describe-log-groups`,
          `--region ${region}`,
          `--log-group-name-prefix ${logGroupName(functionName)}`
        )
          .then(() => false)
          .catch(() => true)
      ) {
        await exec(`${awsCommand} logs create-log-group`, `--region ${region}`, `--log-group-name ${logGroupName(functionName)}`);
      }

      // Deploy Lambda Function
      console.log(`Deploying Lambda Function ${functionName}...`);
      if (
        await exec(`${awsCommand} lambda get-function`, `--region ${region}`, `--function-name ${functionName}`)
          .then(() => false)
          .catch(() => true)
      ) {
        await exec(
          `${awsCommand} lambda create-function`,
          `--region ${region}`,
          `--function-name ${functionName}`,
          `--zip-file fileb://${zipFilePath}`,
          `--handler index.handler`,
          `--runtime nodejs16.x`,
          `--role ${iamRoleArn(functionName)}`
        );
      } else {
        await exec(
          `${awsCommand} lambda update-function-code`,
          `--region ${region}`,
          `--function-name ${functionName}`,
          `--zip-file fileb://${zipFilePath}`
        );
      }

      // Update Lambda Function Environment Variables
      if (stage === 'local') {
        if (
          await fs
            .access(envFile)
            .then(() => true)
            .catch(() => false)
        ) {
          console.log(`Updating Lambda Function ${functionName} environment variables...`);
          const envStr = await fs
            .readFile(envFile, 'utf8')
            .then((data) => data.toString())
            .then((str) =>
              str
                .split('\n')
                .filter((line) => !!line)
                .join(',')
            );
          await exec(
            `${awsCommand} lambda update-function-configuration`,
            `--region ${region}`,
            `--function-name ${functionName}`,
            `--environment "Variables={${envStr}}"`
          );
        } else {
          console.log(`No environment variables file found, skipping ...`);
        }
      }
    }
  )
  .command(
    'logs',
    'Get logs for a lambda function',
    (yargs) => {
      yargs.positional('stage', {
        describe: 'The stage to deploy the lambda function to',
        type: 'string',
        default: 'local',
      });
      yargs.positional('functionName', {
        describe: 'The name of the lambda function',
        type: 'string',
      });
      yargs.positional('region', {
        describe: 'The region to deploy the lambda function to',
        type: 'string',
        default: 'ap-northeast-2',
      });
    },
    async (argv) => {
      const { stage, functionName, region } = argv;

      const awsCommand = stage === 'local' ? 'awslocal' : 'aws';

      await exec(`${awsCommand} logs tail ${logGroupName(functionName)}`, `--region ${region}`, '--format short').then((res) =>
        console.log(res.stdout)
      );
    }
  )
  .command(
    'invoke',
    'Invoke a lambda function',
    (yargs) => {
      yargs.positional('stage', {
        describe: 'The stage to deploy the lambda function to',
        type: 'string',
        default: 'local',
      });
      yargs.positional('functionName', {
        describe: 'The name of the lambda function',
        type: 'string',
      });
      yargs.positional('region', {
        describe: 'The region to deploy the lambda function to',
        type: 'string',
        default: 'ap-northeast-2',
      });
      yargs.positional('payload', {
        describe: 'The payload to invoke the lambda function with',
        type: 'string',
      });
    },
    async (argv) => {
      const { stage, functionName, region, payload } = argv;

      const awsCommand = stage === 'local' ? 'awslocal' : 'aws';

      await exec(
        `${awsCommand} lambda invoke`,
        `--region ${region}`,
        `--function-name ${functionName}`,
        `--payload '${payload}'`,
        '--cli-binary-format raw-in-base64-out',
        '--invocation-type RequestResponse',
        '/dev/null'
      );
    }
  )
  .help().argv;
