# EPIS2 — Roadmap de completitud (post-auditoría)

**Versión:** 1.0 · **Fecha:** 2026-06-05  
**Alcance:** Secuencial; una rama funcional activa; sin implementación masiva en esta sesión.

**Estado base:** Planes A–G cerrados; 228 tests; 22 migraciones; golden V0–V5 en CI; GO DEMO signoff.

---

## Ola 0 — Seguridad y CI

| Capacidad | Estado | Dependencias |
|-----------|--------|--------------|
| Drizzle ORM sin vulnerabilidad alta | ◐ | Verificar advisory actual |
| PostgreSQL en CI | ✓ | `.github/workflows/ci.yml` |
| Golden journey obligatorio CI | ✓ | V0–V5 API |
| Signoff humano GO DEMO | ✓ | `epis2-plan-f-complete.md` |
| `npm audit --omit=dev` en CI | ✓ | Plan G |
| Dependabot | ✓ | semanal |
| Vitest 4.x (GHSA dev) | ○ | Pendiente upgrade |

**Gate:** `npm run check` · `test` · `db:validate` · `quality:golden-journey`

**Criterio cierre Ola 0:** audit prod deps verde + Drizzle actualizado si aplica.

---

## Ola 1 — Núcleo productivo

| Capacidad | Estado | Archivos afectados |
|-----------|--------|-------------------|
| Login | ✓ | `LoginPage.tsx` |
| Centro de Comando | ✓ | `CommandCenterPage.tsx` |
| Pacientes búsqueda + contexto | ✓ | `patient_search`, `ActivePatientContext` |
| Encuentros | ◐ | API demo |
| Resumen | ◐ | `patient_summary` |
| Evolución | ✓ | golden V0 |
| Borradores + aprobación | ✓ | `DraftReviewPage`, API drafts |
| Auditoría lectura | ◐ | quality tab |
| WIDGET-01 en Comando/ficha | ○ | `ClinicalWidgetPanel`, widgets pkg |
| Sesión expirada / sin acceso | ○ | router, auth |
| Microcopy IA sin «Ollama» | ○ | `copy/es.ts` |
| Historial comandos | ○ | API + UI |
| Comparación versiones borrador | ○ | `DraftReviewPage` |

**Journey:** `golden-v0-command-evolution` (obligatorio)

**Criterio aceptación Ola 1:**
- WIDGET-01 montado con máx. 2 widgets visibles en Comando.
- Pantalla sesión expirada.
- Copy IA clínico sin marca Ollama.
- Gates verdes.

**Riesgos:** widgets compiten con Power Bar — usar `resolveWidgetVisibility`.

---

## Ola 2 — Atención médica

| Capacidad | Dependencias |
|-----------|--------------|
| Blueprint ingreso hospitalario | Ola 1 encuentros |
| Comando `haz ingreso` → formulario | blueprint |
| Consulta ambulatoria (blueprint) | encuentros |
| Procedimiento / certificado | ○ |
| Traslado (form + comando) | inpatient API ✓ |
| Cierre encuentro | encuentros |

**Rama sugerida:** `epis2-ola2-admission-blueprint`

**Archivos:** `packages/clinical-forms`, `command-registry`, `GeneratedClinicalFormPage`, `inpatient/`

**Journey:** extender `golden-v2-admission-discharge`

---

## Ola 3 — Historia longitudinal

| Capacidad | Dependencias |
|-----------|--------------|
| Formulario alergia / problema | paciente CRUD |
| Timeline dedicado invocable | API longitudinal ✓ |
| Documentos UI | API intake ✓ |
| Resultados recientes (lectura) | Ola 2 órdenes |
| Comandos `revisa medicamentos`, `ver pendientes` | registry |

**Journey:** `golden-v1-longitudinal-review` ampliado

---

## Ola 4 — Hospitalización

| Capacidad | Dependencias |
|-----------|--------------|
| Censo UI dedicado | service dashboard ✓ |
| Rondas / evolución diaria hosp. | ingreso blueprint |
| Pendientes / críticos UI | API ack ✓ |
| Alta operativa E2E UI | discharge form |
| Entrega turno | enfermería |

