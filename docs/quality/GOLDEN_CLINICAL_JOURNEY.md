# EPIS2 — Journey clínico dorado

**Estado:** Implementado (EPIS2-11)  
**Pruebas:** `tests/golden-clinical-journey.spec.ts` · `tests/golden-clinical-journey-theme.spec.ts` · `tests/golden-clinical-journey.api.spec.ts`  
**Checklist humano:** `docs/quality/PILOT_DEMO_CHECKLIST.md`

---

## Propósito

Demostrar que EPIS2 es un producto command-first **demostrable por humanos**, no solo tests técnicos. Aprende del error EPIS #10: CI verde sin flujo real.

---

## Precondiciones

- Usuario sintético con rol `physician`.
- Paciente marcado **DEMO/SINTÉTICO**.
- Ollama **opcional** (el journey debe pasar con IA desconectada).

---

## Pasos obligatorios

| # | Paso | Criterio de éxito |
|---|------|-------------------|
| 1 | Login | Sesion iniciada; redireccion al censo clinico CICA (`/app/buscar`) |
| 2 | Censo clinico | Barra de comando transversal visible; busqueda / seleccion de paciente |
| 3 | Contexto paciente | Paciente sintético fijado en workspace |
| 4 | Comando de evolución | Intent resuelto; sin dashboard intermedio |
| 5 | Página de evolución | Formulario desde blueprint único |
| 6 | Guardar borrador | Estado `draft` o `editing`; no nota final |
| 7 | Aprobación humana | Transición a `approved` solo por usuario autorizado |
| 8 | Auditoría | Evento en `audit_events` / `approvals` |
| 9 | Volver al censo clinico | Home CICA (`/app/buscar`) restaurada; contexto coherente |

---

## Flujo canónico

```text
Login
  -> censo clinico CICA (/app/buscar) + barra transversal
  -> buscar / seleccionar paciente sintetico
  -> comando de evolucion
  -> pagina de evolucion
  → guardar borrador
  → aprobación humana
  → auditoría
  → volver al censo clínico (home)
```

---

## Resultados del piloto humano

| Resultado | Significado |
|-----------|-------------|
| GO DEMO | Journey completo sin bloqueos |
| PASS WITH FIXES | Demo posible con issues menores |
| BLOCKED | Falla crítica |
| NO GO | Rehacer fases previas |

---

## Automatización

| Capa | Archivo | Requisito |
|------|---------|-----------|
| Contratos / comando / home | `golden-clinical-journey.spec.ts` | Siempre (CI) |
| API clínica completa | `golden-clinical-journey.api.spec.ts` | `DATABASE_URL` + migraciones |
| SIM + assist (MF-CASE-10) | `golden-v6-sim-assist` en API spec | `042_sim_clinical_cases_seed.sql` |
| SIM journey completo (MF-CASE-11) | `golden-v7-sim-journey` — borrador→aprobación | `042` + `DATABASE_URL` |

Ejecutar: `npm run quality:golden-journey`

Playwright E2E UI:

| Archivo | Pasos |
|---------|-------|
| `e2e/golden-command-evolution.spec.ts` | 1–5 (MF-154) |
| `e2e/golden-draft-approval.spec.ts` | 6–9 borrador→aprobación→comando (MF-186) |

Matriz Golden × M3: `docs/quality/GOLDEN_M3_MATRIX.md` (MF-184).
