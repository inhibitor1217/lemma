import { defineException } from '@lemma/exception';
import { Either, pipe } from '@lemma/fx';
import { Body, Headers } from './file';
import { FileStorageLocation } from './file-storage-location';
import { StorageClient } from './storage-client';

export class FileStorageClient {
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
            if (e instanceof StorageClient.NoSuchKeyException) {
              return Either.ok(false);
            }
            return Either.error(new FileStorageClient.FlieStorageClientError(e));
          }
        )
      )
      .catch((e) => Either.error(new FileStorageClient.FlieStorageClientError(e)));
  }

  public getFile(
    location: FileStorageLocation,
    key: string
  ): Promise<Either<FileStorageClient.GetFileResult, FileStorageClient.GetFileError>> {
    return this.storage
      .getObject(location.bucketName, key)
      .then(
        pipe(
          Either.map(({ headers, body }) => ({ headers, body })),
          Either.mapOr((e) => {
            if (e.type === 'StorageClient.NoSuchKeyException') {
              return new FileStorageClient.NoSuchKeyException({ key: e.attrs.key });
            }
            return new FileStorageClient.FlieStorageClientError(e);
          })
        )
      )
      .catch((e) => Either.error(new FileStorageClient.FlieStorageClientError(e)));
  }

  public uploadFile(
    location: FileStorageLocation,
    key: string,
    file: Blob | Buffer | ReadableStream
  ): Promise<Either<FileStorageClient.UploadFileResult, FileStorageClient.UploadFileError>> {
    return this.storage
      .putObject(location.bucketName, key, file)
      .then(
        pipe(
          Either.map(({ httpUri }) => ({ httpUri })),
          Either.mapOr((e) => new FileStorageClient.FlieStorageClientError(e))
        )
      )
      .catch((e) => Either.error(new FileStorageClient.FlieStorageClientError(e)));
  }
}

export namespace FileStorageClient {
  export const NoSuchKeyException = defineException('FileStorageClient', 'NoSuchKeyException')<{ key: string }>();
  export type NoSuchKeyException = InstanceType<typeof NoSuchKeyException>;

  export const FlieStorageClientError = defineException('FileStorageClient', 'FileStorageClientError')<{}>();
  export type FlieStorageClientError = InstanceType<typeof FlieStorageClientError>;

  export type ExistsResult = boolean;

  export type ExistsError = FlieStorageClientError;

  export type GetFileResult = {
    headers: Headers;
    body: Body;
  };

  export type GetFileError = NoSuchKeyException | FlieStorageClientError;

  export type UploadFileResult = {
    httpUri: string;
  };

  export type UploadFileError = FlieStorageClientError;
}
