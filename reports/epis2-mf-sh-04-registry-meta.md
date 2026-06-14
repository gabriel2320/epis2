# MF-SH-04 — Registry meta Chile en blueprints

**Programa:** PROG-STRENGTHEN-2026 / PROG-CORE-HARDEN  
**Fecha:** 2026-06-14  
**Gate:** `npm run quality:registry-meta-gate`

## Alcance

- Allowlist canónica `variableKey` Chile (SNRE + RUT + resumen) en `@epis2/clinical-domain`
- Validador de blueprints clave en `@epis2/clinical-forms`
- `patient_search.identifier` → `patient.rut` con metadata FHIR/audit

## Evidencia

| Check | Resultado |
|-------|-----------|
| `CHILE_SNRE_REGISTRY_META_KEYS` | ✓ `rx.medication` … `rx.clinical_notes` |
| `CHILE_RUT_REGISTRY_META_KEYS` | ✓ `patient.rut`, `patient.rut_normalizado` |
| `patient_search` RUT | ✓ `variableKey: patient.rut` |
| `prescription` SNRE | ✓ campos requeridos con variableKey + fhirPath |
| `patient_summary` | ✓ resumen con allowlist |
| Gate + tests | ✓ `registry-meta-allowlist.test.ts`, `chile-registry-meta.test.ts` |

## Comandos

```bash
npm run quality:registry-meta-gate
npm run quality:strengthen-next
```

## Próximo paso

**MF-SH-05** — RLS staging runbook + flag force.
