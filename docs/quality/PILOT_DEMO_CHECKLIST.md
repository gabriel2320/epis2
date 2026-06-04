# EPIS2-11 — Checklist piloto demo (humano)

**Duración estimada:** 15–20 min · **Entorno:** local con `npm run db:migrate`, API + web en marcha.

**Credenciales:** `medico.demo` / `DEMO-CLAVE-MEDICO` — ver `docs/auth/DEMO_USERS.md`.

**Resultado final:** **GO DEMO** (automatización API 2026-06-04) — confirmar pasos UI en navegador.

---

## Precondiciones

- [ ] PostgreSQL activo y migraciones aplicadas (`npm run db:migrate`)
- [ ] `npm run dev:api` (puerto 3001) y `npm run dev:web` (puerto 5173)
- [ ] Ollama **apagado u opcional** — el flujo debe completarse sin IA

---

## Journey obligatorio

| # | Paso | Hecho | Notas / incidencias |
|---|------|-------|---------------------|
| 1 | **Login** — sesión iniciada, sin error | [ ] | |
| 2 | **Centro de Comando** — power bar visible; badge **DEMO / SINTÉTICO** | [ ] | |
| 3 | **Buscar paciente** — comando o lista; paciente con etiqueta demo | [ ] | Ej.: DEMO-001 Carmen Soto |
| 4 | **Comando evolución** — p. ej. «evolucionar nota de hoy»; llega a `/espacio/evolucion` | [ ] | Sin dashboard intermedio |
| 5 | **Formulario evolución** — campos S/O/A/P; badge demo en ficha | [ ] | |
| 6 | **Guardar borrador** — mensaje de éxito; navega a revisión de borrador | [ ] | Estado ≠ nota final aprobada |
| 7 | **Enviar a revisión** (si aplica) → **Aprobar (humano)** | [ ] | Solo usuario con permiso |
| 8 | **Auditoría** — borrador aprobado; nota en historial del paciente | [ ] | |
| 9 | **Volver al Centro de Comando** — `/comando`; contexto coherente | [ ] | |

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
| | | baja / media |

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
| Fecha | 2026-06-04 |
| Revisor | Piloto automatizado + pendiente confirmación UI |
| Commit / rama | `master` (post EPIS2-11) |
| Resultado | **GO DEMO** (API) |
