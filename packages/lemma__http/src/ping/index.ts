import { FastifyInstance } from 'fastify';
import routes from './routes';

export default async function (fastify: FastifyInstance) {
  fastify.register(routes);
};
