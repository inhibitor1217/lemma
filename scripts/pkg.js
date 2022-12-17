#!/usr/bin/env node

const fs = require('fs/promises');
const util = require('util');
const _exec = util.promisify(require('child_process').exec);
const path = require('path');

const exec = (command, ...args) => {
  const msg = [command, ...args.map((arg) => `\t${arg}`)].join(' \\\n');
  console.log(`\x1b[2mRun: ${msg}\x1b[0m`);
  return _exec([command, ...args].join(' '));
};

const workspaceTsconfigPath = path.resolve('tsconfig.json');
const tsconfigFileCandidates = ['tsconfig.json', 'tsconfig.esm.json', 'tsconfig.cjs.json'];

const packageTemplatesDir = path.resolve('support', 'package-template');
const packageTemplateDir = (name) => path.resolve(packageTemplatesDir, name);
const listTemplates = () => exec('ls', packageTemplatesDir).then(({ stdout }) => stdout.split('  ').map((name) => name.trim()));

const packageDir = (name) => path.resolve('packages', `lemma__${name}`);
const packageName = (name) => `@lemma/${name}`;

const exists = (path) =>
  fs
    .access(path)
    .then(() => true)
    .catch(() => false);

require('yargs')
  .scriptName('pkg')
  .usage('$0 <cmd> [args]')
  .command(
    'create',
    'Create a package',
    (yargs) => {
      yargs.positional('name', {
        alias: 'n',
        describe: 'The name of the package',
        demandOption: true,
        type: 'string',
      });
      yargs.positional('desc', {
        alias: 'd',
        describe: 'The description of the package',
        demandOption: true,
        type: 'string',
      });
      yargs.positional('template', {
        alias: 't',
        describe: 'The template to use',
        demandOption: true,
        type: 'string',
      });
    },
    async (argv) => {
      const { name, desc, template } = argv;
      const availableTemplates = await listTemplates();

      if (!availableTemplates.includes(template)) {
        console.error(`Template "${template}" not found. Available templates: ${availableTemplates.join(', ')}`);
        process.exit(1);
      }

      // Check if package already exists
      if (await exists(packageDir(name))) {
        console.error(`Error: package "${name}" already exists`);
        process.exit(1);
      }

      // Copy package directory from template
      await exec('cp', '-r', packageTemplateDir(template), packageDir(name));

      // Replace package name
      await exec(`grep -rl '<package-name>' ${packageDir(name)} | xargs sed -i 's|<package-name>|${packageName(name)}|g'`);

      // Replace package description
      await exec(`grep -rl '<package-description>' ${packageDir(name)} | xargs sed -i 's|<package-description>|${desc}|g'`);

      // Add package to tsconfig.json
      const tsconfig = JSON.parse(await fs.readFile(workspaceTsconfigPath, 'utf8'));

      if (!tsconfig.references) {
        tsconfig.references = [];
      }

      await Promise.all(
        tsconfigFileCandidates
          .map((tsconfigFile) => path.resolve(packageDir(name), tsconfigFile))
          .map(async (tsconfigFile) => {
            if (await exists(tsconfigFile)) {
              tsconfig.references.push({
                path: path.relative(path.dirname(workspaceTsconfigPath), tsconfigFile),
              });
            }
          })
      );

      tsconfig.references.sort((a, b) => a.path.localeCompare(b.path));

      await fs.writeFile(workspaceTsconfigPath, JSON.stringify(tsconfig, null, 2));

      // Install dependencies
      await exec('yarn');

      // Build packages
      await exec('yarn tsc --build --verbose');
    }
  )
  .help().argv;
