# EPIS2 CICA — Especificación layout clásico tradicional

**Versión:** 1.0 · **Fecha:** 2026-06-17  
**Árbol maestro:** [`EPIS2_CICA_CLASSIC_MASTER_TREE.md`](./EPIS2_CICA_CLASSIC_MASTER_TREE.md)  
**Motor:** `ClinicalScreen` · `ClinicalSection` · `ClinicalFieldGrid` · `CicaAppShell`

> Diseño **sobrio, simétrico, reconocible** — ficha clínica institucional chilena, no SaaS dashboard.

---

## 1. Anatomía global (todas las pantallas `/app`)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ CABECERA INSTITUCIONAL (CicaTopBar) — 56–64px                              │
│ [EPIS2]  Título pantalla / breadcrumb          [DEMO] [IA●] [Usuario ▾]     │
├──────────┬──────────────────────────────────────────────────────────────────┤
│          │ BANDA PACIENTE (solo ficha) — CicaPatientIdentityBand            │
│ SIDEBAR  │ Nombre · RUT · Edad · Cama/Servicio · chips borrador/demo         │
│ L1+L2    ├──────────────────────────────────────────────────────────────────┤
│ 240–280px│ TABS FICHA (solo shell B) — CicaChartTabs: 5 visibles + Más       │
│          ├──────────────────────────────────────────────────────────────────┤
│ Buscar   │                                                                  │
│ Censo    │  CONTENIDO — ClinicalScreen (max-width calm, padding 8px grid)   │
│ Agenda   │  ┌────────────────────────────────────────────────────────────┐  │
│ Mi trab. │  │ Sección A (span 6)    │ Sección B (span 6)               │  │
│ Reciente │  │ grilla 12 cols simétrica│                                  │  │
│          │  └────────────────────────────────────────────────────────────┘  │
│ ──────── │                                                                  │
│ Paciente │  BARRA ACCIONES — ClinicalActionBar (sticky bottom opcional)     │
│ Resumen  │  [ Acción primaria ]  [ Sec 1 ]  [ Sec 2 ]  [ ⋮ Más ]          │
│ …        ├──────────────────────────────────────────────────────────────────┤
│          │ PIE INSTITUCIONAL — versión · sesión · «Datos sintéticos demo»   │
└──────────┴──────────────────────────────────────────────────────────────────┘
```

### Tokens composicionales

| Token | Valor | Notas |
|-------|-------|-------|
| Grilla | 12 columnas · gap 16px (2×8) | `ClinicalFieldGrid` |
| Padding shell | 16px móvil · 24px md · 32px lg | `cicaShellPaddingX` |
| Ancho contenido | max 960px sistema · 100% ficha | perfiles registry |
| Sidebar L1 | 56px colapsado · 220px expandido | icono + label |
| Sidebar L2 paciente | 260px fijo | solo con patientId |
| Header altura | 56px | una línea, sin multilínea |
| Footer altura | 40px | texto xs, contraste bajo |

---

## 2. Shell A — Entrada clínica (buscar, censo, agenda)

**Intención única:** encontrar o elegir paciente / tarea del turno.

```text
┌─ ClinicalScreen profile=census ─────────────────────────────────────────────┐
│ Título: «Censo hospitalario»                                                │
│ Subtítulo: «Pacientes hospitalizados del servicio»                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ [ Filtro servicio ▾ ] [ UCI ] [ UTI ] [ MQ ] [ Todos ]     ← chips asist    │
├─────────────────────────────────────────────────────────────────────────────┤
│ span 12 │ Campo búsqueda + botón «Buscar»                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ span 12 │ CicaClinicalList — filas simétricas, 1 acción «Abrir ficha»       │
│         │ columnas: Paciente | Ubicación | Pendiente | Acción               │
└─────────────────────────────────────────────────────────────────────────────┘
Acción primaria: Abrir ficha (por fila, no global)
Secundarias: ninguna en lista · filtro servicio = asist chips
```

**Buscar paciente:** hero pregunta + campo ancho (span 10) + botón (span 2) en grilla 12.

---

## 3. Shell B — Ficha resumen (ejemplo P0)

```text
┌─ ClinicalScreen profile=classic-chart ──────────────────────────────────────┐
│ Acción primaria global: [ + Nueva evolución ]                               │
├───────────────────────────────┬───────────────────────────────────────────┤
│ span 5                        │ span 7                                      │
│ Problemas activos             │ Última evolución                            │
│ lista compacta                │ extracto + fecha + autor                     │
├───────────────────────────────┼───────────────────────────────────────────┤
│ span 6                        │ span 6                                      │
│ Indicaciones activas          │ Exámenes clave                              │
├───────────────────────────────┴───────────────────────────────────────────┤
│ span 12 │ Fármacos activos — tabla densa legible                           │
└─────────────────────────────────────────────────────────────────────────────┘
Máximo 5 bloques principales (penalización CICA score)
```

---

## 4. Shell C — Página carta (evolución, ingreso, epicrisis)

**Sidebar oculta.** Formato carta centrado (~920px max).

```text
┌─ CicaLetterPageShell ───────────────────────────────────────────────────────┐
│ ← Volver a evoluciones          Borrador · DEMO          [ Guardar ]        │
├─────────────────────────────────────────────────────────────────────────────┤
│                    ┌─ hoja carta ─────────────────────┐                    │
│                    │ EPIS2 · EVOLUCIÓN CLÍNICA         │                    │
│                    │ Paciente · RUT · Fecha             │                    │
│                    │ ─────────────────────────────────  │                    │
│                    │ S · O · A · P  (campos form)       │                    │
│                    │                                  │                    │
│                    └──────────────────────────────────┘                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ [ Guardar borrador ]  primaria    [ Imprimir ]  [ ⋮ Más ]                   │
└─────────────────────────────────────────────────────────────────────────────┘
Acción primaria: Guardar borrador
Estados visibles: chip borrador · DEMO · IA degradada si aplica
```

---

## 5. Shell D — Modo papel

Sidebar oculta. Toolbar papel superior (día anterior | hoy | siguiente | imprimir).

Contenido: `PaperCanvas` — hoja protagonista, fondo calm, sin cards anidadas.

---

## 6. Plantilla wireframe CICA-L (copiar en reports/cica-l/)

```markdown
# CICA-L-NN — <Nombre pantalla>

