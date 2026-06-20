# Checklist signoff — Secretario clínico (PROG-DI-CLOSE)

**Programa:** PROG-DETERMINISTIC-INTELLIGENCE-2026 · **MF:** MF-DI-10  
**Escenario demo:** Jorge Pérez (`DEMO-002`) — DM2 ambulatorio · **Sin Ollama** (invariante #15)

---

## Gates automáticos (obligatorios)

```bash
npm run quality:di-signoff-gate
npm run check
npm run test
npm run db:validate
```

---

## Piloto manual (~15 min, sin `dev:ai`)

| # | Paso | Evidencia esperada |
|---|------|-------------------|
| 1 | Abrir `/espacio/ficha?patientId=DEMO-002&chartMode=traditional` | Strip contexto denso · acciones probables · chips silenciosos |
| 2 | Comando `control diabetes` (barra o Ctrl+K) | Evolución SOAP con badge prefill contextual |
| 3 | Guardar evolución | Panel microjourney «Crear receta asociada» |
| 4 | Comando `solicitar panel control dm2` | Lab con panel HbA1c / DM2 prellenado |
| 5 | Nav Evoluciones en ficha tradicional | Timeline filtrable (labs / evoluciones) |
| 6 | Home = CICA `/app/buscar` | Sin dashboard como landing |

---

## Sub-gates DI incluidos en signoff

| MF | Gate |
|----|------|
| DI-01 | `quality:di-context-gate` |
| DI-02 | `quality:di-memory-gate` |
| DI-03 | `quality:di-autocomplete-gate` |
| DI-04 | `quality:di-prefill-gate` |
| DI-05/06 | `quality:di-suggestions-gate` |
| DI-07 | `quality:di-templates-gate` |
| DI-08 | `quality:di-timeline-gate` |
| DI-09 | `quality:di-journeys-gate` |

---

## E2E

`e2e/di-clinical-secretary-journey.spec.ts` — subset automatizado del journey (dual chart + DEMO-002).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
