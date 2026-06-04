# Informe final — Auditoría proyectos legacy (EPIS, EPIDOS, EPIONE)

**Fecha:** 2026-06-04  
**Destino:** EPIS2 (`c:\Users\gdela\OneDrive\Documentos Importantes\EPIS2`)  
**Alcance:** Fases A–D completadas. **Sin integración productiva.** **Donantes no modificados.**

---

## 1. Resumen ejecutivo

Los tres repositorios donantes existen y fueron analizados en solo lectura (~5 200 archivos fuente totales). EPIS2 mantiene su arquitectura canónica (command-first, MUI, Fastify, PostgreSQL, registry único). Se crearon informes, manifiesto, zona de cuarentena con **4 extracciones controladas**, scripts de auditoría y gates automatizados.

> *EPIS, EPIDOS y EPIONE aportan conocimiento; EPIS2 decide qué merece sobrevivir.*

---

## 2. Estado de cada repositorio

| Repo | Estado | Rama | HEAD | Dirty | Archivos ~ |
|------|--------|------|------|-------|------------|
| EPIS | FOUND | mui-clinical-shell | a3b0ffe | Sí (~51) | 3858 |
| EPIDOS | FOUND | main | 38d59be | No | 513 |
| EPIONE | FOUND | feat/clinical-depth-sprints-5-9 | 72851ab | No | 832 |
| EPIS2 | (destino) | master | b2c47c9 | — | — |

**Repositorios faltantes:** ninguno.

**Git donantes — inicial = final:** no se ejecutó writeback; EPIS conserva cambios locales previos a la auditoría.

---

## 3. Errores principales por proyecto

| Proyecto | Top errores |
|----------|-------------|
| **EPIS** | OpenMRS/Carbon como infra dominante; doble shell UI; múltiples form registries; RAG/sidecar; writeback adapter |
| **EPIDOS** | Comandos por regex; `/commands/execute` sin validación pipeline; UI shadcn ≠ MUI EPIS2 |
| **EPIONE** | Home dashboard/jornada; localStorage SoT demo; 7+ resolvers; 117 actionIds con gap; UI Radix |

---

## 4. Lecciones aprendidas

1. Un solo registry de comandos y formularios evita deriva (EPIS2 ya lo cumple).
2. La IA debe ser read-only respecto a datos clínicos finales y aprobación.
3. PostgreSQL como SoT; no localStorage ni OpenMRS como home.
4. Aliases y sinónimos en español chileno son activo valioso (EPIS data/demo).
5. AI Gateway auditable (EPIDOS) es mejor patrón que sidecar+RAG para MVP.
6. MAU (EPIONE) aporta ranking NL; debe reescribirse, no copiarse.

---

## 5. Código candidato (resumen)

| ID | Proyecto | Recomendación |
|----|----------|---------------|
| epidos-chile-rut-validator | EPIDOS | **GO** |
| epis-clinical-safety-rules-demo | EPIS | **GO** |
| epis-command-synonyms-es-cl | EPIS | **REVIEW** |
| epione-mau-resolver-reference | EPIONE | **REVIEW** |
| epidos-ai-gateway | EPIDOS | REVIEW |
| epidos-fhir-golden | EPIDOS | GO (P2) |

---

## 6. Ideas candidatas (sin código)

- Pipeline interpret → validate → confirm (EPIDOS).
- Disambiguación «rx» receta vs radiografía (EPIS JSON).
- Worklist rules (EPIONE shared).
- Quality gates por fase (EPIDOS docs).

---

## 7. Código rechazado (explícito)

- `openmrs/`, Carbon shells, write-adapter, RAG/sidecar (EPIS).
- Regex command interpreter (EPIDOS).
- Dashboard Inicio, localStorage SoT, Radix UI, catálogos Lyra masivos (EPIONE).

---

## 8. Riesgos de migración

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Deriva de intents EPIS vs EPIS2 | Alta | Tabla de mapeo antes de aliases |
| CDS interpretado como bloqueo | Alta | Marcar advisory-only |
| Import accidental OpenMRS | Crítica | Gates `legacy:audit` + validate-quarantine |
| PHI en catálogos EPIONE | Media | No copiar JSON masivos |
| Segunda fuente de verdad | Alta | Manifiesto obligatorio |

