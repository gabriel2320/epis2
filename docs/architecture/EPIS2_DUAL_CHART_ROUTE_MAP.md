# EPIS2 — Mapa de rutas (modos dual ficha) v0.2

**Versión:** 0.2 · **ADR:** [`ADR-002-dual-chart-modes.md`](../adr/ADR-002-dual-chart-modes.md)  
**Canon visual:** [`EPIS2_DUAL_CHART_VISUAL_CANON.md`](../design/EPIS2_DUAL_CHART_VISUAL_CANON.md)

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| 🟢 | Canónico nuevo |
| 🟡 | Legacy congelado → redirect |
| 🔵 | Transitorio (MF-08 census-first) |

---

## Flujo objetivo (post MF-DUAL-CHART-08)

```text
/login                          🔵
/pacientes | /espacio/buscar-paciente   🟢 Censo canónico
/espacio/ficha                  🟢 Workspace principal
  ?patientId=
  &chartMode=traditional|paper
/espacio/ficha/imprimir         🟢 Print Carta/A5
/espacio/*                      🟢 Formularios (heredan shell + command bar)
/comando                        🟡 → redirect censo (MF-08)
/epis2/dashboard                🟡 congelado
?mode=classic                   🟡 → chartMode=traditional (MF-07)
/dev/chart-modes                🟢 preview dev
```

---

## Flujo mental del médico

```text
Busco paciente → entro a ficha → [Ficha Electrónica | Ficha Papel]
```

No más: Command Center · Modo Clásico · Dashboard como tres “modos visuales”.

---

## Search params canónicos

| Param | Valores | Uso |
|-------|---------|-----|
| `patientId` | UUID | Paciente activo |
| `chartMode` | `traditional` \| `paper` | Modo ficha |
| `section` | `cover` … `discharge` | Foco modo papel |
| `printFormat` | `letter` \| `a5` | Impresión (no A4) |
| `mode` | `classic` \| `dashboard` | **Legacy** |

Parser: `parseChartModeSearch()` · `parseClinicalPatientSearch()`

---

## Layout × ruta (objetivo MF-04+)

| Capa | Componente |
|------|------------|
| Header | `ClinicalInstitutionalHeader` |
| Banda | `PatientIdentityBand` |
| Acciones | `ClinicalActionBar` + `CommandPaletteOverlay` |
| Contenido | `TraditionalEhrLayout` \| `PaperChartLayout` |
| Footer | `ClinicalFooterStatus` |

Orquestador: `ClinicalShell`

---

## Referencias Figma Make

| Modo | Prototipo |
|------|-----------|
| Traditional | [Medical Record](https://www.figma.com/make/PhZ55jJhxLQUtIWEuf17ZO/Medical-Record) |
| Paper | [Ficha papel](https://www.figma.com/make/AJ9MNrSyClA0hh8jB8sx49/Crear-p%C3%A1ginas-de-ficha-m%C3%A9dica) |
