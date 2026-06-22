# Security

EPIS2 is not certified clinical software and is not ready for production
healthcare use.

## Do Not Commit

- real patient data or PHI;
- national identifiers;
- production logs or database dumps;
- clinical documents from real care;
- secrets, tokens, private keys, or `.env` files;
- screenshots containing real patient data.

## Runtime Rules

- Keep `EPIS2_AUTH_ENABLED=true` outside local-only experiments.
- Change `EPIS2_AUTH_SECRET` and local users before any shared environment.
- Keep `EPIS2_AUTH_ALLOW_DEV_ACTOR_HEADER=false` outside local tests.
- All clinical writes must go through the API and emit audit events.
- AI providers must remain optional and must not sign, approve, or write clinical facts.

See `docs/SECURITY_PRIVACY.md` for the detailed project policy and current
dependency audit note.
