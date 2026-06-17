/**
 * Catálogo de subagentes de desarrollo EPIS2.
 * Ver docs/product/EPIS2_DEV_SUBAGENTS.md · exclusiones: docs/archive/AGENT_SCOPE_EXCLUSIONS.md
 */

/** Subagentes congelados — no regenerar prompt ni usar como primario salvo EPIS2_ALLOW_ARCHIVED_SCOPE=1 */
export const ARCHIVED_SUBAGENT_IDS = new Set([
  'tramo-implementer',
  'm3-guardian',
  'layers-integrator',
  'ci-parity',
]);

export const DEV_SUBAGENTS = {
  'tramo-implementer': {
    id: 'tramo-implementer',
    title: 'Implementador de tramo',
    archived: true,
    archiveReason: 'Tramos A–K congelados — ver docs/archive/ARCHIVED_PROGRAMS_INDEX.md',
    triggers: ['MF-TRAMO-*', 'scaffold IDC', 'panel demo tramo'],
    gates: ['quality:tramos-hygiene-gate', 'npm run check'],
    canon: [
      'docs/PRODUCT_CANON.md',
      'docs/product/PRODUCT_INVARIANTS.md',
      'docs/product/EPIS2_TRAMO_SCAFFOLD_CANON.md',
    ],
  },
  'layers-integrator': {
    id: 'layers-integrator',
    title: 'Integrador capas L3+L4+L5',
    archived: true,
    archiveReason: 'Ola RAD/M3 superseded por CICA clean room',
    triggers: [
      'MF-RAD-M3',
      'MF-CLINICAL-PRODUCTIVITY',
      'dashboard tab',
      'EpisRadDashboardTabShell',
    ],
    gates: ['quality:layers-integration-gate', 'quality:ui-simplify-gate'],
    canon: ['docs/product/EPIS2_UI_LAYERS.md', 'docs/product/EPIS2_GLOBAL_DEV_PLAN.md'],
  },
  'golden-guardian': {
    id: 'golden-guardian',
    title: 'Guardián Golden Journey',
    triggers: ['journey', 'e2e', 'golden-clinical-journey'],
    gates: ['npm run quality:golden-journey', 'test:e2e:ux-g02'],
    canon: ['docs/quality/GOLDEN_CLINICAL_JOURNEY.md'],
  },
  'm3-guardian': {
    id: 'm3-guardian',
    title: 'Guardián M3 / densidad UI',
    archived: true,
    archiveReason: 'Ola M3 superseded por CICA — no expandir densidad legacy',
    triggers: ['apps/web UI', 'MF-UI-SIMPLIFY', 'scaffold M3'],
    gates: ['quality:ui-simplify-gate', 'quality:rad-m3-discipline-gate'],
    canon: ['docs/design/M3_ADOPTION_PLAN.md', 'docs/quality/M3_ANTI_DRIFT_GATES.md'],
  },
  'ollama-clinical': {
    id: 'ollama-clinical',
    title: 'IA clínica local (Ollama producto)',
    triggers: ['assist', 'blueprint', 'local-ai', 'RAG'],
    gates: ['quality:ollama-structured-output-gate', 'npm run ai:evals:live'],
    canon: [
      'docs/intelligence/EPIS2_OLLAMA_CAPABILITY_PLAN.md',
      'docs/product/EPIS2_AI_TRAMO_EVALS.md',
    ],
  },
  'ollama-dev-writer': {
    id: 'ollama-dev-writer',
    title: 'Escritor dev bajo riesgo (Ollama)',
    triggers: ['reporte sesión', 'documentación', 'dev:agent:ollama-write', 'reports/'],
    gates: ['quality:dev-agent-low-risk-write-gate', 'npm run dev:agent:ollama-write'],
    canon: [
      'docs/product/EPIS2_DEV_AGENT_LOW_RISK_WRITE.md',
      'docs/product/EPIS2_DEV_AGENT_ORCHESTRATION.md',
    ],
  },
  'gate-runner': {
    id: 'gate-runner',
    title: 'Ejecutor de gates',
    triggers: ['cierre sesión', 'pre-push', 'quality gate'],
    gates: [
      'npm run check',
      'npm run test',
      'npm run db:validate',
      'quality:case-intel-catalog-gate',
    ],
    canon: ['AGENTS.md'],
  },
  'ledger-keeper': {
    id: 'ledger-keeper',
    title: 'Ledger microfases',
    triggers: ['MF-*', 'microphase', 'cierre MF'],
    gates: ['npm run quality:microphases', 'npm run quality:microphase-next'],
    canon: ['docs/quality/MICROPHASE_PROGRAM.md', 'docs/quality/microphase-ledger.json'],
  },
  'ci-parity': {
    id: 'ci-parity',
    title: 'Paridad CI local',
    archived: true,
    archiveReason: 'Dev-automation weeks archivados — usar quality:required/nightly',
    triggers: ['CI', 'integración Postgres', 'pre-PR'],
    gates: ['npm run quality:local-ci', 'npm run quality:ci-parity'],
    canon: ['reports/archive/2026-06/epis2-dev-automation-week1-2026-06-07.md'],
  },
};

/** Secuencia recomendada — CICA / consolidación post-rc3. */
export const PHASE_SUBAGENT_SEQUENCE = {
  cica: ['golden-guardian', 'ollama-dev-writer', 'gate-runner'],
  default: ['golden-guardian', 'gate-runner', 'ollama-dev-writer'],
  /** @deprecated — require EPIS2_ALLOW_ARCHIVED_SCOPE=1 */
  A: ['m3-guardian', 'gate-runner'],
  B: ['layers-integrator', 'golden-guardian', 'gate-runner'],
  tramo: ['tramo-implementer', 'golden-guardian', 'gate-runner'],
};

export function listSubagentIds({ includeArchived = false } = {}) {
  return Object.keys(DEV_SUBAGENTS).filter(
    (id) => includeArchived || !ARCHIVED_SUBAGENT_IDS.has(id),
  );
}

export function resolveSubagentSequence({ phase, tramo }) {
  if (tramo && process.env.EPIS2_ALLOW_ARCHIVED_SCOPE === '1') {
    return PHASE_SUBAGENT_SEQUENCE.tramo;
  }
  if (phase === 'cica' || phase === 'CICA') return PHASE_SUBAGENT_SEQUENCE.cica;
  if (phase && PHASE_SUBAGENT_SEQUENCE[phase] && process.env.EPIS2_ALLOW_ARCHIVED_SCOPE === '1') {
    return PHASE_SUBAGENT_SEQUENCE[phase];
  }
  return PHASE_SUBAGENT_SEQUENCE.default;
}
