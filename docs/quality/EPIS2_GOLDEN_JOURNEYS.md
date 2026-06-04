# EPIS2 — Journeys dorados

**Versión:** 1.0  
Complementa [GOLDEN_CLINICAL_JOURNEY.md](./GOLDEN_CLINICAL_JOURNEY.md) (implementación EPIS2-11) con journeys por versión de producto y gate V0 ampliado (Modo tablero).

---

## 1. Journey principal V0 (obligatorio)

**Nombre:** `golden-v0-command-evolution`  
**Tests:** `tests/golden-clinical-journey.spec.ts`, `tests/golden-clinical-journey.api.spec.ts`  
**Checklist humano:** [PILOT_DEMO_CHECKLIST.md](./PILOT_DEMO_CHECKLIST.md)

### Pasos

| # | Paso | Criterio |
|---|------|----------|
| 1 | Login médico demo | Sesión cookie; redirect Centro de Comando |
| 2 | Centro de Comando | Power bar; home ≠ tablero |
| 3 | Buscar / fijar paciente DEMO | Contexto activo visible |
| 4 | Comando «evoluciona al paciente» | Intent resuelto; ruta evolución |
| 5 | Formulario evolución | Blueprint único `evolution_note` |
| 6 | Guardar borrador | Estado draft; no nota final |
| 7 | (Opcional) Asistencia IA | Si Ollama up: sugerencias; si down: flujo igual |
| 8 | Aprobar como médico | RBAC; transición approved |
| 9 | Auditoría | Evento persistido |
| 10 | Volver al Centro de Comando | Contexto coherente |
| 11 | **Abrir Modo tablero** | Comando o chip «Modo tablero» |
| 12 | **Verificar tarea completada** | Borrador aprobado / paciente reciente |
| 13 | **Volver al Centro de Comando** | Sin pérdida de sesión |

### Gate

- `npm run check` verde.
- `npm run quality:golden-journey` cuando DB disponible.
- Ollama apagado: pasos 1–10 obligatorios; 11–13 tras EPIS2-12.

---

## 2. Journey seguridad medicamentosa (V0 demo)

**Nombre:** `golden-v0-demo005-allergy-rx`  
**Paciente:** DEMO-005 (alergia penicilina)

| # | Paso | Criterio |
|---|------|----------|
| 1 | Abrir ficha DEMO-005 | Alertas CDS visibles |
| 2 | Ir a receta | Panel alertas con debounce |
| 3 | Escribir Ceftriaxona | API `clinical-alerts?fields=` devuelve beta-lactam y/o allergy |
| 4 | Guardar borrador | Aprobación **no** bloqueada por alertas |
| 5 | Aprobar con revisión humana | Nota versionada + auditoría |

**Tests:** `clinical.integration.test.ts`, `rules.test.ts`, `PatientWorkspacePage.test.tsx`

---

## 3. Journey V1 — Longitudinal (slice demo)

**Nombre:** `golden-v1-longitudinal-review`  
**Estado:** parcial — sin RAG/OCR/PDF masivo.

| # | Paso | Criterio |
|---|------|----------|
| 1 | Fijar paciente DEMO | Contexto activo |
| 2 | Abrir ficha | Panel longitudinal: problemas, alergias, meds, timeline |
| 3 | DEMO-005 receta Ceftriaxona | Alertas CDR beta-lactámico (journey V0 seguridad) |
| 4 | Tablero paciente | `/epis2/dashboard?tab=patient&patientId=` |
| 5 | Export FHIR | Journey API existente |

**Slice adicional:** blueprints interconsulta/imagenología; búsqueda documentos por título (sin RAG).

**Pendiente gate V1 completo:** RAG pgvector, OCR, impresión PDF.

---

## 4. Journey V2 — Hospitalización (slice demo)

**Nombre:** `golden-v2-admission-discharge`  
**Estado:** parcial — censo + críticos con acuse.

| # | Paso | Criterio |
|---|------|----------|
| 1 | Comando «ver el servicio» | Tab servicio en Modo tablero |
| 2 | Censo | Camas 101A/101B ocupadas (DEMO-004, DEMO-005) |
| 3 | Crítico INR DEMO-005 | Visible sin acuse |
| 4 | Acusar recibo | POST acknowledge + auditoría |
| 5 | Alta probable | DEMO-004 en lista |

**Slice adicional:** `clinical_orders` en tablero servicio; alias evolución diaria.

**Pendiente gate V2 completo:** traslados, epicrisis alta end-to-end operativa.

**Tests:** `inpatient.integration.test.ts`

---

## 5. Journey V3 — Enfermería / farmacia (slice demo)

**Nombre:** `golden-v3-mar-nursing`

| # | Paso | Criterio |
|---|------|----------|
| 1 | `nota de enfermeria` | Formulario `/espacio/enfermeria` |
| 2 | `registrar mar warfarina` | Formulario MAR + alertas alto riesgo |
| 3 | Aprobar MAR con doble chequeo | Fila en `mar_administration_records` |
| 4 | `validacion farmaceutica` | `/espacio/farmacia` |

---

## 5. Journey V3 — Multidisciplinario (plan)

**Nombre:** `golden-v3-mar-nursing`

```text
Nota enfermería → signos → medicamento alto riesgo
→ doble chequeo CDR → MAR documentado → borrador → aprobación enfermería/médico según rol
```

---

## 6. Journey V4 — Interop read-only

**Nombre:** `golden-v4-interop-ops`  
**Rol:** `auditor.demo`

| Paso | Acción | Criterio |
|------|--------|----------|
| 1 | `tablero de calidad` | Tab `quality` con staging y auditoría |
| 2 | Validar HL7 demo | `POST /api/interop/hl7/validate` → `valid: true` |
| 3 | Export bundle DEMO-005 (médico) | `AllergyIntolerance` penicilina en bundle |
| 4 | Confirmar sin writeback | Lotes staging `validated`/`staged`, SoT EPIS2 intacto |

---

## 7. Journey V5 — IA avanzada (plan)

**Nombre:** `golden-v5-ai-traceable`

| Escenario | Criterio |
|-----------|----------|
| Ollama ON | `ai_runs` + borrador sugerido |
| Ollama OFF | Resumen manual posible |
| RAG | Respuesta incluye fuentes documentales |
| Sin auto-approve | Ningún endpoint IA crea nota final |

---

## 8. Anti-patrones (falla automática del journey)

- Redirección post-login a `/dashboard` o equivalente.
- Nota clínica creada sin registro en `approvals`.
- Sugerencia IA persistida como nota final.
- Segundo registry de comandos en runtime.
- Copy clínico visible en inglés.

---

## 9. Comandos de verificación

```bash
npm run test
npm run check
npm run architecture:validate
npm run quality:golden-journey   # requiere DATABASE_URL
```

---

## Referencias

- [ANTI_DRIFT_GATES.md](./ANTI_DRIFT_GATES.md)
- [../product/EPIS2_DASHBOARD_MODE.md](../product/EPIS2_DASHBOARD_MODE.md)
- [../product/EPIS2_RELEASE_ROADMAP.md](../product/EPIS2_RELEASE_ROADMAP.md)
