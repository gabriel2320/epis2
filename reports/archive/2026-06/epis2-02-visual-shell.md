# EPIS2-02 — Sistema visual y shell

**ID:** EPIS2-02  
**Estado:** Completada  
**Fecha:** 2026-06-04

---

## Objetivo

Tema Material EPIS2, login demo, Centro de Comando con power bar, layout clínico placeholder, errores y microcopy en español — **sin auth real ni command registry productivo**.

---

## Entregables

| Área | Implementación |
|------|----------------|
| Tema MUI | `packages/design-system` — `epis2Theme`, `Epis2ThemeProvider`, `copy/es.ts` |
| Login | `/login` — roles demo, sesión `sessionStorage` |
| Home | `/comando` — Centro de Comando (no dashboard) |
| Power bar | `PowerBar.tsx` — acción principal |
| Chips sugerencias | Comandos MVP en español |
| Layout clínico | `ClinicalShellLayout` + `/espacio` placeholder |
| Errores | `ErrorState`, `NotFoundPage` |
| Router | TanStack Router — redirect `/` → login o comando |

---

## Gate humano (autoevaluación)

| Pregunta | ✓ |
|----------|---|
| ¿Se entiende en 3 s? | Sí — «¿Qué necesitas hacer?» + barra dominante |
| ¿Parece EPIS2? | Sí — MUI, sin Carbon ni dashboard |
| ¿Una acción principal? | Sí — power bar + Continuar |
| ¿No parece dashboard? | Sí — sin KPIs ni grillas |

---

## Gates automáticos

```bash
npm run check
npm run test
npm run architecture:validate
```

---

## Próximo paso

**EPIS2-03** — autenticación real, RBAC, rutas protegidas API (reemplazar demo session).

---

## Commit sugerido

```text
feat(epis2-02): MUI shell with login and command center home

Add design-system theme, Spanish copy, TanStack Router, demo login,
/comando command center with power bar, clinical layout placeholder.
```
