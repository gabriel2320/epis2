# EPIS2 - Plan maestro post-auditoria

Fecha: 2026-06-19  
Estado base: PR #47 mergeado en `master` con commit `9d86fae`.

## Evaluacion breve

El plan post-auditoria es correcto en intencion: estabiliza antes de crecer, congela legacy, exige seguridad RLS/IA y fuerza QA visual. La parte obsoleta es la fase dedicada a dividir PR #47: ese PR ya fue mergeado. Desde ahora el plan debe operar como estabilizacion post-merge, con medicion de regresiones, evidencia y microfases chicas.

Cambios principales de esta version:

- PR #47 pasa a fase de estabilizacion post-merge.
- CICA no se declara GO absoluto: queda como superficie principal candidata a piloto.
- Legacy queda congelado, pero no eliminado.
- IA queda local-first y PHI-safe por defecto.
- DB/API se endurece despues de mapear flujos, no antes de entender impacto.
- Las mejoras visuales CICA y papel se ejecutan con gates y evidencia por pantalla.
- Cada microfase queda chica, con archivos permitidos y sin mega-PR.

## Reglas absolutas

- No crear features clinicas nuevas.
- No expandir dashboard.
- No usar legacy `/espacio/*` como fuente visual para CICA.
- No duplicar registries.
- No escribir PHI real.
- No permitir que IA firme, apruebe o escriba SoT.
- No tocar auth, RLS o migrations salvo microfase explicita.
- No mezclar seguridad, UX, IA y packaging en un mismo PR.
- No hacer mega-PR.

Reglas positivas:

- CICA `/app/*` es la superficie principal candidata a piloto.
- Legacy `/espacio/*` es fallback congelado.
- PostgreSQL es SoT.
- Borrador no equivale a nota aprobada.
- IA propone; humano revisa y firma.
- Una pantalla tiene una intencion principal.
- Una pantalla tiene una accion primaria visible.
- Modo papel debe comportarse como hoja carta clinica real.

## Orden actualizado

0. Estabilizar post-merge PR #47.
1. Sellar verdad CICA.
2. Aislar legacy.
3. Limpiar contexto activo para humanos y agentes.
4. Mapear flujos clinicos.
5. Auditar y corregir pantallas CICA.
6. Cerrar resumen/ficha medica tradicional.
7. Cerrar formularios clinicos CICA.
8. Cerrar modo papel carta.
9. Endurecer API/DB.
10. Preparar IA segura.
11. Cerrar QA visual y golden journey.
12. Generar reporte de piloto sintetico.

## Fase 0 - MF-POSTMERGE-47-STABILIZE

Objetivo: estabilizar el merge de PR #47 antes de tocar producto nuevo.

Alcance:

- Validar que RLS fail-closed no bloqueo flujos clinicos demo.
- Validar que AI boundary no usa cloud con PHI por defecto.
- Validar que screen map y `/dev/screen-review` no afectan runtime clinico.
- Validar que packaging no introdujo dependencias o rutas cruzadas.
- Registrar riesgos residuales en reporte.

Archivos permitidos:

- `docs/EPIS2_CURRENT_STATE.md`
- `docs/product/EPIS2_ROUTE_MAP.md`
- `docs/product/EPIS2_PRODUCT_CATALOG.md`
- `reports/epis2-postmerge-47-stabilization.md`
- tests o gates estrictamente necesarios si fallan.

Gates:

```bash
npm run quality:required
npm run quality:clinical
npm run quality:ai
npm run db:validate
```

Criterios de aceptacion:

- Login demo funciona.
- Buscar paciente funciona.
- Abrir ficha funciona.
- Crear borrador funciona.
- Aprobar borrador funciona.
- Dashboard no rompe.
- IA local degrada sin Ollama.
- Cloud queda bloqueado para PHI.
- `quality:required` verde.

## Fase 1 - MF-CICA-TRUTH-01

Objetivo: eliminar contradiccion documental sobre CICA.

Texto canonico:

```txt
CICA /app/* es la superficie clinica principal candidata a piloto.
Legacy /espacio/* queda como fallback congelado.
El GO definitivo requiere walkthrough humano MF-CICA-PILOT-01.
Todo desarrollo nuevo debe apuntar a /app/* salvo fallback autorizado.
```

Archivos probables:

