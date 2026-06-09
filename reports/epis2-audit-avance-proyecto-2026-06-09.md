# EPIS2 — Auditoría de avance del proyecto

**Fecha:** 2026-06-09 · **HEAD:** `7f68f17` · **Rama:** `master` (sync con origin)  
**Sistema:** [SDEPIS2](../docs/product/EPIS2_DEV_SYSTEM.md) · **Tablero:** [EPIS2_TABLERO.md](../docs/product/EPIS2_TABLERO.md)

---

## 1. Resumen ejecutivo

| Dimensión | Estado |
|-----------|--------|
| **MVP bootstrap** (EPIS2-00…12) | ✅ Cerrado |
| **Programa microfases** MF-151…182 | ✅ Cerrado (38 MF) |
| **PROG-THREE-MODES** (EPIS2-PM-01) | ✅ Cerrado |
| **CI master** | ✅ Verde — 10/10 E2E · [run 27181266125](https://github.com/gabriel2320/epis2/actions/runs/27181266125) |
| **Hilo B** (Ola 2) | ◐ ~95 % — 1 ítem diferido |
| **Hilo D** / Tramo J | ○ Siguiente prioritario |
| **Working tree** | Limpio |

**Conclusión:** plataforma estable, pipeline CI confiable en preview, deuda principal en signoff clínico Tramo J y deuda E2E menor en specs fuera del set CI.

---

## 2. Mapa de avance por capa (SDEPIS2)

| Capa | Avance | Detalle |
|------|--------|---------|
| L0 Invariantes | ████ 100 % | Gates architecture + product canon |
| L1 Olas 0–1 | ███░ ~85 % | Ola 0 ✓ · Ola 1 hitos 1C/1D partial |
| L2 Tramos A–I | ████ scaffold | Signoff institucional prep · Tramo J pendiente |
| L3 UX densidad | ████ 100 % | MF-UI-SIMPLIFY |
| L4 RAD MD3 | ████ 100 % | Hilo A cerrado |
| L5 clinical-productivity | ███░ ~80 % | Paquete + gates · piloto extendido pendiente |
| L6 Tramo J | ██░░ ~40 % | `dashboard-pharmacy` done · signoff clínico pendiente |

---

## 3. Gates verificados (última sesión CI verde)

| Gate | Run 27181266125 |
|------|-----------------|
| `npm run check` | ✅ |
| `quality:pm01` · `theme:validate` | ✅ |
| `npm run test` · `quality:ci-parity` | ✅ |
| `test:e2e` | ✅ **10/10** (20.1s) |
| `db:validate` · `ai:evals` · `quality:golden-journey` | ✅ |

Specs E2E en CI: `golden-command-evolution`, `golden-draft-approval`, `golden-v2-admission-discharge`, `clinical-textbox-evolution-draft`, `login-gateway`×2, `three-modes-journey`, `ux-g02`×3.

---

## 4. Historial de cambios recientes (2026-06-08 → 09)

### Entrega CI-E2E (infra + specs)

| Commit | Entrega | Efecto |
|--------|---------|--------|
| `46c5f69` | Registry chips | CI unit tests verdes |
| `ae41c81` · `cb4d2a2` | API dev CI | Sin `.env` obligatorio · sin MUI en Node |
| `71b7c13` · `deb6a3b` | Preview + proxy | E2E en vite preview |
| `e4b9083` · `2ad23b3` | AppProviders | RouterProvider · gates PM01 |
| `95a50eb` | Helpers E2E | Demo patient compartido |
| `57c3e8b` | E2E lote 1 | login API · ficha-history · UX-G02 sin narrativos |
| `502751c` · `7993f2c` | E2E lote 2–3 | paste-zone · Firmar → borrador · combobox cama |
| `2c5cbbe` | Cierre docs | Reporte run 27181266125 |

### Evolab (externo)

| Commit | Efecto |
|--------|--------|
| `1342876` | Evolab añadido (revertido después) |
| `47a641e` · `4899475` · `c4deb70` | Evolab → repo [epis2-evolab](https://github.com/gabriel2320/epis2-evolab) |

### Documentación y nomenclatura

| Commit | Efecto |
|--------|--------|
| `172f33f` | Tablero + planes post-CI |
| `7f68f17` | **SDEPIS2** — sistema único de desarrollo |

### Producto (previo misma ventana)

| Commit | Efecto |
|--------|--------|
| `7e4c333` · `63df1a1` | PROG-THREE-MODES MF-03…08 |

---

## 5. Registro de pendientes

### P1 — Producto (hilo activo)

| ID | Hilo / tramo | Pendiente | Gate / criterio |
|----|--------------|-----------|-----------------|
| **PEND-001** | **Hilo D** · Tramo J | Signoff clínico farmacia + piloto UX-G02 | `quality:tramos-clinical-signoff-gate` |
| **PEND-002** | Hilo B | Procedimiento nota clínica (≠ `procedure_request`) | Diferido Ola 2+ — documentar decisión |

### P2 — Calidad / deuda técnica

| ID | Área | Pendiente | Notas |
|----|------|-----------|-------|
| **PEND-003** | E2E | `tramo-c-admission.spec.ts` drift | CTA ingreso requiere `epis2-ficha-history` (no en set CI) |
| **PEND-004** | E2E | Patrón MUI Select | Usar `getByRole('combobox')` en formularios |
| **PEND-005** | Ola 1 | Hitos **1C** / **1D** partial | Resultados + IA asistida extendida |
| **PEND-006** | Ola 3 | Impresión clínica · piloto humano M3 | `M3_VISUAL_SIGNOFF_STEPS.md` |
| **PEND-007** | Dependencias | zod 4.x (Dependabot) | PR aparte |

### P3 — Documentación / tooling

| ID | Área | Pendiente |
|----|------|-----------|
| **PEND-008** | `microphase-next.mjs` | Mensaje aún dice «Fase B» → alinear a **Hilo B** |
| **PEND-009** | Storybook | 12 stories bootstrap · ampliar por IDC |
| **PEND-010** | MF-2xx | Propuesta arquitecto — no activa |

---

## 6. Índice de reportes (sesión jun 2026)

| Reporte | Tema |
|---------|------|
| [epis2-ci-e2e-closure-2026-06-09.md](./epis2-ci-e2e-closure-2026-06-09.md) | Cierre CI E2E verde |
| [epis2-e2e-failure-plan-2026-06-09.md](./epis2-e2e-failure-plan-2026-06-09.md) | Plan corrección E2E |
| [epis2-dev-system-sdepsis2-2026-06-09.md](./epis2-dev-system-sdepsis2-2026-06-09.md) | Unificación nomenclatura |
| [epis2-audit-ci-e2e-2026-06-04.md](./epis2-audit-ci-e2e-2026-06-04.md) | Auditoría infra CI |
| [epis2-prog-three-modes-closure-2026-06-04.md](./epis2-prog-three-modes-closure-2026-06-04.md) | Cierre tres modos |
| [epis2-general-audit-2026-06-04.md](./epis2-general-audit-2026-06-04.md) | Auditoría general jun-04 |

---

## 7. Riesgos

1. **Drift E2E** — specs fuera del set CI (`tramo-c-*`, `ola3-*`) pueden romperse sin aviso.
2. **Confusión nomenclatura** — docs históricos aún dicen «Fase/Lote»; migración gradual vía SDEPIS2.
3. **Tramo J antes de signoff** — scaffold listo pero piloto producción farmacia bloqueado por signoff clínico.
4. **Evolab** — no mezclar de nuevo en monorepo sin manifiesto legacy.

---

## 8. Próximo paso exacto

1. Cerrar formalmente **Hilo B** (marcar checklist en plan global; dejar PEND-002 documentado como defer).
2. Abrir sesión **Hilo D — Tramo J**: signoff clínico + E2E farmacia si aplica.
3. Entrega rápida **PEND-003**: alinear `tramo-c-admission.spec.ts` con patrón ficha-history.

```bash
npm run quality:microphase-next   # → Hilo B/D (ledger MF cerrado)
npm run check && npm run test && npm run db:validate
```

---

## 9. Registro de auditoría

| Campo | Valor |
|-------|-------|
| Auditor | Sesión agente EPIS2 |
| Alcance | Estado proyecto + historial 2026-06-08…09 + pendientes |
| Gates locales | `quality:microphases` OK · working tree clean |
| CI referencia | 27181266125 (código) · docs commits en validación |

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
