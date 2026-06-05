# EPIS2 — Chips sin truncar + formularios completos

**Fecha:** 2026-06-04  
**Alcance:** chips del Centro de Comando, tema MUI, blueprints clínicos, asistencia IA local.

---

## Cambios

### Botones / chips (texto completo)
- Los chips de rol muestran la **frase de comando completa** (`sampleEs`, p. ej. «preparar receta médica»); el título muestra el nombre corto del formulario.
- `EpisAssistChip`: altura automática, etiqueta multilínea sin ellipsis.
- `pickChipSampleEs` prioriza alias con «preparar», «solicitar» o «registrar».
- Botones de acciones rápidas en ficha: `whiteSpace: normal`.

### Formularios (blueprints)
| Formulario | Campos añadidos |
|------------|-----------------|
| Receta | cantidad, indicaciones al paciente, notas clínicas |
| Epicrisis | fecha de alta, plan de seguimiento |
| Imagenología | prioridad |
| Interconsulta | resumen clínico breve |
| Enfermería | temperatura, observaciones |
| MAR | hora de administración, notas |
| Farmacia | dosis prescrita, comunicación al prescriptor |

### IA local
- `assistSchemas` y `draftPromptCatalog` alineados con los nuevos campos de receta y epicrisis.

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — 210 tests |
| `npm run db:validate` | OK |

---

## Riesgos

- Chips con frases largas ocupan más altura en el Centro de Comando (aceptable en escritorio; `flexWrap` ya activo).
- Borradores guardados antes del cambio no tendrán los campos nuevos (solo demo).

---

## Próximo paso

Recargar `/comando` y verificar visualmente «preparar receta médica» y «solicitar laboratorio» sin corte; abrir `/espacio/receta` con paciente demo y completar el flujo borrador → revisión.
