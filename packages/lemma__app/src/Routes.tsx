import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Root from '~/page';
import Authorize from '~/page/authorize';

export default function () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/authorize" element={<Authorize />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
