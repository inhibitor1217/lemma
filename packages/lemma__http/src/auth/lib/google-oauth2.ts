export type GoogleOAuth2TokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
  refresh_token?: string;
};

export type GoogleOAuth2IdTokenPayload = {
  sub: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
};
