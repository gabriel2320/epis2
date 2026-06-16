# EPIS2 — Contexto mínimo para agentes (Cursor)

**Versión:** 4.6 · **Ola 14 ✓** · **STRENGTHEN** 23/23 ✓ · **FICHA-FIRST ✓** · **Consolidación** Fase 0–4 ✓

> **Brújula de alcance:** [`EPIS2_CURRENT_STATE.md`](EPIS2_CURRENT_STATE.md) · **Gobierno docs:** [`DOCUMENTATION_GOVERNANCE.md`](DOCUMENTATION_GOVERNANCE.md) · **Congelamiento:** [`CONSOLIDATION_FREEZE.md`](CONSOLIDATION_FREEZE.md) · inventario: [`MODULE_INVENTORY.md`](MODULE_INVENTORY.md)

---

## Reglas canónicas (10 líneas)

1. **Ficha-first** — Home = censo `/espacio/buscar-paciente`; barra de comando transversal; `/comando` solo redirect compat.
2. **PostgreSQL = SoT** — borrador ≠ dato clínico aprobado.
3. **IA propone, humano aprueba** — sin auto-firma ni auto-aprobación.
4. **Sin PHI real** — solo datos sintéticos/demo.
5. **App funciona sin Ollama** — IA local es capa opcional.
6. **Un Command Registry** — `packages/command-registry` (no duplicar).
7. **Un Form Registry** — `packages/clinical-forms` (no duplicar).
8. **Fronteras** — `apps/web` no importa servicios runtime directamente; sin `@mui/*` directo en web.
9. **Legacy** — no copiar desde `../Epis` sin `legacy-import-manifest.json`.
10. **Git** — no commit/push automático.

---

## Modo microfase (obligatorio)

Declarar antes de editar:

```text
MF-* / objetivo · zona · archivos permitidos · prohibidos · gate · riesgo
```

Un objetivo · pocos archivos · diff mínimo.

**No** auto-iniciar otra MF READY del ledger salvo petición explícita del usuario.

---

## Programa activo (2026-06-15)

| Programa | Estado | Comando estado |
|----------|--------|----------------|
| **PROG-RAPID** | ✓ cerrado | `npm run quality:rapid-gate` |
| **PROG-FICHA-FIRST** | ✓ **cerrado** MF-FF-01…15 · wave 1–5 | `quality:ficha-first-gate` |
| **PROG-STRENGTHEN** | ✓ **23/23 cerrado** · MF-IC-01…04 ✓ | `npm run quality:strengthen-close-gate` |
| **PROG-CDS-UX** | ✓ MF-CU-01…04 | `quality:cds-hooks-gate` |
| **PROG-CONSOLIDATE** | ✓ ola 1 + ola 2 · tag `v0.1-demo-rc2` | [`epis2-prog-consolidate-ola2-close-2026.md`](../reports/epis2-prog-consolidate-ola2-close-2026.md) |
| **PROG-RELEASE-HARDENING** | ✓ RH-01…08 · PR #15+#16 | [`epis2-session-close-2026-06-16-release-hardening.md`](../reports/epis2-session-close-2026-06-16-release-hardening.md) |
| **PROG-POST-RC3** | **activo** Tramo 5 SECURITY | RH-09/10 ✓ · `quality:security-promote-gate` |

Plan unificado: [`reports/epis2-plan-desarrollo-unificado-2026-06-14.md`](../reports/epis2-plan-desarrollo-unificado-2026-06-14.md) v1.5 · orquestación: [`reports/epis2-orquestacion-paralela-2026-06-14.md`](../reports/epis2-orquestacion-paralela-2026-06-14.md) §22–§23

**Ola 11:** ✓ MF-IC-01 Perfil export MINSAL · [`epis2-mf-ic-01-minsal-export.md`](../reports/epis2-mf-ic-01-minsal-export.md)

**Ola 12:** ✓ MF-IC-02 SNRE staging · [`epis2-mf-ic-02-snre-staging.md`](../reports/epis2-mf-ic-02-snre-staging.md)

**Ola 13:** ✓ MF-IC-03 Questionnaire export · [`epis2-mf-ic-03-questionnaire.md`](../reports/epis2-mf-ic-03-questionnaire.md)

**Ola 14:** ✓ MF-IC-04 HL7 quarantine hardening · [`epis2-prog-strengthen-close-2026.md`](../reports/epis2-prog-strengthen-close-2026.md)

