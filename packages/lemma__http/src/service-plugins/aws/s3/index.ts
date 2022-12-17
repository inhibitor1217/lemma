import { AWSS3Client, AWSS3ClientArgs } from '@lemma/aws-s3';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Stage } from '~/lib/env';

declare module 'fastify' {
  interface FastifyInstance {
    s3: AWSS3Client;
  }
}

async function s3(fastify: FastifyInstance) {
  const args = fastify.env.stage.is(Stage.Dev)
    ? AWSS3ClientArgs.customEndpoint({
        endpoint: fastify.env.aws.endpoint,
        logger: fastify.log,
        resourcePrefix: fastify.env.aws.resourcePrefix,
      })
    : AWSS3ClientArgs.region({
        logger: fastify.log,
        region: fastify.env.aws.region,
        resourcePrefix: fastify.env.aws.resourcePrefix,
      });

  fastify.decorate('s3', new AWSS3Client(args));
}

export default fp(s3);
