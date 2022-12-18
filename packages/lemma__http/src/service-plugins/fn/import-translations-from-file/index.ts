import { FunctionClient } from '@lemma/fn-import-translations-from-file';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    fnImportTranslationsFromFile: FunctionClient;
  }
}

async function importTranslationsFromFile(fastify: FastifyInstance) {
  fastify.decorate('fnImportTranslationsFromFile', new FunctionClient(fastify.lambda));
}

export default fp(importTranslationsFromFile);
