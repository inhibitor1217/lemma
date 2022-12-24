import { defineException } from '@lemma/exception';
import { Either } from '@lemma/fx';
import { Body, Headers } from './file';

export interface StorageClient {
  headObject(
    bucketName: string,
    key: string
  ): Promise<Either<StorageClient.HeadObject['Result'], StorageClient.HeadObject['Error']>>;

  getObject(
    bucketName: string,
    key: string
  ): Promise<Either<StorageClient.GetObject['Result'], StorageClient.GetObject['Error']>>;

  putObject(
    bucketName: string,
    key: string,
    file: Blob | Buffer | ReadableStream
  ): Promise<Either<StorageClient.PutObject['Result'], StorageClient.PutObject['Error']>>;
}

export namespace StorageClient {
  export const NoSuchKeyException = defineException('StorageClient', 'NoSuchKeyException')<{ key: string }>();
  export type NoSuchKeyException = InstanceType<typeof NoSuchKeyException>;

  export const StorageClientError = defineException('StorageClient', 'StorageClientError')<{}>();
  export type StorageClientError = InstanceType<typeof StorageClientError>;

  export type HeadObject = {
    Result: {
      headers: Headers;
    };
    Error: NoSuchKeyException | StorageClientError;
  };

  export type GetObject = {
    Result: {
      headers: Headers;
      body: Body;
    };
    Error: NoSuchKeyException | StorageClientError;
  };

  export type PutObject = {
    Result: {
      httpUri: string;
    };
    Error: StorageClientError;
  };
}
