# UX-G02 — Checklist manual: flujo command-first (CE-0 → CE-5)

**Fecha:** 2026-06-07  
**Estado:** Automatizado (API + E2E 5/5) · checklist humano opcional (≤30 s)  
**Alcance:** Centro de Comando → confirmación → formulario revisable → ficha compacta  
**Prerequisito código:** CE-0…CE-5 (registry, confirmación, assist route, slot prefill, badge + URL limpia)

> **Verificación automática:** `npm run quality:ux-pilot-gate` (estático) · `npm run quality:ux-pilot` (API + E2E completo).

---

## Prerequisitos de entorno

| Requisito | Comando / dato |
|-----------|----------------|
| API + web | `npm run dev` (o stack local habitual) |
| Base demo | Migraciones aplicadas (`npm run db:migrate`) |
| Usuario | `medico.demo` / `DEMO-CLAVE-MEDICO` — `docs/auth/DEMO_USERS.md` |
| Rol | Médico (`physician`) |
| Home | `/comando` (Centro de Comando, **no** dashboard) |

**Ollama / local-ai:** opcional para este gate. El flujo debe funcionar **sin** IA; assist route solo mejora frases ambiguas.

---

## Criterio de éxito (producto)

EPIS2 debe sentirse como:

**intención → sugerencia → confirmación → formulario revisable**

No como:

**menú → pantalla → botón → formulario**

| Señal | Pass | Fail |
|-------|------|------|
| Comprensión | Un médico entiende el flujo en **≤ 30 s** | Necesita explorar menús o rail para adivinar el siguiente paso |
| Seguridad percibida | Badge + confirmación dejan claro que nada se ejecuta solo | Parece auto-aprobación o acción silenciosa |
| Densidad | Sin botones redundantes ni scroll excesivo en ficha/evolución | Widget grid, acciones duplicadas, longitudinal siempre abierto |

---

## Parte A — Orden con prefill (imagenología)

Paciente fijado antes del comando de orden.

| # | Paso | Acción | Resultado esperado | ✓ / ✗ | Notas |
|---|------|--------|-------------------|-------|-------|
| 1 | Abrir home | Ir a `/comando` | Power Bar visible; título «Centro de Comando»; sin dashboard como home | | |
| 2 | Paciente demo | En panel **Recorridos demo**, elegir un episodio (p. ej. *IAM en evaluación* / DEMO-001) **o** buscar y fijar paciente | Chip/banner de paciente activo; contexto en línea si aplica | | |
| 3 | Comando | Escribir en Power Bar: `pedir TAC de tórax` y **Enter** | No error genérico; no `needs_clarification` con lista larga sin sentido | ✓ auto | `quality:ux-g02` |
| 4 | Intención | Revisar respuesta antes de confirmar | Intent **`request_imaging`** / etiqueta tipo *Imagenología*; mensaje coherente con orden | ✓ auto | |
| 5 | Confirmación CE-2 | Debe aparecer **diálogo de confirmación** (`epis2-command-confirmation-dialog`) — es intent `order` | Botones cancelar / confirmar; mensaje menciona acción y paciente si aplica | ✓ auto | API `needs_confirmation` |
| 6 | Confirmar | Pulsar confirmar en el diálogo | Navegación a `/espacio/imagenologia?patientId=…` (+ slots efímeros) | ✓ auto | `confirmed: true` |
| 7 | Badge CE-5 | En cabecera del formulario | Chip **`epis2-command-prefill-badge`**: *Borrador sugerido por comando — revisa antes de guardar.* | ☐ UI | auto: slots → badge elegible |
| 8 | Prefill CE-3b/4 | Revisar campos | Al menos: **modalidad** `TC`, **estudio** con señal de TAC/tórax, **prioridad** si la frase llevaba urgencia | ✓ auto | ver ejecución |
| 9 | URL limpia CE-5 | Mirar barra de dirección **tras** ~1 s | Solo `patientId` en query; **sin** `studyHint`, `bodySiteHint`, `medicationHint`, etc. | ☐ UI | auto: strip OK |
| 10 | Guardar | Completar campos obligatorios y **Guardar borrador** solo tras revisión | Borrador pendiente (no aprobado); mensaje de éxito o validación clara | ☐ manual | |

