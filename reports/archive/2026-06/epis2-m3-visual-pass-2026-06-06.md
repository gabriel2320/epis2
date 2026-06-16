# EPIS2 — Pasada visual M3 (2026-06-06)

**Commit:** `8a865bf` · **Script:** `npm run quality:m3-visual-pass`  
**Norma:** `docs/quality/M3_VISUAL_SIGNOFF_STEPS.md`

---

## Registro de signoff visual

| Campo | Valor |
|-------|--------|
| Revisor | Sesión automatizada + captura Playwright |
| Fecha | 2026-06-06 |
| Entorno | local · PostgreSQL 5433 · API 3001 · Web 5173 |
| V1–V6 | **PASS** (evidencia capturada) |
| Resultado | **GO DEMO M3** |

---

## Evidencia por paso

| Paso | Verificación M3 | Resultado | Captura |
|------|-----------------|-----------|---------|
| V1 | Clinical Blue — preferencias instantáneas | PASS | `m3-visual-evidence/2026-06-06/v1-preferencias-clinical-blue.png` |
| V1 | Calm Teal — acento ~10%, roles clínicos intactos | PASS | `m3-visual-evidence/2026-06-06/v1-preferencias-calm-teal.png` |
| V1 | Comando tras cambio de paleta | PASS | `m3-visual-evidence/2026-06-06/v1-comando-tras-paleta.png` |
| V2 | Preferencias modo oscuro | PASS | `m3-visual-evidence/2026-06-06/v2-preferencias-modo-oscuro.png` |
| V2 | Centro de Comando — MTB dark | PASS | `m3-visual-evidence/2026-06-06/v2-comando-modo-oscuro.png` |
| V2 | Formulario evolución Standard + Outlined | PASS | `m3-visual-evidence/2026-06-06/v2-evolucion-modo-oscuro.png` |
| V3 | Alto contraste activado | PASS | `m3-visual-evidence/2026-06-06/v3-preferencias-alto-contraste.png` |
| V3 | Revisión borrador — aprobación humana visible | PASS | `m3-visual-evidence/2026-06-06/v3-borrador-alto-contraste.png` |
| V4 | Catálogo visual dev — roles clínicos + widgets | PASS | `m3-visual-evidence/2026-06-06/v4-catalogo-visual-dev.png` |
| V5 | Login UI → Centro de Comando | PASS | `m3-visual-evidence/2026-06-06/v5-comando-tras-login.png` |
| V5 | Formulario evolución two-pane | PASS | `m3-visual-evidence/2026-06-06/v5-evolucion-formulario.png` |
| V5 | EpisApprovalGate — sin auto-aprobación | PASS | `m3-visual-evidence/2026-06-06/v5-borrador-aprobacion-humana.png` |
| V5 | Mensaje éxito post-aprobación | PASS | `m3-visual-evidence/2026-06-06/v5-nota-aprobada.png` |
| V5 | Retorno al Centro de Comando | PASS | `m3-visual-evidence/2026-06-06/v5-retorno-comando.png` |
| V6 | Banner offline en shell clínico | PASS | `m3-visual-evidence/2026-06-06/v6-banner-offline.png` |
| V6 | prefers-reduced-motion — formulario estable | PASS | `m3-visual-evidence/2026-06-06/v6-reduced-motion.png` |

Abrir capturas localmente: `reports/m3-visual-evidence/2026-06-06/`

---

## Criterios M3 verificados

- **V1:** MTB Clinical Blue / Calm Teal al instante; sin botón Guardar
- **V2:** Modo oscuro legible en Comando (Display/Power Bar) y evolución Standard
- **V3:** Alto contraste; borrador + gate de aprobación humana
- **V4:** Catálogo dev; roles clínicos separados del acento de marca
- **V5:** Cadena Login → Comando → Evolución → Aprobación → retorno
- **V6:** Banner offline; reduced motion sin romper formulario

---

## Gates previos

```bash
npm run quality:m3-signoff      # OK en misma sesión recomendada
npm run quality:m3-human-pilot  # E2E assertions V1–V6
```

---

## Próximo paso

Impresión clínica Chile — `docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md`
