# EPIS2 complement — Ollama clínica

**Fecha:** 2026-06-11  
**Rol:** ollama-clinical complementario  
**Restricción:** sin matar procesos auto-dev (node)

## Resumen ejecutivo

| Paso | Resultado |
|------|-----------|
| `ollama:probe` | **PASS** |
| `quality:ollama-structured-output-gate` | **PASS** |
| API `http://127.0.0.1:3001/health` | **UP** (200) |
| `ai:evals:live` | **FAIL** (blocker: local-ai / dev:ai) |

**Veredicto global:** gates Ollama clínica y API OK; evals live bloqueadas hasta `dev:ai`.

## 1. `npm run ollama:probe`

- **Estado:** PASS (`ollama:probe OK`)
- **URL Ollama:** http://127.0.0.1:11434 — Up ✓
- **Modelo clínica:** `qwen3:8b` — presente ✓
- **Estación:** tier performance · 63 GB RAM · 12 GB VRAM · 16 cores · modo auto
- **Enrutado:**
  - clinical → `qwen3:8b` ✓
  - dev-plan → `qwen2.5-coder:7b` ✓
  - dev-write → `deepseek-coder-v2:16b` ✓
- **Tags locales (muestra):** qwen2.5-coder:14b, deepseek-coder:6.7b, deepseek-coder-v2:16b, qwen2.5-coder:7b, llama3.2:latest, bge-m3:latest, qwen3:8b, nomic-embed-text:latest

## 2. `npm run quality:ollama-structured-output-gate`

- **Estado:** PASS
- **Mensaje:** `ollama-structured-output-gate OK — salida IA estructurada segura`

## 3. Health API (3001)

- **Endpoint:** http://127.0.0.1:3001/health
- **Estado:** **200 OK**
- **Cuerpo:** `{"status":"ok","service":"epis2-api","version":"0.1.0",...,"checks":{"database":"skipped"}}`
- **Decisión:** no skip de `ai:evals:live` por API caída (API respondió).

## 4. `npm run ai:evals:live`

- **Estado:** FAIL (esperado si `dev:ai` no está activo)
- **Detalle:** `local-ai no responde en /ready` — target http://127.0.0.1:3002
- **Blueprints:** 4 (script inició evaluación antes del fallo de ready)
- **Build previo:** `@epis2/local-ai` build (tsc) completó
- **Remediación sugerida (sin tocar auto-dev):**
  1. `npm run stack:dev` (si hace falta stack)
  2. En **otra terminal:** `npm run dev:ai`
  3. Reintentar `npm run ai:evals:live`

## Blockers

| Blocker | Impacto |
|---------|---------|
| Servicio local-ai (:3002) sin `/ready` | `ai:evals:live` no puede ejecutarse |
| `dev:ai` no levantado en esta sesión | Evals assist en vivo pendientes |

## Notas

- No se modificó código ni se detuvieron procesos node (auto-dev intacto).
- Sin commit en esta complementación.

## Próximo paso

Levantar `npm run dev:ai` en terminal dedicada y re-ejecutar solo `npm run ai:evals:live` para cerrar el complemento clínico con evals live en verde.