- `README.md`
- `docs/EPIS2_CURRENT_STATE.md`
- `docs/AGENT_CONTEXT_MINIMAL.md`
- `docs/product/EPIS2_PURGE_ARCHIVE_PLAN.md`
- `.env.example`
- `apps/web/src/dev/cicaUiEnv.ts`

Gate:

```bash
npm run quality:fast
```

Criterio:

- Ningun documento activo debe decir CICA GO absoluto mientras otro lo trata como opt-in/lab sin explicacion.

## Fase 2 - MF-LEGACY-FENCE-01

Objetivo: congelar legacy sin romper fallback.

Acciones:

- Marcar rutas `/espacio/*` como runtime legacy.
- Prohibir imports visuales legacy desde CICA.
- Prohibir links nuevos a `/espacio/*` salvo redirects/fallback.
- Crear gate `quality:cica-no-legacy-imports`.

Archivos probables:

- `apps/web/src/routes/router.tsx`
- `apps/web/src/cica/**`
- `packages/epis2-ui/src/cica/**`
- `scripts/quality/validate-cica-no-legacy-imports-gate.mjs`
- `tools/gates/catalog.json`
- `tools/gates/catalog-full.json`

Gates:

```bash
npm run quality:gate -- quality:cica-no-legacy-imports
npm run quality:clinical
```

## Fase 3 - MF-ACTIVE-CONTEXT-01

Objetivo: reducir ruido para humanos, Codex y agentes locales.

Acciones:

- Actualizar `.cursorignore`.
- Excluir `reports/archive/**` y `docs/archive/**` salvo indices.
- Crear mapa activo de superficie.
- Separar archivo vivo de archivo historico.

Crear/actualizar:

- `docs/product/EPIS2_ACTIVE_SURFACE.md`
- `docs/archive/TRUNCATED_MODULES.md`
- `docs/archive/AGENT_SCOPE_EXCLUSIONS.md`
- `docs/AGENT_CONTEXT_MINIMAL.md`
- `docs/product/EPIS2_PRODUCT_CATALOG.md`

Clasificacion:

- CORE
- CICA
- LEGACY_RUNTIME
- PAPER
- AI_BOUNDARY
- LABS
- TOOLS
- ARCHIVE
- DEV_ONLY

Gates:

```bash
npm run knip:audit
npm run quality:fast
```

## Fase 4 - MF-FLOW-MAP-01

Objetivo: mapear flujos clinicos reales, no solo rutas.

Crear:

- `docs/product/EPIS2_CLINICAL_FLOW_MAP.md`
- `docs/product/EPIS2_FLOW_MATRIX.md`
- `tools/catalog/clinical-flow-map.generated.json`

Flujos obligatorios:

- FLOW-01 Login -> buscar -> censo -> ficha.
- FLOW-02 Ficha -> evolucion nueva -> borrador -> aprobacion -> libro.
- FLOW-03 Ficha -> prescripcion -> borrador -> aprobacion.
- FLOW-04 Ficha -> epicrisis -> borrador -> impresion.
- FLOW-05 Ficha -> papel dia -> editar -> aprobar -> imprimir.
- FLOW-06 Ficha -> examenes -> revisar -> accion clinica.
- FLOW-07 Ficha -> auditoria -> trazas.
- FLOW-08 Formulario -> IA sugiere -> humano edita -> firma.

Cada flujo debe declarar:

- actor
- ruta inicial
- ruta final
- screenIds
- objectIds
- datos leidos
- datos escritos
- permisos
- RLS
- draftType
- approvalRequired
- aiAllowed
- legacyFallback
- e2eCoverage

Gate:

```bash
npm run quality:fast
```

No crear el E2E si aun no existe el flujo estable; registrar cobertura faltante.

## Fase 5 - MF-CICA-UI-AUDIT-01

Objetivo: auditar y corregir pantallas React/MUI bajo CICA.

Pantallas prioritarias:

- `/app/buscar`
- `/app/censo`
- `/app/pacientes/:id/resumen`
- `/app/pacientes/:id/evoluciones/nueva`
- `/app/pacientes/:id/indicaciones/nueva`
- `/app/pacientes/:id/epicrisis/nueva`
- `/app/pacientes/:id/examenes`

Reglas UI:

- Usar CicaAppShell.
- Usar CicaScreenFrame.
- Usar ClinicalScreen.
- Usar componentes EPIS2 UI.
- No usar composicion legacy.
- No mas de una accion primaria.
- No mas de 5-7 elementos de navegacion visibles.
- No scroll horizontal.
- No botones encimados.
- No instrucciones duplicadas.
- No dashboard-first.

