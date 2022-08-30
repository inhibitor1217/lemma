import { LightFoundation, useFoundation } from '@channel.io/bezier-react';
import { FoundationProvider } from '~/lib/foundation';
import GlobalStyle from './global-style';
import Routes from './Routes';

export default function App() {
  return (
    <FoundationProvider>
      <GlobalStyle foundation={useFoundation() ?? LightFoundation} />
      <Routes />
    </FoundationProvider>
  );
}
