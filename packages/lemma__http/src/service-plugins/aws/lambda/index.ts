import { AWSLambdaClient, AWSLambdaClientArgs } from '@lemma/aws-lambda';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Stage } from '~/lib/env';

declare module 'fastify' {
  interface FastifyInstance {
    lambda: AWSLambdaClient;
  }
}

async function lambda(fastify: FastifyInstance) {
  const args = fastify.env.stage.is(Stage.Dev)
    ? AWSLambdaClientArgs.customEndpoint({
        endpoint: fastify.env.aws.endpoint,
        logger: fastify.log,
        region: fastify.env.aws.region,
      })
    : AWSLambdaClientArgs.region({
        logger: fastify.log,
        region: fastify.env.aws.region,
      });

  fastify.decorate('lambda', new AWSLambdaClient(args));
}

export default fp(lambda);
