import { describe, expect, it, vi, afterEach } from 'vitest';
import type { HttpClient } from '../http.js';
import {
  fetchRetailPrices,
  parseAhumadaSuggestionsHtml,
  parseCruzVerdeJson,
  parseSalcobrandJson,
  resetCruzVerdeSession,
} from './retail.js';

const FETCHED_AT = '2026-06-10T00:00:00.000Z';

// Fixtures reducidas desde respuestas reales (2026-06-10).
const salcobrandFixture = JSON.stringify({
  hits: [
    {
      name: 'Kitadol (B) Paracetamol 500mg 24 Comprimidos',
      normal_price: 1499,
      direct_discount: '999.0',
      needs_recipe: false,
    },
    { name: 'Sin precio', needs_recipe: false },
  ],
});

const cruzVerdeFixture = JSON.stringify({
  count: 2,
  hits: [
    {
      productName: 'Xumadol Paracetamol 1000 mg 20 Comprimidos',
      prices: { 'price-sale-cl': 8990, 'price-list-cl': 11090 },
    },
    {
      productName: 'Solo oferta',
      prices: { 'price-sale-cl': 2490 },
    },
    { productName: 'Sin precios', prices: {} },
  ],
});

const ahumadaFixture = `
<ul>
  <li class="col-12 item mb-3" id="product-0" role="optio2">
    <a href="/paracetamol-500-mg-x-16-comprimidos-84574.html" class="link">
      <span class="name mb-3 d-inline-block">Paracetamol 500 mg x 16 Comprimidos</span>
    </a>
    <div class="price"><span class="value d-flex" content="731"></span>$731</div>
  </li>
  <li class="col-12 item mb-3" id="product-1">
    <a href="/x.html"><span class="name">Kitadol 500 mg</span></a>
    <div class="price"><span class="value" content="1299"></span></div>
  </li>
  <li class="col-12 item mb-3" id="product-2">
    <a href="/y.html"><span class="name">Sin precio visible</span></a>
  </li>
</ul>`;

describe('parseSalcobrandJson', () => {
  it('extrae nombre y precio lista; descarta hits sin precio', () => {
    const entries = parseSalcobrandJson(salcobrandFixture, FETCHED_AT);
    expect(entries).toHaveLength(1);
    expect(entries[0]!.productName).toBe('Kitadol (B) Paracetamol 500mg 24 Comprimidos');
    expect(entries[0]!.price).toEqual({
      amountClp: 1499,
      currency: 'CLP',
      source: 'salcobrand.cl',
      fetchedAt: FETCHED_AT,
      referential: true,
    });
  });

  it('tolera JSON inválido', () => {
    expect(parseSalcobrandJson('<html>', FETCHED_AT)).toEqual([]);
  });
});

describe('parseCruzVerdeJson', () => {
  it('prefiere price-list-cl y cae a price-sale-cl', () => {
    const entries = parseCruzVerdeJson(cruzVerdeFixture, FETCHED_AT);
    expect(entries).toHaveLength(2);
    expect(entries[0]!.price.amountClp).toBe(11090);
    expect(entries[0]!.price.source).toBe('cruzverde.cl');
    expect(entries[1]!.price.amountClp).toBe(2490);
  });

  it('tolera JSON inválido', () => {
    expect(parseCruzVerdeJson('no-json', FETCHED_AT)).toEqual([]);
  });
});

describe('parseAhumadaSuggestionsHtml', () => {
  it('extrae pares nombre/precio del fragmento HTML', () => {
    const entries = parseAhumadaSuggestionsHtml(ahumadaFixture, FETCHED_AT);
    expect(entries).toHaveLength(2);
    expect(entries[0]!.productName).toBe('Paracetamol 500 mg x 16 Comprimidos');
    expect(entries[0]!.price.amountClp).toBe(731);
    expect(entries[0]!.price.source).toBe('farmaciasahumada.cl');
    expect(entries[1]!.price.amountClp).toBe(1299);
  });

  it('devuelve vacío sin items', () => {
    expect(parseAhumadaSuggestionsHtml('<div>nada</div>', FETCHED_AT)).toEqual([]);
  });
});

describe('fetchRetailPrices', () => {
  afterEach(() => {
    resetCruzVerdeSession();
    vi.unstubAllGlobals();
  });

  function makeHttp(byHost: Record<string, string>): HttpClient {
    return {
      fetchText: vi.fn(async (url: string) => {
        const host = new URL(url).host;
        const body = byHost[host];
        if (body === undefined) return { ok: false as const, reason: `HTTP 500 en ${url}` };
        return { ok: true as const, body, fromCache: false };
      }),
    };
  }

  it('agrega entradas de las tres cadenas y registra fallos sin romper', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 201,
        headers: { getSetCookie: () => ['connect.sid=abc123; Path=/; HttpOnly'] },
      })),
    );
    const http = makeHttp({
      'gm3rp06hjg-dsn.algolia.net': salcobrandFixture,
      'api.cruzverde.cl': cruzVerdeFixture,
      // farmaciasahumada.cl sin body → failure
    });

    const result = await fetchRetailPrices(http, { query: 'paracetamol' });
    expect(result.entries.map((e) => e.price.source)).toEqual([
      'salcobrand.cl',
      'cruzverde.cl',
      'cruzverde.cl',
    ]);
    expect(result.sources).toEqual(['https://salcobrand.cl', 'https://www.cruzverde.cl']);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0]).toContain('Ahumada');
  });

  it('degrada Cruz Verde a failure si el login anónimo no entrega cookie', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 403,
        headers: { getSetCookie: () => [] },
      })),
    );
    const http = makeHttp({
      'gm3rp06hjg-dsn.algolia.net': salcobrandFixture,
      'www.farmaciasahumada.cl': ahumadaFixture,
    });

    const result = await fetchRetailPrices(http, { query: 'paracetamol' });
    expect(result.failures.some((f) => f.includes('Cruz Verde'))).toBe(true);
    expect(result.entries.some((e) => e.price.source === 'salcobrand.cl')).toBe(true);
    expect(result.entries.some((e) => e.price.source === 'farmaciasahumada.cl')).toBe(true);
  });
});
