# CICA-L-01 — Buscar paciente + Censo hospitalario (reformulación P0)

**Programa:** PROG-PURGE-CICA · **Prioridad:** P0 · **Estado:** implementado · **Veredicto:** GO score ≥ 90 (walkthrough humano pendiente)

**Canon:** [`docs/design/EPIS2_CICA_CLASSIC_MASTER_TREE.md`](../../docs/design/EPIS2_CICA_CLASSIC_MASTER_TREE.md) · [`docs/design/EPIS2_CICA_CLASSIC_LAYOUT_SPEC.md`](../../docs/design/EPIS2_CICA_CLASSIC_LAYOUT_SPEC.md)

---

## Fase A — Inventario

| Campo | Valor |
|-------|-------|
| Rutas | `/app/buscar` · `/app/censo` |
| Intención clínica | Encontrar paciente · elegir hospitalizado del servicio |
| Usuario principal | Médico / enfermera demo |
| Acción primaria | Buscar → Abrir ficha · Censo: Abrir ficha por fila |
| Acciones secundarias | Filtros servicio (P0.1 defer) |
| Estados visibles | DEMO badge top bar · sin banda paciente |
| Componentes | `CicaPatientSearchPage` · `CicaCensusPage` · `CicaClinicalList` · `CicaAppShell` |
| Problemas previos | Subtitle censo incorrecto · audit sin perfil system-workspace |

### Hallazgos

| Severidad | Descripción |
|-----------|-------------|
| UX-MAJOR | `auditCicaScreen` penalizaba falta identidad paciente en pantallas sistema |
| UX-MINOR | Subtitle censo usaba copy de acción en lugar de intro clínica |

---

## Fase B — Reducción de intención

```text
Buscar — intención única: encontrar paciente
Acción primaria única: Buscar (contained)
Censo — intención única: elegir fila hospitalizada
Acción primaria: Abrir ficha por fila (lista)
```

---

## Fase C — Wireframe textual (aprobado implementación)

Shell **A — system-workspace** · ver layout spec §2.

### Buscar (`/app/buscar`)

```text
┌─ CicaTopBar: «Buscar paciente» ─────────────────────────────────────────────┐
├─ Sidebar L1: Buscar* · Censo · Agenda · Mi trabajo · Recientes ─────────────┤
├─ ClinicalScreen ────────────────────────────────────────────────────────────┤
│  H1: «¿Qué paciente necesita revisar?»                                       │
│  ┌ span 10 ─────────────────────────────┐ ┌ span 2 ────┐                   │
│  │ RUT, nombre, cama o diagnóstico…     │ │  Buscar    │                   │
│  └──────────────────────────────────────┘ └────────────┘                   │
│  ── Resultados ──                                                           │
│  │ Paciente          │ Servicio/cama    │ Pendiente      │ [Abrir ficha] │   │
└─────────────────────────────────────────────────────────────────────────────┘
Pie: EPIS2 demo · sesión · sintéticos
```

### Censo (`/app/censo`)

```text
┌─ CicaTopBar: «Censo hospitalario» ──────────────────────────────────────────┐
├─ Sidebar L1 (idem) ─────────────────────────────────────────────────────────┤
│  Subtítulo: hospitalizados activos — seleccione fila                         │
│  Campo filtro rápido (span 12)                                              │
│  CicaClinicalList — misma tabla que buscar, sin hero                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Fase E — Cambios aplicados

- `auditCicaScreen` · flag `systemWorkspace` para `/app/buscar` y `/app/censo`
- `cicaSystemScreenAudit.ts` + tests score GO
- `CicaCensusPage` · `copy.commandCenter.censusSubtitle`
- Blueprints sin cambio de rutas (`systemScreens.blueprint.ts`)

---

## Fase F — CICA Screen Score

| Criterio | Buscar | Censo |
|----------|--------|-------|
| system-workspace | ✓ | ✓ |
| 1 acción primaria | ✓ Buscar | ✓ por fila |
| DEMO visible | ✓ | ✓ |
| Sidebar L1 (≤5) | ✓ | ✓ |
| Sin overflow horizontal | ✓ | ✓ |
| `auditCicaScreen()` | **100** | **100** |

**Score:** 100/100 · **Veredicto:** GO (walkthrough humano pendiente)

---

## Fase G — Crítica

```text
¿Parece censo/búsqueda clásica clara y usable?
Humano: pendiente antes de CICA default ON
```

---

## Registry (sin cambio rutas)

| screenId | route | layoutProfile | primaryAction |
|----------|-------|---------------|---------------|
| `patient-search` | `/app/buscar` | `patient-search` | Buscar |
| `census` | `/app/censo` | `census` | Abrir ficha |

---

## Próximo paso

Golden journey `/app/*` con `VITE_ENABLE_CICA_UI=true` (Tramo 4).
