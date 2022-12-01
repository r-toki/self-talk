import { ChakraProvider, extendTheme, theme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './auth';
import { MeProvider } from './me';

const extendedTheme = extendTheme({
  colors: {
    joy: {
      400: theme.colors.yellow[300],
      500: theme.colors.yellow[400],
      600: theme.colors.yellow[500],
    },
    trust: {
      400: theme.colors.green[200],
      500: theme.colors.green[300],
      600: theme.colors.green[400],
    },
    fear: {
      400: theme.colors.green[500],
      500: theme.colors.green[600],
      600: theme.colors.green[700],
    },
    surprise: {
      400: theme.colors.blue[200],
      500: theme.colors.blue[300],
      600: theme.colors.blue[400],
    },
    sadness: {
      400: theme.colors.blue[500],
      500: theme.colors.blue[600],
      600: theme.colors.blue[700],
    },
    disgust: {
      400: theme.colors.purple[400],
      500: theme.colors.purple[500],
      600: theme.colors.purple[600],
    },
    anger: {
      300: theme.colors.red[300],
      500: theme.colors.red[400],
      600: theme.colors.red[500],
    },
    anticipation: {
      400: theme.colors.orange[300],
      500: theme.colors.orange[400],
      600: theme.colors.orange[500],
    },
  },
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const client = useMemo(() => new QueryClient(), []);
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <ChakraProvider theme={extendedTheme}>
          <AuthProvider>
            <MeProvider>{children}</MeProvider>
          </AuthProvider>
        </ChakraProvider>
      </BrowserRouter>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
