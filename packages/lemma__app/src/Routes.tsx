import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Root, { InternalPath } from '~/page';
import App from '~/page/app';
import Authorize from '~/page/authorize';

export default function () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={InternalPath.Root} element={<Root />} />
        <Route path={InternalPath.Authorize._} element={<Authorize />} />
        <Route path={`${InternalPath.App._}/*`} element={<App />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
