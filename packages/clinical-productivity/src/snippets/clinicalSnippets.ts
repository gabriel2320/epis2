import type { ClinicalTextOriginKind } from '../safety/textOrigin.js';

export type ClinicalSnippetScope = 'personal' | 'institutional' | 'service' | 'specialty';

export type ClinicalSnippetDef = {
  trigger: string;
  title: string;
  body: string;
  scope: ClinicalSnippetScope;
  originKind: ClinicalTextOriginKind;
};

export const CLINICAL_SNIPPETS: readonly ClinicalSnippetDef[] = [
  {
    trigger: '.iaas',
    title: 'Nota IAAS',
    body: 'Evento asociado a asistencia:\nFecha:\nDispositivo/procedimiento:\nGermen:\nMedidas:',
    scope: 'specialty',
    originKind: 'snippet',
  },
  {
    trigger: '.alta',
    title: 'Indicaciones al alta',
    body: 'Diagnóstico principal:\nEvolución resumida:\nTratamiento al alta:\nControles:\nSignos de alarma:',
    scope: 'institutional',
    originKind: 'snippet',
  },
  {
    trigger: '.soap',
    title: 'Consulta SOAP',
    body: 'S:\nO:\nA:\nP:\n',
    scope: 'institutional',
    originKind: 'snippet',
  },
  {
    trigger: '.evolucion',
    title: 'Evolución diaria',
    body: 'Paciente estable durante guardia. Sin nuevos síntomas. Plan: continuar tratamiento y reevaluar.',
    scope: 'institutional',
    originKind: 'snippet',
  },
  {
    trigger: '.uci',
    title: 'Nota UCI',
    body: 'Paciente en UCI. Soporte ventilatorio según plan. Balance hídrico y signos vitales en registro.',
    scope: 'service',
    originKind: 'snippet',
  },
  {
    trigger: '.epicrisis',
    title: 'Epicrisis',
    body: 'Resumen de hospitalización:\nMotivo:\nEvolución:\nAlta/traslado:\nIndicaciones:',
    scope: 'institutional',
    originKind: 'snippet',
  },
  {
    trigger: '.interconsulta',
    title: 'Interconsulta',
    body: 'Motivo de interconsulta:\nAntecedentes relevantes:\nPregunta clínica:',
    scope: 'institutional',
    originKind: 'snippet',
  },
];

export function expandClinicalSnippet(text: string): {
  expanded: string;
  snippet?: ClinicalSnippetDef;
} {
  const trimmed = text.trimEnd();
  const hit = CLINICAL_SNIPPETS.find((s) => trimmed.endsWith(s.trigger));
  if (!hit) return { expanded: text };
  return {
    expanded: `${trimmed.slice(0, -hit.trigger.length)}${hit.body}`,
    snippet: hit,
  };
}
