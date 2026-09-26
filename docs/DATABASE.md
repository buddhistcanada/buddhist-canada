# Database design

The initial PostgreSQL model is in `database/schema.sql`.

## Main entities

- `buddhist_places`: canonical directory records
- `place_update_history`: audit trail for changes
- `place_submissions`: public submissions awaiting review

## Canada coverage

`province_territory` supports every Canadian province and territory. The application should validate the value against the official Canada province/territory list rather than hard-coding Calgary as the geographic limit.

## Data freshness

`last_updated_at` changes whenever a directory record is edited. `last_verified_at` records the most recent verification separately so users can distinguish an edit from a verification.
