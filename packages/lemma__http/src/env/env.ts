import Stage from './stage';

export type Env = {
  stage: Stage;

  auth: {
    providers: {
      google: {
        clientId: string;
        clientSecret: string;
        redirectUrl: string;
      };
    };
  };
};
