import { Navigate, Route, Routes } from 'react-router-dom';
import { asDefaultExport, lazyComponent } from '~/lib/dynamic-import';
import { FullscreenPage } from '~/lib/page-template';
import { InternalPath } from '~/page/path';

const WorkspaceList = lazyComponent(
  () => import('~/feature/workspace/workspace-list').then(asDefaultExport('WorkspaceList')),
  <FullscreenPage.Loading />
);

export default function WorkspacesRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <FullscreenPage.Padded>
            <WorkspaceList />
          </FullscreenPage.Padded>
        }
      />
      <Route path={`${InternalPath.App.Workspaces.Create._path}`} element={<FullscreenPage.Padded />} />
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
}
