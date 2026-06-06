# EPIS2 — Glosario IDC (tipos semánticos)

**Versión:** 1.0 · **Fecha:** 2026-06-07  
**Canon:** [`EPIS2_WAVE_EXECUTION_CANON.md`](./EPIS2_WAVE_EXECUTION_CANON.md) · [`EPIS2_IDC_EXECUTION_MATRIX.md`](./EPIS2_IDC_EXECUTION_MATRIX.md)

> Un número IDC **no** designa siempre una pantalla única. Este glosario evita promociones ambiguas a `Done`.

---

## Tipos de IDC

| Tipo | Definición | Ejemplo | Evidencia para `Done` |
|------|------------|---------|------------------------|
| **Superficie** | Ruta o tab visible en navegación | `/espacio/resultados`, dashboard tab | Ruta + M3-UI + journey |
| **Capacidad** | Función transversal | Bandeja resultados, CDS | API + UI + permisos |
| **Formulario / blueprint** | Documento clínico estructurado | `outpatient_visit`, `prescription` | Registry + persistencia + firma |
| **Journey** | Secuencia extremo a extremo | Golden ambulatorio | E2E + auditoría |
| **Integración** | Sistema externo | PACS, HL7 | Contrato + ops + fallback |

**Regla:** un blueprint puede **cubrir parcialmente** varios IDC; un IDC de **superficie** puede requerir varios blueprints.

---

## IDC 41 — resolución canónica (tensión UCI vs ingreso)

| Significado | IDC inventario | Implementación EPIS2 | Estado matriz |
|-------------|----------------|----------------------|---------------|
| **Dashboard monitorización UCI** | IDC **41** (bloque 41–50) | No implementado — Ola 13 | `Planned` / `Defer` |
| **Ingreso hospitalario clínico** | Relacionado operacionalmente | Blueprint `admission_note` → `/espacio/ingreso` | IDC **41** en árbol = **error de mapeo** |

**Decisión (2026-06-07):**

1. **IDC 41** permanece reservado al **dashboard UCI** del inventario original.
2. El ingreso clínico se rastrea como **blueprint `admission_note`** mapeado a **IDC de hospitalización** (ingreso clínico), no al 41.
3. Actualizar `BLUEPRINT_IDC_MAP` en `epis2NavigationTree.ts`: `admission_note` → IDC **ingreso clínico** (referencia operacional 41–50 bloque hospitalización, nota «≠ IDC 41 dashboard»).

No promover IDC **41** a `Done` hasta existir tablero UCI (Ola 13).

---

## Promoción Ola 2 (MF-OLA2-001)

| IDC | Tipo | Evidencia | Estado |
|-----|------|-----------|--------|
| 31 Anamnesis | Formulario | `outpatient_visit` + tests Ola2 | **Done** |
| 32 Signos vitales | Formulario | Sección vitals + scrollspy | **Done** |
| 33 Examen general | Formulario | Accordion — plantillas MISSING | **Active** |
| 34 Examen segmentario | Formulario | Accordion — plantillas MISSING | **Active** |
| 35 CIE-10 | Capacidad | Select demo | **Active** |
| 36 Indicaciones | Formulario | Plan + generalIndications | **Done** |
| 37 SOAP | Formulario | `evolution_note` | **Done** (Ola 1) |
| 38 Macros | Capacidad | Context insert partial | **Active** |
| 39 Cierre episodio | Formulario | `closeEncounter` + FAB | **Done** |
| 40 Resumen paciente | Formulario + print | Certificado + resumen campo — **print A5 signoff pending** | **Active** |

---

## Referencias

- Árbol reconciliado: `docs/architecture/EPIS2_RECONCILED_NAVIGATION_TREE.md`
- Gate M3-UI: `docs/design/EPIS2_CLINICAL_MATERIAL3_CONCILIATION.md` §11
- Reporte MF: `reports/epis2-mf-ola2-001-m3-ui-gate.md`
