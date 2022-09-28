import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import {
  JwtDecodedPayload,
  JwtSignOptions,
  JwtVerificationError,
  JwtVerificationOptions,
} from '~/lib/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    signJwt(payload: string | object, secret: string, opts: JwtSignOptions): Promise<string>;
    verifyJwt<Payload extends string | object>(token: string, secret: string, opts: JwtVerificationOptions): Promise<JwtDecodedPayload<Payload>>;
  }
}

function formatJsonwebtokenError(err: any): JwtVerificationError {
  if (err instanceof jwt.TokenExpiredError) {
    return {
      type: 'token_expired',
      message: err.message,
    };
  }

  if (err instanceof jwt.JsonWebTokenError) {
    if (err.message.includes('jwt malformed')) {
      return {
        type: 'invalid_token',
        message: err.message,
      };
    }

    if (err.message.includes('jwt signature is required') || err.message.includes('invalid signature')) {
      return {
        type: 'invalid_signature',
        message: err.message,
      };
    }

    if (err.message.includes('jwt issue invalid')) {
      return {
        type: 'invalid_issuer',
        message: err.message,
      };
    }

    if (err.message.includes('jwt subject invalid')) {
      return {
        type: 'invalid_subject',
        message: err.message,
      };
    }
  }

  return {
    type: 'unknown',
    message: err.message,
  };
}

async function jwtPlugin(fastify: FastifyInstance) {
  const issuer = `@lemma/http:${fastify.env.stage.toString()}`;

  fastify.decorate('signJwt', (payload: any, secret: string, opts: JwtSignOptions) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        secret,
        {
          issuer,
          subject: opts.subject,
          expiresIn: opts.expireDurationSeconds,
        },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    });
  });

  fastify.decorate('verifyJwt', (token: string, secret: string, opts: JwtVerificationOptions) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        secret,
        {
          issuer,
          subject: opts.subject,
        },
        (err, decoded) => {
          if (err) {
            reject(formatJsonwebtokenError(err));
          } else {
            resolve(decoded);
          }
        }
      );
    });
  });
}

export default fp(jwtPlugin);
