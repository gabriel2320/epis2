import type { HttpClient } from '../http.js';
import type { PriceEntry } from './prices.js';
import { parseClpAmount } from './prices.js';

/**
 * Precios referenciales de las principales cadenas de venta a público en
 * Chile: Salcobrand, Farmacias Ahumada y Cruz Verde.
 *
 * Cada cadena expone el backend que consume su propio sitio público:
 * - Salcobrand: Algolia (app `GM3RP06HJG`, API key search-only que el sitio
 *   entrega a todo navegador; restringida por Referer → se envía
 *   `Origin/Referer: salcobrand.cl`).
 * - Cruz Verde: API headless SFCC (`api.cruzverde.cl`) — login anónimo que
 *   entrega cookie de sesión y luego búsqueda JSON.
 * - Ahumada: storefront SFCC (Demandware) — endpoint de sugerencias que
 *   devuelve un fragmento HTML con nombre y precio.
 *
 * Son endpoints internos sin contrato público: pueden cambiar sin aviso.
 * Por eso cada adaptador degrada a failure sin romper el pipeline, y todo
 * precio sale `referential: true` con cadena y fecha — nunca transaccional.
 */

const SALCOBRAND_ALGOLIA_HOST = 'https://gm3rp06hjg-dsn.algolia.net';
const SALCOBRAND_ALGOLIA_APP_ID = 'GM3RP06HJG';
const SALCOBRAND_ALGOLIA_API_KEY = '0259fe250b3be4b1326eb85e47aa7d81';
const SALCOBRAND_INDEX = 'sb_variant_production';

const CRUZVERDE_LOGIN_URL = 'https://api.cruzverde.cl/customer-service/login';
const CRUZVERDE_SEARCH_URL = 'https://api.cruzverde.cl/product-service/products/search';

const AHUMADA_SUGGEST_URL =
  'https://www.farmaciasahumada.cl/on/demandware.store/Sites-ahumada-cl-Site/default/SearchServices-GetSuggestions';

/** Salcobrand (Algolia): hits[].name + normal_price (precio lista, sin promo). */
export function parseSalcobrandJson(body: string, fetchedAt: string): PriceEntry[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return [];
  }
  const hits = (parsed as { hits?: unknown[] }).hits;
  if (!Array.isArray(hits)) return [];

  const entries: PriceEntry[] = [];
  for (const hit of hits) {
    if (typeof hit !== 'object' || hit === null) continue;
    const record = hit as Record<string, unknown>;
    const name = typeof record['name'] === 'string' ? record['name'].trim() : '';
    const amount = parseClpAmount(record['normal_price'] ?? record['direct_discount']);
    if (!name || amount === null) continue;
    entries.push({
      productName: name,
      price: {
        amountClp: amount,
        currency: 'CLP',
        source: 'salcobrand.cl',
        fetchedAt,
        referential: true,
      },
    });
  }
  return entries;
}

/** Cruz Verde (SFCC): hits[].productName + prices['price-list-cl' | 'price-sale-cl']. */
export function parseCruzVerdeJson(body: string, fetchedAt: string): PriceEntry[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return [];
  }
  const hits = (parsed as { hits?: unknown[] }).hits;
  if (!Array.isArray(hits)) return [];

  const entries: PriceEntry[] = [];
  for (const hit of hits) {
    if (typeof hit !== 'object' || hit === null) continue;
    const record = hit as Record<string, unknown>;
    const name = typeof record['productName'] === 'string' ? record['productName'].trim() : '';
    const prices = (record['prices'] ?? {}) as Record<string, unknown>;
    const amount = parseClpAmount(prices['price-list-cl'] ?? prices['price-sale-cl']);
    if (!name || amount === null) continue;
    entries.push({
      productName: name,
      price: {
        amountClp: amount,
        currency: 'CLP',
        source: 'cruzverde.cl',
        fetchedAt,
        referential: true,
      },
    });
  }
  return entries;
}

/**
 * Ahumada (SFCC SFRA): fragmento HTML de sugerencias. Cada producto trae
 * `<span class="name ...">NOMBRE</span>` y el precio en `content="NNN"`.
 */
