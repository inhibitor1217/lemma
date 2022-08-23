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
};
