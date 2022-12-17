import { Either } from '@lemma/fx';
import { FileStorageLocation } from './file-storage-location';

interface StorageClient {
  putObject(bucketName: string, key: string, file: Blob | Buffer | ReadableStream): Promise<Either<{ httpUri: string }, unknown>>;
}

export namespace FileStorageClient {
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
