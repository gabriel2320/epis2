# EPIS2 Clinical Layout Manifesto

**Versión:** 1.0 · **Fecha:** 2026-06-16  
**Estado:** Norma canon CICA · **Adopción:** activa en `/app/*`

> Manifiesto de composición clínica para el Clinical Layout Engine.

**Documentos relacionados:**

| Documento | Rol |
|-----------|-----|
| [`EPIS2_CLINICAL_LAYOUT_ENGINE.md`](./EPIS2_CLINICAL_LAYOUT_ENGINE.md) | API, pipeline, perfiles |
| [`EPIS2_CICA.md`](./EPIS2_CICA.md) | Algoritmo decisión pantallas (CICA) |
| [`EPIS2_CLINICAL_SCREEN_MAP.md`](./EPIS2_CLINICAL_SCREEN_MAP.md) | Árbol de pantallas + barra de comando obligatoria |

---

## Manifiesto de composición clínica

EPIS2 no debe parecer un dashboard administrativo, una consola técnica ni una colección de formularios acumulados. EPIS2 debe sentirse como una **ficha clínica electrónica clásica**: sobria, ordenada, reconocible y segura.

La interfaz clínica no existe para impresionar al usuario. Existe para reducir carga cognitiva, evitar errores, orientar la acción médica y preservar la confianza.

El **Clinical Layout Engine** es la regla composicional que impide que cada pantalla sea diseñada de forma artesanal, inconsistente o excesiva. En EPIS2, las pantallas no se dibujan libremente: **se declaran**. El motor ordena la intención clínica, la jerarquía, la grilla, los espacios, las acciones y los estados.

### Estado de adopción (2026-06-16)

| Principio | Estado |
|-----------|--------|
| Modo papel pantalla exclusiva | ✓ Implementado |
| Gobernador de acciones (1+2+Más) | ✓ Implementado |
| `ClinicalScreen` en ficha / form / papel | ✓ Parcial |
| Tabs clínicos simplificados (`ClassicChartTabs`) | ✓ MF-AEST-02b (5 + Más) |
| Barra de comando transversal siempre presente | ✓ Screen Map §0 |
| Default `clinical-calm` 80/15/5 | ◐ MF-AEST-04 pendiente |
| Ficha sin densidad «dashboard» | ◐ Mejora continua |

Este manifiesto define el **norte normativo**, no un certificado de cumplimiento total.

---

## 1. Principio rector

Una pantalla debe responder **una sola pregunta clínica**.

Una pantalla debe permitir **una sola acción principal**.

Una pantalla debe tener **una jerarquía visual evidente**.

Si el usuario necesita pensar demasiado para entender qué mirar, dónde hacer clic o qué estado tiene el documento, la pantalla falló.

---

## 2. Una pantalla, una intención

Cada pantalla de EPIS2 debe tener una intención dominante:

| Pantalla | Intención |
|----------|-----------|
| Censo | Elegir paciente |
| Ficha clásica | Leer y navegar historia clínica |
| Evolución | Escribir o revisar evolución |
| Indicaciones | Revisar o agregar indicaciones |
| Exámenes | Revisar resultados |
| Receta | Crear o revisar receta |
| Modo papel | Leer, navegar días e imprimir |
| Command Center (compat) | Expresar intención o buscar acción |

> **Canon producto:** home canonico = CICA (`/app/buscar`). `/comando` es redirect de compatibilidad. `/espacio/*` queda como fallback legacy congelado por opt-out.
> **Barra de comando:** obligatoria en la experiencia clinica activa `/app/*` - ver [`EPIS2_CICA.md`](./EPIS2_CICA.md).

Toda pantalla que mezcla múltiples intenciones debe dividirse, simplificarse o reordenarse.

EPIS2 no debe mostrar todo al mismo tiempo. Debe mostrar lo necesario en el momento correcto.

---

## 3. Una acción principal

Cada pantalla debe tener **máximo una acción primaria visible**.

Las acciones secundarias deben ser pocas, discretas y consistentes.

Las acciones terciarias deben vivir en un menú **«Más»**.

**Regla:**

- 1 botón primario
- Hasta 2 acciones secundarias visibles
- El resto en menú contextual

