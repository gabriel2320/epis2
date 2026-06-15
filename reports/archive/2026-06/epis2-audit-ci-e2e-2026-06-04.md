# EPIS2 — Auditoría CI / E2E (2026-06-04)

**Alcance:** cadena de fixes CI post PROG-THREE-MODES · gates · E2E Playwright  
**HEAD al auditar:** `e4b9083` (+ fix gates pendiente de push)

> **Actualización 2026-06-09:** Evolab ya no vive en este monorepo. El laboratorio está en [epis2-evolab](https://github.com/gabriel2320/epis2-evolab). Las notas sobre WIP `evolution-lab/` en el working tree **ya no aplican**.

---

## Semáforo

| Área | Estado | Notas |
|------|--------|-------|
| `npm run check` | 🟢 | OK en CI hasta `e4b9083` |
| `npm run quality:pm01` | 🔴→🟢 | Falló en `27179144321`: gate buscaba `EpisSessionProvider` en `main.tsx` — corregido en gates |
| `npm run test` | 🟢 | 643 tests OK en runs recientes |
| `npm run test:e2e` | 🟡 | Bloqueado por pm01 en último push; preview+proxy listos desde `71b7c13`/`deb6a3b` |
| PROG-THREE-MODES | 🟢 | MF-01…08 cerrado; AppProviders bajo RouterProvider |
| Working tree local | 🟢 | Evolab externalizado a `epis2-evolab`; sin WIP en este repo |

---

## Cadena de fixes (cronología)

| Commit | Problema | Solución |
|--------|----------|----------|
| `46c5f69` | chips médico sin `/evoluciona/` | Orden por `ROLE_COMMAND_INTENTS` |
| `ae41c81` | E2E: `.env` not found en API dev | `run-api-dev.mjs` + `loadEnvFile` opcional |
| `cb4d2a2` | E2E: MUI vía `clinical-productivity` barrel | Subpath `@epis2/clinical-productivity/server` |
| `71b7c13` | E2E: MUI ESM en vite dev (Linux) | CI usa `vite preview` + build web previo |
| `deb6a3b` | Preview devolvía HTML en `/api/*` | Proxy `/api` en `preview` de vite.config |
| `e4b9083` | Pantalla blanca E2E | `EpisAppProviders` bajo `RouterProvider` |
| *(pendiente)* | pm01 gate desactualizado | Gates apuntan a `AppProviders.tsx` |

---

## Causa raíz E2E (resumen)

1. **Infra:** API dev exigía `.env` → resuelto.
2. **Node/MUI:** API importaba UI vía barrel → subpath `/server`.
3. **Browser:** `EpisSessionProvider` fuera de `RouterProvider` → crash React → pantalla blanca.
4. **CI web:** `vite dev` + MUI ESM en Linux → preview en CI.
5. **CI proxy:** preview sin proxy `/api` → login API fallaba → resuelto.
6. **Gates:** scripts de calidad asumían providers en `main.tsx` → actualizar.

---

## Plan inmediato

1. ✅ Actualizar `validate-three-modes-gate.mjs` y `validate-design-mode-gate.mjs`
2. Push fix gates → esperar CI verde en `test:e2e`
3. Evolab: usar repo externo [epis2-evolab](https://github.com/gabriel2320/epis2-evolab) — no mezclar en pushes de EPIS2
4. Tras CI verde: retomar Fase B / Tramo J según `EPIS2_GLOBAL_DEV_PLAN.md`

---

## Gates sesión

```bash
npm run check
npm run quality:pm01
npm run test
npm run db:validate
```

E2E local: `npm run build -w @epis2/web && npm run test:e2e`

---

## Riesgos

- **Evolab** vive en [epis2-evolab](https://github.com/gabriel2320/epis2-evolab) — no afecta `npm run check` ni eslint de EPIS2.
- **Node 20 deprecation** en GitHub Actions (warning, no bloqueante hoy).

## Próximo paso exacto

Verificar run CI post-push gates; si E2E falla, revisar artefactos Playwright en GitHub Actions.
