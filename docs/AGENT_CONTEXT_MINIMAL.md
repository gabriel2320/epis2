# EPIS2 — Contexto mínimo para agentes (Cursor)

**Versión:** 1.0 · **MF-RAPID-01** · Lectura obligatoria antes de codear.

> Canon completo solo si la tarea lo exige: `docs/PRODUCT_CANON.md`, `docs/product/PRODUCT_INVARIANTS.md`, `AGENTS.md`.

---

## Reglas canónicas (10 líneas)

1. **Command-first** — Centro de Comando en `/comando`; nunca dashboard como home.
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

---

## Gates por tipo de cambio

| Cambio | Gate |
|--------|------|
| Docs, reportes, scripts quality, UI menor | `npm run quality:fast` |
| API/web/packages clínicos, microfase | `npm run quality:clinical` |
| Pre-PR, cierre tramo, signoff | `npm run quality:full` |

### `quality:fast` incluye

- resumen `git status`
- scan PHI/secrets en archivos tocados
- eslint + typecheck + vitest **solo zonas tocadas**
- `architecture:validate`

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
npm run quality:fast       # iteración
npm run dev:agent:audit-diff  # Ollama revisa diff (secundario)
npm run quality:clinical   # cierre MF clínico
npm run dev:agent:close    # reporte sesión
```

Ollama como **auditor de diff** (no escritor de SoT): `npm run dev:agent:audit-diff` tras `quality:fast`.

---

## Referencias cortas

| Doc | Cuándo |
|-----|--------|
| [`EPIS2_TABLERO.md`](product/EPIS2_TABLERO.md) | Siguiente MF/hilo |
| [`EPIS2_DEV_VELOCITY.md`](dev/EPIS2_DEV_VELOCITY.md) | Gates por rol |
| [`GOLDEN_CLINICAL_JOURNEY.md`](../quality/GOLDEN_CLINICAL_JOURNEY.md) | Solo UI/flujo clínico |
