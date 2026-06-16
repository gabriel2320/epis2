# EPIS2 — Checklist revisión legal (MF-LEG-01 / MF-LEG-02)

**Versión:** 1.1 · **Programa:** PROG-POST-RC3 Tramo 3 · **Tag base:** `v0.1-demo-rc3`  
**Alcance:** documentación raíz — **no** código clínico

> MF-LEG-02 cerrado con sign-off humano 2026-06-11.

---

## 1. Documentos en alcance

| Archivo | Versión actual | Objetivo revisión |
|---------|----------------|-------------------|
| [`DISCLAIMER.md`](../../DISCLAIMER.md) | **1.1** ✓ | MF-LEG-02 — fecha y revisor |
| [`SECURITY.md`](../../SECURITY.md) | — | Contacto reporte · alcance demo |
| [`LICENSE`](../../LICENSE) | MIT 2026 | Política institucional vs MIT |
| [`CONTRIBUTING.md`](../../CONTRIBUTING.md) | — | Coherencia con DISCLAIMER |

Referencias: [`reports/epis2-mf-con-10-legal.md`](../../reports/epis2-mf-con-10-legal.md) · [`CONSOLIDATION_FREEZE.md`](../CONSOLIDATION_FREEZE.md)

---

## 2. Checklist — contenido DISCLAIMER

| # | Ítem | OK | Notas |
|---|------|----|-------|
| L-01 | Declara explícitamente **no dispositivo médico / no HIS** | ☑ | § «No es un dispositivo médico» |
| L-02 | Prohíbe **PHI real** y uso clínico en producción | ☑ | § «Datos sintéticos únicamente» |
| L-03 | IA = borrador; **aprobación humana** obligatoria | ☑ | Alineado invariantes producto |
| L-04 | Entornos staging/prod = fail-closed; demo ≠ clínica real | ☑ | § «Entornos desplegados» |
| L-05 | Sin garantía / «as is» coherente con LICENSE MIT | ☑ | § «Sin garantía» |
| L-06 | Idioma ES claro para operadores CL (opcional EN summary) | ☑ | ES principal |
| L-07 | Fecha revisión y responsable en pie (v1.1) | ☑ | MF-LEG-02 · 2026-06-11 |

---

## 3. Checklist — SECURITY + LICENSE

| # | Ítem | OK | Notas |
|---|------|----|-------|
| S-01 | Canal de reporte vulnerabilidades definido (no issue público) | ☑ | SECURITY.md § Reporting |
| S-02 | Contacto mantenedor actualizado si repo público | ☑ | Perfil GitHub repo |
| S-03 | Alcance in/out of scope coherente con stack demo | ☑ | Tabla scope notes |
| S-04 | MIT aceptable para distribución prevista | ☑ | LICENSE MIT 2026 |
| S-05 | Copyright holder correcto (institución vs contributors) | ☑ | MIT header |

---

## 4. Checklist — uso previsto

| # | Ítem | OK | Notas |
|---|------|----|-------|
| U-01 | Uso **solo demo / piloto sintético** documentado en README | ☑ | README + DISCLAIMER |
| U-02 | No marketing como producto clínico certificado | ☑ | DISCLAIMER § no HIS |
| U-03 | Capturas / demos sin datos reales | ☑ | Política PHI |
| U-04 | Dependencias third-party — atribución suficiente (LICENSE raíz) | ☑ | MIT + deps propias |

---

## 5. Sign-off humano (MF-LEG-02)

| Campo | Valor |
|-------|-------|
| Revisor | Operador producto EPIS2 |
| Fecha | 2026-06-11 |
| Veredicto | ☑ Aprobado para v1.1 · ☐ Aprobado con cambios · ☐ Rechazado |
| Cambios requeridos | _ninguno_ |
| PR / commit MF-LEG-02 | commit MF-LEG-02 · `reports/epis2-prog-legal-disclaimer-tramo3-close.md` |

---

## 6. Gate técnico (agente / CI)

```bash
npm run quality:legal-disclaimer-gate   # MF-LEG-01 + MF-LEG-02 — checklist + DISCLAIMER v1.1
npm run quality:fast
```
