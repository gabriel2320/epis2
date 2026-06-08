# Lyra clinical catalogs — referencia EPIS2

**No importar a runtime.** Solo consulta y seeds futuros curados.

## Contenido

```
clean/
  manifest.json              # SHA, counts, excluidos
  *.clean.json               # Catálogos normalizados
```

## Uso permitido

- Diseñar migraciones SQL de catálogo Chile.
- Extraer manualmente 20–50 filas para fixtures demo.
- Comparar CodPrestacion / especialidades con formularios EPIS2.

## Uso prohibido

- `import` desde `apps/web` o `packages/*`.
- Enlazar al Command Engine como catálogo de resolución.
- Sustituir PostgreSQL como SoT.

Ver `SOURCE.md` y `REVIEW.md`.
