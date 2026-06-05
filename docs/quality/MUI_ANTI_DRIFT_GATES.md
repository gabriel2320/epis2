# EPIS2 — Gates anti-deriva Material UI

**Fase:** EPIS2-MUI-00 · Complementa `docs/quality/ANTI_DRIFT_GATES.md`

Estos gates son **permanentes** una vez activa la capa `epis2-ui` (desde MUI-01). En MUI-00 aplican como criterios de revisión manual y diseño.

---

## Gates obligatorios

| ID | Gate | Falla si… | Verificación |
|----|------|-----------|--------------|
| MUI-G01 | MUI único design system | Aparece Carbon, OpenMRS UI, Ant, Chakra como DS | `no-legacy-dependencies.mjs` (existente) |
| MUI-G02 | Un solo tema | Segundo `createTheme` en apps o tema paralelo «EPIS legacy» | Revisión + lint futuro |
| MUI-G03 | Sin import MUI directo | `from '@mui/material'` en `apps/web` fuera excepciones | `no-direct-mui-imports.mjs` (MUI-01) |
| MUI-G04 | Sin MUI X sin caso | `package.json` incluye `@mui/x-*` sin fila en adoption plan | Revisión PR + doc |
| MUI-G05 | Sin Pro/Premium sin licencia | Uso de APIs `GridPremium`, `licenseKey`, etc. | `MUI_LICENSING_DECISION_LOG` + grep |
| MUI-G06 | Copy visible en español | Strings UI clínica en inglés | `spanish-visible-copy` (existente) |
| MUI-G07 | Home = Centro de Comando | Dashboard o legacy home | `command-center-home` (existente) |
| MUI-G08 | No dashboard como home | Ruta `/` o default → tablero | Idem |
| MUI-G09 | Estados loading/error/empty | Componente de lista/form sin los tres estados | Checklist PR + catálogo MUI-02 |
| MUI-G10 | Responsive básico | Página nueva sin prueba 360px/1280px | Checklist piloto |
| MUI-G11 | No info técnica en UI clínica | Stack traces, nombres de modelo IA, IDs internos visibles | Revisión UX |
| MUI-G12 | Modo tablero opcional | Tablero sin enlace «Volver al Centro de Comando» | Test E2E / golden journey |
| MUI-G13 | Bundle disciplinado | Import barrel `@mui/material` o iconos masivos | ESLint + MUI-11 analyze |
| MUI-G14 | IA disclosure | Salida IA sin `EpisAiDisclosure` / borrador | Revisión componentes IA |
| MUI-G15 | Catálogo no en producción | `/dev/ui-catalog` o `/desarrollo/catalogo-visual` en build piloto sin flag | `dev-catalog-gates.mjs` + router guard |

---

## Señales de parada (humanas)

Detener merge de UI si aparece:

- «Solo por ahora importo Button de MUI en la página».
- Instalar `@mui/x-data-grid-premium` para una columna.
- Segundo `ThemeProvider` anidado con tema distinto.
- Copiar componentes Carbon «porque se veían bien».
- Scheduler en menú principal sin modelo de citas.
- Storybook con tema distinto al de producción sin sincronización.

---

## Integración CI (roadmap)

| Fase | Automatización |
|------|----------------|
| MUI-00 | Gates manuales en checklist PR |
| MUI-01 | `no-direct-mui-imports.mjs` en `architecture:validate` |
| THEME-08 | `dev-catalog-gates.mjs` (MUI-G15) + `theme:snapshot` en `theme:validate` / CI |
| MUI-05+ | Detectar `@mui/x-*` vs `MUI_X_ADOPTION_PLAN.md` |
| MUI-11 | `vite build` size budget opcional |

---

## Checklist PR (UI)

```markdown
- [ ] Sin imports @mui/* en apps/web (salvo excepción documentada)
- [ ] Copy desde @epis2/design-system/copy
- [ ] loading / error / empty en componente nuevo
- [ ] Probado mobile + desktop
- [ ] Sin feature MUI X Pro sin LIC-0XX APPROVED
- [ ] Golden journey afectado ejecutado
```

---

## Relación con invariantes de producto

| Invariante PRODUCT_INVARIANTS | Gate MUI |
|------------------------------|----------|
| #4 React + MUI únicamente | MUI-G01 |
| #6–7 Command Center home | MUI-G07, MUI-G08 |
| #14 UI español | MUI-G06 |
| #8 Información no solicitada | MUI-G11 + UX |

---

## Frase guía

> EPIS2 no acumula componentes MUI visibles; gobierna capacidades y las activa con el trabajo clínico.

---

## Referencias

- `docs/quality/ANTI_DRIFT_GATES.md`
- `docs/quality/M3_ANTI_DRIFT_GATES.md`
- `docs/design/MUI_CAPABILITY_MAP.md`
- `docs/product/PRODUCT_INVARIANTS.md`
