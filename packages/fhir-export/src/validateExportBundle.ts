import { EPIS2_PROFILES } from './constants.js';

const ALLOWED_RESOURCE_TYPES = new Set([
  'Patient',
  'Encounter',
  'DocumentReference',
  'ServiceRequest',
]);

const FORBIDDEN_CODE_SYSTEM = /loinc|snomed/i;

export type ExportBundleValidationIssue = {
  path: string;
  message: string;
};

export type ExportBundleValidationResult = {
  valid: boolean;
  issues: ExportBundleValidationIssue[];
};

function issue(path: string, message: string): ExportBundleValidationIssue {
  return { path, message };
}

function collectReferences(value: unknown, refs: { reference?: string }[]): void {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    for (const item of value) collectReferences(item, refs);
    return;
  }
  const obj = value as Record<string, unknown>;
  if (typeof obj.reference === 'string') {
    refs.push({ reference: obj.reference });
  }
  for (const nested of Object.values(obj)) {
    collectReferences(nested, refs);
  }
}

function parseReference(reference: string): { resourceType: string; id: string } | null {
  const match = /^([A-Za-z]+)\/(.+)$/.exec(reference.trim());
  if (!match) return null;
  return { resourceType: match[1]!, id: match[2]! };
}

function checkForbiddenTerminology(
  value: unknown,
  path: string,
  issues: ExportBundleValidationIssue[],
): void {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkForbiddenTerminology(item, `${path}[${index}]`, issues));
    return;
  }
  const obj = value as Record<string, unknown>;
  if (typeof obj.system === 'string' && FORBIDDEN_CODE_SYSTEM.test(obj.system)) {
    issues.push(issue(path, `system terminológico no autorizado en export EPIS2: ${obj.system}`));
  }
  for (const [key, nested] of Object.entries(obj)) {
    checkForbiddenTerminology(nested, `${path}.${key}`, issues);
  }
}

export function validateEpis2ExportBundle(bundle: unknown): ExportBundleValidationIssue[] {
  const issues: ExportBundleValidationIssue[] = [];
  const b = bundle as {
    resourceType?: string;
    type?: string;
    meta?: { profile?: string[] };
    entry?: { fullUrl?: string; resource?: { resourceType?: string; id?: string } }[];
  };

  if (b.resourceType !== 'Bundle') {
    issues.push(issue('resourceType', 'debe ser Bundle'));
  }
  if (b.type !== 'collection') {
    issues.push(issue('type', 'debe ser collection'));
  }
  if (!b.meta?.profile?.includes(EPIS2_PROFILES.bundle)) {
    issues.push(issue('meta.profile', `falta perfil ${EPIS2_PROFILES.bundle}`));
  }

  const entries = b.entry ?? [];
  if (entries.length === 0) {
    issues.push(issue('entry', 'Bundle debe incluir al menos una entrada'));
    return issues;
  }

  if (entries[0]?.resource?.resourceType !== 'Patient') {
    issues.push(issue('entry[0]', 'la primera entrada debe ser Patient'));
  }

  const resourceIndex = new Map<string, number>();

  entries.forEach((entry, index) => {
    const path = `entry[${index}]`;
    if (!entry.fullUrl) {
      issues.push(issue(`${path}.fullUrl`, 'fullUrl requerido'));
    }
    const resourceType = entry.resource?.resourceType;
    if (!resourceType || !ALLOWED_RESOURCE_TYPES.has(resourceType)) {
      issues.push(
        issue(`${path}.resource`, `resourceType no soportado: ${resourceType ?? 'undefined'}`),
      );
      return;
    }
    if (!entry.resource?.id) {
      issues.push(issue(`${path}.resource.id`, 'id requerido'));
    }
    const resourceId = entry.resource?.id;
    const key = `${resourceType}/${resourceId}`;
    if (resourceIndex.has(key)) {
      issues.push(issue(path, `recurso duplicado: ${key}`));
    } else {
      resourceIndex.set(key, index);
    }
    checkForbiddenTerminology(entry.resource, `${path}.resource`, issues);
  });

  for (const [index, entry] of entries.entries()) {
    const refs: { reference?: string }[] = [];
    collectReferences(entry.resource, refs);
    for (const [refIndex, ref] of refs.entries()) {
      const parsed = parseReference(ref.reference ?? '');
      if (!parsed) {
        issues.push(
          issue(`entry[${index}].reference[${refIndex}]`, `referencia inválida: ${ref.reference}`),
        );
        continue;
      }
      if (!resourceIndex.has(`${parsed.resourceType}/${parsed.id}`)) {
        issues.push(
          issue(
            `entry[${index}].reference[${refIndex}]`,
            `referencia dangling: ${parsed.resourceType}/${parsed.id}`,
          ),
        );
      }
    }
  }

  return issues;
}

export function assertValidEpis2ExportBundle(bundle: unknown): void {
  const issues = validateEpis2ExportBundle(bundle);
  if (issues.length > 0) {
    const details = issues.map((i) => `${i.path}: ${i.message}`).join('\n');
    throw new Error(`Bundle EPIS2 export inválido:\n${details}`);
  }
}
