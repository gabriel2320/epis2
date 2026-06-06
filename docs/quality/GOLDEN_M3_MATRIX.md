# EPIS2 — Matriz Golden Journey × M3 × dominio

**Microfase:** MF-184  
**Journey canónico:** `docs/quality/GOLDEN_CLINICAL_JOURNEY.md`  
**Gates M3:** `docs/quality/M3_ANTI_DRIFT_GATES.md`

---

## Capas del journey

| Capa | Artefacto | CI |
|------|-----------|-----|
| G0 | `tests/golden-clinical-journey.spec.ts` | Siempre |
| G1 | `tests/golden-clinical-journey.api.spec.ts` | `DATABASE_URL` |
| G2 | `apps/web/src/**/*.test.tsx` | Siempre |
| G3 | `e2e/golden-command-evolution.spec.ts`, `e2e/golden-draft-approval.spec.ts` | Playwright |
| G4 | `docs/quality/PILOT_DEMO_CHECKLIST.md` | Manual |

---

## Pasos × superficie M3 × dominio

| Paso | Journey | Superficie M3 / layout | Dominio / API | E2E |
|------|---------|------------------------|---------------|-----|
| 1 | Login | `EpisAuthScreen`, M3-04 teclado | `POST /api/auth/login` | `golden-draft-approval` UI login |
| 2 | Centro de Comando | `EpisPowerBar`, WIDGET-01, M3-07 tablero | `POST /api/commands/resolve` | `golden-command-evolution` |
| 3 | Paciente sintético | LAYOUT-02 panel paciente, chip DEMO | `GET /api/patients` | Ambos E2E |
| 4 | Comando evolución | Intent → ruta sin dashboard | Registry único | `golden-command-evolution` |
| 5 | Formulario evolución | M3-05 two-pane, `EpisClinicalForm` | Blueprint `evolution_note` | `golden-command-evolution` |
| 6 | Guardar borrador | `EpisButton` primario, status chip | `POST /api/drafts` | `golden-draft-approval` |
| 7 | Aprobación humana | `EpisApprovalGate` | `POST /api/drafts/:id/approve` | `golden-draft-approval` |
| 8 | Auditoría | Mensaje éxito + SoT `clinical_notes` | `audit_events`, `approvals` | G1 API slice |
| 9 | Volver a comando | Shell clínico, contexto paciente | Sesión + active patient | `golden-draft-approval` |

---

## Dominios V2–V5 (G1 API)

| Dominio | Slice API | Blueprint / ruta | Estado MF |
|---------|-----------|------------------|-----------|
| Documentos / export | golden-v1 | `patient_summary` | Baseline |
| Censo / ingreso | golden-v2 | inpatient API | MF-183 estabilizar |
| MAR / enfermería | golden-v3 | `medication_administration` | Baseline |
| Interop HL7 | golden-v4 | validate only | Baseline |
| IA trazable | golden-v5 | assist + RAG demo | MF-187 stack |

---

## Checklist M3 por microfase UI

Toda entrega de pantalla nueva debe verificar:

1. Tokens `createEpis2Theme` — sin hex sueltos en layout clínico.
2. Roles clínicos — contraste WCAG en chips de estado.
3. `prefers-reduced-motion` — sin animaciones obligatorias.
4. RTL / teclado — foco visible en power bar y formularios.
5. Copy español — `packages/design-system/src/copy/es.ts`.

---

## Próxima ampliación (MF-157+)

| Microfase | Paso journey | M3 |
|-----------|--------------|-----|
| MF-157 admission_note | 5–6 | M3-05 form nuevo |
| MF-158 cadena ingreso | 4–8 | Comando + API admit |
| MF-159 alergias | 6–8 | Form CRUD |
| MF-160 problemas | 6–8 | Form CRUD |
