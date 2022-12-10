import { Env } from './env';
import Stage from './stage';

export default (() => {
  const loadFromFile = (): Promise<Env> =>
    import('dotenv').then((dotenv) => {
      dotenv.config({ path: '.env.local' });

      return {
        stage: Stage.from(process.env.STAGE) ?? Stage.Dev,
        auth: {
          cookie: {
            secret: process.env.COOKIE_SECRET || '',
          },
          session: {
            secret: process.env.SESSION_SECRET || '',
          },
          providers: {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID || '',
              clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
              redirectUrl: process.env.GOOGLE_OAUTH_REDIRECT_URL || '',
            },
          },
        },
        mongodb: {
          host: process.env.MONGODB_HOST || '',
          port: Number(process.env.MONGODB_PORT) || 0,
          database: process.env.MONGODB_DATABASE || '',
          username: process.env.MONGODB_USERNAME || '',
          password: process.env.MONGODB_PASSWORD || '',
        },
        redis: {
          host: process.env.REDIS_HOST || '',
          port: Number(process.env.REDIS_PORT) || 0,
          username: process.env.REDIS_USERNAME || '',
          password: process.env.REDIS_PASSWORD || '',
        },
        web: {
          baseUrl: process.env.WEB_BASE_URL || '',
        },
      };
    });

  const loadFromSecret = (): Promise<Env> => Promise.reject('Not implemented');

  const isDevelopment = (process.env.NODE_ENV || 'development') === 'development';

  const promise = isDevelopment ? loadFromFile() : loadFromSecret();

  return () => promise;
})();
