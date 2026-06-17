# CICA-L — 11 Auditoría

**ID:** CICA-L-11 · **Fecha:** 2026-06-11 · **Tramo:** PR-AEST-07

---

## Fase A — Inventario

| Campo | Valor |
|-------|-------|
| Ruta | `/espacio/ficha?chartMode=traditional` · tab **Más** → sección `navAudit` |
| Intención clínica | Revisar trazabilidad / eventos auditados del paciente (nivel 5 CICA) |
| Usuario principal | Médico demo · auditor |
| Acción primaria (meds) | **Medicamentos** → `/espacio/receta` |
| Acción primaria (audit) | **Auditoría** → `/espacio/admin?tab=audit` |
| Acciones secundarias | Modo papel · enlace quiet «Auditoría» desde tab Más |
| Estados visibles | Tabla demo trazabilidad · badge demo |
| Componentes actuales | `navAudit` bajo subnav Documentos · `TraditionalDemoSection` genérica |
| Problemas visuales | Auditoría enterrada en Documentos · sin sección CICA · sin acción contextual |

### Hallazgos

| Severidad | Descripción |
|-----------|-------------|
| UX-MAJOR | `navAudit` en tab Documentos contradice Screen Map §2 (debe vivir en Más) |
| UX-MAJOR | Sin `TraditionalAuditSection` ni cap filas CICA |
| UX-MINOR | Sin primaria hacia consola auditoría cuando se muestra trazabilidad |

---

## Fase B — Reducción de intención

```text
Intención única: leer trazabilidad demo del paciente
Acción primaria (vista audit): Auditoría → consola admin
Acceso desde Más: quiet «Auditoría» → sección navAudit (sin subnav)
Ocultar: navAudit en subnav Documentos
```

---

## Fase C — Wireframe textual (aprobado implementación)

```text
┌────────────────────────────────────────────────────────────┐
│ [Barra comando NL]                                          │
├────────────────────────────────────────────────────────────┤
│ Resumen | … | Documentos | Más                              │
├────────────────────────────────────────────────────────────┤
│ (tab Más — medicamentos por defecto)                        │
│                  [Medicamentos]  [Modo papel]  [Auditoría‣] │
├────────────────────────────────────────────────────────────┤
│ Tras quiet Auditoría — mismo tab Más, sección audit:        │
│ ┌─ Evento ───────────── Detalle ──────────────────────────┐ │
│ │ Último acceso         Médico demo · 2026-06-10 (demo)   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                  [Auditoría]  [Modo papel]                  │
└────────────────────────────────────────────────────────────┘
```

Máx. **5 filas**. Sin subnav. `data-cica-composition="classic"`.

---

## Fase E — Cambios aplicados

- `navAudit` movido de tab Documentos → tab **Más** (`classicChartTabConfig`)
- `TraditionalAuditSection` · CICA cap 5 · empty state · `data-cica-composition`
- `resolveCicaTabLayoutActions` — quiet audit-trail en Más · primaria consola en `navAudit`
- `DualChartPatientPage` — handlers `onOpenAuditSection` / `onOpenAuditConsole`
- `resolveIntentFromTraditionalSection('navAudit')` — nivel 5 · intent `audit`

---

## Fase F — CICA Screen Score

| Criterio | OK | Notas |
|----------|----|-------|
| Identidad paciente | ✓ | shell |
| Retorno seguro | ✓ | tabs |
| 1 acción primaria | ✓ | meds o audit según sección |
| Estado demo | ✓ | chips |
| ≤3 acciones visibles | ✓ | |
| Sin overflow horizontal | ✓ | E2E |
| ≤5 filas | ✓ | cap |
| Screen Map §2 | ✓ | audit en Más |

**Score:** 94/100 · **Veredicto:** GO (pendiente walkthrough humano)

---

## Fase G — Crítica

```text
¿Parece trazabilidad clínica clara sin mezclar documentos?
Humano: pendiente PR-AEST-07 signoff
```

---

## Próximo paso

```text
Cierre loop CICA-L — quality:cica-loop-close · PR-AEST-07 screenshots
CICA-SG scoring en código (post-loop)
MF-AEST-04 clinical-calm default
```
