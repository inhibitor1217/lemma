import { Error, ErrorSemantic } from '~/lib/error';

export namespace HttpApiError {
  const STATUS_CODE = {
    OK: 200,
    NO_CONTENT: 204,
    FOUND: 302,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  };

  export type DTO = {
    statusCode: number;
    message: string;
  };

  export const toError = (dto: DTO): Error<{ __raw: DTO }> => {
    switch (dto.statusCode) {
      case STATUS_CODE.UNAUTHORIZED:
        return {
          semantic: ErrorSemantic.Unauthorized,
          message: dto.message,
          payload: { __raw: dto },
        };
      default:
        return {
          semantic: ErrorSemantic.Unknown,
          message: 'Oops! Something went wrong.',
          payload: { __raw: dto },
        };
    }
  };
}