## 1. Intención clínica
Una frase.

## 2. Acción primaria
Un botón.

## 3. Wireframe ASCII
(pegar shell A/B/C/D)

## 4. Grilla 12 columnas
| Bloque | span | Contenido |
|--------|------|-----------|

## 5. Señales obligatorias
- [ ] Identidad paciente
- [ ] DEMO
- [ ] Borrador/aprobado
- [ ] IA degradada

## 6. Score objetivo
≥ 90 · auditCicaScreen()

## 7. Rutas
/app/...

## 8. Registry
screenId · layoutProfile · primaryAction
```

---

## 7. Botones y densidad

| Rol | Máximo visible | Estilo |
|-----|----------------|--------|
| Primaria | 1 | `contained` |
| Secundaria | 2 | `outlined` |
| Overflow | resto | menú «Más» |
| Destructiva | 0 en barra principal | solo en overflow con confirmación |

**Prohibido:** filas de 4+ botones · FAB duplicando primaria · icon-only sin label en acciones clínicas.

---

## 8. Sidebar — reglas visuales

1. **L1 oscuro institucional** — entrada clínica siempre accesible.
2. **L2 claro** — solo paciente activo; botón «Cerrar ficha» → censo.
3. **Ítems:** icono 20px + label una línea; truncar con ellipsis.
4. **Activo:** borde izquierdo 3px + fondo selected calm.
5. **Planificado:** `planned: true` → disabled + tooltip «Próximamente».
6. **«Más» paciente:** overflow menu con ingreso, UCI, auditoría, etc.

---

## 9. Pie de página (footer)

```text
EPIS2 demo v0.1 · Sesión: <usuario> · Datos sintéticos — no usar en producción
```

Altura fija · no sticky sobre contenido · contraste WCAG AA texto secundario.

---

## 10. Checklist diseño «ficha tradicional»

Antes de merge de pantalla CICA:

- [ ] ¿Se entiende en 3 segundos qué hacer?
- [ ] ¿Una sola acción primaria?
- [ ] ¿Grilla simétrica sin columnas huérfanas?
- [ ] ¿Sin scroll horizontal a 1280px?
- [ ] ¿Header + sidebar + pie coherentes con otras pantallas `/app`?
- [ ] ¿Parece ficha médica y no panel administrativo?
- [ ] `auditCicaScreen()` ≥ 90

---

## 12. Generación automatizada (`CicaGeneratedScreen`)

Pantallas declarativas — **layout en epis2-ui**, **blueprints + datos en apps/web**:

```text
apps/web/src/cica/blueprints/*.blueprint.ts   → secciones id + span 12|6|4
apps/web/src/cica/CicaBlueprintPage.tsx       → wrapper
packages/epis2-ui/.../CicaGeneratedScreen.tsx → MD3 grilla + ClinicalSection
```

Nueva pantalla stub: añadir fila al blueprint + export de página de 3–10 líneas con `slots` opcionales.

---

| Zona | Package | Export |
|------|---------|--------|
| Shell | `@epis2/epis2-ui/cica` | `CicaAppShell`, `CicaTopBar`, `CicaSidebar` |
| Ficha | `@epis2/epis2-ui/cica` | `CicaPatientScreenFrame`, `CicaChartTabs` |
| Layout | `@epis2/epis2-ui/layout/clinical` | `ClinicalScreen`, `ClinicalSection`, `ClinicalFieldGrid` |
| Carta | `@epis2/epis2-ui/cica` | `CicaLetterPageShell` |
| Papel | `@epis2/epis2-ui/cica` | `PaperModeScreen`, `PaperCanvas` |
| Lista | `@epis2/epis2-ui/cica` | `CicaClinicalList` |
