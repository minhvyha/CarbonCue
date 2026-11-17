# Website CO2e calculation implementation

Status: implemented and verified locally, 17 November 2026. The new calculator changes have not been deployed to production.

## Available methods

All three methods use pinned `@tgwf/co2` 0.19.0 with Sustainable Web Design Model v4 and `perByteTrace`.

1. **Analyse URL** collects a bounded static approximation from accessible sites. Compressed response bodies are counted consistently, while decoded HTML/CSS is used only to find references. Headers, redirect bodies and JavaScript-generated traffic are excluded. The result is always labelled partial. Collection is bounded to 40 resources, a 15-second asset window, a 10-second initial request, five redirects per request, and 10 MiB per response or decoded text.
2. **Import browser capture** parses a HAR entirely in a local Web Worker. No raw archive is uploaded, saved or sent to analytics, Supabase or a third-party parser. Each navigation is selectable; associated third-party requests are included. Limits: 50 MiB, 100,000 requests and 1,000 navigations. Only aggregate sizes, resource categories, an origin, timing span and fixed measurement warnings leave the worker. The worker is terminated after parsing; the file input is cleared.
3. **Enter data size** accepts bytes, decimal kB/MB, and binary KiB/MiB. Conversion rounds once to integer bytes. Input supports zero for a recorded cached transfer. Completeness of a manually entered size is unverified.

The results distinguish measured/supplied data from **estimated g CO2e per captured load**. A static scan is labelled per scan, rather than presented as a complete browser page load.

## Using a protected page such as MQ

1. Open the intended page normally and complete any security check yourself before recording.
2. Open Chrome DevTools > Network, turn off Preserve log, and clear unrelated traffic.
3. Choose cold cache or a normal cached load. Tick Disable cache for a cold load; leave it off for the normal cached scenario.
4. Reload once. For a standard comparison, record ten seconds from navigation without scrolling or playing video, then stop recording. Longer or interactive captures are separate scenarios.
5. Export **HAR (sanitized)**. Select the file in CarbonCue, choose a navigation and cache/activity scenario, and confirm the intended page loaded.
6. Calculate and review partial-size or failed-request warnings.

A sanitized HAR can still contain private information, which is why parsing stays local. Captures of a challenge page or unsuccessful main navigation cannot be used as a measurement of the requested page. When a document cannot be identified, a warning and explicit loaded-page confirmation are required.

No actual MQ homepage capture has been supplied or measured. The MQ URL failure and import fallback were verified, but no MQ-specific emissions figure is claimed.

## Byte handling

- Non-negative integer `response._transferSize` is preferred. Zero stays zero, including cache hits.
- Otherwise known `response.headersSize` and `response.bodySize` are summed. Negative, missing or invalid values are unknown. Any missing portion makes the result a partial known subtotal.
- `response.content.size` is a separate decoded body subtotal and is never substituted for network transfer.
- Redirect requests and repeated URLs count individually. Requests are grouped by page reference, not filtered to the main origin. Unassigned requests remain separate when named navigations exist.
- Security challenges are recognized using `cf-mitigated` and known challenge content, including base64 text. The first document's redirect chain is followed to determine navigation success.
- Incomplete durations, failed requests, streaming connections and unknown sizes are flagged. The recorded request span is not claimed to be the full observation window. WebSocket frames or later stream traffic can be absent from HAR.
- Navigation labels are generated. Archive titles, page IDs, URL credentials/paths/queries/fragments, headers, bodies and content are discarded. Imported HTML is never executed or rendered.

## Model assumptions and output

The wrapper uses explicit SWDM v4 and reports the package/model version. It uses `perByteTrace`, so cached captures do not receive a second cache/repeat-visitor discount. The result is an estimate within this data-proportional model's boundaries, not a measurement of actual electricity use or organizational emissions.

Unknown locations use CO2.js global defaults. Optional numeric grid intensities are validated in g CO2e/kWh and require a source description. Hosting energy is not inferred from a postal address or CDN IP. The user-declared 100% green-hosting option affects only data-centre operations; network, device and embodied segments remain.

CO2.js 0.19.0 returns unadjusted segmented fields alongside a hosting-adjusted total. The wrapper applies the reported hosting factor to the data-centre operational segment so the six displayed segments sum to the library's total. Regression tests cover that behavior.

Monthly kg CO2e = grams per selected scenario × monthly pageviews / 1,000. Annual kg assumes twelve equivalent months. The UI says pageviews, not visitors. No comparative ranking or unsupported accuracy percentage is shown.

At zero transferred bytes, the proportional model returns zero. The UI explains that this does not establish zero device energy or real-world emissions.

## Verification

- 37 regression tests pass, including compressed versus decoded data, genuine cached zero, unknown sizes, 304 responses, redirects, duplicate URLs, third-party assets, multiple navigations, malformed JSON, file/request limits, challenge rejection, privacy filtering, grid assumptions, model parity, and projection units.
- TypeScript and the production build pass.
- Browser verification passed for manual entry, automatic URL scanning, the live MQ security-block fallback, HAR worker import, navigation selection, cached zero, challenge rejection and stale-result clearing. A 390 px viewport had no horizontal overflow.
- A real cold-load Chrome capture of the local calculator contained 24 exported HTTP requests. DevTools and the importer agreed exactly on **904,533 transferred bytes** and **1,385,523 decoded body bytes**. DevTools later displayed six extension requests totalling another 9,783 bytes; Chrome omitted them from its sanitized HAR export. The importer correctly used only the exported requests. Three failed local subrequests (guest Auth and unavailable Vercel telemetry scripts) produced a partial warning. Minimal anonymized numeric fields are retained in `tests/fixtures/chrome-capture-minimal.har`, without raw content or headers.
- A synthetic multi-navigation fixture covers cold load, cached load and a challenge page. Its private sentinel strings did not appear in browser-rendered output. The pure parser/model test fails on any attempted `fetch`; the worker has no upload or persistence path.

## Release and remaining checks

Deploy the reviewed source through the project's Vercel workflow and repeat the three input methods on the deployment. No new database schema, password, service-role key or external prediction server is required for this feature. An actual loaded MQ capture is needed before validating a specific MQ result.

A user-operated browser extension is an optional later convenience. It is not part of this implementation.

## Sources

- [CO2.js model selection and SWDM v4](https://developers.thegreenwebfoundation.org/co2js/models/overview/)
- [CO2.js perByte](https://developers.thegreenwebfoundation.org/co2js/functions/perbyte/)
- [CO2.js perByteTrace](https://developers.thegreenwebfoundation.org/co2js/functions/perbyte-trace/)
- [CO2.js perVisit and caching assumptions](https://developers.thegreenwebfoundation.org/co2js/functions/pervisit/)
- [Sustainable Web Design Model v4 methodology](https://sustainablewebdesign.org/estimating-digital-emissions/)
- [Chrome Network panel and sanitized HAR export](https://developer.chrome.com/docs/devtools/network/reference/)
- [HAR 1.2 response size semantics](https://www.softwareishard.com/blog/har-12-spec/)
