# EPIS2 — Vista 2 Ficha compacta + split-screen (UX-B.2)

**Fecha:** 2026-06-07 · **Alcance:** `packages/epis2-ui`, `apps/web` (`/espacio/ficha`)

---

## Objetivo

Completar UX-B.2: ficha resumen compacta, dock contextual único, historial en split-screen, información oculta hasta ser relevante.

---

## Entregables

| Componente | Descripción |
|------------|-------------|
| `EpisSplitPane` | Split 50/50 en ≥768px; apilado en móvil |
| `EpisWorkspaceSection` | Sección plana sin `Paper outlined` |
| `EpisDockReserveLayout` | Reserva inferior compartida (Comando + Ficha) |
| `EpisFloatingCommandDock.compact` | Sin titular visible — contexto en `ClinicalPatientChartChrome` |
| `PatientWorkspacePage` | Split historial, alertas solo si hay datos, sin context line duplicada |
| `PatientWorkspaceCommandPanel` | Dock flotante; sin sugerencias ni `EpisCommandBar` inline |

---

## Eliminado / reducido

- `CommandCenterContextLine` en ficha (chrome N1–N2 ya muestra paciente)
- Botones «Volver al Comando» / «Cambiar paciente» al pie (AppBar)
- `EpisCommandSuggestions` en ficha
- Acordeón MUI → toggle «Ver historial» + split pane
- Alertas vacías ocultas (invariante #8)
- `Paper outlined` en resumen y actividad reciente

---

## Layout ficha cargada

```text
AppBar + PatientChartChrome (contexto 1 línea)
├─ Split (desktop) o stack (móvil)
│   ├─ Resumen · Alertas* · Actividad · [Ver historial]
│   └─ Longitudinal (si abierto)
└─ EpisFloatingCommandDock (compact)
```

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — **505** tests |
| LAYOUT-G12 | OK |

---

## Próximo paso (plan UX)

| Fase | Contenido |
|------|-----------|
| **UX-C** | Tableros Quality/ICU — métrica + tabla plana |
| **UX-D** | Formularios — Guardar · Firmar · ⋯ (3 acciones max) |
| **Vista 3** | Login gateway estético (opcional) |

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
