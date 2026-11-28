const SAMPLE_URL='https://knowyourmind.ai/report-preview';
const say=(language,en,hi)=>language==='hi'?hi:en;

export function shareReportMarkup(language){
 const t=(en,hi)=>say(language,en,hi);
 return `<h2 id="report-share-title">${t('Share your reflection','अपनी reflection साझा करें')}</h2>
  <p>${t('Share the public sample, or review a short summary from your report first.','सार्वजनिक उदाहरण साझा करें, या पहले अपनी रिपोर्ट का छोटा सार देखें।')}</p>
  <div class="report-share-actions">
   <a class="mh-primary" href="https://wa.me/?text=${encodeURIComponent(SAMPLE_URL)}" target="_blank" rel="noopener noreferrer">${t('Send sample on WhatsApp','WhatsApp पर उदाहरण भेजें')}</a>
   <button class="mh-secondary" data-share-copy-sample>${t('Copy sample link','उदाहरण का लिंक कॉपी करें')}</button>
  </div>
  <details class="report-share-private">
   <summary>${t('Share my report summary','मेरी रिपोर्ट का सार साझा करें')}</summary>
   <label for="report-share-text">${t('Review or edit the text before you share.','साझा करने से पहले टेक्स्ट देखें या बदलें।')}</label>
   <textarea id="report-share-text" rows="6" maxlength="1200"></textarea>
   <div class="report-share-actions">
    <button class="mh-primary" data-share-whatsapp>${t('Open in WhatsApp','WhatsApp में खोलें')}</button>
    <button class="mh-secondary" data-share-copy>${t('Copy summary','सार कॉपी करें')}</button>
    <button class="mh-secondary" data-share-native hidden>${t('More sharing options','साझा करने के और विकल्प')}</button>
   </div>
  </details>
  <button type="button" class="mh-link" data-share-pdf>${t('Open Print / PDF for the full report','पूरी रिपोर्ट के लिए Print / PDF खोलें')}</button>
  <p role="status" class="report-share-status"></p>`;
}

export function openReportShare(dialog,root,{language='en',onPDF}={}){
 const t=(en,hi)=>say(language,en,hi);
 const summary=[...root.querySelectorAll('.cs-highlights > div')].map(card=>
  card.querySelector('dt').textContent+': '+card.querySelector('dd').textContent
 ).join('\n');
 const input=dialog.querySelector('#report-share-text');
 input.value=t('My Know Your Mind reflection','मेरी Know Your Mind reflection')+'\n\n'+summary;
 const status=dialog.querySelector('.report-share-status');
 async function copy(text){
  try{
   await navigator.clipboard.writeText(text);
   status.textContent=t('Copied.','कॉपी हो गया।');
  }catch{
   status.textContent=t('Copy didn’t work. Please try again.','कॉपी नहीं हुआ। ऊपर का टेक्स्ट चुनकर कॉपी करें।');
  }
 }
 const whatsapp=dialog.querySelector('[data-share-whatsapp]');
 function syncWhatsApp(){
  const text=input.value.trim();
  whatsapp.disabled=!text;
  dialog.querySelector('[data-share-copy]').disabled=!text;
  native.disabled=!text;
 }
 const native=dialog.querySelector('[data-share-native]');
 native.hidden=typeof navigator.share!=='function';
 native.onclick=async()=>{
  try{await navigator.share({text:input.value.trim()});}
  catch(error){if(error.name!=='AbortError')status.textContent=t('Sharing didn’t open. Try copying the summary.','साझा करने का विकल्प नहीं खुला। सार कॉपी करें।');}
 };
 whatsapp.onclick=()=>window.open('https://wa.me/?text='+encodeURIComponent(input.value.trim()),'_blank','noopener,noreferrer');
 input.addEventListener('input',syncWhatsApp);
 syncWhatsApp();
 dialog.querySelector('[data-share-copy]').onclick=()=>copy(input.value.trim());
 dialog.querySelector('[data-share-copy-sample]').onclick=()=>copy(SAMPLE_URL);
 dialog.querySelector('[data-share-pdf]').onclick=onPDF;
}
