# EPIS2 — Norma gráfica y técnica para documentos clínicos imprimibles en Chile

**Versión:** 1.0.0 · **Fecha:** 2026-06-07  
**Estado:** Canónico — diseño (sin implementación productiva aún)  
**Relación M3:** pantalla = Material Design 3; impresión = documento plano (§4)  
**Paquete objetivo:** `@epis2/epis2-ui` (primitivas `Print*` — §21)

---

## 1. Propósito

Esta norma define las reglas visuales, clínicas y técnicas para crear documentos imprimibles en EPIS2 utilizando Material Design 3.

Toda salida impresa o PDF generada por EPIS2 debe ser:

* clínicamente clara;
* segura para el paciente;
* fácil de leer y revisar;
* consistente entre servicios;
* trazable;
* comprensible en escala de grises;
* resistente a cortes y errores de paginación;
* apta para impresoras institucionales comunes;
* utilizable sin conexión a internet;
* compatible exclusivamente con formatos Carta y A5.

---

## 2. Formatos autorizados

EPIS2 solo utilizará los siguientes tamaños de página:

| Formato | Dimensiones | Uso principal |
| ------- | -----------: | ---------------------------------------------------------------------------- |
| Carta | 216 × 279 mm | Documentos clínicos extensos, legales, longitudinales y operacionales |
| A5 | 148 × 210 mm | Documentos breves, órdenes, recetas, certificados e indicaciones al paciente |

Está prohibido generar documentos nuevos en:

* A4;
* oficio;
* formatos personalizados;
* formatos dependientes del tamaño de pantalla;
* páginas de ancho variable.

### 2.1 Carta vertical

Debe ser el formato predeterminado para:

* ingreso hospitalario;
* evolución médica;
* epicrisis;
* informe médico;
* consentimiento informado;
* informe de interconsulta;
* conciliación de medicamentos;
* resumen clínico;
* informe de procedimientos;
* documentos administrativos extensos;
* copia completa o parcial de la ficha clínica.

### 2.2 Carta horizontal

Solo debe utilizarse para documentos tabulares extensos:

* hoja de enfermería;
* hoja de signos vitales;
* balance hídrico;
* registro de administración de medicamentos;
* hoja de tratamiento;
* tendencias clínicas;
* censos;
* listados operacionales.

No debe utilizarse horizontal únicamente para evitar rediseñar una tabla deficiente.

### 2.3 A5 vertical

Debe utilizarse para documentos breves destinados principalmente a entrega, circulación o ejecución:

* receta médica;
* orden de laboratorio;
* orden de imagenología;
* solicitud breve de procedimiento;
* indicaciones de alta resumidas;
* certificado médico breve;
* comprobante de atención;
* citación;
* derivación breve;
* instrucciones para el paciente;
* resumen breve de medicamentos;
* comprobante o resumen de un trámite externo.

### 2.4 Regla de promoción automática

Un documento A5 debe promoverse automáticamente a Carta cuando:

* supera dos páginas;
* contiene narrativas clínicas extensas;
* requiere más de una tabla compleja;
* necesita más de cinco columnas;
* pierde legibilidad al imprimirse;
* contiene múltiples firmas o consentimientos;
* requiere anexos;
* debe incorporarse como documento clínico longitudinal completo.

Nunca se debe reducir excesivamente el tamaño tipográfico para mantener un documento en A5.

---

## 3. Familias documentales EPIS2

Cada documento debe pertenecer a una familia explícita.

### 3.1 Documento clínico longitudinal

Formato habitual: Carta vertical.

Incluye:

* ingreso;
* evolución;
* epicrisis;
* informe clínico;
* resumen de ficha;
* informe de interconsulta;
* nota de traslado;
* nota de procedimiento.

Características:

* narrativa clínica;
* múltiples secciones;
* identificación repetida en cada página;
* autoría y firma;
* estado documental;
* auditoría.

### 3.2 Documento clínico operacional

Formato habitual: Carta horizontal.

Incluye:

