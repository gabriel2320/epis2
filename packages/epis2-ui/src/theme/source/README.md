# Material Theme Builder — fuentes EPIS2

Exportaciones originales de [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/).

## Reglas

1. **No editar manualmente** los archivos `*.material-theme.json` tras importación.
2. Reimportar desde MTB y ejecutar `npm run theme:generate`.
3. Conservar `metadata` (color fuente, fecha, versión).
4. Cada archivo debe incluir esquemas **light** y **dark** con todos los roles M3 obligatorios.

## Temas aprobados (THEME-01)

| Archivo | ID | Color fuente |
|---------|-----|--------------|
| `clinical-blue.material-theme.json` | `clinical-blue` | `#1E6FD6` |
| `calm-teal.material-theme.json` | `calm-teal` | `#006A6A` |

## Pipeline

```text
source/*.material-theme.json
  → npm run theme:validate
  → npm run theme:generate
  → generated/*.ts
```

Frase guía: *Material Theme Builder define el lenguaje cromático; EPIS2 protege el significado clínico.*
