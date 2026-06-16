# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| `master` (demo v0.1+) | Security fixes for demo/dev stack only |
| Legacy EPIS (`../Epis`) | Out of scope — separate repository |

EPIS2 is **not production-ready for real patient care**. See [`DISCLAIMER.md`](DISCLAIMER.md).

## Reporting a vulnerability

**Do not** open a public GitHub issue for sensitive security reports.

1. Email the maintainer with subject `EPIS2 Security` (use the contact on the GitHub profile for this repository).
2. Include: description, reproduction steps, affected component (`apps/api`, `apps/web`, etc.), and impact assessment.
3. Allow reasonable time for triage before public disclosure.

We will acknowledge receipt and coordinate a fix or mitigation on `master` when applicable.

## Scope notes

| In scope | Out of scope |
|----------|--------------|
| Auth bypass, session fixation, RLS bypass in EPIS2 API | Vulnerabilities in third-party deps without EPIS2-specific exploit path |
| Demo auth enabled in `staging`/`production` (misconfiguration) | Issues in sibling repos (epis2-evolab, MedRepo) unless EPIS2 integration |
| Accidental PHI in repo or logs | Social engineering against demo credentials in public docs |

## Safe development

- Use **synthetic data only** — see [`docs/auth/DEMO_USERS.md`](docs/auth/DEMO_USERS.md).
- Never commit `.env`, secrets, or real patient identifiers.
- Run `npm run quality:fast` before pushing; pre-PR: `npm run quality:required`.

Operational hardening: [`docs/ops/RLS_STAGING_RUNBOOK.md`](docs/ops/RLS_STAGING_RUNBOOK.md) · [`docs/CONSOLIDATION_FREEZE.md`](docs/CONSOLIDATION_FREEZE.md).
