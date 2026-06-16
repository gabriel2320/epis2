import type {
  DemoChartDemoSectionId,
  DemoChartPrioritySectionId,
  DemoChartSectionRow,
  DemoClinicalCaseRef,
  DemoNarrativeEpisode,
} from './demoFixtureTypes.js';

export type {
  DemoChartDemoSectionId,
  DemoChartPrioritySectionId,
  DemoChartSectionRow,
  DemoClinicalCaseRef,
  DemoNarrativeEpisode,
} from './demoFixtureTypes.js';

type FixturesModule = typeof import('@epis2/test-fixtures');

let fixtures: FixturesModule | null = null;
let loadPromise: Promise<void> | null = null;

function allowDevFixtures(): boolean {
  if (import.meta.env.DEV) return true;
  return import.meta.env.VITE_EPIS2_LOAD_DEV_FIXTURES === 'true';
}

/** Dev / CI preview only — production deploys never load @epis2/test-fixtures (RH-06). */
export async function initDevFixtures(): Promise<void> {
  if (!allowDevFixtures()) return;
  if (fixtures) return;
  if (!loadPromise) {
    loadPromise = import('@epis2/test-fixtures').then((mod) => {
      fixtures = mod;
    });
  }
  await loadPromise;
}

function fx(): FixturesModule | null {
  return allowDevFixtures() ? fixtures : null;
}

function toDemoCaseRef(
  demo: NonNullable<ReturnType<FixturesModule['getDemoCaseByPatientId']>>,
): DemoClinicalCaseRef {
  return {
    patientId: demo.patientId,
    demoCaseCode: demo.demoCaseCode,
    displayName: demo.displayName,
    birthDate: demo.birthDate,
    scenario: demo.scenario,
    sex: demo.sex,
  };
}

export function getDemoCaseByPatientId(patientId: string): DemoClinicalCaseRef | undefined {
  const demo = fx()?.getDemoCaseByPatientId(patientId);
  return demo ? toDemoCaseRef(demo) : undefined;
}

export function getDemoCaseByCode(code: string): DemoClinicalCaseRef | undefined {
  const demo = fx()?.getDemoCaseByCode(code);
  return demo ? toDemoCaseRef(demo) : undefined;
}

export function getDemoChartSectionRows(
  demoCaseCode: string | undefined,
  sectionId: DemoChartPrioritySectionId,
): readonly DemoChartSectionRow[] {
  return fx()?.getDemoChartSectionRows(demoCaseCode, sectionId) ?? [];
}

export function getDemoChartDemoSectionRows(
  demoCaseCode: string | undefined,
  sectionId: DemoChartDemoSectionId,
): readonly DemoChartSectionRow[] {
  return (
    fx()?.getDemoChartDemoSectionRows(
      demoCaseCode,
      sectionId as Parameters<FixturesModule['getDemoChartDemoSectionRows']>[1],
    ) ?? []
  );
}

export function hasDemoTraditionalSectionContent(
  demoCaseCode: string | undefined,
  sectionId: string,
): boolean {
  const mod = fx();
  if (mod) return mod.hasDemoTraditionalSectionContent(demoCaseCode, sectionId);
  if (!demoCaseCode) return true;
  return sectionId === 'navSummary';
}

export function listDemoNarrativeEpisodes(): readonly DemoNarrativeEpisode[] {
  return fx()?.DEMO_NARRATIVE_EPISODES ?? [];
}

export function getDemoNarrativeById(
  id: DemoNarrativeEpisode['id'],
): DemoNarrativeEpisode | undefined {
  return fx()?.getDemoNarrativeById(id);
}

export function getPrimaryNarrativeForDemoCode(
  demoCaseCode: string | undefined,
): DemoNarrativeEpisode | undefined {
  if (!demoCaseCode) return undefined;
  return fx()?.getPrimaryNarrativeForDemoCode(demoCaseCode);
}