* hoja de enfermería;
* administración de medicamentos;
* balance hídrico;
* signos vitales;
* controles seriados;
* planificación de cuidados;
* censo clínico.

Características:

* predominio de tablas;
* lectura rápida;
* fechas y horas repetidas;
* encabezados persistentes;
* mínimo uso de narrativa.

### 3.3 Documento transaccional

Formato habitual: A5 vertical.

Incluye:

* receta;
* orden;
* indicación;
* certificado breve;
* citación;
* derivación breve.

Características:

* una acción principal;
* contenido breve;
* una página como objetivo;
* datos del profesional claramente visibles;
* fácil entrega al paciente.

### 3.4 Documento regulado o emitido por sistema externo

Incluye documentos relacionados con plataformas, trámites o formatos oficiales externos.

EPIS2 no debe reconstruir visualmente un documento oficial cuando exista un formato normado o generado por otro sistema.

En esos casos EPIS2 debe:

* conservar el documento original;
* registrar su identificador;
* permitir imprimir una copia cuando esté autorizado;
* generar, si se necesita, un resumen Carta o A5 claramente identificado como resumen;
* nunca presentar un resumen EPIS2 como si fuera el documento oficial original.

---

## 4. Material Design 3: pantalla versus impresión

### 4.1 En pantalla

Material Design 3 debe utilizarse para:

* edición;
* navegación;
* validación;
* estados;
* acciones;
* campos;
* ayuda contextual;
* revisión humana;
* accesibilidad.

Se permiten:

* superficies tonales;
* campos outlined o filled;
* botones;
* acordeones;
* pestañas;
* diálogos;
* tooltips;
* mensajes de validación;
* indicadores de progreso.

### 4.2 En impresión

La interfaz debe transformarse en un documento clínico plano.

Deben eliminarse:

* navegación;
* barra lateral;
* barra de comandos;
* botones;
* menús;
* tooltips;
* controles interactivos;
* estados hover;
* sombras;
* gradientes;
* superficies Aurora;
* tarjetas decorativas;
* elementos colapsados;
* iconos sin significado documental;
* textos de ayuda destinados exclusivamente a la edición.

La impresión nunca debe ser una captura directa de la pantalla interactiva.

---

## 5. Convenciones chilenas

### 5.1 Idioma

Todo documento debe generarse en español.

Las etiquetas clínicas visibles deben provenir del sistema centralizado de copy de EPIS2 (`packages/design-system/src/copy/es.ts`).

No se permiten textos como:

```text
Submit
Draft
Patient ID
AI generated
Print preview
```

Deben utilizarse equivalentes claros:

```text
Guardar
Borrador
Identificador del paciente
Generado con asistencia de IA
Vista previa de impresión
```

### 5.2 Fecha y hora

Formato visual recomendado:

```text
Fecha: 05-06-2026
Hora: 14:35
```

Reglas:

* utilizar día, mes y año completos;
* utilizar horario de 24 horas;
* no utilizar formatos ambiguos como `06/05/26`;
* registrar la zona horaria en los metadatos digitales;
* mostrar fecha y hora de firma por separado cuando sea relevante.

### 5.3 Identificación del paciente

Según el propósito del documento, el encabezado puede incluir:

* nombre completo;
* RUT u otro identificador autorizado;
* fecha de nacimiento;
* edad;
* sexo registral o información pertinente al contexto clínico;
* número de ficha;
* número de episodio o atención;
* previsión, únicamente cuando sea necesaria;
* servicio;
* unidad;
* sala y cama.

No todos los documentos deben imprimir todos los identificadores.

Debe utilizarse la menor cantidad de información identificatoria compatible con el propósito del documento.

### 5.4 Identificación del profesional

Cuando corresponda, el documento debe disponer de campos configurables para:

* nombre completo;
* profesión;
* especialidad;
* RUT o identificador profesional;
* registro profesional aplicable;
* institución;
* servicio;
* firma;
* fecha y hora.

Estos campos deben provenir del perfil autorizado, no ser escritos manualmente en cada documento.

### 5.5 Valores clínicos y unidades

