export {
  CLINICAL_SNIPPETS,
  expandClinicalSnippet,
  type ClinicalSnippetDef,
  type ClinicalSnippetScope,
} from '../snippets/clinicalSnippets.js';

import { CLINICAL_SNIPPETS } from '../snippets/clinicalSnippets.js';

/** Snippets expuestos en primera integración MF-CLINICAL-TEXTBOX-TOOLS. */
export const TEXTBOX_PRIMARY_SNIPPET_TRIGGERS = ['.soap', '.alta', '.uci'] as const;

/** Snippets adicionales en menú ⋯ — spec MF-CLINICAL-TEXTBOX-TOOLS. */
export const TEXTBOX_EXTENDED_SNIPPET_TRIGGERS = ['.epicrisis', '.iaas'] as const;

export function getTextboxSnippetMenuItems() {
  const allowed = [
    ...TEXTBOX_PRIMARY_SNIPPET_TRIGGERS,
    ...TEXTBOX_EXTENDED_SNIPPET_TRIGGERS,
  ] as readonly string[];
  return CLINICAL_SNIPPETS.filter((s) => allowed.includes(s.trigger));
}

export function insertSnippetBody(trigger: string): string | undefined {
  return CLINICAL_SNIPPETS.find((s) => s.trigger === trigger)?.body;
}
