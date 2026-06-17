# EPIS2 — Auditoría post-rc3 y plan de trabajo

**Fecha:** 2026-06-16 · **HEAD:** `489c643` · **Tag:** [`v0.1-demo-rc3`](https://github.com/gabriel2320/epis2/releases/tag/v0.1-demo-rc3)  
**Audiencia:** operador + agentes Cursor · **Congelamiento:** [`CONSOLIDATION_FREEZE.md`](../docs/CONSOLIDATION_FREEZE.md)

---

## 1. Resumen ejecutivo

EPIS2 está en **base demo consolidada y endurecida**: compila, CI `required` verde en Linux, golden journey intacto, tag **`v0.1-demo-rc3`** publicado. Los programas grandes (FICHA-FIRST, STRENGTHEN, CONSOLIDATE ola 1+2, RELEASE-HARDENING) están **cerrados**.

**No hay programa clínico activo autorizado.** La fase correcta ahora es **gobierno + higiene + preparación pre-piloto sintético**, no expansión de pantallas.

| Dimensión | Veredicto |
|-----------|-----------|
| Producto demo v0.1 | ✓ Entregable |
| CI / gates | ✓ Sólido en Linux · ◐ Paridad Windows |
| Seguridad | ◐ Report-only OK · blocking pendiente |
| Legal / compliance texto | ◐ Plantilla · revisión humana pendiente |
| Documentación gobierno | ◐ Tablero y plan unificado desactualizados |
| Dependencias | ◐ 6 Dependabot abiertos · dependency-review rojo (no bloquea) |

---

## 2. Auditoría técnica

### 2.1 Lo que está bien (evidencia)

| Área | Estado | Evidencia |
|------|--------|-----------|
| Release hardening | ✓ | PR #15+#16 · [`epis2-session-close-2026-06-16-release-hardening.md`](./epis2-session-close-2026-06-16-release-hardening.md) |
| CI master | ✓ | run [27613893124](https://github.com/gabriel2320/epis2/actions/runs/27613893124) |
| Architecture gates | ✓ | `no-test-fixtures-in-prod` api+web · invariantes producto |
| Auth deployed | ✓ | fail-closed demo/hybrid · `config.test.ts` |
| Unicode bidi | ✓ | `npm run security:no-bidi` |
| Fixtures prod | ✓ | bridges api/web · `VITE_EPIS2_LOAD_DEV_FIXTURES` solo CI |
| Tags demo | ✓ | rc → rc2 → rc3 |

### 2.2 Deuda e inconsistencias

| ID | Severidad | Hallazgo | Impacto |
|----|-----------|----------|---------|
| **D-01** | ~~Media~~ **✓ resuelto** | ~~`format:check` falla en Windows (CRLF, ~277 archivos)~~ | ✓ Tramo 2 MF-DEV-01 — `.gitattributes` + `.editorconfig`; [`epis2-prog-dev-parity-tramo2-close.md`](./epis2-prog-dev-parity-tramo2-close.md) |
| **D-02** | Baja | `dependency-review` CI rojo | Report-only; deuda deps sin triage |
| **D-03** | Baja | 6 PRs Dependabot abiertos (#1–5, #13, #17) | Zod 4 (#5) **fuera de alcance**; checkout v6 (#13) evaluar aparte |
| **D-04** | Media | [`EPIS2_TABLERO.md`](../docs/product/EPIS2_TABLERO.md) muestra MF-FF-08 **READY** | Ledger [`ficha-first-ledger.json`](../docs/quality/ficha-first-ledger.json) dice **DONE** · confunde agentes |
| **D-05** | Media | [`epis2-plan-desarrollo-unificado-2026-06-14.md`](./archive/2026-06/epis2-plan-desarrollo-unificado-2026-06-14.md) v1.5 pre-rc3 | MF-IC-03 “siguiente blocked” obsoleto (STRENGTHEN cerrado) |
| **D-06** | Media | [`DISCLAIMER.md`](../DISCLAIMER.md) v1.0 plantilla | Revisión legal institucional pendiente (MF-CON-10) |
| **D-07** | Baja | RH-02…05 report-only | Gitleaks/CodeQL no bloquean merge aún |
| **D-08** | Baja | ~460 `reports/*.md` en raíz | Ruido navegación · archivar lote a `reports/archive/` |
| **D-09** | Baja | E2E residual `epis2-power-bar` en specs legacy | No bloqueante · higiene paralela |
| **D-10** | Info | `quality:ficha-first-next` no existe como script npm | Tablero cita comando inexistente |

### 2.3 Riesgos si no se actúa

1. Agentes reinician MF cerradas (FF-08, IC-03) por tablero stale.
2. Releases locales en Windows sin gate `format:check` → drift silencioso.
3. Dependabot Zod 4 merge accidental rompe invariante PROG-ZOD4-MIGRATION.
4. Uso público sin revisión legal del DISCLAIMER.

---

## 3. Plan propuesto — PROG-POST-RC3

**Objetivo:** Pasar de “demo rc3 endurecido” a “base pre-piloto sintético gobernada” **sin features clínicas nuevas**.

**Regla:** un tramo por sesión · MF explícita · congelamiento vigente.

```text
Tramo 1  PROG-GOBIERNO-POST-RC3     (docs · 1 sesión)
Tramo 2  PROG-DEV-PARITY             (CRLF / release local · 1 sesión)
Tramo 3  PROG-LEGAL-DISCLAIMER       (humano · paralelo)
Tramo 4  PROG-DEPS-HYGIENE           (Dependabot triage · 1 sesión)
Tramo 5  PROG-SECURITY-PROMOTE       (RH-09+ · opcional · 2 sesiones)
Paralelo PROG-E2E-HYGIENE            (specs power-bar · baja prioridad)
Diferido PROG-ZOD4-MIGRATION         (programa aparte)
Diferido PROG-MEDIA-FUTURE           (2027+ · ledger BLOCKED)
```

---

### Tramo 1 — PROG-GOBIERNO-POST-RC3 (recomendado **ahora**)

| MF | Entrega | Allowlist | Gate |
|----|---------|-----------|------|
| **MF-GOV-01** | Tablero: cerrar ola 3 FF · quitar “activa” / READY FF-08 | `docs/product/EPIS2_TABLERO.md` | `quality:fast` |
| **MF-GOV-02** | Plan unificado v1.6 post-rc3 | `reports/epis2-plan-desarrollo-unificado*.md` | `quality:fast` |
| **MF-GOV-03** | `EPIS2_CURRENT_STATE.md` v1.3 · sección post-rc3 | `docs/EPIS2_CURRENT_STATE.md` | `quality:fast` |
| **MF-GOV-04** | Cerrar formal PROG-RELEASE-HARDENING en plan RH | `docs/product/EPIS2_RELEASE_HARDENING_PLAN.md` | `quality:fast` |

**Prohibido:** código apps/packages · migraciones · UI.

**Criterio de cierre:** tablero + brújula + plan unificado coherentes con ledgers DONE.

---

### Tramo 2 — PROG-DEV-PARITY (Windows / release local)

| MF | Entrega | Opciones |
|----|---------|----------|
| **MF-DEV-01** | `quality:release` verde en Windows | A) `.gitattributes` `* text=auto eol=lf` + normalizar · B) doc “release solo en CI/Linux” · C) `format:check` en subconjunto tracked |

