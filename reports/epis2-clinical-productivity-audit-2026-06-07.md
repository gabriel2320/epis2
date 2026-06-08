# EPIS2 — MF-CLINICAL-PRODUCTIVITY-UTILS Audit (2026-06-07)

**Microfase:** MF-CLINICAL-PRODUCTIVITY-UTILS  
**Canon:** home = `/comando`; borradores ≠ firmados; IA no aprueba ni firma  
**Principio:** *Toda utilidad ahorra escritura o errores; si satura UI → comando o menú contextual.*

---

## Inventario de productividad actual

Auditoría estática (`packages/clinical-productivity/src/inventory/productivityAudit.ts`) + revisión de `apps/web`.

| Ruta | Tarea dominante | Brechas | Fase | Utilidades objetivo |
|------|-----------------|---------|------|---------------------|
| `/comando` | Decidir intención | — | A | `ClinicalCommandPalette` |
| `/espacio/buscar-paciente` | Buscar paciente | autocomplete, grid | A | Autocomplete, DataGrid |
| `/espacio/evolucion` | Evolución | texto libre, scroll | B | RichText, Snippets, SpellCheck |
| `/espacio/ficha` | Contexto paciente | grid ausente | A | CopyPaste, SemanticSearch |
| `/epis2/dashboard?tab=work` | Pendientes | grid, bulk, duplicados | A | DataGrid, BulkAction |
| `/epis2/dashboard?tab=pharmacy` | Cola farmacia | grid, bulk | A | DataGrid, BulkAction |
| `/espacio/resultados` | Bandeja resultados | bulk | A | DataGrid, BulkAction |
| `/espacio/borrador/:id` | Aprobar borrador | acciones duplicadas | A | CopyPaste |

---

## Campos y patrones detectados

### Texto libre pesado
- Evolución, epicrisis, interconsulta, notas de enfermería — candidatos Fase B (`ClinicalRichTextEditor`, snippets `.soap`, `.evolucion`).

### Formularios largos / scroll
- Formularios clínicos en `clinical-forms` — priorizar RHF + Zod por tramo; colapsables ya parcialmente cubiertos por MF-UI-SIMPLIFY.

### Listas repetitivas sin grid (>5 ítems homogéneos)
- Dashboard work/pharmacy tabs, bandeja resultados, censo — reemplazar cards por `ClinicalDataGrid`.

### Botones duplicados
- Borrador + dashboard tabs — acción global única vía ActionBar / bulk menu (MF-UI duplicate-actions gate).

### Escritura clínica repetida
- Diagnósticos, órdenes, medicación, plantillas — `ClinicalAutocomplete` + diccionario chileno.

### Búsqueda / autocompletado ausente
- Buscar paciente, CIE-10, medicamentos — Fase A autocomplete; Fase C Meilisearch opcional.

---

## Infraestructura existente reutilizada (no duplicar)

| Existente | Decisión |
|-----------|----------|
| `EpisDataGrid` (`epis2-ui`) | Re-exportado como `ClinicalDataGrid` |
| `EpisBulkActionMenu` | Re-export desde `@epis2/clinical-productivity` |
| `EpisCopyPasteTextTools` | Idem |
| `EpisDraggableList` | Idem |
| `command-registry` | Sin router paralelo; palette refuerza `/comando` |
| `clinical-forms` | Sin duplicar registry |

---

## Stack evaluado vs integrado

| Utilidad | Estado | Notas |
|----------|--------|-------|
| MUI Autocomplete | **Integrado** | `EpisAutocomplete` → `ClinicalAutocomplete` |
| MUI X Data Grid | **Integrado** | vía `ClinicalDataGrid` wrapper |
| cmdk | Pendiente Fase A+ | `ClinicalCommandPalette` MUI nativo hoy |
| React Hook Form + Zod | Parcial | Schemas IA en paquete; formularios por tramo |
| Tiptap | Stub Fase B | `ClinicalRichTextEditor` placeholder |
| LanguageTool / nspell | Pendiente Fase B | `ClinicalSpellCheck` diccionario local |
| Meilisearch | Pendiente Fase C | fallback substring en diccionario |
| Ollama embeddings | Pendiente Fase C | `ClinicalSemanticSearchBox` stub |
| Ollama structured + Zod | **Scaffold Fase D** | `structuredOutput.ts` |
| dnd-kit | Pendiente Fase E | DnD HTML5 en `ClinicalDraggableList` |
| Tesseract / whisper | Stub Fase E | OCR/dictado desactivables |

---

## Riesgos clínicos

1. Medicación vía autocomplete — mitigado con `requiresConfirmation` + gate.
2. Texto IA/OCR/dictado/pega — `textOrigin.ts` + `mayAutoSign === false` para orígenes no manuales.
3. Acciones masivas riesgosas — confirmación en `ClinicalBulkActionMenu`.
4. Saturación de `/comando` — palette limita `maxVisible`; home mantiene ≤4 sugerencias (canon UX-G02).

---

## Gates planificados

```bash
npm run quality:clinical-productivity-gate   # meta
npm run quality:autocomplete-gate
npm run quality:spellcheck-gate
npm run quality:command-palette-gate
npm run quality:clinical-grid-gate
npm run quality:bulk-actions-gate
npm run quality:copy-paste-safety-gate
npm run quality:drag-drop-safety-gate
npm run quality:ollama-structured-output-gate
```

---

## Próximo paso

1. Adoptar `ClinicalDataGrid` + `ClinicalBulkActionMenu` en dashboard tabs y resultados.
2. Cablear `ClinicalCommandPalette` (Ctrl+K) en shell sin sobrecargar home.
3. Fase B: Tiptap + snippets en evolución.
4. **No iniciar Tramo J Farmacia** hasta gates verdes y adopción en cola farmacia.
