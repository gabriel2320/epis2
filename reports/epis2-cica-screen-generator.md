# EPIS2 — Generador de pantallas CICA (MD3)

**Fecha:** 2026-06-17 · **Gate:** `npm run quality:fast`

## Patrón (ahorro tokens)

```text
1. Blueprint (solo IDs + spans)     → apps/web/src/cica/blueprints/
2. Slots (datos/contratos)            → página .tsx mínima
3. CicaGeneratedScreen (layout MD3)   → packages/epis2-ui
```

## Nueva pantalla stub

```ts
// blueprints/foo.blueprint.ts
export const FOO_BLUEPRINT: CicaScreenBlueprint = {
  screenId: 'my-work',
  hideActionBar: true,
  sections: [{ id: 'main', span: 12, placeholder: '…' }],
};
```

```tsx
// FooPage.tsx
export function FooPage() {
  return <CicaBlueprintPage blueprint={FOO_BLUEPRINT} title="…" slots={{ main: <Data /> }} />;
}
```

## Login rediseñado

- `EpisAuthScreen` — split M3 (panel marca md+ · formulario · pie)
- Tema claro/oscuro vía `Epis2ThemeProvider`
- `LoginPage` — solo auth + copy (sin layout manual)

## Pantallas migradas

- Buscar, censo, recientes, mi trabajo, agenda
- Secciones ficha stub → `CicaBlueprintBody`

## Próximo lote automatizado

Resumen, indicaciones, exámenes — añadir blueprint + slots con hooks existentes.