**Journey:** golden V2 completo humano

---

## Ola 5 — Enfermería y farmacia

| Capacidad | Estado |
|-----------|--------|
| Nota enfermería | ✓ |
| MAR administración | ◐ |
| MAR programado UI | ◐ DB ✓ |
| Tableros rol | ◐ |
| Conciliación form | ○ |
| Validación farmacia | ◐ |

**Journey:** `golden-v3-mar-nursing`

---

## Ola 6 — Documentos e interoperabilidad

| Capacidad | Estado |
|-----------|--------|
| OCR UI | ○ |
| Búsqueda clínica UI | ◐ RAG panel |
| FHIR export | ✓ |
| FHIR import | ○ |
| HL7 writeback | ○ |
| Impresión | ◐ PDF |

**Journey:** `golden-v4-interop-ops`

---

## Ola 7 — IA avanzada segura

| Capacidad | Estado |
|-----------|--------|
| Assist borrador | ✓ |
| RAG con citas | ✓ |
| Resumen 24h | ✓ |
| Evals sintéticas | ✓ `ai:evals` |
| NL interpretación (no solo registry) | ○ |
| Prompts versionados UI | ○ |
| Completeness check | ○ |

**Journey:** `golden-v5-ai-traceable`

---

## Ola 8 — Hardening y piloto

| Capacidad | Notas |
|-----------|-------|
| OIDC / SSO | Plan F documentado |
| RLS enforce producción | migración 022 piloto |
| Backups automatizados CI | `db:backup` script ✓ |
| Admin UI mínima | usuarios/roles |
| Localización Chile operativa | FONASA, GES, etc. |

---

## Ola 9 — Producción clínica (fuera de alcance actual)

No declarar EPIS2 listo para producción clínica real hasta cerrar Ola 8 + signoff institucional.

---

## Reglas de implementación

1. Máximo **una rama funcional** activa.
2. Cada rama cierra **una capacidad vertical** con journey.
3. No avanzar si `architecture:validate` falla.
4. No segundo Command/Form Registry.
5. No cambiar stack (React, Fastify, PostgreSQL, MUI).
6. No renombrar rutas masivamente sin ola dedicada «nomenclatura canónica».
7. Reporte en `reports/` al cierre de cada ola.

---

## Alineación nomenclatura rutas (ola futura, DEFERRED)

| Canónico producto | Actual | Acción |
|-------------------|--------|--------|
| `/ingresar` | `/login` | Redirect alias |
| `/pacientes/:id` | `/espacio/ficha?patientId=` | Migración gradual |
| `/trabajo/:activity` | `/espacio/:activity` | Migración gradual |
| `/tablero` | `/epis2/dashboard` | Redirect alias |

**No iniciar** sin ola explícita — alto riesgo de romper journeys y bookmarks.

---

## Próxima rama prioritaria (única)

```text
epis2-ola1-core-shell
```

**Objetivo:** Cerrar brechas Ola 1 sin nuevos dominios clínicos.

| # | Entregable |
|---|------------|
| 1 | WIDGET-01 montado en Comando y ficha (visibilidad reglas) |
| 2 | Pantalla sesión expirada + unificación 403 |
| 3 | Microcopy IA: «Asistencia de IA disponible» (sin Ollama) |
| 4 | Fix `validateSearch` tabs nursing/pharmacy |
| 5 | Documentar addendum slices en `SCOPE_V1.md` |

**Gates:** `check` · `test` · `db:validate` · `quality:golden-journey`

**Commit sugerido:**
```text
docs(product): auditoría catálogo completo y roadmap Ola 1

Inventario de pantallas, formularios y conexiones frente al catálogo
command-first. Sin implementación de dominios nuevos.
```

---

## Referencias

- Auditoría previa: `reports/epis2-audit-and-dev-plans-2026-06-05.md`
- Gap audit: `reports/epis2-complete-product-gap-audit.md`
- Journeys: `docs/quality/EPIS2_GOLDEN_JOURNEYS.md`
