# EPIS2 — Auditoría de brechas catálogo producto completo

> **Nota MF-152:** WIDGET-01 y documentos UI ya implementados (V0–V5). Ver `docs/product/EPIS2_SCREEN_CONNECTION_MAP.md` §7 y `reports/epis2-comprehensive-audit-2026-06-05.md`.

**Fecha:** 2026-06-05  
**Alcance:** Auditoría frente al catálogo command-first (pantallas A–Q); **sin implementación masiva**.  
**Commit de referencia:** `origin/master` post Planes A–G  
**Gates verificados:** `check` ✓ · **228 tests** ✓ · `db:validate` (22 migraciones) ✓

---

## 1. Resumen ejecutivo

EPIS2 cumple el **modelo arquitectónico inmutable**: Centro de Comando como home, un solo Command Registry, un solo Form Registry, pipeline borrador→aprobación, IA local asistiva sin escritura final. El repositorio es **sano para demo técnica y piloto controlado**; **no está listo para producción clínica real**.

La brecha principal no es arquitectura sino **cobertura de catálogo**: ~28 % de pantallas y ~12 % de formularios del inventario producto completo están implementados. Lo existente concentra el **núcleo command-first V0** (evolución, receta, epicrisis, búsqueda, tablero secundario) más **slices demo V1–V5** (longitudinal, inpatient API, enfermería/farmacia, interop, IA trazable).

**Veredicto:** continuar por **olas secuenciales**; próxima rama única = **Ola 1 núcleo shell** (widgets, sesión, microcopy IA).

---

## 2. Cobertura por dominio (%)

| Dominio | Cobertura | Estado dominante |
|---------|-----------|------------------|
| Acceso y sesión | 22 % | PARTIAL |
| Centro de Comando | 58 % | PARTIAL |
| Paciente | 28 % | PARTIAL |
| Atención médica | 42 % | PARTIAL |
| Documentación clínica | 38 % | PARTIAL |
| Órdenes | 18 % | MISSING |
| Resultados | 8 % | MISSING |
| Medicamentos | 32 % | PARTIAL |
| Hospitalización | 35 % | PARTIAL |
| Enfermería | 33 % | PARTIAL |
| Farmacia | 28 % | PARTIAL |
| Documentos / búsqueda | 22 % | PARTIAL |
| IA local (UI clínica) | 48 % | PARTIAL |
| Modo tablero | 52 % | PARTIAL |
| Administración | 5 % | MISSING |
| Interoperabilidad / Chile | 30 % | PARTIAL |

**Global ponderado:** ~**28 %** del catálogo de pantallas.

---

## 3. Inventario técnico actual

| Artefacto | Cantidad |
|-----------|----------|
| Rutas web productivas | 18 + fallback |
| Páginas montadas | 9 (+ 2 dev gated) |
| Blueprints | 11 |
| Comandos | 17 |
| Tabs tablero | 6 |
| Golden journeys API | V0–V5 |
| Migraciones DB | 22 |

---

## 4. Fortalezas (sin brecha)

- Home `/comando` — gate arquitectónico verificado.
- Pipeline completo evolución: comando → borrador → aprobación → auditoría.
- Registries únicos; sin OpenMRS, Carbon ni dashboard home.
- IA con fallback, timeout, schema Zod, `ai_runs`, rate limits.
- Modo tablero secundario con retorno a Comando.
- `ClinicalShellLayout` — anatomía común clínica.
- CI: Postgres, golden journeys, audit prod deps, dependabot.
- Plan F signoff GO DEMO documentado.

---

## 5. Brechas críticas (P1)

| ID | Brecha | Impacto |
|----|--------|---------|
| B1 | ~72 % pantallas catálogo sin implementar | Esperado MVP; plan por olas |
| B2 | Ingreso: comando sin blueprint/formulario | Cadena incompleta |
| B3 | Resultados clínicos sin UI | Dominio ausente |
| B4 | WIDGET-01 no montado | Comando sin widgets contextuales |
| B5 | Microcopy «Ollama» en UI clínica | Viola regla divulgación |
| B6 | Admin / usuarios / roles sin UI | Operación limitada |

---

## 6. Brechas moderadas (P2)

| ID | Brecha |
|----|--------|
| B7 | Documentos: API sin pantallas |
| B8 | Traslado/alta sin formularios |
| B9 | Comandos faltantes: traslado, pendientes, revisa medicamentos |
| B10 | Resumen blueprint estático vs API longitudinal |
| B11 | `router validateSearch` sin tabs nursing/pharmacy |
| B12 | Nomenclatura rutas (`/espacio` vs `/trabajo`) |

---

## 7. Duplicidades

