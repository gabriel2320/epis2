# EPIS2 ↔ OpenClaw-Epis2 — Plan repo hermano (orquestador externo)

**Versión:** 1.0 · **Fecha:** 2026-06-11  
**Estado:** SCAFFOLD v0.1 — repo hermano en `../openclaw-epis2` (Fase 0)  
**Programa:** [EPIS2_OPENCLAW_INTEGRATION.md](./EPIS2_OPENCLAW_INTEGRATION.md) · [EPIS2_DEV_AGENT_ORCHESTRATION.md](./EPIS2_DEV_AGENT_ORCHESTRATION.md)

> **Principio:** OpenClaw **no** es un segundo Cursor autónomo. Es **orquestador externo**: analiza, divide tareas, escribe planes/diffs sugeridos y ejecuta validadores pequeños. **Cursor** queda como IDE principal para aplicar, revisar y corregir.

Patrón análogo a [EPIS2_EVOLAB_INTEGRATION.md](./EPIS2_EVOLAB_INTEGRATION.md): repo hermano, bridge por spawn, sin importar código al monorepo producto.

---

## 1. Triángulo operativo

| Rol | Herramienta | Hace | No hace |
|-----|-------------|------|---------|
| Razonamiento local | Ollama (`qwen3:8b`) | Planes, análisis, prompts | Editar el repo producto |
| Orquestador | OpenClaw (agente `coding`) | Microfases, briefs, revisión diffs, validadores pequeños | Commits, push, builds pesados, tocar `main` |
| Implementación | Cursor | Patches, refactor, tests completos | Orquestar ciclos 6 h sin supervisión |
| Protección | Git (rama/worktree) | Trazabilidad, rollback | — |

```text
Ollama (local)  →  razona
OpenClaw        →  organiza
Cursor          →  programa
Git             →  protege
```

---

## 2. Repositorios

| Repo | Ruta típica | Rol |
|------|-------------|-----|
| **EPIS2** | `…/EPIS2` | Producto clínico · Cursor abre aquí |
| **epis2-evolab** | `…/epis2-evolab` | QA/simulación (existente) |
| **openclaw-epis2** | `…/openclaw-epis2` | Workspace OpenClaw + bridge + skills |

```text
../
├── EPIS2/
├── epis2-evolab/
└── openclaw-epis2/
         │
         │  EPIS2_ROOT → ../EPIS2
         │  spawn: npm run openclaw:* en monorepo
         ▼
    EPIS2/scripts/dev-agent/openclaw-*.mjs
```

Clonar junto a EPIS2 (cuando exista el remoto):

```bash
cd ..
git clone <url-openclaw-epis2> openclaw-epis2
cd openclaw-epis2 && npm install
```

---

## 3. Frontera entre repos

| Permitido | Prohibido |
|-----------|-----------|
| Bridge (`epis2-bridge.mjs`) que ejecuta `npm run openclaw:*` en `EPIS2_ROOT` | Copiar `apps/`, `packages/` desde EPIS2 a openclaw-epis2 |
| Skills/policies en workspace OpenClaw | Import masivo donor EPIS sin manifest |
| Sync `reports/openclaw-*` al workspace agente | Commits/push autónomos desde OpenClaw |
| Lectura de docs canon vía paths declarados | Leer `.env` o secretos reales |
| Invocar gates sugeridos (humano/Cursor) | Auto-aprobación clínica · escritura SoT |

### Qué vive dónde

