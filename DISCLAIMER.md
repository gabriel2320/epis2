# EPIS2 — Aviso legal y limitación de uso

**Versión:** 1.1 · **Programa:** PROG-POST-RC3 (MF-LEG-02) · **Revisión:** 2026-06-11

Este repositorio contiene **software de demostración y desarrollo** para un producto clínico command-first. **No está certificado ni validado para uso clínico real.**

## No es un dispositivo médico ni un HIS

- EPIS2 **no sustituye** el juicio clínico, la historia clínica institucional ni sistemas regulados.
- Las sugerencias de IA son **borradores**; un humano debe revisar y aprobar antes de cualquier acción clínica.
- No usar EPIS2 para **diagnóstico, tratamiento, prescripción ni decisiones clínicas** en pacientes reales.

## Datos sintéticos únicamente

- Desarrollo, tests y demos documentadas usan **pacientes y usuarios sintéticos**.
- **Prohibido** cargar PHI (información personal de salud) real en este repo, bases de datos de desarrollo compartidas o capturas públicas.
- Si detecta datos reales accidentalmente, elimínelos y reporte según [`SECURITY.md`](SECURITY.md).

## Entornos desplegados

- `staging` y `production` exigen configuración fail-closed (sin auth demo, RLS, rate limit, secretos explícitos).
- Desplegar en entorno clínico real requiere evaluación independiente de seguridad, cumplimiento normativo y gobernanza institucional — **fuera del alcance de este proyecto demo**.

## Sin garantía

El software se proporciona «tal cual», sin garantías de ningún tipo. Véase también [`LICENSE`](LICENSE).

## Revisión humana

Revisión legal de producto completada según [`docs/legal/EPIS2_LEGAL_REVIEW_CHECKLIST.md`](docs/legal/EPIS2_LEGAL_REVIEW_CHECKLIST.md) §5 (MF-LEG-02). Uso público o comercial ampliado sigue requiriendo asesoría legal institucional propia del despliegue.

---

_Revisor: operador producto EPIS2 · Fecha sign-off: 2026-06-11 · Evidencia: `reports/epis2-prog-legal-disclaimer-tramo3-close.md`_
