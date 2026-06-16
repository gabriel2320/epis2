# EPIS2 — Checklist revisión legal (MF-LEG-01)

**Versión:** 1.0 · **Programa:** PROG-POST-RC3 Tramo 3 · **Tag base:** `v0.1-demo-rc3`  
**Alcance:** documentación raíz — **no** código clínico · **no** auto-merge IA en MF-LEG-02

> Completar por **operador / asesoría legal** antes de publicar ampliamente o promover demo fuera del equipo de desarrollo.

---

## 1. Documentos en alcance

| Archivo | Versión actual | Objetivo revisión |
|---------|----------------|-------------------|
| [`DISCLAIMER.md`](../../DISCLAIMER.md) | 1.0 | MF-LEG-02 → v1.1 con fecha |
| [`SECURITY.md`](../../SECURITY.md) | — | Contacto reporte · alcance demo |
| [`LICENSE`](../../LICENSE) | MIT 2026 | Política institucional vs MIT |
| [`CONTRIBUTING.md`](../../CONTRIBUTING.md) | — | Coherencia con DISCLAIMER |

Referencias: [`reports/epis2-mf-con-10-legal.md`](../../reports/epis2-mf-con-10-legal.md) · [`CONSOLIDATION_FREEZE.md`](../CONSOLIDATION_FREEZE.md)

---

## 2. Checklist — contenido DISCLAIMER

| # | Ítem | OK | Notas |
|---|------|----|-------|
| L-01 | Declara explícitamente **no dispositivo médico / no HIS** | ☐ | |
| L-02 | Prohíbe **PHI real** y uso clínico en producción | ☐ | |
| L-03 | IA = borrador; **aprobación humana** obligatoria | ☐ | Alineado invariantes producto |
| L-04 | Entornos staging/prod = fail-closed; demo ≠ clínica real | ☐ | |
| L-05 | Sin garantía / «as is» coherente con LICENSE MIT | ☐ | |
| L-06 | Idioma ES claro para operadores CL (opcional EN summary) | ☐ | |
| L-07 | Fecha revisión y responsable en pie (v1.1) | ☐ | MF-LEG-02 |

---

## 3. Checklist — SECURITY + LICENSE

| # | Ítem | OK | Notas |
|---|------|----|-------|
| S-01 | Canal de reporte vulnerabilidades definido (no issue público) | ☐ | |
| S-02 | Contacto mantenedor actualizado si repo público | ☐ | |
| S-03 | Alcance in/out of scope coherente con stack demo | ☐ | |
| S-04 | MIT aceptable para distribución prevista | ☐ | |
| S-05 | Copyright holder correcto (institución vs contributors) | ☐ | |

---

## 4. Checklist — uso previsto

| # | Ítem | OK | Notas |
|---|------|----|-------|
| U-01 | Uso **solo demo / piloto sintético** documentado en README | ☐ | |
| U-02 | No marketing como producto clínico certificado | ☐ | |
| U-03 | Capturas / demos sin datos reales | ☐ | |
| U-04 | Dependencias third-party — atribución suficiente (LICENSE raíz) | ☐ | |

---

## 5. Sign-off humano (obligatorio para MF-LEG-02)

| Campo | Valor |
|-------|-------|
| Revisor | _nombre / rol_ |
| Fecha | _YYYY-MM-DD_ |
| Veredicto | ☐ Aprobado para v1.1 · ☐ Aprobado con cambios · ☐ Rechazado |
| Cambios requeridos | _lista breve_ |
| PR / commit MF-LEG-02 | _enlace tras merge_ |

**Regla:** MF-LEG-02 (`DISCLAIMER.md` v1.1) solo tras fila «Aprobado» o «Aprobado con cambios» completada.

---

## 6. Gate técnico (agente / CI)

```bash
npm run quality:legal-disclaimer-gate   # MF-LEG-01 — checklist + archivos raíz
npm run quality:fast                    # docs MF-LEG-02
```

MF-LEG-02 gate adicional: comentario humano en PR · **prohibido** merge automático por IA.
