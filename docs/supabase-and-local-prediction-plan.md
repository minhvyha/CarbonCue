# CarbonCue: Supabase and in-project prediction plan

Status: implemented locally and applied to Supabase on 17 November 2026. Vercel deployment and production Auth redirect/email-delivery verification remain pending connection/configuration.

The original plan below is retained for context. The implemented release uses a validation-selected XGBoost vehicle model trained on published EPA certification records, plus sourced factor calculations for categories without suitable training labels. Browser inference uses a compact numeric tree export verified against Python and ONNX, avoiding a large browser runtime. See `implementation-status.md` for verified outcomes and remaining deployment steps.

## Agreed direction

- Use the existing CarbonCue Supabase project, `djkqtnwjamgfhhknbtod`.
- Start fresh for accounts, activity history, recommendation completions, and artwork likes. Leave the current MongoDB deployment intact until cutover is verified.
- Preserve the public educational content and reference catalogues.
- Replace the unavailable Railway prediction service with inference bundled with this project.
- Select the strongest model that meets measured accuracy, licensing, privacy, and browser performance requirements. No model is yet trained or selected.

## What is already available

The connected Supabase account exposes the correct project. It is active and its public schema is empty. The connection supplies a project URL and publishable key, so a database password or secret key is unnecessary for normal application access.

The production GPU, provider, resources, and volunteer APIs returned HTTP 200 during inspection. A live AI calculation produced a result. These successful checks do not validate every workflow.

The tracker still calls `carboncueapi-production-7a64.up.railway.app`. The host returned HTTP 404 with `Application not found`. No training dataset, fitted model, or preprocessing pipeline is present in this checkout.

## Target architecture

1. The existing Next.js app continues to provide pages, URL analysis, and the volunteer API proxy.
2. Supabase Auth handles identity and sessions. Supabase Postgres stores application records with row level security.
3. A browser Web Worker loads a versioned model and preprocessing assets served by CarbonCue. Inference runs on the user's device. It does not call Railway, a separate Python server, or an AI vendor API.
4. Inference remains usable when the prediction backend is unreachable. Initial asset loading still needs connectivity. Offline use after a reload requires explicitly caching the runtime, model, and app assets. Saving and syncing records requires Supabase connectivity.
5. Model training runs as an offline development task. The deployed website only loads the exported model. Training code, dataset provenance, metrics, and model versions stay in the repository.

The website and database still have hosted infrastructure. The independence requirement applies to prediction serving; the URL crawler and volunteer proxy remain server-side because of browser network restrictions and upstream integration requirements.

## Phase 1: define valid prediction targets

Correct the current daily/monthly mismatch before training or importing any data. A monthly grocery bill or monthly distance cannot simply be added to a daily footprint. Store the activity period, quantity, unit, region, and measurement date explicitly. Prefer recording actual activity quantities for a particular day; any conversion from a reported monthly average must be labelled.

Define five separate category outputs in kg CO2e for the selected period: transportation, home energy, food, shopping/waste, and digital use. Each entry represents that entry's activity, rather than a repeated estimate of a person's total footprint.

Improve inputs where necessary:

- Transport: mode, actual distance, fuel/vehicle, occupancy, and actual flight distance when applicable.
- Energy: electricity or fuel quantity, billing period, state/country, and household share.
- Food: food quantities or meal frequency and period. A dollar total alone has substantial ambiguity.
- Shopping/waste: product category/quantity or mass, waste mass, treatment and recycling route.
- Digital: device, workload/duration, power assumptions, and region. Internet hours alone are insufficient for a precise footprint.

Version the feature schema. Handle missing values and unseen categories deliberately. Reject invalid values and flag inputs beyond the training range.

## Phase 2: build a defensible baseline and training data

Use versioned Australian National Greenhouse Accounts factors for the activities they cover. Use documented lifecycle sources for food, products, and digital use where those factors do not cover the relevant activity. Record factor year, units, region, system boundary, attribution, and licence.

