import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Either, pipe, tap } from '@lemma/fx';
import { AWSS3ClientArgs, AWSS3ClientLogger } from './aws-s3-client-args';

export namespace AWSS3Client {
  export type PutObjectResult = {
    resource: string;
    key: string;
    bucketName: string;
    httpUri: string;
  };

  export type PutObjectError = unknown;
}

export class AWSS3Client {
  private readonly client: S3Client;
  private readonly logger: AWSS3ClientLogger;
  private readonly resourcePrefix: string;

  constructor(args: AWSS3ClientArgs) {
    const { logger, resourcePrefix, ...rest } = args;

    this.client = new S3Client(rest);
    this.logger = logger;
    this.resourcePrefix = resourcePrefix;
  }

  public putObject(
    resource: string,
    key: string,
    file: Blob | Buffer | ReadableStream
  ): Promise<Either<AWSS3Client.PutObjectResult, AWSS3Client.PutObjectError>> {
    this.logger.debug(`AWSS3Client: upload file to resource ${resource} with key ${key}`);

    const command = new PutObjectCommand({
      Bucket: this.bucketName(resource),
      Key: key,
      Body: file,
    });

    return this.client
      .send(command)
      .then(() =>
        Either.ok({
          resource,
          key,
          bucketName: this.bucketName(resource),
          httpUri: this.objectHttpUri(resource, key),
        })
      )
      .catch(
        pipe(
          tap((error) => this.logger.error(error)),
          Either.error
        )
      );
  }

  private bucketName(resource: string): string {
    return `${this.resourcePrefix}.${resource}`;
  }

  private resourceHttpUri(resource: string): string {
    if (this.client.config.forcePathStyle) {
      return `${this.client.config.endpoint}/${this.bucketName(resource)}`;
    }

    return `https://${this.bucketName(resource)}.s3.${this.client.config.region}.amazonaws.com`;
  }

  private objectHttpUri(resource: string, key: string): string {
    return `${this.resourceHttpUri(resource)}/${key}`;
  }
}
