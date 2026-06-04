# EPIS — Patrones rechazados en EPIS2

Cualquier aparición en **código productivo** (`apps/`, `packages/`, `services/`, `tests/`) falla `architecture:validate`, salvo mención educativa en `docs/legacy/`.

---

## Plataforma y dependencias

| Patrón | Ejemplos | Validador |
|--------|----------|-----------|
| OpenMRS SDK / distro | `openmrs/`, `epis:openmrs:*` | `no-legacy-dependencies` |
| Paquetes `@openmrs/*` | `@openmrs/esm-framework` | `no-legacy-dependencies` |
| O3 / ESM overlays | `openmrs-esm`, `frontend/esm-*` | `no-legacy-dependencies` |
| Carbon / IBM Plex | `@carbon/*`, `carbon-components` | `no-legacy-dependencies` |
| Soft Carbon | `EpisSoftCarbon`, `epis-soft-carbon.css` | `no-legacy-dependencies` |
| Import desde repo EPIS | `from '../Epis'`, `@epis/` | `no-legacy-dependencies` |

---

## Experiencia y navegación

| Patrón | Ejemplos | Validador |
|--------|----------|-----------|
| Dashboard como home | `DashboardHome`, default `/dashboard` | `command-center-home` |
| Ruta legacy panel | `/home/epis-clinical-panel` | `command-center-home` |
| OpenMRS como UI | `epis-route-bridge`, chrome O3 | `no-legacy-dependencies` |
| Menú hospitalario extenso | Sidebars multi-módulo en home | Revisión humana EPIS2-02+ |

---

## Datos y registros

| Patrón | Ejemplos | Validador |
|--------|----------|-----------|
| Segundo Command Registry | `commandRegistry.ts` fuera de `packages/command-registry` | `single-command-registry` |
| Segundo Form Registry | `formRegistry.ts` fuera de `packages/clinical-forms` | `single-form-registry` |
| OpenMRS como SoT | ADR invisible core, writeback automático | `PRODUCT_INVARIANTS` |
| Aprobación automática | `autoApprove`, `skipHumanReview` | `human-approval-required` |

---

## IA y permisos

| Patrón | Ejemplos | Validador |
|--------|----------|-----------|
| IA escribe clínica final | `.insert` en `clinical_notes` desde `local-ai` | `ai-write-boundary` |
| IA aprueba o firma | `approveDraft` en servicio IA | `ai-write-boundary` |
| Permisos wildcard | `*`, `admin.*`, `grantAll` | `explicit-permissions` |
| Panel IA permanente en home | Status Ollama/RAG dominante | Canon + EPIS2-02 |

---

## Proceso

| Patrón | Consecuencia |
|--------|--------------|
| Copiar carpetas completas desde EPIS | Prohibido |
| Import sin manifiesto | Prohibido |
| Microfase N+1 sin gate N | Prohibido |
| PHI real en repo | Prohibido |
