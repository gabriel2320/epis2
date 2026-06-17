# EPIS2-THEME-01 — Integración Material Theme Builder

**Fecha:** 2026-06-05  
**Alcance:** Auditoría + pipeline; **sin** refactor UI masivo ni múltiples temas en runtime.

---

## 1. Entregables

| # | Entregable | Estado |
|---|------------|--------|
| 1 | Auditoría tema actual | ✓ `epis2-theme-current-state-audit.md` |
| 2 | Source MTB Clinical Blue + Calm Teal | ✓ `theme/source/*.json` |
| 3 | Pipeline import/validate/generate | ✓ `scripts/theme/*` |
| 4 | Contratos tipados | ✓ `contracts/material-color-scheme.ts` |
| 5 | Roles clínicos semánticos | ✓ `clinical/clinical-semantic-roles.ts` |
| 6 | Generated TS | ✓ `generated/clinical-blue.ts`, `calm-teal.ts` |
| 7 | Foundations barrel | ✓ `foundations/*` |
| 8 | Gates `theme:validate` | ✓ 8 validadores (incl. snapshot) |
| 9 | Tests generated | ✓ `theme-generated.test.ts` |
| 10 | Documentación diseño | ✓ 5 docs en `docs/design/` |
| 11 | Fix microcopy pgvector | ✓ |
| 12 | Fix EpisBrandMark dark | ✓ `background.paper` |

**No implementado (ramas futuras):** selector preferencias completo, catálogo `/desarrollo/catalogo-visual`, wiring `createEpis2Theme` → generated, high contrast UI.

---

## 2. Comandos

```bash
npm run theme:import   # MTB JSON → source/
npm run theme:generate # source → generated/
npm run theme:validate # gates tema
npm run theme:report   # reporte pipeline
npm run theme:snapshot # snapshots reproducibles
```

---

## 3. Gates sesión

```bash
npm run theme:validate  # OK
npm run check           # pendiente sesión
npm run test            # pendiente sesión
```

---

## 4. Próxima rama

```text
feat/epis2-theme-02-clinical-blue
```

Conectar `createEpis2Theme` a `clinicalBlueLightScheme` / `clinicalBlueDarkScheme` como default; mantener roles clínicos protegidos.

---

## 5. Frase guía

*Material Theme Builder define el lenguaje cromático; EPIS2 protege el significado clínico.*