Cerrado: MF-IM-01…09 · **MF-CU-01…04** · **MF-IC-01…04** · **MF-FF-01…15** · **PROG-FICHA-FIRST** · **PROG-STRENGTHEN** · **PROG-CONSOLIDATE** · **PROG-RELEASE-HARDENING** · PROG-RAPID · PROG-DI · tríada · PROG-IA-MODERNIZE · **PROG-CDS-UX**.

Cierre FICHA-FIRST: [`epis2-prog-ficha-first-close-2026.md`](../reports/epis2-prog-ficha-first-close-2026.md). **PROG-MEDIA-FUTURE** diferido 2027+.

**Siguiente fase recomendada:** **PROG-POST-RC3** Tramo 5 — **RH-11** dependency-review. RH-09 Gitleaks ✓ · RH-10 CodeQL ✓. Tag demo: **`v0.1-demo-rc3`**.

Evidencia: Tramo 1 [`epis2-prog-gobierno-post-rc3-tramo1-close.md`](../reports/epis2-prog-gobierno-post-rc3-tramo1-close.md) · Tramo 2 [`epis2-prog-dev-parity-tramo2-close.md`](../reports/epis2-prog-dev-parity-tramo2-close.md) · Tramo 3 [`epis2-prog-legal-disclaimer-tramo3-close.md`](../reports/epis2-prog-legal-disclaimer-tramo3-close.md) · Tramo 4 [`epis2-prog-deps-hygiene-tramo4-close.md`](../reports/epis2-prog-deps-hygiene-tramo4-close.md) · RH-09 [`epis2-prog-security-promote-tramo5-rh09.md`](../reports/epis2-prog-security-promote-tramo5-rh09.md) · RH-10 [`epis2-prog-security-promote-tramo5-rh10.md`](../reports/epis2-prog-security-promote-tramo5-rh10.md).

---

## Gates por tipo de cambio

| Cambio | Gate |
|--------|------|
| Docs, reportes, scripts quality, UI menor | `npm run quality:fast` o `npm run dev:rapid` |
| Estado ledgers (iteración) | `npm run quality:registry-status` |
| API/web/packages clínicos, microfase | `npm run quality:clinical` |
| Pre-PR | `npm run quality:full` o **`quality:required`** |
| CI extendido local | `npm run quality:nightly` |
| Gate MF histórico | `npm run quality:gate -- quality:<name>` |

### `quality:fast` incluye

- resumen `git status`
- scan PHI/secrets en archivos tocados
- eslint + typecheck + vitest **archivos tocados** (tests hermanos si existen)
- `architecture:validate`

### `dev:rapid` (MF-RAPID-03)

= `quality:fast` + `dev:agent:audit-diff` (omitido si solo docs o `--skip-audit`).

### No leer salvo petición explícita

- Auditorías históricas en `reports/epis2-auditoria-*`
- Planes superseded
- Todo el monorepo “por explorar”

---

## Prohibido sin autorización explícita

- `database/migrations/*` (salvo MF de migración)
- auth, RBAC, RLS, flujos de aprobación clínica
- segundo registry temporal
- OpenMRS, Carbon, import masivo EPIS

---

## Loop recomendado (sesión)

```bash
npm run stack:dev          # si hace falta
npm run dev:velocity       # brief + subagente
# … implementar microfase …
npm run dev:rapid          # fast + audit-diff (MF-RAPID-03)
npm run quality:registry-status  # ledgers consolidados (iteración)
npm run quality:clinical   # cierre MF clínico
npm run dev:agent:close    # reporte sesión
```

Atajos: `quality:fast` · `dev:agent:audit-diff` · `dev:rapid -- --skip-audit`

---

## Referencias cortas

| Doc | Cuándo |
|-----|--------|
| [`EPIS2_CURRENT_STATE.md`](EPIS2_CURRENT_STATE.md) | **Brújula módulos y consolidación** |
| [`EPIS2_TABLERO.md`](product/EPIS2_TABLERO.md) | Histórico MF/hilo — alinear en consolidación |
| [`EPIS2_DEV_VELOCITY.md`](dev/EPIS2_DEV_VELOCITY.md) | Gates por rol |
| [`GOLDEN_CLINICAL_JOURNEY.md`](../quality/GOLDEN_CLINICAL_JOURNEY.md) | Solo UI/flujo clínico |
