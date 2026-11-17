import assert from 'node:assert/strict';
import test from 'node:test';
import axios, { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { websiteFetchFailure } from '../lib/website-fetch-error';
import { GET } from '../app/api/emissioncalculator/[url]/route';

function upstream(status: number, headers: Record<string, string> = {}): AxiosResponse {
  return { status, statusText: '', headers, data: '<html>Security check</html>', config: { headers: new AxiosHeaders() } };
}

test('Cloudflare challenges report a blocked analysis with manual-input guidance', () => {
  const failure = websiteFetchFailure(new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, upstream(403, { 'cf-mitigated': 'challenge' })));
  assert.equal(failure.status, 422);
  assert.equal(failure.body.code, 'WEBSITE_SECURITY_CHALLENGE');
  assert.equal(failure.body.upstreamStatus, 403);
  assert.equal(failure.body.canUseManualInput, true);
  assert.match(failure.body.error, /security check/);
  assert.match(failure.body.error, /manual page-size/);
});

test('access denial, timeouts, and origin failures stay distinguishable', () => {
  for (const status of [401, 403]) {
    const failure = websiteFetchFailure(new AxiosError('Denied', undefined, undefined, undefined, upstream(status)));
    assert.equal(failure.body.code, 'WEBSITE_ACCESS_DENIED');
    assert.equal(failure.body.upstreamStatus, status);
  }
  const timeout = websiteFetchFailure(new AxiosError('timeout', 'ECONNABORTED'));
  assert.equal(timeout.status, 504);
  assert.equal(timeout.body.code, 'WEBSITE_TIMED_OUT');
  const outage = websiteFetchFailure(new AxiosError('Unavailable', undefined, undefined, undefined, upstream(503)));
  assert.equal(outage.status, 502);
  assert.match(outage.body.error, /HTTP 503/);
  assert.doesNotMatch(outage.body.error, /security check/);
});

test('the route preserves the actual 403 cause instead of returning the old generic 502', async () => {
  const originalGet = axios.get;
  axios.get = (async () => { throw new AxiosError('Denied', undefined, undefined, undefined, upstream(403, { 'cf-mitigated': 'challenge' })); }) as typeof axios.get;
  try {
    const result = await GET(new Request('http://localhost/'), { params: Promise.resolve({ url: 'https://192.0.2.1/' }) });
    assert.equal(result.status, 422);
    const body = await result.json();
    assert.equal(body.upstreamStatus, 403);
    assert.equal(body.code, 'WEBSITE_SECURITY_CHALLENGE');
    assert.equal(body.totalBytes, undefined);
  } finally { axios.get = originalGet; }
});

test('a challenge with HTTP 200 is not counted as a successful website analysis', async () => {
  const originalGet = axios.get;
  axios.get = (async () => upstream(200, { 'cf-mitigated': 'challenge' })) as typeof axios.get;
  try {
    const result = await GET(new Request('http://localhost/'), { params: Promise.resolve({ url: 'https://192.0.2.1/' }) });
    assert.equal(result.status, 422);
    assert.equal((await result.json()).code, 'WEBSITE_SECURITY_CHALLENGE');
  } finally { axios.get = originalGet; }
});
