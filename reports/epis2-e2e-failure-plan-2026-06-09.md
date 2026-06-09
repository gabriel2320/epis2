# EPIS2 — Auditoría fallo CI E2E y plan de corrección

**Run:** [27179832033](https://github.com/gabriel2320/epis2/actions/runs/27179832033) (`95a50eb`)  
**Fecha:** 2026-06-09

---

## Resultado global

| Paso | Estado |
|------|--------|
| `check` · `pm01` · `test` · `ci-parity` · `build web` | ✅ |
| `test:e2e` | ❌ **4/10** specs fallidos · **6/10** OK |

**Conclusión:** la infraestructura CI (env API, preview, proxy, RouterProvider, gates PM01) ya está resuelta. El bloqueo restante es **drift de selectores/flags** en 4 specs E2E.

---

## Specs que pasan (6)

- `golden-command-evolution`
- `golden-draft-approval`
- `login-gateway` (×2)
- `three-modes-journey`
- `ux-g02` Parte B

---

## Fallos (4) — causa y fix

### 1. `clinical-textbox-evolution-draft.spec.ts`

| Síntoma | `getByRole('option', { name: /Médico Demo/ })` timeout en login UI |
| Causa | Spec usa login UI local; MUI `select` en preview no expone `option` igual que en dev |
| Fix | Reemplazar `loginAsMedico` local por `loginAsPhysician` de `e2e/helpers/demoPatient.ts` |

### 2–3. `ux-g02-command-first.spec.ts` (Parte A y C1)

| Síntoma | `epis2-toggle-demo-narratives` no encontrado |
| Causa | `isDemoNarrativesEnabled()` → `false` en **vite preview** (`DEV=false`, sin `VITE_ENABLE_DEMO_NARRATIVES`) |
| Fix A (CI) | En `.github/workflows/ci.yml`, build web con `VITE_ENABLE_DEMO_NARRATIVES: 'true'` |
| Fix B (preferido producto) | Refactor spec: `pinDemoCase('DEMO-001')` + powerBar `'pedir TAC de tórax'` (sin panel narrativos; Parte B ya pasa así) |

### 4. `golden-v2-admission-discharge.spec.ts`

| Síntoma | `epis2-longitudinal-admit-hospital` no encontrado tras `pinDemoCase` |
| Causa | CTA está en **panel secundario** (`PatientLongitudinalPanel`); split `historyOpen=false` por defecto → botón no visible |
| Fix | Tras `pinDemoCase`, abrir historial: `await page.getByTestId('epis2-ficha-history').click()` y luego click en admit; o navegar con comando `'ingreso hospitalario'` desde `/comando` |

---

## Plan de corrección (orden recomendado)

### Lote 1 — E2E mínimo (~1 PR, ~30 min)

1. `clinical-textbox-evolution-draft.spec.ts` → `loginAsPhysician`
2. `golden-v2-admission-discharge.spec.ts` → abrir `epis2-ficha-history` antes del CTA ingreso
3. `ux-g02-command-first.spec.ts` Parte A/C1 → quitar dependencia de narrativos demo (alinear con Parte B)

### Lote 2 — CI robustez (opcional)

4. `ci.yml`: `VITE_ENABLE_DEMO_NARRATIVES=true` en `npm run build -w @epis2/web` si se mantienen tests del panel narrativo en otros specs

### Lote 3 — Helper compartido

5. Añadir en `demoPatient.ts`:
   - `openFichaHistory(page)` 
   - `selectDemoNarrativeViaCommand(page, commandEs)` (alternativa sin flag)

### Verificación

```bash
npm run build -w @epis2/web
DATABASE_URL=... npm run test:e2e
```

---

## Otros runs recientes

| Run | Resultado | Nota |
|-----|-----------|------|
| `27179951656` feat(evolab) | ❌ lint | Evolab externalizado después |
| `27180265904` chore remove Evolab | en curso | — |
| Dependabot zod 4.x | ❌ | PR aparte; no bloquea master |

---

## Próximo paso exacto

~~Implementar **Lote 1**, commit, push y dejar CI completar (~15 min) sin cancelar.~~

**Lote 1 aplicado (2026-06-09):**

- `clinical-textbox-evolution-draft.spec.ts` → `loginAsPhysician`
- `golden-v2-admission-discharge.spec.ts` → `epis2-ficha-history` antes del CTA ingreso
- `ux-g02-command-first.spec.ts` A/C1 → `pinDemoCase('DEMO-001')` + `/comando` (sin narrativos demo)

**Run 27180606747:** 8/10 E2E OK. Quedan 2 fallos → **Lote 2 aplicado:**

- `clinical-textbox` → paste vía `ClipboardEvent` en paste-zone (sin `navigator.clipboard` en CI)
- `golden-v2` → select cama `#epis2-field-input-targetBedId` (MUI Select no expone `getByLabel`)
