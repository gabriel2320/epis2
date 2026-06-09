# F1 + F2 — Limpieza pareada + refactor print + órdenes A5 (cierre PEND-006 código)

**Fecha:** 2026-06-09 · **Alcance:** plan F1/F2 de [`epis2-auditoria-inventario-limpieza-2026-06-09.md`](./epis2-auditoria-inventario-limpieza-2026-06-09.md)

## F1 — Limpieza pareada código + gate

| Eliminado | Tipo | Gate tocado |
|---|---|---|
| `apps/web/src/components/CommandCenterMinimalBlocks.tsx` | Componente sin importadores | Ninguno — el gate layout solo lo lista como token prohibido (protección anti-reintroducción que se conserva) |
| `packages/epis2-ui/src/command/EpisCommandMetaChips.tsx` (+ export) | Componente sin consumidores | Ídem |
| `apps/web/src/components/command/EpisCommandBarContextual.tsx` | Componente sin importadores | `validate-m3-scaffold-gate.mjs` — retirada la exigencia de existencia |
| `scripts/migrate-web-mui-imports.mjs` | One-off de migración MUI ya ejecutada | — |
| Clave copy `powerBarNaturalPlaceholder` | Duplicada de `powerBarPlaceholder`, 0 usos | — |

Decisión documentada: `EpisBentoGrid` **se conserva** — es primitiva de librería con tests; eliminar API pública del paquete excede el alcance de limpieza de esta sesión.

## F2 — Refactor print + órdenes A5

### Abstracción nueva (`apps/web/src/clinical/print/`)

| Archivo | Rol |
|---|---|
| `usePrintPagePatient.ts` | Estado común: search patientId, preview sessionStorage, fetch paciente, profesional |
| `PrintPageToolbar.tsx` | CTA imprimir + volver, ocultos en `@media print` (norma §4.2) |
| `printableBlueprints.ts` | **Registry único** blueprint → ruta print + etiqueta CTA (Carta/A5) |
| `printValueLabels.ts` | Prioridad explícita en texto — nunca solo color (norma §16.2) |

### Migración y generalización

- Las 3 páginas print existentes (certificado, receta, epicrisis) migradas a la abstracción: ~85→~55 líneas c/u, sin duplicación de fetch/toolbar.
- `GeneratedClinicalFormPage`: los 3 bloques repetidos de botón print se reemplazaron por **un solo CTA genérico** alimentado por `PRINTABLE_BLUEPRINTS` (testid `epis2-print-preview-<blueprintId>` vía plantilla). Añadir el 6.º documento imprimible ahora es 1 entrada de registry + 1 página.

### Órdenes A5 nuevas (norma §19.7)

| Documento | Página | Ruta | E2E |
|---|---|---|---|
| Orden de laboratorio (`lab_request`) | `LabRequestPrintPage.tsx` | `/espacio/laboratorio/imprimir` | `ola6a-print-orders.spec.ts` ✓ |
| Orden de imagenología (`imaging_request`) | `ImagingRequestPrintPage.tsx` | `/espacio/imagenologia/imprimir` | ídem ✓ |

Copy nuevo en `es.ts` (`labRequestTitle`, `imagingRequestTitle`, `scheduledDate`, `modality`, etc.).

### Gate ampliado

`quality:ola6a-print-gate` ahora valida: 5 páginas print + 4 módulos de la abstracción + registry con 5 blueprints + 5 rutas + 3 specs E2E. Ya no depende de literales de testid en la página (que el refactor volvió plantilla).

## Gates

| Gate | Estado |
|---|---|
| `quality:ola6a-print-gate` | ✓ |
| `quality:m3-scaffold-gate` | ✓ (sin `EpisCommandBarContextual`) |
| `quality:command-center-layout-gate` | ✓ |
| `npm run check` | ✓ |
| `npm run test` | ✓ (suite completa) |
| Tests print focalizados | 6 archivos / 9 tests ✓ |

## Estado PEND-006

**Código cerrado**: receta + certificado + lab + imagen (A5) y epicrisis (Carta), todos con E2E en CI sobre registry único. Resta únicamente el signoff visual humano opcional del piloto M3 (no bloqueante).

## Próximo paso exacto

P1b alto contraste ampliado, o F4 sesión documental (sync `dev-agent-brief` ← tablero, índices, archivado).
