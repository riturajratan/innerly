import {workbookReportMarkup} from './innerly-v1-views.mjs?v=explorer-2';
import {displayLanguage} from './mental-language.mjs?v=mh-14';
const say=(l,en,hi)=>l==='hi'?hi:en;
export function sampleReportMarkup({report,history=[],language='en',preset='mixed',view='snapshot',selection={}}){
 const l=displayLanguage(language);
 let html=workbookReportMarkup(report,l,view,selection.dimension||'dimension-1',false,history,selection.question??0);
 html=html.replace(/<h1>.*?<\/h1>/,`<h1>${say(l,'Explore your inner world.','अपने मन की दुनिया को समझें।')}</h1>`)
 .replace(/<p class="mh-kicker">.*?<\/p>/,`<p class="mh-kicker">${say(l,'SAMPLE REPORT · FICTIONAL RESPONSES','उदाहरण REPORT · काल्पनिक जवाब')}</p>`)
 .replace('Your thoughts, reactions and relationships. A starting point for reflection.','Six interactive areas. Select a mark, explore a question, or compare example check-ins.')
 .replace('आपके विचार, प्रतिक्रियाएँ और रिश्ते। खुद को समझने की एक शुरुआत।','छह interactive पहलू। कोई निशान चुनें, सवाल देखें या उदाहरण check-ins की तुलना करें।')
 .replace(/<button class="mh-primary" data-action="save">[^<]*<\/button>/,'')
 .replace('Up to 8 check-ins, ending at this report. Missing answers stay as gaps. Only reports saved in this browser are available.','These example dates and check-ins are fictional. Your own timeline uses your saved check-ins.')
 .replace('इस report तक के अधिकतम 8 check-ins। छोड़े गए जवाबों की जगह खाली रहती है। केवल इसी browser में सेव reports उपलब्ध हैं।','ये उदाहरण की तारीखें और check-ins काल्पनिक हैं। आपकी timeline आपके सेव check-ins से बनेगी।');
 return `<aside class="wb-demo-banner"><div><strong>${say(l,'INTERACTIVE SAMPLE REPORT','INTERACTIVE उदाहरण REPORT')}</strong><p>${say(l,'Illustrative answers. Explore how your own report will work.','ये उदाहरण के जवाब हैं। देखें कि आपकी report कैसे काम करेगी।')}</p></div><button class="mh-primary" data-action="begin">${say(l,'Start My Test','अपना टेस्ट शुरू करें')} →</button></aside><div class="wb-demo-controls"><span>${say(l,'Try different sample answers','अलग उदाहरण के जवाब देखें')}</span><div role="group" aria-label="${say(l,'Sample answer patterns','उदाहरण के जवाबों के तरीके')}">${[['mixed','A mix of answers','मिले-जुले जवाब'],['sometimes','Mostly sometimes','ज़्यादातर कभी-कभी'],['varied','A wider range','अलग-अलग जवाब']].map(([key,en,hi])=>`<button data-sample-preset="${key}" aria-pressed="${preset===key}">${say(l,en,hi)}</button>`).join('')}</div></div>${html}`;
}
