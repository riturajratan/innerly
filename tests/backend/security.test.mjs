import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticate, encryptReport, decryptReport, jsonBody, bodyText } from '../../worker/security.mjs';
import { environment, jwtKey, token, timestamp } from './helpers.mjs';

test('Clerk SDK verifies a genuine signature, issuer, session and authorized origin', async () => {
  const env = { ...environment(), CLERK_JWT_KEY: jwtKey };
  const req = value => new Request('https://knowyourmind.ai/api/me', { headers: { Authorization: `Bearer ${value}` } });
  assert.equal(await authenticate(req(token()), env), 'user_Alice');
  for (const bad of [token({exp: timestamp-60}),token({iss:'https://other.clerk.accounts.dev'}),token({azp:'https://evil.test'}),token({sid:null}),token({sts:'pending'}),token().slice(0,-5)+'abcde']) {
    await assert.rejects(authenticate(req(bad),env), e => e.status === 401);
  }
});
test('write requests require same origin and explicit bearer token; cookies alone never authenticate', async () => {
  const env = { ...environment(), CLERK_JWT_KEY: jwtKey };
  await assert.rejects(authenticate(new Request('https://knowyourmind.ai/api/reports',{method:'POST',headers:{Authorization:`Bearer ${token()}`}}),env), e => e.status === 403);
  await assert.rejects(authenticate(new Request('https://knowyourmind.ai/api/me',{headers:{Cookie:`__session=${token()}`}}),env), e => e.status === 401);
  await assert.rejects(authenticate(new Request('https://knowyourmind.ai/api/me',{headers:{Origin:'https://evil.test',Authorization:`Bearer ${token()}`}}),env), e => e.status === 403);
});
test('answers are encrypted with ownership-bound authenticated encryption', async () => {
  const env = environment(), answers = Array(36).fill(3);
  const encrypted = await encryptReport(answers,env,'user_Alice:report_A:v1');
  assert.ok(!encrypted.includes(JSON.stringify(answers)));
  assert.deepEqual(await decryptReport(encrypted,env,'user_Alice:report_A:v1'),answers);
  await assert.rejects(decryptReport(encrypted,env,'user_Bob:report_A:v1'));
  await assert.rejects(decryptReport(encrypted,{REPORT_ENCRYPTION_KEY:Buffer.alloc(32,8).toString('base64')},'user_Alice:report_A:v1'));
});
test('request limits reject oversized streamed bodies without relying on content-length', async () => {
  await assert.rejects(bodyText(new Request('https://example.test',{method:'POST',body:'x'.repeat(200)}),100),e=>e.status===413);
  await assert.rejects(jsonBody(new Request('https://example.test',{method:'POST',body:'{}'})),e=>e.status===415);
});
