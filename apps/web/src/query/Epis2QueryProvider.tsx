import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createEpis2QueryClient } from './queryClient.js';

const queryClient = createEpis2QueryClient();

export function Epis2QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export { queryClient as epis2QueryClient };