Los valores clínicos deben:

* mantener su unidad;
* conservar el valor original de la fuente;
* evitar transformaciones automáticas que puedan alterar su interpretación;
* indicar valores de referencia cuando corresponda;
* identificar claramente resultados críticos;
* mostrar fecha y hora de obtención.

---

## 6. Márgenes y área segura

### 6.1 Carta

Márgenes recomendados:

```text
Superior: 15–18 mm
Inferior: 14–18 mm
Izquierdo: 16–20 mm
Derecho: 16–20 mm
```

### 6.2 A5

Márgenes recomendados:

```text
Superior: 10–12 mm
Inferior: 10–12 mm
Izquierdo: 10–12 mm
Derecho: 10–12 mm
```

### 6.3 Área segura

No se debe colocar información esencial cerca del borde físico de la página.

Debe existir una zona segura adicional para:

* impresoras con márgenes no imprimibles;
* perforaciones;
* archivadores;
* timbres;
* firmas manuscritas;
* fotocopias.

---

## 7. Jerarquía documental

Todo documento clínico debe seguir, cuando corresponda, este orden:

```text
1. Institución y tipo de documento
2. Identificación del paciente
3. Contexto asistencial
4. Estado y fecha del documento
5. Contenido clínico
6. Diagnósticos, conclusiones o indicaciones
7. Firmas
8. Trazabilidad
9. Pie de página
```

La información más importante debe estar visible antes de iniciar la narrativa clínica.

---

## 8. Encabezado clínico

### 8.1 Encabezado Carta

Debe contener de manera compacta:

* institución;
* servicio o unidad;
* título del documento;
* identificación esencial del paciente;
* número de episodio;
* fecha del documento;
* estado documental.

Desde la segunda página puede utilizarse un encabezado reducido, pero debe mantener:

* nombre del paciente;
* identificador;
* tipo de documento;
* número de episodio.

### 8.2 Encabezado A5

Debe ser más compacto.

Debe priorizar:

* institución;
* paciente;
* identificador;
* tipo de documento;
* fecha;
* profesional responsable.

El encabezado no debe consumir una proporción excesiva de la página.

### 8.3 Logotipo

El logotipo institucional:

* debe ser discreto;
* no debe dominar la página;
* debe conservar proporción;
* debe funcionar en escala de grises;
* no debe desplazar información clínica importante.

---

## 9. Tipografía

### 9.1 Fuentes

La impresión debe funcionar sin Google Fonts y sin conexión a internet.

Orden recomendado:

```text
Fuente institucional instalada localmente
Roboto local
Noto Sans local
Arial
sans-serif
```

### 9.2 Tamaños Carta

```text
Título principal: 15–18 pt
Título de sección: 11,5–13 pt
Cuerpo clínico: 10–11 pt
Etiquetas: 8,5–9,5 pt
Pie de página: 8–9 pt
```

### 9.3 Tamaños A5

```text
Título principal: 13–16 pt
Título de sección: 10,5–12 pt
Cuerpo clínico: 9,5–10,5 pt
Etiquetas: 8,5–9 pt
Pie de página: 7,5–8,5 pt
```

El contenido clínico esencial nunca debe imprimirse por debajo de 9 pt.

### 9.4 Reglas tipográficas

* utilizar negrita para títulos y advertencias;
* evitar párrafos completos en negrita;
* evitar textos completos en mayúsculas;
* utilizar mayúsculas solo para estados críticos o documentales;
* mantener un interlineado suficiente;
* evitar líneas de texto excesivamente extensas.

---

## 10. Color, bordes y superficies

### 10.1 Fondo

Todos los documentos deben imprimirse sobre fondo blanco.

No utilizar:

* fondos oscuros;
* gradientes;
* superficies Aurora;
* grandes bloques coloreados;
* texturas;
* imágenes decorativas.

### 10.2 Color

El color solo puede utilizarse para aportar significado.

Ejemplos:

* advertencia;
* estado documental;
* resultado crítico;
* sección destacada.

