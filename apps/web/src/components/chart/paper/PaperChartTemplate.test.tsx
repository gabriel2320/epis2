/**
 * @vitest-environment jsdom
 */
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PaperChartTemplate } from './PaperChartTemplate.js';

afterEach(() => cleanup());

describe('PaperChartTemplate', () => {
  it('renderiza siete secciones institucionales', () => {
    render(<PaperChartTemplate patientName="Ana Demo" recordNumber="123" />);
    expect(screen.getByTestId('epis2-paper-chart-template')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-paper-section-anamnesis')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-paper-section-discharge')).toBeInTheDocument();
  });

  it('propaga cambios en anamnesis', () => {
    const onSectionChange = vi.fn();
    render(<PaperChartTemplate onSectionChange={onSectionChange} />);
    const section = screen.getByTestId('epis2-paper-section-anamnesis');
    const field = within(section).getByRole('textbox');
    fireEvent.change(field, {
      target: { value: 'Dolor torácico demo' },
    });
    expect(onSectionChange).toHaveBeenCalledWith('anamnesis', 'Dolor torácico demo');
  });
});
