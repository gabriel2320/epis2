# EPIS2 — Mapa maestro CICA v1

> **CICA = sidebar útil + ficha tradicional + páginas carta + libro de evoluciones + modo papel protagonista.**

**Raíz canónica:** `/app/*` (alias conceptual `/cica/*` en diseño).  
**Registry:** `packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts`  
**Policy:** [`EPIS2_CICA_CLEAN_ROOM_POLICY.md`](EPIS2_CICA_CLEAN_ROOM_POLICY.md)

---

## Cuatro shells estructurales

| Shell | Cuándo | Componentes |
|-------|--------|-------------|
| **A — Sistema** | Buscar, censo, entrada | `CicaAppShell` + `CicaSidebar` (nivel sistema) |
| **B — Ficha** | `/app/pacientes/:id/*` | + sidebar paciente + tabs ficha |
| **C — Carta** | Acciones mayores (`/nueva`, evolución individual) | `CicaLetterPageShell` — sidebar oculta |
| **D — Papel** | `/papel/*` | `PaperModeScreen` — sidebar oculta |

---

## Etapa 1 ✓ (implementada en rama)

| Pantalla | Ruta | Estado |
|----------|------|--------|
| Buscar paciente | `/app/buscar` | ✓ |
| Censo | `/app/censo` | ✓ |
| Ficha resumen | `/app/pacientes/:id/resumen` | ✓ |
| Sidebar dos niveles epis2g | layout global | ✓ |
| `CicaClinicalList` | buscar/censo | ✓ |
| Capa visual epis2g | `cicaEpis2gVisual.ts` | ✓ rail + panel + cards |

## Etapa 2 ◐ (parcial)

| Pantalla | Ruta | Estado |
|----------|------|--------|
| Evoluciones lista | `/app/pacientes/:id/evoluciones` | ✓ |
| Nueva evolución (carta) | `/app/pacientes/:id/evoluciones/nueva` | ✓ (form; falta wrap carta total) |
| Libro evoluciones | `/app/pacientes/:id/evoluciones/libro` | ✓ |
| Evolución página carta | `/app/pacientes/:id/evoluciones/:evolutionId` | ✓ |
| Navegación anterior/siguiente | `CicaBookPager` | ✓ |

## Etapa 3 — planificada

Indicaciones, exámenes, medicamentos, documentos (lista + `/nueva` carta).

## Etapa 4 — planificada

Papel diario ✓ · Papel libro ◐ (`/papel/libro` índice) · semana/mes · animación paso página.

## Etapa 5 — integrada (stubs epis2g)

Interconsultas, procedimientos, alta, auditoría, ingreso, medicamentos, timeline, recientes, mi trabajo, agenda — rutas + sidebar + placeholders demo.

---

## Árbol de rutas v1 (activas vs planificadas)

```text
/app/buscar                          ✓
/app/censo                           ✓
/app/recientes                       ✓ (stub demo)
/app/mi-trabajo                      ✓ (stub demo)
/app/agenda                          ✓ (stub demo)

/app/pacientes/:id/resumen           ✓
/app/pacientes/:id/evoluciones       ✓
/app/pacientes/:id/evoluciones/libro ✓
/app/pacientes/:id/evoluciones/:evolutionId ✓
/app/pacientes/:id/evoluciones/nueva ✓
/app/pacientes/:id/indicaciones      ✓
/app/pacientes/:id/indicaciones/nueva✓
/app/pacientes/:id/examenes          ✓
/app/pacientes/:id/documentos        ✓
/app/pacientes/:id/documentos/nuevo  ✓
/app/pacientes/:id/epicrisis/nueva   ✓
/app/pacientes/:id/papel/dia/:date   ✓
/app/pacientes/:id/papel/libro       ✓
/app/pacientes/:id/ingreso           ✓ (stub)
/app/pacientes/:id/medicamentos        ✓ (stub)
/app/pacientes/:id/interconsultas      ✓ (stub)
/app/pacientes/:id/procedimientos      ✓ (stub)
/app/pacientes/:id/alta                ✓ (stub + acción epicrisis)
/app/pacientes/:id/timeline            ✓ (timeline demo)
/app/pacientes/:id/auditoria           ✓ (stub)
```

Leyenda: ✓ implementada · stub = navegable con contenido mínimo demo

---

## Reglas de producto (invariantes CICA)

1. Una intención clínica = una pantalla.
2. Acción clínica mayor = página carta propia (`letter-document`).
3. Sin dashboard, tablero, Centro/Ficha/Dashboard legacy.
4. Sidebar CICA ≠ sidebar legacy EPIS — colapsable, dos niveles, sin multilínea rota.
5. Modo papel = pilar; herencia visual legacy solo en contenido hoja (`PaperChartMode`).
6. Evoluciones = lista + libro + páginas carta navegables.
7. Bot/autopilot = GO-CANDIDATE; signoff visual humano obligatorio para rc4.

---

## PRs sugeridos (siguiente)

| PR | Alcance |
|----|---------|
| MF-CICA-08 | Wrap formularios `/nueva` en `CicaLetterPageShell` |
| MF-CICA-09 | `CicaSummaryModules` — reemplazar `ClassicChartSummaryPanel` |
| MF-CICA-10 | Papel: podar toolbar legacy en `CicaPaperDayPage` |
| MF-CICA-11 | Recientes + mi trabajo (solo UI, fixtures demo) |
