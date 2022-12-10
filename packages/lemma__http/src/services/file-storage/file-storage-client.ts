import { AWSS3Client } from '~/services/aws/s3';

export class FileStorageClient {
  /**
   * @note
   *
   * Might apply abstraction for storage service layer
   * to support multiple vendors.
   */
  constructor(private readonly s3: AWSS3Client) {}
}
