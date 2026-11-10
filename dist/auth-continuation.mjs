export const AUTH_RETURN_STORAGE = 'innerly-auth-return-v1';
const MAX_AGE = 30 * 60 * 1000;

// This marker contains navigation only. Answers/reports use existing, consented
// local storage. It is not an auth token and confers no access to server data.
export function rememberAuthReturn(storage, { view, reportId = null, language }, now = Date.now()) {
  if (!['home', 'quiz', 'report', 'history'].includes(view)) throw new Error('Invalid return view.');
  storage.setItem(AUTH_RETURN_STORAGE, JSON.stringify({ view, reportId, language, createdAt: now }));
}

export function takeAuthReturn(storage, now = Date.now()) {
  try {
    const raw = storage.getItem(AUTH_RETURN_STORAGE);
    storage.removeItem(AUTH_RETURN_STORAGE);
    const value = JSON.parse(raw);
    if (!value || !['home', 'quiz', 'report', 'history'].includes(value.view) ||
        typeof value.language !== 'string' || !/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(value.language) ||
        !Number.isFinite(value.createdAt) || value.createdAt > now || now - value.createdAt > MAX_AGE ||
        !(value.reportId === null || typeof value.reportId === 'string')) return null;
    return { view: value.view, reportId: value.reportId, language: value.language };
  } catch { return null; }
}
