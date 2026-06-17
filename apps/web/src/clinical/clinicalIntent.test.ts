import { describe, expect, it } from 'vitest';
import { getBlueprintByRoutePath } from '@epis2/clinical-forms';
import { copy } from '@epis2/design-system';
import {
  resolveCicaTabLayoutActions,
  resolveIntentFromBlueprint,
  resolveIntentFromTraditionalSection,
  resolvePaperModeIntent,
} from './clinicalIntent.js';

describe('clinicalIntent', () => {
  it('resolveCicaTabLayoutActions — documents tab primaria Documentos', () => {
    const actions = resolveCicaTabLayoutActions('documents', {
      onOpenDocuments: () => {},
      onPaperMode: () => {},
    });
    expect(actions[0]?.kind).toBe('primary');
    expect(actions[0]?.label).toBe(copy.chartModes.navDocuments);
    expect(actions[0]?.testId).toBe('epis2-chart-layout-documents');
  });

  it('resolveCicaTabLayoutActions — more tab primaria Medicamentos', () => {
    const actions = resolveCicaTabLayoutActions('more', {
      onOpenPrescription: () => {},
      onPaperMode: () => {},
    });
    expect(actions[0]?.kind).toBe('primary');
    expect(actions[0]?.label).toBe(copy.chartModes.navMeds);
    expect(actions[0]?.testId).toBe('epis2-chart-layout-prescription');
  });

  it('resolveCicaTabLayoutActions — exams tab primaria Laboratorio', () => {
    const actions = resolveCicaTabLayoutActions('exams', {
      onOpenResults: () => {},
      onPaperMode: () => {},
    });
    expect(actions[0]?.kind).toBe('primary');
    expect(actions[0]?.label).toBe(copy.chartModes.navLabs);
    expect(actions[0]?.testId).toBe('epis2-chart-layout-results');
  });

  it('resolveCicaTabLayoutActions — orders tab primaria Indicación', () => {
    const onNewOrder = () => {};
    const actions = resolveCicaTabLayoutActions('orders', { onNewOrder, onPaperMode: () => {} });
    expect(actions[0]?.kind).toBe('primary');
    expect(actions[0]?.label).toBe(copy.chartModes.actionOrder);
    expect(actions[0]?.testId).toBe('epis2-chart-layout-new-order');
  });

  it('resolveCicaTabLayoutActions — summary tab primaria evolución', () => {
    const actions = resolveCicaTabLayoutActions('summary', {
      onOpenEvolution: () => {},
      onPaperMode: () => {},
    });
    expect(actions[0]?.kind).toBe('primary');
    expect(actions[0]?.label).toBe(copy.chartModes.navEvolution);
  });

  it('resolveIntentFromBlueprint — evolución nivel 4', () => {
    const blueprint = getBlueprintByRoutePath('/espacio/evolucion');
    expect(blueprint).toBeDefined();
    const intent = resolveIntentFromBlueprint(blueprint!);
    expect(intent.level).toBe(4);
    expect(intent.intentId).toBe('clinical_form');
    expect(intent.primaryActionLabel).toBe(copy.forms.save);
  });

  it('resolveIntentFromBlueprint — epicrisis nivel 4 con Guardar', () => {
    const blueprint = getBlueprintByRoutePath('/espacio/epicrisis');
    expect(blueprint).toBeDefined();
    const intent = resolveIntentFromBlueprint(blueprint!);
    expect(intent.level).toBe(4);
    expect(intent.intentId).toBe('clinical_form');
    expect(intent.primaryActionLabel).toBe(copy.forms.save);
  });

  it('resolveCicaTabLayoutActions — more tab quiet Auditoría', () => {
    const actions = resolveCicaTabLayoutActions('more', {
      onOpenPrescription: () => {},
      onOpenAuditSection: () => {},
      onPaperMode: () => {},
    });
    expect(actions[0]?.kind).toBe('primary');
    expect(actions[0]?.label).toBe(copy.chartModes.navMeds);
    const auditTrail = actions.find((a) => a.testId === 'epis2-chart-layout-audit-trail');
    expect(auditTrail?.label).toBe(copy.chartModes.navAudit);
  });

  it('resolveCicaTabLayoutActions — navAudit primaria consola', () => {
    const actions = resolveCicaTabLayoutActions(
      'more',
      { onOpenAuditConsole: () => {}, onPaperMode: () => {} },
      { activeSection: 'navAudit' },
    );
    expect(actions[0]?.kind).toBe('primary');
    expect(actions[0]?.label).toBe(copy.adminConsole.tabAudit);
    expect(actions[0]?.testId).toBe('epis2-chart-layout-audit');
  });

  it('resolveIntentFromTraditionalSection — navAudit nivel 5', () => {
    const intent = resolveIntentFromTraditionalSection('navAudit');
    expect(intent.level).toBe(5);
    expect(intent.intentId).toBe('audit');
    expect(intent.sectionLabel).toBe(copy.chartModes.navAudit);
  });

  it('resolvePaperModeIntent — modo papel', () => {
    const intent = resolvePaperModeIntent();
    expect(intent.intentId).toBe('paper_mode');
    expect(intent.sectionLabel).toBeTruthy();
  });
});
