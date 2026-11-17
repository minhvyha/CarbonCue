import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { MAX_HAR_BYTES, MAX_HAR_ENTRIES, parseHar } from '../lib/website-har';
import { calculateEmissions } from '../lib/website-emissions';

function entry(response: Record<string, unknown> = {}, rest: Record<string, unknown> = {}) {
  return { pageref: 'page-1', startedDateTime: '2026-11-17T00:00:00Z', time: 100,
    request: { url: 'https://example.com/', method: 'GET' },
    response: { status: 200, headersSize: 100, bodySize: 900, content: { mimeType: 'text/html', size: 9000 }, ...response }, ...rest };
}
function archive(entries: unknown[], pages: unknown[] = [{ id: 'page-1', title: 'Private title' }]) {
  return JSON.stringify({ log: { version: '1.2', creator: { name: 'Chrome' }, pages, entries } });
}

test('HAR prefers recorded transfer size and keeps decoded size separate', () => {
  const page = parseHar(archive([entry({ _transferSize: 500 })])).navigations[0];
  assert.equal(page.measurement.totalBytes, 500);
  assert.equal(page.measurement.decodedBodyBytes, 9000);
  assert.equal(page.sizeSources.browserTransfer, 1);
  assert.equal(page.measurement.partial, false);
});

test('zero-byte cache hits and 304 responses do not fall back to decoded content', () => {
  const page = parseHar(archive([entry({ _transferSize: 0 }), entry({ status: 304, headersSize: 150, bodySize: 0 })])).navigations[0];
  assert.equal(page.measurement.totalBytes, 150);
  const cached = parseHar(archive([entry({ _transferSize: 0 })])).navigations[0].measurement;
  assert.equal(cached.totalBytes, 0);
  assert.equal(calculateEmissions(cached)!.grams, 0);
});

test('unknown, invalid and missing sizes remain partial known subtotals', () => {
  const page = parseHar(archive([entry({ _transferSize: -1, headersSize: -1, bodySize: -1 }), entry({ headersSize: 100, bodySize: -1 }), entry({ headersSize: 'invalid', bodySize: 200 })])).navigations[0];
  assert.equal(page.measurement.totalBytes, 300);
  assert.equal(page.measurement.unknownSizeCount, 3);
  assert.equal(page.measurement.partial, true);
  assert.equal(page.sizeSources.incomplete, 3);
});

test('redirects, repeated URLs, third-party requests and every resource type count independently', () => {
  const entries = [entry({ status: 301, _transferSize: 200, redirectURL: '/home' }), entry({ _transferSize: 1000 }, { request: { url: 'https://example.com/home' } })];
  for (const mimeType of ['text/css', 'application/javascript', 'image/webp', 'font/woff2', 'video/mp4', 'application/json']) {
    entries.push(entry({ _transferSize: 100, content: { mimeType, size: 1000 } }, { request: { url: 'https://third-party.example/repeat' } }));
  }
  const page = parseHar(archive(entries)).navigations[0];
  assert.equal(page.mainDocumentStatus, 200);
  assert.equal(page.error, undefined);
  assert.equal(page.measurement.requestCount, 8);
  assert.equal(page.measurement.totalBytes, 1800);
  assert.deepEqual(page.measurement.breakdown, { html: 1200, css: 100, js: 100, image: 100, font: 100, media: 100, other: 100 });
});

test('multiple navigations and unassigned requests remain separate', () => {
  const result = parseHar(archive([entry(), entry({ _transferSize: 2000 }, { pageref: 'page-2' }), entry({ _transferSize: 500 }, { pageref: undefined })], [{ id: 'page-1' }, { id: 'page-2' }]));
  assert.equal(result.navigations.length, 3);
  assert.deepEqual(result.navigations.map(page => page.measurement.totalBytes), [1000, 2000, 500]);
  assert.equal(result.navigations[2].measurement.partial, true);
  assert.match(result.navigations[2].label, /unassigned/);
  assert.equal(parseHar(archive([entry({ _transferSize: 1 }, { pageref: undefined })], [])).navigations.length, 1);
});

