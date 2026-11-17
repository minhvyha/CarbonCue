import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { gzipSync, brotliCompressSync, deflateSync } from 'node:zlib';
import axios, { AxiosHeaders } from 'axios';
import { co2 } from '@tgwf/co2';
import { calculateEmissions, projectPageviews, WEBSITE_MODEL } from '../lib/website-emissions';
import { decodeResponseBody } from '../lib/website-response';
import { GET } from '../app/api/emissioncalculator/[url]/route';

test('pinned SWDM v4 wrapper matches library totals with and without hosting assumptions', () => {
  const native = new co2({ model: 'swd', version: 4 });
  assert.equal(WEBSITE_MODEL.packageVersion, JSON.parse(readFileSync('node_modules/@tgwf/co2/package.json', 'utf8')).version);
  for (const bytes of [0, 1, 123456, 1e9]) for (const green of [false, true]) {
    const actual = calculateEmissions({ totalBytes: bytes }, green)!;
    assert.equal(actual.grams, native.perByte(bytes, green));
    assert.ok(Math.abs(Object.values(actual.segments).reduce((a, b) => a + b, 0) - actual.grams) < 1e-10);
  }
  const grid = calculateEmissions({ totalBytes: 1e6 }, false)!;
  const green = calculateEmissions({ totalBytes: 1e6 }, true)!;
  assert.equal(green.segments.dataCenterOperational, 0);
  for (const key of ['networkOperational', 'deviceOperational', 'dataCenterEmbodied', 'networkEmbodied', 'deviceEmbodied'] as const) assert.equal(green.segments[key], grid.segments[key]);
});

test('explicit grid assumptions preserve zero, require provenance, and match the library', () => {
  const options = { gridIntensity: { dataCenter: 0, network: 100, device: 200 } };
  const actual = calculateEmissions({ totalBytes: 1e6 }, { ...options, greenHosting: false, provenance: 'Published grid factors, 2025' })!;
  assert.equal(actual.grams, new co2({ model: 'swd', version: 4 }).perByteTrace(1e6, false, options).co2);
  assert.equal(actual.assumptions.gridIntensity.dataCenter, 0);
  assert.throws(() => calculateEmissions({ totalBytes: 1 }, { ...options, greenHosting: false }));
  for (const value of [-1, Infinity, NaN, 5001]) assert.throws(() => calculateEmissions({ totalBytes: 1 }, { greenHosting: false, gridIntensity: { device: value }, provenance: 'test' }));
});

test('pageview projections convert grams to kilograms and assume twelve equal months', () => {
  assert.deepEqual(projectPageviews(0.5, '10000'), { monthlyKg: 5, annualKg: 60, count: 10000 });
  assert.deepEqual(projectPageviews(0, '0'), { monthlyKg: 0, annualKg: 0, count: 0 });
  for (const value of ['', '-1', '1.5', 'NaN', 'Infinity']) assert.equal(projectPageviews(1, value), null);
});

test('response decoding does not change compressed bytes used for emissions', async () => {
  const html = '<html><p>' + 'compressible content '.repeat(1000) + '</p></html>';
  for (const [encoding, compress] of [['gzip', gzipSync], ['br', brotliCompressSync], ['deflate', deflateSync]] as const) {
    const body = compress(Buffer.from(html));
    assert.equal(decodeResponseBody(body, encoding), html);
    const original = axios.get;
    axios.get = (async (_url, config) => {
      assert.equal(config?.decompress, false);
      return { status: 200, headers: { 'content-encoding': encoding }, data: body, config: { headers: new AxiosHeaders() } };
    }) as typeof axios.get;
    try {
      const response = await GET(new Request('http://localhost/'), { params: Promise.resolve({ url: 'https://192.0.2.1/' }) });
      assert.equal(response.status, 200);
      const { measurement } = await response.json();
      assert.equal(measurement.totalBytes, body.length);
      assert.ok(measurement.totalBytes < Buffer.byteLength(html));
      assert.equal(measurement.partial, true);
      assert.match(measurement.byteBasis, /Compressed/);
    } finally { axios.get = original; }
  }
  assert.throws(() => decodeResponseBody(Buffer.from('not compressed'), 'gzip'));
});

test('static scan resolves references against the redirected document URL and keeps byte basis consistent', async () => {
  const original = axios.get;
  const html = Buffer.from('<link rel="stylesheet" href="style.css"><script src="app.js"></script>');
  const css = gzipSync(Buffer.from('body { background: url(image.png) }'));
  const requested: string[] = [];
  axios.get = (async (url, options) => {
    requested.push(String(url));
    assert.equal(options?.decompress, false);
    if (requested.length === 1) return { data: html, headers: {}, request: { res: { responseUrl: 'https://192.0.2.1/new/' } } };
    if (String(url).endsWith('.css')) return { data: css, headers: { 'content-type': 'text/css', 'content-encoding': 'gzip' } };
    if (String(url).endsWith('.js')) return { data: Buffer.alloc(10), headers: { 'content-type': 'application/javascript' } };
    return { data: Buffer.alloc(20), headers: { 'content-type': 'image/png' } };
  }) as typeof axios.get;
  try {
    const response = await GET(new Request('http://localhost/'), { params: Promise.resolve({ url: 'https://192.0.2.1/' }) });
    const { measurement } = await response.json();
    assert.deepEqual(requested, ['https://192.0.2.1/', 'https://192.0.2.1/new/style.css', 'https://192.0.2.1/new/app.js', 'https://192.0.2.1/new/image.png']);
    assert.equal(measurement.totalBytes, html.length + css.length + 30);
    assert.equal(measurement.breakdown.css, css.length);
    assert.equal(measurement.origin, 'https://192.0.2.1');
  } finally { axios.get = original; }
});
