# EPIS2 — Resumen ejecutivo de auditoría general

**Fecha:** 2026-06-04 · **Alcance:** Monorepo completo · **Modo:** Solo lectura (sin cambios de código)

---

## Veredicto (una frase)

**EPIS2 tiene arquitectura y gates sólidos en código, pero el estado operacional real es “demo avanzado no consolidado”: ~188 archivos sin commit concentran el arco UX + Command Engine CE-0→CE-5, mientras la documentación y el roadmap aún reflejan cifras y pendientes desactualizados.**

---

## Estado global

| Área | Nivel |
|------|-------|
| Madurez técnica | **7/10** — monorepo coherente, 17 gates arquitectónicos, 511 tests |
| Madurez clínica (demo) | **6/10** — golden journeys + 5 casos DEMO; producción real no |
| Madurez UX/producto | **7/10** — command-first implementado; piloto humano parcial |
| Gobernanza Git | **3/10** — trabajo masivo sin commit ni tag de cierre |
| Documentación | **5/10** — canon fuerte, deriva numérica y duplicación en `reports/` |

---

## Tabla por dimensión

| Dimensión | Estado |
|-----------|--------|
| Arquitectura | **OK** |
| Frontend | **Parcial** (UX wire híbrido sin commit) |
| Backend | **OK** |
| Base de datos | **OK** (32 migraciones) |
| IA local | **Parcial** (assist route; offline OK) |
| Command Engine | **Parcial** (CE-0→CE-5 en working tree) |
| UX/UI | **Parcial** (M3 + LAYOUT-G12 clínico; admin dev fuera) |
| Formularios | **OK** (19 blueprints) |
| Impresión | **Parcial** (A5/certificado; no full print suite) |
| Datos demo | **OK** (5 casos + narrativas) |
| Tests | **OK** (511 unit; 24 E2E specs) |
| Documentación | **Riesgo** (contradicciones 405 vs 511 tests) |
| Seguridad clínica | **OK** (gates human-approval, ai-boundary) |
| Interoperabilidad | **Parcial** (FHIR/HL7 frontera API) |
| Producto/piloto | **Pendiente** (signoff humano; commit arco UX) |

---

## Riesgos principales (P0–P1)

1. **P0** — ~188 archivos modificados/no trackeados sin commit (pérdida, imposible revisión PR).
2. **P1** — Docs (`EPIS2_COMPLETION_ROADMAP.md`, `epis2-audit-reconcile`) dicen 405 tests; realidad **511**.
3. **P1** — `quality:golden-journey` no ejecutado en esta auditoría (No verificado reciente).
4. **P1** — Roadmap marca sesión expirada/WIDGET-01 pendientes; código ya tiene auth-adjacent + wire híbrido.
5. **P2** — Storybook 12 stories; sin cobertura hero/dock/suggestion cards nuevos.
6. **P2** — Admin/dev conserva `Paper outlined` (9 ocurrencias) — LAYOUT-G12 parcial.

---

## Recomendación estratégica

**Estabilizar y preparar piloto** — no agregar dominios clínicos nuevos hasta:

1. Commit + tag del arco UX + Command Engine.
2. Sincronizar roadmap/IDC con gates reales.
3. Ejecutar `quality:golden-journey` + `quality:ux-pilot` en CI o pre-piloto.
4. Signoff clínico humano (`PILOT_DEMO_CHECKLIST.md`).

---

## Gates verificados hoy

| Gate | Resultado |
|------|-----------|
| `npm run check` | ✅ OK |
| `npm run test` | ✅ **511** tests / **190** archivos |
| `npm run db:validate` | ✅ 32 migraciones |
| `npm run storybook:ui:build` | ✅ OK (chunks >500kB warning) |
| `quality:golden-journey` | ⬜ No verificado esta sesión |
| `quality:ux-pilot` | ⬜ No verificado esta sesión (E2E UX-G02 pasó en sesión previa) |

---

## Entregables

- Detalle completo: [`epis2-general-audit-2026-06-04.md`](./epis2-general-audit-2026-06-04.md)
- Backlog: [`epis2-backlog-consolidated-2026-06-04.md`](./epis2-backlog-consolidated-2026-06-04.md)
