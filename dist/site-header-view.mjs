// The same header shell is used by the app and every standalone page.
export function siteHeaderMarkup({app=false,languages=[]}={}){
 const brand='<img class="innerly-mark" src="assets/innerly-mark.svg?v=5" width="36" height="36" alt=""><span>innerly.</span>';
 const nav=app?'<button id="mh-home" aria-current="page">Home</button><button id="mh-history">My reports</button><button id="mh-auth" class="mh-auth-button" hidden>Sign in</button>':'<a href="./">Home</a><a href="./?view=history">My reports</a><a class="ih-account" href="./?account=1">Account</a>';
 const language=app?`<label><span class="ih-sr">Language</span><select id="mh-language" aria-label="Question language" aria-describedby="mh-language-note">${languages.map(l=>`<option value="${l.code}" lang="${l.code}">${l.name}</option>`).join('')}</select></label>`:'';
 return `<header class="innerly-header${app?' mh-header':''}"><a href="${app?'#home':'./'}" class="innerly-brand${app?' mh-brand':''}" aria-label="Innerly home">${brand}</a><nav aria-label="Main navigation">${nav}</nav><div class="innerly-header-tools${app?' mh-header-tools':''}">${language}<button ${app?'id="mh-large"':'data-site-large'} aria-label="Larger text" aria-pressed="false">A+</button></div></header>`;
}