**Recomendación:** A mínimo en `scripts/`, `docs/`, `.github/` + gate en pre-commit existente si hay.

**Gate:** `npm run quality:release` local OK · CI sin regresión.

---

### Tramo 3 — PROG-LEGAL-DISCLAIMER (humano)

| MF | Entrega | Responsable |
|----|---------|-------------|
| **MF-LEG-01** | Checklist revisión legal DISCLAIMER + SECURITY + LICENSE | Operador / asesoría |
| **MF-LEG-02** | DISCLAIMER v1.1 con fecha revisión | Docs only tras OK humano |

**Gate:** comentario humano en PR · no auto-merge IA.

---

### Tramo 4 — PROG-DEPS-HYGIENE

| Acción | PR Dependabot | Decisión |
|--------|---------------|----------|
| Cerrar | #5 Zod 4 | `@dependabot ignore` · programa PROG-ZOD4-MIGRATION |
| Evaluar | #13 checkout v6 | RH aparte tras estabilizar Actions v5 |
| Evaluar | #17 @types/node 25 | Solo si Node 24 typings compat · no mezclar con release |
| Batch menor | #1–3 devDeps | Tras `quality:required` verde |

**Gate:** `dependency-review` sigue report-only hasta tramo 5 · documentar en RH plan.

---

### Tramo 5 — PROG-SECURITY-PROMOTE (opcional Q3)

| RH | Entrega | Gate |
|----|---------|------|
| **RH-09** | Gitleaks → required check | CI verde 1 semana |
| **RH-10** | CodeQL → required (no report-only) | idem |
| **RH-11** | dependency-review alineado o documentado waiver | idem |

**Orden:** Gitleaks primero (menor ruido) · CodeQL después.

---

## 4. Matriz decisión — qué NO hacer ahora

| Propuesta | Veredicto | Motivo |
|-----------|-----------|--------|
| Nuevas pantallas clínicas | ✗ | CONSOLIDATION_FREEZE |
| Merge Zod 4 | ✗ | PROG-ZOD4-MIGRATION |
| MF-FF-08 “live templates” | ✗ | Ya DONE en ledger |
| MF-IC-03 questionnaire nuevo | ✗ | Cerrado STRENGTHEN · código en master |
| Segundo registry | ✗ | Invariante producto |
| Tag v0.2 producto | ✗ | Falta legal + security promote + piloto sintético |

---

## 5. Próxima sesión (acción concreta)

```text
Alcance: MF-GOV-01…04 · PROG-GOBIERNO-POST-RC3
Allowlist: docs/product/EPIS2_TABLERO.md, docs/EPIS2_CURRENT_STATE.md,
           reports/archive/2026-06/epis2-plan-desarrollo-unificado-2026-06-14.md,
           docs/product/EPIS2_RELEASE_HARDENING_PLAN.md
Prohibido: apps/, packages/, database/
Gate: npm run quality:fast
Riesgo: bajo (solo docs)
```

Arranque:

```bash
npm run stack:dev
npm run dev:session
# @docs/AGENT_CONTEXT_MINIMAL.md @reports/dev-agent-brief.md
```

---

## 6. Referencias

| Doc | Uso |
|-----|-----|
| [`EPIS2_CURRENT_STATE.md`](../docs/EPIS2_CURRENT_STATE.md) | Brújula alcance |
| [`epis2-v0.1-demo-rc3-release.md`](./epis2-v0.1-demo-rc3-release.md) | Evidencia release |
| [`CONSOLIDATION_FREEZE.md`](../docs/CONSOLIDATION_FREEZE.md) | Permitido / prohibido |
| [`EPIS2_RELEASE_HARDENING_PLAN.md`](../docs/product/EPIS2_RELEASE_HARDENING_PLAN.md) | RH cerrado |

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
