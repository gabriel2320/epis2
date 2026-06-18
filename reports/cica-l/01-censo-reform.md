# CICA-L-01 — Buscar paciente + Censo hospitalario (reformulación P0)

**Programa:** reformulación CICA clásica · **Prioridad:** P0 · **Estado:** wireframe · **Veredicto:** NO-GO hasta score ≥ 90

**Canon:** [`docs/design/EPIS2_CICA_CLASSIC_MASTER_TREE.md`](../docs/design/EPIS2_CICA_CLASSIC_MASTER_TREE.md) · [`docs/design/EPIS2_CICA_CLASSIC_LAYOUT_SPEC.md`](../docs/design/EPIS2_CICA_CLASSIC_LAYOUT_SPEC.md)

---

## 1. Intención clínica

| Pantalla | Intención | Acción primaria |
|----------|-----------|-----------------|
| Buscar | Encontrar paciente por identificador o criterio clínico | Buscar → Abrir ficha |
| Censo | Elegir paciente hospitalizado del servicio | Abrir ficha (por fila) |

---

## 2. Wireframe — Buscar (`/app/buscar`)

Shell **A — system-workspace** · ver layout spec §2.

```text
┌─ CicaTopBar: «Buscar paciente» ─────────────────────────────────────────────┐
├─ Sidebar L1: Buscar* · Censo · Agenda · Mi trabajo · Recientes ─────────────┤
├─ ClinicalScreen ────────────────────────────────────────────────────────────┤
│  H1: «¿Qué paciente necesita revisar?»                                       │
│  ┌ span 10 ─────────────────────────────┐ ┌ span 2 ────┐                   │
│  │ RUT, nombre, cama o diagnóstico…     │ │  Buscar    │                   │
│  └──────────────────────────────────────┘ └────────────┘                   │
│  Filtros asist (opcional P0.1): [Todos] [UTI] [UCI] [MQ]                   │
│  ── Resultados ──                                                           │
│  │ Paciente          │ Servicio/cama    │ Pendiente      │ [Abrir ficha] │   │
│  │ …                 │ …                │ …              │               │   │
└─────────────────────────────────────────────────────────────────────────────┘
Pie: EPIS2 demo · sesión · sintéticos
```

**Señales:** badge DEMO en top bar · sin banda paciente.

---

## 3. Wireframe — Censo (`/app/censo`)

```text
┌─ CicaTopBar: «Censo hospitalario» ──────────────────────────────────────────┐
├─ Sidebar L1 (idem) ─────────────────────────────────────────────────────────┤
├─ ClinicalScreen ────────────────────────────────────────────────────────────┤
│  Subtítulo: «Hospitalizados activos — seleccione fila para abrir ficha»    │
│  [Todos] [Mi servicio] [UCI/UTI] [Próximas altas*]  *P1                   │
│  Campo filtro rápido (span 12)                                              │
│  CicaClinicalList — misma tabla que buscar, sin hero                        │
└─────────────────────────────────────────────────────────────────────────────┘
Acción primaria: Abrir ficha por fila (no botón global)
```

---

## 4. Grilla 12 columnas

### Buscar

| Bloque | span | Componente |
|--------|------|------------|
| Hero pregunta | 12 | `EpisM3Text headlineLarge` |
| Campo búsqueda | 10 | `EpisTextField` |
| Botón buscar | 2 | `EpisButton contained` |
| Filtros servicio | 12 | chips asist P0.1 |
| Lista resultados | 12 | `CicaClinicalList` |

### Censo

| Bloque | span | Componente |
|--------|------|------------|
| Intro + filtros | 12 | texto + chips |
| Búsqueda local | 12 | `EpisTextField` |
| Lista censo | 12 | `CicaClinicalList` |

---

## 5. Registry (sin cambio rutas)

| screenId | route | layoutProfile | primaryAction |
|----------|-------|---------------|---------------|
| `patient-search` | `/app/buscar` | `patient-search` | Buscar |
| `census` | `/app/censo` | `census` | Abrir ficha |

---

## 6. Criterios GO (CICA Screen Score)

- [ ] 1 acción primaria clara por pantalla
- [ ] Lista legible sin scroll horizontal 1280px
- [ ] Sidebar L1 útil (5 ítems)
- [ ] Header + pie institucional
- [ ] DEMO visible
- [ ] `auditCicaScreen()` ≥ 90 en buscar y censo

---

## 7. Implementación (MF sugerida)

**MF-CICA-L01** · allowlist:

```text
apps/web/src/cica/CicaPatientSearchPage.tsx
apps/web/src/cica/CicaCensusPage.tsx
packages/epis2-ui/src/cica/CicaClinicalList.tsx
packages/epis2-ui/src/cica/CicaTopBar.tsx
packages/epis2-ui/src/cica/CicaAppShell.tsx  (footer)
```

**Gate:** `npm run quality:clinical` + walkthrough humano censo → ficha.

**Prohibido en esta MF:** namespace hospitalización · ambulatorio · epis2g blocks.

---

## 8. Aprobación

| Rol | Fecha | Veredicto |
|-----|-------|-----------|
| Wireframe C (este doc) | 2026-06-17 | Pendiente operador |
| Implementación E | — | — |
| Score F | — | — |
| Crítica G | — | — |
