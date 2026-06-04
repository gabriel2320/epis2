# EPIS2 — Principios de seguridad clínica

**Estado:** Vinculante desde EPIS2-00

---

## Jerarquía de confianza

```text
1. Profesional humano autorizado (aprobación)
2. Datos clínicos aprobados en PostgreSQL
3. Borradores en revisión (clinical_drafts)
4. Sugerencias IA (ai_runs) — nunca SoT
```

---

## Reglas de IA

| Permitido | Prohibido |
|-----------|-----------|
| Clasificar intent y slots | Aprobar o firmar |
| Resumir datos **ya presentes** | Inventar antecedentes, alergias, diagnósticos |
| Proponer texto de borrador | Escribir en tablas de notas aprobadas |
| Señalar datos faltantes | Ejecutar SQL o llamadas destructivas |
| Devolver JSON con schema + fuentes | Ocultar incertidumbre cuando falta evidencia |

Toda salida IA:

- valida contra schema compartido (`packages/contracts`);
- registra en `ai_runs` (entrada, salida, modelo, timestamp);
- incluye `confidence` / `missingFields` cuando aplique.

---

## Ciclo de borrador y aprobación

Estados:

```text
draft → editing → ready_for_review → approved | rejected | cancelled
```

| Regla | Detalle |
|-------|---------|
| Sin auto-aprobación | Ningún job ni IA puede pasar a `approved` |
| Versionado | Cada edición → `draft_versions` |
| Separación | Borradores no aparecen como notas finales |
| Rol | Solo roles con permiso `*.approve` aprueban |
| Auditoría | `approvals` + `audit_events` en cada transición crítica |

---

## Autenticación y permisos

- Permiso **explícito** por acción (`patient.read`, `note.evolution.write`, `draft.approve`, …).
- Sin `*` ni permisos ambiguos tipo `admin.*` sin lista.
- Demo: usuarios sintéticos; **no registrar contraseñas reales** en seeds commitados.
- Antes de PHI real: revisión de seguridad por especialista (no solo IA).

---

## Datos y demo

- Etiqueta **DEMO/SINTÉTICO** en UI para pacientes de prueba.
- Prohibido importar dumps hospitalarios reales en repositorio o seeds.
- Identificadores ficticios claramente no-RUT reales.

---

## Degradación segura

| Fallo | Comportamiento esperado |
|-------|-------------------------|
| Ollama caído | Comandos y formularios manuales operativos |
| Intent ambiguo | Bloquear y pedir clarificación |
| Intent no autorizado | Bloquear con mensaje en español |
| Validación fallida | No persistir borrador como aprobado |

---

## Interoperabilidad

Export FHIR no sustituye revisión humana. Importación futura debe validar y quedar en staging antes de mezclar con SoT.

---

## Referencia donante EPIS

Reescribir reglas desde `Epis/packages/epis-clinical-safety` y `EPIS_ROLE_POLICY_CANON` — **MIGRATE con tests**, no copiar acoplamiento OpenMRS.
