# EPIS2 — Reporte consolidado: arco UX command-first (CE-0 → CE-5)

**Fecha:** 2026-06-07 · **Estado:** Código + E2E verificados · checklist humano opcional  
**Canon:** `docs/PRODUCT_CANON.md` · `docs/product/PRODUCT_INVARIANTS.md`

---

## Veredicto

El arco **command-first** del piloto UX está **implementado y verificado en CI**:

```text
intención → sugerencia → confirmación → formulario revisable → ficha compacta
```

Home = **Centro de Comando** (`/comando`). Modo tablero = secundario. IA no aprueba ni firma.

---

## Fases entregadas

| Fase | Alcance | Reporte |
|------|---------|---------|
| Fix blank page | Telemetría fuera del barrel web | `reports/epis2-vista1-command-center-2026-06-07.md` |
| Vista 1 | Dock flotante + bento opcional | idem |
| Vista 2 | Ficha split + dock compact | `reports/epis2-vista2-patient-workspace-2026-06-07.md` |
| UX-C | Tableros planos (11 tabs + worklists + grids) | `reports/epis2-ux-c-d-dashboards-forms-2026-06-07.md` |
| UX-D | Guardar · Firmar · ⋯ (UX-G03) | idem |
| Vista 3 | Login gateway M3 | `reports/epis2-vista3-login-gateway-2026-06-07.md` |
| UX-G02 E2E | CE-0 → CE-5 automatizado | `e2e/ux-g02-command-first.spec.ts` |

---

## CE-0 → CE-5 (Command Engine)

| ID | Capacidad | Verificación |
|----|-----------|--------------|
| CE-0 | Resolve determinístico desde Power Bar | Registry + unit tests |
| CE-1 | Assist route / sugerencias | CommandCenterPage |
| CE-2 | Confirmación `needs_confirmation` | E2E Parte A/C1 |
| CE-3b | Slot prefill en formulario | E2E Parte A (modalidad TC, estudio) |
| CE-4 | Prefill contextual evolución | E2E Parte B |
| CE-5 | Badge + URL limpia post-montaje | E2E Parte A |

---

## Gates UX-G

| Gate | Criterio | Estado |
|------|----------|--------|
| UX-G01 | Home comando ≤4 bloques + Power Bar | ✅ Vista 1 |
| UX-G02 | Ficha resumen compacta | ✅ Vista 2 + E2E B |
| UX-G03 | Formulario ≤3 acciones visibles | ✅ UX-D |
| UX-G04 | Rail ≤5 destinos mentales | ⚠️ sin refactor registry (fuera alcance) |
| UX-G05 | Sin marcos anidados (LAYOUT-G12) | ✅ tableros + ficha + login + historial + bandeja resultados |

---

## Gates técnicos (sesión)

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — **508** tests |
| `npm run db:validate` | OK |
| `quality:ux-pilot-gate` | OK — evidencia estática |
| `quality:ux-pilot` | OK — UX-G02 API 9/9 + E2E 5/5 |
| E2E UX-G02 | **3/3 PASS** |
| E2E login gateway | **2/2 PASS** |
| `architecture:validate` | OK |

---

## UX-C ampliado (esta sesión)

Tableros migrados a `EpisWorkspaceSection`:

- Nursing, Service, Pharmacy, Patient, Emergency, Reception
- APS, OR, Specialty
- Quality/ICU (previo) + `QualityDashboardGrids`
- `DashboardWorklists`, `ServiceDashboardCharts`

Script reutilizable: `scripts/qa/flatten-dashboard-sections.mjs`

**Bandeja resultados (Ola 1C):** `ResultsInboxPage`, `ResultsInboxTrends` → `EpisWorkspaceSection` · `reports/epis2-ux-results-inbox-flat-2026-06-07.md`

---

## Riesgos residuales

| Riesgo | Mitigación |
|--------|------------|
| Checklist humano ≤30 s no cronometrado | Automatizado E2E 5/5; checklist opcional |
| UX-G04 rail definitivo | Piloto antes de fijar registry |
| `Paper` en admin/dev (`AdminConsolePage`, `BlueprintStudioPanel`) | Fuera alcance clínico piloto |

---

## Vista 3 ampliada (auth-adjacent)

| Pantalla | Mejora |
|----------|--------|
| `/login` | Gateway M3 (previo) |
| `/sesion-expirada` | Mismo `EpisAuthScreen` + acción filled |
| `/sin-acceso` | Mismo patrón gateway |

E2E: `e2e/login-gateway.spec.ts` · `npm run test:e2e:login-gateway`

---

## Gate piloto UX

```bash
npm run quality:ux-pilot-gate   # estático — archivos, EpisWorkspaceSection, sin Paper outlined
npm run quality:ux-pilot        # API + E2E completo
```

---

## Próximo paso

1. Commit/push del arco UX cuando lo solicites.
2. Ola producto según `docs/product/EPIS2_COMPLETION_ROADMAP.md`.
3. UX-G04 rail (piloto) — fuera de alcance MVP UX.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