---

## 9. Dependencias prohibidas (detectadas)

- **24** referencias `@openmrs` en `package.json` de EPIS (`migration/reports/forbidden-deps-latest.json`).
- Carbon en EPIS (scripts y paquetes legacy).
- Radix/shadcn (EPIDOS/EPIONE) — prohibido en UI EPIS2.

---

## 10. Resultados de seguridad

- Script `detect-secrets-and-sensitive-data.mjs`: **14** hallazgos (tipo + archivo, sin contenido).
- No se copiaron `.env`, lockfiles ni bases de datos.
- Extracciones marcadas `syntheticOnly` donde aplica.

---

## 11. Matriz de migración

Ver `docs/legacy-audit/EPIS2_MIGRATION_INTEGRATION_PLAN.md`.

---

## 12. Candidatos extraídos a cuarentena

| Carpeta | Origen |
|---------|--------|
| `migration/candidates/epidos/epidos-chile-rut-validator/` | EPIDOS rut.ts |
| `migration/candidates/epis/epis-command-synonyms-es-cl/` | EPIS JSON sinónimos |
| `migration/candidates/epis/epis-clinical-safety-rules-demo/` | EPIS clinical-safety |
| `migration/candidates/epione/epione-mau-resolver-reference/` | EPIONE MAU resolver |

---

## 13. Candidatos adaptados (proposed/)

- `proposed/rut.ts` (re-export EPIS2-ready).
- `proposed/evaluate.ts` (CDS cuarentena).
- README de adaptación para sinónimos y MAU.

**No movidos a `packages/` productivos.**

---

## 14. Tests creados

- `migration/candidates/epis/epis-clinical-safety-rules-demo/tests/safety.test.ts` (referencia Vitest en cuarentena; no ejecutado en CI raíz aún).

---

## 15. Próximo paso exacto

1. Revisión humana del manifiesto (`legacy-import-manifest.json`).
2. Aprobar `epidos-chile-rut-validator` → integrar en `packages/clinical-domain` con tests.
3. Definir tabla intent EPIS → EPIS2 antes de fusionar sinónimos.
4. Ejecutar `npm run legacy:audit` tras cambios en donantes (solo lectura).
5. **No** integrar MAU ni OpenMRS hasta nueva fase explícita.

---

## 16. Gates ejecutados

| Gate | Comando | Resultado |
|------|---------|-----------|
| Scan donantes | `npm run legacy:audit` | OK — JSON en `migration/reports/` |
| Manifiesto | `npm run legacy:validate-manifest` | (ejecutar tras pull) |
| Cuarentena | `npm run legacy:validate-quarantine` | (ejecutar tras pull) |
| Arquitectura EPIS2 | `npm run architecture:validate` | Sin cambios productivos |

---

## Archivos creados en EPIS2

```text
docs/legacy-audit/
  EPIS_AUDIT.md
  EPIDOS_AUDIT.md
  EPIONE_AUDIT.md
  LEGACY_PROJECT_COMPARISON.md
  LEGACY_DONOR_CATALOG.md
  EPIS2_MIGRATION_INTEGRATION_PLAN.md
legacy-import-manifest.json
migration/
  README.md
  candidates/ (4 candidatos)
  reports/ (5 JSON scan)
scripts/legacy-audit/ (7 scripts)
reports/epis2-legacy-projects-audit.md
package.json (scripts legacy:*)
```

---

## Criterios de aceptación

| # | Criterio | Cumple |
|---|----------|--------|
| 1–3 | Auditados sin modificar donantes + informes | Sí |
| 4–5 | Catálogo + manifiesto | Sí |
| 6–7 | Cuarentena, no producción | Sí |
| 8–10 | Sin carpetas completas / secretos / OpenMRS copiado | Sí |
| 11–12 | Procedencia + riesgos/tests definidos | Sí |
| 13–14 | Plan integración + español | Sí |
| 15–17 | Donantes intactos, canon EPIS2, sin integración productiva | Sí |

---

*Fin del informe Fase A–D.*
