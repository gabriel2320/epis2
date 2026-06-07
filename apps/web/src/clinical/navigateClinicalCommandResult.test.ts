import { describe, expect, it, vi } from 'vitest';
import { navigateClinicalCommandResult } from './navigateClinicalCommandResult.js';

describe('navigateClinicalCommandResult (CE-3b)', () => {
  it('propaga slots en search al abrir formulario', () => {
    const navigate = vi.fn();
    navigateClinicalCommandResult(
      navigate,
      {
        status: 'resolved',
        intent: 'request_laboratory',
        labelEs: 'Solicitar laboratorio',
        routePath: '/espacio/laboratorio',
        slots: { studyHint: 'hemograma', urgencyHint: 'urgent' },
      },
      '00000000-0000-4000-8000-000000000001',
    );
    expect(navigate).toHaveBeenCalledWith({
      to: '/espacio/laboratorio',
      search: {
        patientId: '00000000-0000-4000-8000-000000000001',
        studyHint: 'hemograma',
        urgencyHint: 'urgent',
      },
    });
  });
});
