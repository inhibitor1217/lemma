import { Either } from '@lemma/fx';
import { FileStorageLocation } from './file-storage-location';
import { NoSuchKeyException } from './file-storage.exception';

interface StorageClient {
  headObject(
    bucketName: string,
    key: string
  ): Promise<
    Either<
      {
        headers: {
          'Cache-Control'?: string;
          'Content-Disposition'?: string;
          'Content-Encoding'?: string;
          'Content-Length'?: number;
          'Content-Type'?: string;
          Expires?: Date;
          'Last-Modified'?: Date;
        };
      },
      unknown
    >
  >;

  getObject(
    bucketName: string,
    key: string
  ): Promise<
    Either<
      {
        headers: {
          'Cache-Control'?: string;
          'Content-Disposition'?: string;
          'Content-Encoding'?: string;
          'Content-Length'?: number;
          'Content-Type'?: string;
          Expires?: Date;
          'Last-Modified'?: Date;
        };
        body: {
          asStream: () => ReadableStream;
          asBuffer: () => Promise<Buffer>;
        };
      },
      unknown
    >
  >;

  putObject(bucketName: string, key: string, file: Blob | Buffer | ReadableStream): Promise<Either<{ httpUri: string }, unknown>>;
}

export namespace FileStorageClient {
  export type ExistsResult = boolean;

  export type ExistsError = unknown;

  export type GetFileResult = {
    headers: {
      'Cache-Control'?: string;
      'Content-Disposition'?: string;
      'Content-Encoding'?: string;
      'Content-Length'?: number;
      'Content-Type'?: string;
      Expires?: Date;
      'Last-Modified'?: Date;
    };
    file: {
      asStream: () => ReadableStream;
      asBuffer: () => Promise<Buffer>;
    };
  };

  export type GetFileError = NoSuchKeyException | unknown;

  export type UploadFileResult = {
    httpUri: string;
  };

  export type UploadFileError = unknown;
}

export class FileStorageClient {
  /**
   * @note
   *
   * Might apply abstraction for storage service layer
   * to support multiple vendors.
   */
  constructor(private readonly storage: StorageClient) {}

  public exists(
    location: FileStorageLocation,
    key: string
  ): Promise<Either<FileStorageClient.ExistsResult, FileStorageClient.ExistsError>> {
    return this.storage
      .headObject(location.bucketName, key)
      .then(
        Either.reduce(
          () => Either.ok(true),
          (e) => {
            if (e instanceof Error && e.message.includes('NoSuchKeyException')) {
              return Either.ok(false);
            }

            return Either.error(e);
          }
        )
      )
      .catch(Either.error);
  }

  public getFile(
    location: FileStorageLocation,
    key: string
  ): Promise<Either<FileStorageClient.GetFileResult, FileStorageClient.GetFileError>> {
    return this.storage
      .getObject(location.bucketName, key)
      .then(Either.map(({ headers, body }) => ({ headers, file: body })))
      .catch((e) => {
        if (e instanceof Error && e.message.includes('NoSuchKeyException')) {
          return Either.error(new NoSuchKeyException(key));
        }

        return Either.error(e);
      });
  }

  public uploadFile(
    location: FileStorageLocation,
    key: string,
    file: Blob | Buffer | ReadableStream
  ): Promise<Either<FileStorageClient.UploadFileResult, FileStorageClient.UploadFileError>> {
    return this.storage
      .putObject(location.bucketName, key, file)
      .then(Either.map(({ httpUri }) => ({ httpUri })))
      .catch(Either.error);
  }
}