For measured quantities, calculate emissions directly from documented factors. For incomplete activity information, evaluate ML estimation of missing quantities or category emissions against genuinely labelled examples. This hybrid approach keeps measured inputs traceable while using AI where it adds predictive value.

Audit any candidate dataset for target provenance, population coverage, synthetic generation, licence, category labels, and time period. Existing predictions are not measured ground truth. Training on formula-generated examples can validate approximation of that formula, but cannot establish real-world carbon accuracy.

Keep households/people and near-duplicate records in the same train/test group. Reserve a final test set before tuning. Use geographic and temporal holdouts when data permits. Do not manufacture five category models from one whole-person target without category labels.

## Phase 3: benchmark and select the predictor

Start with a factor baseline and a simple statistical baseline. Benchmark XGBoost, CatBoost, and a compact neural regressor on the same eligible training data. Where dataset size and licensing permit, include TabPFN-2.5 as an offline accuracy challenger. Its reported benchmark results are a reason to test it, not proof that it is best for CarbonCue.

Evaluate by category and overall using MAE and RMSE in kg CO2e, bias, error across activity ranges, and calibration of prediction intervals. Avoid relying on R2 or percentage error alone, particularly near zero emissions.

Select the deployment candidate using accuracy plus browser download size, memory, latency, compatibility, and export parity. Compare the best candidate against the baseline on the untouched test set. Report when ML adds no reliable improvement. Do not advertise a validated AI predictor if suitable labels have not been obtained.

Export a browser-compatible model and preprocessing pipeline. ONNX Runtime Web with the WebAssembly backend is the first runtime to test. Verify the actual exported operators and runtime build with a proof of concept before committing to it. CatBoost's documented ONNX export does not support models trained with categorical features; native categorical CatBoost therefore requires a different tested export/runtime route or another deployable candidate. Do not silently change preprocessing after training.

Treat a distilled smaller model as a separate candidate with its own test results. A stronger offline teacher does not automatically make its browser student equally accurate.

Proposed release gates:

- Clear target units and documented data provenance for every released category.
- Reproducible held-out metrics and a justified improvement over the relevant baseline for ML-backed outputs.
- Native/export/browser prediction parity within a documented numerical tolerance on saved fixtures.
- Validated uncertainty intervals or clearly stated uncertainty limits; no invented confidence percentage.
- A proposed initial target of less than 10 MB of model assets and less than 200 ms warm inference on a representative midrange mobile device. Measure runtime overhead separately. Revisit these targets with evidence.
- Tested handling of unknown categories, missing inputs, extremes, failed asset loading, and out-of-domain inputs.

## Phase 4: migrate data and authentication to Supabase

Create versioned SQL migrations and generated TypeScript types. Use these logical tables:

- `profiles`, if needed for application preferences, keyed to Supabase Auth users. Display names can live in Auth metadata; authorization must not use editable metadata.
- `gpus`, `providers`, and `provider_regions` for calculator reference data.
- `resources` with typed identity fields and JSON content for guides, courses, videos, research, and art.
- `activity_logs` with owner ID, period, input values/units, kg CO2e estimate, uncertainty, model/factor version, notes, and timestamps.
- `recommendations` and `recommendation_completions`, with a unique user/recommendation constraint to prevent duplicate rewards.
- `artwork_likes`, with a unique user/artwork constraint.
- `model_versions` and `emission_factor_versions` for provenance.

Enable RLS on all exposed tables. Public users may read public resources and reference data. Authenticated users can access only their own activity, profile, likes, and completions. Reference/model writes are an administrative operation. Derive reward totals from validated completions, or update them atomically; never accept arbitrary carbon savings or tree rewards from the browser.

