import { FoundationProvider } from '~/lib/foundation';
import { ReactQueryProvider } from '~/lib/react-query';
import GlobalStyle from './global-style';
import Routes from './Routes';

export default function App() {
  return (
    <ReactQueryProvider>
      <FoundationProvider>
        <GlobalStyle />
        <Routes />
      </FoundationProvider>
    </ReactQueryProvider>
  );
}