**Ejemplos de acción primaria por pantalla:**

| Pantalla | Acción primaria |
|----------|-----------------|
| Evolución | Guardar borrador |
| Receta | Crear receta |
| Modo papel | Imprimir |
| Censo | Abrir ficha |
| Ficha clásica | Nueva evolución |

Una pantalla con muchos botones visibles transmite inseguridad, no poder.

**Implementación:** `ClinicalLayoutActionBar` · `normalizeClinicalActions` · `data-action-kind="primary"`.

---

## 4. La ficha clásica debe parecer ficha clínica

El modo clásico de EPIS2 debe recordar una ficha médica electrónica tradicional:

- Identidad del paciente arriba
- Contexto clínico visible
- Navegación clínica simple (tabs, no dashboard)
- Contenido dominante en el centro
- Acción principal al final o en barra estable
- Estados clínicos visibles pero no invasivos

**Prohibido:** dashboard, landing page, consola de administración dentro de la ficha.

---

## 5. El modo papel merece pantalla propia

El modo papel **no** debe vivir apretado dentro de la ficha clásica.

Debe tener pantalla exclusiva CICA (`/app/pacientes/:patientId/papel/*`), amplia, limpia y navegable:

- Volver a ficha
- Día anterior · Hoy · Día siguiente
- Imprimir o exportar (menú secundario)
- Watermark DEMO / BORRADOR visible

El modo papel debe sentirse como una **hoja clínica viva**, no como una miniatura embebida.

---

## 6. La grilla es ley

EPIS2 usa grilla clínica basada en **múltiplos de 8 px** (`theme.spacing(1) = 8` · `clinicalLayoutTokens.unit = 8`).

Todo debe alinearse: márgenes, cajas, campos, botones, chips, tabs, headers, bloques clínicos.

La simetría no es decoración: es **seguridad perceptiva**.

---

## 7. El espacio vacío también es información

**Regla composicional 80/15/5:**

- 80 % superficie neutra
- 15 % estructura clínica
- 5 % acento o acción

El color debe guiar, no decorar. Una pantalla saturada no es más completa: es menos segura.

---

## 8. Cajas sobrias, no cajas dentro de cajas

Estructura máxima recomendada:

```text
Shell → Sección → Grupo de campos → Campo
```

Profundidad visual máxima en motor: **2 niveles de card** (`maxCardNesting`).

La interfaz clínica premium se logra con orden, no con ornamento.

---

## 9. Estados clínicos siempre visibles

El usuario debe saber siempre:

- Si está en **DEMO** o entorno sintético
- Si un documento es **BORRADOR** o **APROBADO**
- Si la **IA** está disponible o degradada
- Si está en ficha electrónica o **modo papel**
- Si está editando, revisando o firmando

Estos estados deben ser visibles, persistentes y discretos. Nunca deben depender solo del color.

---

## 10. La IA debe ser silenciosa y responsable

La IA no firma. No aprueba. No reemplaza criterio clínico.

Propone, resume, ordena y sugiere. Si la IA está apagada, la ficha debe seguir funcionando (Modo A).

---

## 11. Tabulación clínica

Los datos clínicos se ordenan según su naturaleza (`ClinicalFieldGrid` · `getFieldSpan`):

| Tipo | Columnas |
|------|----------|
| Texto largo / evolución | 1 |
| Datos medianos | 2 |
| Signos vitales | 3–4 |
| Acciones | Barra separada |
| Estados | Chips discretos |

---

## 12. Navegación hacia adelante y hacia atrás

Reglas:

- Desde ficha → censo
- Desde modo papel → ficha
- Desde formulario → ficha
- Desde día clínico → día anterior / siguiente
- Ningún callejón sin salida

---

## 13. El motor decide la forma

Las pantallas **declaran**:

```ts
{
  profile: 'classic-chart',
  title: '…',
  sections: […],
  actions: [{ kind: 'primary', … }],
}
```

El **Clinical Layout Engine** decide grilla, separación, alineación, densidad, botones y overflow.

---

## 14. Componentes canónicos

