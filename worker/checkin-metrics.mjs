import { appOrigin, fail } from './security.mjs';

export async function incrementCheckinTotal(request, env, now) {
  if (request.headers.get('origin') !== appOrigin(env)) fail(403, 'origin_not_allowed');
  const kind = new URL(request.url).pathname.split('/').at(-1);
  const day = new Date(now * 1000).toISOString().slice(0, 10);
  const starts = Number(kind === 'start');
  const completions = Number(kind === 'complete');
  await env.DB.prepare(`
    INSERT INTO checkin_daily_totals(day, starts, completions) VALUES (?, ?, ?)
    ON CONFLICT(day) DO UPDATE SET
      starts = starts + excluded.starts,
      completions = completions + excluded.completions
  `).bind(day, starts, completions).run();
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}

export async function readCheckinTotals(db, now) {
  const firstDay = new Date((now - 29 * 86400) * 1000).toISOString().slice(0, 10);
  return db.prepare(`
    SELECT COALESCE(SUM(starts),0) AS starts, COALESCE(SUM(completions),0) AS completions
    FROM checkin_daily_totals WHERE day >= ?
  `).bind(firstDay).first();
}

const ACTIVITY_WINDOW = 5 * 60;
const MIN_PUBLIC_ACTIVITY = 3;

export async function recordCheckinPresence(request, env, now) {
  if (request.headers.get('origin') !== appOrigin(env)) fail(403, 'origin_not_allowed');
  const token = request.headers.get('X-Checkin-Presence') || '';
  if (!/^[a-f0-9]{32}$/.test(token)) fail(400, 'invalid_presence');
  await env.DB.prepare(`
    INSERT INTO checkin_presence(token, seen_at) VALUES (?, ?)
    ON CONFLICT(token) DO UPDATE SET seen_at = excluded.seen_at
    WHERE seen_at < excluded.seen_at - 30
  `).bind(token, now).run();
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}

export async function readPublicCheckinStats(db, now) {
  const { completed, active } = await db.prepare(`
    SELECT
      (SELECT COALESCE(SUM(completions), 0) FROM checkin_daily_totals) AS completed,
      (SELECT COUNT(*) FROM checkin_presence WHERE seen_at > ?) AS active
  `).bind(now - ACTIVITY_WINDOW).first();
  return { completed, active: active >= MIN_PUBLIC_ACTIVITY ? active : null };
}

export async function clearInactiveCheckins(db, now) {
  if (db) await db.prepare('DELETE FROM checkin_presence WHERE seen_at <= ?').bind(now - ACTIVITY_WINDOW).run();
}
