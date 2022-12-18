import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Either, pipe, tap } from '@lemma/fx';
import { AWSS3ClientArgs, AWSS3ClientLogger } from './aws-s3-client-args';

export namespace AWSS3Client {
  export type Header =
    | 'Cache-Control'
    | 'Content-Disposition'
    | 'Content-Encoding'
    | 'Content-Language'
    | 'Content-Length'
    | 'Content-Type'
    | 'Expires'
    | 'Last-Modified';

  export type HeadObjectResult = {
    resource: string;
    key: string;
    bucketName: string;
    httpUri: string;
    headers: {
      'Cache-Control'?: string;
      'Content-Disposition'?: string;
      'Content-Encoding'?: string;
      'Content-Length'?: number;
      'Content-Type'?: string;
      Expires?: Date;
      'Last-Modified'?: Date;
    };
  };

  export type HeadObjectError = unknown;

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

  constructor(private readonly args: AWSS3ClientArgs) {
    const { logger, resourcePrefix, ...rest } = args;

    this.client = new S3Client(rest);
    this.logger = logger;
    this.resourcePrefix = resourcePrefix;
  }

  public headObject(resource: string, key: string): Promise<Either<AWSS3Client.HeadObjectResult, AWSS3Client.HeadObjectResult>> {
    this.logger.debug(`AWSS3Client#headObject`);
    this.logger.debug({
      resource,
      key,
    });

    const command = new HeadObjectCommand({
      Bucket: this.bucketName(resource),
      Key: key,
    });

    return this.client
      .send(command)
      .then((res) => {
        return Either.ok({
          resource,
          key,
          bucketName: this.bucketName(resource),
          httpUri: this.objectHttpUri(resource, key),
          headers: {
            'Cache-Control': res.CacheControl,
            'Content-Disposition': res.ContentDisposition,
            'Content-Encoding': res.ContentEncoding,
            'Content-Length': res.ContentLength,
            'Content-Type': res.ContentType,
            Expires: res.Expires,
            'Last-Modified': res.LastModified,
          },
        });
      })
      .catch(
        pipe(
          tap((error) => this.logger.error(error)),
          Either.error
        )
      );
  }

  public putObject(
    resource: string,
    key: string,
    file: Blob | Buffer | ReadableStream
  ): Promise<Either<AWSS3Client.PutObjectResult, AWSS3Client.PutObjectError>> {
    this.logger.debug(`AWSS3Client#putObject`);
    this.logger.debug({
      resource,
      key,
    });

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
    if (this.args.forcePathStyle) {
      if (!this.args.endpoint) {
        throw new TypeError('Endpoint is required when forcePathStyle is true');
      }
      return `${this.args.endpoint}/${this.bucketName(resource)}`;
    }

    return `https://${this.bucketName(resource)}.s3.${this.client.config.region}.amazonaws.com`;
  }

  private objectHttpUri(resource: string, key: string): string {
    return `${this.resourceHttpUri(resource)}/${key}`;
  }
}
