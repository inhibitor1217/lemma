import Stage from './stage';

export type Env = {
  stage: Stage;

  auth: {
    cookie: {
      secret: string;
    };
    session: {
      secret: string;
    };
    providers: {
      google: {
        clientId: string;
        clientSecret: string;
        redirectUrl: string;
      };
    };
  };

  redis: {
    host: string;
    port: number;
    username: string;
    password: string;
  };

  web: {
    baseUrl: string;
  };
};
