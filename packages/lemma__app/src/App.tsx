import { FoundationProvider } from '~/lib/foundation';
import { LayoutProvider } from '~/lib/layout';
import { ReactQueryProvider } from '~/lib/react-query';
import { RecoilProvider } from '~/lib/recoil';
import GlobalStyle from './global-style';
import Routes from './Routes';

export default function App() {
  return (
    <ReactQueryProvider>
      <RecoilProvider>
        <FoundationProvider>
          <LayoutProvider>
            <GlobalStyle />
            <Routes />
          </LayoutProvider>
        </FoundationProvider>
      </RecoilProvider>
    </ReactQueryProvider>
  );
}
