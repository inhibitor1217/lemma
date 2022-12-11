export class InvalidFileMIMETypeException extends Error {
  constructor(mimetype: string, expectedMimeType: string) {
    super(`Invalid file MIME type: ${mimetype} (expected ${expectedMimeType})`);
  }
}
