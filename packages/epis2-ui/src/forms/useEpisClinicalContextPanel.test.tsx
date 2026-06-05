/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { useEpisClinicalContextPanel } from './useEpisClinicalContextPanel.js';

const storageKey = 'epis2-clinical-context:test:evolution_note';

function wrapper({ children }: { children: ReactNode }) {
  return <Epis2ThemeProvider>{children}</Epis2ThemeProvider>;
}

describe('useEpisClinicalContextPanel', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('restaura apertura desde sessionStorage', () => {
    sessionStorage.setItem(storageKey, '1');
    const { result } = renderHook(() => useEpisClinicalContextPanel({ storageKey }), { wrapper });
    expect(result.current.contextOpen).toBe(true);
  });

  it('persiste cambios en sessionStorage', () => {
    const { result } = renderHook(() => useEpisClinicalContextPanel({ storageKey }), { wrapper });
    act(() => {
      result.current.setContextOpen(true);
    });
    expect(sessionStorage.getItem(storageKey)).toBe('1');
    act(() => {
      result.current.setContextOpen(false);
    });
    expect(sessionStorage.getItem(storageKey)).toBe('0');
  });
});
