# EPIS2 — Arquitectura de widgets clínicos contextuales

**Fase:** WIDGET-01 · **Estado:** Montaje M3 en web (Comando + ficha) — signoff 2026-06-05  
**Frase guía:** *Los widgets muestran lo necesario, cuando es necesario, y siempre conducen al trabajo clínico.*

---

## Principio rector

Los widgets **no** son tarjetas decorativas ni reemplazan el **Centro de Comando** (home canónica).

Cada widget:

- Responde una necesidad concreta en contexto (usuario, rol, paciente, encuentro, servicio, comando, actividad).
- Permanece **oculto por defecto** salvo widgets esenciales declarados.
- Soporta estados: `loading`, `ready`, `empty`, `error`, `forbidden`, `offline`.
- Carga de forma diferida solo si `shouldFetch === true`.
- Conduce a **comando** o **ruta clínica** — nunca escribe ni aprueba datos.
- Muestra copy en **español**.

## Paquetes

| Paquete | Responsabilidad |
|---------|-----------------|
| `@epis2/epis2-widgets` | Contratos, registry único, visibilidad, permisos, layout, fixtures sintéticos |
| `@epis2/epis2-ui` | Superficies M3 reutilizables (`Epis2Widget*`) |

## Registry único

```text
packages/epis2-widgets/src/registry/widget-registry.ts
```

Gate arquitectónico: `single-widget-registry.mjs`.

## Flujo de resolución

```mermaid
flowchart TD
  C[WidgetContext] --> P[validateWidgetPermission]
  P -->|forbidden| H[visible=false shouldFetch=false]
  P -->|allowed| V[resolveWidgetVisibility]
  V -->|dashboard en home| H
  V -->|hiddenByDefault| H
  V -->|missing context| H
  V -->|ok| R[visible=true shouldFetch=true]
  R --> UI[Epis2WidgetSurface + estados]
```

## Montaje WIDGET-01

| Superficie | Host | Widgets demo |
|------------|------|--------------|
| `command-center` | `CommandCenterPage` | `patient-context`, `pending-drafts` |
| `patient-workspace` | `PatientWorkspacePage` | `patient-summary`, `active-problems` |

Código host: `apps/web/src/widgets/` — usa `@epis2/epis2-widgets` + superficies `Epis2Widget*` en `@epis2/epis2-ui`.

## Fuera de alcance (WIDGET-01)

- Widgets en formularios `/espacio/*` (superficie `clinical-form`)
- Fetch masivo / IA obligatoria
- Segundo registry

## Referencias

- `docs/widgets/EPIS2_WIDGET_CATALOG.md`
- `docs/widgets/EPIS2_WIDGET_VISIBILITY_RULES.md`
- `docs/widgets/EPIS2_WIDGET_MATERIAL3_PATTERN.md`
- `docs/product/PRODUCT_INVARIANTS.md` (invariantes 6–10)
