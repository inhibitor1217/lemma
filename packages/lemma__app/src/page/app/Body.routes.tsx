import { Navigate, Route, Routes } from 'react-router-dom';
import Body from './Body';

export default function BodyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Body />} />
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
}
