import { Navigate, Route, Routes } from 'react-router-dom';
import { asDefaultExport, lazyComponent } from '~/lib/dynamic-import';
import { FullscreenPage } from '~/lib/page-template';

const WorkspaceList = lazyComponent(
  () => import('~/feature/workspace-list').then(asDefaultExport('WorkspaceList')),
  <FullscreenPage.Loading />
);

export default function WorkspacesRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <FullscreenPage>
            <WorkspaceList />
          </FullscreenPage>
        }
      />
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
}
