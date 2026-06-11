# EPIS2 forbidden actions (OpenClaw)

| Action | Reason |
|--------|--------|
| `git commit` / `git push` | Human-only; PM-03 requires `EPIS2_AUTO_DEV_AUTHORIZED` |
| Read `.env` | Secrets; use `.env.example` keys only |
| Import EPIS folders | Requires manifest + ledger |
| Auto-approve drafts | Invariant #11–13: IA no aprueba ni firma |
| Write to PostgreSQL SoT | Borradores ≠ datos aprobados |
| Enable writeback / pilot flags | Out of scope EPIS2 v1 |
| OpenMRS / Carbon dependencies | Rejected patterns |
