import { Error, ErrorSemantic } from '~/lib/error';

const MAX_RETRY_ATTEMPTS = 3;

export function retry(failureCount: number, error: unknown): boolean {
  if (Error.isError(error)) {
    if (!ErrorSemantic.isTransient(error.semantic)) {
      return false;
    }
  }

  return failureCount < MAX_RETRY_ATTEMPTS;
}
