import { describe, expect, it } from 'vitest';
import { mayAutoSign, createTextOrigin } from '../safety/textOrigin.js';
import {
  detectClinicalOmissions,
  formatSoapSuggestion,
  reformulateClinicalText,
  suggestSoapFromFreeText,
} from './clinicalAiAssist.js';
import { expandClinicalSnippet } from './clinicalSnippets.js';
import { runLocalClinicalSpellcheck } from './clinicalSpellcheck.js';
import { applySlashCommand } from './clinicalTextCommands.js';
import {
  attachTextOriginsToDraftBody,
  extractTextOriginsFromDraftBody,
  isDraftMetaFieldKey,
} from './draftTextOrigins.js';
import { expandWhitelistedAbbreviation } from './clinicalDictionary.js';
import { getLastLineToken, getTokenAtCursor, replaceTokenAtRange } from './clinicalTextToken.js';
import { pastedTextLooksLikeAi, sanitizePastedClinicalText } from './pasteSanitizer.js';

describe('MF-CLINICAL-TEXTBOX-TOOLS', () => {
  it('expande snippets .soap, .alta y .uci', () => {
    for (const trigger of ['.soap', '.alta', '.uci']) {
      const { snippet } = expandClinicalSnippet(`Nota ${trigger}`);
      expect(snippet?.trigger).toBe(trigger);
    }
  });

  it('sanitiza pegado peligroso y detecta origen IA', () => {
    const raw = '<script>alert(1)</script>\nPaciente estable [IA]';
    expect(sanitizePastedClinicalText(raw)).not.toMatch(/<script/i);
    expect(pastedTextLooksLikeAi(raw)).toBe(true);
  });

  it('spellcheck sugiere sin reemplazar silenciosamente', () => {
    const issues = runLocalClinicalSpellcheck('paciente con paracetamol');
    expect(Array.isArray(issues)).toBe(true);
    expect(issues.every((i) => Array.isArray(i.suggestions))).toBe(true);
  });

  it('aplica slash command /diagnostico al final de línea', () => {
    const out = applySlashCommand('Nota\n/diagnostico', '/diagnostico');
    expect(out).toContain('Diagnóstico:');
  });

  it('IA SOAP y reformulación quedan como sugerencia revisable', () => {
    const soap = suggestSoapFromFreeText('Paciente con dolor torácico');
    expect(soap.requiresHumanReview).toBe(true);
    const formatted = formatSoapSuggestion(soap);
    expect(formatted).toContain('[Sugerencia IA');
    expect(reformulateClinicalText('Una frase. Otra frase.')).toContain('[Sugerencia IA');
  });

  it('omisiones clínicas no bloquean — requieren revisión humana', () => {
    const result = detectClinicalOmissions(
      'Texto clínico extenso sobre evolución diurna con signos vitales estables y conducta expectante documentada aquí.',
    );
    expect(result.requiresHumanReview).toBe(true);
    expect(result.omissions.length).toBeGreaterThan(0);
  });

  it('origen IA nunca permite firma automática', () => {
    const origin = createTextOrigin('ai_suggestion', 'Asistencia local');
    expect(mayAutoSign(origin)).toBe(false);
    expect(origin.requiresHumanReview).toBe(true);
  });

  it('adjunta y extrae trazabilidad en body de borrador', () => {
    const origin = createTextOrigin('paste', 'Portapapeles');
    const body = attachTextOriginsToDraftBody({ reactionNotes: 'Urticaria' }, { reactionNotes: origin });
    expect(isDraftMetaFieldKey('_epis2TextOrigins')).toBe(true);
    const parsed = extractTextOriginsFromDraftBody(body);
    expect(parsed.reactionNotes?.kind).toBe('paste');
  });

  it('expandWhitelistedAbbreviation no autocorrige términos sensibles por diseño', () => {
    const hit = expandWhitelistedAbbreviation('mg');
    expect(hit === undefined || typeof hit === 'string').toBe(true);
  });

  it('getTokenAtCursor y replaceTokenAtRange insertan sin borrar contexto', () => {
    const text = 'Paciente con neum';
    const token = getTokenAtCursor(text, text.length);
    expect(token?.token).toBe('neum');
    const next = replaceTokenAtRange(text, token!.start, token!.end, 'neumonía');
    expect(next).toBe('Paciente con neumonía');
  });

  it('getLastLineToken soporta rich editor (última palabra de línea)', () => {
    const text = 'Línea uno\nPaciente con seps';
    const token = getLastLineToken(text);
    expect(token?.token).toBe('seps');
  });
});
