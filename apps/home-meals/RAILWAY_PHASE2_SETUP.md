# Home Meals Phase 2 — Railway runtime

Home Meals Phase 2 uses the existing Railway service plus a private Railway Postgres database.

## Required Railway variables on `home-meals-web`

- `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- `HOME_MEALS_SYNC_SECRET=<long random signing secret>`
- `HOME_MEALS_HOUSEHOLD_CODE=<short private code Josh + G enter once per device>`
- `OPENAI_API_KEY=<server-only API key>`
- optional `OPENAI_MODEL=gpt-5.6-luna`
- optional `OPENAI_VISION_MODEL=gpt-5.6-luna`
- optional `OPENAI_REALTIME_MODEL=gpt-realtime-2.1-mini`

`DATABASE_URL` should point at the private Railway Postgres service in the same project/environment. The application creates the `home_meals_household_state` table and index automatically on first authenticated sync request.

No database port needs to be exposed publicly.

## Privacy / behavior

- Browser state remains local-first and works offline.
- Meal photo data URLs are deliberately excluded from cross-device JSON sync.
- Household sync uses optimistic version numbers and stops on conflicts rather than silently overwriting another device.
- Incoming remote state is deferred during an active cooking route.
- Camera/receipt vision never writes Kitchen stock automatically; every proposed stock change requires an explicit confirmation tap.
- OpenAI credentials stay server-side. Browser clients only call Home Meals API routes.
