# EPIS2 — Quality gates por fase

Gates **automáticos** y **humanos**. Un gate fallido detiene la siguiente fase.

---

## Gates globales (todas las fases)

| ID | Criterio |
|----|----------|
| G-01 | Sin dependencias OpenMRS / Carbon en `package.json` |
| G-02 | Sin pacientes reales ni PHI en repo |
| G-03 | Texto clínico visible en español |
| G-04 | IA no escribe en tablas clínicas aprobadas |
| G-05 | Una microfase por PR/sesión salvo corrección de la misma |
| G-06 | Reporte en `reports/epis2-NN-*.md` |

---

## EPIS2-00

| Gate | Criterio |
|------|----------|
| 00-A | Existe canon no contradictorio |
| 00-B | MVP limitado en `SCOPE_V1.md` |
| 00-C | `LEGACY_DONOR_MAP` con MIGRATE/REWRITE/REFERENCE/REJECT |
| 00-D | OpenMRS/O3/Carbon en REJECT |
| 00-E | Sin `package.json` ni código en `apps/` |
| 00-F | Reglas Cursor presentes |

---

## EPIS2-01

```bash
npm run check
npm run test
npm run db:validate
```

---

## EPIS2-02 (humano)

- ¿Se entiende en 3 segundos qué hacer?
- ¿Parece EPIS2 (no dashboard ni OpenMRS)?
- ¿Hay una sola acción principal?
- ¿Power bar es el foco en home?

---

## EPIS2-03

- Cada acción API tiene permiso nombrado.
- Rutas sin auth redirigen a login.
- `audit_events` registra login/logout fallido.

---

## EPIS2-04

- INSERT/UPDATE clínico incluye `created_by` / `updated_by`.
- `clinical_notes` aprobadas tienen `clinical_note_versions`.
- Query de notas finales excluye `clinical_drafts` no aprobados.

---

## EPIS2-05

- ≥100 frases en suite estática de comandos.
- Comando ambiguo → estado `needs_clarification`.
- Comando sin permiso → HTTP 403 + mensaje ES.
- Comando sin paciente cuando requerido → pide paciente.

---

## EPIS2-06

- Un blueprint por `blueprintId`.
- `intentIds` en blueprint ⊆ registry.
- Render sin llamada IA pasa test E2E básico.

---

## EPIS2-07

- Con Ollama detenido: flujo manual completo en test.
- Respuesta IA inválida → rechazada, no persiste.
- `ai_runs` guarda prompt hash / modelo / latencia.

---

## EPIS2-08

- Transición a `approved` solo vía endpoint con permiso.
- Test: IA devuelve "aprobar" → ignorado.
- `draft_versions` incrementa en cada save.

---

## EPIS2-09

- Seed marca `is_synthetic = true`.
- UI: badge DEMO visible en ficha.

---

## EPIS2-10

- Export FHIR valida contra perfil mínimo documentado.
- Sin campos UI-only en recurso FHIR.

---

## EPIS2-11 (humano — piloto)

| Resultado | Significado |
|-----------|-------------|
| GO DEMO | Listo para demostración controlada |
| PASS WITH FIXES | Demo posible con issues menores documentados |
| BLOCKED | Falla crítica de flujo o seguridad |
| NO GO | Repetir fase(s) anteriores |

Checklist obligatorio: ver `ROADMAP.md` EPIS2-11.

---

## Criterio de parada (anti-deriva)

Si antes de EPIS2-11 aparecen: dashboards extensos, menús hospitalarios, módulos no listados en `SCOPE_V1.md`, o integración OpenMRS — **detener desarrollo** y revisar alcance con `PRODUCT_CANON.md`.
