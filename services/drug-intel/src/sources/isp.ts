import type { HttpClient } from '../http.js';

/**
 * Adaptador ISP Chile (Instituto de Salud Pública).
 *
 * Fuente primaria: registro sanitario de productos farmacéuticos
 * (registrosanitario.ispch.gob.cl). El sitio es ASP.NET WebForms y frágil al
 * scraping, por eso:
 * - El parser HTML es puro y se testea con fixtures grabados.
 * - Se acepta además un dataset CSV (datos.gob.cl / export manual) vía
 *   `DRUG_INTEL_ISP_DATASET_URL`, que es la vía preferida cuando existe.
 */

export interface IspProduct {
  registryId: string;
  name: string;
  activeIngredient?: string;
  pharmaceuticalForm?: string;
  saleCondition?: string;
  status?: string;
  holder?: string;
  /** Categoría/tipo de registro declarado por ISP (para exclusiones). */
  sourceCategory?: string;
}

export interface IspAlert {
  title: string;
  url?: string;
  publishedAt?: string;
}

const ISP_SEARCH_URL = 'https://registrosanitario.ispch.gob.cl/Ficha.aspx';
const ISP_ALERTS_URL = 'https://www.ispch.cl/categorias-alertas/alertas-de-medicamentos/';

const HTML_ENTITIES: ReadonlyArray<[RegExp, string]> = [
  [/&Aacute;/g, 'Á'],
  [/&Eacute;/g, 'É'],
  [/&Iacute;/g, 'Í'],
  [/&Oacute;/g, 'Ó'],
  [/&Uacute;/g, 'Ú'],
  [/&Ntilde;/g, 'Ñ'],
  [/&aacute;/g, 'á'],
  [/&eacute;/g, 'é'],
  [/&iacute;/g, 'í'],
  [/&oacute;/g, 'ó'],
  [/&uacute;/g, 'ú'],
  [/&ntilde;/g, 'ñ'],
  [/&amp;/gi, '&'],
  [/&nbsp;/gi, ' '],
  [/&quot;/gi, '"'],
];

function decodeHtmlEntities(value: string): string {
  let decoded = value;
  for (const [pattern, replacement] of HTML_ENTITIES) {
    decoded = decoded.replace(pattern, replacement);
  }
  return decoded;
}

function cleanCell(value: string): string {
  return decodeHtmlEntities(value.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parsea la tabla de resultados del buscador del registro sanitario ISP.
 * Estructura esperada: filas `<tr>` con celdas registro / nombre / titular /
 * estado / condición de venta (el orden real se fija con fixtures).
 */
export function parseIspSearchHtml(html: string): IspProduct[] {
  const products: IspProduct[] = [];
  const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  for (const rowMatch of html.matchAll(rowPattern)) {
    const cells = [...rowMatch[1]!.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) =>
      cleanCell(m[1]!),
    );
    if (cells.length < 2) continue;
    const registryId = cells[0] ?? '';
    // Los registros sanitarios chilenos tienen formato tipo "F-12345/20".
    if (!/^[A-Z]+-?\d+/i.test(registryId)) continue;
    const product: IspProduct = {
      registryId,
      name: cells[1] ?? '',
    };
    if (cells[2]) product.holder = cells[2];
    if (cells[3]) product.status = cells[3];
    if (cells[4]) product.saleCondition = cells[4];
    if (product.name) products.push(product);
  }
  return products;
}

/**
 * Parsea un dataset CSV de registro sanitario (separador `;` o `,`).
 * Columnas reconocidas (case-insensitive): registro, nombre, principio_activo,
 * forma_farmaceutica, condicion_venta, estado, titular, tipo_producto.
 */
export function parseIspDatasetCsv(csv: string): IspProduct[] {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];
  const separator =
    (lines[0]!.match(/;/g)?.length ?? 0) >= (lines[0]!.match(/,/g)?.length ?? 0) ? ';' : ',';
  const headers = splitCsvLine(lines[0]!, separator).map((h) =>
    h
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_'),
  );

  const col = (names: string[]): number =>
    headers.findIndex((h) => names.some((n) => h.includes(n)));
  const idxRegistro = col(['registro']);
  const idxNombre = col(['nombre', 'producto']);
  const idxPrincipio = col(['principio']);
  const idxForma = col(['forma']);
  const idxCondicion = col(['condicion', 'venta']);
  const idxEstado = col(['estado']);
  const idxTitular = col(['titular', 'empresa']);
  const idxTipo = col(['tipo']);

  if (idxRegistro < 0 || idxNombre < 0) return [];

  const products: IspProduct[] = [];
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line, separator);
    const registryId = cells[idxRegistro]?.trim() ?? '';
    const name = cells[idxNombre]?.trim() ?? '';
    if (!registryId || !name) continue;
    const product: IspProduct = { registryId, name };
    const principio = idxPrincipio >= 0 ? cells[idxPrincipio]?.trim() : undefined;
    const forma = idxForma >= 0 ? cells[idxForma]?.trim() : undefined;
    const condicion = idxCondicion >= 0 ? cells[idxCondicion]?.trim() : undefined;
    const estado = idxEstado >= 0 ? cells[idxEstado]?.trim() : undefined;
    const titular = idxTitular >= 0 ? cells[idxTitular]?.trim() : undefined;
    const tipo = idxTipo >= 0 ? cells[idxTipo]?.trim() : undefined;
    if (principio) product.activeIngredient = principio;
    if (forma) product.pharmaceuticalForm = forma;
    if (condicion) product.saleCondition = condicion;
    if (estado) product.status = estado;
    if (titular) product.holder = titular;
    if (tipo) product.sourceCategory = tipo;
    products.push(product);
  }
  return products;
}

