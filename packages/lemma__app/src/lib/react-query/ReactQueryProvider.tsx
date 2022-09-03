import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function ReactQueryProvider({ children }: PropsWithChildren<{}>) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
