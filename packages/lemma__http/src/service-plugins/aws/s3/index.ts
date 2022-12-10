import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { Stage } from '~/lib/env';
import { AWSS3Client, AWSS3ClientArgs } from '~/services/aws/s3';

declare module 'fastify' {
  interface FastifyInstance {
    s3: AWSS3Client;
  }
}

async function s3(fastify: FastifyInstance) {
  const args = fastify.env.stage.is(Stage.Dev)
    ? AWSS3ClientArgs.customEndpoint(fastify.env.aws.endpoint)
    : AWSS3ClientArgs.region(fastify.env.aws.region);

  fastify.decorate('s3', new AWSS3Client(args));
}

export default fp(s3);