Crear:

- `docs/product/EPIS2_CICA_SCREEN_AUDIT.md`
- `reports/cica-l/visual-audit-YYYY-MM-DD.md`

Metricas por pantalla:

- intencion unica
- paciente visible
- accion primaria unica
- retorno seguro
- estado documento visible
- IA visible o degradada
- sin overflow horizontal
- sin botones encimados
- responsive 1366x768
- responsive 1280x720
- espaciado 8pt
- jerarquia visual medica

Gates:

```bash
npm run quality:ui
npm run quality:clinical
```

## Fase 6 - MF-CICA-SUMMARY-01

Ruta:

```txt
/app/pacientes/:patientId/resumen
```

Objetivo: que la pantalla parezca ficha medica tradicional moderna.

Layout requerido:

- identidad paciente
- contexto clinico breve
- problemas activos
- ultima evolucion
- indicaciones activas
- resultados criticos
- borradores/documentos pendientes
- accion primaria: nueva evolucion

Criterio humano:

Un medico debe entender en menos de 10 segundos quien es el paciente, que problema tiene, que esta pendiente y cual es la siguiente accion.

Gate:

```bash
npm run quality:ui
npm run quality:clinical
```

## Fase 7 - MF-CICA-FORMS-01

Rutas:

- `/app/pacientes/:id/evoluciones/nueva`
- `/app/pacientes/:id/indicaciones/nueva`
- `/app/pacientes/:id/epicrisis/nueva`
- `/app/pacientes/:id/documentos/nuevo`

Objetivo: cada accion clinica debe ser pagina carta/documento editable.

Estructura:

- identidad paciente compacta
- estado: borrador/listo/aprobado
- titulo documento
- formulario clinico
- asistencia IA opcional/degradada
- acciones: volver, guardar borrador, firmar

Reglas:

- Guardar no es firmar.
- Firmar exige humano.
- IA solo sugiere.
- Campos largos comodos.
- Secciones secundarias colapsables.
- Scroll vertical estable.
- Action bar clara.

Gate:

```bash
npm run quality:ui
npm run quality:clinical
```

## Fase 8 - MF-PAPER-LETTER-01

Objetivo: cerrar modo papel como experiencia carta real.

Crear:

- `docs/product/EPIS2_PAPER_MODE_SPEC.md`

Rutas:

- `/app/pacientes/:id/papel/dia/:date`
- `/app/pacientes/:id/papel/libro`

Estandar visual:

- hoja carta
- margenes visibles
- lineas sutiles
- tipografia clinica clasica
- botones fuera de la hoja
- watermark BORRADOR/APROBADO/DEMO
- navegacion dia anterior/hoy/siguiente
- impresion sin UI

Paper day:

- paciente
- fecha
- diagnosticos
- evolucion
- indicaciones
- examenes
- procedimientos
- notas enfermeria
- firma

Paper book:

- indice por fecha
- pagina actual
- anterior/siguiente
- buscar
- imprimir rango

Gates:

```bash
npm run quality:clinical
npm run quality:ui
```

## Fase 9 - MF-BACKEND-DB-01

Objetivo: endurecer API/DB sin cambiar producto.

Crear:

- `docs/api/EPIS2_API_ROUTE_AUDIT.md`
- `docs/security/EPIS2_AUDIT_EVENTS.md`

Auditar cada ruta por:

- metodo
- permiso
- RLS
- Zod
- lectura/escritura
- auditoria
- test
- riesgo

Estados a revisar:

- `clinical_drafts.status`
- `clinical_drafts.draft_type`
- `clinical_notes.note_type`
- `clinical_orders.status`
- `clinical_orders.priority`
- `clinical_documents.status`
- `clinical_documents.intake_status`

Indices candidatos:

```sql
clinical_drafts(patient_id, status, updated_at)
clinical_notes(patient_id, created_at)
audit_events(patient_id, at)
clinical_documents(patient_id, indexed_at)
observations(patient_id, observed_at)
clinical_orders(patient_id, status, ordered_at)
```

Regla: no agregar migracion sin justificar query, test y rollback.

Gates:

```bash
npm run db:migrate
npm run db:validate
npm run quality:clinical
```

