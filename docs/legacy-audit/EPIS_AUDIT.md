# Auditoría EPIS (solo lectura)

**Repositorio:** `c:\Users\gdela\OneDrive\Documentos Importantes\EPIS`  
**Estado:** FOUND  
**Rama:** `mui-clinical-shell`  
**HEAD:** `a3b0ffe` — Fixes Material visual wiring and Spanish UI gates  
**Cambios locales:** ~51 archivos modificados/untracked (no alterados por esta auditoría)  
**Archivos analizados (aprox.):** 3 858 (excl. `node_modules`, `dist`, `.git`)

---

## 1. Resumen ejecutivo

EPIS es una **distribución OpenMRS 3** con capa clínica local-first (IA, RAG, sidecar) y una **rama activa Material** que intenta un shell V2 command-first (`/epis/command`) sobre infraestructura O3 invisible. El producto acumula **dos líneas UI** (Carbon congelado + Material experimental) y **decenas de paquetes** acoplados a OpenMRS. Para EPIS2, EPIS aporta **conceptos y paquetes puros** (seguridad clínica demo, sinónimos ES, prompts IA), no el distro ni los ESM.

---

## 2. Visión original

- EMR chileno con IA local, pacientes sintéticos, interoperabilidad FHIR.
- Pivot documentado hacia **command-first** y shell Material (ADR-021, ADR-024, `docs/product/EPIS_V2_SCOPE.md`).
- OpenMRS como SoT de backend en piloto; writeback con kill switch OFF por defecto.

---

## 3. Arquitectura encontrada

| Capa | Tecnología | Evidencia |
|------|------------|-----------|
| Frontend producto | ESM OpenMRS + Material (`frontend/esm-epis-material-app`) | `epis-v2-router.ts`, `EpisV2CommandCenter.tsx` |
| Frontend legacy | Carbon shell, command-center O3 | `frontend/esm-epis-carbon-shell`, `/home/epis-command` |
| Backend clínico | OpenMRS + sidecar Node | `openmrs/`, `services/epis-ai-sidecar/` |
| IA | Ollama vía `@epis/ai-core`, RAG `@epis/rag` | `packages/epis-ai-core`, rutas sidecar |
| Paquetes dominio | 21× `@epis/*` | `packages/` |
| Datos demo | JSON Chile, sinónimos | `data/demo/`, `packages/epis-demo-patients` |
| CI | GitHub Actions en `main` | `.github/workflows/epis-ci.yml` (rama activa no dispara CI) |

---

## 4. Funciones útiles

- Registro de comandos con `labelEs` y `aliasesEs` (`packages/epis-ui/src/command/commandRegistry.ts`).
- Blueprints de formularios declarativos (`packages/epis-clinical-forms`).
- CDS demo read-only (`packages/epis-clinical-safety`).
- Capa Chile RUT/conceptos (`packages/epis-chile`).
- Prompts y evals IA (`packages/epis-ai-prompts`, `epis-ai-evals`).
- Gates de política IA (no firmar/writeback) en `docs/intelligence/AI_ASSISTED_FORM_PROMPT_CONTRACTS.md`.

---

## 5. Código de alto valor

| Ruta | Valor |
|------|-------|
| `packages/epis-ui/src/command/commandRegistry.ts` | REFERENCE_ONLY — modelo intents ES |
| `data/demo/command-synonyms-es-CL.json` | Aliases NL (extraído a cuarentena) |
| `packages/epis-clinical-safety/src/` | Reglas CDS demo (extraído) |
| `packages/epis-chile/` | RUT y conceptos |
| `packages/epis-demo-patients/` | Fixtures sintéticos (reescribir en test-fixtures) |
| `packages/epis-material-shell/src/pages/EpisCommandCenter.tsx` | REFERENCE_ONLY UX MUI |
| `packages/epis-openmrs-adapter/` | Solo si se mantiene lectura OMRS (REJECT en EPIS2) |

---

## 6. Errores técnicos

1. **Dos shells UI** (Carbon + Material) pinneados en overlay (`esm-package-pins.epis.json`).
2. **Múltiples registries** de formularios (material-forms, epis-clinical-forms, validadores MF).
3. **Acoplamiento OpenMRS** en auth, rutas (`EPIS_O3_ALIASES`), write-adapter.
4. **RAG + sidecar** como superficie paralela (complejidad operativa).
5. **CI en `main`** mientras desarrollo activo en `mui-clinical-shell`.
6. **24 dependencias @openmrs** detectadas en `package.json` del monorepo (scan automático).

---

## 7. Errores de producto

- Home histórico O3 `/home` vs canon `/epis/command` — transición incompleta.
- Documentación extensa con microfases (P3–P17) que no siempre convergen en capacidad visible única.
- Writeback pilot documentado pero riesgo de confusión con MVP «sin escritura automática».

---

## 8. Errores de experiencia visual

- Mezcla Carbon/MUI en la misma distro.
- Rutas `/home/epis-*` y chrome O3 aún presentes en config.
- Gates español recientes (rama Material) — EPIS2 ya centraliza copy en `design-system`.

---

## 9. Errores de gobierno

- **LEGACY_RESCUE_MAP** vs múltiples ADRs — gobierno fuerte pero difícil de seguir.
- Rama larga `mui-clinical-shell` divergente de `main`.
- Muchos scripts `epis:material:*` sin equivalente único en EPIS2.

---

## 10. Dependencias problemáticas

| Dependencia | Clasificación |
|-------------|---------------|
| `@openmrs/*` | FORBIDDEN_IN_EPIS2 |
| `@carbon/*` | FORBIDDEN_IN_EPIS2 |
| OpenMRS distro Docker | LEGACY_ONLY |
| `@epis/rag` | REPLACE_IN_EPIS2 (fuera MVP) |
| Material en ESM | REPLACE_IN_EPIS2 (MUI nativo Vite en EPIS2) |

---

## 11. Seguridad y privacidad

- Pacientes sintéticos explícitos (`demo-patients`, flags en JSON).
- Writeback acotado por policy (`epis-openmrs-write-adapter/policy.ts`).
- Scan automático: posibles hallazgos de formato RUT en fixtures (revisar antes de copiar).
- **No copiar** `.env`, `yarn.lock`, bases `db/`.

---

## 12. Tests disponibles

- Vitest/Jest en paquetes `@epis/*`.
- Tests Node `scripts/test/*.test.mjs` (openmrs, rag, carbon-shell).
- E2E OpenMRS lab (`openmrs/lab/.../tests/e2e`).
- Evals IA (`eval:ai`, `packages/epis-ai-evals`).

---

## 13. Deuda técnica

- Retiro Carbon incompleto (scripts mat-010–014).
- Placeholders en router V2 (`epis-v2-placeholders.tsx`).
- Coexistencia de command registry + intent-router + clinical-forms router.

---

## 14. Lecciones para EPIS2

- Un solo registry de comandos y formularios (EPIS2 ya lo cumple).
- Separar IA de writeback y de aprobación humana.
- No arrastrar distro OpenMRS como producto visible.
- Invertir en aliases español y golden journey (EPIS2 EPIS2-11).

---

## 15. Elementos que nunca deben migrarse

- Carpeta `openmrs/` completa.
- `frontend/esm-epis-carbon-shell/`.
- `packages/epis-openmrs-write-adapter/` (writeback).
- RAG, sidecar Python/Node como dependencia MVP.
- Import maps y overlays ESM OpenMRS.
- Dashboard O3 como home.

---

*Auditoría Fase A — sin modificación del repositorio EPIS.*
