import crypto from 'crypto';

export function nonce() {
  return crypto.randomBytes(32).toString('hex');
}