El documento debe seguir siendo completamente interpretable en blanco y negro.

### 10.3 Bordes

Valores recomendados:

```text
Borde normal: 0,25–0,5 pt
Borde destacado: 0,75–1 pt
```

Evitar rodear cada campo con cajas independientes.

### 10.4 Elevación Material 3

Las sombras y elevaciones deben eliminarse en impresión.

La jerarquía se debe representar mediante:

* espacio;
* tipografía;
* alineación;
* bordes finos;
* separación entre secciones.

---

## 11. Secciones clínicas

Cada sección debe poseer:

* título claro;
* contenido relacionado;
* separación vertical consistente;
* reglas de paginación;
* ausencia de elementos decorativos innecesarios.

Ejemplos:

```text
Motivo de consulta
Antecedentes
Historia actual
Examen físico
Resultados relevantes
Diagnósticos
Plan
Indicaciones
Seguimiento
```

Las tarjetas Material 3 de pantalla deben transformarse en secciones documentales planas.

No se debe imprimir una sucesión de tarjetas redondeadas como si el documento fuera un dashboard.

---

## 12. Campos y formularios

### 12.1 Etiquetas persistentes

Todo valor impreso debe conservar su etiqueta.

Correcto:

```text
Frecuencia cardíaca: 82 lpm
```

Incorrecto:

```text
82
```

### 12.2 Valores ausentes

En documentos completados, los campos vacíos deben distinguirse de los campos no aplicables.

Utilizar:

```text
No registrado
No aplica
No evaluado
Sin información disponible
```

No completar automáticamente información clínica ausente.

### 12.3 Narrativas clínicas

Los campos narrativos deben:

* expandirse completamente;
* respetar párrafos;
* permitir saltos de línea;
* evitar truncamiento;
* no ocultar contenido;
* mantener una longitud de línea legible.

### 12.4 Formulario vacío para completar manualmente

Cuando se imprima un formulario vacío:

* utilizar líneas de escritura claras;
* dejar espacio suficiente;
* mantener etiquetas persistentes;
* utilizar casillas de tamaño adecuado;
* evitar campos excesivamente pequeños;
* reservar espacios realistas para firmas.

Altura recomendada para una línea manuscrita:

```text
7–9 mm
```

---

## 13. Tablas clínicas

### 13.1 Uso adecuado

Las tablas deben utilizarse para:

* medicamentos;
* resultados;
* diagnósticos;
* órdenes;
* signos vitales;
* balances;
* registros horarios;
* auditoría.

No deben utilizarse para narrativas clínicas extensas.

### 13.2 Reglas obligatorias

* repetir encabezados en cada página;
* no separar dosis, vía y frecuencia del medicamento;
* no dividir una fila breve entre páginas;
* mostrar siempre las unidades;
* alinear números consistentemente;
* mantener fechas y horas en un formato único;
* evitar más columnas de las que el formato permite leer.

### 13.3 Tablas A5

En A5 deben evitarse tablas complejas.

Recomendación:

* máximo cinco columnas;
* filas breves;
* una sola tabla principal;
* sin texto narrativo largo dentro de celdas.

Cuando una tabla A5 pierda legibilidad, el documento debe generarse en Carta.

### 13.4 Tablas Carta horizontal

Carta horizontal puede utilizarse para:

* MAR;
* balance hídrico;
* signos vitales;
* registro horario;
* tendencias;
* hojas operacionales.

No debe reducirse el texto por debajo del mínimo legible para incluir más horas o columnas.

---

## 14. Estados documentales

Todo documento debe tener un estado explícito:

```text
BORRADOR
PENDIENTE DE FIRMA
FIRMADO
ANULADO
REEMPLAZADO
COPIA
```

### 14.1 Borrador

Debe mostrar en todas sus páginas:

```text
BORRADOR — NO VÁLIDO COMO DOCUMENTO CLÍNICO FIRMADO
```

### 14.2 Documento firmado

Debe mostrar:

* autor;
* rol;
* fecha y hora;
* identificador;
* versión;
* método de firma.

