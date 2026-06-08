# EPIS2 — Disciplina RAD reinterpretada (Material Design 3)

**Versión:** 1.0 · **Microfase:** MF-RAD-M3  
**No es:** copiar estética Visual Basic 6.  
**Sí es:** copiar la **disciplina de productividad** con React + MUI + MD3.

---

## Principio

> Formularios simples · controles reutilizables · propiedades explícitas · eventos claros ·  
> navegación por teclado · grillas compactas · menús para acciones secundarias ·  
> una sola barra de acciones · separación estricta UI ↔ lógica clínica.

---

## Superficies RAD (canónicas)

| Superficie | Analogía VB/RAD | MD3 | Tarea dominante |
|------------|-----------------|-----|-----------------|
| **Command** | Pantalla de inicio / menú mínimo | Centro de Comando | Decidir intención |
| **Workspace** | MDI child con contexto | Scaffold + rail | Trabajar con paciente/episodio |
| **Form** | `Form` + controles bound | Form sections + scrollspy | Capturar borrador clínico |
| **Grid** | `MSFlexGrid` / DataGrid | `EpisDataGrid` compacto | Listar, seleccionar, actuar en lote |
| **Document** | Vista previa impresión | Print / document layout | Revisar antes de firmar |

**Regla:** toda pantalla clínica = exactamente **una** superficie dominante.

---

## Algoritmo por pantalla (10 pasos)

1. Identificar la **tarea principal** (una sola).
2. Clasificar superficie: Command / Form / Grid / Document / Workspace.
3. Eliminar cards que no agrupan información clínicamente coherente.
4. Sustituir listas de cards por **grilla compacta** cuando hay >5 ítems homogéneos.
5. Centralizar Guardar · Firmar · Imprimir · Auditar en **una** `EpisClinicalActionBar`.
6. Asignar **TabIndex** lógico (ver `useRadTabIndex`).
7. Mover acciones secundarias a **menú contextual** (`EpisRadContextMenu`).
8. Evitar modales salvo confirmación de riesgo o selección obligatoria.
9. Mantener top bar fija · rail fijo · comando contextual (MF-UI-SIMPLIFY).
10. **Cero lógica clínica** en componentes visuales — solo props + callbacks.

---

## Separación UI ↔ dominio

```text
Página (apps/web)     → orquesta hooks, API, navegación
Superficie RAD        → layout, tabindex, action bar, menús
packages/epis2-ui     → controles reutilizables (props explícitas)
packages/clinical-*   → reglas, blueprints, permisos (sin JSX clínico)
```

**Prohibido en `components/rad/` y `components/layout/`:** fetch, RBAC, evaluación CDS, firma.

---

## Modo diseño (dev)

Flag: `VITE_ENABLE_DESIGN_MODE=true`

Muestra clasificación RAD de la ruta actual, presupuesto de iconos y checklist — **sin alterar datos clínicos**.

Ver: `apps/web/src/design/EpisDesignModeProvider.tsx`

---

## Gates

```bash
npm run quality:rad-m3-discipline-gate
npm run quality:design-mode-gate
```

---

## Referencias

- `apps/web/src/design/radScreenRegistry.ts` — inventario auditado
- `apps/web/src/quality/uiDensityRules.ts` — presupuestos MF-UI
- `docs/design/EPIS2_UI_ARCHITECTURE.md`
- `reports/epis2-rad-m3-global-plan-2026-06-07.md`
