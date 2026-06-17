# Auditoría — Integración Paper Clinical OS · Motor espejo

**Fecha:** 2026-06-11  
**Alcance:** Conciliar prompt maestro (mirror + PDF Bridge + expansion + quality) con canon EPIS2  
**Estado PROG-PAPER-MODE:** MF-00…05 **DONE** · MF-06 **READY**

---

## 1. Resumen ejecutivo

| Dimensión | Veredicto |
|-----------|-----------|
| Dirección producto (espejo clásico↔papel) | **ADOPTAR** — alineada ADR-002 |
| Implementación literal del prompt | **RECHAZAR** — viola `noParallelRoot`, duplicaría registries |
| Plan EPIS2 actual (PROG-PAPER-MODE) | **CORRECTO** — ejecutar MF-06…09 antes de mirror |
| Conciliación documentada | **DONE** — `docs/product/EPIS2_PAPER_MIRROR_RECONCILIATION.md` |

---

## 2. Matriz prompt ↔ EPIS2

| Concepto prompt | Estado EPIS2 | Acción |
|-----------------|--------------|--------|
| Motor dual espejo | **Parcial** — dual UI sí; sync no | PROG-PAPER-MIRROR post PM-09 |
| `ClinicalDocumentState` compartido | **Parcial** — solo `paper_chart` | Extender clinical-forms |
| `ClinicalFieldBinding` | **No** | packages/clinical-forms/mirror |
| IA fuera del papel | **GO** ✓ | PM-03, Ctrl+K |
| Firma bloquea IA | **GO** ✓ | PM-03, PM-05 |
| Read-only post-firma | **GO** ✓ | PM-05 API |
| Navigator I–VII | **GO** ✓ | PM-04 |
| Campos papel nativos | **GO** ✓ | PM-02 |
| Tokens marfil / grilla 6mm | **GO** ✓ | PM-01 |
| Toolbar save/sign/PDF | **GO** ✓ | PM-05 |
| Paginación N/M | **Pendiente** | PM-06 |
| Puente A5/Carta | **Pendiente** | PM-07 |
| Comandos IA paper | **Pendiente** | PM-08 |
| PaperQualityGate score | **Pendiente** | PM-09 |
| Paper Planner | **Pendiente** | PROG-PAPER-PLANNER |
| PdfBridge AcroForm/overlay | **No** | ADR-004 + intake extend |
| PaperExpansion automático | **No** | Manual P0 lista |
| `paper-mode/` greenfield | **Rechazado** ✓ | chart/paper/ |
| PaperCommandAgent | **Rechazado** ✓ | Command palette |
| PDF como SoT | **Rechazado** ✓ | Invariante #5 |

---

## 3. Brechas críticas (priorizadas)

### P0 — Percepción clínica (cerradas MF-01…05)

- ~~Campos MUI en documento~~ → PaperTextarea nativo
- ~~Sin metadatos IA~~ → PaperFieldState + canSign
- ~~Toolbar desconectado~~ → approve API + readOnly

### P1 — Flujo completo (activas)

| ID | Gap | MF |
|----|-----|-----|
| G-06 | Footer 1/7 estático | PM-06 |
| G-09 | Sin puente receta/epicrisis | PM-07 |
| G-10 | Comandos IA contextuales | PM-08 |
| G-11 | PaperVisualAudit | PM-09 |
| G-13 | C-4 prod flag | ops |

### P2 — Motor espejo (futuro)

| ID | Gap | Programa |
|----|-----|----------|
| M-01 | Sin sync classic→paper | PROG-PAPER-MIRROR |
| M-02 | Sin ClinicalFieldBinding | PROG-PAPER-MIRROR |
| M-03 | Sin PdfTemplateProfile | ADR-004 PDF-01 |
| M-04 | Sin modo split debug | MIRROR-02 dev |

---

## 4. Mejoras aplicadas a documentación

| Archivo | Cambio |
|---------|--------|
| `docs/product/EPIS2_PAPER_MIRROR_RECONCILIATION.md` | **Nuevo** — conciliación canónica |
| `docs/adr/ADR-004-paper-mirror-expansion-proposed.md` | **Nuevo** — propuesta mirror |
| `reports/dev-agent-prompt-paper-mode.md` | Actualizado — § motor espejo |
| `docs/product/EPIS2_PAPER_MODE_DEV_PLAN.md` | §13 fase 2 mirror |

---

## 5. Prompt maestro conciliado (extracto)

Usar en Cursor **después** de MF-PAPER-06 o en paralelo MF-PAPER-08 (paths disjuntos):

```text
Arquitecto EPIS2 — extender modo papel bajo components/chart/paper/ y clinical-forms.
NO crear apps/web/src/paper-mode/.
Objetivo fase actual: MF-PAPER-06 paginación | MF-PAPER-08 comandos IA.
Motor espejo (ClinicalMirrorEngine, PdfBridge): solo tras PM-09 — ver EPIS2_PAPER_MIRROR_RECONCILIATION.md.
Reglas: un Form Registry · PostgreSQL SoT · IA no firma · PDF salida/plantilla · Carta default.
Gates: npm run quality:paper-mode-next · npm run check · sin commit salvo instrucción.
```

Prompt completo: `@reports/dev-agent-prompt-paper-mode.md`

---

## 6. Riesgos residuales

| Riesgo | Severidad | Nota |
|--------|-----------|------|
| Implementar mirror antes de PM-09 | Alta | Duplicación validaciones |
| Prompt externo sin conciliación | Alta | Reintroduce paper-mode/ |
| classic vs paper datos distintos | Media | Esperado hasta MIRROR-01 |
| documentIntake demo-only | Media | PDF Bridge requiere hardening |

---

## 7. Próximo paso

```bash
npm run quality:paper-mode-next   # MF-PAPER-06
npm run dev:session
# Adjuntar: dev-agent-brief + dev-agent-prompt-paper-mode.md
```

**Recomendación:** MF-PAPER-06 (paginación) antes de abrir PROG-PAPER-MIRROR; MF-PAPER-08 en paralelo si hay capacidad (command-registry).

---

*Auditoría sin commit. Gates MF-04/05 verificados en sesión previa.*
