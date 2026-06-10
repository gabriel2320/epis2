import type { ClinicalIntent } from '@epis2/command-registry';

/** Episodio narrativo piloto — capa de presentación (UX-A.4); datos clínicos siguen en DEMO-00x. */
export type DemoNarrativeEpisode = {
  id: 'iam' | 'ic-cardiology' | 'severe-pneumonia' | 'diabetic-foot' | 'bacteremia';
  demoCaseCode: string;
  titleEs: string;
  oneLinerEs: string;
  settingEs: string;
  suggestedCommandEs: string;
  intent: ClinicalIntent;
};

export const DEMO_NARRATIVE_EPISODES: readonly DemoNarrativeEpisode[] = [
  {
    id: 'iam',
    demoCaseCode: 'DEMO-001',
    titleEs: 'IAM en evaluación',
    oneLinerEs: 'Dolor torácico en paciente con HTA — troponinas y ECG (demo).',
    settingEs: 'Urgencia / medicina interna',
    suggestedCommandEs: 'solicitar tac',
    intent: 'request_imaging',
  },
  {
    id: 'ic-cardiology',
    demoCaseCode: 'DEMO-005',
    titleEs: 'Interconsulta cardiología',
    oneLinerEs: 'FA descompensada — optimización y derivación (demo).',
    settingEs: 'Hospitalización',
    suggestedCommandEs: 'hacer interconsulta cardiologia',
    intent: 'request_referral',
  },
  {
    id: 'severe-pneumonia',
    demoCaseCode: 'DEMO-004',
    titleEs: 'Neumonía grave',
    oneLinerEs: 'Postoperatorio con sospecha respiratoria — antibiótico y evolución (demo).',
    settingEs: 'Hospitalización',
    suggestedCommandEs: 'crear evolucion',
    intent: 'create_evolution_draft',
  },
  {
    id: 'diabetic-foot',
    demoCaseCode: 'DEMO-002',
    titleEs: 'Pie diabético',
    oneLinerEs: 'Control de úlcera y DM2 — consulta ambulatoria (demo).',
    settingEs: 'Ambulatorio',
    suggestedCommandEs: 'consulta ambulatoria',
    intent: 'create_outpatient_visit',
  },
  {
    id: 'bacteremia',
    demoCaseCode: 'DEMO-005',
    titleEs: 'Bacteriemia',
    oneLinerEs: 'Fiebre + hemocultivos — ceftriaxona y alergia a penicilina (demo).',
    settingEs: 'Hospitalización / infectología',
    suggestedCommandEs: 'abrir farmacia',
    intent: 'prepare_pharmacy_review',
  },
] as const;

export function getDemoNarrativeById(
  id: DemoNarrativeEpisode['id'],
): DemoNarrativeEpisode | undefined {
  return DEMO_NARRATIVE_EPISODES.find((e) => e.id === id);
}

/** Episodio principal mostrado en listas cuando un código demo tiene más de un relato piloto. */
export function getPrimaryNarrativeForDemoCode(
  demoCaseCode: string,
): DemoNarrativeEpisode | undefined {
  return DEMO_NARRATIVE_EPISODES.find((e) => e.demoCaseCode === demoCaseCode);
}

export function assertDemoNarrativesInvariants(): string[] {
  const errors: string[] = [];
  if (DEMO_NARRATIVE_EPISODES.length !== 5) {
    errors.push('Se requieren exactamente 5 episodios narrativos piloto');
  }
  const ids = new Set<string>();
  for (const episode of DEMO_NARRATIVE_EPISODES) {
    if (ids.has(episode.id)) errors.push(`Episodio duplicado: ${episode.id}`);
    ids.add(episode.id);
    if (!/^DEMO-00[1-5]$/.test(episode.demoCaseCode)) {
      errors.push(`Código demo inválido en episodio ${episode.id}`);
    }
    if (!episode.suggestedCommandEs.trim()) {
      errors.push(`Comando sugerido vacío en ${episode.id}`);
    }
  }
  return errors;
}
