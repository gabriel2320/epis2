export {
  CLINICAL_SNIPPETS,
  expandClinicalSnippet,
  type ClinicalSnippetDef,
  type ClinicalSnippetScope,
} from '../snippets/clinicalSnippets.js';

import { CLINICAL_SNIPPETS } from '../snippets/clinicalSnippets.js';

/** Snippets expuestos en primera integración MF-CLINICAL-TEXTBOX-TOOLS. */
export const TEXTBOX_PRIMARY_SNIPPET_TRIGGERS = ['.soap', '.alta', '.uci'] as const;

export function getTextboxSnippetMenuItems() {
  return CLINICAL_SNIPPETS.filter((s) =>
    (TEXTBOX_PRIMARY_SNIPPET_TRIGGERS as readonly string[]).includes(s.trigger),
  );
}

export function insertSnippetBody(trigger: string): string | undefined {
  return CLINICAL_SNIPPETS.find((s) => s.trigger === trigger)?.body;
}
