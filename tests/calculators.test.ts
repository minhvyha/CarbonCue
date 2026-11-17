import assert from 'node:assert/strict';
import test from 'node:test';
import calculateCO2 from '../app/api/ai-calculator/calculator/calculator';
import { calculateEmissions, kilobytesToBytes, normalizeWebsiteUrl } from '../lib/website-emissions';
import { GET as analyzeWebsite } from '../app/api/emissioncalculator/[url]/route';

const values = { gpu: 'AGX Xavier', hours: 100, provider: 'gcp', region: 'asia-east1', customImpact: null, customOffset: null };
const data = { gpu: { watt: 30 }, provider: { regions: new Map([['asia-east1', { impact: 557, offsetRatio: '0' }]]) } };

test('manual page sizes are converted from KB to bytes, including decimals', () => {
  assert.equal(kilobytesToBytes('2400'), 2457600);
  assert.equal(kilobytesToBytes('1.5'), 1536);
  for (const value of ['0', '-1', '', 'NaN', 'Infinity']) assert.throws(() => kilobytesToBytes(value));
});

test('website emissions use the byte quantity and preserve the selected energy source', () => {
  const small = calculateEmissions({ totalBytes: 1024 }, false)!;
  const large = calculateEmissions({ totalBytes: 1024 * 1024 }, true)!;
  assert.equal(large.statistics.co2.grid.grams / small.statistics.co2.grid.grams, 1024);
  assert.equal(large.green, true);
  assert.ok(large.statistics.co2.renewable.grams < large.statistics.co2.grid.grams);
  for (const totalBytes of [0, -1, NaN, Infinity]) assert.equal(calculateEmissions({ totalBytes }, false), null);
});

test('website URL handling adds HTTPS and preserves percent escapes', () => {
  assert.equal(normalizeWebsiteUrl(' example.com '), 'https://example.com/');
  assert.equal(normalizeWebsiteUrl('http://example.com/a%20b'), 'http://example.com/a%20b');
  assert.throws(() => normalizeWebsiteUrl('ftp://example.com'));
  assert.throws(() => normalizeWebsiteUrl('https://user:password@example.com'));
});

test('URL API accepts promise params and returns a JSON validation error', async () => {
  for (const url of ['not a url', 'file:///etc/hosts', 'ftp://example.com']) {
    const response = await analyzeWebsite(new Request('http://localhost/'), { params: Promise.resolve({ url }) });
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /HTTP/);
  }
});

test('AI calculation uses region defaults and converts g/kWh into kg/kWh', async () => {
  assert.deepEqual(await calculateCO2(values, data), { energy: 3, impact: 0.557, co2: 1.671, offset: 0, offsetPercents: 0 });
});

test('custom factors work without a provider and zero is preserved', async () => {
  const custom = { ...values, provider: null, region: null, customImpact: 100, customOffset: 50 };
  assert.equal((await calculateCO2(custom, { ...data, provider: null })).offset, 0.15);
  assert.equal((await calculateCO2({ ...custom, customImpact: 0, customOffset: 0 }, { ...data, provider: null })).co2, 0);
});

test('AI calculation rejects invalid hours, region, intensity, and offset', async () => {
  for (const hours of [0, -1, Infinity, NaN, 100001]) await assert.rejects(calculateCO2({ ...values, hours }, data));
  for (const customOffset of [-1, 101, NaN]) await assert.rejects(calculateCO2({ ...values, customOffset }, data));
  await assert.rejects(calculateCO2({ ...values, customImpact: -1 }, data));
  await assert.rejects(calculateCO2({ ...values, region: 'unknown' }, data));
});

import { normalizeVolunteerResults, volunteerUrl } from '../lib/volunteer-listings';
import { GET as volunteerListings } from '../app/api/volunteer-hub/route';

test('volunteer links normalize provider-relative and scheme-less URLs safely', () => {
  assert.equal(volunteerUrl('www.volunteerconnector.org/org'), 'https://www.volunteerconnector.org/org');
  assert.equal(volunteerUrl('//cdn.example.com/logo.png'), 'https://cdn.example.com/logo.png');
  assert.equal(volunteerUrl('/opportunity'), 'https://www.volunteerconnector.org/opportunity');
  assert.equal(volunteerUrl('javascript:alert(1)'), null);
  assert.equal(volunteerUrl(null), null);
});

test('volunteer normalization tolerates missing organizations and removes unusable listings', () => {
  const result = normalizeVolunteerResults([{ id: 1, title: 'Plant trees', url: '/trees' }, { id: 2, title: 'Missing URL' }, null]);
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].dates, 'Ongoing');
  assert.equal(result.organizations.length, 0);
});

test('volunteer search forwards supported filters and uses the real next-page signal', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url) => {
      const upstream = new URL(String(url));
      assert.equal(upstream.searchParams.get('se'), 'trees');
      assert.equal(upstream.searchParams.get('ro'), 'on');
      assert.equal(upstream.searchParams.get('page'), '2');
      return Response.json({ results: [{ id: 1, title: 'Plant trees', url: '/trees' }], next: null });
    };
    const response = await volunteerListings(new Request('http://localhost/api/volunteer-hub?page=2&search=trees&remote=true'));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).hasMore, false);
  } finally { globalThis.fetch = originalFetch; }
});

test('volunteer API rejects fractional and invalid pages before fetching', async () => {
  for (const page of ['0', '-1', '1.5', 'NaN']) {
    assert.equal((await volunteerListings(new Request(`http://localhost/api/volunteer-hub?page=${page}`))).status, 400);
  }
});
