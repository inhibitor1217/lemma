import app from './app';

const main = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (e) {
    app.log.error(e);
    process.exit(1);
  }
};

main();
