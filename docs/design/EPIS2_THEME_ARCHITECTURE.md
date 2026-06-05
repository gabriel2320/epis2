# EPIS2 — Arquitectura de temas

## Capas

```text
Material Theme Builder (source/*.json)
  → scripts/theme/* (validación + generación)
  → generated/*.ts (esquemas M3 tipados)
  → createEpis2Theme() (único generador runtime)
  → Epis2ThemeProvider (una instancia)
  → apps/web
```

## Responsabilidades

| Capa | Gobierna |
|------|----------|
| MTB | primary, surface, outline, error… |
| EPIS2 | critical, draft, aiAssistance, approved… |
| EPIS2 | command-first, densidad por superficie, motion |

## Estructura

```text
packages/epis2-ui/src/theme/
├── source/           # exportaciones MTB (inmutables)
├── generated/        # TypeScript generado
├── contracts/        # Epis2MaterialColorScheme
├── clinical/         # roles semánticos protegidos
├── foundations/      # tipografía, forma, motion…
├── components.ts     # overrides MUI
└── create-epis2-theme.ts
```

## Invariantes

- Un solo `createTheme` productivo (gate arquitectónico).
- `cssVariables: { cssVarPrefix: 'epis2' }` — objetivo THEME-02 (hoy `cssVariables: true`).
- IA visual = `aiAssistance`; nunca autoridad clínica.
