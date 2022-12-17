import { extend } from 'extended-enum';

enum _FileStorageLocation {
  Internal = 'internal',
}

interface FileStorageLocationMethods {
  readonly bucketName: string;
}

export class FileStorageLocation extends extend<typeof _FileStorageLocation, _FileStorageLocation, FileStorageLocationMethods>(
  _FileStorageLocation
) {
  get bucketName(): string {
    switch (this) {
      case FileStorageLocation.Internal:
        return 'internal';
      default:
        throw new TypeError(`Unknown FileStorageLocation: ${this}`);
    }
  }
}
