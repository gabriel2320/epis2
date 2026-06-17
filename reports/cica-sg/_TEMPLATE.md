# CICA-SG — Screen Need Request

**Slug:** `[nombre-corto]` · **Fecha:** YYYY-MM-DD · **Solicitante:** agente | humano  
**Programa:** PROG-AESTHETIC-RESET · **Microfase autorizada:** MF-___ / N/A (congelamiento)

---

## 1. Nombre propuesto

```text

```

---

## 2. Intención clínica (una sola frase)

```text

```

---

## 3. Usuario principal

```text
doctor | nurse | admin | read_only
```

---

## 4. Paciente scoped

```text
Sí / No
```

---

## 5. Acción primaria

```text
Etiqueta visible:
ID técnico (opcional):
Riesgo: low | medium | high
```

---

## 6. Acciones secundarias

```text
- 
- 
```

---

## 7. Ciclo documental

```text
none | draft | approved | signed | audited
```

---

## 8. Complejidad de datos

```text
low | medium | high
```

---

## 9. Riesgo clínico

```text
low | medium | high
```

---

## 10. Navegación temporal

```text
Sí / No — (ej. día anterior / hoy / siguiente)
```

---

## 11. Área de texto amplia / comparación

```text
needsLargeTextArea: Sí / No
needsComparison: Sí / No
```

---

## 12. Impresión

```text
Sí / No
```

---

## 13. Auditoría / trail

```text
needsAuditTrail: Sí / No
```

---

## 14. Pantalla padre

```text
Ej. patient-chart · section-evolutions · census
```

---

## 15. Pantalla similar existente

```text
Ruta o ID en EPIS2_FORM_SCREEN_TREE / Screen Map:
¿Por qué no reutilizar?
```

---

## 16. ¿Aumenta carga cognitiva?

Marcar si agrega: tab nuevo · subnav · 2ª primaria · ruta sin retorno · >3 acciones visibles.

```text
Sí / No — detalle:
```

---

## 17. Decisión CICA-SG (completar tras evaluación)

| Campo | Valor |
|-------|-------|
| **Admission Score** | /100 |
| **Contenedor** | inline-section \| tab \| tab-composed \| drawer \| modal \| full-screen-route \| dedicated-mode \| reject-duplicate |
| **Layout profile** | census \| classic-chart \| clinical-form \| paper-mode \| results \| documents \| audit |
| **Verdict** | APPROVE \| REJECT |
| **Override aplicado** | ninguno \| (describir) |
| **Reutilizar** | screen id / blueprint id / N/A |

### Justificación

```text

```

---

## 18. Checklist CICA (7/7)

```text
[ ] Intención clínica propia
[ ] Acción principal clara
[ ] No duplica otra pantalla
[ ] Reduce complejidad (no la aumenta)
[ ] Retorno claro (Ley 5)
[ ] Paciente y estado visibles (Ley 1)
[ ] Puede probarse con gate
```

---

## 19. Gates previstos

```text
- quality:cica-screen-governor-gate (cuando exista)
- quality:aesthetic-layout-gate
- quality:clinical-navigation-clarity-gate
- (otros)
```

---

## 20. Siguiente paso

```text
REJECT → inline / modal / reutilizar: ___
APPROVE → CICA-L wireframe en reports/cica-l/ ___  |  implementación MF-___
```
