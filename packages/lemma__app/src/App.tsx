import {
  FoundationProvider,
} from '~/lib/foundation';
import GlobalStyle from './global-style';

export default function App() {
  return (
    <FoundationProvider>
      <GlobalStyle />
      <div />
    </FoundationProvider>
  );
}
