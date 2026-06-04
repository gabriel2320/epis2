# Procedencia — epione-mau-resolver-reference

| Campo | Valor |
|-------|--------|
| Proyecto origen | EPIONE |
| Rutas origen | `packages/shared/src/medical-action-universe/{resolver,types}.ts` |
| Commit origen | `72851ab06450e4d9f7f1a5e51d36fb9ad5cce822` |
| Clasificación | REWRITE_FROM_CONCEPT |
| Motivo | Referencia de ranking MAU y resolución de acciones médicas en español |

## Dependencias legacy

- Catálogos JSON masivos en `data/catalogs/epione/` (no copiados).
- UI Radix/Tailwind (rechazada para EPIS2).

## Riesgos

- Alto si se importa catálogo completo (volumen, mock, posible deriva).
- Resolver acoplado a actionIds EPIONE ≠ intents EPIS2.

## Archivos copiados

- `original/resolver.ts`, `original/types.ts` (solo lectura de algoritmo)

## No copiados

- `catalog-seeds.ts`, JSON Lyra, handlers localStorage, backend executors.
