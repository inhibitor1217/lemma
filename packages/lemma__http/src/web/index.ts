import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    webUrl: (path: string, query?: Record<string, string>) => string;
  }
}

async function web(fastify: FastifyInstance) {
  fastify.decorate('webUrl', (path: string, query?: Record<string, string>) => {
    const url = new URL(path, fastify.env.web.baseUrl);
    const params = new URLSearchParams();

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        params.append(key, value);
      }
    }

    url.search = params.toString();
    return url.href;
  });
}

export default fp(web);
