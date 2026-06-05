# EPIS2 — Arquitectura de UI (Material UI + Material 3 Clinical)

**Fase:** EPIS2-MUI-01+ implementado · **Experiencia:** M3-00 rebaseline · **Alcance diseño M3:** `EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md`

---

## Principios

1. **Command-first:** home = Centro de Comando (`/comando`); modo tablero opcional.
2. **Un solo sistema visual:** Material UI (+ MUI X bajo demanda), interpretado como **Material 3 Clinical** vía `@epis2/epis2-ui`.
3. **Un solo tema:** `createEpis2Theme` (objetivo M3-02); hoy `epis2Theme` con localización española.
4. **M3 Standard vs Expressive:** formularios, aprobación y seguridad = Standard; Login, Comando y empty states = Expressive controlado.
5. **Capa de abstracción:** `packages/epis2-ui` es la única puerta de entrada a componentes MUI en apps.
6. **Copy clínico:** `@epis2/design-system` mantiene `copy/es.ts`; la UI visible no define strings en inglés.
7. **IA y seguridad:** wrappers clínicos incluyen disclosure, borrador y gates de aprobación.

---

## Paquetes frontend (objetivo)

```text
apps/web/                    # Rutas, páginas, hooks, API clients
packages/epis2-ui/           # Wrappers MUI + composición clínica/command/dashboard
packages/design-system/      # Copy ES, tokens semánticos (sin imports MUI en apps)
packages/command-registry/   # Intents (sin UI)
packages/clinical-forms/       # Blueprints (sin UI)
```

### Migración desde el estado actual

| Hoy | Objetivo MUI-01+ |
|-----|------------------|
| Tema en `@epis2/design-system` | Mover tema a `epis2-ui/theme`; design-system exporta solo copy/tokens |
| Imports `@mui/*` en `apps/web/src/**` | Imports `@epis2/epis2-ui` únicamente |
| `Epis2ThemeProvider` en `apps/web` | `Epis2ThemeProvider` exportado desde `epis2-ui` |

La fase MUI-00 **no** crea el paquete ni mueve archivos.

---

## Estructura `packages/epis2-ui`

```text
packages/epis2-ui/
├─ package.json
├─ tsconfig.json
├─ src/
│  ├─ index.ts                 # API pública
│  ├─ theme/
│  │  ├─ palette.ts              # → color-roles.ts (M3-01)
│  │  ├─ clinical-roles.ts       # M3-01
│  │  ├─ typography.ts           # roles M3 display…label
│  │  ├─ shape.ts                # M3-01
│  │  ├─ motion.ts               # M3-01
│  │  ├─ breakpoints.ts
│  │  ├─ components.ts           # overrides Mui*
│  │  ├─ create-epis2-theme.ts    # M3-02
│  │  └─ theme.ts                # export epis2Theme (transitorio)
│  ├─ providers/
│  │  └─ Epis2ThemeProvider.tsx
│  ├─ primitives/
│  │  ├─ EpisButton.tsx
│  │  ├─ EpisIconButton.tsx
│  │  ├─ EpisTextField.tsx
│  │  ├─ EpisSelect.tsx
│  │  ├─ EpisAutocomplete.tsx
│  │  ├─ EpisChip.tsx
│  │  ├─ EpisCard.tsx
│  │  ├─ EpisDialog.tsx
│  │  ├─ EpisAlert.tsx
│  │  ├─ EpisSnackbar.tsx
│  │  ├─ EpisPage.tsx
│  │  ├─ EpisSection.tsx
│  │  ├─ EpisEmptyState.tsx
│  │  └─ EpisLoadingState.tsx
│  ├─ command/
│  │  ├─ EpisCommandBar.tsx      # Power Bar canónica
│  │  ├─ EpisCommandSuggestions.tsx
│  │  ├─ EpisIntentPreview.tsx
│  │  ├─ EpisCommandResult.tsx
│  │  ├─ EpisCommandHistory.tsx  # USE_LATER
│  │  └─ EpisCommandHelp.tsx     # USE_LATER
│  ├─ clinical/
│  │  ├─ EpisPatientContext.tsx
│  │  ├─ EpisClinicalForm.tsx
│  │  ├─ EpisClinicalField.tsx
│  │  ├─ EpisClinicalSection.tsx
│  │  ├─ EpisClinicalPage.tsx
│  │  ├─ EpisDraftStatus.tsx
│  │  ├─ EpisApprovalGate.tsx
│  │  ├─ EpisSafetyBanner.tsx
│  │  ├─ EpisAiDisclosure.tsx
│  │  ├─ EpisSourcePanel.tsx
│  │  └─ EpisMissingDataPanel.tsx
│  ├─ forms/
│  │  └─ (adaptadores clinical-forms → MUI)
│  ├─ dashboard/
│  │  ├─ EpisDashboardShell.tsx
│  │  ├─ EpisWorklistGrid.tsx
│  │  ├─ EpisPatientDashboard.tsx
│  │  ├─ EpisServiceDashboard.tsx
│  │  ├─ EpisMetric.tsx
│  │  ├─ EpisTaskList.tsx
│  │  └─ EpisTrendChart.tsx      # lazy + @mui/x-charts
│  ├─ data/
│  │  └─ EpisDataGrid.tsx        # lazy + @mui/x-data-grid
│  ├─ feedback/
│  │  └─ (agrupa estados compartidos)
│  └─ accessibility/
│     └─ (helpers focus, aria labels desde copy)
└─ README.md
```

