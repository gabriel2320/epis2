# EPIS2 — Plan frontend: purga legacy, IA redundante y reformulación CICA

**Fecha:** 2026-06-17 · **Estado CICA:** NO-GO (reformulación obligatoria)  
**Canon:** [`EPIS2_PURGE_ARCHIVE_PLAN.md`](../docs/product/EPIS2_PURGE_ARCHIVE_PLAN.md) · [`EPIS2_CICA_L.md`](../docs/design/EPIS2_CICA_L.md) · [`EPIS2_CICA_CLEAN_ROOM_POLICY.md`](../docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md)

---

## Diagnóstico

| Zona | Problema | Riesgo |
|------|----------|--------|
| **Home clínica** | CICA default ON con UI incompleta / epis2g visual | Usuario cae en `/app` no listo |
| **`/espacio/*`** | Shell legacy grande pero funcional (golden journey) | Necesario como runtime activo |
| **`/app/*` CICA** | Stubs + deuda visual epis2g; score CICA-L < 90 en censo | NO-GO producto |
| **`design-agents/`** | Ollama en web para crítica UI (Modo diseño) | Redundante con dev:agent; off por defecto |
| **IA clínica** | `clinicalTextBoxAssist`, `useGeneratedFormAiAssist` | **Mantener** — capa producto con degradación |
| **Dual chart / three modes / dashboard** | Labs legacy con gates propios | No expandir; archivar cuando CICA GO |

---

## Principio rector

```text
Runtime activo = legacy /espacio (ficha-first, golden journey)
Laboratorio     = /app CICA (opt-in explícito, banner NO-GO)
Archivo         = design-agents, spikes, modos demo no usados en piloto
```

---

## Tramo 0 — Política y guardrails (MF-PURGE-CICA-08) ✓ esta sesión

| Entrega | Detalle |
|---------|---------|
| `VITE_ENABLE_CICA_UI=true` **opt-in** | Home = `/espacio/buscar-paciente` por defecto |
| `CICA_UI_PRODUCT_STATUS = 'no-go'` | Constante exportada; banner en `CicaAppLayout` |
| Renombrar `CicaEpis2gScreens` → `CicaSystemScreens` | Sin nomenclatura donante en código activo |
| Tests `cicaUiEnv.test.ts` | Default off; true solo con flag explícito |
| Docs policy | Clean Room Policy + purge plan alineados |

**Gate:** `npm run quality:fast`

---

## Tramo 1 — Perímetro legacy explícito (MF-PURGE-05)

**Allowlist:** `apps/web/src/routes/`, `apps/web/src/layouts/`, comentarios `@legacy-runtime`

1. Etiquetar `ClinicalShellLayout`, `PatientWorkspacePage`, rutas `/espacio/*` como `@legacy-runtime`.
2. Extraer mapa PR6 redirects a `apps/web/src/routes/cicaLegacyRedirects.ts` (solo helpers, sin mover rutas).
3. Gate doc: `quality:cica-no-legacy-shell-gate` sigue prohibiendo imports legacy en `apps/web/src/cica/`.
4. **Prohibido:** borrar `/espacio/*` hasta CICA-L-01 Censo ≥ 90.

**Gate:** `npm run quality:clinical`

---

## Tramo 2 — Poda IA redundante en web (MF-PURGE-09)

| Mantener | Archivar / acotar |
|----------|-------------------|
| `clinicalTextBoxAssist.ts` | `design-agents/*` → mover a `apps/web/src/lab/design-agents/` en MF dedicada |
| `useGeneratedFormAiAssist` | `ollamaDesignClient.ts` solo tras flag `EPIS2_DESIGN_AGENTS_ENABLED` |
| `useAiStatusQuery` (degradación) | Agentes dashboard/classic/threeModes no importados en shell productivo |
| API `@epis2/ai-client` | Duplicar prompts Ollama en web y en scripts dev |

**Criterio:** ningún import de `design-agents/` desde `pages/` salvo `dev/` y `design/EpisDesignModeProvider`.

**Gate:** nuevo `validate-web-no-design-agents-in-clinical-gate.mjs` + `quality:fast`

---

## Tramo 3 — Reformulación CICA (CICA-L, pantalla a pantalla)

**No código masivo.** Loop obligatorio por pantalla:

```text
Inventario → 1 intención → wireframe ASCII → ClinicalScreen → score ≥ 90 → merge
```

| Orden | Pantalla | Bloqueador actual |
|-------|----------|-------------------|
| CICA-L-01 | Censo `/app/censo` | Pendiente; único bloqueador home CICA |
| CICA-L-02…11 | Ya cerrados en legacy compositional | Re-port a `/app` sin epis2g visual |
| — | Sidebar dual epis2g | Sustituir por `CicaSidebar` canónico MD3 calm |
| — | `cicaEpis2gVisual.ts` | Eliminar tras tokens en `@epis2/epis2-ui` theme |

**Prohibido en este tramo:** nuevos stubs epis2g, blocks composicionales sin wireframe, default ON.

**Gate por pantalla:** `quality:cica-screen-inventory-gate` + `auditCicaScreen()` ≥ 90

---

## Tramo 4 — Activación producto (post reformulación)

Checklist antes de `VITE_ENABLE_CICA_UI` default ON:

- [x] CICA-L-01 Censo GO (score ≥ 90)
- [x] Golden journey completo en `/app/*` (no solo redirects)
- [x] `quality:golden-journey` verde con flag ON
- [ ] Walkthrough institucional GO PILOT
- [x] PR6 redirects validados E2E

---

## Archivos clave

```text
apps/web/src/dev/cicaUiEnv.ts          — flag + status NO-GO
apps/web/src/routes/home.ts            — resolveClinicalHome
apps/web/src/cica/                     — laboratorio /app
apps/web/src/layouts/                  — legacy shell
apps/web/src/design-agents/            — candidato archivo → lab/
packages/epis2-ui/src/cica/            — componentes canónicos (reformular)
scripts/quality/validate-cica-*        — gates frontera
```

---

## Próximo paso inmediato

1. Merge PR #40 (revert estructura epis2g) si pendiente.
2. Ejecutar **Tramo 0** (esta sesión) en rama `chore/frontend-cica-no-go-guardrails`.
3. Abrir **CICA-L-01 Censo** — wireframe en `reports/cica-l/01-censo-reform.md` antes de tocar UI.
