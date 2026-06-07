# EPIS2 — Storybook (decisión y gate)

**Fase:** Prioridad B · **Relacionado:** `EPIS2_UI_STACK_DECISIONS.md`, `MUI_ANTI_DRIFT_GATES.md`

---

## Decisión

**Adoptar Storybook** de forma acotada en `packages/epis2-ui`, no en `apps/web`.

| Aspecto | Regla |
|---------|--------|
| Tema | Solo `Epis2ThemeProvider` en `.storybook/preview.tsx` |
| Alcance | Primitivos y composiciones canónicas (10–15 stories) |
| Copy | `@epis2/design-system` — español visible |
| Producción | Storybook **no** se despliega en piloto clínico |
| Coexistencia | `/dev/ui-catalog` sigue para composición de pantalla |

---

## Motivo

EPIS2 ya tiene volumen suficiente de componentes propios (`EpisCommandBar`, `EpisClinicalForm`, `EpisDataGrid`, `PrintA5Document`, etc.). Storybook acelera:

- validación M3 y accesibilidad visual
- trabajo con Cursor sin levantar stack completo
- regresiones visuales en PRs (futuro: CI `build-storybook`)

---

## Gate MUI-G16 (`storybook-theme-gate.mjs`)

Falla si:

1. `.storybook/preview.tsx` no usa `Epis2ThemeProvider`
2. Aparece `createTheme(` en `.storybook/` o `src/stories/`
3. Stories importan `@mui/material` directamente

---

## Comandos

```bash
npm run storybook:ui          # dev :6006 (CLI raíz, config epis2-ui)
npm run storybook:ui:build    # estático → packages/epis2-ui/storybook-static
```

---

## Stories iniciales (bootstrap)

| Story | Componente |
|-------|------------|
| Primitivos/EpisButton | Apariciones M3 |
| Comando/EpisCommandBar | Power bar |
| Formularios/EpisClinicalForm | Blueprint evolución |
| Datos/EpisDataGrid | Grid demo ES |
| Dashboard/EpisMetric | Métricas tablero |
| Clínico/EpisDraftStatus | Estados borrador |
| Clínico/EpisApprovalGate | Puerta aprobación |
| Clínico/EpisAiDisclosure | Disclosure IA |
| Feedback/EpisEmptyState | Empty |
| Feedback/EpisLoadingState | Loading |
| Primitivos/EpisChip | Chip + demo badge |
| Impresión/PrintA5Document | Carta A5 |

---

## Próximo paso

- Añadir stories bajo demanda por IDC (no catálogo masivo)
- Opcional CI: `storybook:ui:build` en pipeline M3

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
