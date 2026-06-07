# EPIS2 — Inventario pabellón Tramo E (IDC 151–160)

**MF-TRAMO-E-001** · **Fecha:** 2026-06-07  
**Workspace:** `or` · **Ola:** 15

---

## IDC 151–160 — Pabellón y anestesia (Defer scaffold E)

| IDC | Nombre | Decisión Tramo E | Nota |
|-----|--------|------------------|------|
| 151 | Tabla quirúrgica | **Active** MF-E-002 | Agendamiento quirófanos demo |
| 152 | Checklist cirugía segura OMS | **Active** MF-E-003 | Sign In · Time Out · Sign Out demo |
| 153 | Evaluación preanestésica | **Active** MF-E-004 | ASA, Mallampati, alergias demo |
| 154 | Hoja anestesia intraoperatoria | Defer | Grilla minuto a minuto |
| 155 | Protocolo operatorio | Defer | Descripción técnica |
| 156 | Recuento compresas / insumos | Defer | Validación enfermería |
| 157 | Biopsia intraoperatoria | Defer | Solicitud urgente AP |
| 158 | Recuperación URPA | Defer | Escala Aldrete |
| 159 | Banco de sangre | Defer | Transfusión hemoderivados |
| 160 | Esterilización / trazabilidad | Defer | Lote instrumental |

---

## Workspace EPIS2 hoy

- Rail `or` **habilitado** — MF-TRAMO-E-002 (`/epis2/dashboard?tab=or`).
- Tablero `OrDashboardTab` — IDC 151–153 Active (MF-TRAMO-E-002 … E-004).
- IDC 154–160 Planned en chips; implementación futura MF-E-005+.

---

## Gate

`npm run quality:tramo-e-inventory-gate`

---

## Plan

Ver [`EPIS2_TRAMO_E_PLAN.md`](./EPIS2_TRAMO_E_PLAN.md).
