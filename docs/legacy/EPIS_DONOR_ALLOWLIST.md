# EPIS — Allowlist de donante

Solo los elementos listados pueden portarse desde `../Epis`. Todo import requiere entrada en `legacy-import-manifest.json` y registro en `LEGACY_IMPORT_LEDGER.md`.

---

## Allowlist por categoría

### Comandos (MIGRATE → `packages/command-registry/`)

| Archivo EPIS (referencia) | Modo |
|---------------------------|------|
| `packages/epis-ui/src/command/commandRegistry.ts` | extract |
| `packages/epis-ui/src/command/intentRouter.ts` | extract |
| `packages/epis-ui/src/command/clinicalIntentResolver.ts` | extract |
| `packages/epis-ui/src/command/clinicalTextParser.ts` | extract |
| Tests asociados en `packages/epis-ui/test/*Intent*` | extract |

### Formularios (MIGRATE → `packages/clinical-forms/`)

| Recurso EPIS | Modo |
|--------------|------|
| `packages/epis-clinical-forms/**` (blueprints MVP) | extract |
| `docs/forms/CLINICAL_FORM_BLUEPRINTS.md` | reference |

### Dominio y seguridad

| Recurso EPIS | Modo |
|--------------|------|
| `packages/epis-clinical-safety/**` | extract |
| `docs/product/EPIS_ROLE_POLICY_CANON.md` | rewrite |

### Copy y fixtures

| Recurso EPIS | Modo |
|--------------|------|
| `docs/ux/EPIS_MATERIAL_SPANISH_COPY.md` | rewrite |
| `packages/epis-clinical-forms/src/fixtures/demo*.ts` | extract |

### Contratos IA

| Recurso EPIS | Modo |
|--------------|------|
| Schemas structured output en paquetes `epis-*` (sin OpenMRS) | extract → `packages/contracts` |

---

## Denylist explícita (nunca importar)

- `openmrs/**`, `frontend/esm-*`, `packages/epis-openmrs-*`
- `EpisSoftCarbon*`, `*carbon*`, `epis-route-bridge*`
- `scripts/epis-mf-*`, `scripts/epis-openmrs-*`
- `node_modules`, builds, locks de EPIS
- Documentación de gobierno MF masivo como proceso operativo

---

## Proceso obligatorio

1. Proponer ítem y modo (`rewrite` | `extract` | `reference`).
2. Añadir a `legacy-import-manifest.json` con SHA fuente.
3. Implementar en EPIS2 sin imports legacy.
4. Actualizar `LEGACY_IMPORT_LEDGER.md`.
5. Ejecutar `npm run architecture:validate` y tests del ítem.

**Ausencia en manifiesto = migración prohibida.**
