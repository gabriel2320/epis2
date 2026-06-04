# EPIS2 — Especificación de tema Material UI

**Fase:** EPIS2-MUI-00 · **Implementación:** EPIS2-MUI-01 en `packages/epis2-ui/src/theme/`

Un solo tema para toda la aplicación. Modo oscuro preparado en tokens; **lanzamiento inicial solo `light`.**

---

## Objetivos del tema

- Identidad clínica sobria (confianza, legibilidad, bajo ruido visual).
- Coherencia con Centro de Comando como superficie principal.
- Localización española en Material UI y MUI X.
- Variables CSS habilitadas (`cssVariables: true`) para theming dinámico futuro.
- Overrides centralizados; sin estilos inline repetidos en páginas.

---

## Paleta (objetivo MUI-01)

| Token | Valor light | Uso |
|-------|-------------|-----|
| `primary.main` | `#1E6FD6` | Acciones primarias, foco comando |
| `primary.light` | `#E8F1FF` | Fondos suaves selección |
| `primary.dark` | `#0F4FB0` | Hover pressed |
| `primary.contrastText` | `#FFFFFF` | Texto sobre primario |
| `background.default` | `#F8FAFC` | Fondo app |
| `background.paper` | `#FFFFFF` | Tarjetas, diálogos |
| `text.primary` | `#0F172A` | Cuerpo |
| `text.secondary` | `#64748B` | Ayudas, metadatos |
| `divider` | `#E2E8F0` | Separadores |
| `error.main` | `#C62828` | Seguridad, fallos |
| `warning.main` | `#ED6C02` | CDS moderado |
| `success.main` | `#2E7D32` | IA disponible, OK clínico |
| `info.main` | `#0288D1` | Informativo |

### Modo oscuro (preparado, no activo en MVP)

| Token | Valor dark (borrador) |
|-------|----------------------|
| `background.default` | `#0F172A` |
| `background.paper` | `#1E293B` |
| `primary.main` | `#5B9FEF` |

Activación: `palette.mode` + prueba contraste WCAG antes de MUI-09.

---

## Tipografía

```ts
fontFamily:
  'Inter, Roboto, system-ui, -apple-system, "Segoe UI", sans-serif';
```

| Variante | Uso EPIS2 |
|----------|-----------|
| `h4` | Título Centro de Comando |
| `h5` | Título sección clínica |
| `h6` | Subsección formulario |
| `body1` | Texto clínico principal |
| `body2` | Metadatos paciente |
| `caption` | Hints Power Bar, chips |
| `button` | Hereda `textTransform: none` |

**Fuente:** Inter preferida; fallback sistema si no cargada (MUI-01: `@fontsource/inter` opcional, evaluar bundle).

---

## Shape y espaciado

| Token | Valor | Notas |
|-------|-------|-------|
| `shape.borderRadius` | `16` | Base tarjetas |
| Botones | `14` | Override `MuiButton` |
| Inputs | `14` | Override `MuiOutlinedInput` |
| Diálogos | `24` | Override `MuiDialog paper` |
| Chips comando | `999` | Píldora sugerencias |

Espaciado: escala MUI por defecto (8px); densidad **comfortable** en formularios, **compact** solo en Data Grid (MUI-05).

---

## Sombras

- Botones: `disableElevation: true` (flat clínico).
- `Paper` elevación 0–2 según jerarquía; evitar sombras pesadas en Command Center.
- Data Grid: sombra mínima en contenedor; definir en `components.ts` MUI-05.

---

## Motion

| Duración | Uso |
|----------|-----|
| 150ms | Hover chips, focus |
| 200ms | Apertura `Dialog` |
| 0ms | Preferir `prefers-reduced-motion` respetado |

Transiciones vía tema `transitions` MUI; sin animaciones decorativas en rutas críticas (aprobación, CDS).

---

## Overrides de componentes (mínimos MUI-01)

```ts
MuiButton: {
  defaultProps: { disableElevation: true },
  styleOverrides: {
    root: { borderRadius: 14, textTransform: 'none', fontWeight: 600 },
  },
},
MuiTextField: {
  defaultProps: { fullWidth: true, variant: 'outlined' },
},
MuiOutlinedInput: {
  styleOverrides: { root: { borderRadius: 14, backgroundColor: '#FFFFFF' } },
},
MuiDialog: {
  styleOverrides: { paper: { borderRadius: 24 } },
},
MuiPaper: {
  styleOverrides: { rounded: { borderRadius: 16 } },
},
MuiChip: {
  styleOverrides: { root: { fontWeight: 500 } },
},
```

---

## Localización española

```ts
import { createTheme } from '@mui/material/styles';
import { esES as materialEsES } from '@mui/material/locale';
// MUI X (cuando se instalen):
// import { esES as dataGridEsES } from '@mui/x-data-grid/locales';
// import { esES as pickersEsES } from '@mui/x-date-pickers/locales';

export const epis2Theme = createTheme(
  { /* palette, typography, components, cssVariables: true */ },
  materialEsES,
  // dataGridEsES, pickersEsES — al adoptar cada paquete X
);
```

Reglas:

- `LocalizationProvider` con `adapterLocale="es"` y Day.js `es` (MUI-06).
- Formatos fecha/hora visibles: `DD/MM/YYYY`, 24h en entorno clínico chileno/latam (confirmar en piloto).
- Nunca depender del locale `enUS` por defecto de MUI.

---

## Responsive

| Breakpoint | Comportamiento |
|------------|----------------|
| `xs`–`sm` | Command Center: chips wrap; Power Bar full width |
| `md`+ | Tablero: columnas grid; sidebar documentos `DRAWER` opcional |
| Mínimo táctil | Targets 44×44px en botones críticos |

Cada página clínica debe probarse en 360px y 1280px antes de cerrar microfase.

---

## Relación con tema actual (`@epis2/design-system`)

El archivo `packages/design-system/src/theme/epis2Theme.ts` usa primario `#1565C0`. **MUI-01 unificará** al token `#1E6FD6` de esta especificación o documentará desviación en `MUI_LICENSING_DECISION_LOG` / ADR si se mantiene el azul actual por continuidad demo.

---

## Implementación de referencia (MUI-01)

```ts
import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

export const epis2Theme = createTheme(
  {
    cssVariables: true,
    palette: {
      mode: 'light',
      primary: {
        main: '#1E6FD6',
        light: '#E8F1FF',
        dark: '#0F4FB0',
        contrastText: '#FFFFFF',
      },
      background: { default: '#F8FAFC', paper: '#FFFFFF' },
      text: { primary: '#0F172A', secondary: '#64748B' },
      divider: '#E2E8F0',
      error: { main: '#C62828' },
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily:
        'Inter, Roboto, system-ui, -apple-system, "Segoe UI", sans-serif',
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 14, textTransform: 'none' },
        },
      },
      MuiTextField: {
        defaultProps: { fullWidth: true, variant: 'outlined' },
      },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 24 } },
      },
    },
  },
  esES,
);
```

---

## Referencias

- `docs/design/EPIS2_UI_ARCHITECTURE.md`
- MUI: Theme, CSS theme variables, Localization, Minimizing bundle size
