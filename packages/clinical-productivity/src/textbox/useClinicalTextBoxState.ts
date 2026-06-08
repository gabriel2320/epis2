import { copy } from '@epis2/design-system';
import { useCallback, useEffect, useMemo, useRef, useState, type ClipboardEvent } from 'react';
import type { ChileClinicalTerm } from '../dictionaries/chileClinicalDictionary.js';
import { createTextOrigin, type ClinicalTextOrigin } from '../safety/textOrigin.js';
import {
  detectClinicalOmissions,
  formatSoapSuggestion,
  reformulateClinicalText,
  suggestSoapFromFreeText,
  type ClinicalTextboxAiAction,
} from './clinicalAiAssist.js';
import {
  autocompleteClinicalTerms,
  expandWhitelistedAbbreviation,
  isSensitiveClinicalToken,
} from './clinicalDictionary.js';
import {
  getLastLineToken,
  getTokenAtCursor,
  replaceTokenAtRange,
  type ActiveTextToken,
} from './clinicalTextToken.js';
import { expandClinicalSnippet } from './clinicalSnippets.js';
import { runClinicalSpellcheck, type ClinicalSpellIssue, type LanguageToolAdapter } from './clinicalSpellcheck.js';
import { applySlashCommand } from './clinicalTextCommands.js';
import { pastedTextLooksLikeAi, sanitizePastedClinicalText } from './pasteSanitizer.js';
import type { ClinicalTextBoxChangeMeta, ClinicalTextBoxPatientContext, ClinicalTextBoxProps } from './ClinicalTextBox.js';

export type ClinicalTextBoxAiAssistHandler = (
  action: ClinicalTextboxAiAction,
  text: string,
) => Promise<string | null>;

export type UseClinicalTextBoxStateOptions = ClinicalTextBoxProps & {
  spellcheckAdapter?: LanguageToolAdapter;
  onRequestAiAssist?: ClinicalTextBoxAiAssistHandler;
  /** Rich mode no expone cursor Tiptap — usa último token de línea. */
  richTokenMode?: boolean;
};

function buildPatientInsert(ctx?: ClinicalTextBoxPatientContext): string {
  if (!ctx) return '';
  const lines: string[] = [];
  if (ctx.displayName) lines.push(`Paciente: ${ctx.displayName}`);
  if (ctx.structuredSummary) {
    for (const [key, val] of Object.entries(ctx.structuredSummary)) {
      if (val.trim()) lines.push(`${key}: ${val}`);
    }
  }
  return lines.join('\n');
}

function buildMedicationInsert(meds?: readonly string[]): string {
  if (!meds?.length) return '';
  return `Medicamentos activos (confirmar):\n${meds.map((m) => `- ${m}`).join('\n')}`;
}

function buildLabsInsert(labs?: readonly string[]): string {
  if (!labs?.length) return '';
  return `Últimos exámenes (confirmar):\n${labs.map((l) => `- ${l}`).join('\n')}`;
}

