/**
 * @vitest-environment jsdom
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PaperTextarea } from './PaperTextarea.js';

afterEach(() => cleanup());

describe('PaperTextarea', () => {
  it('renderiza textarea nativo sin role textbox MUI outline', () => {
    render(
      <PaperTextarea
        value="Nota clínica"
        onChange={vi.fn()}
        ariaLabel="Evolución"
        testId="epis2-paper-field-soap"
      />,
    );
    const el = screen.getByTestId('epis2-paper-field-soap');
    expect(el.tagName).toBe('TEXTAREA');
    expect(el).toHaveClass('epis2-paper-textarea');
    expect(el).not.toHaveClass('MuiInputBase-input');
  });

  it('propaga cambios', () => {
    const onChange = vi.fn();
    render(<PaperTextarea value="" onChange={onChange} ariaLabel="Anamnesis" testId="f" />);
    fireEvent.change(screen.getByTestId('f'), { target: { value: 'Dolor' } });
    expect(onChange).toHaveBeenCalledWith('Dolor');
  });

  it('marca borrador IA', () => {
    render(<PaperTextarea value="Sugerencia" ariaLabel="Plan" testId="f" aiDraft readOnly />);
    expect(screen.getByTestId('f')).toHaveClass('epis2-paper-ai-draft');
  });
});
