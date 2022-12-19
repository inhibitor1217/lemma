import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Either, pipe, tap } from '@lemma/fx';
import { AWSS3ClientArgs, AWSS3ClientLogger } from './aws-s3-client-args';
import { MissingCredentialsException, NoSuchKeyException, UnknownError } from './aws-s3-client.exception';

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

  export type HeadObjectError = MissingCredentialsException | NoSuchKeyException | UnknownError;

  export type GetObjectResult = {
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
    body: {
      asStream: () => ReadableStream;
      asBuffer: () => Promise<Buffer>;
    };
  };

  export type GetObjectError = MissingCredentialsException | NoSuchKeyException | UnknownError;

  export type PutObjectResult = {
    resource: string;
    key: string;
    bucketName: string;
    httpUri: string;
  };

  export type PutObjectError = MissingCredentialsException | UnknownError;
}

export class AWSS3Client {
  private readonly client: S3Client;
  private readonly logger: AWSS3ClientLogger;
  private readonly resourcePrefix: string;

  constructor(private readonly args: AWSS3ClientArgs) {
    const { logger, resourcePrefix, ...rest } = args;

    this.client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
      ...rest,
    });
    this.logger = logger;
    this.resourcePrefix = resourcePrefix;
  }

  public headObject(resource: string, key: string): Promise<Either<AWSS3Client.HeadObjectResult, AWSS3Client.HeadObjectError>> {
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
          AWSS3Client.mapAWSS3Errors
        )
      );
  }

  public getObject(resource: string, key: string): Promise<Either<AWSS3Client.GetObjectResult, AWSS3Client.GetObjectError>> {
    this.logger.debug('AWSS3Client#getObject');
    this.logger.debug({
      resource,
      key,
    });

    const command = new GetObjectCommand({
      Bucket: this.bucketName(resource),
      Key: key,
    });

    return this.client
      .send(command)
      .then((res) => {
        const { Body, CacheControl, ContentDisposition, ContentEncoding, ContentLength, ContentType, Expires, LastModified } =
          res;

        if (!Body) {
          throw new TypeError('Empty response body from S3 GetObject');
        }

        return Either.ok({
          resource,
          key,
          bucketName: this.bucketName(resource),
          httpUri: this.objectHttpUri(resource, key),
          headers: {
            'Cache-Control': CacheControl,
            'Content-Disposition': ContentDisposition,
            'Content-Encoding': ContentEncoding,
            'Content-Length': ContentLength,
            'Content-Type': ContentType,
            Expires,
            'Last-Modified': LastModified,
          },
          body: {
            asStream: () => Body.transformToWebStream(),
            asBuffer: () => Body.transformToByteArray().then((bytes) => Buffer.from(bytes)),
          },
        });
      })
      .catch(
        pipe(
          tap((error) => this.logger.error(error)),
          AWSS3Client.mapAWSS3Errors
        )
      );
  }

  /**
   * @fixme
   *
   * Identify MIME type of given file,
   * and set `Content-Type` header when creating a `PutObject` request.
   */
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
          AWSS3Client.mapAWSS3Errors
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

  private static mapAWSS3Errors(error: unknown): Either<any, Error> {
    if (error instanceof Error) {
      if (error.message.includes('Credential is missing')) {
        return Either.error(new MissingCredentialsException());
      }

      /**
       * @note
       *
       * S3 HeadObject commands throw a weird exception when the object does not exist.
       * This specific branch is to catch that exception and return a more meaningful error.
       */
      if (error instanceof TypeError && error.message.includes("Cannot read properties of null (reading 'getReader')")) {
        return Either.error(new NoSuchKeyException());
      }

      return Either.error(new UnknownError(error));
    }

    return Either.error(new UnknownError(error));
  }
}
