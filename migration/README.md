# Zona de cuarentena — migración legacy

Todo código extraído de EPIS, EPIDOS o EPIONE vive aquí hasta pasar revisión humana,
adaptación, tests y aprobación explícita. **No integrar en `apps/` ni `packages/` productivos.**

## Estructura

```text
migration/
├─ README.md
├─ candidates/
│  ├─ epis/
│  ├─ epidos/
│  └─ epione/
├─ adaptations/     (notas de adaptación transversales)
├─ rejected/        (registro de rechazos sin copia)
└─ reports/         (salidas JSON de scripts legacy:audit)
```

## Ciclo de vida

1. Entrada en `legacy-import-manifest.json` (`REVIEW_REQUIRED` → `APPROVED_FOR_EXTRACTION`).
2. Copia mínima a `candidates/<proyecto>/<nombre>/original/`.
3. Adaptación en `proposed/` + `tests/` (sin dependencias OpenMRS/Carbon).
4. Gates: `npm run legacy:validate-manifest` y `npm run legacy:validate-quarantine`.
5. Plan de integración en `docs/legacy-audit/EPIS2_MIGRATION_INTEGRATION_PLAN.md`.

## Reglas

- Cada carpeta candidata incluye `SOURCE.md` y `REVIEW.md`.
- No copiar `node_modules`, lockfiles, `.env`, carpetas `openmrs/`, UI Carbon/O3.
- La IA y los borradores legacy no se conectan a la API productiva EPIS2 desde aquí.
