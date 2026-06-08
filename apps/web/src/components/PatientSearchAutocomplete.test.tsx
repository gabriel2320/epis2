/**
 * @vitest-environment jsdom
 */
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PatientSearchAutocomplete } from './PatientSearchAutocomplete.js';
import { renderWithQuery } from '../test/renderWithQuery.js';

describe('PatientSearchAutocomplete', () => {
  afterEach(() => cleanup());

  it('notifica selección de paciente', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onQueryChange = vi.fn();
    const patients = [
      { id: 'p1', displayName: 'Juan Demo', demoCaseCode: 'DEMO-001' },
    ];

    renderWithQuery(
      <PatientSearchAutocomplete
        patients={patients}
        query="juan"
        onQueryChange={onQueryChange}
        onSelectPatient={onSelect}
      />,
    );

    const input = screen.getByLabelText(/buscar paciente/i);
    await user.click(input);
    await user.click(screen.getByText('Juan Demo'));
    expect(onSelect).toHaveBeenCalledWith(patients[0]);
  });
});
