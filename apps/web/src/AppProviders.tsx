import type { ReactNode } from 'react';
import { EpisDesignModeProvider } from './design/EpisDesignModeProvider.js';
import { EpisSessionProvider } from './session/EpisSessionContext.js';
import { EpisDemoEnvironmentBanner } from './components/demo/EpisDemoEnvironmentBanner.js';

/** Providers que dependen de TanStack Router — deben vivir bajo RouterProvider. */
export function EpisAppProviders({ children }: { children: ReactNode }) {
  return (
    <EpisSessionProvider>
      <EpisDesignModeProvider>
        <EpisDemoEnvironmentBanner />
        {children}
      </EpisDesignModeProvider>
    </EpisSessionProvider>
  );
}
