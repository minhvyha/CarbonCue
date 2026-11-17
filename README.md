# CarbonCue

Next.js application with Supabase Auth/Postgres, local vehicle ML inference, and sourced carbon calculations. No separate Python prediction service is required.

## Run

Use Node.js 22 or 24. Copy `.env.example` to `.env.local` and set the Supabase project URL, publishable key, and site URL. No service-role key is used by the application.

```sh
npm ci
npm run dev -- --port 3101
```

Set `NEXT_PUBLIC_SITE_URL=http://localhost:3101` for that local port. In Supabase Auth, set the production site URL to `https://carboncue.vercel.app` and allow the production and localhost `/auth/confirm` redirect URLs, including the reset-password next query. Keep email confirmation enabled. Auth callbacks accept either PKCE codes or Supabase token hashes. Password reset pages are included.

## Database

Apply `supabase/migrations/20261117060424_carboncue_supabase.sql`, then `supabase/seed.sql`. The migration was applied to the CarbonCue Supabase project in this workspace. Use the generated types in `lib/supabase/database.types.ts`. Public resources/reference data can be read by visitors; personal records are protected by RLS. Recommendation completion is unique per user/recommendation; totals are derived from completions. Public artwork counts contain no user identifiers.

Seeding is a development/admin operation, never a public GET route. `data/public-seed.json` is the preserved public-content snapshot, excluding old accounts/history/likes. Run `node scripts/build-seed-sql.mjs` to regenerate SQL after changing it. No MongoDB configuration is needed.

## Predictions

Vehicle specification estimates run in a browser worker using a versioned XGBoost export. Model assets cache after loading. Saving requires connectivity and recalculates the estimate on the server before storage. Other categories use sourced factor calculations. Every result shows its method, source version, and covered emissions. Inputs cover the selected day, not monthly quantities silently added to daily totals.

See [model card](ml/MODEL_CARD.md), [training code](ml/train_vehicle.py), `/methodology`, and the bundled manifest for evaluation and limitations. Training is an offline development step, not a hosted service. A compact tree evaluator was chosen after verifying agreement with ONNX, to avoid requiring a large browser runtime for a small model.

## Website calculator

All three methods use pinned CO2.js 0.19.0, Sustainable Web Design Model v4, and `perByteTrace`. Choose a limited automatic URL scan, a local browser HAR capture, or a manual transferred size with explicit byte/kB/MB/KiB/MiB units. Results show the byte basis, scenario, six emissions segments, model assumptions and pageview projections. No additional caching reduction is applied to captured bytes.

For protected pages such as MQ, open the real page normally first. In Chrome DevTools > Network, clear previous requests, turn off Preserve log, choose the cache scenario, reload once, wait for the intended content, then export HAR (sanitized). Import it, select one navigation and confirm the intended page loaded. A standard comparison records ten seconds without scrolling or video; different interactions are separate scenarios.

HAR import runs entirely in a browser worker, requires no account, and uploads or saves none of the raw archive. Limits are 50 MiB, 100,000 requests and 1,000 navigations. It retains only byte aggregates and an origin, never private headers, content, paths or queries. Zero-byte cache hits stay zero; unknown sizes produce a partial known subtotal. Challenge or unsuccessful main documents cannot be calculated as the requested page. See [implementation and verification notes](docs/website-carbon-calculation-plan.md).

## Verify

```sh
npm test
npm run typecheck
npm run build
```

`node scripts/verify-supabase.mjs` exercises the live Data API with two temporary test accounts configured in `/tmp/carboncue-auth-fixture.json`. It checks public reads, denied writes, private-data isolation, duplicate completions, owner spoofing, and artwork counts. Create disposable confirmed users in a development project to reuse this test, then remove them and their test data. Never use real credentials in that fixture.

For deployment, set the same public Supabase values in Vercel. Set the site URL separately for each environment to match the domain used for signup/recovery; allow the exact preview callback while testing a preview. For production, use the production site URL, deploy a preview, and verify Auth and all five features before promoting it. Email delivery and Auth redirect settings require project configuration in addition to a passing local build.
