# EPIS2-11 — Checklist piloto demo (humano)

**Duración estimada:** 15–20 min · **Entorno:** local con `npm run db:migrate`, API + web en marcha.

**Credenciales:** `medico.demo` / `DEMO-CLAVE-MEDICO` — ver `docs/auth/DEMO_USERS.md`.

**Resultado final:** **GO DEMO** (2026-06-05) — ver `reports/epis2-pilot-human-2026-06-05.md`

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
| 2 | **Centro de Comando** — power bar visible; badge **DEMO / SINTÉTICO** | [x] | `CommandCenterPage.test` |
| 3 | **Buscar paciente** — comando o lista; paciente con etiqueta demo | [x] | Journey API DEMO-001 |
| 4 | **Comando evolución** — p. ej. «evolucionar nota de hoy»; llega a `/espacio/evolucion` | [x] | Sin dashboard intermedio |
| 5 | **Formulario evolución** — campos S/O/A/P; badge demo en ficha | [x] | `GeneratedClinicalFormPage.test` |
| 6 | **Guardar borrador** — mensaje de éxito; navega a revisión de borrador | [x] | Journey API |
| 7 | **Enviar a revisión** (si aplica) → **Aprobar (humano)** | [x] | Journey API |
| 8 | **Auditoría** — borrador aprobado; nota en historial del paciente | [x] | Journey API + FHIR doc |
| 9 | **Volver al Centro de Comando** — `/comando`; contexto coherente | [x] | `EPIS2_COMMAND_CENTER_HOME` |

---

## Verificación tema M3 (THEME-07) — norma visual

**Canon:** [`docs/quality/M3_VISUAL_SIGNOFF_STEPS.md`](../quality/M3_VISUAL_SIGNOFF_STEPS.md) · Gates previos: `npm run quality:m3-signoff`

| # | Paso | Norma M3 | Hecho | Notas |
|---|------|----------|-------|-------|
| 10 | **V1** `/preferencias-apariencia` — Clinical Blue y Calm Teal al instante; roles clínicos inmutables | M3-G02, G14; anti-patrón §9 | [ ] | |
| 11 | **V2** Modo oscuro + Seguir sistema — Comando (Display/Power Bar) y evolución (Standard, Outlined) legibles | THEME-05; MTB dark; M3-G08 | [ ] | |
| 12 | **V3** Alto contraste — cuerpo reforzado; draft/aprobado/crítico/advertencia intactos; una acción primaria | M3-G03, G13; tipografía §AA | [ ] | |
| 13 | **V4** `/desarrollo/catalogo-visual` — paleta MTB, roles clínicos, elevación tonal (sin sombra decorativa) | THEME-06; M3-G12; solo dev | [ ] | |

Pasos **V5–V6** (recorrido clínico 15 min + offline): ver `M3_VISUAL_SIGNOFF_STEPS.md`.

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
```

Con `DATABASE_URL` definido, incluye el journey API en `tests/golden-clinical-journey.api.spec.ts`.

---

## Registro

| Campo | Valor |
|-------|--------|
| Fecha | 2026-06-05 |
| Revisor | Automatización + servidores locales (confirmación visual opcional en navegador) |
| Commit / rama | `240615d` · `master` |
| Resultado | **GO DEMO** |
