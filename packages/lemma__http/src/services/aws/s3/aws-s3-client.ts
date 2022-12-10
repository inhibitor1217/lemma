import { S3Client } from '@aws-sdk/client-s3';
import { AWSS3ClientArgs } from './aws-s3-client-args';

export class AWSS3Client {
  private readonly client: S3Client;

  constructor(args: AWSS3ClientArgs) {
    this.client = new S3Client(args);
  }
}
