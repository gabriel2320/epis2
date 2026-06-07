/**
 * UX-G02 — validación automatizada (API + registry).
 * Ejecutar: npm run quality:ux-g02
 */
import { buildApp } from '../../apps/api/src/app.js';
import { testApiConfig } from '../../apps/api/src/testConfig.js';
import {
  buildCommandSlotPrefill,
  buildContextClinicalPrefill,
  hasCommandSlotPrefill,
} from '@epis2/clinical-forms';
import { resolveCommand } from '@epis2/command-registry';
import { extractSlots } from '@epis2/command-registry';
import { DEMO_CLINICAL_CASES } from '@epis2/test-fixtures';

const DEMO_001 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-001');
if (!DEMO_001) throw new Error('DEMO-001 missing');

type StepResult = { id: string; pass: boolean; detail: string };

const results: StepResult[] = [];

function record(id: string, pass: boolean, detail: string) {
  results.push({ id, pass, detail });
  const mark = pass ? 'PASS' : 'FAIL';
  console.log(`[${mark}] ${id}: ${detail}`);
}

function hasCommandSlotSearchParams(search: Record<string, unknown>): boolean {
  const keys = [
    'patientHint',
    'medicationHint',
    'studyHint',
    'specialtyHint',
    'bodySiteHint',
    'clinicalReasonHint',
    'noteHint',
    'urgencyHint',
  ];
  return keys.some((key) => {
    const value = search[key];
    return typeof value === 'string' ? value.trim().length > 0 : value !== undefined;
  });
}

function stripCommandSlotsFromFormSearch(search: Record<string, string | undefined>) {
  return search.patientId ? { patientId: search.patientId } : {};
}

function formSearchFromCommandSlots(
  patientId: string,
  slots: ReturnType<typeof extractSlots>,
): Record<string, string | undefined> {
  const search: Record<string, string | undefined> = { patientId };
  if (slots.patientHint) search.patientHint = slots.patientHint;
  if (slots.medicationHint) search.medicationHint = slots.medicationHint;
  if (slots.studyHint) search.studyHint = slots.studyHint;
  if (slots.specialtyHint) search.specialtyHint = slots.specialtyHint;
  if (slots.bodySiteHint) search.bodySiteHint = slots.bodySiteHint;
  if (slots.clinicalReasonHint) search.clinicalReasonHint = slots.clinicalReasonHint;
  if (slots.noteHint) search.noteHint = slots.noteHint;
  if (slots.urgencyHint) search.urgencyHint = slots.urgencyHint;
  return search;
}

async function main() {
  const patientId = DEMO_001.patientId;
  const phraseImaging = 'pedir TAC de tórax';
  const phraseEvolution = 'hacer evolución';

  const app = await buildApp(testApiConfig);
  const login = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
  });
  record('1-2-prereq-login', login.statusCode === 200, `HTTP ${login.statusCode}`);

  const cookie = String(login.headers['set-cookie'] ?? '').split(';')[0];

  const resolve1 = await app.inject({
    method: 'POST',
    url: '/api/commands/resolve',
    headers: { cookie },
    payload: { text: phraseImaging, patientId },
  });
  const body1 = resolve1.json() as {
    status: string;
    intent?: string;
    routePath?: string;
    slots?: ReturnType<typeof extractSlots>;
  };
  record(
    '3-5-imaging-needs-confirmation',
    body1.status === 'needs_confirmation' && body1.intent === 'request_imaging',
    `${body1.status} intent=${body1.intent ?? '—'}`,
  );

  const slots = extractSlots(phraseImaging);
  record('4-slots-tac-torax', Boolean(slots.studyHint) && Boolean(slots.bodySiteHint), JSON.stringify(slots));

  const resolve2 = await app.inject({
    method: 'POST',
    url: '/api/commands/resolve',
    headers: { cookie },
    payload: { text: phraseImaging, patientId, confirmed: true },
  });
  const body2 = resolve2.json() as {
    status: string;
    routePath?: string;
    slots?: ReturnType<typeof extractSlots>;
  };
  record(
    '6-open-imaging-form',
    body2.status === 'resolved' && body2.routePath === '/espacio/imagenologia',
    `${body2.status} → ${body2.routePath ?? '—'}`,
  );

  const slotPayload = body2.slots ?? slots;
  const prefill = buildCommandSlotPrefill('imaging_request', slotPayload);
  record(
    '8-prefill-fields',
    prefill.modality === 'TC' && Boolean(prefill.studyDescription),
    JSON.stringify(prefill),
  );

  const search = formSearchFromCommandSlots(patientId, slotPayload);
  const cleaned = stripCommandSlotsFromFormSearch(search);
  record(
    '7-9-badge-and-url-clean',
    hasCommandSlotPrefill(slotPayload) &&
      hasCommandSlotSearchParams(search) &&
      !hasCommandSlotSearchParams(cleaned) &&
      cleaned.patientId === patientId,
    `before=${Object.keys(search).join(',')} after=${Object.keys(cleaned).join(',')}`,
  );

  const evo = resolveCommand({ text: phraseEvolution, role: 'physician', patientId });
  record(
    '12-13-evolution-active-patient',
    evo.status === 'resolved' &&
      evo.intent === 'create_evolution_draft' &&
      evo.routePath === '/espacio/evolucion',
    `${evo.status} → ${evo.status === 'resolved' ? evo.routePath : '—'}`,
  );

  const ctxPrefill = buildContextClinicalPrefill('evolution_note', DEMO_001.summaryFields);
  record(
    '14-context-soap-prefill',
    Boolean(ctxPrefill.objective) && Boolean(ctxPrefill.assessment) && Boolean(ctxPrefill.plan),
    Object.keys(ctxPrefill).join(', '),
  );

  record('C1-cancel-path', body1.status === 'needs_confirmation', 'UI cancel manual en /comando');

  await app.close();

  const failed = results.filter((r) => !r.pass);
  console.log('\n---');
  console.log(`UX-G02 automated: ${results.length - failed.length}/${results.length} PASS`);
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
