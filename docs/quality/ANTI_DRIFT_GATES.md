# EPIS2 — Gates anti-deriva

Evitan repetir la deriva de EPIS: CI verde sin producto alineado.

---

## Capas de gate

| Capa | Comando | Qué protege |
|------|---------|-------------|
| Lint + tipos | `npm run lint`, `npm run typecheck` | Calidad base |
| Tests unitarios | `npm run test` | Contratos y API bootstrap |
| DB | `npm run db:validate` | Migraciones SQL |
| Arquitectura | `npm run architecture:validate` | Patrones rechazados EPIS |
| Journey dorado | `npm run quality:golden-journey` | Flujo clínico demo |
| **Check compuesto** | `npm run check` | Todo lo anterior (salvo journey si está skip) |

---

## Validadores arquitectónicos

| Validador | Falla si… |
|-----------|-----------|
| `main-product-invariants` | Faltan docs/manifiesto/paquetes canónicos |
| `no-legacy-dependencies` | OpenMRS, Carbon, imports EPIS |
| `single-command-registry` | Segundo registry de comandos |
| `single-form-registry` | Segundo registry de formularios |
| `command-center-home` | Dashboard o rutas legacy como home |
| `spanish-visible-copy` | Microcopy clínica visible en inglés |
| `explicit-permissions` | Wildcards en permisos |
| `ai-write-boundary` | IA escribe o usa ORM clínico |
| `human-approval-required` | Auto-aprobación en código |

---

## Señales de parada (humanas)

Detener feature work si aparece:

- Dashboard o KPI en home.
- Menú hospitalario antes del journey dorado.
- Segundo registry «temporal».
- Dependencia `@openmrs` «solo para probar».
- IA que persiste notas finales.
- Import desde EPIS sin manifiesto.

---

## Integración CI

`.github/workflows/ci.yml` ejecuta `npm run check` (incluye `architecture:validate`).

---

## Relación con microfases

Cada `EPIS2-NN` añade gates en `docs/QUALITY_GATES.md`. Los gates de esta página son **permanentes** en todas las fases.
