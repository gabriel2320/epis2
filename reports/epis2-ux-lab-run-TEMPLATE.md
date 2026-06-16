# PROG-UX-LAB — Corrida Clinical Shift Lab (Modo A)

**Programa:** PROG-UX-LAB · **Tramo:** D · **MF:** MF-UXLAB-03  
**Plan:** [`EPIS2_UX_LAB_MODERN_PLAN.md`](../docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md)  
**Operador:** _nombre_ · **Fecha:** _YYYY-MM-DD_ · **HEAD:** _`git rev-parse --short HEAD`_

---

## Precondiciones

| Requisito | OK |
|-----------|-----|
| `npm run stack:dev` (Postgres :5433) | |
| Usuario `medico.demo` | |
| Ollama / local-ai **apagado** (Modo A) | |
| Tag / rama evaluada documentada | |

---

## Checklist corrida (15–20 min)

| # | Paso | OK | Tiempo | Notas |
|---|------|----|--------|-------|
| 1 | Login → censo (sin pantalla intermedia) | | | |
| 2 | Shift Context Strip visible (DEMO/SIM, pendientes) | | | |
| 3 | Censo: acción primaria clara en ≥1 paciente | | | |
| 4 | Abrir ficha dual — badge DEMO visible | | | |
| 5 | Comando → evolución (sin dashboard intermedio) | | | |
| 6 | Formulario SOAP — estado borrador visible | | | |
| 7 | Guardar borrador — mensaje claro, no confundir con aprobado | | | |
| 8 | Revisión → aprobar **humano** | | | |
| 9 | Historial/auditoría — nota aprobada trazable | | | |
| 10 | Volver al censo — contexto coherente | | | |
| 11 | Modo papel: hoja legible, watermark correcto | | | |
| 12 | ¿Alguna duda borrador vs aprobado? (debe ser NO) | | | |

---

## Métricas soft (opcional)

| Métrica | Valor | Notas |
|---------|-------|-------|
| Duración total corrida | | |
| Clicks totales turno | | |
| UX-BLOCKER encontrados | 0 objetivo | |

---

## Hallazgos Nielsen (3–5 revisores)

| ID | Severidad | Superficie | Descripción | Acción |
|----|-----------|------------|-------------|--------|
| UXLAB-RUN-01 | | | | |

Severidad: **UX-BLOCKER** · **Major** · **Minor** · **Cosmetic**

---

## Gates (ejecutar tras corrida / antes de cierre)

```bash
npm run quality:security-promote-gate
npm run quality:golden-journey
npm run quality:ux-pilot
npm run quality:ux-pilot-gate
npm run quality:m3-human-pilot
npm run quality:fast
```

| Gate | Resultado | Notas |
|------|-----------|-------|
| security-promote | | |
| golden-journey | | |
| ux-pilot | | |
| ux-pilot-gate | | |
| m3-human-pilot | | |
| quality:fast | | |

---

## Veredicto

**Resultado:** GO · PASS WITH FIXES · BLOCKED · NO GO

**Criterio GO:** Modo A completo · 0 UX-BLOCKER · DEMO visible · borrador/aprobado inequívoco · Ollama off no bloquea · gates hard verdes.

**Próximo paso:** _fix-only patch documentado_ · _cierre `epis2-ux-lab-close-*.md`_ · _tag rc4 solo tras walkthrough humano_

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
