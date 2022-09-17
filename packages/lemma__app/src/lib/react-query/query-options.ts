import { QueryOptions } from '@tanstack/react-query';
import { Error, ErrorSemantic } from '~/lib/error';

const MAX_RETRY_ATTEMPTS = 3;

export const presetQueryOptions: QueryOptions = {
  retry(failureCount, error) {
    if (Error.isError(error)) {
      if (!ErrorSemantic.isTransient(error.semantic)) {
        return false;
      }
    }

    return failureCount < MAX_RETRY_ATTEMPTS;
  },
};