export function useClinicalTextBoxState({
  value,
  onChange,
  disabled = false,
  patientContext,
  spellcheckAdapter,
  onRequestAiAssist,
  richTokenMode = false,
}: UseClinicalTextBoxStateOptions) {
  const [focused, setFocused] = useState(false);
  const [spellIssues, setSpellIssues] = useState<ClinicalSpellIssue[]>([]);
  const [hint, setHint] = useState<string | undefined>();
  const [lastOrigin, setLastOrigin] = useState<ClinicalTextOrigin | undefined>();
  const [confirmPending, setConfirmPending] = useState<string | undefined>();
  const [aiBusy, setAiBusy] = useState(false);
  const [cursorPos, setCursorPos] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const activeToken = useMemo((): ActiveTextToken | null => {
    if (!focused) return null;
    if (richTokenMode) return getLastLineToken(value);
    const pos = cursorPos ?? value.length;
    return getTokenAtCursor(value, pos);
  }, [cursorPos, focused, richTokenMode, value]);

  const termSuggestions = useMemo(() => {
    if (!activeToken || activeToken.token.length < 2) return [];
    return autocompleteClinicalTerms(activeToken.token, 5);
  }, [activeToken]);

  useEffect(() => {
    let cancelled = false;
    void runClinicalSpellcheck(value, spellcheckAdapter).then((issues) => {
      if (!cancelled) setSpellIssues(issues);
    });
    return () => {
      cancelled = true;
    };
  }, [value, spellcheckAdapter]);

  const emitChange = useCallback(
    (next: string, origin: ClinicalTextOrigin, extra?: Partial<ClinicalTextBoxChangeMeta>) => {
      setLastOrigin(origin);
      onChange(next, { origin, ...extra });
    },
    [onChange],
  );

  const syncCursorFromInput = () => {
    const el = inputRef.current;
    if (el) setCursorPos(el.selectionStart);
  };

  const handlePlainInput = (next: string) => {
    emitChange(next, createTextOrigin('manual', 'Teclado'));
    setHint(undefined);
    syncCursorFromInput();
  };

  const insertTermSuggestion = (term: ChileClinicalTerm) => {
    const insertText = term.formal ?? term.expansions?.[0] ?? term.term;
    if (term.category === 'medication' || term.category === 'unit') {
      setConfirmPending(insertText);
      return;
    }
    const token = activeToken;
    const next = token
      ? replaceTokenAtRange(value, token.start, token.end, insertText)
      : insertPlainText(insertText);
    emitChange(next, createTextOrigin('autocomplete', term.term));
    setHint(copy.clinicalProductivity.textBoxTermInserted);
  };

  const handleBlur = () => {
    setFocused(false);
    const lastToken = value.split('\n').pop()?.trim().split(/\s+/).pop() ?? '';
    const slash = lastToken ? applySlashCommand(value, lastToken) : undefined;
    if (slash) {
      emitChange(slash, createTextOrigin('snippet', 'Comando /'));
      setHint(copy.clinicalProductivity.textBoxSlashApplied);
      return;
    }
    const { expanded, snippet } = expandClinicalSnippet(value);
    if (snippet) {
      emitChange(expanded, createTextOrigin('snippet', snippet.trigger));
      setHint(copy.clinicalProductivity.snippetInserted.replace('{trigger}', snippet.trigger));
      return;
    }
    if (lastToken && !isSensitiveClinicalToken(lastToken)) {
      const formal = expandWhitelistedAbbreviation(lastToken);
      if (formal && formal.toLowerCase() !== lastToken.toLowerCase()) {
        const escaped = lastToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const next = value.replace(new RegExp(`${escaped}(?!\\w)`), formal);
        if (next !== value) {
          emitChange(next, createTextOrigin('autocomplete', `Abreviatura ${lastToken}`));
          setHint(copy.clinicalProductivity.textBoxAbbrevExpanded);
        }
      }
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const raw = event.clipboardData.getData('text/plain');
    const clean = sanitizePastedClinicalText(raw);
    const fromAi = pastedTextLooksLikeAi(raw);
    const origin = createTextOrigin(fromAi ? 'ai_suggestion' : 'paste', fromAi ? 'IA' : 'Portapapeles');
    const next = value ? `${value}\n${clean}` : clean;
    emitChange(next, origin, { aiSuggestion: fromAi });
    setHint(copy.clinicalProductivity.textBoxPasteClean);
  };

  const insertPlainText = (fragment: string) => {
    return value ? `${value}\n${fragment}` : fragment;
  };

  const insertBlock = (block: string, originLabel: string, needsConfirm?: boolean) => {
    if (!block) return;
    if (needsConfirm) {
      setConfirmPending(block);
      return;
    }
    emitChange(insertPlainText(block), createTextOrigin('autocomplete', originLabel));
  };

  const confirmPendingInsert = () => {
    if (!confirmPending) return;
    emitChange(insertPlainText(`\n\n${confirmPending}`), createTextOrigin('autocomplete', 'Inserción confirmada'), {
      pendingConfirmation: 'medication',
    });
    setConfirmPending(undefined);
  };

  const copyFragment = async (selection?: { start: number; end: number }) => {
    const el = inputRef.current;
    const fragment =
      selection && selection.start !== selection.end
        ? value.slice(selection.start, selection.end)
        : el && el.selectionStart !== el.selectionEnd
          ? value.slice(el.selectionStart, el.selectionEnd)
          : value;
    if (!fragment) return;
    try {
      await navigator.clipboard.writeText(fragment);
      setHint(copy.clinicalProductivity.textBoxCopy);
    } catch {
      /* noop tests */
    }
  };

  const applyAiSuggestion = (text: string) => {
    emitChange(text, createTextOrigin('ai_suggestion', 'Asistencia local'), { aiSuggestion: true });
  };

  const runAiAction = async (action: ClinicalTextboxAiAction, fallback: () => string) => {
    if (aiBusy || disabled) return;
    setAiBusy(true);
    try {
      const remote = onRequestAiAssist ? await onRequestAiAssist(action, value) : null;
      applyAiSuggestion(remote ?? fallback());
    } finally {
      setAiBusy(false);
    }
  };

  const pastePlainAtCursor = (raw: string) => {
    const clean = sanitizePastedClinicalText(raw);
    const fromAi = pastedTextLooksLikeAi(raw);
    const origin = createTextOrigin(fromAi ? 'ai_suggestion' : 'paste', fromAi ? 'IA' : 'Portapapeles');
    const next = value ? `${value}\n${clean}` : clean;
    emitChange(next, origin, { aiSuggestion: fromAi });
    setHint(copy.clinicalProductivity.textBoxPasteClean);
  };

  const sensitiveTokenVisible = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(-1)
    .some((token) => isSensitiveClinicalToken(token));

  return {
    focused,
    setFocused,
    spellIssues,
    hint,
    lastOrigin,
    confirmPending,
    aiBusy,
    inputRef,
    termSuggestions,
    insertTermSuggestion,
    syncCursorFromInput,
    sensitiveTokenVisible,
    handlePlainInput,
    handleBlur,
    handlePaste,
    insertBlock,
    confirmPendingInsert,
    copyFragment,
    pastePlainAtCursor,
    insertPlainText,
    emitChange,
    buildPatientInsert: () => buildPatientInsert(patientContext),
    buildMedicationInsert: () => buildMedicationInsert(patientContext?.activeMedications),
    buildLabsInsert: () => buildLabsInsert(patientContext?.recentLabs),
    onReformulate: () =>
      void runAiAction('reformulate', () => reformulateClinicalText(value)),
    onSoapConvert: () =>
      void runAiAction('soap', () => formatSoapSuggestion(suggestSoapFromFreeText(value))),
    onDetectOmissions: () => {
      const { omissions } = detectClinicalOmissions(value);
      if (omissions.length === 0) {
        setHint(copy.clinicalProductivity.textBoxNoOmissions);
        return;
      }
      setHint(`${copy.clinicalProductivity.textBoxDetectOmissions}: ${omissions.join(' · ')}`);
    },
    onInsertSnippet: (body: string, trigger: string) => {
      emitChange(insertPlainText(body), createTextOrigin('snippet', trigger));
      setHint(copy.clinicalProductivity.snippetInserted.replace('{trigger}', trigger));
    },
    onSlashCommand: (cmd: string) => {
      const hit = applySlashCommand(`${value}\n${cmd}`, cmd);
      if (hit) emitChange(hit, createTextOrigin('snippet', cmd));
    },
  };
}
