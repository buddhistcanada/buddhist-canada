# Buddhist Canada — Project Plan

## Purpose
A Canada-wide directory for Buddhist temples, monasteries, meditation centres, and Buddhist organizations.

## Initial scope
The directory covers all Canadian provinces and territories, with Calgary/Alberta as the initial starting point for data collection and testing.

## Core place information
- Name
- Address
- City
- Province/Territory
- Postal code
- Country
- Phone
- Email
- Website
- Latitude / longitude
- Google Maps URL
- Buddhist tradition
- Languages
- Description
- Verification status
- Last verified date
- Last updated date
- Created date

## Search
Users will be able to search/filter by:
- Name
- Address
- City
- Province/Territory
- Postal code
- Country
- Email
- Phone
- Buddhist tradition
- Verified status
- Recently updated

## Public features
1. Home/search page
2. Search results
3. Buddhist place detail page
4. Map/location view
5. Nearby places
6. Public place submission
7. Report/correct information
8. Last updated / verification display

## Admin features
1. Secure admin login
2. Add/edit/archive places
3. Review public submissions
4. Verify places
5. Manage update history
6. Search/filter records
7. Data quality review

## Data quality
Each place should retain source information and verification/update timestamps. Public submissions should enter a pending-review state rather than being published automatically.

## Proposed technology
- Next.js / React frontend
- TypeScript
- PostgreSQL database
- Server/API layer through Next.js
- Map provider integration
- GitHub for source control and CI/CD

## Development phases
### Phase 1 — Foundation
Repository structure, application shell, database schema, seed/data model.

### Phase 2 — Directory
Search, filters, results, detail pages.

### Phase 3 — Maps
Location display and nearby search.

### Phase 4 — Administration
Authentication, CRUD, verification and update history.

### Phase 5 — Community submissions
Submission workflow, review and corrections.

### Phase 6 — Launch
Testing, security, accessibility, performance and deployment.