| Componente manifiesto | Export / artefacto en código |
|----------------------|------------------------------|
| ClinicalScreen | `ClinicalScreen` (`@epis2/epis2-ui`) |
| ClinicalSection | `ClinicalSection` |
| ClinicalFieldGrid | `ClinicalFieldGrid` |
| ClinicalActionBar | `ClinicalLayoutActionBar` |
| ClinicalOverflowMenu | `ClinicalOverflowMenu` |
| PatientIdentityBand | `PatientIdentityBand` (apps/web) |
| ClinicalContextStrip | `ClinicalContextDenseStrip` / `ShiftContextStrip` |
| ClassicChartTabs | `ClassicChartTabs` (MF-AEST-02) |
| PaperModeScreen | `PaperModeScreen` + `PaperCanvas` |
| PaperModeToolbar | `PaperModeToolbar` + `PaperDayNavBar` |

> **Nota:** `ClinicalActionBar` en `apps/web/components/chart/` es barra de comando/modo ficha; la barra gobernada de acciones clínicas es `ClinicalLayoutActionBar`.

Todo componente nuevo debe justificar por qué no puede construirse con estos elementos.

---

## 15. Prohibiciones

Durante diseño de pantallas clásicas queda **prohibido**:

- Más de un botón primario visible
- Botones nuevos sin retirar o agrupar otros
- Dashboards dentro de ficha clásica
- Cards anidadas sin necesidad
- Modo papel como panel secundario apretado
- Ocultar estado borrador/aprobado o demo
- IA como autoridad clínica
- Color como única señal
- Scroll horizontal
- Pantallas sin retorno claro
- Features clínicas para resolver problemas estéticos
- Scripts root nuevos (script diet)
- Saltarse gates visuales

---

## 16. Gates estéticos

### Vigentes en CI

| Gate | Verifica |
|------|----------|
| `quality:aesthetic-layout-gate` | Motor + integración ClinicalScreen |
| `quality:aesthetic-action-density-gate` | Presupuesto de acciones |
| `quality:paper-mode-standalone-gate` | Papel exclusivo + nav diaria |
| `quality:classic-chart-composition-gate` | MF-AEST-02 tabs clínicos |
| `quality:clinical-command-bar-transversal-gate` | Screen Map §0 — barra NL siempre |
| `quality:clinical-navigation-clarity-gate` | MF-AEST-05 CICA Ley 5 |
| `quality:cica-screen-admission-gate` | CICA canon + checklist |
| `quality:aesthetic-reset-close` | Compuesto base |

Un diseño que no tiene gates termina siendo destruido por acumulación de buenas intenciones.

---

## 17. Criterio de belleza clínica

EPIS2 busca **belleza clínica**: claridad, calma, proporción, legibilidad, ritmo, jerarquía, confianza, continuidad, simetría, silencio visual.

Una ficha hermosa no es la que muestra más. Es la que permite ver lo importante sin esfuerzo.

---

## 18. Criterio de aceptación humano

Una pantalla del modo clásico está bien diseñada si un médico responde en **menos de cinco segundos**:

1. ¿De qué paciente se trata?
2. ¿Dónde estoy?
3. ¿Qué estado tiene el documento?
4. ¿Cuál es la acción principal?
5. ¿Cómo vuelvo?
6. ¿Estoy en demo o entorno sintético?
7. ¿La IA está activa o degradada?
8. ¿Estoy viendo ficha o papel?

Si alguna respuesta no es evidente, la pantalla debe corregirse.

---

## 19. Cierre

EPIS2 debe crecer como una ficha clínica sobria, no como una acumulación de funciones.

Cada botón agregado debe justificar su presencia. Cada caja debe justificar su borde. Cada color debe justificar su intensidad. Cada pantalla debe justificar su intención.

El Clinical Layout Engine existe para proteger a EPIS2 de la saturación visual, de la deriva de agentes y de la falsa complejidad.

EPIS2 debe sentirse como:

- Una ficha clásica
- Una hoja clínica viva
- Una herramienta médica segura
- Una interfaz calmada
- Un sistema inteligente que no grita

**La pantalla correcta no es la que impresiona. La pantalla correcta es la que permite cuidar mejor.**

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