export function parseAhumadaSuggestionsHtml(body: string, fetchedAt: string): PriceEntry[] {
  const entries: PriceEntry[] = [];
  const itemBlocks = body.split(/<li[^>]*\bid="product-\d+"/).slice(1);
  for (const block of itemBlocks) {
    const nameMatch = block.match(/<span class="name[^"]*"[^>]*>([^<]+)<\/span>/);
    const priceMatch = block.match(/<span class="value[^"]*"[^>]*\bcontent="(\d+(?:\.\d+)?)"/);
    const name = nameMatch?.[1]?.trim();
    const amount = parseClpAmount(priceMatch?.[1]);
    if (!name || amount === null) continue;
    entries.push({
      productName: name,
      price: {
        amountClp: amount,
        currency: 'CLP',
        source: 'farmaciasahumada.cl',
        fetchedAt,
        referential: true,
      },
    });
  }
  return entries;
}

/**
 * Login anónimo Cruz Verde → header Cookie de sesión. Sin cache (es una
 * sesión); una por proceso. Devuelve null si la API no responde.
 */
let cruzVerdeCookiePromise: Promise<string | null> | undefined;

export function resetCruzVerdeSession(): void {
  cruzVerdeCookiePromise = undefined;
}

async function ensureCruzVerdeCookie(timeoutMs = 20_000): Promise<string | null> {
  cruzVerdeCookiePromise ??= (async () => {
    try {
      const res = await fetch(CRUZVERDE_LOGIN_URL, {
        method: 'POST',
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok && res.status !== 201) return null;
      const cookies = res.headers.getSetCookie();
      if (cookies.length === 0) return null;
      return cookies.map((c) => c.split(';')[0]).join('; ');
    } catch {
      return null;
    }
  })();
  return cruzVerdeCookiePromise;
}

export interface RetailPricesResult {
  entries: PriceEntry[];
  sources: string[];
  failures: string[];
}

export async function fetchRetailPrices(
  http: HttpClient,
  options: { query: string; limit?: number },
): Promise<RetailPricesResult> {
  const fetchedAt = new Date().toISOString();
  const limit = options.limit ?? 5;
  const entries: PriceEntry[] = [];
  const sources: string[] = [];
  const failures: string[] = [];

  // Salcobrand — Algolia con clave pública search-only.
  const salcobrandUrl = `${SALCOBRAND_ALGOLIA_HOST}/1/indexes/${SALCOBRAND_INDEX}/query?x-algolia-application-id=${SALCOBRAND_ALGOLIA_APP_ID}&x-algolia-api-key=${SALCOBRAND_ALGOLIA_API_KEY}`;
  const salcobrandRes = await http.fetchText(salcobrandUrl, {
    method: 'POST',
    body: JSON.stringify({
      params: `query=${encodeURIComponent(options.query)}&hitsPerPage=${limit}`,
    }),
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://salcobrand.cl',
      Referer: 'https://salcobrand.cl/',
    },
  });
  if (salcobrandRes.ok) {
    const parsed = parseSalcobrandJson(salcobrandRes.body, fetchedAt);
    entries.push(...parsed);
    if (parsed.length > 0) sources.push('https://salcobrand.cl');
  } else {
    failures.push(`Salcobrand: ${salcobrandRes.reason}`);
  }

  // Cruz Verde — sesión anónima + búsqueda JSON.
  const cruzVerdeCookie = await ensureCruzVerdeCookie();
  if (cruzVerdeCookie) {
    const cruzVerdeUrl = `${CRUZVERDE_SEARCH_URL}?limit=${limit}&offset=0&q=${encodeURIComponent(options.query)}`;
    const cruzVerdeRes = await http.fetchText(cruzVerdeUrl, {
      headers: { Cookie: cruzVerdeCookie },
    });
    if (cruzVerdeRes.ok) {
      const parsed = parseCruzVerdeJson(cruzVerdeRes.body, fetchedAt);
      entries.push(...parsed);
      if (parsed.length > 0) sources.push('https://www.cruzverde.cl');
    } else {
      failures.push(`Cruz Verde: ${cruzVerdeRes.reason}`);
    }
  } else {
    failures.push('Cruz Verde: login anónimo sin cookie de sesión');
  }

  // Ahumada — sugerencias HTML del storefront.
  const ahumadaUrl = `${AHUMADA_SUGGEST_URL}?q=${encodeURIComponent(options.query)}`;
  const ahumadaRes = await http.fetchText(ahumadaUrl);
  if (ahumadaRes.ok) {
    const parsed = parseAhumadaSuggestionsHtml(ahumadaRes.body, fetchedAt);
    entries.push(...parsed);
    if (parsed.length > 0) sources.push('https://www.farmaciasahumada.cl');
  } else {
    failures.push(`Ahumada: ${ahumadaRes.reason}`);
  }

  return { entries, sources, failures };
}
