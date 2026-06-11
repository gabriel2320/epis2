# EPIS2 OpenClaw policies

| Perfil | Nivel | Uso |
|--------|-------|-----|
| Read-only | **L0** | Sesión manual Cursor — brief/handoff solamente |
| Verifier | **L1** | PM-03 auto-dev — brief/handoff + `safe-run` gates allowlist |

Ver:

- [epis2-readonly-policy.md](./epis2-readonly-policy.md) — L0
- [epis2-auto-dev-locks.md](./epis2-auto-dev-locks.md) — L1 candados
- [epis2-forbidden-actions.md](./epis2-forbidden-actions.md) — denylist

```bash
npm run openclaw:policy
npm run openclaw:safe-run -- --cmd "npm run check"
```