### 14.3 Documento anulado o reemplazado

Debe mantenerse trazable.

Debe mostrar claramente:

```text
ANULADO
```

o:

```text
REEMPLAZADO POR DOCUMENTO [IDENTIFICADOR]
```

Nunca debe eliminarse silenciosamente.

---

## 15. Firmas

### 15.1 Información mínima

Cada bloque de firma debe incluir:

* nombre;
* profesión o rol;
* especialidad cuando corresponda;
* identificador profesional aplicable;
* fecha;
* hora;
* estado de firma.

### 15.2 Firma manuscrita

Cuando se requiera una firma manual:

* reservar espacio suficiente;
* no colocar la firma en un borde de página;
* mantener el nombre del firmante junto al espacio de firma;
* no separar firma y contenido validado.

### 15.3 Firmas múltiples

Deben agruparse por función:

```text
Elaborado por
Revisado por
Autorizado por
Informado a
Recibido por
```

---

## 16. Alertas clínicas y seguridad

### 16.1 Alertas

Las alertas deben contener texto explícito.

Correcto:

```text
RESULTADO CRÍTICO
Potasio: 6,8 mmol/L
Acuse pendiente
```

Incorrecto:

```text
6,8 mostrado solamente en rojo.
```

### 16.2 Clasificación visual

Se pueden distinguir:

```text
Información
Precaución
Importante
Crítico
```

La jerarquía debe depender de texto, borde, peso tipográfico e iconografía, no solamente de color.

### 16.3 Información generada con IA

Cuando una sección haya sido propuesta por IA y aún no haya sido validada, debe indicarse claramente:

```text
BORRADOR GENERADO CON ASISTENCIA DE IA
REQUIERE REVISIÓN HUMANA
```

Una vez revisado, firmado e incorporado al documento final, la trazabilidad de la asistencia debe permanecer en auditoría, sin convertir el documento en una salida visualmente confusa.

**Invariante EPIS2:** la IA no firma ni aprueba; ver `docs/product/PRODUCT_INVARIANTS.md`.

---

## 17. Paginación

### 17.1 Numeración

Todo documento de más de una página debe indicar:

```text
Página X de Y
```

### 17.2 Cortes prohibidos

No se debe separar entre páginas:

* título de sección y su primer contenido;
* medicamento y su dosis;
* diagnóstico y su descripción;
* pregunta y respuesta;
* alerta y explicación;
* firma y nombre del firmante;
* encabezado de tabla y primera fila;
* indicación y sus condiciones.

### 17.3 Páginas independientes

Cada página debe permitir identificar:

* paciente;
* documento;
* episodio;
* fecha;
* número de página.

### 17.4 Páginas en blanco

No deben generarse páginas en blanco producto de:

* contenedores sobredimensionados;
* saltos forzados incorrectos;
* márgenes inconsistentes;
* secciones vacías;
* firmas posicionadas de forma absoluta.

---

## 18. Pie de página

El pie de página debe ser discreto y contener, según corresponda:

* identificador del documento;
* versión;
* estado;
* fecha de generación;
* número de página;
* clasificación de confidencialidad;
* institución.

Ejemplo:

```text
Documento clínico confidencial · EPIS2 · DOC-000123 · Página 2 de 3
```

No incluir textos legales extensos repetidos en todas las páginas salvo que sean obligatorios.

---

## 19. Reglas específicas por documento

### 19.1 Epicrisis — Carta vertical

Debe priorizar:

* identificación del paciente;
* fechas de ingreso y egreso;
* diagnósticos;
* motivo de hospitalización;
* evolución relevante;
* procedimientos;
* resultados relevantes;
* tratamiento;
* condición al alta;
* medicamentos al alta;
* indicaciones;
* controles;
* signos de alarma;
* profesional responsable.

No debe parecer una copia bruta del timeline.

Debe ser una síntesis clínica validada.

### 19.2 Ingreso hospitalario — Carta vertical

Debe incluir secciones claramente diferenciadas:

