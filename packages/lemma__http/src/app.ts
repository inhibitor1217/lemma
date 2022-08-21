import fastify from 'fastify';
import * as ping from './ping';

const app = fastify({ logger: true });

app.register(ping.routes);

export default app;
