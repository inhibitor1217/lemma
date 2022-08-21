import fastify from 'fastify';
import * as auth from '~/auth';
import * as error from '~/error';
import * as ping from '~/ping';

const app = fastify({ logger: true });

app.register(auth.routes, { prefix: '/auth' });
app.register(ping.routes, { prefix: '/ping' });

app.setErrorHandler(error.handler);

export default app;
