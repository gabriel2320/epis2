// @vitest-environment jsdom
/**
 * MF-184: autocomplete de medicamentos del catálogo promovido.
 * freeSolo (el catálogo sugiere, no restringe) + degradación si la API falla.
 */
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../api/client.js', () => ({
  apiFetch: vi.fn(),
  ApiError: class ApiError extends Error {
    status = 500;
  },
}));

import { apiFetch } from '../api/client.js';
import { MedicationCatalogAutocomplete } from './MedicationCatalogAutocomplete.js';

const apiFetchMock = vi.mocked(apiFetch);

function Harness() {
  const [value, setValue] = useState('');
  return (
    <MedicationCatalogAutocomplete
      label="Medicamento"
      value={value}
      required
      onChange={setValue}
    />
  );
}

describe('MedicationCatalogAutocomplete', () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('consulta el catálogo al escribir y permite seleccionar una sugerencia', async () => {
    apiFetchMock.mockResolvedValue({
      readOnly: true,
      catalogCode: 'medication',
      entries: [
        { entryCode: 'isp-losartan-50', label: 'LOSARTÁN 50 mg comprimidos' },
        { entryCode: 'isp-losartan-100', label: 'LOSARTÁN 100 mg comprimidos' },
      ],
    });
    const user = userEvent.setup();
    render(<Harness />);

    const input = screen.getByTestId('epis2-medication-catalog-autocomplete-input');
    await user.type(input, 'losar');

    await waitFor(() => {
      expect(apiFetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/clinical/catalogs/medication?q=losar'),
      );
    });

    const option = await screen.findByText('LOSARTÁN 50 mg comprimidos');
    await user.click(option);
    expect(input).toHaveValue('LOSARTÁN 50 mg comprimidos');
  });

  it('degrada a texto libre si la API del catálogo falla', async () => {
    apiFetchMock.mockRejectedValue(new Error('catalog unavailable'));
    const user = userEvent.setup();
    render(<Harness />);

    const input = screen.getByTestId('epis2-medication-catalog-autocomplete-input');
    await user.type(input, 'amoxicilina 500 mg');

    await waitFor(() => {
      expect(apiFetchMock).toHaveBeenCalled();
    });
    expect(input).toHaveValue('amoxicilina 500 mg');
  });
});
