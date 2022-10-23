import { Navigate, Route, Routes } from 'react-router-dom';
import { HierarchicalPage } from '~/lib/page-template';

export default function WorkspacesRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HierarchicalPage.EmptyPage />} />
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
}