### Valores de referencia (automático / registry)

Frase `pedir TAC de tórax` con paciente:

- Resolve → `request_imaging` → `/espacio/imagenologia`
- Slots típicos: `studyHint` (tac), `bodySiteHint` (torax)
- Prefill formulario: `modality` = `TC`, `studyDescription` incluye tac/tórax

---

## Parte B — Ficha compacta + evolución (UX-B.2 + CE-4)

| # | Paso | Acción | Resultado esperado | ✓ / ✗ | Notas |
|---|------|--------|-------------------|-------|-------|
| 11 | Volver a ficha | Desde formulario o rail → ficha del **mismo paciente** | `/espacio/ficha?patientId=…`; resumen 1 línea + alertas; **sin** widget grid expandido | | |
| 12 | Evolución | Power Bar en ficha o comando: `hacer evolución` | Resuelve **`create_evolution_draft`** **sin** pedir buscar paciente de nuevo | ✓ auto | |
| 13 | Paciente activo | Abrir `/espacio/evolucion` | Mismo `patientId`; chip paciente en cabecera del formulario | ☐ UI | |
| 14 | Densidad UX-G02 | Recorrer ficha + formulario evolución | Sin botones duplicados obvios; historial longitudinal **colapsado** por defecto; scroll razonable en una pantalla de trabajo | | |
| 15 | Tiempo | Cronometrar comprensión (otro observador o auto) | Flujo comando → confirmación → formulario **comprensible en ≤ 30 s** | | s |

### Prefill contextual (CE-4, evolución)

Con paciente demo cargado, campos vacíos pueden sugerirse desde resumen:

- **Objetivo:** labs + eventos recientes  
- **Análisis:** problemas activos  
- **Plan:** pendientes + medicación  

No debe **pisar** texto ya escrito por el usuario.

---

## Parte C — Regresiones rápidas (opcional, 5 min)

| # | Check | Esperado |
|---|-------|----------|
| C1 | Cancelar diálogo de confirmación (paso 5) | Permanece en comando; no navega |
| C2 | `hacer evolución` **sin** paciente en `/comando` | `needs_patient` o mensaje claro; no formulario vacío huérfano |
| C3 | Recargar formulario **después** de URL limpia | Valores del formulario se mantienen; badge puede desaparecer (aceptable) |

---

## Registro de sesión

| Campo | Valor |
|-------|-------|
| Ejecutor | |
| Fecha | |
| Commit / rama | |
| Navegador | |
| API / web URLs | |
| Episodio demo usado | |
| Resultado global | ☐ Pass ☐ Pass con observaciones ☐ Fail | **Auto 9/9** — ver `reports/epis2-ux-g02-execution-2026-06-07.md` |

### Observaciones / ajustes menores (paso 3 del plan)

```
(escribir aquí tras la prueba)
```

---

## Tras completar este checklist

1. **Ajustes menores** solo si algún ✗ es claro y acotado (copy, badge, prefill, confirmación).
2. **`reports/epis2-ce0-ce5-consolidated-YYYY-MM-DD.md`** — reporte consolidado **después** de marcar Pass.
3. **Commit/push** con mensaje que cite UX-G02 + CE cuando el gate humano esté verde.

---

## Referencias

| Documento | Uso |
|-----------|-----|
| `reports/archive/2026-06/epis2-ce5-command-prefill-ux-2026-06-04.md` | Badge + URL limpia |
| `reports/archive/2026-06/epis2-ce2-confirmation-slots-2026-06-04.md` | Diálogo confirmación |
| `docs/design/EPIS2_UX_B_INFORMATION_ARCHITECTURE.md` | UX-G02 ficha compacta (canon) |
| `docs/quality/GOLDEN_CLINICAL_JOURNEY.md` | Journey producto (no sustituye este gate) |

**Frase guía:** *IA interpreta · Registry autoriza · Usuario confirma · EPIS2 ejecuta.*
