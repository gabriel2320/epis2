import { describe, expect, it } from 'vitest';
import {
  CLASSIC_CHART_PRIMARY_TAB_IDS,
  CLASSIC_CHART_TAB_IDS,
  defaultSectionForTab,
  tabForSection,
  visibleSectionsForCicaClassicTab,
  visibleSectionsForTab,
} from './classicChartTabConfig.js';
import { TRADITIONAL_SECTION_IDS } from './TraditionalSectionNav.js';

describe('classicChartTabConfig', () => {
  it('cada sección legacy pertenece a un tab', () => {
    for (const section of TRADITIONAL_SECTION_IDS) {
      expect(CLASSIC_CHART_TAB_IDS).toContain(tabForSection(section));
    }
  });

  it('defaultSectionForTab devuelve navSummary para summary', () => {
    expect(defaultSectionForTab('summary')).toBe('navSummary');
  });

  it('visibleSectionsForTab filtra por demo', () => {
    const visible = visibleSectionsForTab('summary', ['navSummary', 'navAdmin']);
    expect(visible).toEqual(['navSummary', 'navAdmin']);
  });

  it('navMeds pertenece al tab Más', () => {
    expect(tabForSection('navMeds')).toBe('more');
  });

  it('visibleSectionsForCicaClassicTab — una sección primaria por tab', () => {
    const all = [...TRADITIONAL_SECTION_IDS];
    expect(visibleSectionsForCicaClassicTab('evolutions', all)).toEqual(['navEvolution']);
    expect(visibleSectionsForCicaClassicTab('summary', all)).toEqual(['navSummary']);
    expect(visibleSectionsForCicaClassicTab('documents', all)).toEqual(['navDocuments']);
  });

  it('expone 5 tabs primarios + Más', () => {
    expect(CLASSIC_CHART_PRIMARY_TAB_IDS).toHaveLength(5);
    expect(CLASSIC_CHART_TAB_IDS).toContain('more');
  });
});
