/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EpisDemoEnvironmentBanner } from './EpisDemoEnvironmentBanner.js';

describe('EpisDemoEnvironmentBanner', () => {
  it('muestra banner demo persistente', () => {
    render(<EpisDemoEnvironmentBanner />);
    expect(screen.getByTestId('epis2-demo-environment-banner')).toBeInTheDocument();
  });
});
