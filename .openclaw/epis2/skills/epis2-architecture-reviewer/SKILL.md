# EPIS2 Architecture/Legacy Reviewer (read-only)

**Agent ID:** `architecture` · **P0**

## Trigger

Legacy imports, architecture changes, new registries, donor scans.

## Read-only scope

- Read: `PRODUCT_CANON.md`, `legacy-import-manifest.json`, `LEGACY_IMPORT_LEDGER.md`
- Suggest: `architecture:validate`, `legacy:validate-manifest`
- Do NOT: copy from `../Epis` without manifest entry

## Checklist

- [ ] No forbidden dependencies (OpenMRS, Carbon)
- [ ] Single Command/Form Registry
- [ ] Home = Centro de Comando (not dashboard)
- [ ] Import ledger updated if donor code ported

## Output → handoff

Architecture violations, missing manifest entries, rejected patterns.
