import {submitFeedback} from './feedback.mjs';
import {draftRequest} from './drafts.mjs';
import { source } from '../dist/innerly-v1-questions.mjs';
import { clerkConfig } from '../dist/clerk-config.mjs';
import { authenticate, HttpError, fail, jsonBody, objectFields, id, seconds, encryptReport, decryptReport, digest, rateLimit } from './security.mjs';
import { publicPlans, billingReady, billingStatus, requireSubscription, razorpay, createSubscription, refreshSubscription, cancelSubscription, webhook } from './billing.mjs';
import { signupWebhook } from './signup-notifications.mjs';

const languages = new Set(['en','hi','zh','es','fr','ar','bn','pt','ru','ur','id','de','ja','mr','te','tr','ta','vi','ko','it']);
export const CONSENT_VERSION = 'cloud-reports-v1';
export function validateReport(value, now) {
  objectFields(value, ['clientId', 'version', 'language', 'answers', 'assessedAt', 'consent']);
  if (!id(value.clientId) || value.version !== source.version || !languages.has(value.language) ||
    !Array.isArray(value.answers) || value.answers.length !== source.questions.length ||
    !value.answers.every(v => Number.isInteger(v) && v >= 0 && v <= 4)) fail(400, 'invalid_report');
  if (value.consent !== CONSENT_VERSION) fail(400, 'cloud_storage_consent_required');
  const date = typeof value.assessedAt === 'string' ? Date.parse(value.assessedAt) : NaN;
  if (!Number.isFinite(date) || date < Date.UTC(2020, 0, 1) || date > now * 1000 + 300000) fail(400, 'invalid_assessment_date');
  return { ...value, assessedAt: new Date(date).toISOString() };
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'Vary': 'Authorization, Origin' } });
}
async function ownedReport(db, userId, reportId) {
  const row = await db.prepare('SELECT * FROM assessments WHERE id = ? AND user_id = ?').bind(reportId, userId).first();
  if (!row) fail(404, 'report_not_found');
  return row;
}

