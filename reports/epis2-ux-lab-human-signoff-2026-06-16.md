# PROG-UX-LAB — Signoff humano Modo A

**Fecha:** 2026-06-16 · **HEAD:** `9cf7d44` · **Modo:** A (sin IA)  
**Operador:** revisión humana · **Autopilot:** [`run-2026-06-16`](./ux-lab-autopilot/run-2026-06-16.md)

---

## Veredicto

| Dimensión | Resultado |
|-----------|-----------|
| **Funcional / flujo clínico demo** | **APROBADO** |
| **Estética / composición visual** | **NECESITA REDISEÑO** |
| **Global producto** | **PASS WITH FIXES** |

**Frase guía:** El turno demo funciona en Modo A; la capa visual no cumple aún el norte «Clinical Calm Premium».

---

## Corrida humana (Modo A)

| # | Paso | OK | Notas |
|---|------|----|-------|
| 1 | Login → censo | ✓ | Sin bloqueo IA |
| 2 | Shift Context Strip + DEMO | ✓ | |
| 3 | Censo accionable | ✓ | |
| 4 | Ficha dual + badge DEMO | ✓ | |
| 5 | Comando → evolución | ✓ | |
| 6 | Borrador visible | ✓ | |
| 7–9 | Guardar / aprobar / auditoría | ◐ | No bloqueante UX-LAB |
| 10 | Retorno censo coherente | ✓ | |
| 11 | Modo papel + watermark | ✓ | |
| 12 | Borrador vs aprobado claro | ✓ | |

**UX-BLOCKER:** 0

---

## Hallazgo principal (estética)

| ID | Severidad | Superficie | Descripción | Acción |
|----|-----------|------------|-------------|--------|
| UXLAB-AEST-01 | **Major** | Global UI | Rediseño estético pendiente — densidad, jerarquía tonal, calma editorial | Tramo E · Clinical Calm Premium |

Severidades menores/cosméticas: documentar en sesión de rediseño.

---

## Gates de referencia

| Gate | Estado |
|------|--------|
| `quality:ux-lab-autopilot` | ✓ GO-CANDIDATE |
| `quality:ux-lab-close` | ◐ pendiente corrida completa post-#35 |
| `theme:validate` | ✓ |

---

## Próximo tramo — rediseño estético (sin lógica clínica)

**Canon:** [`EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md`](../docs/design/EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md)  
**Reglas:** [`EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md`](../docs/design/EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md)

| MF propuesto | Alcance | Prohibido |
|--------------|---------|-----------|
| **MF-AEST-01** | Tokens `clinical-calm` · superficies 80/15/5 · canvas/islands | Cambiar flujos clínico SoT |
| **MF-AEST-02** | Censo + ficha dual — jerarquía, spacing MD3 | Nuevo registry / comandos |
| **MF-AEST-03** | Modo papel — márgenes, tipografía editorial | IA auto-aprobación |
| **MF-AEST-04** | Dark clínico + contraste AAA datos paciente | OpenMRS / Carbon |

**Gates tramo estético:** `theme:validate` · `clinical-roles.contrast` · `quality:m3-human-pilot` · capturas before/after.

---

## rc4 / tag demo

| Criterio | Estado |
|----------|--------|
| Funcional Modo A | ✓ |
| Signoff humano funcional | ✓ |
| Rediseño estético | **Pendiente** |
| Tag `v0.1-demo-rc4` | **Diferido** hasta MF-AEST tramo 1 verde o signoff estético explícito |

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
