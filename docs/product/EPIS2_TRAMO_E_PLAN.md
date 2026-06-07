# EPIS2 — Plan Tramo E (pabellón y anestesia)

**Versión:** 1.0 · **Fecha:** 2026-06-07

---

## Secuencia canon

Pabellón · anestesia · obstetricia · odontología · telemedicina · IoT · interop avanzada · facturación.

**Horizonte:** Post-core — scaffold pabellón demo (Ola 15 IDC 151–160).

---

## Estado

| Programa | IDC | EPIS2 hoy |
|----------|-----|-----------|
| Tabla quirúrgica | 151 | ✅ **MF-TRAMO-E-002** |
| Checklist OMS | 152 | ✅ **MF-TRAMO-E-003** |
| Preanestesia | 153 | Defer |
| Anestesia intraop | 154 | Defer |
| Protocolo operatorio | 155 | Defer |
| Recuento compresas | 156 | Defer |
| Biopsia intraop | 157 | Defer |
| URPA | 158 | Defer |
| Banco sangre | 159 | Defer |
| Esterilización | 160 | Defer |

---

## Microfases

| MF | Alcance | Estado |
|----|---------|--------|
| MF-TRAMO-E-001 | Inventario pabellón | ✅ |
| MF-TRAMO-E-002 | Rail + tablero OR (IDC 151) | ✅ |
| MF-TRAMO-E-003 | Checklist OMS (IDC 152) | ✅ |
| MF-TRAMO-E-004+ | Preanestesia, anestesia intraop… | 📋 Planificado |

---

## Gates

| Gate | Evidencia |
|------|-----------|
| `quality:tramo-e-inventory-gate` | Inventario + plan |
| `quality:tramo-e-or-gate` | Workspace + API + IDC 151 |
| `quality:tramo-e-who-checklist-gate` | IDC 152 checklist OMS |

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
