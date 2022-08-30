import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
} from 'react-router-dom';
import {
  AuthorizePage,
  HomePage,
} from '~/page';

export default function () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/authorize" element={<AuthorizePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
