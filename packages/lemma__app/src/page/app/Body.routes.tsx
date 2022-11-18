import { Navigate, Route, Routes } from 'react-router-dom';
import { withAuth } from '~/lib/auth';
import { InternalPath } from '~/page/path';
import { AppError, AppLoading } from './Body';
import { WorkspacesRoutes } from './workspaces';

function BodyRoutes() {
  return (
    <Routes>
      <Route path={`${InternalPath.App.Workspaces._path}/*`} element={<WorkspacesRoutes />} />
      <Route path="*" element={<Navigate to={InternalPath.App.Workspaces._} />} />
    </Routes>
  );
}

export default withAuth(BodyRoutes, {
  Loading: AppLoading,
  Error: AppError,
});
