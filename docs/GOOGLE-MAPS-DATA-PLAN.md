# Google Maps and Real-Data Plan

## Goal
Connect each Buddhist Place record to map coordinates and a map URL, while keeping contact data traceable and reviewable.

## Place data workflow
1. Collect a candidate place from an official/public source.
2. Record name, address, city, province/territory, phone, email and website where available.
3. Add latitude/longitude and a map URL after location verification.
4. Mark the record `verified=false` until an administrator reviews it.
5. Record the verification date and source.
6. Publish only reviewed records as verified.

## Important data-quality rule
The application must not invent missing phone numbers, emails, addresses or map coordinates. Empty fields should remain empty until a reliable source supplies the information.

## Map implementation
The application data model already includes `latitude`, `longitude`, and `google_maps_url`. A map UI can use those fields to show a place and nearby places.

## Next implementation
- Map component
- Province/city filters
- Distance/nearby search
- Source URL and source name fields
- Admin verification workflow
- Real Canadian Buddhist-place dataset, beginning with Calgary and expanding nationwide
