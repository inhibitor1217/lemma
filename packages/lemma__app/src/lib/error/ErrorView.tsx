import Disconnected from './Disconnected';
import { Error } from './error';
import { ErrorSemantic } from './error-semantic';
import Unknown from './Unknown';

/**
 * Routes an error to specific error components
 * using the error semantic.
 */
export default function ErrorView({ error }: { error: Error }) {
  if (Error.isSemanticOf(error, ErrorSemantic.Disconnected)) {
    return <Disconnected />;
  }

  return <Unknown />;
}
