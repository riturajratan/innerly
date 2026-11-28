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