Replace Mongoose, bcrypt/JWT login, and all MongoDB route queries with Supabase clients and Auth. Keep existing frontend response shapes where helpful to reduce UI disruption. Use server-validated identity and cookie refresh for Next.js. Remove unprotected resource writes, user creation routes, and destructive GET seeding routes as part of the replacement.

Seed public reference data and public educational content. Exclude malformed resource records and reset personal likes/history. Do not copy existing private accounts or activity logs, as a fresh start was requested.

## Phase 5: integrate local inference and verify every feature

Proposed implementation locations:

- `lib/supabase/`: browser/server clients, session support, generated database types.
- `supabase/migrations/`: schema, constraints, permissions, indexes, and seeds.
- `ml/`: dataset preparation, training, evaluation, export, and model card.
- `lib/carbon/`: shared input validation, units, factor calculations, model manifest and result types.
- `workers/carbon-predictor.worker.ts`: isolated browser inference.
- `public/models/`: released, versioned model and preprocessing assets.
- Existing `app/api/` routes and tracker components: Supabase persistence and prediction integration.

The browser estimate is informational and user-editable by nature. If server-verifiable reward or reporting decisions ever depend on an estimate, rerun the same versioned inference inside the app's trusted runtime before granting those rewards. Never trust a client-supplied model version or prediction as proof.

Verify:

- Website calculator: KB conversion, URL encoding, HTTP/HTTPS, loading/error recovery, visitor totals, and energy selection.
- AI workload calculator: GPU power, region defaults, zero offsets, g/kWh to kg/kWh conversion, validation, and provider changes. This is a workload calculator, distinct from the personal tracker predictor.
- Carbon tracker: browser inference with the old service blocked, save/reload, consistent dates/periods, daily/category/monthly totals, repeat completion handling, and sign-in/sign-out transitions.
- Volunteer hub: keyword search, supported filters, pagination, valid organization URLs, missing upstream fields, and unavailable-provider states. Supabase does not itself supply current volunteer opportunities.
- Resources: every tab, guide/course/art details, course ordering, missing records, like/unlike, and empty/error states.
- Supabase permissions: unauthenticated private-data denial and two-user isolation through the real Data API.
- Production build, TypeScript checks, targeted regression tests, and browser tests on desktop/mobile.

## Phase 6: cut over and observe

Set the project URL and publishable key in Vercel and local configuration. Configure Supabase Auth's site URL and allowed redirect URLs for production and development. Test email confirmation and password recovery. Never expose a secret/service-role key to browser code.

Deploy a preview first, run real Auth/database checks and the five-feature checklist, then deploy the verified change. Confirm production is using Supabase and that prediction does not call the old service. Keep rollback instructions and model manifests. No paid Supabase tier, hosted training service, or third-party inference subscription is assumed by this plan.

## What is needed from the owner

1. If the original training dataset, model files, or notebooks exist, provide their repository or local path and any known licence/source. They are useful for comparison, not mandatory to start the Supabase migration. Without them, selecting a suitable labelled dataset is the first ML task.
2. For eventual deployment, Vercel project access or owner-applied environment configuration. The necessary application values are the Supabase project URL and publishable key, not the database password.
3. If a future dataset or training provider requires payment or restricted access, resolve that specific dependency before using it. No such purchase is currently required.

## Sources checked

- Supabase Next.js SSR: https://supabase.com/docs/guides/auth/server-side/creating-a-client
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- ONNX Runtime Web: https://onnxruntime.ai/docs/tutorials/web/
- Browser runtime support: https://github.com/microsoft/onnxruntime/blob/main/js/web/README.md
- CatBoost export restrictions: https://catboost.ai/docs/en/concepts/python-reference_catboostregressor_save_model
- XGBoost categorical handling: https://xgboost.readthedocs.io/en/stable/tutorials/categorical.html
- TabPFN-2.5 research: https://arxiv.org/abs/2511.08667
- Australian NGA factors 2026: https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors-2026
- Volunteer provider API: https://www.volunteerconnector.org/api
