# EPIS2 — Contexto mínimo para agentes (Cursor)

**Versión:** 3.3 · **Ola 11 ✓** · **PROG-INTEROP-CHILE** (MF-IC-01) · **STRENGTHEN** 20/23

> Canon completo solo si la tarea lo exige: `docs/PRODUCT_CANON.md`, `docs/product/PRODUCT_INVARIANTS.md`, `AGENTS.md`.

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
| **PROG-FICHA-FIRST** | ✓ wave1 cerrado · wave2 MF-FF-00 READY | `quality:ficha-first-gate` |
| **PROG-STRENGTHEN** | **20/23** · MF-IC-01 ✓ · **MF-IC-02** siguiente (blocked) | `npm run quality:strengthen-next` |
| **PROG-CDS-UX** | ✓ MF-CU-01…04 | `quality:cds-hooks-gate` |

Plan unificado: [`reports/epis2-plan-desarrollo-unificado-2026-06-14.md`](../reports/epis2-plan-desarrollo-unificado-2026-06-14.md) v1.3 · orquestación: [`reports/epis2-orquestacion-paralela-2026-06-14.md`](../reports/epis2-orquestacion-paralela-2026-06-14.md) §20–§21

**Ola 11:** ✓ MF-IC-01 Perfil export MINSAL · [`epis2-mf-ic-01-minsal-export.md`](../reports/epis2-mf-ic-01-minsal-export.md)

Cerrado: MF-IM-01…09 · **MF-CU-01…04** · **MF-IC-01** · **MF-FF-01…06** (wave1) · PROG-RAPID · PROG-DI · tríada · PROG-IA-MODERNIZE · **PROG-CDS-UX**.

Siguiente: **MF-IC-02** SNRE staging MedicationRequest (PROG-INTEROP-CHILE).

---

## Gates por tipo de cambio

| Cambio | Gate |
|--------|------|
| Docs, reportes, scripts quality, UI menor | `npm run quality:fast` o `npm run dev:rapid` |
| API/web/packages clínicos, microfase | `npm run quality:clinical` |
| Pre-PR, cierre tramo, signoff | `npm run quality:full` |

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
npm run quality:clinical   # cierre MF clínico
npm run dev:agent:close    # reporte sesión
```

Atajos: `quality:fast` · `dev:agent:audit-diff` · `dev:rapid -- --skip-audit`

---

## Referencias cortas

| Doc | Cuándo |
|-----|--------|
| [`EPIS2_TABLERO.md`](product/EPIS2_TABLERO.md) | Siguiente MF/hilo |
| [`EPIS2_DEV_VELOCITY.md`](dev/EPIS2_DEV_VELOCITY.md) | Gates por rol |
| [`GOLDEN_CLINICAL_JOURNEY.md`](../quality/GOLDEN_CLINICAL_JOURNEY.md) | Solo UI/flujo clínico |
