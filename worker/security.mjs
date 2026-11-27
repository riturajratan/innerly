import { verifyToken } from '@clerk/backend';

export class HttpError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}
export const fail = (status, code) => { throw new HttpError(status, code); };
export const seconds = () => Math.floor(Date.now() / 1000);

export function appOrigin(env) {
  try {
    const url = new URL(env.APP_ORIGIN);
    if (url.origin !== env.APP_ORIGIN || (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname))) throw new Error();
    return url.origin;
  } catch { fail(503, 'app_not_configured'); }
}

export async function authenticate(request, env) {
  const origin = appOrigin(env);
  if (request.headers.get('origin') && request.headers.get('origin') !== origin) fail(403, 'origin_not_allowed');
  if (!['GET', 'HEAD'].includes(request.method) && request.headers.get('origin') !== origin) fail(403, 'origin_required');
  const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1];
  if (!token || token.length > 12000) fail(401, 'sign_in_required');
  if (!env.CLERK_PUBLISHABLE_KEY || !env.CLERK_ISSUER || !env.CLERK_JWT_KEY) fail(503, 'login_not_configured');
  let claims;
  try {
    // This API accepts explicit session JWTs only. Verification needs the public
    // signing key, never an administrator credential for Clerk's Backend API.
    claims = await verifyToken(token, {
      jwtKey: env.CLERK_JWT_KEY, issuer: env.CLERK_ISSUER,
      authorizedParties: [origin], clockSkewInMs: 5000,
    });
  } catch { fail(401, 'invalid_session'); }
  if (!claims || claims.iss !== env.CLERK_ISSUER || claims.azp !== origin || !/^sess_[A-Za-z0-9]+$/.test(claims.sid || '') || !/^user_[A-Za-z0-9]+$/.test(claims.sub || '') || claims.sts === 'pending') fail(401, 'invalid_session');
  return claims.sub;
}

export async function bodyText(request, max = 16384) {
  if (Number(request.headers.get('content-length')) > max) fail(413, 'request_too_large');
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) { await reader.cancel(); fail(413, 'request_too_large'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}
export async function jsonBody(request) {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') fail(415, 'json_required');
  try { return JSON.parse(await bodyText(request)); }
  catch (error) { if (error instanceof HttpError) throw error; fail(400, 'invalid_json'); }
}
export function objectFields(value, fields) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !fields.includes(key))) fail(400, 'invalid_fields');
}
export function id(value) { return typeof value === 'string' && /^[A-Za-z0-9_-]{8,100}$/.test(value); }
export async function digest(text) {
  const bytes = await crypto.subtle.digest('SHA-256', typeof text === 'string' ? new TextEncoder().encode(text) : text);
  return [...new Uint8Array(bytes)].map(x => x.toString(16).padStart(2, '0')).join('');
}
const encode = bytes => btoa(String.fromCharCode(...bytes));
const decode = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));
async function encryptionKey(env) {
  try {
    const bytes = decode(env.REPORT_ENCRYPTION_KEY || '');
    if (bytes.length !== 32) throw new Error();
    return await crypto.subtle.importKey('raw', bytes, 'AES-GCM', false, ['encrypt', 'decrypt']);
  } catch { fail(503, 'report_storage_not_configured'); }
}
export async function encryptReport(value, env, context) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(context) }, await encryptionKey(env), new TextEncoder().encode(JSON.stringify(value)));
  return JSON.stringify({ v: 1, iv: encode(iv), data: encode(new Uint8Array(encrypted)) });
}
export async function decryptReport(ciphertext, env, context) {
  const envelope = JSON.parse(ciphertext);
  if (envelope.v !== 1) fail(500, 'report_unavailable');
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: decode(envelope.iv), additionalData: new TextEncoder().encode(context) }, await encryptionKey(env), decode(envelope.data));
  return JSON.parse(new TextDecoder().decode(plain));
}
export async function validWebhook(raw, signature, secret) {
  if (!secret || !/^[a-f0-9]{64}$/i.test(signature || '')) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const bytes = Uint8Array.from(signature.match(/../g), s => parseInt(s, 16));
  return crypto.subtle.verify('HMAC', key, bytes, new TextEncoder().encode(raw));
}

export async function rateLimit(db, userId, now, limit = 60) {
  const start = Math.floor(now / 60) * 60;
  const row = await db.prepare(`INSERT INTO rate_limits(key, window_start, count) VALUES (?, ?, 1)
    ON CONFLICT(key) DO UPDATE SET count = CASE WHEN window_start = excluded.window_start THEN count + 1 ELSE 1 END,
    window_start = excluded.window_start RETURNING count`).bind(userId, start).first();
  if (row.count > limit) fail(429, 'too_many_requests');
}
