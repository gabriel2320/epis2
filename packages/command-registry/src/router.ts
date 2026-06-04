import { isClinicalRole, roleHasPermission } from '@epis2/clinical-domain';
import { AMBIGUOUS_PHRASES } from './definitions.js';
import { EPIS_DISAMBIGUATION_RULES } from './epis-disambiguation.js';
import { isEpisOutOfScopePhrase } from './epis-out-of-scope.js';
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

  if (!isClinicalRole(input.role)) {
    return {
      status: 'forbidden',
      message: 'Tu rol no puede ejecutar comandos clínicos.',
      permission: 'command.execute',
    };
  }

  const normalized = normalizeCommandText(text);

  if (isEpisOutOfScopePhrase(normalized)) {
    return {
      status: 'needs_clarification',
      message:
        'Esa acción no está disponible en el MVP. Prueba buscar, resumir, evolucionar, epicrisis, receta o laboratorio.',
      candidates: [],
    };
  }

  const ranked = rankCommandDefinitions(text);

  for (const rule of EPIS_DISAMBIGUATION_RULES) {
    if (rule.matches(normalized)) {
      const hinted = ranked.filter((r) =>
        rule.intentHints.includes(r.def.intent),
      );
      return {
        status: 'needs_clarification',
        message: rule.message,
        candidates: topClarificationCandidates(
          hinted.length > 0 ? hinted : ranked,
        ),
      };
    }
  }

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