| Hallazgo | Resultado |
|----------|-----------|
| Segundo Command Registry | **Ninguno** |
| Segundo Form Registry | **Ninguno** |
| Dashboard compite con Comando | **Ninguno** |
| Rutas duplicadas mismo blueprint | **Ninguno** |

---

## 8. Cadenas incompletas (top 7)

1. `admit_patient_hospital` → dashboard → API → **sin blueprint**
2. Órdenes lab/imagen → borrador → **sin resultados**
3. Document intake API → **sin UI ni comando**
4. Transfer/discharge API → **sin comando/form**
5. Widgets registry → **sin superficie Comando**
6. Resumen → campos demo → **no live longitudinal**
7. Comandos catálogo (pendientes, meds) → **sin intent**

Detalle: `docs/product/EPIS2_SCREEN_CONNECTION_MAP.md`

---

## 9. Evaluación productividad / sobrecarga

| Pantalla | Veredicto |
|----------|-----------|
| Centro de Comando | ✓ Aceptable |
| Formularios clínicos | ✓ Una tarea |
| Ficha paciente | ◐ Panel IA visible — colapsar |
| Tablero | ◐ 6 tabs — OK como secundario |
| Login | ✓ |

Reglas: `docs/product/EPIS2_PRODUCTIVITY_AND_DISCLOSURE_RULES.md`

---

## 10. Evaluación IA Ollama

| Criterio | OK |
|----------|-----|
| Funciona sin Ollama | ✓ |
| No SQL / no aprueba / no firma / no SoT | ✓ |
| Schema + timeout + fallback | ✓ |
| Auditoría runs | ✓ |
| Fuentes RAG | ✓ |
| Sin Ollama en UI clínica | **✗** copy pendiente |
| Pantallas técnicas restringidas | ✓ (ausentes = correcto demo) |

Detalle: `docs/intelligence/EPIS2_OLLAMA_UI_AND_SAFETY_MAP.md`

---

## 11. Ola 0 — estado bloqueadores

| Ítem | Estado |
|------|--------|
| PostgreSQL CI | ✓ Cerrado Plan G |
| Golden journey CI | ✓ V0–V5 |
| Signoff GO DEMO | ✓ Plan F |
| Drizzle vulnerabilidad | ◐ Verificar advisory |
| Vitest GHSA (dev) | ○ Upgrade 4.x pendiente |

---

## 12. Entregables generados

| Documento | Ruta |
|-----------|------|
| Catálogo pantallas | `docs/product/EPIS2_COMPLETE_SCREEN_CATALOG.md` |
| Catálogo formularios | `docs/product/EPIS2_COMPLETE_FORM_CATALOG.md` |
| Mapa conexiones | `docs/product/EPIS2_SCREEN_CONNECTION_MAP.md` |
| Reglas productividad | `docs/product/EPIS2_PRODUCTIVITY_AND_DISCLOSURE_RULES.md` |
| Roadmap completitud | `docs/product/EPIS2_COMPLETION_ROADMAP.md` |
| Mapa IA/Ollama | `docs/intelligence/EPIS2_OLLAMA_UI_AND_SAFETY_MAP.md` |
| Este reporte | `reports/epis2-complete-product-gap-audit.md` |

---

## 13. Próxima rama exacta (única)

```text
epis2-ola1-core-shell
```

**Entregables:**
1. WIDGET-01 en Comando y ficha (visibilidad reglas).
2. Pantalla sesión expirada + 403 unificado.
3. Microcopy IA sin «Ollama».
4. Fix deep-link tabs nursing/pharmacy.
5. Addendum `SCOPE_V1.md` para slices demo.

**No iniciar** Ola 2 (ingreso blueprint) en la misma rama.

---

## 14. Gates requeridos al cerrar próxima rama

```bash
npm run check
npm run test
npm run db:validate
npm run quality:golden-journey
```

---

## 15. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Confundir slices con EHR completo | Este catálogo + % cobertura |
| Refactor rutas prematuro | Ola nomenclatura DEFERRED |
| Widgets sobrecargan Comando | `resolveWidgetVisibility` |
| IA marca técnica visible | Corregir copy Ola 1 |
| Declarar producción | **Prohibido** hasta Ola 8 |

---

## 16. Commit sugerido (solo documentación)

```text
docs(product): auditoría catálogo completo EPIS2 y roadmap por olas

Inventario de pantallas, formularios, conexiones e IA frente al modelo
command-first. Cobertura ~28 %. Próxima rama: epis2-ola1-core-shell.
```

---

## 17. Declaración de alcance

- **No** se implementaron múltiples dominios en esta sesión.
- **No** se cambió la arquitectura EPIS2.
- **No** se declaró producción clínica.
- Todo el entregable está en **español**.

**Frase guía:** *EPIS2 debe mostrar únicamente la herramienta necesaria para completar la actividad clínica actual.*
