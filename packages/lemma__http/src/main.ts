import fastify from './app';

const main = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (e) {
    fastify.log.error(e);
    process.exit(1);
  }
};

main();
