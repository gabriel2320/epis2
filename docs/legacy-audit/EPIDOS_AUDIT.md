# Auditoría EPIDOS (solo lectura)

**Repositorio:** `c:\Users\gdela\OneDrive\Documentos Importantes\Epidos`  
**Estado:** FOUND  
**Rama:** `main`  
**HEAD:** `38d59be` — feat(UI-007/PR2): primitivos shadcn + wrappers clínicos  
**Cambios locales:** limpio (`git status` sin dirty)  
**Archivos analizados (aprox.):** 513

---

## 1. Resumen ejecutivo

EPIDOS es el **antecedente más cercano al canon EPIS2**: monorepo npm, Fastify, PostgreSQL, Drizzle, Ollama, barra de comandos, documentación de fases y quality gates. No usa OpenMRS ni Carbon. Su debilidad principal es el **intérprete de comandos por regex** sin registry declarativo único y un **hueco de validación** en `POST /commands/execute`.

---

## 2. Visión original

Ficha médica electrónica **minimalista**, **local-first**, médico-centrada, con IA local y auditoría (`docs/architecture/EPIDOS_CORE_VISION.md`).

---

## 3. Arquitectura encontrada

| Capa | Stack |
|------|--------|
| Frontend | React 19, Vite, shadcn (UI-007) — `apps/web/` |
| Backend | Fastify — `apps/api/` |
| DB | PostgreSQL 16 + pgvector — `packages/db/` |
| Dominio | `packages/clinical-core/` (comandos, informes) |
| IA | `packages/ai/` + AI Gateway `apps/api/src/ai-gateway/` |
| Conectores | FHIR golden — `packages/connectors/` |
| Desktop | Tauri — `apps/desktop/` |

---

## 4. Funciones útiles

- Pipeline comando: interpretar → validar → confirmar (`command-pipeline.ts`).
- AI Gateway sin ejecutar comandos de escritura (`action-proposal.ts`).
- Auditoría en `audit_logs` (`apps/api/src/services/audit.ts`).
- Export FHIR con tests golden.
- Validación RUT (`packages/shared/src/rut.ts`) — **extraída a cuarentena**.

---

## 5. Código de alto valor

| Ruta | Clasificación |
|------|---------------|
| `packages/shared/src/schemas-clinical.ts` | MIGRATE_WITH_ADAPTATION |
| `packages/clinical-core/src/command-pipeline.ts` | REWRITE_FROM_CONCEPT |
| `apps/api/src/ai-gateway/` | MIGRATE_WITH_ADAPTATION |
| `packages/connectors/src/fhir/golden/` | MIGRATE_WITH_ADAPTATION |
| `packages/shared/src/rut.ts` | MIGRATE_WITH_ADAPTATION (en cuarentena) |

---

## 6. Errores técnicos

1. `/commands/execute` no reutiliza `processCommand` ni `validation.valid`.
2. Intérprete regex monolítico (`command-interpreter.ts` + extensions).
3. `structuredPayload: z.record(z.unknown())` — formularios sin schema fuerte.
4. Drift docs: README pide `nomic-embed-text`; código usa bge-m3 (ADR-023).
5. Proveedores cloud en árbol (`openai.ts`, etc.) aunque gated.

---

## 7. Errores de producto

- Sin registry declarativo único de comandos (escala limitada).
- MVP no certificado legalmente (correctamente advertido en README).
- shadcn como UI — **incompatible** con canon MUI EPIS2 (solo conceptos).

---

## 8. Errores de experiencia visual

- shadcn/Tailwind vs MUI EPIS2 — no migrar componentes.
- Confirmación de comandos dependiente de UI, no siempre del API execute.

---

## 9. Errores de gobierno

- Documentación de fases madura (ROADMAP, QUALITY_GATES) — buen modelo para EPIS2.
- E2E Playwright fuera de `npm run check`.

---

## 10. Dependencias problemáticas

| Dep | Clasificación |
|-----|---------------|
| shadcn/Radix | REPLACE_IN_EPIS2 (MUI) |
| pgvector/RAG | UNKNOWN_REQUIRES_REVIEW (fuera MVP EPIS2) |
| OpenAI/Gemini clients | FORBIDDEN_IN_EPIS2 si no gated estricto |
| OpenMRS (docs research) | REFERENCE_ONLY |

---

## 11. Seguridad y privacidad

- Procesamiento local documentado; sin OpenMRS runtime.
- Credenciales demo en README — solo dev.
- JWT + roles explícitos (`physician`, `admin`, `nurse`, `readonly`).

---

## 12. Tests

- ~59 archivos `*.test.ts` (Vitest).
- 5 specs Playwright E2E (mockean API).
- Golden FHIR bundles.

---

## 13. Deuda técnica

- Regex commands vs registry EPIS2.
- UI stack distinto.
- RAG/pgvector opcional no alineado con EPIS2 MVP.

---

## 14. Lecciones para EPIS2

- AI Gateway auditable como patrón (ya parcial en `@epis2/local-ai`).
- Quality gates y ADRs por fase.
- FHIR export con golden tests.
- **No** copiar execute sin validación.

---

## 15. Nunca migrar

- `command-interpreter.ts` tal cual.
- UI shadcn completa.
- Proveedores cloud sin política EPIS2.
- Docker/Tauri desktop como requisito MVP.

---

*Auditoría Fase A — repositorio EPIDOS no modificado.*
