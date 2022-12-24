export type HeaderKeys =
  | 'Cache-Control'
  | 'Content-Disposition'
  | 'Content-Encoding'
  | 'Content-Length'
  | 'Content-Type'
  | 'Expires'
  | 'Last-Modified';

export type Headers = {
  'Cache-Control'?: string;
  'Content-Disposition'?: string;
  'Content-Encoding'?: string;
  'Content-Length'?: number;
  'Content-Type'?: string;
  Expires?: Date;
  'Last-Modified'?: Date;
};

export type Body = {
  asStream: () => ReadableStream;
  asBuffer: () => Promise<Buffer>;
};
