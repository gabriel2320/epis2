import type { HttpClient } from '../http.js';

/**
 * RxNorm / RxNav (NLM) — normalización internacional del principio activo y
 * clasificación ATC. API pública sin key.
 */

const RXNAV_BASE = 'https://rxnav.nlm.nih.gov/REST';

export interface RxNormResult {
  rxcui?: string;
  atcCodes: string[];
  sources: string[];
  failures: string[];
}

export function parseRxcuiResponse(body: string): string | null {
  try {
    const parsed = JSON.parse(body) as { idGroup?: { rxnormId?: string[] } };
    return parsed.idGroup?.rxnormId?.[0] ?? null;
  } catch {
    return null;
  }
}

export function parseAtcClassResponse(body: string): string[] {
  try {
    const parsed = JSON.parse(body) as {
      rxclassDrugInfoList?: {
        rxclassDrugInfo?: Array<{
          rxclassMinConceptItem?: { classId?: string; classType?: string };
        }>;
      };
    };
    const infos = parsed.rxclassDrugInfoList?.rxclassDrugInfo ?? [];
    const codes = infos
      .map((info) => info.rxclassMinConceptItem)
      .filter((item) => item?.classType === 'ATC1-4' || item?.classType === 'ATC')
      .map((item) => item!.classId!)
      .filter((id): id is string => Boolean(id));
    return [...new Set(codes)];
  } catch {
    return [];
  }
}

export async function fetchRxNormData(
  http: HttpClient,
  activeIngredient: string,
): Promise<RxNormResult> {
  const result: RxNormResult = { atcCodes: [], sources: [], failures: [] };

  const rxcuiUrl = `${RXNAV_BASE}/rxcui.json?name=${encodeURIComponent(activeIngredient)}&search=2`;
  const rxcuiRes = await http.fetchText(rxcuiUrl);
  if (!rxcuiRes.ok) {
    result.failures.push(`RxNorm rxcui (${activeIngredient}): ${rxcuiRes.reason}`);
    return result;
  }
  result.sources.push(rxcuiUrl);
  const rxcui = parseRxcuiResponse(rxcuiRes.body);
  if (!rxcui) return result;
  result.rxcui = rxcui;

  const atcUrl = `${RXNAV_BASE}/rxclass/class/byRxcui.json?rxcui=${encodeURIComponent(rxcui)}&relaSource=ATC`;
  const atcRes = await http.fetchText(atcUrl);
  if (!atcRes.ok) {
    result.failures.push(`RxNorm ATC (${activeIngredient}): ${atcRes.reason}`);
    return result;
  }
  result.sources.push(atcUrl);
  result.atcCodes = parseAtcClassResponse(atcRes.body);
  return result;
}
