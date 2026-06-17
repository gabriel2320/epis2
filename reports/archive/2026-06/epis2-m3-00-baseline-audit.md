# EPIS2-M3-00 — Auditoría visual baseline

**Fecha:** 2026-06-04 · **Estado:** completado · **Base:** post MUI-10, pre tokens M3

---

## Inventario de pantallas

| Ruta / pantalla | Wrapper principal | Tratamiento actual | Tratamiento M3 objetivo |
|-----------------|-------------------|--------------------|-------------------------|
| `/login` | `EpisAuthScreen` | Card 440px, h4 título, chip demo, alert info | Expressivo: Display + container + extraLarge |
| `/comando` | `EpisCommandCenterLayout` | Power Bar + panel paciente + alertas + tablero + sugerencias | Expressivo focal; reducir competencia visual |
| `/espacio/*` formularios | `EpisClinicalFormPage` | Card outlined p:3, h6 | Standard documento, extraLarge canvas |
| `/espacio/ficha` | `PatientWorkspacePage` | Workspace clínico | Standard + panel bajo demanda (M3-06) |
| `/epis2/dashboard` | `EpisDashboardShell` | Tabs + widgets lazy | Adaptativo secundario (M3-07) |
| `/dev/ui-catalog` | `UiCatalogPage` | Secciones por fase MUI | + sección M3 tokens |
| `/dev/scheduler-spike` | `SchedulerSpikePage` | Eval LIC-007 | Sin cambio clínico |

---

## Comprensión Centro de Comando (protocolo ≤3 s)

**Pregunta:** ¿Qué hace el usuario en los primeros 3 segundos?

| Elemento visible inmediato | ¿Ayuda? | Notas |
|----------------------------|---------|-------|
| Título «¿Qué necesitas hacer?» | Sí | Acción clara |
| Power Bar | Sí | Núcleo command-first |
| Chip DEMO + cerrar sesión | Parcial | Header compite levemente |
| Panel paciente activo (card) | Parcial | Información no solicitada al entrar |
| Botón modo tablero | Parcial | Secundario OK si discreto |
| Sugerencias (chips) | Sí | Assist chips alineados M3 |

**Veredicto:** comprensión **aceptable** pero el panel paciente y alertas ocupan espacio antes del primer comando → **M3-04** colapsará contexto secundario.

---

## Ruido visual / acciones primarias

| Pantalla | Acciones primarias detectadas | Problema |
|----------|------------------------------|----------|
| Login | «Entrar al Centro de Comando» | OK (1) |
| Comando | Submit Power Bar + chips paciente + tablero | Múltiples `contained`/filled compitiendo en scroll |
| Formulario | Guardar borrador / enviar | OK tras MUI-04 |
| Tablero | Tabs + volver comando | OK; volver siempre visible |

---

## Estilos múltiples (deriva)

| Fuente | Valores | Ubicación |
|--------|---------|-----------|
| Tema global | radius 16 | `theme.ts` shape |
| Botones / inputs | 14 | `components.ts` |
| Diálogos | 24 | `components.ts` |
| Chips comando | 999 | `EpisCommandSuggestions` |
| Grids/charts/tree | `borderRadius: 2` (16px) | cores MUI X |
| Hardcoded | `#FFFFFF` input bg | `components.ts` |

**Acción M3-01:** unificar vía `epis2Shape` tokens.

---

## Componentes sin patrón M3

| Componente | Gap |
|------------|-----|
| `EpisButton` | Re-export MUI; sin filled/tonal/text M3 |
| `EpisAuthScreen` | Sin shape extraLarge ni motion |
| `EpisCommandCenterLayout` | Sin breakpoints adaptativos |
| `EpisDashboardShell` | Importa `Button`/`Chip` MUI directo |
| `CommandCenterPage` | `Button`/`Chip` raw en header y pacientes |
| Tipografía | h4/h5/h6 MUI legacy; sin roles display/headline |

---

## Gates M3-00

- [x] Inventario pantallas
- [x] Ruido y acciones primarias documentados
- [x] Estilos múltiples listados
- [x] Gaps M3 por componente
- [x] Protocolo 3 s aplicado cualitativamente

**Autorizado iniciar M3-01.**
