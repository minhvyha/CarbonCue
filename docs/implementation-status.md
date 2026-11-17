# CarbonCue implementation status

Prepared 17 November 2026.

## Implemented and applied

- Replaced MongoDB/Mongoose and custom bcrypt/JWT authentication with Supabase Auth and Postgres. Removed old database models, drivers, and the destructive public seeding route.
- Applied the versioned schema to the existing CarbonCue project. Seeded 45 GPUs, 7 providers, 82 regions, 11 valid public educational resources, 25 recommendations, and one release each for factors and the vehicle model.
- Started fresh for private accounts, activity history, completions, and likes. Existing MongoDB production data was not deleted or imported.
- Enabled RLS and explicit table/column grants. Personal records are scoped to the authenticated user. Rewards are derived from unique completion records; request-supplied user IDs and reward amounts are not trusted.
- Added email/password sign-in, email confirmation callback, logout, password reset request, and password update flows. Removed unconfigured Google and remember-me controls.
- Built a browser worker for on-device calculations and vehicle ML. Saving recalculates the estimate in the application runtime. No Railway, hosted Python, or AI vendor inference call remains.
- Replaced monthly inputs in the daily tracker with explicit daily quantities, dates, electricity regions, methods, and provenance.
- Preserved public resources and fixed artwork URL encoding, image paths, like/unlike, course ordering, and resource failure handling.
- Fixed website KB conversion, URL parsing/async route params, renewable selection, and result handling. Connected volunteer keyword/remote filters and correct pagination; removed random attendee counts.
- Updated Next.js within version 15 to 15.5.29 and enabled build-time TypeScript checking.

## Model and scope

Compared median/linear baselines, XGBoost, CatBoost, and a compact neural regressor on 15,796 eligible EPA certification records. XGBoost was selected on validation MAE. Four make/model-family group partitions separate training, validation, calibration, and final test data.

Held-out test MAE: 20.1127 g CO2/km. RMSE: 26.3408 g/km. Empirical coverage of the nominal 90% reference interval: 87.0192%. Model download: 388,233 bytes for the compact browser export. Native Python, ONNX CPU, ONNX WebAssembly, and the JavaScript export agree on regression fixtures within 0.01 g/km.

This model estimates vehicle tailpipe CO2. It does not cover upstream fuel or manufacturing, and US certification results may differ from Australian on-road driving. Other categories use sourced calculations, not unvalidated category models. Model card and the `/methodology` page document the distinction. TabPFN was not benchmarked because a suitable browser deployment path was not established.

## Verification

- 17 regression tests cover calculators, input validation, volunteer mapping, activity units, and model/runtime parity.
- Production build and TypeScript checks pass.
- Real Supabase Data API checks with two disposable accounts passed: public reference reads, denied reference writes, anonymous private-data denial, two-user isolation, owner spoof rejection, duplicate completion prevention, and like-count updates.
- Authenticated HTTP integration checks passed: login cookies, user lookup, all feature pages, calculators, resources and their APIs, locally recomputed ML activity saves, rejected trust in forged client predictions, daily/monthly reports, and logout.
- Browser checks confirmed local worker inference, Supabase login, saved activity feedback, refreshed daily/monthly totals, the AI workload calculator with zero offsets, and repaired artwork navigation. A 390 px mobile check returned content width 390 px with no horizontal overflow.
- Disposable Auth users, their sessions, and their private test records were removed after verification.
- The initial source of the artwork failure was a client route parameter that retained percent encoding. Encoding it again produced a different resource name. The page now decodes the route parameter once before constructing API requests.

## Deployment and production configuration still required

Vercel is not connected to this chat, so no production deployment has been made. Source changes remain in the workspace. The live site continues serving its previous deployment until the new source and environment configuration are deployed.

Set these Vercel variables:

- `NEXT_PUBLIC_SUPABASE_URL=https://djkqtnwjamgfhhknbtod.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: use the existing publishable key from the CarbonCue project's API settings.
- `NEXT_PUBLIC_SITE_URL=https://carboncue.vercel.app`

Configure Supabase Auth's production site URL and allowed redirect URLs for `/auth/confirm` and local development. Confirm email delivery for signup and password recovery using an owner-controlled address. These email-delivery and production callback checks have not been completed. The application does not require a database password or service-role key.

The Supabase security advisor found no table/RLS issues. Its remaining Auth advisory is disabled leaked-password protection; that is a project Auth setting, separate from the implemented RLS policies. New indexes have informational unused-index notices because the project is new; the ownership/date and foreign-key indexes are retained.

After Vercel access is connected, create a preview, apply the environment configuration, verify Auth and the five features there, and then promote the verified deployment. Do not automatically push the current source to production with the old MongoDB-only environment.
