# UX-G02 — Ejecución (2026-06-07)

**Ejecutor:** agente (automatizado) + E2E browser pendiente de entorno  
**Rama / commit:** working tree local (CE-0…CE-5)  
**Comando:** `npm run quality:ux-g02`

---

## Resultado global

| Capa | Resultado | Notas |
|------|-----------|-------|
| **API + registry** (`quality:ux-g02`) | **9/9 PASS** | Flujo TAC, confirmación, slots, prefill, URL strip, evolución, contexto SOAP |
| **Playwright E2E** (`test:e2e:ux-g02`) | **FAIL entorno** | `/comando` no monta React en Playwright (página en blanco); login API OK pero UI no renderiza |
| **Manual ojos humanos** | **Pendiente** | Pasos 1–2 narrativo, 10 guardar real, 14 densidad, 15 ≤30 s |

**Veredicto intermedio:** lógica command-first **verificada en backend/registry**. Gate humano UI **pendiente** hasta sesión manual en navegador o arreglo E2E local.

---

## Checklist — Parte A (automático)

| # | Paso | Resultado | Evidencia |
|---|------|-----------|-----------|
| 1–2 | `/comando` + paciente | ☐ manual | — |
| 3 | `pedir TAC de tórax` | ✓ | resolve → `needs_confirmation` |
| 4 | Intent imagenología | ✓ | `request_imaging` |
| 5 | Diálogo confirmación | ✓ | `needs_confirmation` (order) |
| 6 | Abrir formulario | ✓ | `resolved` → `/espacio/imagenologia` |
| 7 | Badge CE-5 | ✓ | slots presentes → badge elegible |
| 8 | Prefill | ✓ | `modality: TC`, `studyDescription: tac — torax` |
| 9 | URL limpia | ✓ | strip deja solo `patientId` |
| 10 | Guardar borrador | ☐ manual | requiere UI + revisión humana |

## Checklist — Parte B

| # | Paso | Resultado | Evidencia |
|---|------|-----------|-----------|
| 11 | Ficha compacta | ☐ manual | E2E no llegó |
| 12–13 | `hacer evolución` + paciente | ✓ | `create_evolution_draft` → `/espacio/evolucion` |
| 14 | Densidad / scroll | ☐ manual | — |
| 15 | ≤30 s comprensión | ☐ manual | — |

## Parte C

| # | Check | Resultado |
|---|-------|-----------|
| C1 | Cancelar confirmación | ✓ API (`needs_confirmation` sin `confirmed`) — UI manual |

---

## Salida `quality:ux-g02`

```
[PASS] 1-2-prereq-login: HTTP 200
[PASS] 3-5-imaging-needs-confirmation: needs_confirmation intent=request_imaging
[PASS] 4-slots-tac-torax: {"studyHint":"tac","bodySiteHint":"torax"}
[PASS] 6-open-imaging-form: resolved → /espacio/imagenologia
[PASS] 8-prefill-fields: {"studyDescription":"tac — torax","modality":"TC","clinicalIndication":"Región: torax"}
[PASS] 7-9-badge-and-url-clean: before=patientId,studyHint,bodySiteHint after=patientId
[PASS] 12-13-evolution-active-patient: resolved → /espacio/evolucion
[PASS] 14-context-soap-prefill: objective, assessment, plan
[PASS] C1-cancel-path: UI cancel manual en /comando
```

---

## Artefactos añadidos

| Archivo | Uso |
|---------|-----|
| `scripts/qa/run-ux-g02-validation.ts` | Gate automatizado repetible |
| `npm run quality:ux-g02` | Script npm |
| `e2e/ux-g02-command-first.spec.ts` | E2E cuando Playwright renderice web |
| `e2e/helpers/demoPatient.ts` | Cookie sync post-login (mejora E2E) |

---

## Próximo paso (plan acordado)

1. **Validación manual UI** — seguir `reports/epis2-ux-g02-command-first-checklist-2026-06-07.md` en navegador (`npm run dev`).
2. **Ajustes menores** si algo falla en UI (copy, badge, modalidad select).
3. **Reporte consolidado CE-0→CE-5** tras Pass humano.
4. **Commit/push**.

---

## Riesgo E2E

Playwright arranca web+API pero la SPA queda en blanco en este entorno Windows/OneDrive. Investigar: proxy Vite, `loadSessionForRouter` en `/comando`, o conflicto de puertos con servidores ya levantados.