function splitCsvLine(line: string, separator: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === separator && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map((c) => c.trim());
}

/** Parsea el listado público de alertas de medicamentos del ISP. */
export function parseIspAlertsHtml(html: string): IspAlert[] {
  const alerts: IspAlert[] = [];
  const anchorPattern = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(anchorPattern)) {
    const url = match[1]!;
    const title = cleanCell(match[2]!);
    if (!title || title.length < 12) continue;
    if (!/alerta|retiro|suspensi[oó]n|farmacovigilancia|seguridad/i.test(title)) continue;
    const alert: IspAlert = { title };
    if (/^https?:\/\//i.test(url)) alert.url = url;
    const dateMatch = html
      .slice(Math.max(0, match.index! - 300), match.index!)
      .match(/(\d{1,2}[/-]\d{1,2}[/-]\d{4}|\d{4}-\d{2}-\d{2})/);
    if (dateMatch) alert.publishedAt = dateMatch[1]!;
    alerts.push(alert);
  }
  // Dedup por título.
  const seen = new Set<string>();
  return alerts.filter((a) => {
    if (seen.has(a.title)) return false;
    seen.add(a.title);
    return true;
  });
}

export interface IspFetchResult {
  products: IspProduct[];
  alerts: IspAlert[];
  sources: string[];
  failures: string[];
}

export async function fetchIspData(
  http: HttpClient,
  options: { datasetUrl?: string; searchUrl?: string; alertsUrl?: string },
): Promise<IspFetchResult> {
  const sources: string[] = [];
  const failures: string[] = [];
  let products: IspProduct[] = [];

  if (options.datasetUrl) {
    const res = await http.fetchText(options.datasetUrl);
    if (res.ok) {
      products = parseIspDatasetCsv(res.body);
      sources.push(options.datasetUrl);
    } else {
      failures.push(`ISP dataset: ${res.reason}`);
    }
  }

  if (products.length === 0) {
    const searchUrl = options.searchUrl ?? ISP_SEARCH_URL;
    const res = await http.fetchText(searchUrl);
    if (res.ok) {
      products = parseIspSearchHtml(res.body);
      sources.push(searchUrl);
    } else {
      failures.push(`ISP búsqueda: ${res.reason}`);
    }
  }

  let alerts: IspAlert[] = [];
  const alertsUrl = options.alertsUrl ?? ISP_ALERTS_URL;
  const alertsRes = await http.fetchText(alertsUrl);
  if (alertsRes.ok) {
    alerts = parseIspAlertsHtml(alertsRes.body);
    sources.push(alertsUrl);
  } else {
    failures.push(`ISP alertas: ${alertsRes.reason}`);
  }

  return { products, alerts, sources, failures };
}
