# EPIS2 — Índice de scripts npm (root)

**Programa:** PROG-SCRIPT-DIET-3 · **Root:** máx 18 comandos · **Histórico:** `tools/legacy-scripts/root-script-archive.json`

---

## Panel humano (root)

| Comando | Uso |
|---------|-----|
| `npm run stack:dev` | Postgres + smoke Ollama (arranque local) |
| `npm run dev:web` | UI Vite |
| `npm run dev:session` | Brief agente + prompts |
| `npm run dev:rapid` | `quality:fast` + audit-diff |
| `npm run dev:agent:close` | Checklist cierre sesión |
| `npm run check` | lint + typecheck + `architecture:validate` |
| `npm run test` | Vitest monorepo |
| `npm run test:e2e` | Playwright (workspace web) |
| `npm run db:migrate` | Migraciones SoT |
| `npm run db:validate` | Validación schema/migraciones |
| `npm run build` | Build completo monorepo |
| `npm run quality:fast` | Iteración (docs/UI menor) |
| `npm run quality:clinical` | Cambios API/web/packages clínicos |
| `npm run quality:required` | Pre-PR / CI required |
| `npm run quality:release` | Pre-tag demo |
| `npm run quality:gate -- quality:<name>` | Gate MF histórico del catálogo |
| `npm run tool:script -- <name>` | Script archivado (dev, labs, theme, …) |

### Servicios dev (workspace)

```bash
npm run dev -w @epis2/api
npm run dev -w @epis2/local-ai
```

### E2E específicos (workspace web)

```bash
npm run test:e2e:dual-chart -w @epis2/web
```

---

## CI interno (root, no panel diario)

| Comando | Uso |
|---------|-----|
| `npm run build:ci-fixtures-chain` | Cadena fixtures CI |

Workflows nightly/experimental: `node tools/gates/run-gate.mjs <tier>`.

---

## Archivados frecuentes (`tool:script`)

| Script | Ejemplo |
|--------|---------|
| `dev:api` / `dev:ai` | Servicios locales |
| `dev:agent:ollama` | Plan Ollama sesión |
| `dev:velocity` | Brief velocidad |
| `quality:golden-journey` | → preferir `quality:gate -- quality:golden-journey` |
| `ai:evals` / `ai:evals:live` | Evals IA local |
| `case-intel:*` / `drug-intel:*` | Labs CLI |
| `theme:validate` | Pipeline tema M3 |
| `build:packages` | Build packages sin web/api |
| `format:check` | `npx prettier --check .` |

Lista completa: `tools/legacy-scripts/root-script-archive.json`

---

## Gates por tier

```bash
node tools/gates/run-gate.mjs nightly      # paridad extendida
node tools/gates/run-gate.mjs experimental # gates pesados
```

Canon agentes: [`AGENTS.md`](../../AGENTS.md) · [`AGENT_CONTEXT_MINIMAL.md`](../../docs/AGENT_CONTEXT_MINIMAL.md)