* motivo de ingreso;
* antecedentes;
* medicamentos;
* alergias;
* historia actual;
* examen físico;
* resultados disponibles;
* problemas y diagnósticos;
* plan inicial;
* responsable.

La información crítica, como alergias, debe ser visible sin buscarla dentro de una narrativa extensa.

### 19.3 Evolución médica — Carta vertical

Debe mostrar claramente:

* fecha y hora;
* autor;
* situación clínica;
* hallazgos;
* evaluación;
* plan;
* cambios relevantes;
* firma.

Al imprimir múltiples evoluciones, cada evolución debe conservar claramente su autoría y temporalidad.

### 19.4 Informe de interconsulta — Carta vertical

Debe diferenciar:

* motivo de solicitud;
* pregunta clínica;
* antecedentes relevantes;
* evaluación;
* recomendaciones;
* acciones sugeridas;
* responsable;
* fecha y hora.

### 19.5 Consentimiento informado — Carta vertical

Debe disponer de espacio suficiente para:

* identificación;
* procedimiento;
* explicación;
* beneficios;
* riesgos;
* alternativas;
* preguntas;
* aceptación o rechazo;
* firmas;
* fecha y hora.

No debe comprimirse a A5.

### 19.6 Receta médica — A5 vertical

Debe priorizar:

* paciente;
* fecha;
* medicamento;
* forma farmacéutica;
* dosis;
* vía;
* frecuencia;
* duración;
* cantidad;
* indicaciones;
* profesional;
* firma.

Un medicamento nunca debe dividirse entre dos páginas.

Cuando corresponda un formato regulado específico, EPIS2 debe respetar la plantilla aplicable y no improvisar una versión visual alternativa.

### 19.7 Orden de laboratorio o imagenología — A5 vertical

Debe incluir:

* paciente;
* fecha;
* examen o procedimiento solicitado;
* prioridad;
* indicación clínica cuando corresponda;
* preparación;
* servicio solicitante;
* profesional;
* firma.

Debe evitar términos ambiguos o abreviaturas no controladas.

### 19.8 Certificado médico breve — A5 vertical

Debe mostrar:

* identificación necesaria;
* finalidad del certificado;
* fecha;
* texto explícito;
* profesional;
* firma;
* folio.

No debe imprimir diagnósticos o información clínica innecesaria para el propósito declarado.

### 19.9 Indicaciones al paciente — A5 vertical

Debe utilizar lenguaje claro y legible.

Debe priorizar:

* medicamentos;
* horarios;
* cuidados;
* restricciones;
* controles;
* signos de alarma;
* datos de contacto o consulta.

Debe evitar párrafos densos y abreviaturas clínicas internas.

### 19.10 Hoja de enfermería, balance y MAR — Carta horizontal

Debe priorizar:

* fechas y horas;
* filas consistentes;
* unidades;
* responsables;
* firma o identificación por registro;
* continuidad entre páginas.

Los estados no deben depender exclusivamente del color.

---

## 20. Privacidad y propósito de impresión

Cada documento debe declarar su propósito o audiencia:

```text
Uso clínico interno
Copia para el paciente
Documento para derivación
Documento administrativo
Resumen
```

Una copia para el paciente no debe incluir automáticamente:

* comentarios internos;
* auditoría técnica;
* identificadores innecesarios;
* anotaciones no destinadas a entrega;
* información de terceros.

### 20.1 Código QR

Un código QR puede utilizarse para verificación documental.

No debe contener directamente:

* diagnósticos;
* resultados;
* medicamentos;
* datos clínicos sensibles.

Debe apuntar a un mecanismo seguro de validación.

---

## 21. Componentes canónicos EPIS2

Los documentos deben construirse usando primitivas reutilizables dentro de:

```text
@epis2/epis2-ui
```

Componentes recomendados (objetivo — no implementados aún):

```text
PrintDocument
PrintLetterDocument
PrintA5Document
PrintHeader
PrintCompactHeader
PrintPatientIdentity
PrintEncounterContext
PrintDocumentTitle
PrintDocumentStatus
PrintSection
PrintField
PrintNarrative
PrintClinicalTable
PrintAlert
PrintMedicationList
PrintIndicationList
PrintSignatureBlock
PrintAuditSummary
PrintWatermark
PrintFooter
```

