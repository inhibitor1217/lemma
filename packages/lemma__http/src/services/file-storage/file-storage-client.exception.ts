import { FileStorageLocation } from './file-storage-location';

export class UploadFileFailedException extends Error {
  constructor(public readonly location: FileStorageLocation, public readonly key: string) {
    super(`Failed to upload file to ${location} with key ${key}`);
  }
}

export class UnknownFileStorageClientError extends Error {
  constructor(public readonly error: unknown) {
    super(`Unknown file storage client error: ${error}`);
  }
}
