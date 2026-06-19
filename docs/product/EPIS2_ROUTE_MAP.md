# EPIS2 - Mapa de rutas CICA

**Version:** 1.1 - **Programa:** PROG-PRODUCT-MAP - **SoT tecnico:** `EPIS_CICA_SCREEN_REGISTRY.ts`

> Generado por `node tools/catalog/export-route-map.mjs`. No editar la tabla manualmente.

## Entrada operativa

| Rol | Ruta / prefijo |
|-----|----------------|
| Entrada activa CICA | `/app/buscar` |
| Fallback legacy | `/espacio/*` (`VITE_ENABLE_CICA_UI=false`) |

## Regla de visibilidad y clasificacion

```txt
KEEP_CANONICAL - navVisible !== false (sidebar CICA)
HIDE_STUB      - navVisible === false (ruta viva, sin nav)
KEEP_FALLBACK  - legacy /espacio/*

core-read     - pantalla clinica tradicional de lectura
core-write    - pantalla clinica de escritura/borrador
paper         - modo papel carta/libro
stub-review   - ruta viva sin nav; revisar antes de promover
```

<!-- EPIS2_ROUTE_MAP:BEGIN -->
| Ruta | screenId | Estado | Clase | Modo | Nav | layoutProfile | Intencion |
|------|----------|--------|-------|------|-----|---------------|-----------|
| /app/buscar | patient-search | KEEP_CANONICAL | core-read | classic | si | patient-search | Encontrar paciente y abrir ficha |
| /app/censo | census | KEEP_CANONICAL | core-read | classic | si | census | Elegir paciente desde lista clínica |
| /app/recientes | recent-patients | HIDE_STUB | stub-review | stub | no | census | Retomar pacientes abiertos recientemente |
| /app/mi-trabajo | my-work | HIDE_STUB | stub-review | stub | no | census | Revisar pendientes del profesional |
| /app/agenda | agenda | HIDE_STUB | stub-review | stub | no | census | Consultar agenda de guardia |
| /app/pacientes/:patientId/evoluciones/nueva | new-evolution | KEEP_CANONICAL | core-write | letter | si | letter-document | Escribir evolución clínica |
| /app/pacientes/:patientId/evoluciones/libro | evolution-book | KEEP_CANONICAL | core-read | letter | si | book-reader | Leer evoluciones como libro clínico |
| /app/pacientes/:patientId/evoluciones/:evolutionId | evolution-detail | KEEP_CANONICAL | core-read | letter | si | letter-document | Leer una evolución en página carta |
| /app/pacientes/:patientId/evoluciones | patient-evolutions | KEEP_CANONICAL | core-read | classic | si | classic-chart | Revisar historia evolutiva |
| /app/pacientes/:patientId/indicaciones/nueva | new-prescription | KEEP_CANONICAL | core-write | letter | si | letter-document | Escribir prescripción médica |
| /app/pacientes/:patientId/documentos/nuevo | new-document | KEEP_CANONICAL | core-write | letter | si | letter-document | Emitir certificado médico |
| /app/pacientes/:patientId/epicrisis/nueva | new-epicrisis | KEEP_CANONICAL | core-write | letter | si | letter-document | Redactar epicrisis de alta |
| /app/pacientes/:patientId/ingreso | patient-admission | KEEP_CANONICAL | core-read | classic | si | classic-chart | Revisar datos de ingreso clínico |
| /app/pacientes/:patientId/medicamentos | patient-medications | KEEP_CANONICAL | core-read | classic | si | classic-chart | Revisar receta y fármacos activos |
| /app/pacientes/:patientId/interconsultas | patient-interconsultas | KEEP_CANONICAL | core-read | classic | si | classic-chart | Gestionar interconsultas del episodio |
| /app/pacientes/:patientId/procedimientos | patient-procedures | KEEP_CANONICAL | core-read | classic | si | classic-chart | Revisar procedimientos y pabellón |
| /app/pacientes/:patientId/alta | patient-discharge | KEEP_CANONICAL | core-read | classic | si | classic-chart | Preparar epicrisis y alta |
| /app/pacientes/:patientId/timeline | patient-timeline | KEEP_CANONICAL | core-read | classic | si | classic-chart | Recorrer línea de tiempo clínica |
| /app/pacientes/:patientId/auditoria | patient-audit | KEEP_CANONICAL | core-read | classic | si | classic-chart | Auditar trazas y accesos |
| /app/pacientes/:patientId/papel/dia/:date | paper-day | KEEP_CANONICAL | paper | paper | si | paper-mode | Leer hoja clínica diaria |
| /app/pacientes/:patientId/papel/libro | paper-book | KEEP_CANONICAL | paper | paper | si | paper-mode | Recorrer libro clínico del episodio |
| /app/pacientes/:patientId/resumen | patient-summary | KEEP_CANONICAL | core-read | classic | si | classic-chart | Comprender situación clínica del paciente |
| /app/pacientes/:patientId/indicaciones | patient-orders | KEEP_CANONICAL | core-read | classic | si | classic-chart | Revisar y agregar indicaciones |
| /app/pacientes/:patientId/examenes | patient-exams | KEEP_CANONICAL | core-read | classic | si | results | Revisar resultados y tendencias |
| /app/pacientes/:patientId/documentos | patient-documents | KEEP_CANONICAL | core-read | classic | si | classic-chart | Revisar documentos clínicos |
<!-- EPIS2_ROUTE_MAP:END -->

**Pantallas:** 25 - **Checksum JSON:** `a242af0471d0`
