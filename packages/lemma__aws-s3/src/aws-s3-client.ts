import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { defineException } from '@lemma/exception';
import { Body, Headers, StorageClient } from '@lemma/file-storage-client';
import { Either, pipe, tap } from '@lemma/fx';
import { AWSS3ClientArgs, AWSS3ClientLogger } from './aws-s3-client-args';

export class AWSS3Client implements StorageClient {
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

  public headObject(
    resource: string,
    key: string
  ): Promise<Either<AWSS3Client.HeadObject['Result'], AWSS3Client.HeadObject['Error']>> {
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
          AWSS3Client.mapAWSS3Error
        )
      )
      .then(
        Either.mapOr((error) => {
          switch (error.type) {
            case 'AWSS3Client.AWSS3ClientError':
            case 'AWSS3Client.MissingCredentialsException':
            default:
              return new StorageClient.StorageClientError({}, error);
            case 'AWSS3Client.NoSuchKeyException':
              return new StorageClient.NoSuchKeyException({ key }, error);
          }
        })
      );
  }

  public getObject(
    resource: string,
    key: string
  ): Promise<Either<AWSS3Client.GetObject['Result'], AWSS3Client.GetObject['Error']>> {
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
          AWSS3Client.mapAWSS3Error
        )
      )
      .then(
        Either.mapOr((error) => {
          switch (error.type) {
            case 'AWSS3Client.AWSS3ClientError':
            case 'AWSS3Client.MissingCredentialsException':
            default:
              return new StorageClient.StorageClientError({}, error);
            case 'AWSS3Client.NoSuchKeyException':
              return new StorageClient.NoSuchKeyException({ key }, error);
          }
        })
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
  ): Promise<Either<AWSS3Client.PutObject['Result'], AWSS3Client.PutObject['Error']>> {
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
          AWSS3Client.mapAWSS3Error
        )
      )
      .then(Either.mapOr((error) => new StorageClient.StorageClientError({}, error)));
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

  private static mapAWSS3Error(
    error: unknown
  ): Either<any, AWSS3Client.AWSS3ClientError | AWSS3Client.MissingCredentialsException | AWSS3Client.NoSuchKeyException> {
    if (error instanceof Error) {
      if (error.message.includes('Credential is missing')) {
        return Either.error(new AWSS3Client.MissingCredentialsException({}, error));
      }

      /**
       * @note
       *
       * S3 HeadObject commands throw a weird exception when the object does not exist.
       * This specific branch is to catch that exception and return a more meaningful error.
       */
      if (error instanceof TypeError && error.message.includes("Cannot read properties of null (reading 'getReader')")) {
        return Either.error(new AWSS3Client.NoSuchKeyException({}));
      }

      return Either.error(new AWSS3Client.AWSS3ClientError({}, error));
    }

    return Either.error(new AWSS3Client.AWSS3ClientError({}, error));
  }
}

export namespace AWSS3Client {
  export const MissingCredentialsException = defineException('AWSS3Client', 'MissingCredentialsException')<{}>();
  export type MissingCredentialsException = InstanceType<typeof MissingCredentialsException>;

  export const NoSuchKeyException = defineException('AWSS3Client', 'NoSuchKeyException')<{}>();
  export type NoSuchKeyException = InstanceType<typeof NoSuchKeyException>;

  export const AWSS3ClientError = defineException('AWSS3Client', 'AWSS3ClientError')<unknown>();
  export type AWSS3ClientError = InstanceType<typeof AWSS3ClientError>;

  export type HeadObject = {
    Result: {
      resource: string;
      key: string;
      bucketName: string;
      httpUri: string;
      headers: Headers;
    };
    Error: StorageClient.NoSuchKeyException | StorageClient.StorageClientError;
  };

  export type GetObject = {
    Result: {
      resource: string;
      key: string;
      bucketName: string;
      httpUri: string;
      headers: Headers;
      body: Body;
    };
    Error: StorageClient.NoSuchKeyException | StorageClient.StorageClientError;
  };

  export type PutObject = {
    Result: {
      resource: string;
      key: string;
      bucketName: string;
      httpUri: string;
    };
    Error: StorageClient.StorageClientError;
  };
}
