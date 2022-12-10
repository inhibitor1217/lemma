import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { FileStorageClient } from '~/services/file-storage';

declare module 'fastify' {
  interface FastifyInstance {
    fileStorage: FileStorageClient;
  }
}

async function fileStorage(fastify: FastifyInstance) {
  fastify.decorate('fileStorage', new FileStorageClient(fastify.s3));
}

export default fp(fileStorage);
