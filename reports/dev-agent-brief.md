# EPIS2 — Dev Brief (IA asistida)

> **Inicio rápido:** abrir `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-layers-integrator.md` en Cursor y declarar alcance en el primer mensaje.

**Generado:** 2026-06-08T00:21:00.169Z · **Fase:** B

## Objetivo sugerido

- **Ollama:** Implementar grids dashboard + acordeones en formularios
- **MF propuesta:** MF-RAD-M3-A

## Subagente primario

**[`layers-integrator`](./dev-agent-prompt-layers-integrator.md)** — Integrador capas L3+L4+L5

## Secuencia completa

1. `layers-integrator` — Integrador capas L3+L4+L5
2. `ollama-clinical` — IA clínica local (Ollama producto)
3. `golden-guardian` — Guardián Golden Journey
4. `gate-runner` — Ejecutor de gates

## Working tree

- Rama: `master` · cambios: 134 (lista truncada)

```
M .env.example
M AGENTS.md
M apps/web/package.json
M apps/web/src/components/DashboardWorklists.tsx
M apps/web/src/components/EmergencyDashboardTab.tsx
M apps/web/src/components/IcuDashboardTab.tsx
M apps/web/src/components/NursingDashboardTab.test.tsx
M apps/web/src/components/NursingDashboardTab.tsx
M apps/web/src/components/PatientDashboardTab.tsx
M apps/web/src/components/PatientListGrid.tsx
M apps/web/src/components/PharmacyDashboardTab.test.tsx
M apps/web/src/components/PharmacyDashboardTab.tsx
D apps/web/src/components/QualityDashboardGrids.tsx
M apps/web/src/components/QualityDashboardTab.test.tsx
M apps/web/src/components/QualityDashboardTab.tsx
M apps/web/src/components/ServiceDashboardTab.test.tsx
M apps/web/src/components/ServiceDashboardTab.tsx
M apps/web/src/components/SpecialtyDashboardTab.tsx
M apps/web/src/components/WorklistDraftGrid.tsx
M apps/web/src/dashboard/DashboardModeContent.tsx
M apps/web/src/layouts/ClinicalGlobalTopBar.tsx
M apps/web/src/layouts/ClinicalShellLayout.tsx
M apps/web/src/main.tsx
M apps/web/src/navigation/clinicalWorkspaceRegistry.test.ts
```

## Stack local

- Ollama: ✓ up (`http://127.0.0.1:11434`, modelo `qwen3:8b`)
- .env: ✓ · DATABASE_URL: ✓

```bash
npm run stack:dev          # si falta Postgres/Ollama
npm run dev:ai             # terminal 2 — assist clínico
npm run dev:session        # regenerar este brief
```

## Loop IA (mejores prácticas EPIS2)

- **1. Alcance** — Declarar MF, archivos permitidos y prohibidos antes de editar.
- **2. Contexto mínimo** — Leer solo canon + prompt del subagente activo; no re-leer todo el repo.
- **3. Diff mínimo** — Un problema, un PR lógico; reutilizar patrones existentes (`DashboardPanelGridSection`, RAD shell).
- **4. Verificar tarde** — `npm run check` al cerrar, no tras cada línea (salvo typecheck puntual).
- **5. Gates del rol** — Ejecutar solo los del subagente + cierre estándar.
- **6. Reporte** — `reports/epis2-*.md` con alcance, gates, riesgos, próximo paso exacto.
- **7. Humano decide** — Sin commit/push automático; Ollama planifica, no ejecuta.

## Prohibido

- OpenMRS / Carbon / dashboard como home
- Import masivo EPIS sin manifest
- Auto-aprobación clínica · IA escribiendo SoT
- Segundo Command/Form Registry temporal

## Cierre sesión

```bash
npm run check
npm run test
npm run db:validate
npm run quality:layers-integration-gate   # si tocaste UI
npm run dev:agent:close                     # checklist + plantilla reporte
```

---

# EPIS2 — Sesión subagentes de desarrollo

**Fase:** B
**Generado:** 2026-06-08T00:21:00.169Z

## Secuencia recomendada

1. [`layers-integrator`](./dev-agent-prompt-layers-integrator.md) — Integrador capas L3+L4+L5
2. [`ollama-clinical`](./dev-agent-prompt-ollama-clinical.md) — IA clínica local (Ollama producto)
3. [`golden-guardian`](./dev-agent-prompt-golden-guardian.md) — Guardián Golden Journey
4. [`gate-runner`](./dev-agent-prompt-gate-runner.md) — Ejecutor de gates

## Stack Ollama (desarrollo)

```bash
npm run stack:dev          # Postgres + Ollama smoke
npm run dev:ai             # terminal 2 — local-ai :3002
npm run dev:agent:ollama   # plan JSON estructurado (opcional)
npm run ai:evals:live      # evals clínicos assist
```

## Cierre sesión

```bash
npm run check
npm run test
npm run db:validate
npm run quality:layers-integration-gate
```
