import type { HttpClient } from '../http.js';

/**
 * OpenFDA drug labels API (fuente internacional, sin API key para volúmenes
 * bajos). Aporta warnings, reacciones adversas y dosificación de la etiqueta
 * FDA para correlacionar contra la información chilena.
 */

const OPENFDA_LABEL_URL = 'https://api.fda.gov/drug/label.json';

export interface OpenFdaLabel {
  genericName?: string;
  brandName?: string;
  boxedWarning?: string;
  warnings?: string;
  adverseReactions?: string;
  dosageAndAdministration?: string;
  sourceUrl: string;
}

interface OpenFdaResponse {
  results?: Array<{
    boxed_warning?: string[];
    warnings?: string[];
    warnings_and_cautions?: string[];
    adverse_reactions?: string[];
    dosage_and_administration?: string[];
    openfda?: { generic_name?: string[]; brand_name?: string[] };
  }>;
}

function firstText(values: string[] | undefined): string | undefined {
  const text = values?.[0]?.trim();
  return text ? text : undefined;
}

export function parseOpenFdaLabel(body: string, sourceUrl: string): OpenFdaLabel | null {
  let parsed: OpenFdaResponse;
  try {
    parsed = JSON.parse(body) as OpenFdaResponse;
  } catch {
    return null;
  }
  const result = parsed.results?.[0];
  if (!result) return null;
  const label: OpenFdaLabel = { sourceUrl };
  const genericName = firstText(result.openfda?.generic_name);
  const brandName = firstText(result.openfda?.brand_name);
  const boxedWarning = firstText(result.boxed_warning);
  const warnings = firstText(result.warnings) ?? firstText(result.warnings_and_cautions);
  const adverseReactions = firstText(result.adverse_reactions);
  const dosage = firstText(result.dosage_and_administration);
  if (genericName) label.genericName = genericName;
  if (brandName) label.brandName = brandName;
  if (boxedWarning) label.boxedWarning = boxedWarning;
  if (warnings) label.warnings = warnings;
  if (adverseReactions) label.adverseReactions = adverseReactions;
  if (dosage) label.dosageAndAdministration = dosage;
  return label;
}

export async function fetchOpenFdaLabel(
  http: HttpClient,
  activeIngredient: string,
): Promise<{ label: OpenFdaLabel | null; failure?: string }> {
  const search = `openfda.generic_name:"${activeIngredient}"`;
  const url = `${OPENFDA_LABEL_URL}?search=${encodeURIComponent(search)}&limit=1`;
  const res = await http.fetchText(url);
  if (!res.ok) {
    return { label: null, failure: `OpenFDA (${activeIngredient}): ${res.reason}` };
  }
  return { label: parseOpenFdaLabel(res.body, url) };
}
