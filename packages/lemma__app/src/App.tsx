import {
  FoundationProvider,
} from '~/lib/foundation';
import GlobalStyle from './global-style';
import Routes from './Routes';

export default function App() {
  return (
    <FoundationProvider>
      <GlobalStyle />
      <Routes />
    </FoundationProvider>
  );
}
