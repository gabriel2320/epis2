import { QueryClientProvider } from '@tanstack/react-query';
import { Epis2ThemeProvider } from '@epis2/epis2-ui';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { createTestQueryClient } from '../query/queryClient.js';

type WrapperOptions = {
  queryClient?: ReturnType<typeof createTestQueryClient>;
};

export function createQueryWrapper(options: WrapperOptions = {}) {
  const queryClient = options.queryClient ?? createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <Epis2ThemeProvider disablePreferences>{children}</Epis2ThemeProvider>
      </QueryClientProvider>
    );
  };
}

export function renderWithQuery(ui: ReactElement, options?: RenderOptions & WrapperOptions) {
  const { queryClient, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: createQueryWrapper({ queryClient }),
    ...renderOptions,
  });
}
