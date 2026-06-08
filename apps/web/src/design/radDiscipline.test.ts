import { describe, expect, it } from 'vitest';
import { EPIS_RAD_TABINDEX, radSurfaceForPath } from './radDiscipline.js';

describe('radDiscipline', () => {
  it('clasifica superficies RAD por ruta', () => {
    expect(radSurfaceForPath('/comando')).toBe('command');
    expect(radSurfaceForPath('/espacio/evolucion')).toBe('form');
    expect(radSurfaceForPath('/epis2/dashboard')).toBe('grid');
    expect(radSurfaceForPath('/espacio/borrador/abc')).toBe('document');
    expect(radSurfaceForPath('/espacio/ficha')).toBe('workspace');
  });

  it('reserva rangos de TabIndex por región', () => {
    expect(EPIS_RAD_TABINDEX.actionBar).toBeGreaterThan(EPIS_RAD_TABINDEX.formFields);
  });
});
