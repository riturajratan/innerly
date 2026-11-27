// Publishable keys identify the Clerk Frontend API; secret keys never belong here.
export function clerkConfig(value = '') {
  const publishableKey = String(value).trim();
  if (!publishableKey) return { publishableKey: '', domain: '', enabled: false };
  if (!/^pk_(test|live)_[A-Za-z0-9+/=_-]+$/.test(publishableKey)) {
    throw new Error('Use a Clerk Publishable Key (pk_test_ or pk_live_), never a secret key.');
  }
  let decoded;
  try { decoded = atob(publishableKey.slice(8).replace(/-/g, '+').replace(/_/g, '/')); }
  catch { throw new Error('Invalid Clerk Publishable Key encoding.'); }
  const domain = decoded.slice(0, -1);
  const labels = domain.split('.');
  if (!decoded.endsWith('$') || domain.length > 253 || labels.length < 2 ||
      !labels.every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label)) ||
      !/^[a-z]{2,}$/i.test(labels.at(-1))) {
    throw new Error('Invalid Clerk Frontend API domain.');
  }
  return { publishableKey, domain, enabled: true };
}

export function authReturnUrl(href, language = 'en') {
  // Always return to this installation, at the custom domain root or a preview subpath.
  // Do not accept redirect URLs from query parameters or saved user data.
  const source=new URL(href);
  const url = new URL(/^\/admin(?:\.html)?$/.test(source.pathname)?'/admin':'./', href);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid app origin.');
  url.searchParams.set('lang', /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(language) ? language : 'en');
  return url.href;
}
