# EPIS2 — CE-2: confirmación explícita + slots enriquecidos

**Fecha:** 2026-06-04  
**Alcance:** Gate de confirmación para intents `safetyLevel: order` + slots ampliados + UI de diálogo.

---

## CE-2 — Confirmación explícita (order/sign)

### Registry

- Nuevo estado **`needs_confirmation`** en `CommandResolveResult`.
- `confirmation.ts`: `requiresExplicitConfirmation()` filtra por `safetyLevel === 'order' | 'sign'`.
- Router: tras permisos y paciente, si order/sign y `confirmed !== true` → `needs_confirmation` con mensaje contextual.
- `CommandResolveInput.confirmed?: boolean` — segunda llamada con `confirmed: true` resuelve y navega.

Intents con gate (6): `prepare_prescription`, `request_laboratory`, `request_referral`, `request_imaging`, `record_medication_administration`, `admit_patient_hospital`.

Epicrisis/certificado/traslado (`confirmationRequired: true` pero `safetyLevel: draft`) **no** pasan por CE-2 — siguen abriendo formulario directo.

### Slots enriquecidos

`CommandSlots` ampliado:

| Slot | Ejemplo |
|------|---------|
| `specialtyHint` | interconsulta a cardiología |
| `bodySiteHint` | TAC de tórax |
| `urgencyHint` | urgente / stat / routine |
| `medicationHint`, `studyHint`, `patientHint` | mejorados |

Mensaje de confirmación incluye detalles extraídos.

### API + contracts

- `commandSlotsSchema` compartido.
- Request: `confirmed?: boolean`.
- Response: rama `needs_confirmation` con `routePath`, `safetyLevel`, `slots`.

### Web

- `CommandConfirmationDialog` — diálogo explícito antes de abrir formulario order.
- `useClinicalCommandSubmit` — maneja `pendingConfirmation`, `confirmPending`, `cancelPending`.
- `CommandCenterPage` refactorizado al hook unificado + diálogo.
- `PatientWorkspaceCommandPanel` — mismo patrón.

Copy: `needsConfirmationTitle`, `needsConfirmationConfirm`, `needsConfirmationCancel`.

### Tests

- `confirmation.test.ts` — gate + slots + confirmación.
- `resolveCommandWithAutoConfirm` — helper para flujos E2E que simulan confirmación humana.
- Golden journey / integration actualizados (order → confirm → resolve).

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | 467 tests OK |
| `npm run db:validate` | OK |

---

## Riesgos

- UI web confirma en cliente; API acepta `confirmed: true` sin re-validar sesión de diálogo — aceptable en MVP demo (humano en loop real).
- Formularios aún no pre-rellenan desde slots (CE-3 propuesto).
- Intents `sign` reservados — ninguno en registry aún.

---

## Próximo paso sugerido

- **CE-3:** prefill de formularios desde slots + sugerencias semánticas (sin IA en resolve).
- **UX-G02:** validación manual ficha + flujo order (hemograma → confirmar → laboratorio).
- **UX-B.2b (opcional):** tab secundario notas/borradores en ficha.
