/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfflineStatusBanner } from './OfflineStatusBanner.js';

describe('OfflineStatusBanner', () => {
  it('muestra aviso cuando navigator está offline', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: false,
    });
    render(<OfflineStatusBanner />);
    expect(screen.getByTestId('epis2-offline-banner')).toBeInTheDocument();
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    });
  });
});
