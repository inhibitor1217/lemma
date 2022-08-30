import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
} from 'react-router-dom';
import {
  HomePage,
} from '~/page';

export default function () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
