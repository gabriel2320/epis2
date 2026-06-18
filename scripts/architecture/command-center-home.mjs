import { walkSourceFiles } from './lib/scan-sources.mjs';

const FORBIDDEN_HOME_PATTERNS = [
  /dashboard\s*as\s*home/i,
  /home:\s*['"]\/dashboard/i,
  /defaultRoute.*dashboard/i,
  /epis-clinical-panel/i,
  /\/home\/epis-clinical-panel/,
  /ClinicalPanelHome/i,
  /DashboardHome/i,
];

const REQUIRED_HOME_MARKERS = [
  "'/espacio/buscar-paciente'",
  '"/espacio/buscar-paciente"',
  "'/app/buscar'",
  '"/app/buscar"',
  'EPIS2_CLINICAL_HOME',
  'epis2-census-command-bar',
];

export async function validate() {
  const details = [];
  let webRouterFound = false;
  let hasHomeMarker = false;

  for await (const { rel, content } of walkSourceFiles()) {
    if (!rel.startsWith('apps/web')) continue;
    if (rel.includes('routes/router')) {
      webRouterFound = true;
      if (REQUIRED_HOME_MARKERS.some((m) => content.includes(m))) {
        hasHomeMarker = true;
      }
    }
    for (const pattern of FORBIDDEN_HOME_PATTERNS) {
      if (pattern.test(content)) {
        details.push(`${rel} → home/dashboard legacy prohibido`);
      }
    }
    if (/path:\s*['"]\/['"].*dashboard|Navigate.*dashboard.*replace/i.test(content)) {
      details.push(`${rel} → redirección a dashboard como entrada`);
    }
    if (/path:\s*['"]\/dashboard['"]/i.test(content)) {
      details.push(`${rel} → ruta /dashboard prohibida como home`);
    }
  }

  if (webRouterFound && !hasHomeMarker) {
    details.push('apps/web router → falta home clínica /espacio/buscar-paciente (censo-first)');
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'Sin dashboard ni rutas legacy como home'
        : 'Home debe ser censo clínico, no dashboard',
    details,
  };
}
