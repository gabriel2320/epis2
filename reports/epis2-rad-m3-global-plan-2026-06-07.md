# EPIS2 — Auditoría global + plan RAD/MD3 (2026-06-07)

**Alcance:** revisión proyecto · plan consolidado · bases diseño MD3 · modo diseño · disciplina RAD  
**Sin tocar:** registries clínicos · router · lógica API · Tramo J

---

## Diagnóstico (auditoría)

| Área | Estado | Riesgo |
|------|--------|--------|
| Arquitectura (18 invariantes) | ✓ gates verdes | Bajo |
| Command-first `/comando` | ✓ MF-UI-SIMPLIFY | Bajo |
| Scaffold M3 | ✓ EpisAppScaffold | Bajo |
| Separación rol × ámbito | ✓ matriz roles | Medio (dashboard tabs) |
| Productividad tipo RAD | ◐ base creada | Medio — adopción incremental |
| Cards vs grillas | ◐ parcial | **Alto** en dashboard tabs |
| ActionBar única formularios | ✓ evolución | Bajo |
| Modo diseño dev | ✓ nuevo | Bajo |

**Conclusión:** la arquitectura está sana; el cuello de botella es **densidad visual y disciplina de superficie**, no falta de features.

---

## Entregables de esta sesión

### Documentación

| Archivo | Contenido |
|---------|-----------|
| `docs/product/EPIS2_GLOBAL_DEV_PLAN.md` | Plan único L0–L5, fases A–D |
| `docs/design/EPIS2_RAD_M3_DISCIPLINE.md` | Metodología VB→MD3 (10 pasos) |

### Código — modo diseño

| Archivo | Rol |
|---------|-----|
| `design/designModeEnv.ts` | `VITE_ENABLE_DESIGN_MODE` (off por defecto) |
| `design/EpisDesignModeProvider.tsx` | Overlay RAD/MD3 en pantalla |
| `design/radScreenRegistry.ts` | Inventario auditado por ruta |

### Código — superficies RAD (UI tonta)

| Componente | Superficie |
|------------|------------|
| `EpisRadScreenShell` | Selector |
| `EpisRadFormSurface` | Form + TabIndex + ActionBar |
| `EpisRadGridSurface` | Grid + bulk slot |
| `EpisRadDocumentSurface` | Document |
| `EpisContextMenu` (epis2-ui) | Menú acciones secundarias |

### Gates nuevos

```bash
npm run quality:rad-m3-discipline-gate
npm run quality:design-mode-gate
```

---

## Mapa pantalla → superficie (extracto)

| Ruta | Superficie | Tarea principal | Migración |
|------|------------|-----------------|-----------|
| `/comando` | Command | Decidir intención | done |
| `/espacio/ficha` | Workspace | Contexto paciente | done |
| `/espacio/evolucion` | Form | Borrador evolución | partial |
| `/espacio/borrador/:id` | Document | Aprobar borrador | partial |
| `/epis2/dashboard?tab=*` | Grid | Listas de trabajo | pending/partial |
| `/espacio/resultados` | Grid | Bandeja resultados | partial |

Inventario completo: `apps/web/src/design/radScreenRegistry.ts`

---

## Modo diseño (cómo usar)

```bash
# .env.local
VITE_ENABLE_DESIGN_MODE=true
npm run dev -w @epis2/web
```

Overlay inferior derecho muestra: superficie RAD · tipo MD3 · presupuesto iconos · estado migración.

**No afecta producción** — desactivado por defecto.

---

## Plan inmediato (Fase A — consolidación visual)

1. Migrar tabs dashboard densos → `EpisRadGridSurface` + `EpisBulkActionMenu`
2. Migrar `ResultsInboxPage` → Grid surface
3. MF-UI-05 acordeones en formularios largos
4. E2E UX-G02 con modo diseño off

**Bloqueo explícito:** Tramo J farmacia hasta Fase A estable.

---

## Gates sesión

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK (519+ tests; incl. design/) |
| `quality:ui-simplify-gate` | ✓ previo |
| `quality:rad-m3-discipline-gate` | ✓ |
| `quality:design-mode-gate` | ✓ |

---

## Frase guía

> Productividad de Visual Basic, estética Material Design 3, arquitectura EPIS2 limpia — sin mezclar lógica clínica en la UI.
