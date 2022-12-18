import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import importTranslationsFromFile from './import-translations-from-file';

async function fn(fastify: FastifyInstance) {
  fastify.register(importTranslationsFromFile);
}

export default fp(fn);