| Contenido | Repo |
|-----------|------|
| Skills reviewers, `AGENTS.md`, `SOUL.md`, `TOOLS.md` | **openclaw-epis2** |
| Plantilla `openclaw.json` (Ollama) | **openclaw-epis2/config/** (+ copia en `~/.openclaw/`) |
| Scripts `openclaw:brief`, gates, PM-03 | **EPIS2** (permanecen) |
| `reports/openclaw-*`, `reports/dev-agent-*` | **EPIS2/reports/** |
| Lógica `openclaw-lib.mjs`, `safe-run`, `safe-patch` | **EPIS2** (sin duplicar) |

---

## 4. Estructura propuesta — `openclaw-epis2`

```text
openclaw-epis2/
├── README.md
├── package.json
├── .env.example
├── .gitignore
│
├── config/
│   ├── openclaw.json.template      # Ollama conservador (32K ctx cap)
│   ├── agent-coding.json
│   └── epis2-paths.json            # rutas canónicas docs/reports/gates
│
├── workspace/                      # workspace OpenClaw agente `coding`
│   ├── AGENTS.md
│   ├── SOUL.md
│   ├── TOOLS.md
│   ├── USER.md
│   ├── MEMORY.md
│   ├── skills/                     # migración desde .openclaw/epis2/skills/
│   ├── policies/                   # migración desde .openclaw/epis2/policies/
│   └── prompts/
│       ├── master-orchestrator.md
│       ├── cursor-handoff-template.md
│       └── microphase-template.md
│
├── bridge/
│   ├── epis2-bridge.mjs
│   ├── sync-reports.mjs
│   └── validate-setup.mjs
│
├── scripts/
│   ├── install-windows.ps1
│   ├── daily-start.ps1
│   └── link-workspace.ps1
│
└── docs/
    ├── ARCHITECTURE.md
    ├── DAILY_WORKFLOW.md
    ├── SECURITY.md
    └── MIGRATION_FROM_EPIS2.md
```

---

## 5. Instalación mínima (Windows / PowerShell)

```powershell
# 1) Ollama
ollama list
ollama pull qwen3:8b
curl http://127.0.0.1:11434/api/tags

# 2) OpenClaw
ollama launch openclaw
# o: npm i -g openclaw && openclaw onboard

# 3) Diagnóstico
openclaw status
openclaw doctor
openclaw gateway status

# 4) Agente coding (workspace → openclaw-epis2/workspace/)
openclaw agents add coding
openclaw agents list --bindings

# 5) Bridge EPIS2
cd openclaw-epis2
npm run doctor
```

**Ollama + OpenClaw:** usar `baseUrl: "http://127.0.0.1:11434"` **sin** `/v1` (endpoint OpenAI-compatible puede romper tool-calling). Cap de contexto real vía `params.num_ctx`, no solo `contextWindow`.

Referencias: [OpenClaw Ollama](https://docs.openclaw.ai/providers/ollama) · [Ollama OpenClaw](https://docs.ollama.com/integrations/openclaw)

---

## 6. Configuración Ollama estable

Plantilla `config/openclaw.json.template` → copiar a `~/.openclaw/openclaw.json`:

```json5
{
  models: {
    providers: {
      ollama: {
        baseUrl: "http://127.0.0.1:11434",
        apiKey: "ollama-local",
        api: "ollama",
        timeoutSeconds: 300,
        contextWindow: 32768,
        maxTokens: 4096,
        models: [{
          id: "qwen3:8b",
          name: "qwen3:8b",
          reasoning: true,
          input: ["text"],
          params: {
            num_ctx: 32768,
            num_predict: 4096,
            temperature: 0.15,
            top_p: 0.9,
            thinking: false,
            keep_alive: "10m"
          }
        }]
      }
    }
  },
  agents: {
    defaults: {
      model: { primary: "ollama/qwen3:8b" }
    }
  }
}
```

### Perfil hardware (RTX 5070 12 GB · 64 GB RAM)

| Parámetro | Valor inicial seguro |
|-----------|---------------------:|
| Modelo | `qwen3:8b` |
| `num_ctx` | 16384 → subir a 32768 si estable |
| `num_predict` | 2048–4096 |
| `temperature` | 0.1–0.2 |
| `thinking` | `false` (tareas mecánicas) |
| `keep_alive` | `5m`–`15m` |
| Agentes paralelos | 1 |
| Cursor + OpenClaw + Docker | no builds pesados simultáneos |

No forzar 64K/128K/256K al inicio — riesgo VRAM y cuelgues ([issue contexto ~262K](https://github.com/openclaw/openclaw/issues/52206)).

---

## 7. Agente `coding` aislado

OpenClaw usa *workspace* como directorio base; **no es sandbox duro** — rutas absolutas pueden salir del workspace. Por eso workspace privado (`openclaw-epis2/workspace/`), no el monorepo EPIS2 completo desde el día 1.

**Fase 0 — candados:**

| Parámetro | Valor |
|-----------|-------|
| Skills | Solo 9 EPIS2 nativos (migrados desde `.openclaw/epis2/`) |
| Skills externos | **Ninguno** al inicio |
| Git write | `false` |
| Workspace | `openclaw-epis2/workspace/` |
| Acceso EPIS2 | Solo vía `bridge/epis2-bridge.mjs` |

---

## 8. Contenido workspace — plantillas

### `AGENTS.md` (resumen operativo)

- No trabajar en `main` · no `git push` sin autorización.
- No borrar archivos/migraciones/tests sin explicar.
- No comandos destructivos (`rm -rf`, `git reset --hard`, …) sin aprobación.
- Microfases ≤ 30–45 min; máx. 5–8 archivos por microfase.
- Cada cambio: objetivo, archivos, riesgo, validación, rollback.
- Repo grande: leer solo README, package.json, apps/packages, tests, reglas Cursor, docs/architecture, reports recientes.
- **Cursor** implementa; OpenClaw genera planes, prompts, patches pequeños, checklists, revisión diffs.
- Ollama conservador: respuestas breves; un proceso pesado a la vez.

### `SOUL.md`

Ingeniero senior sobrio, directo, español técnico claro. Estabilidad, cambios pequeños, trazabilidad. No inventar resultados no verificados.

### `TOOLS.md` — allowlist Fase 0

```text
npm run openclaw:brief
npm run openclaw:handoff
npm run openclaw:policy
node bridge/*
openclaw status | doctor
```

Fase 3+: `openclaw:safe-run` con gates allowlist. Prohibido: `git push`, `rm -rf`, lectura `.env`, `npm install` global sin justificar.

### Prompt maestro (`prompts/master-orchestrator.md`)

Orquestador técnico local · Windows · Cursor IDE · Ollama qwen3:8b · estabilidad VRAM/RAM · repo vía Cursor o patches revisables.

Formato fijo de respuesta:

1. Objetivo  
2. Archivos a mirar  
3. Plan (3–7 pasos)  
4. Riesgos  
5. Comandos de validación  
6. Prompt para Cursor  
7. Criterio de término  

Modo: primero analiza, luego propone; no editar sin autorización explícita.

---

## 9. Bridge EPIS2

### Variables

| Variable | Default | Uso |
|----------|---------|-----|
| `EPIS2_ROOT` | `../EPIS2` | Monorepo producto (desde openclaw-epis2) |
| `EPIS2_OPENCLAW_ROOT` | `../openclaw-epis2` | Clone hermano (desde EPIS2) |
| `OPENCLAW_EPIS2_WORKSPACE` | `./workspace` | Workspace agente |
| `EPIS2_OPENCLAW_MAX_POWER` | `0` (Fase 0–1) | L0 read-only |
| `EPIS2_OPENCLAW_POWER_LEVEL` | `L0` | L3 solo Fase 3+ supervisado |

En EPIS2 `.env.example`: `# EPIS2_OPENCLAW_ROOT=../openclaw-epis2`

### Scripts previstos (`openclaw-epis2/package.json`)

```json
{
  "scripts": {
    "doctor": "node bridge/validate-setup.mjs",
    "brief": "node bridge/epis2-bridge.mjs openclaw:brief",
    "handoff": "node bridge/epis2-bridge.mjs openclaw:handoff",
    "policy": "node bridge/epis2-bridge.mjs openclaw:policy",
    "safe-run": "node bridge/epis2-bridge.mjs openclaw:safe-run",
    "sync": "node bridge/sync-reports.mjs",
    "daily": "powershell -File scripts/daily-start.ps1"
  }
}
```

Comandos EPIS2 existentes (sin mover): `openclaw:brief`, `openclaw:handoff`, `openclaw:policy`, `openclaw:safe-run`, `openclaw:safe-patch`, `dev:openclaw:sync`, `quality:openclaw-gate`.

---

## 10. Flujo diario

```powershell
# EPIS2 — rama lab
git status
git pull
git checkout -b openclaw-lab-YYYYMMDD
npm run check

# openclaw-epis2
npm run doctor
npm run daily
```

### Ciclo por microfase

```text
1. OpenClaw: análisis (sin editar)
   → mapa archivos, riesgos, microfase, validadores, prompt Cursor

2. Cursor: implementación en EPIS2

3. OpenClaw: revisión diff (read-only)
   → errores, arquitectura, tests faltantes, comandos mínimos

4. EPIS2: gates + handoff opcional
   npm run openclaw:handoff -- --agents auto
   npm run check
```

Evitar: OpenClaw decide + edita + ejecuta + commitea solo.

### Integración sesión dev (Fase 2+)

```bash
npm run dev:session -- --openclaw
# Cursor: @reports/dev-agent-brief.md @reports/archive/2026-06/openclaw-latest-brief.md
```

---

## 11. Fases de rollout

### Fase 0 — Bootstrap (~2 h)

- [x] Crear repo `openclaw-epis2` (local `../openclaw-epis2`)
- [x] Scaffold §4 + migrar `skills/` y `policies/` desde `.openclaw/epis2/`
- [x] `AGENTS.md`, `SOUL.md`, `TOOLS.md`, prompts maestros
- [x] `config/openclaw.json.template` + `install-windows.ps1`
- [x] `bridge/validate-setup.mjs` + `epis2-bridge.mjs` + `sync-reports.mjs`
- [ ] Remoto Git privado + `git init` local verificado
- [ ] Agente OpenClaw `coding` vinculado al workspace

**Done:** `openclaw status` OK · `npm run doctor` OK · agente responde formato microfase.

### Fase 1 — L0 read-only (1–2 semanas)

- [ ] Bridge: `brief`, `handoff`, `policy`, `sync`
- [ ] Flujo manual OpenClaw → Cursor → OpenClaw revisión
- [ ] `EPIS2_OPENCLAW_MAX_POWER=0`, `POWER_LEVEL=L0`
- [ ] `docs/DAILY_WORKFLOW.md` en repo hermano
- [ ] 3 microfases reales cerradas sin crash Ollama

### Fase 2 — Integración sesión dev (~1 semana)

- [ ] `dev:session --openclaw` detecta `EPIS2_OPENCLAW_ROOT`
- [ ] Sync automático `reports/openclaw-*` → workspace
- [ ] Stub en `.openclaw/epis2/README.md` → “migrado a openclaw-epis2”

### Fase 3 — L3 supervisado (opcional)

- [ ] `openclaw:safe-run`, `safe-patch` L0/L1 vía bridge
- [ ] PM-03 `EPIS2_AUTO_DEV_OPENCLAW=1` apunta workspace externo
- [ ] Sin git commit/push desde OpenClaw

### Fase 4 — Automatización incremental

- [ ] Una skill externa a la vez (allowlist)
- [ ] Cursor SDK cola Tier X (PM-03)
- [ ] **L5 coder autónomo prohibido**

---

## 12. Seguridad

| Regla | Fuente |
|-------|--------|
| No `main` directo | AGENTS.md |
| No push sin autorización | `epis2-forbidden-actions.md` |
| No leer `.env` | `epis2-readonly-policy.md` |
| No import EPIS sin manifest | PRODUCT_INVARIANTS |
| No skills terceros al inicio | este plan §7 |
| Context cap | `params.num_ctx` ≤ 32768 |
| L5 prohibido | EPIS2_OPENCLAW_INTEGRATION |

Estudios recientes advierten superficie de ataque en agentes con herramientas de alto privilegio — allowlists, revisión humana, permisos mínimos.

---

## 13. SDEPIS2 — declaración de alcance por sesión

```text
Alcance: Microfase MF-* | Hilo * | Tramo *
Archivos permitidos: [lista]
Power level: L0 | L3
Repo activo: EPIS2 @ rama openclaw-lab-*
Próximo gate: npm run check | quality:*
```

---

## 14. Métricas de éxito (Fase 1)

| Métrica | Objetivo |
|---------|----------|
| Crashes Ollama / timeout | 0 por sesión |
| VRAM pico (qwen3:8b) | < 10 GB @ 16–32K ctx |
| Brief → prompt Cursor | < 5 min |
| Archivos por microfase | ≤ 8 |
| Commits desde OpenClaw | 0 |
| Gates post-handoff | `check` + `architecture:validate` verde |

---

## 15. Coexistencia con setup actual EPIS2

| Aspecto | Hoy (`.openclaw/epis2/` embebido) | Objetivo (openclaw-epis2) |
|---------|-----------------------------------|---------------------------|
| Workspace | Dentro del monorepo | Repo hermano privado |
| Modo default | L3 auto-dev posible (PM-03) | L0 read-only primero |
| IDE | Cursor + scripts PM-03 | Cursor explícito como único editor |
| Ollama ctx | Variable | Cap fijo `num_ctx` en template |

PM-03 y auto-dev 6 h pueden seguir en EPIS2. **openclaw-epis2** es la estación **manual estable** (Gabriel + Cursor + Ollama local).

---

## 16. Próximos pasos (orden)

1. Crear repo vacío `openclaw-epis2` junto a EPIS2.
2. Scaffold §4 + copiar skills/policies desde `.openclaw/epis2/`.
3. Implementar `bridge/validate-setup.mjs` + `install-windows.ps1`.
4. Configurar agente `coding` → `workspace/`.
5. Probar microfase real (análisis read-only, ej. clinical-summary).
6. Fase 1 manual 1–2 semanas antes de L3 o PM-03 auto.

---

## Referencias

- [EPIS2_OPENCLAW_INTEGRATION.md](./EPIS2_OPENCLAW_INTEGRATION.md) — integración L0–L3 en monorepo
- [EPIS2_DEV_CYCLE_OPENCLAW.md](./EPIS2_DEV_CYCLE_OPENCLAW.md) — ciclo PM-03
- [EPIS2_EVOLAB_INTEGRATION.md](./EPIS2_EVOLAB_INTEGRATION.md) — patrón repo hermano
- `.openclaw/epis2/` — origen skills/policies a migrar
- [OpenClaw agent workspace](https://docs.openclaw.ai/concepts/agent-workspace)
- [OpenClaw SOUL.md](https://docs.openclaw.ai/concepts/soul)

*OpenClaw piensa y organiza; Ollama razona localmente; Cursor programa; Git protege.*
