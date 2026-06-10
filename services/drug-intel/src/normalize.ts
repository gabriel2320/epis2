import { createHash } from 'node:crypto';
import { drugIntelRecordSchema, type DrugIntelRecord } from '@epis2/contracts';
import type { IspAlert, IspProduct } from './sources/isp.js';
import type { PriceEntry } from './sources/prices.js';
import type { OpenFdaLabel } from './sources/openfda.js';
import type { RxNormResult } from './sources/rxnorm.js';

/**
 * Normalización multi-fuente → registro canónico `drugIntelRecordSchema`.
 * El registro queda con `correlation.status = 'not_correlated'`; la fase de
 * correlación (determinística + IA opcional) lo completa después.
 */

export interface NormalizeInput {
  isp: IspProduct;
  ispAlerts: IspAlert[];
  prices: PriceEntry[];
  openFda?: OpenFdaLabel | undefined;
  rxNorm?: RxNormResult | undefined;
  sources: string[];
  fetchedAt: string;
}

export function slugifyProductName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function normalizeForMatch(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Match laxo entre nombre de producto ISP y nombre en fuente de precios. */
export function priceMatchesProduct(productName: string, priceName: string): boolean {
  const product = normalizeForMatch(productName);
  const price = normalizeForMatch(priceName);
  if (!product || !price) return false;
  if (product.includes(price) || price.includes(product)) return true;
  const productToken = product.split(' ')[0]!;
  return productToken.length >= 4 && price.includes(productToken);
}

/** Alertas ISP relevantes para el producto (por nombre o principio activo). */
export function matchAlerts(product: IspProduct, alerts: IspAlert[]): IspAlert[] {
  const needles = [product.name, product.activeIngredient]
    .filter((v): v is string => Boolean(v?.trim()))
    .map(normalizeForMatch)
    .flatMap((v) => v.split(' '))
    .filter((token) => token.length >= 5);
  if (needles.length === 0) return [];
  return alerts.filter((alert) => {
    const title = normalizeForMatch(alert.title);
    return needles.some((needle) => title.includes(needle));
  });
}

export function buildRecord(input: NormalizeInput): DrugIntelRecord {
  const { isp } = input;
  const recordKey = isp.registryId
    ? `isp-${slugifyProductName(isp.registryId)}`
    : slugifyProductName(isp.name);

  const warnings: DrugIntelRecord['warnings'] = [];
  const adverseReactions: DrugIntelRecord['adverseReactions'] = [];
  const recommendedDoses: DrugIntelRecord['recommendedDoses'] = [];

  if (input.openFda?.boxedWarning) {
    warnings.push({ text: input.openFda.boxedWarning, source: 'openfda:boxed_warning' });
  }
  if (input.openFda?.warnings) {
    warnings.push({ text: input.openFda.warnings, source: 'openfda:warnings' });
  }
  if (input.openFda?.adverseReactions) {
    adverseReactions.push({
      text: input.openFda.adverseReactions,
      source: 'openfda:adverse_reactions',
    });
  }
  if (input.openFda?.dosageAndAdministration) {
    recommendedDoses.push({
      population: 'unspecified',
      text: input.openFda.dosageAndAdministration,
      source: 'openfda:dosage_and_administration',
    });
  }

  const matchedPrices = input.prices
    .filter((entry) => priceMatchesProduct(isp.name, entry.productName))
    .map((entry) => entry.price);

  const atcCode = input.rxNorm?.atcCodes[0];

  const record: DrugIntelRecord = {
    recordKey,
    productName: isp.name,
    pharmaceuticalForms: isp.pharmaceuticalForm ? [isp.pharmaceuticalForm] : [],
    recommendedDoses,
    prices: matchedPrices,
    warnings,
    ispAlerts: matchAlerts(isp, input.ispAlerts),
    adverseReactions,
    sources: [...new Set(input.sources)],
    correlation: {
      status: 'not_correlated',
      requiresHumanReview: true,
      discrepancies: [],
    },
    fetchedAt: input.fetchedAt,
    ...(isp.activeIngredient ? { activeIngredient: isp.activeIngredient } : {}),
    ...(atcCode ? { atcCode } : {}),
    ...(isp.registryId
      ? {
          ispRegistry: {
            registryId: isp.registryId,
            ...(isp.status ? { status: isp.status } : {}),
            ...(isp.saleCondition ? { saleCondition: isp.saleCondition } : {}),
            ...(isp.holder ? { holder: isp.holder } : {}),
          },
        }
      : {}),
  };

  return drugIntelRecordSchema.parse(record);
}

/** Hash estable del contenido del registro (sin timestamps) para idempotencia. */
export function recordContentHash(record: DrugIntelRecord): string {
  const content: Partial<DrugIntelRecord> = { ...record };
  delete content.fetchedAt;
  delete content.correlation;
  const stable = JSON.stringify(content, Object.keys(content).sort());
  return createHash('sha256').update(stable).digest('hex');
}
