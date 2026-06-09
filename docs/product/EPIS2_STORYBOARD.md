# EPIS2 — Story board (estado vivo)

**Actualizado:** 2026-06-09 · **HEAD:** `7993f2c` · **CI:** [27181266125](https://github.com/gabriel2320/epis2/actions/runs/27181266125) ✅

Fuente operativa: [`EPIS2_GLOBAL_DEV_PLAN.md`](./EPIS2_GLOBAL_DEV_PLAN.md) · IDC: [`EPIS2_IDC_EXECUTION_MATRIX.md`](./EPIS2_IDC_EXECUTION_MATRIX.md)

---

## Hecho (último tramo)

| Historia | Evidencia |
|----------|-----------|
| CI pipeline completo verde | run 27181266125 — check, test, **10/10 E2E**, db:validate, golden-journey |
| E2E alineados con preview + UX-G03 | `7993f2c` — Firmar → borrador; paste-zone; ficha-history |
| PROG-THREE-MODES MF-01…08 | `quality:pm01` ✓ · `three-modes-journey` E2E |
| Fase A consolidación visual | RAD dashboard, acordeones, microfases MF-151→182 |
| Fase UX-1 tres modos MD3 | EPIS2-PM-01 cerrado |
| Golden V2 UI E2E | `golden-v2-admission-discharge` ✓ CI + local preview |
| UX-G02 command-first E2E | Partes A/B/C1 ✓ sin narrativos demo en preview |
| ClinicalTextBox E2E | rich + paste + orígenes + aprobación humana ✓ |

---

## En curso

| Historia | Notas |
|----------|-------|
| **Fase B** — completitud Ola 2 | Palette ✓ · autocomplete ✓ · pharmacy dashboard ✓ · golden V2 ✓ · CI E2E ✓ |
| Procedimiento nota clínica (≠ solicitud) | Deferred Ola 2+ |

---

## Siguiente (recomendado)

| Prioridad | Historia | Gate / entregable |
|-----------|----------|-------------------|
| **P1** | **Fase D — Tramo J farmacia** | Signoff clínico + UX-G02 piloto farmacia |
| P2 | Deuda E2E `tramo-c-admission` | Abrir `epis2-ficha-history` antes del CTA ingreso (drift con ficha compacta) |
| P3 | Ola 3 restante | Impresión clínica · piloto humano M3 |

Comando: `npm run quality:microphase-next` → Fase B (ledger MF cerrado).

---

## Backlog / riesgo

| Ítem | Impacto |
|------|---------|
| MUI Select en E2E | Preferir `getByRole('combobox')` en formularios, no `getByLabel` |
| Dependabot zod 4.x | PR aparte — no bloquea master |
| Storybook | 12 stories bootstrap; ampliar bajo demanda IDC |
| Evolab | Repositorio externo [epis2-evolab](https://github.com/gabriel2320/epis2-evolab) |

---

## Columnas por capa (snapshot)

```text
L0 Invariantes     ████████████████████  permanente
L1 Producto Ola 1  ██████████████████░░  CE + shell done · 1C/1D partial
L2 Tramos A–I      ████████████████████  signoff prep
L3 UX densidad     ████████████████████  MF-UI-SIMPLIFY done
L4 RAD MD3         ████████████████████  Fase A done
L5 clinical-prod   ████████████████░░░░  base · piloto extendido pendiente
L6 Tramo J         ████████░░░░░░░░░░░░  scaffold ✓ · signoff pendiente
```

---

## Frase guía

> Home = Centro de Comando · Borrador ≠ aprobado · IA no firma · PostgreSQL = SoT

Reportes de cierre: `reports/epis2-ci-e2e-closure-2026-06-09.md`
