# EPIS2 Development Plan

EPIS2 will grow from the reset baseline into a complete medical record:
patient-centered, auditable, assisted by development agents, prepared for
clinical AI, visually modern, and still small enough to correct quickly.

## Product North Star

EPIS2 is a full medical record cockpit, not a dashboard collection. The main
unit is the patient record (`ficha`), and every module must improve the clinician
workflow around that record.

The product must feel:

- modern, colorful, dynamic, and clinically useful;
- dense enough for desktop clinical work;
- usable on mobile for lookup and light actions;
- configurable without becoming a second product;
- modular inside the monolith, not split into a package forest.

## Non-Negotiable Boundaries

- PostgreSQL is the source of truth.
- Clinical writes go through FastAPI and emit audit.
- AI can suggest but cannot sign, approve, or write final clinical facts.
- Development agents may propose, implement, test, and review code, but humans
  approve clinical product decisions.
- No CICA compatibility layer, no `/espacio`, no dashboard home, no labs in core.
- No clinical module ships without model, schema, endpoint, UI, and test.

## Target Medical Record Modules

Build modules in this order. Each module must be small, testable, and absorbed
into the current app/API structure.

| Priority | Module | Purpose | Minimum V1 Surface |
| --- | --- | --- | --- |
| 1 | Patient identity | Reliable synthetic demographic record. | patient create/edit, identifiers, status, care context |
| 2 | Encounters | Organize care events. | encounter list, active encounter, link SOAP entries |
| 3 | SOAP/evolutions | Longitudinal clinical narrative. | draft SOAP, status, timeline, audit |
| 4 | Problems | Active/resolved clinical problems. | add/resolve problem, show in ficha rail |
| 5 | Allergies | Safety-critical warnings. | add allergy, severity, reaction, active/inactive |
| 6 | Medications | Current medication list. | active meds, dose/frequency/free text, stop reason |
| 7 | Vital signs | Structured observations. | BP, HR, temperature, SpO2, weight, trend strip |
| 8 | Documents/print | Paper projection and export discipline. | print ficha, print disclaimers, document status |
| 9 | Audit/permissions | Trust and governance surface. | actor, action, patient, timestamp, role guard |
| 10 | AI assistance | Draft help and summarization. | suggest SOAP text, summarize timeline, never final write |

Later modules such as orders, results, procedures, referrals, imaging, and
prescriptions must wait until the first ten modules are stable.

## UX Direction

The UI direction is Clinical Cockpit:

- `/pacientes`: census on the left, patient action center in the middle, context
  rail on the right.
- `/pacientes/[patientId]/ficha`: persistent clinical header, longitudinal
  timeline, tabs for modules, right rail for state/audit/AI/print.
- Contextual drawer: create SOAP or small clinical updates without losing the
  patient context.
- Focus routes: use full-page routes only when the task needs more space.

Visual rules:

- graphite and white base;
- teal for clinical action and active state;
- amber for attention or pending review;
- rose for risk, errors, allergies, or destructive actions;
- secondary colors allowed only as module accents;
- motion must explain state changes, not decorate empty space.

Do not build marketing heroes, card-heavy dashboards, or route placeholders.

## Configurability Model

EPIS2 should be configurable through typed configuration, not through registries
that generate a second product.

Allowed configuration:

- environment variables for runtime behavior;
- typed constants for UI labels, module order, and feature flags;
- role/permission maps owned by the API;
- module metadata colocated with the module screen/API when needed;
- seed data limited to synthetic development use.

Forbidden configuration:

- runtime screen registry;
- generated route registry;
- generic form registry for clinical modules;
- admin UI that creates clinical modules without code review;
- per-feature package creation.

Feature flags should be temporary and named by outcome, for example
`EPIS2_AI_PROVIDER`, not by campaign or experiment.

## Modular Monolith Structure

Keep the monolith modular by ownership, not by packages:

- API modules live under `apps/api/src/epis2_api/api/v1/routes`,
  `models`, `schemas`, `repositories`, and `services`.
- Web modules live under `apps/web/src/components/clinical`,
  `apps/web/src/app`, and `apps/web/src/lib`.
- Contracts remain generated in `packages/contracts/openapi.json`.
- Shared behavior should start as a local helper. Extract only after repeated
  real use and a clear owner.

Every module should have:

- data model or explicit model owner;
- Pydantic schemas;
- route handlers;
- repository/service behavior when needed;
- UI entry point in the ficha or patient workspace;
- API tests and, when visible, E2E or component-level coverage.

## AI-Ready Product Architecture

Clinical AI must be prepared as a boundary, not as a hidden author.

Allowed AI capabilities:

- SOAP draft suggestions;
- timeline summarization;
- problem/medication/allergy review hints;
- missing-data prompts;
- print summary drafting;
- explanation of why a suggestion was produced.

Required AI safeguards:

- user must explicitly request or accept AI output;
- all AI output is draft/proposed state;
- no AI output becomes final without clinician action;
- AI writes no clinical row directly;
- prompts and responses must avoid real PHI in development;
- degraded mode must keep the core record usable.