Los formularios no deben implementar sus propios sistemas visuales de impresión cuando exista una primitiva canónica.

**Gate:** sin imports directos `@mui/*` en `apps/web` (M3-G11).

---

## 22. Contrato técnico del documento

Cada documento imprimible debe declarar explícitamente:

```ts
type PrintDocumentFormat = 'letter' | 'a5';

type PrintOrientation = 'portrait' | 'landscape';

type PrintAudience =
  | 'clinical-internal'
  | 'patient-copy'
  | 'external-provider'
  | 'administrative';

type PrintDocumentStatus =
  | 'draft'
  | 'pending-signature'
  | 'signed'
  | 'annulled'
  | 'replaced'
  | 'copy';
```

Reglas:

* `a5` debe utilizar orientación vertical por defecto;
* `letter` puede utilizar orientación vertical u horizontal;
* el formato debe definirse por tipo documental, no por preferencia del usuario;
* un documento firmado debe conservar su formato y versión;
* una nueva impresión de un documento firmado debe identificarse como copia.

**Ubicación objetivo del contrato:** `packages/contracts` (futuro) o submódulo `packages/epis2-ui/src/print/`.

---

## 23. Tokens imprimibles

Los valores deben centralizarse.

```css
:root {
  --epis2-print-letter-width: 216mm;
  --epis2-print-letter-height: 279mm;

  --epis2-print-a5-width: 148mm;
  --epis2-print-a5-height: 210mm;

  --epis2-print-text: #111111;
  --epis2-print-muted: #555555;
  --epis2-print-border: #b8b8b8;

  --epis2-print-border-width: 0.4pt;
  --epis2-print-line-height: 1.35;
}
```

Ejemplo de configuración:

```css
@page epis2-letter {
  size: Letter portrait;
  margin: 16mm 18mm;
}

@page epis2-letter-landscape {
  size: Letter landscape;
  margin: 14mm 16mm;
}

@page epis2-a5 {
  size: A5 portrait;
  margin: 11mm;
}
```

Está prohibido utilizar:

```css
size: A4;
```

**Ubicación objetivo:** `packages/epis2-ui/src/theme/print-tokens.css` (futuro).

---

## 24. Render y generación PDF

### 24.1 Render documental explícito

Cada formulario debe poseer una vista imprimible independiente.

No se debe ejecutar directamente:

```text
window.print()
```

sobre la interfaz clínica interactiva sin transformación documental.

### 24.2 Documento final

Para documentos firmados o clínicamente definitivos:

* el PDF debe generarse de manera reproducible;
* debe conservar el contenido firmado;
* debe registrar la versión de la plantilla;
* debe registrar fecha de generación;
* no debe depender del navegador utilizado;
* debe evitar diferencias entre impresoras.

### 24.3 Fuentes e imágenes

Todos los recursos necesarios deben estar disponibles localmente.

No depender de:

* Google Fonts;
* imágenes remotas;
* recursos cargados desde internet;
* iconos externos;
* hojas de estilo externas.

---

## 25. Patrones prohibidos

No se permite:

* imprimir la pantalla interactiva completa;
* utilizar formato A4;
* mostrar navegación o botones;
* depender solo del color;
* reducir contenido clínico por debajo de 9 pt;
* truncar textos con puntos suspensivos;
* imprimir campos sin etiqueta;
* ocultar secciones colapsadas;
* cortar medicamentos entre páginas;
* separar firmas de sus responsables;
* utilizar tarjetas decorativas repetidas;
* imprimir gradientes;
* cargar fuentes remotas;
* mostrar datos demo en documentos reales;
* presentar un borrador como documento final;
* permitir que contenido generado por IA se firme sin revisión humana.

---

## 26. Validación obligatoria

Cada nuevo documento debe probarse como mínimo en:

