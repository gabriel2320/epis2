# EPIS2 — Tablero de desarrollo

**Actualizado:** 2026-06-09 · **HEAD:** `fb5ba23`+Fase 3 · **CI:** [27222014998](https://github.com/gabriel2320/epis2/actions/runs/27222014998) ✅

Sistema: [`EPIS2_DEV_SYSTEM.md`](./EPIS2_DEV_SYSTEM.md) · Auditoría: [`reports/epis2-audit-avance-proyecto-2026-06-09.md`](../../reports/epis2-audit-avance-proyecto-2026-06-09.md)

---

## Hecho

| Entrega / hito | Evidencia |
|----------------|-----------|
| CI pipeline completo | run [27222014998](https://github.com/gabriel2320/epis2/actions/runs/27222014998) — check, test, ci-parity, **10/10 E2E**, db:validate, golden-journey |
| Fix ci-parity (sin doble vitest) | `15b6131` · `--from-report` · ci-parity ~1s en CI |
| Entrega CI-E2E | `7993f2c` — Firmar → borrador; paste-zone; ficha-history |
| PROG-THREE-MODES MF-01…08 | `quality:pm01` ✓ · `three-modes-journey` E2E |
| **Hilo A** — consolidación visual | RAD dashboard, acordeones, MF-151→182 |
| **Hilo UX-1** — tres modos MD3 | EPIS2-PM-01 cerrado |
| **Hilo B** — Ola 2 productividad | Palette · autocomplete · golden V2 · procedure_request · cierre encuentro · farmacia · [`epis2-hilo-b-closure-2026-06-09.md`](../../reports/epis2-hilo-b-closure-2026-06-09.md) |
| Golden V2 UI E2E | `golden-v2-admission-discharge` ✓ |
| UX-G02 command-first E2E | Partes A/B/C1 ✓ |
| E2E Tramo C admission | `tramo-c-admission` 3/3 · [`epis2-tramo-c-admission-e2e-fix-2026-06-09.md`](../../reports/epis2-tramo-c-admission-e2e-fix-2026-06-09.md) |
| **Hilo D** — Tramo J farmacia | PEND-001 cerrado · `fa38e4d` · [`epis2-tramo-j-signoff-2026-06-09.md`](../../reports/epis2-tramo-j-signoff-2026-06-09.md) |
| **Piloto M3 automatizado** (V1–V6) | `2d77bfe` · `quality:m3-human-pilot` OK · 6/6 E2E · [`epis2-m3-human-pilot-2026-06-09.md`](../../reports/epis2-m3-human-pilot-2026-06-09.md) |
| Auditoría profunda | [`epis2-auditoria-profunda-2026-06-09.md`](../../reports/epis2-auditoria-profunda-2026-06-09.md) — plan 5 fases |
| Auditoría Fase 1 — higiene | `b27fdcd` · [`epis2-auditoria-fase1-higiene-2026-06-09.md`](../../reports/epis2-auditoria-fase1-higiene-2026-06-09.md) |
| Auditoría Fase 2 — robustez | `fb5ba23` · transacción approveDraft · JWT rol · E2E print en CI · [`epis2-auditoria-fase2-robustez-2026-06-09.md`](../../reports/epis2-auditoria-fase2-robustez-2026-06-09.md) |
| Auditoría Fase 3 — pulido M3 | `9b2b073` · tertiary + surfaceContainer* runtime · EpisDraftStatus roles clínicos · Admin/DraftReview al DS · motion a11y · [`epis2-auditoria-fase3-pulido-m3-2026-06-09.md`](../../reports/epis2-auditoria-fase3-pulido-m3-2026-06-09.md) |
| Auditoría Fase 4 — deuda estructural | side-effects approveDraft modulares · GeneratedClinicalFormPage dividido · tabla control migraciones · tests admin/DraftReview/TabShell · layers-gate en CI · [`epis2-auditoria-fase4-deuda-2026-06-09.md`](../../reports/epis2-auditoria-fase4-deuda-2026-06-09.md) |

---

## En curso

| Hilo | Notas |
|------|-------|
| **Hilo C** — Ola 3 longitudinal | Receta A5 ✓ · piloto M3 automatizado ✓ (signoff humano opcional) · [`epis2-hilo-c-p1-print-prescription-2026-06-09.md`](../../reports/epis2-hilo-c-p1-print-prescription-2026-06-09.md) |

---

## Siguiente

| Prioridad | Hilo / tramo | Gate |
|-----------|--------------|------|
| **P1** | Impresión clínica restante (carta / más A5) | PEND-006 parcial · `quality:ola6a-print-gate` |
| P1b | Alto contraste ampliado (3.6 diferido — requiere signoff visual) | [`epis2-auditoria-fase3-pulido-m3-2026-06-09.md`](../../reports/epis2-auditoria-fase3-pulido-m3-2026-06-09.md) |
| P1c | Fase 5 auditoría — checklist pre-producción (solo si sale del laboratorio) | [`epis2-auditoria-profunda-2026-06-09.md`](../../reports/epis2-auditoria-profunda-2026-06-09.md) §7 |
| P2 | Patrón combobox MUI en E2E (PEND-004) | Helper / docs testing |
| P3 | Backlog Ola 2+ | Nota procedimiento clínica (PEND-002 defer) |

`npm run quality:microphase-next` → ledger MF cerrado; seguir **Hilo C** en plan global.

---

## Backlog / riesgo

| Ítem | Impacto |
|------|---------|
| PEND-002 defer | Nota post-procedimiento (IDC 58+) — no bloquea Ola 2 |
| MUI Select en E2E | `getByRole('combobox')` en formularios |
| Dependabot zod 4.x | PR aparte |
| **Storybook** (herramienta UI) | 12 stories; ampliar por IDC |
| Evolab | Repo externo [epis2-evolab](https://github.com/gabriel2320/epis2-evolab) |

---

## Capas (snapshot)

```text
L0 Invariantes     ████████████████████  permanente
L1 Ola 1           ██████████████████░░  CE + shell · hitos 1C/1D partial
L2 Tramos A–J      ████████████████████  scaffold · Tramo J signoff cerrado
L3 UX densidad     ████████████████████  MF-UI-SIMPLIFY done
L4 RAD MD3         ████████████████████  Hilo A done
L5 clinical-prod   ██████████████████░░  base · piloto M3 automatizado OK · extensión clínica pendiente
L6 Tramo J         ████████████████████  signoff PEND-001 cerrado 2026-06-09
L1 Ola 2 Hilo B    ████████████████████  cerrado 2026-06-09 · PEND-002 defer
```

Reporte cierre Hilo B: `reports/epis2-hilo-b-closure-2026-06-09.md` · Pendientes: `reports/epis2-pendientes-registro-2026-06-09.md`
