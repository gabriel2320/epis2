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
    const field = within(section).getByTestId('epis2-paper-field-anamnesis');
    fireEvent.change(field, {
      target: { value: 'Dolor torácico demo' },
    });
    expect(onSectionChange).toHaveBeenCalledWith('anamnesis', 'Dolor torácico demo');
  });

  it('muestra watermark de borrador por defecto', () => {
    render(<PaperChartTemplate patientName="Ana Demo" recordNumber="123" />);
    expect(screen.getByTestId('epis2-paper-document-watermark')).toHaveAttribute(
      'data-watermark-status',
      'draft',
    );
  });

  it('muestra watermark aprobado cuando documentStatus es signed', () => {
    render(<PaperChartTemplate documentStatus="signed" />);
    expect(screen.getByTestId('epis2-paper-document-watermark')).toHaveAttribute(
      'data-watermark-status',
      'signed',
    );
  });

  it('muestra confirmación IA y subrayado', () => {
    const onConfirmSection = vi.fn();
    render(
      <PaperChartTemplate
        fields={{
          soap: { value: 'Plan IA', source: 'ai_draft', confirmed: false },
        }}
        onConfirmSection={onConfirmSection}
      />,
    );
    const field = screen.getByTestId('epis2-paper-field-soap');
    expect(field).toHaveClass('epis2-paper-ai-draft');
    fireEvent.click(screen.getByTestId('epis2-paper-confirm-ai-soap'));
    expect(onConfirmSection).toHaveBeenCalledWith('soap');
  });
});
