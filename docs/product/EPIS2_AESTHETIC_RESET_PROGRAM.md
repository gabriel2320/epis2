# PROG-AESTHETIC-RESET — Clinical Calm Premium

**Programa:** `PROG-AESTHETIC-RESET` · **Versión:** 1.0 · **Fecha:** 2026-06-16  
**Estado:** En curso · **Congelamiento clínico:** vigente  
**Baseline:** PASS WITH FIXES UX-LAB · informe [`reports/epis2-aesthetic-architecture-audit-2026-06-16.md`](../../reports/epis2-aesthetic-architecture-audit-2026-06-16.md)

> **Tesis:** EPIS2 no necesita más funciones; necesita **cirugía composicional**.  
> **Regla:** Una pantalla = una intención clínica = una acción principal.

**Canon estético:** [`EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md`](../design/EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md) · [`EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md`](../design/EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md)

---

## Principios obligatorios

1. **Una acción principal por pantalla** — censo: abrir ficha; evolución: escribir; papel: leer/navegar.
2. **Máx. 1 botón primario + 2 secundarios visibles** — resto en menú «Más» (`EpisPrimaryActionBar`).
3. **Ficha clásica = ficha médica tabulada** — no dashboard con cards compitiendo.
4. **Modo papel = pantalla exclusiva** — `/espacio/ficha/papel`, navegación día anterior/hoy/siguiente.
5. **Clinical Calm Premium como default** — regla 80/15/5; `clinical-calm` post MF-AEST-04.

---

## Microfases

| MF | Objetivo | Gate | Estado |
|----|----------|------|--------|
| **MF-AEST-01** | Desaturación acciones · `EpisPrimaryActionBar` | `quality:aesthetic-action-density-gate` | **Hecho** |
| **MF-AEST-02** | Composición ficha clásica (5 tabs + Más) | `quality:classic-chart-composition-gate` | **Hecho** |
| **MF-AEST-02b** | Tab overflow «Más» (medicamentos) | `quality:classic-chart-composition-gate` | **Hecho** |
| **MF-AEST-03** | Papel standalone + nav diaria | `quality:paper-mode-standalone-gate` | **Hecho** |
| **MF-AEST-04** | Default `clinical-calm` | `quality:clinical-calm-default-gate` | **Hecho** |
| **MF-AEST-05** | Navegación / breadcrumb / volver | `quality:clinical-navigation-clarity-gate` | **Hecho** |
| **MF-AEST-06** | CICA scoring + loop CICA-L | `quality:cica-loop-close-gate` | **Hecho** · PR-AEST-07 |

---

## Orden de PRs recomendado

1. **PR #35** — MF-AEST-01 (PrimaryActionBar, gates densidad)
2. **PR #36** — MF-AEST-02 (ficha clásica tabulada)
3. **PR #37** — MF-AEST-03 (papel exclusivo) ← **prioridad visual**
4. **PR #38** — MF-AEST-04 (Calm default)
5. **PR #39** — MF-AEST-05/06 (gates cierre + signoff)

---

## Prohibiciones

```text
NO features clínicas nuevas · NO schemas · NO migraciones
NO cambiar aprobación/firma · NO frontera IA
NO scripts root nuevos · NO dashboards en ficha clásica
NO modo papel como card secundaria apretada
```

---

## Criterios rc4

```text
[x] MF-AEST-01 cerrado
[x] MF-AEST-03 cerrado
[x] Modo papel pantalla exclusiva + nav día anterior/siguiente
[x] 0 UX-BLOCKER · quality:ux-lab-close verde
[x] quality:aesthetic-reset-close verde
[x] Walkthrough humano aprobado
```

**No taguear `v0.1-demo-rc4` si el modo papel sigue embebido en ficha clásica.**

---

## Validación

```bash
npm run quality:gate -- quality:aesthetic-layout-gate
npm run quality:gate -- quality:aesthetic-action-density-gate
npm run quality:gate -- quality:paper-mode-standalone-gate
npm run quality:gate -- quality:aesthetic-reset-close
npm run quality:gate -- quality:cica-loop-close
npm run quality:gate -- quality:clinical-calm-default-gate
npm run quality:gate -- quality:pr-aest-07-close
npm run quality:gate -- quality:root-script-surface-gate
```

---

**Norma:** [`EPIS2_CLINICAL_LAYOUT_MANIFESTO.md`](../design/EPIS2_CLINICAL_LAYOUT_MANIFESTO.md) · **CICA:** [`EPIS2_CICA.md`](../design/EPIS2_CICA.md) · **Motor:** [`EPIS2_CLINICAL_LAYOUT_ENGINE.md`](../design/EPIS2_CLINICAL_LAYOUT_ENGINE.md) · **Pantallas:** [`EPIS2_CLINICAL_SCREEN_MAP.md`](../design/EPIS2_CLINICAL_SCREEN_MAP.md)

## Clinical Layout Engine

Motor composicional canónico en `@epis2/epis2-ui/layout/clinical/`:

```text
Screen intent → Layout profile → Grid template → Density budget
→ Section ordering → Action governor → Visual validation gate → Render
```

| Artefacto | Rol |
|-----------|-----|
| `ClinicalScreen` | Shell — declara perfil e intención |
| `ClinicalLayoutActionBar` | Gobernador de botones (1+2+Más) |
| `ClinicalFieldGrid` | Tabulación simétrica de campos |
| `ClinicalSection` | Sección con profundidad máx. 2 |
| `clinicalLayoutEngine.ts` | Perfiles, normalizeActions, audit, getFieldSpan |

Gate: `quality:aesthetic-layout-gate` · E2E: `e2e/aesthetic-classic-mode.spec.ts`

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
