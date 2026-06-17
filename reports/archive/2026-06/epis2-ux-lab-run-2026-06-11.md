# PROG-UX-LAB — Corrida Clinical Shift Lab (Modo A)

**Programa:** PROG-UX-LAB · **Tramo:** D · **MF:** MF-UXLAB-03  
**Plan:** [`EPIS2_UX_LAB_MODERN_PLAN.md`](../docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md)  
**Operador:** agente dev (gates automatizados) · **Fecha:** 2026-06-11 · **HEAD:** `8a25569`

---

## Precondiciones

| Requisito | OK |
|-----------|-----|
| `npm run stack:dev` (Postgres :5433) | defer corrida humana |
| Usuario `medico.demo` | ✓ E2E fixtures |
| Ollama / local-ai **apagado** (Modo A) | ✓ CI sin `dev:ai` |
| Tag / rama evaluada documentada | `master` @ `8a25569` (PR #30+#31) |

---

## Checklist corrida (15–20 min)

Evidencia **automatizada** vía E2E existentes; pasos sin spec → pendiente walkthrough humano.

| # | Paso | OK | Notas |
|---|------|----|-------|
| 1 | Login → censo (sin pantalla intermedia) | ✓ | `e2e/ux-lab-census.spec.ts` · `ux-g02` |
| 2 | Shift Context Strip visible (DEMO/SIM, pendientes) | ✓ | `ux-lab-census` + Tramo B |
| 3 | Censo: acción primaria clara en ≥1 paciente | ✓ | `ux-lab-census` |
| 4 | Abrir ficha dual — badge DEMO visible | ✓ | `dual-chart-modes` · `golden-journey` |
| 5 | Comando → evolución (sin dashboard intermedio) | ✓ | `ux-g02` E2E |
| 6 | Formulario SOAP — estado borrador visible | ◐ | chrome `EpisDraftStatus` Tramo C · humano |
| 7 | Guardar borrador — mensaje claro | ◐ | `golden-journey` · humano |
| 8 | Revisión → aprobar **humano** | ◐ | walkthrough pendiente |
| 9 | Historial/auditoría — nota aprobada trazable | ◐ | walkthrough pendiente |
| 10 | Volver al censo — contexto coherente | ✓ | `ux-lab-census` |
| 11 | Modo papel: hoja legible, watermark correcto | ✓ | `dual-chart-modes` b/h-alt Tramo C |
| 12 | ¿Alguna duda borrador vs aprobado? | ◐ | revisión Nielsen pendiente |

---

## Hallazgos Nielsen (3–5 revisores)

| ID | Severidad | Superficie | Descripción | Acción |
|----|-----------|------------|-------------|--------|
| — | — | — | Sin corrida humana aún | Programar 3–5 revisores Modo A |

---

## Gates (ejecutados en sesión Tramo D)

```bash
npm run quality:security-promote-gate   # OK
npm run quality:ux-pilot-gate           # OK
npm run quality:fast                    # OK
# defer CI/local con stack:
npm run quality:golden-journey
npm run quality:ux-pilot
npm run quality:m3-human-pilot
npm run quality:ux-lab-close            # compuesto § plan
```

| Gate | Resultado | Notas |
|------|-----------|-------|
| security-promote | ✓ OK | sesión local |
| ux-pilot-gate | ✓ OK | estático |
| quality:fast | ✓ OK | arquitectura + secrets |
| golden-journey | defer | CI / `stack:dev` |
| ux-pilot | defer | E2E API+web |
| m3-human-pilot | defer | V1–V6 Playwright |
| ux-lab-close | defer | compuesto tras stack |

---

## Veredicto

**Resultado:** **PASS WITH FIXES** (automatizado) — **GO** pendiente walkthrough humano Modo A

**Próximo paso:** corrida 1 operador Modo A · Nielsen 3–5 · `npm run quality:ux-lab-close` con stack · cierre [`epis2-ux-lab-close-2026-06-11.md`](./epis2-ux-lab-close-2026-06-11.md)

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
