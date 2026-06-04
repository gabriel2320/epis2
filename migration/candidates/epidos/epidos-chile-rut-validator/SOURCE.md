# Procedencia — epidos-chile-rut-validator

| Campo | Valor |
|-------|--------|
| Proyecto origen | EPIDOS |
| Ruta origen | `packages/shared/src/rut.ts` |
| Commit origen | `38d59bee27c44e32f5df53e2eac54260eab8d263` |
| Clasificación | MIGRATE_WITH_ADAPTATION |
| Motivo | Validación RUT/RUN chilena pura, útil para búsqueda de paciente y comandos con identificador |

## Dependencias legacy

Ninguna (módulo puro).

## Riesgos

- Bajo: lógica determinística; verificar licencia MIT del monorepo EPIDOS antes de integración final.

## Licencia

Repositorio EPIDOS privado local — confirmar licencia con mantenedor antes de `APPROVED_FOR_INTEGRATION`.

## Archivos copiados

- `original/rut.ts`

## Archivos deliberadamente no copiados

- Resto de `packages/shared/` (schemas acoplados a EPIDOS).
- Tests EPIDOS embebidos en otros paquetes (crear tests EPIS2 al integrar).
