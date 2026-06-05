# EPIS2 — Reglas de visibilidad de widgets

## Orden de evaluación

1. **Permiso de rol** — si el rol no está en `allowedRoles` → oculto, sin fetch, sin datos.
2. **Dashboard en home** — categoría `dashboard` no se muestra en superficie `command-center`.
3. **Oculto por defecto** — si `hiddenByDefault` y el id no está en `explicitlyShownWidgetIds` → sin fetch.
4. **Contexto requerido** — todos los ítems de `requiredContext` deben estar presentes.
5. **Permitido** — `visible=true`, `shouldFetch=true`.

## Reglas por widget demo

| Widget | Requiere |
|--------|----------|
| patient-summary, active-problems, recent-labs | `patient` |
| pending-drafts, my-work | `user` |
| patient-context | `patient` (esencial cuando hay paciente activo) |

## Fetch

- `shouldFetch === false` → el host **no** debe llamar API ni IA.
- Widget `forbidden` nunca revela payload clínico.

## Superficies

| Superficie | Uso |
|------------|-----|
| `command-center` | Home — widgets esenciales y contexto |
| `patient-workspace` | Ficha / espacio del paciente |
| `clinical-form` | Formularios `/espacio/*` |
| `dashboard` | Tablero secundario (no home) |

## Offline

Si `context.offline === true`, la presentación preferente es estado `offline`; los widgets con `aiMode: optional-offline` siguen renderizando con fixtures o vacío.
