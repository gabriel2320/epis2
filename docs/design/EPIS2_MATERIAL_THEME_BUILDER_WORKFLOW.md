# EPIS2 — Flujo Material Theme Builder

**Fase:** EPIS2-THEME-01

## 1. Exportar desde MTB

1. Abrir [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/).
2. Color fuente:
   - **Clinical Blue:** `#1E6FD6`
   - **Calm Teal:** `#006A6A`
3. Exportar JSON (Custom).
4. Importar al repo:

```bash
node scripts/theme/import-material-theme.mjs ./export.json clinical-blue
```

## 2. Pipeline reproducible

```bash
npm run theme:validate   # roles M3 + contraste + clínico + hardcode
npm run theme:generate   # source/*.json → generated/*.ts
npm run theme:snapshot   # comparar con reports/theme-snapshots/
npm run theme:report     # reports/theme-pipeline-latest.md
```

## 3. Reglas

- No editar `source/*.material-theme.json` a mano.
- No editar `generated/*.ts` a mano.
- Roles clínicos en `clinical/clinical-semantic-roles.ts` — inmutables entre temas.

Frase guía: *Material Theme Builder define el lenguaje cromático; EPIS2 protege el significado clínico.*
