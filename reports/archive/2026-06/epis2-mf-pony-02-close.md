# MF-PONY-02 — Cierre (defer stubs sidebar CICA)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM

## Alcance

Ocultar entradas vacías del sidebar L1 sin borrar rutas `/app/*`.

## Cambios

| Acción | Detalle |
|--------|---------|
| Registry | `navVisible: false` en `recent-patients`, `my-work`, `agenda` |
| Sidebar | `buildCicaSystemSidebarSections` filtra por registry |
| UX directa | Banner info en páginas stub si URL directa |
| Gate | `validate-cica-screen-registry-gate` verifica defer + filtro nav |
| Tests | `cicaSidebarNav.test.ts` — L1 solo buscar + censo |

## Qué evitamos construir

- Tres ítems de sidebar que llevan a placeholders sin datos
- Cuarto mapa manual de «pantallas ocultas» fuera del registry

## Gates

| Gate | Resultado |
|------|-----------|
| `quality:cica-clean-room-close-gate` | OK |
| `cicaSidebarNav.test.ts` | OK |
| `quality:fast` | OK |

## Riesgos

Ninguno clínico — rutas y testIds de pantalla intactos; golden journey no usa stubs L1.

## Próximo paso

**MF-PONY-03** — collapse secciones demo paciente (`CicaPatientDemoSectionPage` parametrizada).
