import { FastifyInstance } from 'fastify';
import _import from './import';
import _translation from './translation';
import translations from './translations';

export default async function translation(fastify: FastifyInstance) {
  fastify.register(_translation);
  fastify.register(translations);
  fastify.register(_import, { prefix: '/import' });
}
