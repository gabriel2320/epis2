# EPIS2 — Canon visual dual ficha (ficha médica real primero)

**Versión:** 1.0 · **Programa:** PROG-DUAL-CHART · **ADR:** [ADR-002](../adr/ADR-002-dual-chart-modes.md)

> **Principio rector:** EPIS2 debe parecer primero una **ficha médica real** y después una IA. La innovación (comandos, Ollama, PostgreSQL) vive debajo; la superficie es familiar, institucional, imprimible y confiable.

---

## Decisión visual mayor

```text
EPIS2
└── Ficha del paciente
    ├── Modo Ficha Electrónica     (chartMode=traditional)
    └── Modo Ficha Papel           (chartMode=paper)
```

La **barra de comandos no es un modo**. Es herramienta transversal:

```text
Ctrl+K / Barra de acciones:
  “nueva evolución”, “indicar ceftriaxona”, “abrir laboratorio”, “hacer epicrisis”
```

**Eliminar como experiencia principal:** Command Center · Modo Clásico · Dashboard.

---

## Flujo canónico de pantallas

```text
Login
 ↓
Búsqueda / Censo de pacientes
 ↓
Ficha del paciente
 ↓
Selector superior: [Ficha Electrónica] [Ficha Papel]
```

Flujo mental del médico:

```text
Busco paciente → entro a su ficha → trabajo en electrónica o papel.
```

---

## Anatomía global (cuatro capas fijas)

```text
┌──────────────────────────────────────────────────────────────┐
│ 1. Header institucional EPIS2                                │
├──────────────────────────────────────────────────────────────┤
│ 2. Banda paciente (identidad + alergias + estado legal)      │
├──────────────────────────────────────────────────────────────┤
│ 3. Barra clínica de acciones (modos + acciones + Ctrl+K)     │
├───────────────┬───────────────────────────────┬──────────────┤
│ Índice ficha  │ Área clínica principal         │ Panel lateral │
│               │                               │ contexto/IA   │
└───────────────┴───────────────────────────────┴──────────────┘
│ 4. Footer: autoguardado, estado legal, confidencialidad      │
└──────────────────────────────────────────────────────────────┘
```

---

## 1. Header institucional

| Elemento | Decisión |
|----------|----------|
| Altura | 56–64 px |
| Color | Azul marino `#0B2540` (no turquesa genérico) |
| Izquierda | Logo + “Ficha Clínica Electrónica” |
| Centro/sub | Servicio / unidad |
| Derecha | Usuario, rol, cerrar sesión |
| **No incluir** | Guardar, firmar, imprimir (van en barra clínica) |

Componente: `ClinicalInstitutionalHeader`.

---

## 2. Banda paciente (`PatientIdentityBand`)

Siempre visible. Alergias **nunca** en pestaña oculta.

| Campo | Obligatorio |
|-------|-------------|
| Nombre completo | Sí |
| RUN | Sí |
| Edad, sexo | Sí |
| Cama / ubicación | Si hospitalizado |
| Servicio | Sí |
| Fecha ingreso | Si hospitalizado |
| Alergias | Siempre visible |
| Estado documento | Borrador / firmado / bloqueado |

Implementación actual: evolucionar `PatientChartBanner` → `PatientIdentityBand`.

---

## 3. Barra clínica de acciones (`ClinicalActionBar`)

```text
[Ficha Electrónica] [Ficha Papel]    Buscar/comando… (Ctrl+K)
+ Evolución  + Indicación  + Lab  + Receta   [Guardar] [Firmar] [Imprimir]
```

| Acción | Regla |
|--------|-------|
| Guardar borrador | Siempre visible |
| Firmar / validar | Cuando aplique |
| Imprimir | Ambos modos |
| Nueva evolución / indicación / lab | Acciones frecuentes |
| **Prohibido** | “Siguiente” como patrón principal (no wizard) |

Componentes: `ClinicalModeSwitch` (dentro de barra) + acciones clínicas + slot comando.

---

## 4. Modo Ficha Electrónica (`TraditionalEhrLayout`)

Layout:

```text
TraditionalSectionNav │ TraditionalClinicalPanel │ ClinicalRightContextPanel
```

### Índice lateral clínico (no administrativo genérico)

```text
Resumen clínico · Datos administrativos · Anamnesis · Antecedentes · Alergias
Examen físico · Diagnósticos · Indicaciones · Medicamentos · Evolución
Laboratorio · Imagenología · Interconsultas · Documentos · Epicrisis · Auditoría
```

### Área central

- Compacta, tabular, sobria.
- Secciones como hoja clínica digital (no tarjetas con mucho aire).
- Sin apariencia dashboard.

### Panel derecho (`ClinicalRightContextPanel`)

- Pendientes, últimos labs, IA local (borrador only).
- **Colapsable** — el médico puede trabajar sin verlo.

