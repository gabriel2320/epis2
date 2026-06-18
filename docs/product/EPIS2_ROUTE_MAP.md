# EPIS2 — Mapa de rutas CICA

**Versión:** 1.0 · **Programa:** PROG-PRODUCT-MAP · **SoT técnico:** `EPIS_CICA_SCREEN_REGISTRY.ts`

> Generado por `node tools/catalog/export-route-map.mjs`. No editar la tabla manualmente.

## Entrada operativa

| Rol | Ruta / prefijo |
|-----|----------------|
| Entrada activa CICA | `/app/buscar` |
| Fallback legacy | `/espacio/*` (`VITE_ENABLE_CICA_UI=false`) |

## Regla de visibilidad

```txt
KEEP_CANONICAL — navVisible !== false (sidebar CICA)
HIDE_STUB      — navVisible === false (ruta viva, sin nav)
KEEP_FALLBACK  — legacy /espacio/*
```

<!-- EPIS2_ROUTE_MAP:BEGIN -->
| Ruta | screenId | Estado | Nav | layoutProfile | Intención |
|------|----------|--------|-----|---------------|-----------|
| /app/buscar | patient-search | KEEP_CANONICAL | sí | patient-search | Encontrar paciente y abrir ficha |
| /app/censo | census | KEEP_CANONICAL | sí | census | Elegir paciente desde lista clínica |
| /app/recientes | recent-patients | HIDE_STUB | no | census | Retomar pacientes abiertos recientemente |
| /app/mi-trabajo | my-work | HIDE_STUB | no | census | Revisar pendientes del profesional |
| /app/agenda | agenda | HIDE_STUB | no | census | Consultar agenda de guardia |
| /app/pacientes/:patientId/evoluciones/nueva | new-evolution | KEEP_CANONICAL | sí | letter-document | Escribir evolución clínica |
| /app/pacientes/:patientId/evoluciones/libro | evolution-book | KEEP_CANONICAL | sí | book-reader | Leer evoluciones como libro clínico |
| /app/pacientes/:patientId/evoluciones/:evolutionId | evolution-detail | KEEP_CANONICAL | sí | letter-document | Leer una evolución en página carta |
| /app/pacientes/:patientId/evoluciones | patient-evolutions | KEEP_CANONICAL | sí | classic-chart | Revisar historia evolutiva |
| /app/pacientes/:patientId/indicaciones/nueva | new-prescription | KEEP_CANONICAL | sí | letter-document | Escribir prescripción médica |
| /app/pacientes/:patientId/documentos/nuevo | new-document | KEEP_CANONICAL | sí | letter-document | Emitir certificado médico |
| /app/pacientes/:patientId/epicrisis/nueva | new-epicrisis | KEEP_CANONICAL | sí | letter-document | Redactar epicrisis de alta |
| /app/pacientes/:patientId/ingreso | patient-admission | KEEP_CANONICAL | sí | classic-chart | Revisar datos de ingreso clínico |
| /app/pacientes/:patientId/medicamentos | patient-medications | KEEP_CANONICAL | sí | classic-chart | Revisar receta y fármacos activos |
| /app/pacientes/:patientId/interconsultas | patient-interconsultas | KEEP_CANONICAL | sí | classic-chart | Gestionar interconsultas del episodio |
| /app/pacientes/:patientId/procedimientos | patient-procedures | KEEP_CANONICAL | sí | classic-chart | Revisar procedimientos y pabellón |
| /app/pacientes/:patientId/alta | patient-discharge | KEEP_CANONICAL | sí | classic-chart | Preparar epicrisis y alta |
| /app/pacientes/:patientId/timeline | patient-timeline | KEEP_CANONICAL | sí | classic-chart | Recorrer línea de tiempo clínica |
| /app/pacientes/:patientId/auditoria | patient-audit | KEEP_CANONICAL | sí | classic-chart | Auditar trazas y accesos |
| /app/pacientes/:patientId/papel/dia/:date | paper-day | KEEP_CANONICAL | sí | paper-mode | Leer hoja clínica diaria |
| /app/pacientes/:patientId/papel/libro | paper-book | KEEP_CANONICAL | sí | paper-mode | Recorrer libro clínico del episodio |
| /app/pacientes/:patientId/resumen | patient-summary | KEEP_CANONICAL | sí | classic-chart | Comprender situación clínica del paciente |
| /app/pacientes/:patientId/indicaciones | patient-orders | KEEP_CANONICAL | sí | classic-chart | Revisar y agregar indicaciones |
| /app/pacientes/:patientId/examenes | patient-exams | KEEP_CANONICAL | sí | results | Revisar resultados y tendencias |
| /app/pacientes/:patientId/documentos | patient-documents | KEEP_CANONICAL | sí | classic-chart | Revisar documentos clínicos |
<!-- EPIS2_ROUTE_MAP:END -->

**Pantallas:** 25 · **Checksum JSON:** `e582d887b337`
