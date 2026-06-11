/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChartModeSwitch } from './ChartModeSwitch.js';

describe('ChartModeSwitch', () => {
  it('alterna entre ficha electrónica y papel', () => {
    const onChange = vi.fn();
    render(<ChartModeSwitch mode="traditional" onChange={onChange} />);
    fireEvent.click(screen.getByTestId('epis2-chart-mode-paper'));
    expect(onChange).toHaveBeenCalledWith('paper');
    expect(screen.getByText(copy.chartModes.traditional)).toBeInTheDocument();
  });
});
