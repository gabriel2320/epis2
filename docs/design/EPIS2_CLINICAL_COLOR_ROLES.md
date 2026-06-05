# EPIS2 — Roles de color clínicos

**Archivo canónico:** `packages/epis2-ui/src/theme/clinical/clinical-semantic-roles.ts`

## Roles protegidos

| Rol | Uso | Icono + texto obligatorio |
|-----|-----|---------------------------|
| `critical` | Riesgo vital, bloqueo seguro | Sí |
| `warning` | Advertencia CDS | Sí |
| `approved` | Dato aprobado humanamente | Sí |
| `draft` | Borrador no final | Sí |
| `blocked` | Acción prohibida | Sí |
| `aiAssistance` | Sugerencia IA — no aprobada | Sí |
| `missingData` | Datos faltantes comando | Sí |

## Reglas

1. **No cambian** entre Clinical Blue y Calm Teal.
2. No usar rojo como decoración.
3. `aiAssistance` ≠ `approved`.
4. En UI clínica: «Asistencia de IA» — nunca «Ollama».

## Compatibilidad

`clinical-roles.ts` (runtime actual) permanece hasta THEME-02; convergerá con semantic roles.
