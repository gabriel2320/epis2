# EPIS2 — Modo Clásico MD3 + Command Center Google Bar + Agentes IA de diseño

**Fecha:** 2026-06-08  
**Microfase:** MF-CLASSIC-MD3-AI-DESIGN-AGENTS  
**Estado:** Implementado (advisory; agentes off por defecto)

## Objetivo

Dos puertas de entrada complementarias:

1. **Command Center** (`/comando`) — barra central tipo Google/ChatGPT, limpia, command-first.
2. **Modo Clásico EMR** (`?mode=classic`) — scaffold MD3 fijo con supporting pane, sin duplicar arquitectura clínica.

Agentes locales de diseño (Ollama opcional) auditan layout y densidad con JSON validado por Zod — **solo diagnostican y planifican**, nunca modifican lógica clínica.

## Fuentes de diseño aplicadas

- Material Design 3: scaffold, top app bar, search/command bar, navigation rail, supporting pane, scroll único.
- Canon EPIS2: `/comando` home, borrador ≠ aprobado, IA no firma.
- MF-CLASSIC-EMR-MD3 (base) + MF-UI-DENSITY para presupuesto de iconos/sugerencias.

## Rutas afectadas

| Ruta | Modo | Patrón MD3 |
|------|------|-------------|
| `/comando` | command-center | search |
| `/espacio/ficha?mode=classic` | classic | supporting-pane |
| `/espacio/evolucion?mode=classic` | classic | supporting-pane |
| `/epis2/dashboard?view=classic` | classic | supporting-pane (admin) |

Preferencia: `userPreferences.defaultPatientView = 'classic' | 'modern'`.

## Componentes creados / actualizados

### Command Center

- `EpisCommandCenterGoogleBar.tsx` — barra Google-like + sugerencias ≤4 + acceso clásico.
- `CommandCenterClassicAccess.tsx` — “Abrir modo clásico” / “Continuar en modo clásico”.
- `CommandCenterRecentPatientsCompact.tsx` — pacientes recientes compactos (≤4).

### Modo clásico (MF-CLASSIC-EMR-MD3)

- `apps/web/src/components/classic-md3/*` — shell MD3 completo (sin cambios arquitectónicos).

### Agentes de diseño

- `apps/web/src/design-agents/` — 8 agentes + Zod + Ollama client + `runDesignAgentsForScreen`.

## Integración command-registry

- Barra central y barra clásica delegan en `useClinicalCommandSubmit` → API existente.
- Sin router paralelo ni segundo registry.

## Integración RAD/MD3

- `radScreenRegistry.ts`: `/comando` mode `command-center`, md3Pattern `search`.
- `radDiscipline.ts`: mode `command-center` en union de tipos.
- Design mode overlay: chips command-center / classic / agentes on|off.

## Agentes IA locales

| Agente | Función |
|--------|---------|
| md3LayoutCriticAgent | Scaffold, scroll, supporting pane |
| classicEmrWorkflowAgent | EMR tradicional, paciente visible |
| commandCenterAgent | Google bar, acceso clásico, no dashboard |
| visualDensityAgent | Cards/iconos excesivos |
| clinicalSafetyUiAgent | ActionBar única, top bar segura |
| accessibilityAgent | Teclado, ARIA |
| screenshotCriticAgent | Input PNG advisory |
| patchPlannerAgent | Plan JSON — **no aplica parches** |

**Env (off por defecto):**

- `EPIS2_DESIGN_AGENTS_ENABLED=false`
- `EPIS2_DESIGN_AGENT_MODEL=qwen3:8b`
- `EPIS2_DESIGN_AGENT_BASE_URL=http://localhost:11434`

## Screenshots

Carpeta advisory: `reports/screenshots/classic-md3/` (+ README).  
Script: `npm run quality:classic-screenshot-capture` (placeholder; Playwright manual cuando dev activo).

## Gates ejecutados

```bash
npm run quality:command-center-googlebar-gate
npm run quality:classic-md3-ai-mode-gate
npm run quality:design-agents-gate
npm run quality:design-agent-schemas-gate
npm run quality:visual-density-agent-gate
npm run quality:classic-screenshot-advisory
npm run quality:classic-* (paneles, commandbar, actionrail, statusbar)
npm run quality:ui-simplify-gate
npm run quality:rad-m3-discipline-gate
npm run quality:design-mode-gate
```

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Agentes Ollama alucinan parches | Zod + patchPlanner solo advisory; Cursor aplica con revisión |
| Usuario pierde command-first | `/comando` sigue home; top bar clásico vuelve a comando |
| Scroll doble | Gate fixed-panels + `main-pane-only` |
| IA diseño toca clínica | Gate prohíbe API clínica en agentes y classic-md3 visual |

## Deuda pendiente

- Playwright E2E screenshots automatizados con servidor dev.
- Enriquecer supporting pane con snippets/plantillas (MF-CLINICAL-TEXTBOX).
- Scores de agentes en overlay design mode (último run persistido).

## Recomendación preferencia usuario

1. Default `modern` (command-first).
2. Opt-in explícito en Apariencia → modo clásico.
3. Desde `/comando`, botones visibles “Abrir modo clásico” / “Continuar en modo clásico” si hay paciente activo.
4. Habilitar agentes solo en CI design o local: `EPIS2_DESIGN_AGENTS_ENABLED=true`.

## Frase guía

EPIS2 tiene dos puertas: Command Center limpio tipo Google, y Modo Clásico MD3 fijo con apoyo contextual — misma arquitectura clínica, distinta productividad visual.
