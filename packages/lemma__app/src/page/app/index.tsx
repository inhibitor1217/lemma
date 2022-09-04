import { HierarchicalPage } from '~/lib/page-template';
import BodyRoutes from './Body.routes';

export default function App() {
  return <HierarchicalPage GNB={<div />} Body={<BodyRoutes />} />;
}
