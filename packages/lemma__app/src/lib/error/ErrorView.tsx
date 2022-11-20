import Disconnected from './Disconnected';
import { Error } from './error';
import { ErrorSemantic } from './error-semantic';
import InvalidEntity from './InvalidEntity';
import Unknown from './Unknown';

/**
 * Routes an error to specific error components
 * using the error semantic.
 */
export default function ErrorView({ error }: { error: Error }) {
  if (Error.isSemanticOf(error, ErrorSemantic.Disconnected)) {
    return <Disconnected />;
  }

  if (Error.isSemanticOf(error, ErrorSemantic.InvalidEntity)) {
    return <InvalidEntity />;
  }

  return <Unknown />;
}
