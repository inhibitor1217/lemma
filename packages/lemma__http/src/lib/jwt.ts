import jwt from 'jsonwebtoken';

export type JwtSignOptions = {
  subject: string;
  expireDurationSeconds: number;
};

export type JwtDecodedPayload<Payload> = Payload & jwt.JwtPayload;

export type JwtVerificationOptions = {
  subject: string;
};

export type JwtVerificationErrorType =
  | 'invalid_token'
  | 'invalid_signature'
  | 'invalid_issuer'
  | 'invalid_subject'
  | 'token_expired'
  | 'unknown';

export type JwtVerificationError = {
  type: JwtVerificationErrorType;
  message: string;
};

export namespace Jwt {
  export function isExpireImminent(payload: JwtDecodedPayload<unknown>, thresholdMs: number): boolean {
    const { exp } = payload;
    if (typeof exp !== 'number') {
      return false;
    }

    return exp - Date.now() < thresholdMs;
  }
}
