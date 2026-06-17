# EPIS2 — Auditoría y ciclos operativos (sesión 2026-06-07)

**Generado:** 2026-06-06 (noche) · **Rama:** `master` @ `991d71c`

## 1. Resumen ejecutivo

| Gate | Estado |
|------|--------|
| `npm run check` | OK |
| `npm run test` (343, `epis2_app`) | OK |
| `npm run db:validate` | OK — 26 migraciones |
| `npm run quality:microphases` | OK — 1 READY |
| `origin/master` | Sincronizado |

**Ola 2 (Resultados) cerrada:** MF-161…165 DONE.  
**Próxima READY:** MF-166 — Conciliación medicamentos.

---

## 2. Entregas recientes (referencia)

| Commit | Microfases |
|--------|------------|
| `2b6a5e7` | Fix estabilidad tests integración (`fileParallelism`) |
| `7eb7dc0` / `94e3fc6` | Ingreso MF-157…160, espina Golden MF-155…188 |
| `20192b2` | MF-161 bandeja + MF-162 acuse |
| `991d71c` | MF-163 trazabilidad + MF-164 tendencias + MF-165 comandos |

---

## 3. Brechas vigentes (post-auditoría)

| Área | Estado | Notas |
|------|--------|-------|
| Resultados clínicos | **Cerrado ola 2** | Bandeja, acuse, trazabilidad, tendencias, comando |
| Ingreso / alergias / problemas | **Implementado** | Deriva doc: `EPIS2_SCREEN_CONNECTION_MAP` §ingreso aún dice «sin formulario» — actualizar en MF-166 o MF-170 |
| Conciliación medicamentos | **PARTIAL** | Tablero farmacia lista candidatos CDR; **sin blueprint** ni formulario dedicado (MF-166) |
| Nota traslado / consulta ambulatoria | **MISSING** | MF-167…168 |
| Administración / piloto / HL7 | **BLOCKED** | MF-171…182 |

**Base donante existente para MF-166:**

- `PharmacyDashboardTab` + `reconciliationCandidates` (API `GET /api/dashboard/pharmacy`)
- Blueprint vecino: `pharmacy_validation` → `/espacio/farmacia`
- CDR: `medication_reconciliation_gap` (tests en `rules.test.ts`)
- Golden API: `golden-v3-mar-nursing` exige `reconciliationCandidates.length > 0`

---

## 4. Ciclos propuestos para mañana

Regla ledger: **una microfase por ciclo** → commit/push al cierre de cada una.

### Ciclo 1 — MF-166 (mañana, prioritario)

**Objetivo:** Conciliación medicamentosa con blueprint + formulario.

| Entrega | Criterio |
|---------|----------|
| Blueprint `medication_reconciliation` | `packages/clinical-forms`, ruta `/espacio/conciliacion` o extensión farmacia |
| Intent + comando | p. ej. `reconcile_medications` o enlace desde tablero farmacia |
| Borrador → aprobación | Patrón MF-159/160; sin auto-aprobación |
| UI | Navegación desde `PharmacyDashboardTab` «Validar conciliación» |
| Tests | Registry + integración mínima si hay write SoT |
| Reporte | `reports/epis2-mf-166-reconciliation.md` |

**Gates ciclo:** `check` → `test` → `db:validate` → `quality:microphases`.

### Ciclo 2 — MF-167

**Objetivo:** Nota de traslado (`transfer_note`).

- Blueprint + comando + API traslado ya existente (`POST transfer`) — enlazar UI/form.
- Evidencia: `reports/epis2-mf-167-transfer-note.md`.

### Ciclo 3 — MF-168

**Objetivo:** Consulta ambulatoria (`outpatient_visit`).

- Blueprint ambulatorio; comando; ruta `/espacio/ambulatorio` (convención a fijar).
- Evidencia: `reports/epis2-mf-168-outpatient.md`.

### Ciclo 4 — MF-169 (si hay tiempo)

**Objetivo:** Ampliar interconsulta + informe de respuesta.

- Extender `referral` existente o blueprint `referral_report`.
- Evidencia: `reports/epis2-mf-169-referral-report.md`.

### Buffer / no automatizar sin revisión

| MF | Motivo |
|----|--------|
| MF-170 | Cola de formularios — decisión de catálogo |
| MF-171+ | Admin, OIDC, HL7 — requieren criterios de piloto |

---

## 5. Checklist operativo (antes de cada ciclo)

```text
DATABASE_URL=postgresql://epis2_app:epis2@127.0.0.1:5433/epis2
npm run db:migrate          # superuser epis2 si aplica nueva migración
npm run quality:microphase-next
```

- Home = Centro de Comando (`/comando`).
- Copy desde `packages/design-system/src/copy/es.ts`.
- UI solo `@epis2/epis2-ui`.
- Tras MF-166: actualizar `EPIS2_SCREEN_CONNECTION_MAP` (ingreso + farmacia).

---

## 6. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Tests integración flaky | `fileParallelism: false` + `epis2_app` (no superuser) |
| MF-166 scope creep | Solo blueprint + form; no cola farmacia productiva completa |
| Deriva documental | Unificar `SCREEN_CONNECTION_MAP` + auditoría 2026-06-05 en MF-170 |
| Migración 026 no aplicada en entorno | `db:validate` debe listar 26 archivos |

---

## 7. Métricas de referencia

- Tests totales: **343**
- Suites integración: **12** (`INTEGRATION_TEST_SUITES`)
- Microfases DONE: **27 / 38**
- Pendientes BLOCKED: **11** (MF-167…182 excepto MF-166 READY)

---

## 8. Comando de arranque mañana

```bash
npm run quality:microphase-next
# → MF-166 Conciliación medicamentos
```

Frase guía: *Los errores de EPIS no son recuerdos: son gates de EPIS2.*