---

## Wrappers obligatorios (contrato MUI-01+)

Cada wrapper debe:

- Aceptar props acotadas (no re-exportar todo MUI).
- Soportar `loading`, `error` y `empty` cuando aplique.
- Usar copy de `@epis2/design-system` para textos por defecto.
- Documentar equivalencia MUI subyacente en JSDoc breve.

| Wrapper | Responsabilidad | MUI base |
|---------|-----------------|----------|
| `EpisButton` | Acciones primarias/secundarias, tamaños clínicos | `Button` |
| `EpisTextField` | Campos texto con helper/error ES | `TextField` |
| `EpisAutocomplete` | Búsqueda paciente, comandos | `Autocomplete` |
| `EpisDialog` | Modales confirmación | `Dialog` |
| `EpisAlert` | Mensajes inline | `Alert` |
| `EpisCommandBar` | Entrada command-first + IA chip | `TextField`, `Chip` |
| `EpisClinicalForm` | Layout blueprint + secciones | `Stack`, `Accordion` |
| `EpisClinicalPage` | Shell ficha (banner, tabs, volver) | `Box`, `Tabs` |
| `EpisDataGrid` | Tablas densas clínicas | `DataGrid` (lazy) |
| `EpisTrendChart` | Series temporales | `LineChart` (lazy) |
| `EpisApprovalGate` | Diálogo aprobación humana | `Dialog`, `Alert` |

---

## Reglas de importación

```text
PERMITIDO en apps/web:
  import { EpisCommandBar, Epis2ThemeProvider } from '@epis2/epis2-ui';
  import { copy } from '@epis2/design-system';

PROHIBIDO en apps/web (tras MUI-01):
  import Button from '@mui/material/Button';
  import { DataGrid } from '@mui/x-data-grid';

EXCEPCIONES (documentar en ADR si aparecen):
  - Tests con render mínimo
  - Migración temporal con eslint-disable y ticket EPIS2-MUI-*
```

Validador futuro sugerido: `scripts/architecture/no-direct-mui-imports.mjs` (MUI-01).

---

## Ruta de catálogo interno (MUI-02)

```text
/dev/ui-catalog   # Solo desarrollo; no enlazar desde UI clínica
```

Muestra primitivos, clínico, command y dashboard sin datos PHI. Protección: variable `VITE_ENABLE_UI_CATALOG=true` o rol `admin` en dev.

---

## Integración con arquitectura EPIS2 existente

| Capa | Relación con UI |
|------|-----------------|
| Command Registry | Alimenta `EpisCommandSuggestions`; sin MUI |
| Clinical Forms | Blueprints → `EpisClinicalForm` / `ClinicalFormRenderer` migrado |
| RBAC | Chips y acciones deshabilitadas en wrappers |
| IA local | `EpisAiDisclosure`, chip IA en `EpisCommandBar` |
| Modo tablero | `EpisDashboardShell` + «Volver al Centro de Comando» obligatorio |

---

## No objetivos (esta arquitectura)

- No sustituir TanStack Router.
- No introducir Storybook en MUI-00 (opcional en MUI-02).
- No duplicar estado clínico en UI package.
- No mezclar FHIR o SQL en componentes visuales.

---

## Referencias

- `docs/design/EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md`
- `docs/design/M3_ADOPTION_PLAN.md`
- `docs/design/EPIS2_THEME_SPEC.md`
- `docs/design/MUI_X_ADOPTION_PLAN.md`
- `docs/product/PRODUCT_INVARIANTS.md`
- `docs/ARCHITECTURE_TARGET.md`