export function createApp({ authenticateUser = authenticate, fetcher = fetch, now = seconds } = {}) {
  return {
    async fetch(request, env) {
      const path = new URL(request.url).pathname;
      try {
        if (path === '/auth-config.mjs' && ['GET', 'HEAD'].includes(request.method)) {
          let publishableKey;
          try { publishableKey = clerkConfig(env.CLERK_PUBLISHABLE_KEY || '').publishableKey; }
          catch { fail(503, 'public_login_configuration_invalid'); }
          return new Response(`export const clerkPublishableKey = ${JSON.stringify(publishableKey)};\n`, {
            headers: { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
          });
        }
        if (!path.startsWith('/api/')) {
          const response = await env.ASSETS.fetch(request);
          const params = new URL(request.url).searchParams;
          if (['view','account','start','new'].some(key => params.has(key))) {
            const privateView = new Response(response.body,response);
            privateView.headers.set('X-Robots-Tag','noindex, nofollow');
            return privateView;
          }
          return response;
        }
        if (request.method === 'GET' && path === '/api/health') return json({ ok: true, service: 'knowyourmind' });
        if (request.method === 'GET' && path === '/api/config') return json({
          loginEnabled: !!(env.CLERK_PUBLISHABLE_KEY && env.CLERK_ISSUER && env.CLERK_JWT_KEY),
          cloudEnabled: !!(env.DB && env.REPORT_ENCRYPTION_KEY), billingEnabled: billingReady(env),
          cloudAccess: env.CLOUD_REPORTS_ACCESS === 'free' ? 'free' : 'subscription',
          consentVersion: CONSENT_VERSION, plans: publicPlans(env),
        });
        if (!env.DB) fail(503, 'database_not_configured');
        if (path === '/api/webhooks/clerk' && request.method === 'POST') return json(await signupWebhook(request, env, fetcher, now()));
        if(path==='/api/feedback'&&request.method==='POST')return json(await submitFeedback(request,env,now()),201);
        const provider = razorpay(env, fetcher);
        if (path === '/api/webhooks/razorpay' && request.method === 'POST') return json(await webhook(request, env, provider, now()));
        const userId = await authenticateUser(request, env);
        const timestamp = now();
        await rateLimit(env.DB, userId, timestamp);
        if (path.startsWith('/api/billing/')) await rateLimit(env.DB, `billing:${userId}`, timestamp, 6);
        await env.DB.prepare('INSERT OR IGNORE INTO users(id,created_at) VALUES (?,?)').bind(userId, timestamp).run();
        if(path==='/api/draft'&&['GET','PUT','DELETE'].includes(request.method))return json(await draftRequest(request,env,userId,timestamp));
        if (path === '/api/me' && request.method === 'GET') return json({ userId, billing: await billingStatus(env.DB, userId, timestamp) });
        if (path === '/api/billing/subscriptions' && request.method === 'POST') return json(await createSubscription(env.DB, userId, await jsonBody(request), env, timestamp, provider), 201);
        const subscription = path.match(/^\/api\/billing\/subscriptions\/([A-Za-z0-9_-]{8,100})\/(refresh|cancel)$/);
        if (subscription && request.method === 'POST') {
          objectFields(await jsonBody(request), []);
          const fn = subscription[2] === 'refresh' ? refreshSubscription : cancelSubscription;
          return json(await fn(env.DB, userId, subscription[1], provider, timestamp));
        }
        if (path === '/api/reports' && request.method === 'POST') {
          const input = validateReport(await jsonBody(request), timestamp);
          const contentHash = await digest(JSON.stringify([input.version,input.language,input.assessedAt,input.answers]));
          const existing = await env.DB.prepare('SELECT id, content_hash FROM assessments WHERE user_id = ? AND client_id = ?').bind(userId, input.clientId).first();
          if (existing) {
            if (existing.content_hash !== contentHash) fail(409, 'report_id_reused');
            return json({ id: existing.id, saved: true });
          }
          if (env.CLOUD_REPORTS_ACCESS !== 'free') await requireSubscription(env.DB, userId, timestamp);
          const reportId = crypto.randomUUID();
          const encrypted = await encryptReport(input.answers, env, `${userId}:${reportId}:${input.version}`);
          const result = await env.DB.prepare(`INSERT OR IGNORE INTO assessments
            (id,user_id,client_id,version,language,responses_ciphertext,content_hash,consent_version,consent_at,assessed_at,created_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(reportId,userId,input.clientId,input.version,input.language,encrypted,contentHash,CONSENT_VERSION,timestamp,input.assessedAt,timestamp).run();
          if (result.meta.changes !== 1) {
            const saved = await env.DB.prepare('SELECT id, content_hash FROM assessments WHERE user_id = ? AND client_id = ?').bind(userId,input.clientId).first();
            if (saved?.content_hash !== contentHash) fail(409, 'report_id_reused');
            return json({ id: saved.id, saved: true });
          }
          return json({ id: reportId, saved: true }, 201);
        }
        if (path === '/api/reports/history' && request.method === 'GET') {
          const cursor = new URL(request.url).searchParams.get('cursor') || '';
          if (cursor && !id(cursor)) fail(400, 'invalid_cursor');
          // Bounded pages avoid a request per report and keep account data private.
          const boundary = cursor ? await env.DB.prepare('SELECT assessed_at FROM assessments WHERE id = ? AND user_id = ?').bind(cursor,userId).first() : null;
          if (cursor && !boundary) fail(400, 'invalid_cursor');
          const rows = await env.DB.prepare(`SELECT * FROM assessments
            WHERE user_id = ? AND (? = '' OR assessed_at < ? OR (assessed_at = ? AND id < ?))
            ORDER BY assessed_at DESC, id DESC LIMIT 26`).bind(userId,cursor,boundary?.assessed_at||'',boundary?.assessed_at||'',cursor).all();
          const reports = await Promise.all(rows.results.slice(0,25).map(async row => ({
            id: row.id, clientId: row.client_id, version: row.version, language: row.language, createdAt: row.assessed_at,
            answers: await decryptReport(row.responses_ciphertext, env, `${userId}:${row.id}:${row.version}`),
          })));
          return json({ reports, nextCursor: rows.results.length > 25 ? rows.results[24].id : null });
        }
        if (path === '/api/reports' && request.method === 'GET') {
          const url = new URL(request.url);
          const cursor = url.searchParams.get('cursor') || '';
          if (cursor && !id(cursor)) fail(400, 'invalid_cursor');
          const rows = await env.DB.prepare(`SELECT id, version, language, assessed_at AS assessedAt, created_at AS createdAt
            FROM assessments WHERE user_id = ? AND (? = '' OR id < ?) ORDER BY id DESC LIMIT 51`).bind(userId, cursor, cursor).all();
          return json({ reports: rows.results.slice(0,50), nextCursor: rows.results.length > 50 ? rows.results[49].id : null });
        }
        const match = path.match(/^\/api\/reports\/([A-Za-z0-9_-]{8,100})(\/export)?$/);
        if (match && ['GET','DELETE'].includes(request.method)) {
          const row = await ownedReport(env.DB, userId, match[1]);
          if (request.method === 'DELETE') {
            if (match[2]) fail(405, 'method_not_allowed');
            await env.DB.prepare('DELETE FROM assessments WHERE id = ? AND user_id = ?').bind(row.id, userId).run();
            return json({ deleted: true });
          }
          const answers = await decryptReport(row.responses_ciphertext, env, `${userId}:${row.id}:${row.version}`);
          const response = json({ id: row.id, clientId: row.client_id, version: row.version, language: row.language, createdAt: row.assessed_at, answers });
          if (match[2]) response.headers.set('Content-Disposition', `attachment; filename="knowyourmind-${row.id}.json"`);
          return response;
        }
        fail(404, 'not_found');
      } catch (error) {
        const requestId = crypto.randomUUID();
        // Never log answers, tokens, payment payloads, provider errors or secrets.
        if (!(error instanceof HttpError)) console.error('request_failed', requestId);
        const response = json({ error: error instanceof HttpError ? error.code : 'internal_error', requestId }, error instanceof HttpError ? error.status : 500);
        if (error.status === 429) response.headers.set('Retry-After', '60');
        return response;
      }
    },
  };
}
export default createApp();
