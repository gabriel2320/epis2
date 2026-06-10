import type { DrugIntelPrice } from '@epis2/contracts';
import type { HttpClient } from '../http.js';

/**
 * Precios referenciales de medicamentos en Chile.
 *
 * Fuentes públicas estructuradas (sin scraping de farmacias retail):
 * - Tufarmacia.gob.cl (observatorio de precios MINSAL) — JSON.
 * - CENABAST — dataset CSV de precios adjudicados (datos.gob.cl o export).
 *
 * Todo precio sale marcado `referential: true` con fuente y fecha; nunca se
 * usa como precio transaccional.
 */

const TUFARMACIA_SEARCH_URL = 'https://www.tufarmacia.gob.cl/api/buscar';

export interface PriceEntry {
  productName: string;
  price: DrugIntelPrice;
}

/**
 * Parsea la respuesta JSON del buscador de Tufarmacia. Tolera dos formas:
 * un arreglo plano o `{ resultados: [...] }`, con claves `nombre`/`producto`
 * y `precio`/`precio_promedio` (number o string "$1.234").
 */
export function parseTufarmaciaJson(body: string, fetchedAt: string): PriceEntry[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return [];
  }
  const items = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { resultados?: unknown[] }).resultados)
      ? (parsed as { resultados: unknown[] }).resultados
      : [];

  const entries: PriceEntry[] = [];
  for (const item of items) {
    if (typeof item !== 'object' || item === null) continue;
    const record = item as Record<string, unknown>;
    const name = firstString(record, ['nombre', 'producto', 'nombre_producto']);
    const rawPrice = record['precio'] ?? record['precio_promedio'] ?? record['precioPromedio'];
    const amount = parseClpAmount(rawPrice);
    if (!name || amount === null) continue;
    entries.push({
      productName: name,
      price: {
        amountClp: amount,
        currency: 'CLP',
        source: 'tufarmacia.gob.cl (MINSAL)',
        fetchedAt,
        referential: true,
      },
    });
  }
  return entries;
}

/**
 * Parsea un dataset CSV de precios CENABAST. Columnas reconocidas:
 * producto/nombre, precio/precio_unitario.
 */
export function parseCenabastCsv(csv: string, fetchedAt: string): PriceEntry[] {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];
  const separator =
    (lines[0]!.match(/;/g)?.length ?? 0) >= (lines[0]!.match(/,/g)?.length ?? 0) ? ';' : ',';
  const headers = lines[0]!.split(separator).map((h) =>
    h
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim(),
  );
  const idxName = headers.findIndex((h) => h.includes('producto') || h.includes('nombre'));
  const idxPrice = headers.findIndex((h) => h.includes('precio'));
  if (idxName < 0 || idxPrice < 0) return [];

  const entries: PriceEntry[] = [];
  for (const line of lines.slice(1)) {
    const cells = line.split(separator);
    const name = cells[idxName]?.trim();
    const amount = parseClpAmount(cells[idxPrice]);
    if (!name || amount === null) continue;
    entries.push({
      productName: name,
      price: {
        amountClp: amount,
        currency: 'CLP',
        source: 'CENABAST',
        fetchedAt,
        referential: true,
      },
    });
  }
  return entries;
}

function firstString(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

/** Acepta number, "1234", "$1.234", "1.234,50" → pesos chilenos enteros. */
export function parseClpAmount(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return Math.round(value);
  }
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[^\d.,]/g, '');
  if (!cleaned) return null;
  // Formato chileno: '.' miles, ',' decimales.
  const normalized = cleaned.replace(/\./g, '').replace(/,/g, '.');
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount);
}

export interface PricesFetchResult {
  entries: PriceEntry[];
  sources: string[];
  failures: string[];
}

export async function fetchPriceData(
  http: HttpClient,
  options: { query: string; tufarmaciaUrl?: string; cenabastDatasetUrl?: string },
): Promise<PricesFetchResult> {
  const fetchedAt = new Date().toISOString();
  const entries: PriceEntry[] = [];
  const sources: string[] = [];
  const failures: string[] = [];

  const tufarmaciaUrl =
    options.tufarmaciaUrl ?? `${TUFARMACIA_SEARCH_URL}?q=${encodeURIComponent(options.query)}`;
  const tufarmaciaRes = await http.fetchText(tufarmaciaUrl);
  if (tufarmaciaRes.ok) {
    entries.push(...parseTufarmaciaJson(tufarmaciaRes.body, fetchedAt));
    sources.push(tufarmaciaUrl);
  } else {
    failures.push(`Tufarmacia: ${tufarmaciaRes.reason}`);
  }

  if (options.cenabastDatasetUrl) {
    const cenabastRes = await http.fetchText(options.cenabastDatasetUrl);
    if (cenabastRes.ok) {
      entries.push(...parseCenabastCsv(cenabastRes.body, fetchedAt));
      sources.push(options.cenabastDatasetUrl);
    } else {
      failures.push(`CENABAST: ${cenabastRes.reason}`);
    }
  }

  return { entries, sources, failures };
}
