# MF-CM-08 — Signoff barra comando inteligente

**Fecha:** 2026-06-11 · **Estado:** DONE  
**Programa:** PROG-BARRA-COMANDO · **Gate:** `quality:cm-08-signoff-gate` · **E2E:** `test:e2e:ux-g02`

## Criterios de signoff

| Evidencia | Implementación | Estado |
|-----------|----------------|--------|
| NL libre ≥90% suite demo | `clinical-phrase-suite-50` + colloquial + top-10 (`cm-07`) | ✓ |
| Ctrl+K <1s en ficha | E2E Parte D + unit `ClinicalShellCommandPalette` | ✓ |
| Panel IA útil en piloto | `EpisClinicalContextAiSection` + sugerencias (`cm-05`) | ✓ |
| Flujo CE-0→CE-5 | `quality:ux-g02` 9/9 + E2E Partes A–C | ✓ |

## Cadena CM cerrada

MF-CM-01 … MF-CM-08 DONE — barra NL unificada, paleta Ctrl+K, assist-route, contexto, panel IA, assist borrador, evals coloquiales, signoff.

## Verificación

```bash
npm run quality:cm-08-signoff-gate
# E2E completo (requiere stack):
npm run stack:dev
$env:EPIS2_E2E_SIGNOFF="1"; npm run quality:cm-08-signoff-gate
# o directo:
npm run test:e2e:ux-g02
npm run quality:experiencia-core-signoff-gate   # global A+B+C
```

## Evidencia manual (piloto)

- Recorrido 15 min: comando NL → confirmación → borrador → panel IA → Ctrl+K
- Degradación sin Ollama: formulario manual + candidatos guiados

## Próximo

**SIGNOFF-EXPERIENCIA-CORE** → `PROG-STRENGTHEN-2026` y backlog Chile.
