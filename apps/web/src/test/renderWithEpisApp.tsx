import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { ActivePatientProvider } from '../clinical/ActivePatientContext.js';
import { EpisSessionProvider } from '../session/EpisSessionContext.js';
import { createQueryWrapper, type WrapperOptions } from './renderWithQuery.js';

export function createEpisAppWrapper(options: WrapperOptions = {}) {
  const QueryWrapper = createQueryWrapper(options);
  return function EpisAppWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryWrapper>
        <ActivePatientProvider>
          <EpisSessionProvider>{children}</EpisSessionProvider>
        </ActivePatientProvider>
      </QueryWrapper>
    );
  };
}

export function renderWithEpisApp(ui: ReactElement, options?: RenderOptions & WrapperOptions) {
  const { queryClient, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: createEpisAppWrapper({ queryClient }),
    ...renderOptions,
  });
}

/** Mock mínimo de TanStack Router para hooks de modos (`useEpisActiveMode`, etc.). */
export function episRouterStateMock(pathname = '/comando', searchStr = '') {
  return {
    useRouterState: ({
      select,
    }: {
      select: (s: { location: { pathname: string; searchStr?: string } }) => unknown;
    }) => select({ location: { pathname, searchStr } }),
  };
}
