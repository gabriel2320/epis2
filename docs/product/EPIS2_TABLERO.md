# EPIS2 — Tablero de desarrollo

**Actualizado:** 2026-06-09 · **HEAD:** `7993f2c` · **CI:** [27181266125](https://github.com/gabriel2320/epis2/actions/runs/27181266125) ✅

Sistema de nomenclatura: [`EPIS2_DEV_SYSTEM.md`](./EPIS2_DEV_SYSTEM.md) (SDEPIS2).

---

## Hecho

| Entrega / hito | Evidencia |
|----------------|-----------|
| CI pipeline completo | run 27181266125 — check, test, **10/10 E2E**, db:validate, golden-journey |
| Entrega CI-E2E | `7993f2c` — Firmar → borrador; paste-zone; ficha-history |
| PROG-THREE-MODES MF-01…08 | `quality:pm01` ✓ · `three-modes-journey` E2E |
| **Hilo A** — consolidación visual | RAD dashboard, acordeones, MF-151→182 |
| **Hilo UX-1** — tres modos MD3 | EPIS2-PM-01 cerrado |
| Golden V2 UI E2E | `golden-v2-admission-discharge` ✓ |
| UX-G02 command-first E2E | Partes A/B/C1 ✓ |
| ClinicalTextBox E2E | rich + paste + orígenes + aprobación ✓ |

---

## En curso

| Hilo | Notas |
|------|-------|
| **Hilo B** — Ola 2 | Palette ✓ · autocomplete ✓ · pharmacy dashboard ✓ · golden V2 ✓ · CI E2E ✓ |
| Procedimiento nota clínica (≠ solicitud) | Diferido Ola 2+ |

---

## Siguiente

| Prioridad | Hilo / tramo | Gate |
|-----------|--------------|------|
| **P1** | **Hilo D** — Tramo J farmacia | Signoff clínico + UX-G02 piloto |
| P2 | Deuda E2E `tramo-c-admission` | Abrir `epis2-ficha-history` antes del CTA ingreso |
| P3 | Ola 3 restante | Impresión clínica · piloto humano M3 |

`npm run quality:microphase-next` → ledger MF cerrado; seguir **Hilo B/D** en plan global.

---

## Backlog / riesgo

| Ítem | Impacto |
|------|---------|
| MUI Select en E2E | `getByRole('combobox')` en formularios |
| Dependabot zod 4.x | PR aparte |
| **Storybook** (herramienta UI) | 12 stories; ampliar por IDC — no es este tablero |
| Evolab | Repo externo [epis2-evolab](https://github.com/gabriel2320/epis2-evolab) |

---

## Capas (snapshot)

```text
L0 Invariantes     ████████████████████  permanente
L1 Ola 1           ██████████████████░░  CE + shell · hitos 1C/1D partial
L2 Tramos A–I      ████████████████████  signoff prep
L3 UX densidad     ████████████████████  MF-UI-SIMPLIFY done
L4 RAD MD3         ████████████████████  Hilo A done
L5 clinical-prod   ████████████████░░░░  base · piloto extendido pendiente
L6 Tramo J         ████████░░░░░░░░░░░░  scaffold ✓ · signoff pendiente
```

Reporte cierre E2E: `reports/epis2-ci-e2e-closure-2026-06-09.md`
