# CICA Development Preservation

CICA is intentionally not part of the new runtime. This document preserves the
useful development learning without keeping the CICA code alive.

## Preserved Lessons

- Start clinical work from patient/census selection, not a dashboard.
- Keep clinical writing in context with the patient.
- Make paper/print a first-class projection, not decoration.
- Separate drafts from final clinical facts.
- Keep audit and human review visible.
- Keep optional AI subordinate to clinician action.
- Prefer one cockpit workflow over many competing modes.

## Not Preserved As Code

- CICA screen registry.
- CICA route derivation.
- Legacy command/form registries.
- `/app/buscar` as canonical home.
- `/espacio` fallback.
- Dashboard and three-mode navigation.
- Generated future route scaffolds.

## New Interpretation

- `/pacientes` is the operational entry point.
- `/pacientes/[patientId]/ficha` is the cockpit.
- SOAP creation happens in a contextual panel or focused route.
- Audit is visible through the patient record, not a hidden admin surface.
- Print is derived from the same API truth as the cockpit.

## Rescue Rule

If an old CICA idea is useful, reintroduce it only as:

- a product requirement;
- a focused API/schema/model change;
- a minimal screen interaction;
- a test;
- an update to current docs.

Never reintroduce CICA registries, compatibility layers, or route derivation.
