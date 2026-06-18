import { describe, expect, it } from 'vitest';
import {
  buildCicaPatientMoreSidebarSection,
  buildCicaPatientSidebarSection,
  buildCicaSystemSidebarSections,
} from './cicaSidebarNav.js';

describe('cicaSidebarNav', () => {
  const ctx = {
    pathname: '/app/pacientes/p1/resumen',
    patientId: 'p1',
    onNavigate: () => {},
  };

  it('ordena entrada clínica según master tree', () => {
    const items = buildCicaSystemSidebarSections({
      pathname: '/app/buscar',
      onNavigate: () => {},
    })[0]?.items;
    expect(items?.map((i) => i.id)).toEqual(['search', 'census', 'agenda', 'my-work', 'recent']);
  });

  it('expone L2 visible y sección Más por separado', () => {
    const primary = buildCicaPatientSidebarSection(ctx)?.items.map((i) => i.id);
    const more = buildCicaPatientMoreSidebarSection(ctx)?.items.map((i) => i.id);

    expect(primary).toEqual([
      'resumen',
      'evoluciones',
      'indicaciones',
      'examenes',
      'medicamentos',
      'documentos',
      'papel',
    ]);
    expect(more).toContain('ingreso');
    expect(more).toContain('auditoria');
    const moreItems = buildCicaPatientMoreSidebarSection(ctx)?.items ?? [];
    expect(moreItems.find((i) => i.id === 'enfermeria')?.planned).toBe(true);
  });
});
