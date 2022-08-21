import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export default async (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  reply.statusCode = error.statusCode ?? 500;

  return {
    statusCode: 500,
    message: 'Internal Server Error',
  };
};
