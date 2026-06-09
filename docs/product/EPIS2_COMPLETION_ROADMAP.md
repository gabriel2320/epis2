# EPIS2 — Roadmap de completitud (post-auditoría)

**Versión:** 1.3 · **Fecha:** 2026-06-09  
**Sistema:** [`EPIS2_DEV_SYSTEM.md`](./EPIS2_DEV_SYSTEM.md) · **Tablero:** [`EPIS2_TABLERO.md`](./EPIS2_TABLERO.md)  
**Plan global:** [`EPIS2_GLOBAL_DEV_PLAN.md`](./EPIS2_GLOBAL_DEV_PLAN.md) · **Disciplina RAD/MD3:** [`../design/EPIS2_RAD_M3_DISCIPLINE.md`](../design/EPIS2_RAD_M3_DISCIPLINE.md)
**Canon de ejecución:** [`EPIS2_WAVE_EXECUTION_CANON.md`](./EPIS2_WAVE_EXECUTION_CANON.md) — **fuente primaria** para agentes (precedencia, gates, tramos A–D, milestones 1A–1D).

> Las olas agrupan capacidades; **no** implican cola lineal estricta. Ver definición **EPIS2 Core completado** en el canon.

**Estado base:** Ola 0 cerrada · Ola 1 shell + **Command Engine CE-0→CE-5** + arco UX command-first · Ola 2 activa · **643+ tests** · 32 migraciones · **19 blueprints** · Hilo B palette+autocomplete ✓ · **CI master verde** (10/10 E2E preview, run [27222014998](https://github.com/gabriel2320/epis2/actions/runs/27222014998), 2026-06-09) · gates `quality:golden-journey` + `quality:ux-pilot` verdes

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

**Criterio cierre Ola 0:** baseline plataforma cerrada — **seguridad continúa transversalmente** (canon §6).

---

## Ola 1 — Milestones 1A–1D (núcleo productivo)

| Milestone | Contenido | Estado |
|-----------|-----------|--------|
| **1A** Shell clínico | Login, comando, rail, contexto, sesión, **wire híbrido + dock** | **Done** |
| **1B** Consulta mínima | SOAP, borrador/firma, **EpisClinicalFormActionBar** | **Done** |
| **1C** Indicaciones/resultados | Receta, lab, imagen, bandeja plana | **Partial** |
| **1D** IA asistida segura | Assist route CE-1/CE-3, sin firma IA | **Partial** |
| **CE** Command Engine | CE-0→CE-5 (registry, confirmación, prefill, badge) | **Done** |

Detalle histórico v1.0:

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
| WIDGET-01 en Comando/ficha | ◐ | bento ≤4; widgets bajo demanda |
| Sesión expirada / sin acceso | ✓ | `SessionExpiredPage`, `ForbiddenPage`, E2E login-gateway |
| Microcopy IA sin «Ollama» | ✓ | `copy/es.ts` |
| Historial comandos | ○ | API + UI |
| Comparación versiones borrador | ○ | `DraftReviewPage` |
| UX-G02 command-first E2E | ✓ | `e2e/ux-g02-command-first.spec.ts` |
| Wire híbrido Comando | ✓ | hero registry + dock compact |

**Journey:** `golden-v0-command-evolution` (obligatorio)

**Criterio aceptación Ola 1:**
- WIDGET-01 montado con máx. 2 widgets visibles en Comando.
- Pantalla sesión expirada.
- Copy IA clínico sin marca Ollama.
- Gates verdes.

**Riesgos:** widgets compiten con Power Bar — usar `resolveWidgetVisibility`.

---

## Ola 2 — Atención médica

| Capacidad | Estado | Dependencias |
|-----------|--------|--------------|
| Blueprint ingreso hospitalario | ✓ MF-157 | Ola 1 encuentros |
| Comando `haz ingreso` → formulario | ✓ | blueprint |
| Consulta ambulatoria (blueprint) | ✓ | encuentros |
| Traslado (form + comando) | ✓ | inpatient API |
| Certificado médico | ✓ MF-032 | impresión ◐ |
| Procedimiento (solicitud) | ✓ MF-B04 | IDC 57 · `procedure_request` |
| Cierre encuentro | ✓ MF-B04 | checkbox + API + revisión borrador |

**Rama sugerida:** `epis2-ola2-admission-blueprint`

**Archivos:** `packages/clinical-forms`, `command-registry`, `GeneratedClinicalFormPage`, `inpatient/`

**Journey:** `golden-v2-admission-discharge` — API ✓ · Playwright `e2e/golden-v2-admission-discharge.spec.ts` ✓

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

## Olas 1–9 — Inventario núcleo (IDC 1–100)

**Detalle:** [`EPIS2_ARCHITECTURE_INVENTORY_001_100.md`](./EPIS2_ARCHITECTURE_INVENTORY_001_100.md)

| Ola | IDC | Dominio | Entregable mínimo |
|-----|-----|---------|-------------------|
| 0–1 | 1, 21–26, 37, 52, 55–58, 91, 94 | Núcleo clínico | ✓ MVP actual |
| 2 | 31–40 | Consulta ambulatoria | Extender `outpatient_visit` + cierre 39 |
| 3 | 27–30 | Antecedentes | Blueprints mórbidos/familiares/hábitos |
| 4 | 2–10 | Recepción | Demografía IDC 5 + agenda |
| 5 | 11–20 | Facturación | **DEFERRED** Chile |
| 6 | 61–70 | Documentos legales | Consentimiento 65, licencia 61 |
| 7 | 71–80 | Epidemiología | ENO 72, IAAS 73 |
| 8 | 81–90 | Jefatura | KPIs + auditoría UI |
| 9 | 92–100 | IA + telemedicina | Voz 92, tele 99 **DEFERRED** |

---

## Olas 10–20 — Inventario extendido (IDC 101–200)

**Planificación completa:** [`EPIS2_ARCHITECTURE_INVENTORY_101_200.md`](./EPIS2_ARCHITECTURE_INVENTORY_101_200.md)

| Ola | IDC | Dominio | Entregable mínimo |
|-----|-----|---------|-------------------|
| 10 | 101–110 | Urgencias | Tab `urgencias` + blueprint `esi_triage` |
| 11 | 111–120 | Enfermería | `nursing_handover`, escalas caídas/UPP |
| 12 | 121–130 | APS | EMP, PHQ-9, PNI |
| 13 | 131–140 | UCI | **DEFERRED** programa UCI |
| 14 | 141–150 | IAAS | PROA, mapa aislamientos |
| 15 | 151–160 | Pabellón | Checklist OMS |
| 16 | 161–170 | Farmacia | TDM, RAM, Y-Site |
| 17 | 171–180 | Calidad | Centinela + ACR |
| 18 | 181–190 | Especialidades | **DEFERRED** |
| 19 | 191–196 | IA ops | Prompts UI + auditoría IA |
| 20 | 197–200 | IoT / interop | Consola HL7/FHIR unificada |

**Secuencia post-MVP:** 10 → 11 → 16 → 17 → 12 → 14 → 19 → 20.

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
