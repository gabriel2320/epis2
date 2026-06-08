# Procedencia — lyra-clinical-catalogs-export

| Campo | Valor |
|-------|--------|
| Proyecto origen | Tesser / `lyra-clinical-extractor` |
| Ruta origen | `clone/Tesser-export-20260528/Tesser/lyra-clinical-extractor/imports/libraries/lyra` |
| Exportado | 2026-05-28 (`manifest.json` origen) |
| Clasificación | **REFERENCE_ONLY** — no runtime |
| Motivo | Catálogos clínicos Chile (Lyra) para futura curación PG / seeds demo |

## Dependencias legacy

- Schema Lyra (.NET dates, `CodigoSucursal`, plantillas Kendo/jQuery).
- Vademécum Recemed embebido en dump (licencia/uso clínico real no validado).

## Riesgos

- **Alto** si se importa completo a `apps/` o `packages/` (segundo catálogo, volumen, deriva).
- **Medio** si se usa CIE-10 Lyra como SoT (preferir fuente oficial cuando producto lo exija).
- **Bajo** como referencia curada en `migration/candidates/` (este archivo).

## Archivos archivados (limpios)

Ver `clean/manifest.json`. Resumen:

| Archivo limpio | Ítems | Uso potencial EPIS2 |
|----------------|-------|---------------------|
| `examenes-plantilla-lab-capture.clean.json` | 41 | Seeds orden lab (CodPrestacion) |
| `examenes-plantilla-rad-capture.clean.json` | 137 | Seeds imagenología |
| `interconsultas-frecuentes-capture.clean.json` | 18 | Aliases interconsulta |
| `medicamentos-frecuentes-capture.clean.json` | 21 | Demo receta / entityBoost |
| `especialidades.clean.json` | 647 | Autocomplete derivación |
| `medicamentos-vademecum.clean.json` | 2688 | Referencia only — no runtime MVP |
| `diagnosticos-cie10.clean.json` | 1533 | Referencia only — CIE-10 DEFERRED |

## Excluidos del archivo

- **9 JSON vacíos** (`prestaciones-*`, `aranceles-fonasa-lyra`, `diagnosticos-ges`, etc.).
- **5 HTML Lyra** (jQuery/Kendo) — UI rechazada en EPIS2.

## Regenerar

```bash
node scripts/migration/archive-lyra-catalogs.mjs
# o: LYRA_EXPORT_DIR=/ruta/al/export node scripts/migration/archive-lyra-catalogs.mjs
```

## No copiados a producto

- HTML plantillas Lyra.
- Arrays vacíos del export incompleto (`fichaOpened: false` en origen).
- Import directo a command-registry / frontend.
