import { describe, expect, it, vi } from 'vitest';
import {
  transitionCommandToClassic,
  transitionCommandToDashboard,
  transitionDashboardToClassic,
  transitionDashboardToCommand,
} from './modeTransitions.js';

describe('modeTransitions', () => {
  it('transitionCommandToClassic incluye mode=classic', () => {
    const navigate = vi.fn();
    transitionCommandToClassic(navigate, { patientId: 'p-1' });
    expect(navigate).toHaveBeenCalledWith({
      to: '/espacio/ficha',
      search: { mode: 'classic', patientId: 'p-1' },
    });
  });

  it('transitionCommandToDashboard incluye mode=dashboard y tab', () => {
    const navigate = vi.fn();
    transitionCommandToDashboard(navigate, { dashboardTab: 'pharmacy' });
    expect(navigate).toHaveBeenCalledWith({
      to: '/epis2/dashboard',
      search: { mode: 'dashboard', tab: 'pharmacy' },
    });
  });

  it('transitionDashboardToClassic preserva returnTo y tab', () => {
    const navigate = vi.fn();
    transitionDashboardToClassic(navigate, 'p-3', 'nursing');
    expect(navigate).toHaveBeenCalledWith({
      to: '/espacio/ficha',
      search: {
        mode: 'classic',
        patientId: 'p-3',
        returnTo: 'dashboard',
        tab: 'nursing',
      },
    });
  });

  it('transitionDashboardToCommand incluye context dashboard', () => {
    const navigate = vi.fn();
    transitionDashboardToCommand(navigate, 'icu');
    expect(navigate).toHaveBeenCalledWith({
      to: '/espacio/buscar-paciente',
      search: { context: 'dashboard', tab: 'icu' },
    });
  });
});
