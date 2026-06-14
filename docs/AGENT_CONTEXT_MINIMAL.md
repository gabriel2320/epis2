# EPIS2 — Contexto mínimo para agentes (Cursor)

**Versión:** 1.3 · **MF-RAPID** ✓ · **FICHA-FIRST** MF-FF-01…03 ✓ · **STRENGTHEN** MF-IM-01/02 ✓

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

**No** iniciar la MF READY del ledger (`npm run quality:strengthen-next`) salvo petición explícita del usuario.

---

## Programa activo (2026-06-14)

| Programa | Estado | Comando estado |
|----------|--------|----------------|
| **PROG-RAPID** | ✓ cerrado | `npm run quality:rapid-gate` |
| **PROG-FICHA-FIRST** | MF-FF-01…03 ✓ · **MF-FF-06** READY | `npm run quality:ficha-first-gate` |
| **PROG-STRENGTHEN** | MF-IM-03 READY (no auto-iniciar) | `npm run quality:strengthen-next` |

Cerrado hoy: MF-IM-01 embeddings · MF-IM-02 embed Ollama · **MF-FF-01…03** censo-first.

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
