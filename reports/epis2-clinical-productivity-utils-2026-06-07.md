# EPIS2 — MF-CLINICAL-PRODUCTIVITY-UTILS Implementation (2026-06-07)

**Microfase:** MF-CLINICAL-PRODUCTIVITY-UTILS  
**Alcance:** Paquete `@epis2/clinical-productivity`, Fase A scaffold + Fase B/C/D/E stubs, gates, piloto grid.

---

## Utilidades integradas (Fase A — básica)

| Wrapper | Origen | Estado |
|---------|--------|--------|
| `ClinicalAutocomplete` | MUI via `EpisAutocomplete` | Funcional — diccionario chileno |
| `ClinicalCommandPalette` | MUI Dialog + hook Ctrl+K | Funcional — cmdk opcional futuro |
| `ClinicalDataGrid` | `EpisDataGridSuspense` | Re-export + piloto |
| `ClinicalBulkActionMenu` | Componente propio | Funcional — confirmación riesgo |
| `ClinicalCopyPasteTools` | Componente propio | Funcional — plain text + origen |
| `ClinicalDraggableList` | HTML5 DnD local | Funcional — modo edición |

## Utilidades scaffold (Fase B–E)

| Wrapper | Fase | Estado |
|---------|------|--------|
| `ClinicalRichTextEditor` / `ClinicalSnippetExpander` | B | Stub — Tiptap pendiente |
| `ClinicalSpellCheck` | B | Funcional básico — LanguageTool pendiente |
| `ClinicalSemanticSearchBox` | C | Stub — Meilisearch/Ollama embeddings |
| `parseStructuredAiOutput` + schemas Zod | D | Scaffold validación |
| `ClinicalOCRImport` / `ClinicalDictationButton` | E | Stub desactivable |
| `ClinicalTreeSelector` | A+ | Stub MUI Tree |

---

## Paquete creado

```
packages/clinical-productivity/
  src/components/     # wrappers Clinical*
  src/dictionaries/   # chileClinicalDictionary.ts
  src/snippets/       # clinicalSnippets.ts (.soap, .uci, …)
  src/safety/         # textOrigin.ts
  src/schemas/        # structuredOutput.ts (Zod)
  src/inventory/      # productivityAudit.ts
```

**Regla de consumo:** pantallas importan `@epis2/clinical-productivity`, no `cmdk`/`@tiptap`/`@dnd-kit`/etc. directamente.

---

## Pantallas impactadas

| Pantalla | Cambio |
|----------|--------|
| `PatientListGrid.tsx` | Migrado a `ClinicalDataGrid` |
| `EpisBulkActionMenu.tsx` | Re-export paquete |
| `EpisCopyPasteTextTools.tsx` | Re-export paquete |
| `EpisDraggableList.tsx` | Re-export paquete |

**Pendiente adopción:** dashboard work/pharmacy, resultados, evolución (Fase B).

---

## Reducción botones / cards

- Piloto grid en lista pacientes — patrón para reemplazar cards homogéneas >5 filas.
- Bulk menu oculto sin selección — evita barra de acciones permanente en listas.
- Copy/paste como acción textual, no botón global duplicado.

---

## Diccionario médico chileno

Archivo: `packages/clinical-productivity/src/dictionaries/chileClinicalDictionary.ts`

Categorías seed: abreviaturas, medicamentos, laboratorio, servicios, diagnósticos, unidades, UCI, APS, pabellón, IAAS.

Funciones: `findClinicalTerms`, `isWhitelistedClinicalTerm`, `suggestFormalForm`.

---

## Gates agregados

| Script npm | Valida |
|------------|--------|
| `quality:clinical-productivity-gate` | Meta + sub-gates + no imports directos en pantallas |
| `quality:autocomplete-gate` | Confirmación medicación |
| `quality:spellcheck-gate` | Sugiere, no autocorrige |
| `quality:command-palette-gate` | Ctrl+K, maxVisible, confirmación |
| `quality:clinical-grid-gate` | Wrapper + piloto PatientListGrid |
| `quality:ollama-structured-output-gate` | Zod + no auto-firma |

Sub-gates reutilizados (actualizados a fuente en paquete): bulk-actions, copy-paste-safety, drag-drop-safety.

---

## Riesgos clínicos residuales

1. Diccionario seed pequeño — expandir antes de producción clínica real.
2. Stubs Fase C–E pueden confundir si se activan sin backend — mantener flags/env.
3. Dashboard tabs aún sin grid/bulk — fricción operativa persiste hasta adopción.

---

## Pendientes antes de Tramo J Farmacia

1. `ClinicalDataGrid` + `ClinicalBulkActionMenu` en tab farmacia.
2. Autocomplete medicamentos con confirmación explícita en órdenes.
3. Gates verdes en CI (`quality:clinical-productivity-gate`).
4. Fase B spellcheck + snippets en documentos narrativos.

---

## Verificación sesión

```bash
npm run check
npm run test
npm run db:validate
npm run quality:clinical-productivity-gate
```

**Criterios de éxito:** menos escritura vía autocomplete/snippets; búsqueda/grid compactos; sin firma automática de texto sugerido; arquitectura no duplicada.
