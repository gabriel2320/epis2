# EPIS2 — Decisiones de stack UI

**Fase:** post signoff A–K · **Relacionado:** `EPIS2_UI_ARCHITECTURE.md`, `ARCHITECTURE_TARGET.md`

---

## Resumen ejecutivo

EPIS2 **no reescribe** el stack visual ni introduce librerías duplicadas. El siguiente ROI es **TanStack Query** para lecturas clínicas con invalidación explícita tras aprobación de borradores.

---

## Adoptar (con gate)

| Tecnología | Decisión | Motivo |
|------------|----------|--------|
| **React + TS + Vite** | Mantener | Base actual estable |
| **MUI vía `@epis2/epis2-ui`** | Mantener | Puerta única; M3 Clinical |
| **MUI X** (Data Grid, Date Pickers, Charts) | Mantener | Ya integrado; evita TanStack Table/Recharts duplicados |
| **Zod / `@epis2/contracts`** | Mantener | Validación compartida API ↔ web |
| **`EpisClinicalForm` + blueprints** | Mantener | Formularios declarativos; sin segundo renderer |
| **`PrintA5Document` / CSS impresión** | Mantener y extender | Norma documental separada de UI interactiva |
| **TanStack Query** | **Adoptar incremental** | `ARCHITECTURE_TARGET.md`; deduplica fetch, invalidación post-aprobación, revalidación al foco |

### Política TanStack Query (clínica)

- `staleTime`: 30 s · `gcTime`: 2 min
- `refetchOnWindowFocus`: true
- Invalidación explícita en `approveDraft` / transiciones de borrador
- Sin persistencia offline de caché clínica

**Spike inicial (implementado):** provider en `main.tsx`, hooks en `apps/web/src/query/`, migración de Centro de Comando, ficha paciente, formularios clínicos, revisión de borrador, widgets y **modo tablero** (`DashboardModeContent`).

### Storybook (Prioridad B — bootstrap)

| Tecnología | Decisión |
|------------|----------|
| **Storybook en `epis2-ui`** | **Adoptar acotado** — ver `EPIS2_STORYBOOK_DECISIONS.md` |
| Gate | `storybook-theme-gate.mjs` — tema único vía `Epis2ThemeProvider` |

---

## Rechazar (ahora)

| Propuesta | Motivo |
|-----------|--------|
| **Sonner / toast alternativo** | `EpisSnackbar` + copy ES ya cubren feedback |
| **Framer Motion** | Motion tokens M3 en tema; evitar segunda capa |
| **Lucide** | Iconografía MUI consolidada en `epis2-ui` |
| **Recharts / ECharts** | MUI X Charts ya planificado/parcial |
| **TanStack Table** | MUI X Data Grid cubre tablas clínicas |
| **Segundo form renderer** (`EpisFormRenderer`, canvas paralelo) | Duplica `EpisClinicalForm` + two-pane |

---

## Diferir (IDC / MF concreto)

| Tecnología | Condición de entrada |
|------------|---------------------|
| **Tiptap** | IDC que exija rich text clínico no cubierto por campos blueprint |
| **React Hook Form** | Solo si un blueprint IDC requiere validación imperativa no expresable en `clinical-forms` |

---

## Próximo paso

1. ~~Extender migración Query a dashboards tab~~ ✓ `DashboardModeContent`
2. ~~Mutaciones `useMutation` para PATCH borrador desde formularios (invalidación unificada)~~ ✓ hooks `useDraftMutations`
3. Gate de bundle: verificar incremento `@tanstack/react-query` en presupuesto M3-09
4. Storybook: ampliar stories por IDC bajo demanda; opcional CI `storybook:ui:build`

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
