# EPIS2 — MF-154 Playwright E2E crítico en CI

**Fecha:** 2026-06-05  
**Ola:** 0 — Verdad operativa y gates  
**Alcance:** Journey UI mínimo comando→evolución; gate en CI con Postgres + servidores dev.

---

## 1. Entregables

| Artefacto | Ruta |
|-----------|------|
| Config Playwright | `playwright.config.ts` |
| Journey E2E | `e2e/golden-command-evolution.spec.ts` |
| CI workflow | `.github/workflows/ci.yml` → `playwright install` + `test:e2e` |
| Automatización local | `npm run stack:up`, `npm run quality:local-ci` |

---

## 2. Journey E2E

1. Login `medico.demo` + `DEMO-CLAVE-MEDICO`
2. Centro de Comando visible (`epis2-command-prompt`)
3. Panel paciente → `Cargar pacientes demo` → chip `DEMO-001`
4. Vuelta a `/comando` con contexto activo
5. Comando `evolucionar nota de hoy` → `/espacio/evolucion`
6. Formulario clínico (`epis2-generated-clinical-page`)

**webServer:** API `:3001` + Web `:5173` (mismo proxy dev que desarrollo local).

---

## 3. Automatización Docker / Ollama

```bash
npm run stack:up          # postgres + ollama + migrate + ai:enable
npm run quality:local-ci  # gates CI sin E2E
EPIS2_LOCAL_CI_E2E=1 npm run quality:local-ci  # incluye Playwright
npm run test:e2e:install && npm run test:e2e
```

---

## 4. Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | (ver sesión) |
| `npm run test` | (ver sesión con Postgres) |
| `npm run test:e2e` | OK — 1 passed (5.1s, Docker Postgres + webServer) |
| `npm run quality:microphases` | MF-155 READY |

---

## 5. Ledger

- **MF-154:** DONE  
- **MF-155:** READY — RLS staging fail-closed

---

## 6. Próximo paso

**MF-155** — `RLS_MODE=enforce` en staging con políticas fail-closed.
