import { Either, pipe } from '@lemma/fx';
import { AWSS3Client } from '~/services/aws/s3';
import { FileStorageLocation } from './file-storage-location';
import { UnknownFileStorageClientError, UploadFileFailedException } from './file-storage-client.exception';

export namespace FileStorageClient {
  export type UploadFileResult = {
    httpUri: string;
  };

  export type UploadFileError = UploadFileFailedException | UnknownFileStorageClientError;
}

export class FileStorageClient {
  /**
   * @note
   *
   * Might apply abstraction for storage service layer
   * to support multiple vendors.
   */
  constructor(private readonly s3: AWSS3Client) {}

  public uploadFile(
    location: FileStorageLocation,
    key: string,
    file: Blob | Buffer | ReadableStream
  ): Promise<Either<FileStorageClient.UploadFileResult, FileStorageClient.UploadFileError>> {
    return this.s3
      .putObject(location.bucketName, key, file)
      .then(
        pipe(
          Either.map(({ httpUri }) => ({ httpUri })),
          Either.mapOr(() => new UploadFileFailedException(location, key))
        )
      )
      .catch((error) => Either.error(new UnknownFileStorageClientError(error)));
  }
}
