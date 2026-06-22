# EPIS2 Legacy Pointers

This reset does not keep a copy of old EPIS2 inside the new tree. Use these
pointers for forensics only.

## Git Pointers

- Safety tag: `epis2-pre-mono-reset`
- Reset branch: `codex/epis2-mono-reset`
- Reset commit: `e9bfbf66`
- Previous active commit: `ade5f4b122505a836fe69c5253846b1dd9144931`
- Local stash: `pre-mono-reset-cica-local-changes`

Examples:

```powershell
git show epis2-pre-mono-reset:docs/EPIS2_CURRENT_STATE.md
git show epis2-pre-mono-reset:README.md
git stash list
git stash show --stat stash^{/pre-mono-reset-cica-local-changes}
```

The stash is local-only unless a human exports it. Do not assume it exists on a
fresh clone.

## OneEpis Donor

- Local donor path: `C:\Users\gdela\OneDrive\Documentos Importantes\OneEpis`
- Donor commit inspected: `7fd4b9fd902940c99b66fc5c02f9b545267deaeb`

OneEpis is a read-only donor reference. Do not alter it from EPIS2 work.

## Rehydration Rule

Do not rehydrate legacy code into active runtime without a new explicit migration
decision. Prefer translating lessons into current EPIS2 models, schemas,
endpoints, screens, and tests.
