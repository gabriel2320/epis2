# EPIS2 Screen Tree

The product opens directly into clinical work. There is no marketing landing
page and no dashboard-as-home pattern.

## Active Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects to `/pacientes`. |
| `/login` | Local development login for synthetic users. |
| `/pacientes` | Clinical cockpit workspace: patient census, central action panel, contextual rail. |
| `/pacientes/nuevo` | Create a synthetic patient record. |
| `/pacientes/[patientId]/ficha` | Longitudinal patient cockpit with timeline, signals, tabs, audit and print access. |
| `/pacientes/[patientId]/evoluciones/nueva` | Focused SOAP/evolution creation route. |
| `/pacientes/[patientId]/auditoria` | Patient audit trail. |
| `/print/pacientes/[patientId]/ficha` | Printable patient summary projection. |

## Clinical Cockpit Layout

`/pacientes`:

- left patient census;
- central suggested action and patient state;
- right contextual rail for audit, optional AI, permissions and paper;
- compact command strip through direct clinical actions, not a registry.

`/pacientes/[patientId]/ficha`:

- persistent clinical header;
- timeline-centered workspace;
- visual tabs for timeline, problems, medication, vitals, audit and paper;
- contextual SOAP drawer for in-place writing;
- right rail for operational state, optional AI and traceability.

## Print Route

The print route is a projection of API data. It must never become a separate
clinical source of truth.

Print output must remain:

- visibly marked as development/non-production;
- derived from the patient record API;
- concise enough for paper review;
- clear about draft/final status when final signing states are introduced.

## Explicitly Not Active

- no CICA routes;
- no `/app/buscar`;
- no `/espacio`;
- no dashboard home;
- no placeholder screens for future modules.
