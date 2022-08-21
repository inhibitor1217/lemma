import { extend } from 'extended-enum';

enum _Stage {
  Dev = 'dev',
  Stage = 'stage',
  Prod = 'prod',
}

export class Stage extends extend(_Stage) { }

export type Env = {
  stage: Stage;
};

const loadEnv = (() => {
  let env: Env | undefined;

  const loadFromFile = (): Promise<Env> => import('dotenv')
    .then((dotenv) => {
      dotenv.config({ path: '.env.local' });

      return {
        stage: Stage.from(process.env.STAGE) ?? Stage.Dev,
      };
    });

  const loadFromSecret = (): Promise<Env> => Promise.reject('Not implemented');

  const isDevelopment = (process.env.NODE_ENV || 'development') === 'development';

  return async (): Promise<Env> => env ?? (env = isDevelopment ? await loadFromFile() : await loadFromSecret());
})();

export default loadEnv;
