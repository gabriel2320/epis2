# EPIS2 — Documentación norma impresión clínica Chile

**Fecha:** 2026-06-07  
**Alcance:** Solo documentación y planificación — sin código.

---

## Entregables

| Artefacto | Acción |
|-----------|--------|
| `docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md` | **Creado** — norma canónica v1.0.0 (28 secciones + mapeo blueprint §29) |
| `docs/design/EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md` | Puntero frontera pantalla vs impresión |
| `docs/design/EPIS2_UI_ARCHITECTURE.md` | Principio 8 + primitivas `Print*` |
| `docs/clinical/BLUEPRINT_CONTRACT.md` | Paso 8 — formato imprimible por blueprint |
| `reports/archive/2026-06/epis2-master-plan-mf1-51-m3.md` | §11 frontera PRINT-00…09 |

---

## Contenido de la norma

- Formatos autorizados: **Carta** y **A5** únicamente (prohibido A4, oficio, captura de pantalla).
- Familias: longitudinal, operacional, transaccional, regulado externo.
- M3 pantalla vs documento plano en impresión.
- Convenciones Chile: español, fecha/hora, RUT, unidades.
- Estados documentales, firmas, IA, paginación, privacidad.
- Contrato técnico TypeScript y tokens CSS `@page`.
- Componentes canónicos objetivo en `@epis2/epis2-ui`.
- Checklist humano y definición de completado (15 criterios).

---

## Plan PRINT (no en ledger MF)

Secuencia propuesta PRINT-00…09 documentada en `reports/archive/2026-06/epis2-master-plan-mf1-51-m3.md` §11.

**PRINT-00 cerrado** (esta sesión). Implementación diferida; no bloquea MF-35 pantalla.

---

## Gates

| Gate | Estado |
|------|--------|
| Contradicción `PRODUCT_INVARIANTS.md` | Ninguna — norma refuerza borrador/IA/aprobación humana |
| `architecture:validate` | No requerido (solo docs) |
| Código productivo | Sin cambios |

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Confundir M3 pantalla con print | Norma §4 + puntero en M3 experience |
| Implementar print antes de primitivas | Secuencia PRINT-01…03 antes de vistas por blueprint |
| A4 por hábito LATAM | Gate explícito §2 y §23 |

---

## Próximo paso

1. Commit documentación si el usuario lo solicita.
2. MF-35 conciliación (pantalla) independiente de PRINT-04+.
3. Cuando se abra impresión: PRINT-01 tokens + PRINT-02 primitivas.