```text
Carta vertical
Carta horizontal, cuando corresponda
A5 vertical, cuando corresponda
Escala de grises
PDF
Impresora física o simulación equivalente
Contenido corto
Contenido extenso
Campos vacíos
Texto clínico largo
Tablas con varias páginas
Documento borrador
Documento firmado
Documento anulado
Copia para paciente
```

---

## 27. Checklist de revisión humana

Antes de aprobar una plantilla:

### Identificación

* ¿El paciente puede identificarse en todas las páginas?
* ¿El tipo de documento es inequívoco?
* ¿El episodio y la fecha son visibles?

### Legibilidad

* ¿Puede leerse en blanco y negro?
* ¿El texto clínico es suficientemente grande?
* ¿Las tablas mantienen sus encabezados?
* ¿No existe contenido truncado?

### Seguridad

* ¿Las alertas críticas son explícitas?
* ¿Las unidades están presentes?
* ¿El estado documental es visible?
* ¿Los borradores se distinguen claramente?

### Privacidad

* ¿Solo se imprimen los datos necesarios?
* ¿La copia para paciente excluye información interna?
* ¿El QR evita incluir datos clínicos directamente?

### Formato

* ¿El documento utiliza Carta o A5?
* ¿El formato elegido corresponde al propósito?
* ¿Un documento A5 demasiado extenso fue promovido a Carta?

### Trazabilidad

* ¿El autor está identificado?
* ¿La firma aparece junto al contenido validado?
* ¿El documento posee folio, versión y fecha?
* ¿La copia se distingue del original firmado?

---

## 28. Definición de completado

Un formulario imprimible EPIS2 solo puede considerarse terminado cuando:

1. utiliza únicamente Carta o A5;
2. tiene un render documental independiente;
3. utiliza componentes de `@epis2/epis2-ui`;
4. no contiene imports directos desde `@mui/*` en `apps/web`;
5. utiliza copy centralizado en español;
6. funciona sin Google Fonts ni recursos remotos;
7. se interpreta correctamente en escala de grises;
8. no trunca contenido clínico;
9. identifica al paciente en todas las páginas;
10. diferencia borrador, firmado, anulado y copia;
11. mantiene firma, versión y trazabilidad;
12. posee pruebas automáticas;
13. posee revisión visual humana;
14. fue validado en el formato físico correspondiente;
15. no permite firmar contenido generado por IA sin revisión humana.

---

## 29. Mapeo blueprint → formato (referencia)

Alineación con blueprints actuales y MF planificadas. **Impresión no implementada** — guía de diseño.

| Blueprint / documento | Familia | Formato | Orientación |
|----------------------|---------|---------|-------------|
| `admission_note` | Longitudinal | Carta | vertical |
| `evolution_note` | Longitudinal | Carta | vertical |
| `discharge_summary` | Longitudinal | Carta | vertical |
| `referral` / interconsulta | Longitudinal | Carta | vertical |
| `transfer_note` (MF-167) | Longitudinal | Carta | vertical |
| `medication_reconciliation` (MF-166) | Longitudinal | Carta | vertical |
| `patient_summary` | Longitudinal | Carta | vertical |
| `prescription` | Transaccional | A5 | vertical |
| `lab_request` | Transaccional | A5 | vertical |
| `imaging_request` | Transaccional | A5 | vertical |
| `medication_administration` / MAR | Operacional | Carta | horizontal |
| Tendencias resultados | Operacional | Carta | horizontal |
| `nursing_note` (serie) | Operacional | Carta | horizontal |

---

## Referencias

- `docs/design/EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md` — M3 en pantalla
- `docs/design/EPIS2_UI_ARCHITECTURE.md` — capa `epis2-ui`
- `docs/clinical/BLUEPRINT_CONTRACT.md` — blueprints clínicos
- `docs/product/PRODUCT_INVARIANTS.md` — IA, borrador, aprobación
- `docs/quality/M3_ANTI_DRIFT_GATES.md` — gates pantalla
- `reports/epis2-master-plan-mf1-51-m3.md` — programa MF + frontera impresión
