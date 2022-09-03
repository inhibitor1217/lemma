import { LightFoundation, useFoundation } from '@channel.io/bezier-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FoundationProvider } from '~/lib/foundation';
import GlobalStyle from './global-style';
import Routes from './Routes';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FoundationProvider>
        <GlobalStyle foundation={useFoundation() ?? LightFoundation} />
        <Routes />
      </FoundationProvider>
    </QueryClientProvider>
  );
}