## Fase 10 - MF-AI-READY-01

Objetivo: preparar IA segura, local-first y human-in-the-loop.

Crear:

- `docs/intelligence/EPIS2_AI_POLICY.md`

Reglas IA:

- Puede sugerir texto.
- Puede resumir contexto.
- Puede mejorar redaccion.
- Puede detectar campos faltantes.
- No diagnostica autonomamente.
- No firma.
- No aprueba.
- No escribe SoT.
- No usa PHI en cloud.
- Siempre requiere revision humana.

Data tiers:

- L0_synthetic
- L1_deidentified
- L2_phi

Politica:

- Default = L2_phi.
- L0: Ollama permitido, cloud opcional.
- L1: Ollama permitido, cloud explicito.
- L2: Ollama local, cloud bloqueado.

Estados UI IA:

- IA disponible
- IA degradada
- IA generando
- sugerencia pendiente
- sugerencia insertada
- revision humana requerida
- error IA

Gates:

```bash
npm run quality:ai
npm run quality:clinical
```

## Fase 11 - MF-QA-GOLDEN-CICA-01

Objetivo: golden journey CICA obligatorio.

E2E debe cubrir:

- login
- buscar paciente
- abrir ficha
- crear evolucion
- guardar borrador
- firmar/aprobar
- ver en libro de evoluciones
- abrir papel dia
- imprimir/exportar

Viewports:

- 1366x768
- 1440x900
- 1280x720

Pantallas screenshot:

- `/app/buscar`
- `/app/censo`
- `/app/pacientes/:id/resumen`
- `/app/pacientes/:id/evoluciones/nueva`
- `/app/pacientes/:id/indicaciones/nueva`
- `/app/pacientes/:id/epicrisis/nueva`
- `/app/pacientes/:id/examenes`
- `/app/pacientes/:id/papel/dia/:date`
- `/app/pacientes/:id/papel/libro`

Gate final:

```bash
npm run quality:fast
npm run quality:clinical
npm run quality:ui
npm run quality:ai
npm run quality:required
npm run knip:audit
```

Si `test:e2e:golden-cica` aun no existe, esta fase debe crearlo como gate separado y documentar baseline visual.

## Fase 12 - MF-CICA-PILOT-REPORT-01

Objetivo: dejar EPIS2 listo para piloto sintetico y no para produccion real.

Crear:

- `reports/epis2-synthetic-pilot-readiness-YYYY-MM-DD.md`

Debe incluir:

- estado CICA
- estado legacy
- estado RLS
- estado IA
- estado papel
- flujos cubiertos
- flujos faltantes
- riesgos clinicos
- riesgos legales
- recomendacion: NO-GO, PASS WITH FIXES o GO sintetico

## Definition of Done

EPIS2 queda listo para piloto sintetico si:

- CICA es entrada clinica clara.
- Legacy esta congelado.
- Docs activos no se contradicen.
- RLS endurecido y validado.
- IA segura por defecto.
- Modo papel carta satisfactorio.
- Flujos clinicos mapeados.
- Pantallas sin overflow.
- Pantallas sin botones encimados.
- Una accion primaria por pantalla.
- Borrador/aprobacion funcionando.
- Golden CICA verde.
- `quality:required` verde.
- Walkthrough humano queda PASS WITH FIXES o GO sintetico.

## Prompt operativo por microfase

```txt
EPIS2 - Microfase controlada post-auditoria.

Lee:
README.md
docs/EPIS2_CURRENT_STATE.md
docs/AGENT_CONTEXT_MINIMAL.md
docs/product/EPIS2_ROUTE_MAP.md
docs/product/EPIS2_PRODUCT_CATALOG.md

No leer reports/archive/** salvo instruccion explicita.

Reglas:
- No features clinicas nuevas.
- No usar legacy como fuente visual CICA.
- No duplicar registries.
- No tocar auth/RLS/migrations salvo autorizacion.
- IA propone, humano aprueba.
- Sin PHI real.
- Un PR = un objetivo.
- Diff minimo.
- Ejecutar gate.
- Documentar evidencia.

Microfase:
MF-...

Objetivo:
...

Archivos permitidos:
...

Archivos prohibidos:
...

Gate:
...

Criterios de aceptacion:
...

Implementa solo esta microfase.
Si encuentras deuda fuera de alcance, registra hallazgo en reporte.
No la corrijas en este PR.
```
