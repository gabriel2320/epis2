# Auditoría EPIONE (solo lectura)

**Repositorio:** `c:\Users\gdela\OneDrive\Documentos Importantes\clinical-ai-canvas-improved`  
**Marca:** Clinical AI Canvas / EPIONE  
**Estado:** FOUND  
**Rama:** `feat/clinical-depth-sprints-5-9`  
**HEAD:** `72851ab` — Add master Inicio screen and unify census command bar  
**Cambios locales:** limpio  
**Archivos analizados (aprox.):** 832

---

## 1. Resumen ejecutivo

EPIONE es un **prototipo command-first denso**: 117+ actionIds, Medical Action Universe (MAU), backend Hono real y modo demo con **localStorage como SoT por defecto**. No usa OpenMRS ni Carbon en runtime (Radix/Tailwind). Para EPIS2 es donante de **conceptos** (MAU, safety, executors), no de shell: el home es **Inicio / Mi jornada**, no Centro de Comando, y hay **resolvers paralelos**.

---

## 2. Visión original

Hoja clínica inteligente minimalista Chile — mock, no uso clínico real (`README.md`).

---

## 3. Arquitectura encontrada

| Capa | Stack |
|------|--------|
| Frontend | React, Vite, TanStack Router, Radix — `src/` |
| Backend opcional | Hono, Drizzle, PG — `backend/` |
| Shared | `@epione/shared` — MAU, CDR, permisos |
| Datos | `data/catalogs/epione/`, `data/forms/clinical/` |
| IA | Ollama gateway read-only — `backend/src/ai/` |

---

## 4. Funciones útiles

- Medical Action Universe (`packages/shared/src/medical-action-universe/`) — **referencia en cuarentena**.
- Clinical decision rules + safety engine.
- Executors server-side con Zod (`backend/src/clinical-actions/`).
- Documentación de command bar del censo (`docs/DASHBOARD_COMMAND_BAR.md`).
- IA: gateway sin writeback (`docs/AI_GATEWAY.md`).

---

## 5. Código de alto valor

| Ruta | Clasificación |
|------|---------------|
| `packages/shared/src/medical-action-universe/resolver.ts` | REWRITE_FROM_CONCEPT (cuarentena) |
| `packages/shared/src/clinical-decision-rules.ts` | MIGRATE_WITH_ADAPTATION |
| `backend/src/clinical-safety/safety-engine.ts` | MIGRATE_WITH_ADAPTATION |
| `backend/src/clinical-actions/executor.ts` | REWRITE_FROM_CONCEPT |
| `src/actions/action-registry.ts` | REFERENCE_ONLY (demasiado grande) |

---

## 6. Errores técnicos

1. **Múltiples resolvers** (dashboard, lab, text-search, intent-resolver, MAU, AI).
2. **Triple definición de formularios** (TS ×3 + JSON backend + handlers localStorage).
3. **117 actionIds** con gap `registry_only` vs server (`CLINICAL_ACTION_GAP_ANALYSIS.md`).
4. Modo demo sin PostgreSQL por defecto.

---

## 7. Errores de producto

- Flujo `Login → Inicio → Mi jornada` contradice **Centro de Comando** EPIS2.
- Catálogos masivos mock/Lyra — riesgo de deriva y volumen.
- Prototipo explícitamente no apto clínico real.

---

## 8. Errores de experiencia visual

- Radix/Tailwind — incompatible con MUI EPIS2.
- Bibliotecas clínicas densas en jornada (ruido vs command-first estricto).
- Diagnostics IA opcionales en command box.

---

## 9. Errores de gobierno

- Sprints 2–9 en paralelo documentados.
- `@epione/shared` bueno pero lógica duplicada en `src/services/`.

---

## 10. Dependencias problemáticas

| Dep | Clasificación |
|-----|---------------|
| Radix/Tailwind | FORBIDDEN_IN_EPIS2 (UI) |
| Cloudflare vite plugin | LEGACY_ONLY |
| Catálogos Lyra JSON | REJECT masivo |
| OpenMRS (solo docs) | REFERENCE_ONLY |

---

## 11. Seguridad y privacidad

- Auth mock en demo (`src/mocks/auth-credentials.ts`).
- RBAC server sin wildcard (positivo).
- Revisar catálogos voluminosos antes de cualquier import (PHI potencial en nombres genéricos).

---

## 12. Tests

- Tests unitarios en `packages/shared`, resolvers, backend.
- E2E `e2e/api-mode.spec.ts`.
- Declaración de no aptitud clínica.

---

## 13. Deuda técnica

- localStorage SoT vs API híbrida.
- action-registry ~1300+ líneas.
- Muchos actionIds sin executor.

---

## 14. Lecciones para EPIS2

- MAU y ranking de frases médicas chilenas.
- Safety engine separado de UI.
- Mantener IA read-only (EPIS2 ya lo exige).
- Un solo resolver + un solo form registry.

---

## 15. Nunca migrar

- `EpioneMasterDashboard`, `EpioneSmartDashboard`.
- `core-record-storage.ts` y handlers localStorage.
- UI Radix completa.
- Catálogos `data/catalogs/epione/lyra-*` sin curación.
- Cloudflare-specific build.

---

*Auditoría Fase A — repositorio EPIONE no modificado.*
