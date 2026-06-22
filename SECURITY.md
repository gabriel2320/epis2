# Security

EPIS2 is not certified clinical software and is not ready for production healthcare use.

- Do not commit real patient data, national identifiers, dumps, secrets, production logs, or clinical documents.
- Keep `EPIS2_AUTH_ENABLED=true` outside local development.
- Change `EPIS2_AUTH_SECRET` and local users before any shared environment.
- `EPIS2_AUTH_ALLOW_DEV_ACTOR_HEADER` is development-only.
- AI providers must remain optional and must not sign, approve, or write clinical facts.
