# EPIS2 — Contrato de blueprints clínicos

**Microfase:** MF-156  
**Registry:** `packages/clinical-forms/src/registry.ts`  
**Factory:** `packages/clinical-forms/src/factory.ts`

---

## Campos obligatorios (`ClinicalFormBlueprint`)

| Campo | Regla |
|-------|--------|
| `blueprintId` | kebab o snake único en registry |
| `routePath` | `/espacio/*` único; enlazado en router |
| `intentIds` | Subconjunto de `@epis2/command-registry` |
| `allowedRoles` | Roles con `draft.write` o lectura según `outputKind` |
| `outputKind` | `CLINICAL_NOTE_DRAFT` para notas; `ORDER_DRAFT` para órdenes |
| `approvalRequired` | `true` salvo búsqueda/resumen lectura |
| `aiAssistMode` | `NONE` en registry UI; IA vía `local-ai` por `draftType` |

---

## Pasos para añadir blueprint

1. Crear `packages/clinical-forms/src/blueprints/<name>.ts` con `defineBlueprint()`.
2. Exportar en `blueprints/index.ts`.
3. Registrar en `EPIS2_FORM_BLUEPRINTS`.
4. Añadir ruta en `apps/web/src/routes/router.tsx` (o usar generador de rutas clínicas).
5. Mapear `draftType` en `clinicalApi` si aplica.
6. Ejecutar `assertRegistryInvariants()` — tests en `registry.test.ts`.
7. Si requiere IA: seguir `docs/clinical/IA_BLUEPRINT_PATTERN.md` (MF-188).

---

## Scaffolder

```typescript
import { scaffoldBlueprintModule } from '@epis2/clinical-forms/scaffold';

const snippet = scaffoldBlueprintModule({
  blueprintId: 'admission_note',
  routeSegment: 'ingreso',
  label: 'Nota de ingreso',
  intentId: 'admit_patient_hospital',
  roles: ['physician'],
});
```

El scaffolder genera plantilla TypeScript; el autor debe completar campos clínicos y tests.
