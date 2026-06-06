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
| 1 | Login | Sesión iniciada; redirección al Centro de Comando |
| 2 | Centro de Comando | Power bar visible; una acción principal |
| 3 | Buscar paciente sintético | Contexto de paciente fijado |
| 4 | Comando de evolución | Intent resuelto; sin dashboard intermedio |
| 5 | Página de evolución | Formulario desde blueprint único |
| 6 | Guardar borrador | Estado `draft` o `editing`; no nota final |
| 7 | Aprobación humana | Transición a `approved` solo por usuario autorizado |
| 8 | Auditoría | Evento en `audit_events` / `approvals` |
| 9 | Volver al Centro de Comando | Home restaurada; contexto coherente |

---

## Flujo canónico

```text
Login
  → Command Center
  → buscar paciente sintético
  → comando de evolución
  → página de evolución
  → guardar borrador
  → aprobación humana
  → auditoría
  → volver al Command Center
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

Ejecutar: `npm run quality:golden-journey`

Playwright E2E UI:

| Archivo | Pasos |
|---------|-------|
| `e2e/golden-command-evolution.spec.ts` | 1–5 (MF-154) |
| `e2e/golden-draft-approval.spec.ts` | 6–9 borrador→aprobación→comando (MF-186) |

Matriz Golden × M3: `docs/quality/GOLDEN_M3_MATRIX.md` (MF-184).