test('security challenges and unsuccessful main navigations cannot be calculated as the intended page', () => {
  for (const status of [200, 403]) {
    const page = parseHar(archive([entry({ status, headers: [{ name: 'CF-Mitigated', value: 'challenge' }] })])).navigations[0];
    assert.match(page.error!, /security-check/);
  }
  assert.match(parseHar(archive([entry({ content: { mimeType: 'text/html', text: '<title>Just a moment...</title>' } })])).navigations[0].error!, /security-check/);
  assert.match(parseHar(archive([entry({ content: { mimeType: 'text/html', encoding: 'base64', text: Buffer.from('<title>Just a moment...</title>').toString('base64') } })])).navigations[0].error!, /security-check/);
  for (const status of [0, 401, 403, 404, 503, 301]) assert.match(parseHar(archive([entry({ status })])).navigations[0].error!, /did not complete/);
});

test('incomplete and streaming requests are flagged and request span is bounded', () => {
  const page = parseHar(archive([entry(), entry({ content: { mimeType: 'text/event-stream' } }, { time: -1, startedDateTime: '2026-11-17T00:00:10Z' })])).navigations[0];
  assert.equal(page.measurement.partial, true);
  assert.equal(page.measurement.durationSeconds, 10);
  assert.ok(page.measurement.warnings.some(value => value.includes('streaming')));
  assert.ok(page.measurement.warnings.some(value => value.includes('completed duration')));
});

test('normalized output discards private titles, IDs, credentials, paths, query strings, headers and bodies', () => {
  const secret = 'PRIVATE_SENTINEL';
  const input = archive([entry({ headers: [{ name: 'Authorization', value: secret }], content: { text: secret, size: 9000, mimeType: 'text/html' } }, {
    pageref: secret, request: { url: `https://${secret}:password@example.com/private-${secret}?token=${secret}#${secret}`, headers: [{ name: 'Cookie', value: secret }], postData: { text: secret } },
  })], [{ id: secret, title: secret }]);
  const summary = parseHar(input);
  const rendered = JSON.stringify(summary);
  assert.doesNotMatch(rendered, /PRIVATE_SENTINEL|Authorization|Cookie|password|postData|private-/);
  assert.equal(summary.navigations[0].measurement.origin, 'https://example.com');
});

test('malformed JSON, invalid schema, empty files and capture limits fail with safe messages', () => {
  for (const value of ['not JSON', 'null', '{}', '{"log":{"entries":[]}}', archive([null]), archive([entry()], [{ id: 'same' }, { id: 'same' }])]) assert.throws(() => parseHar(value));
  assert.throws(() => parseHar(' '.repeat(MAX_HAR_BYTES + 1)), /50 MiB/);
  assert.throws(() => parseHar(JSON.stringify({ log: { entries: Array(MAX_HAR_ENTRIES + 1).fill(null) } })), /100,000/);
});

test('parsing and emissions calculation are local and perform no fetch requests', () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Import must not contact a server'); };
  try { assert.ok(calculateEmissions(parseHar(archive([entry()])).navigations[0].measurement)!.grams > 0); }
  finally { globalThis.fetch = originalFetch; }
});

test('real Chrome export agrees with its Network panel HTTP transfer and decoded totals', () => {
  // Minimal fields from the locally recorded Chrome capture. URLs/content/headers removed.
  const page = parseHar(readFileSync('tests/fixtures/chrome-capture-minimal.har', 'utf8')).navigations[0];
  assert.equal(page.measurement.requestCount, 24);
  assert.equal(page.measurement.totalBytes, 904533);
  assert.equal(page.measurement.decodedBodyBytes, 1385523);
  assert.equal(page.measurement.unknownSizeCount, 0);
  assert.equal(page.sizeSources.browserTransfer, 24);
  assert.equal(page.error, undefined);
  assert.equal(page.measurement.partial, true); // Two unavailable local Vercel scripts and guest Auth 401.
});
