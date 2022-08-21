import { FastifyInstance } from "fastify";

export default async (
  fastify: FastifyInstance,
) => {
  fastify.get('/google', async () => {
    throw new Error('Not implemented');
  });

  fastify.get('/google/redirect', async () => {
    throw new Error('Not implemented');
  });
};
