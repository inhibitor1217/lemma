import { Navigate } from 'react-router-dom';
import { withAuth } from '~/lib/auth';
import { InternalPath } from '../path';

function App() {
  return <div />;
}

export default withAuth(App, {
  Error: () => <Navigate to={InternalPath.Authorize} />,
});
