export { AWSS3Client } from './aws-s3-client';
export { AWSS3ClientArgs, AWSS3ClientLogger } from './aws-s3-client-args';
export {
  MissingCredentialsException as AWSS3MissingCredentialsException,
  NoSuchKeyException as AWSS3NoSuchKeyException,
  UnknownError as AWSS3UnknownError,
} from './aws-s3-client.exception';