## Development Agents Model

AI development agents can accelerate EPIS2, but must be constrained by the same
anti-inflation rules.

Recommended agent roles:

- Planner agent: turns a product request into a small module plan.
- Backend agent: implements model/schema/endpoint/audit/test.
- Frontend agent: implements cockpit UI, motion, responsive behavior, and visual states.
- Contract agent: checks OpenAPI diff and frontend/API compatibility.
- QA agent: runs gates, Playwright smoke, screenshots, and regression notes.
- Security agent: checks auth, audit, PHI, AI boundary, and dependency notes.

Agent rules:

- one task per agent, one module at a time;
- agents must read `README.md`, `docs/GOVERNANCE.md`, and this plan first;
- agents cannot introduce new gates or packages without explicit human approval;
- agents cannot resurrect old EPIS2 code or CICA artifacts;
- agent output must include tests and a rollback/correction note.

## Delivery Phases

### Phase 0: Stabilize Reset Baseline

Goal: make the reset easy to clone, run, and trust.

Deliverables:

- documentation repaired and linked;
- Docker/PostgreSQL setup verified;
- official gates passing;
- E2E screenshots produced from smoke flow;
- known Next/PostCSS audit note tracked;
- local legacy hook issue documented outside product runtime.

Acceptance:

- new clone can run setup commands from README;
- `npm run check` passes;
- OneEpis remains untouched.

### Phase 1: Complete Ficha Core

Goal: make the patient ficha useful without AI.

Deliverables:

- editable patient identity and care context;
- encounter selection and active encounter display;
- SOAP timeline with draft/final-ready status;
- problems, allergies, medications, vitals CRUD;
- audit visible on every clinical write;
- print route includes key modules and status labels.

Acceptance:

- clinician can create a synthetic patient, document a visit, review safety
  context, print a summary, and inspect audit.

### Phase 2: Modern Cockpit UX

Goal: make the interface feel alive, fast, and clinically scannable.

Deliverables:

- polished module tabs and dense right rail;
- responsive desktop-first layout with usable mobile;
- animated drawer and optimistic save states;
- module color accents with accessible contrast;
- empty, loading, error, and saved states for all V1 modules;
- visual regression screenshots for patient list, ficha, SOAP, audit, and print.

Acceptance:

- no text overlap at desktop or mobile smoke viewports;
- no UI resembles OneEpis or old CICA;
- all actions stay reachable from patient context.

### Phase 3: AI Assistance Boundary

Goal: add useful AI without compromising clinical authority.

Deliverables:

- AI provider status in context rail;
- SOAP draft suggestion endpoint and UI;
- timeline summary suggestion;
- missing-data hints for ficha;
- audit event for AI suggestion accepted/rejected;
- disabled/offline AI state.

Acceptance:

- AI can help draft but never write final clinical facts;
- workflow works with AI disabled;
- tests prove AI permissions and audit boundaries.

### Phase 4: Configurable Modular Growth

Goal: add configuration without recreating CICA.

Deliverables:

- typed module order config for ficha tabs;
- role permission map;
- UI copy constants for clinical labels;
- environment-controlled optional AI provider;
- documentation for adding a module through the feature ladder.

Acceptance:

- modules can be reordered or hidden by typed config where clinically safe;
- no route registry or form registry appears;
- adding a module remains explicit code with tests.

### Phase 5: Clinical Depth

Goal: carefully expand beyond the first medical record core.

Candidates, only after Phase 1-4:

- orders;
- lab/result inbox;
- imaging references;
- procedure notes;
- referrals;
- prescriptions with stricter safety states;
- signed documents.

Acceptance:

- each candidate ships as a complete vertical slice;
- no candidate creates a parallel product mode.

## Testing Strategy

Keep the five official gates:

- `check:api`;
- `check:web`;
- `check:contract`;
- `check:e2e`;
- `check`.

Add tests inside those gates, not as new gates.

Minimum scenarios:

- create synthetic patient;
- create encounter;
- create SOAP draft;
- add and resolve problem;
- add allergy and verify risk display;
- add active medication;
- add vital signs and show latest values;
- verify audit after every write;
- print patient summary;
- run with AI disabled;
- request AI suggestion and require human acceptance.

## Data And Safety Rules

- Synthetic data only.
- No imported real records.
- No production identifiers.
- No AI calls with real PHI in development.
- Print output must show development/non-production label until production
  readiness is explicitly established.
- Any future final/signature state must be modeled and audited explicitly.

## Definition Of Done For Any Module

A module is done only when all are true:

- model/migration or explicit model owner exists;
- schema and endpoint exist;
- UI workflow exists in patient context;
- writes create audit events;
- permissions are checked;
- API tests pass;
- visible workflows are covered by E2E or screenshot smoke;
- OpenAPI is updated and committed;
- docs mention the module if setup, routes, or governance changed.

## Roadmap Discipline

Development should be aggressive against legacy and conservative about new
surface area. EPIS2 can become a complete medical record only if every addition
keeps the cockpit coherent, auditable, and easy to modify.
