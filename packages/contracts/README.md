# EPIS2 Contracts

This package contains the committed OpenAPI contract exported from the FastAPI
app.

## Refresh

Use the gate:

```powershell
npm run check:contract
```

That command:

1. validates that forbidden legacy runtime tokens are absent;
2. exports `packages/contracts/openapi.json`;
3. fails if the generated contract differs from the committed file.

Manual export is available for inspection:

```powershell
python apps/api/scripts/export_openapi.py
```

## Rule

The API is the source of the contract. Do not hand-edit `openapi.json` except to
resolve generation or formatting issues that are immediately revalidated by
`npm run check:contract`.
