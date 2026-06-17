# EPIS2 — Tema visual «Aurora Clínica» (2026-06-05)

**Alcance:** identidad visual M3 en `@epis2/epis2-ui` + carga tipográfica en `apps/web`.

---

## Entregables

| Área | Cambio |
|------|--------|
| `visual-identity.ts` | Gradientes canvas/hero, sombras suaves, tokens Power Bar y marca |
| `color-roles.ts` | Superficies azul-gris refinadas; primario `#1873DC` |
| `typography.ts` | **Plus Jakarta Sans** como fuente principal |
| `components.ts` | CssBaseline, focus ring, botones con gradiente, cards con elevación clínica |
| `EpisBrandMark` | Isotipo con gradiente de acento |
| Shells | Login y Centro de Comando con fondo aurora + glass; Power Bar en contenedor destacado |
| `index.html` | Preconnect + Plus Jakarta Sans; `theme-color` |

Roles clínicos (`clinical-roles.ts`) **sin cambios** — contraste WCAG AA intacto.

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | 182/182 (tras fix test motion) |
| `architecture:validate` | OK (single theme generator) |

---

## Riesgos

- Fuente Google Fonts requiere red en demo offline → fallback Inter/sistema.
- Gradientes en botones primarios: verificar contraste en modo oscuro en piloto humano.

---

## Próximo paso

Extender aurora a workspaces clínicos (`ClinicalShellLayout`) y catálogo `/dev/ui-catalog`; opcional acento por usuario vía preferencias M3-08.
