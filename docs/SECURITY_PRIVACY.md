# Security and Privacy

EPIS2 must not receive real patient data during development.

- Use synthetic patients only.
- Keep local credentials local.
- Change `EPIS2_AUTH_SECRET` before shared environments.
- Keep audit enabled for clinical writes.
- AI providers are optional and local-first.
- Do not send clinical data to third parties without explicit safety review.

## Dependency Audit

- `npm audit --omit=dev` currently reports a moderate PostCSS advisory through
  Next.js 16.2.9's internal `postcss@8.4.31` dependency.
- npm reports 16.2.9 as the latest stable Next.js release in this workspace.
- Do not run `npm audit fix --force` for this finding: it proposes a breaking
  downgrade to Next 9. Track the next stable Next.js release instead.
