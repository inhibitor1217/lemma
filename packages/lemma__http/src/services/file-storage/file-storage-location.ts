import { extend } from 'extended-enum';

enum _FileStorageLocation {
  Internal = 'internal',
}

export class FileStorageLocation extends extend(_FileStorageLocation) {
  get bucketName(): string {
    switch (this) {
      case FileStorageLocation.Internal:
        return 'internal';
      default:
        throw new TypeError(`Unknown FileStorageLocation: ${this}`);
    }
  }
}