---

## 5. Modo Ficha Papel (`PaperChartLayout`)

**Referencia visual canónica:** [EPIS2_FICHAPAPEL_VISUAL_REFERENCE.md](./EPIS2_FICHAPAPEL_VISUAL_REFERENCE.md) — prototipo [FichaPapel](https://github.com/gabriel2320/FichaPapel) (modo `reference`, sin import runtime). Helpers transversales: `packages/epis2-ui/src/theme/paper-visual-reference.ts`.

Debe parecer **documento institucional**, no MUI moderno:

```text
Fondo escritorio #e8e6e0 · Hoja marfil #fdfcf7 · Cabecera navy #0d2b5e
Secciones I–VII banda navy + acento #5fa3d8 · Pauta #d8d4cc · Courier Prime cuerpo
```

### Toolbar documental (`PaperDocumentToolbar`)

```text
Formato: [Carta] [A5]   Zoom   [Editar] [Guardar] [Firmar] [Imprimir] [PDF]
```

| Formato | Uso |
|---------|-----|
| Carta | Ficha completa, epicrisis, indicaciones |
| A5 | Recetas, certificados, órdenes breves |
| **A4** | **Prohibido** |

### Secciones canónicas I–VII

Ver ADR-002 y `paperChartSections.ts`. Subestructura detallada en plan §13 del brief producto.

Componentes: `PaperSectionNavigator`, `PaperPageCanvas`, `PaperFieldLine`, `PaperTable`, `PaperSignatureBlock`, `PaperFooter`.

---

## 6. Footer (`ClinicalFooterStatus`)

```text
Confidencial · EPIS2 v0.x · Guardado 13:42 · Usuario · Borrador no firmado
```

| Elemento | Uso |
|----------|-----|
| Autoguardado | “Guardado hace N s” |
| Estado legal | Borrador / firmado / rectificado |
| Confidencialidad | Siempre |
| Página | Solo modo papel (p. 1/7) |

---

## 7. Datos: misma SoT, dos representaciones

```text
PostgreSQL (estructurado)
        ↓
Registry clínico EPIS2 + paper-chart Zod
        ↓
┌─────────────────────┬──────────────────────┐
│ Ficha Electrónica   │ Ficha Papel          │
│ formularios/tablas  │ documento editable   │
└─────────────────────┴──────────────────────┘
```

IA Ollama: solo propone borrador; humano revisa, acepta y firma.

---

## 8. Reglas visuales obligatorias

### Ambos modos

1. Paciente activo siempre visible.
2. Alergias siempre visibles.
3. Estado legal visible (borrador / firmado).
4. Imprimir siempre disponible.
5. Volver a búsqueda/censo siempre posible.
6. Guardado/firma nunca ocultos.
7. **Nunca** dashboard como pantalla principal.
8. Un solo botón primario por zona.

### Modo electrónico

Denso · tabular · nav clínico · panel IA colapsable · color solo para estado clínico.

### Modo papel

Hoja impresa · líneas no cajas · cabecera institucional · romano I–VII · Carta/A5 · pie obligatorio · PDF = pantalla.

---

## 9. Mapa de componentes

| Componente | Rol | Estado implementación |
|------------|-----|------------------------|
| `ClinicalShell` | Orquestador 4 capas | ✓ scaffold |
| `ClinicalInstitutionalHeader` | Header azul marino | Pendiente MF-04 |
| `PatientIdentityBand` | Banda paciente | Parcial (`PatientChartBanner`) |
| `ClinicalActionBar` | Modos + acciones + comando | Parcial (dock separado) |
| `ClinicalModeSwitch` | Electrónica ↔ Papel | ✓ `ChartModeSwitch` |
| `ClinicalFooterStatus` | Footer estado | Pendiente MF-04 |
| `TraditionalEhrLayout` | Layout EMR | Parcial `TraditionalEhrMode` |
| `TraditionalSectionNav` | Índice lateral clínico | Parcial |
| `TraditionalClinicalPanel` | Área central densa | Parcial (grid) |
| `ClinicalRightContextPanel` | Contexto/IA colapsable | Parcial |
| `PaperChartLayout` | Modo documento | Parcial `PaperChartMode` |
| `PaperDocumentToolbar` | Carta/A5/print/PDF | Parcial |
| `PaperSectionNavigator` | Índice I–VII | En template |
| `PaperPageCanvas` | Hoja centrada | En template |
| `CommandPaletteOverlay` | Ctrl+K transversal | ✓ |

---

## Referencias Figma Make

- [Ficha electrónica tradicional](https://www.figma.com/make/PhZ55jJhxLQUtIWEuf17ZO/Medical-Record)
- [Ficha papel editable](https://www.figma.com/make/AJ9MNrSyClA0hh8jB8sx49/Crear-p%C3%A1ginas-de-ficha-m%C3%A9dica)
