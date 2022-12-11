import { Either } from '@lemma/fx';
import { AWSS3Client } from '~/services/aws/s3';
import { FileStorageLocation } from './file-storage-location';

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
  constructor(private readonly s3: AWSS3Client) {}

  public uploadFile(
    location: FileStorageLocation,
    key: string,
    file: Blob | Buffer | ReadableStream
  ): Promise<Either<FileStorageClient.UploadFileResult, FileStorageClient.UploadFileError>> {
    return this.s3.putObject(location.bucketName, key, file).then(Either.map(({ httpUri }) => ({ httpUri })));
  }
}
