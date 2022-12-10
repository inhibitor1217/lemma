import { FastifyInstance } from 'fastify';
import _translation from './translation';
import translations from './translations';

export default async function translation(fastify: FastifyInstance) {
  fastify.register(_translation);
  fastify.register(translations);
}
