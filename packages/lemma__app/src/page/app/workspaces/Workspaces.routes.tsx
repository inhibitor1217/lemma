import { Navigate, Route, Routes } from 'react-router-dom';
import { WorkspaceList } from '~/feature/workspace-list';
import { FullscreenPage } from '~/lib/page-template';

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
