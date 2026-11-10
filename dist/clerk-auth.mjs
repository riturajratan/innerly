import { clerkConfig, authReturnUrl } from './clerk-config.mjs';

export function loadClerkScript(document, src, key = '', timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.crossOrigin = 'anonymous';
    if (key) script.setAttribute('data-clerk-publishable-key', key);
    const finish = error => {
      clearTimeout(timer);
      script.onload = script.onerror = null;
      if (error) { script.remove(); reject(error); } else resolve();
    };
    const timer = setTimeout(() => finish(new Error('Sign-in took too long to load.')), timeoutMs);
    script.onload = () => finish();
    script.onerror = () => finish(new Error('Sign-in is temporarily unavailable.'));
    document.head.appendChild(script);
  });
}

function bounded(promise, timeoutMs) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Sign-in took too long to load.')), timeoutMs); })
  ]).finally(() => clearTimeout(timer));
}

// Auth only owns the header/session. It never reads answers or renders the check-in.
export function createClerkAuth({ publishableKey, window: win, document: doc,
  onChange = () => {}, loadScript = loadClerkScript, timeoutMs = 20000 }) {
  const config = clerkConfig(publishableKey);
  let state = { status: config.enabled ? 'idle' : 'disabled', user: null };
  let pending, clerk, unsubscribe;
  const update = next => { state = next; onChange(state); };
  const refresh = () => update({ status: clerk.isSignedIn ? 'signed-in' : 'signed-out', user: clerk.user || null });
  async function ready() {
    if (!config.enabled) return null;
    if (pending) return pending;
    update({ status: 'loading', user: null });
    pending = (async () => {
      const origin = `https://${config.domain}`;
      if (!win.__internal_ClerkUICtor) await loadScript(doc, `${origin}/npm/@clerk/ui@1/dist/ui.browser.js`);
      if (!win.Clerk) await loadScript(doc, `${origin}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`, config.publishableKey);
      clerk = win.Clerk;
      if (!clerk?.load || !win.__internal_ClerkUICtor) throw new Error('Sign-in did not load.');
      const returnUrl = authReturnUrl(win.location.href);
      await bounded(clerk.load({
        ui: { ClerkUI: win.__internal_ClerkUICtor },
        afterSignOutUrl: returnUrl,
        signInForceRedirectUrl: returnUrl,
        signUpForceRedirectUrl: returnUrl,
        telemetry: false,
        appearance: { variables: { colorPrimary: '#2858b8', borderRadius: '0.75rem', fontSize: '1rem', fontFamily: '"DM Sans", system-ui, sans-serif' } }
      }), timeoutMs);
      unsubscribe?.();
      unsubscribe = clerk.addListener(refresh);
      refresh();
      return clerk;
    })().catch(error => {
      pending = null;
      update({ status: 'error', user: null });
      throw error;
    });
    return pending;
  }
  return {
    get state() { return state; },
    ready,
    async signIn(language) {
      const client = await ready();
      if (!client) return;
      if (client.isSignedIn) { refresh(); return; }
      const returnUrl = authReturnUrl(win.location.href, language);
      client.openSignIn({ withSignUp: true, forceRedirectUrl: returnUrl, signUpForceRedirectUrl: returnUrl });
    },
    async profile() { (await ready())?.openUserProfile(); },
    async signOut(language) {
      await (await ready())?.signOut({ redirectUrl: authReturnUrl(win.location.href, language) });
      if (clerk) refresh();
    },
    dispose() { unsubscribe?.(); }
  };
}
