/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisBrandMark } from './EpisBrandMark.js';

describe('EpisBrandMark', () => {
  it('muestra la letra E en isotipo cuadrado', () => {
    render(
      <Epis2ThemeProvider disablePreferences>
        <EpisBrandMark />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-brand-mark')).toHaveTextContent('E');
  });
});
