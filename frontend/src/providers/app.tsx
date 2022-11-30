import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './auth';
import { MeProvider } from './me';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const client = useMemo(() => new QueryClient(), []);
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <ChakraProvider>
          <AuthProvider>
            <MeProvider>{children}</MeProvider>
          </AuthProvider>
        </ChakraProvider>
      </BrowserRouter>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
