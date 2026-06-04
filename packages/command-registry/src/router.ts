import { isClinicalRole, roleHasPermission } from '@epis2/clinical-domain';
import { AMBIGUOUS_PHRASES } from './definitions.js';
import { normalizeCommandText } from './normalize.js';
import {
  pickBestFromRanked,
  rankCommandDefinitions,
  topClarificationCandidates,
} from './rank.js';
import { extractSlots } from './slots.js';
import type { CommandResolveInput, CommandResolveResult } from './types.js';

export function resolveCommand(input: CommandResolveInput): CommandResolveResult {
  const text = input.text.trim();
  if (!text) {
    return {
      status: 'empty',
      message: 'Escribe qué necesitas hacer para continuar.',
    };
  }

  if (!isClinicalRole(input.role) || !roleHasPermission(input.role, 'command.execute')) {
    return {
      status: 'forbidden',
      message: 'Tu rol no puede ejecutar comandos clínicos.',
      permission: 'command.execute',
    };
  }

  const normalized = normalizeCommandText(text);
  const ranked = rankCommandDefinitions(text);

  if (AMBIGUOUS_PHRASES.some((p) => normalizeCommandText(p) === normalized)) {
    return {
      status: 'needs_clarification',
      message: 'El comando es ambiguo. Elige una acción más específica.',
      candidates: topClarificationCandidates(ranked),
    };
  }

  const best = pickBestFromRanked(ranked);

  if (!best) {
    if (ranked.length > 1) {
      return {
        status: 'needs_clarification',
        message: 'El comando es ambiguo. Elige una acción más específica.',
        candidates: topClarificationCandidates(ranked),
      };
    }
    return {
      status: 'needs_clarification',
      message:
        'No reconocimos el comando. Prueba con buscar, resumir, evolucionar, epicrisis, receta o laboratorio.',
      candidates: [],
    };
  }

  const role = input.role;
  if (!roleHasPermission(role, best.requiredPermission)) {
    return {
      status: 'forbidden',
      message: 'Tu rol no puede ejecutar este comando.',
      permission: best.requiredPermission,
    };
  }

  if (best.requiresPatient && !input.patientId) {
    return {
      status: 'needs_patient',
      message: 'Selecciona o busca un paciente antes de continuar.',
      intent: best.intent,
      labelEs: best.labelEs,
    };
  }

  return {
    status: 'resolved',
    intent: best.intent,
    labelEs: best.labelEs,
    routePath: best.routePath,
    slots: extractSlots(text),
  };
}
