# EPIS2 — Separación rol × ámbito × ventanas de acción

**Fecha:** 2026-06-04  
**Alcance:** Navegación clínica, RBAC demo, copy ES, gates de calidad.

## Objetivo

Separar claramente:

- **Roles:** médico, enfermería, paramédico, kinesiólogo, farmacia, auditoría, administrativo.
- **Ámbitos:** ambulatorio, hospitalización (sala básica), cuidados intermedios, UCI, pabellón quirúrgico, urgencias.
- **Ventanas de acción:** agrupación por intención clínica (no menú infinito).

## Cambios principales

| Área | Archivo / artefacto |
|------|---------------------|
| Matriz canónica | `apps/web/src/navigation/clinicalRoleCareMatrix.ts` |
| Workspaces MD3 (11) | `clinicalWorkspaceRegistry.ts` — `inpatient_ward`, `intermediate_care`, `pharmacy_clinical` |
| Rail filtrado por rol | `epis2NavigationRail.tsx` |
| Contexto visible (rol · workspace · ámbito) | `ClinicalRoleCareContext.tsx` — oculto en `/comando` |
| Roles demo | `paramedic`, `kinesiologist` en domain, contracts, `DEMO_USERS.md` |
| Copy ES | `packages/design-system/src/copy/es.ts` — roles, careSettings, actionWindows |
| Gate | `quality:role-care-separation-gate` |

## Perfiles por rol (resumen)

| Rol | Workspace por defecto | Ámbitos |
|-----|----------------------|---------|
| Médico | Ambulatorio | Ambulatorio, hospitalización, intermedios, UCI, pabellón, urgencias |
| Enfermería | Hospitalización | Idem + ambulatorio |
| Paramédico | Urgencias | Solo urgencias |
| Kinesiólogo | Ambulatorio | Ambulatorio, hospitalización, intermedios |
| Farmacia | Farmacia clínica | Ambulatorio (revisión farmacéutica) |
| Auditoría | Calidad / IAAS | Institucional |
| Administrativo | Admin sistema | Institucional + recepción |

## Ventanas de acción (`EPIS_ACTION_WINDOWS`)

Intención → rutas permitidas → roles:

- `command_intent` → `/comando`
- `patient_lookup` → búsqueda / ficha / resumen
- `ambulatory_encounter` → consulta ambulatoria
- `inpatient_ward_care` → ingreso, traslado, epicrisis
- `intermediate_care_monitoring` → enfermería / tablero intermedios
- `icu_critical_care` → UCI
- `or_perioperative` → pabellón
- `emergency_response` → urgencias
- `pharmacy_clinical_review` → farmacia, conciliación, receta
- `quality_audit` → calidad / auditoría
- `admin_operations` → administración / recepción

## Gates ejecutados

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK (tras actualizar tests registry) |
| `npm run db:validate` | OK |
| `quality:role-care-separation-gate` | OK |

## Riesgos

- Tableros legacy (`/epis2/dashboard?tab=*`) siguen compartiendo rutas entre ventanas; la separación lógica está en matriz, no en URLs nuevas.
- Paramédico sin acceso ambulatorio es intencional; validar con usuarios reales.
- Demo users nuevos requieren seed/API alineado si se prueba login end-to-end.

## Próximo paso

1. MF-UI-02…06: ActionBar única, `ClinicalWorkspaceShell`, gates de acciones duplicadas.
2. E2E UX-G02 con chips rol/ámbito fuera de comando.
3. Tramo J farmacia cuando densidad UI esté estable.
