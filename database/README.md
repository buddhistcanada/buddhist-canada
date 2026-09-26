# Database setup

The PostgreSQL schema is in `migrations/001_initial.sql`.

## Required environment variable

```text
DATABASE_URL=postgresql://...
```

Never commit `DATABASE_URL`, database passwords, API keys, or other secrets to GitHub. Configure them in the deployment platform's encrypted environment/secrets settings.

## Migration

Run the SQL migration against the PostgreSQL database before enabling persistent CRUD operations.

## Data integrity

- New places start as `pending`.
- A place can only be marked `verified` after source information is checked by an administrator.
- Updates are recorded in `place_update_history`.
- Public submissions remain `pending` until reviewed.
