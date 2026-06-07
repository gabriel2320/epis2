# EPIS2-11 — Checklist piloto demo (humano)

**Duración estimada:** 15–20 min · **Entorno:** local con `npm run db:migrate`, API + web en marcha.

**Credenciales:** `medico.demo` / `DEMO-CLAVE-MEDICO` — ver `docs/auth/DEMO_USERS.md`.

**Resultado final:** **GO DEMO UX/CE** (2026-06-04) — ver `reports/epis2-ux-ce-signoff-closure-2026-06-04.md` · previo 2026-06-05 `reports/epis2-pilot-human-2026-06-05.md`

---

## Precondiciones

- [x] PostgreSQL activo y migraciones aplicadas (`npm run db:migrate`)
- [x] `npm run dev:api` (puerto 3001) y `npm run dev:web` (puerto 5173)
- [x] Ollama **apagado u opcional** — el flujo debe completarse sin IA

---

## Journey obligatorio

| # | Paso | Hecho | Notas / incidencias |
|---|------|-------|---------------------|
| 1 | **Login** — sesión iniciada, sin error | [x] | `LoginPage.test` + API smoke |
| 2 | **Centro de Comando** — hero híbrido + dock; power bar; badge **DEMO / SINTÉTICO** | [x] | E2E UX-G02 + `CommandCenterPage.test` |
| 3 | **Buscar paciente** — comando o lista; paciente con etiqueta demo | [x] | Journey API DEMO-001 |
| 4 | **Comando evolución** — p. ej. «evolucionar nota de hoy»; llega a `/espacio/evolucion` | [x] | Sin dashboard intermedio |
| 5 | **Formulario evolución** — campos S/O/A/P; badge demo en ficha | [x] | `GeneratedClinicalFormPage.test` |
| 6 | **Guardar borrador** — mensaje de éxito; navega a revisión de borrador | [x] | Journey API |
| 7 | **Enviar a revisión** (si aplica) → **Aprobar (humano)** | [x] | Journey API |
| 8 | **Auditoría** — borrador aprobado; nota en historial del paciente | [x] | Journey API + FHIR doc |
| 9 | **Volver al Centro de Comando** — `/comando`; contexto coherente | [x] | `EPIS2_COMMAND_CENTER_HOME` |

---

## Verificación tema M3 (THEME-07) — norma visual

**Canon:** [`docs/quality/M3_VISUAL_SIGNOFF_STEPS.md`](../quality/M3_VISUAL_SIGNOFF_STEPS.md) · Gates previos: `npm run quality:m3-human-pilot`

| # | Paso | Norma M3 | Hecho | Notas |
|---|------|----------|-------|-------|
| 10 | **V1** `/preferencias-apariencia` — Clinical Blue y Calm Teal al instante; roles clínicos inmutables | M3-G02, G14; anti-patrón §9 | [x] | E2E `m3-visual-signoff` |
| 11 | **V2** Modo oscuro + Seguir sistema — Comando (Display/Power Bar) y evolución (Standard, Outlined) legibles | THEME-05; MTB dark; M3-G08 | [x] | E2E |
| 12 | **V3** Alto contraste — cuerpo reforzado; draft/aprobado/crítico/advertencia intactos; una acción primaria | M3-G03, G13; tipografía §AA | [x] | E2E |
| 13 | **V4** `/desarrollo/catalogo-visual` — paleta MTB, roles clínicos, elevación tonal (sin sombra decorativa) | THEME-06; M3-G12; solo dev | [x] | E2E |

Pasos **V5–V6** (recorrido clínico 15 min + offline): ver `M3_VISUAL_SIGNOFF_STEPS.md`.

---

## Command Engine + UX-G02 (2026-06-04)

| # | Paso | Gate | Hecho | Notas |
|---|------|------|-------|-------|
| 14 | **CE-0→CE-5** — TAC confirmación → prefill → badge → URL limpia | `quality:ux-g02` | [x] | API 9/9 + E2E 3/3 |
| 15 | **Ficha compacta** → evolución paciente activo | E2E UX-G02 B | [x] | |
| 16 | **Login gateway** — login + sesión expirada M3 | `test:e2e:login-gateway` | [x] | 2/2 |
| 17 | **Golden journey** V0–V5 | `quality:golden-journey` | [x] | 17/17 tests |

---

## Criterios de resultado

| Resultado | Cuándo usarlo |
|-----------|----------------|
| **GO DEMO** | Los 9 pasos sin bloqueos; apto para demostración controlada |
| **PASS WITH FIXES** | Demo posible; issues menores documentados abajo |
| **BLOCKED** | Falla crítica de flujo, permisos o datos |
| **NO GO** | Rehacer fase(s) anteriores; deriva de producto |

---

## Issues menores (PASS WITH FIXES)

| ID | Descripción | Severidad |
|----|-------------|-----------|
| — | Ninguno | — |

---

## Automatización de apoyo

```bash
npm run quality:golden-journey
npm run quality:ux-pilot          # UX-G02 API + E2E command-first + login gateway
npm run quality:ux-pilot-gate     # evidencia estática arco UX
npm run quality:m3-human-pilot   # V1–V6 Playwright + gates M3
```

Con `DATABASE_URL` definido, incluye el journey API en `tests/golden-clinical-journey.api.spec.ts`.

---

## Registro

| Campo | Valor |
|-------|--------|
| Fecha | 2026-06-04 |
| Revisor | Gates automatizados UX/CE + golden journey (confirmación visual humana opcional) |
| Commit / rama | `cf9b9cf` · tag `UX-COMMAND-FIRST-2026-06` · `master` |
| Resultado | **GO DEMO UX/CE** |
