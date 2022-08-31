import Stage from './stage';

export type Env = {
  stage: Stage;

  auth: {
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
