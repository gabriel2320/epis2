import { WIDGET_CONTEXT_REQUIREMENTS } from '../contracts/widget-context.js';
import { WIDGET_ACTION_KINDS, WIDGET_CATEGORIES, type WidgetDefinition } from '../contracts/widget-definition.js';
import { WIDGET_STATE_KINDS } from '../contracts/widget-state.js';

/** Palabras inglesas prohibidas en copy visible (no coincidir con español legítimo). */
const ENGLISH_VISIBLE_RE =
  /\b(loading\.\.\.|click here|submit|save draft|dashboard home|forbidden)\b/i;

const TECHNICAL_TERMS_RE =
  /\b(API|JSON|SQL|PostgreSQL|Ollama|OpenMRS|Carbon|registry v2|endpoint)\b/i;

const FORBIDDEN_DIRECT_ACTION_RE =
  /\b(approve|sign|auto-?approve|writeToDatabase|executeClinical|insertInto)\b/i;

export type WidgetGateResult = {
  ok: boolean;
  details: string[];
};

export function validateWidgetDefinition(widget: WidgetDefinition): WidgetGateResult {
  const details: string[] = [];

  if (!widget.id?.trim()) details.push(`${widget.id || '(sin id)'}: falta id`);
  if (!widget.label?.trim()) details.push(`${widget.id}: falta label`);
  if (!widget.description?.trim()) details.push(`${widget.id}: falta description`);
  if (!widget.allowedRoles?.length) details.push(`${widget.id}: debe declarar allowedRoles`);
  if (!widget.requiredContext?.length) details.push(`${widget.id}: debe declarar requiredContext`);

  for (const req of widget.requiredContext) {
    if (!(WIDGET_CONTEXT_REQUIREMENTS as readonly string[]).includes(req)) {
      details.push(`${widget.id}: contexto inválido ${req}`);
    }
  }

  if (!(WIDGET_CATEGORIES as readonly string[]).includes(widget.category)) {
    details.push(`${widget.id}: categoría inválida`);
  }

  if (widget.category === 'dashboard' && widget.id === 'command-center-home') {
    details.push(`${widget.id}: el tablero no puede ser home`);
  }

  for (const state of WIDGET_STATE_KINDS) {
    if (!widget.supportedStates.includes(state)) {
      details.push(`${widget.id}: falta estado obligatorio ${state}`);
    }
  }

  for (const action of widget.actions) {
    if (!(WIDGET_ACTION_KINDS as readonly string[]).includes(action.kind)) {
      details.push(`${widget.id}: acción clínica directa prohibida (${action.kind})`);
    }
    if (action.kind === 'navigate' && !action.route?.trim()) {
      details.push(`${widget.id}: acción navigate requiere route`);
    }
    if (action.kind === 'command' && !action.command?.trim()) {
      details.push(`${widget.id}: acción command requiere command`);
    }
    if (FORBIDDEN_DIRECT_ACTION_RE.test(action.label)) {
      details.push(`${widget.id}: acción con verbo clínico directo prohibido`);
    }
  }

  if (widget.aiMode === 'assist-only' && !widget.copy.aiDisclosure?.trim()) {
    details.push(`${widget.id}: widget IA debe declarar aiDisclosure`);
  }

  const copyBlob = Object.values(widget.copy).filter(Boolean).join(' ');
  if (ENGLISH_VISIBLE_RE.test(copyBlob)) {
    details.push(`${widget.id}: copy visible en inglés`);
  }
  if (TECHNICAL_TERMS_RE.test(copyBlob) || TECHNICAL_TERMS_RE.test(widget.description)) {
    details.push(`${widget.id}: términos técnicos en copy visible`);
  }

  if (widget.dataSource === 'api' && widget.aiMode !== 'none' && widget.aiMode !== 'optional-offline') {
    details.push(`${widget.id}: widget IA debe soportar optional-offline`);
  }

  return { ok: details.length === 0, details };
}

export function validateWidgetRegistry(definitions: readonly WidgetDefinition[]): WidgetGateResult {
  const details: string[] = [];
  const ids = new Set<string>();

  for (const widget of definitions) {
    if (ids.has(widget.id)) {
      details.push(`id duplicado: ${widget.id}`);
    }
    ids.add(widget.id);

    const gate = validateWidgetDefinition(widget);
    if (!gate.ok) details.push(...gate.details);
  }

  return { ok: details.length === 0, details };
}
