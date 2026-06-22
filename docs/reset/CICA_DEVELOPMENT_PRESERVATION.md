# CICA Development Preservation

CICA is intentionally not part of the new runtime.

Preserved lessons:

- The active workspace must start from patient/census selection, not a dashboard.
- Clinical writing must stay in context with the patient.
- Paper/print is a first-class clinical projection, not decoration.
- The UI needs strong guardrails around draft vs final clinical facts.
- Audit and human review must be visible instead of buried.

Not preserved as code:

- CICA screen registry.
- CICA route derivation.
- Legacy command/form registries.
- `/app/buscar` as canonical home.
- `/espacio` fallback.

New interpretation:

- `/pacientes` is the operational entry.
- `/pacientes/[patientId]/ficha` is the cockpit.
- SOAP creation happens in a contextual panel or focused route.
