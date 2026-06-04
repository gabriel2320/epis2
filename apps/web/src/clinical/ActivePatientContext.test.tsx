/**
 * @vitest-environment jsdom
 */
import type { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ActivePatientProvider, useActivePatient } from './ActivePatientContext.js';

describe('ActivePatientContext', () => {
  it('persiste paciente activo en sessionStorage', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ActivePatientProvider>{children}</ActivePatientProvider>
    );
    const { result } = renderHook(() => useActivePatient(), { wrapper });

    act(() => {
      result.current.setPatient({
        id: 'a0000001-0000-4000-8000-000000000001',
        displayName: 'Paciente Demo — Carmen Soto',
        demoCaseCode: 'DEMO-001',
      });
    });

    expect(result.current.patient?.demoCaseCode).toBe('DEMO-001');

    const { result: again } = renderHook(() => useActivePatient(), { wrapper });
    expect(again.current.patient?.id).toBe('a0000001-0000-4000-8000-000000000001');

    act(() => again.current.clearPatient());
    expect(again.current.patient).toBeNull();
  });
});
