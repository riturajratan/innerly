const CONTACT='riturajratan@gmail.com';
const say=(l,en,hi)=>l==='hi'?hi:en;
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chat='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8 9 9 0 0 1-3.7-.8L3 21l1.7-5.2A8 8 0 1 1 20 11.5Z"/><path d="M8 10h8M8 14h5"/></svg>';
export function feedbackEmail({kind='idea',message='',name=''}={}){
 const types={problem:'Something isn’t working',idea:'An idea for Innerly',love:'Something I love'};
 return `mailto:${CONTACT}?subject=${encodeURIComponent(`Innerly feedback · ${types[kind]||types.idea}`)}&body=${encodeURIComponent(`${message.trim()}${name.trim()?`\n\nFrom: ${name.trim()}`:''}`)}`;
}
export function feedbackMarkup(l='en'){
 return `<button class="ifb-launcher" type="button" aria-label="${say(l,'Open feedback','Feedback खोलें')}" aria-haspopup="dialog" aria-controls="innerly-feedback">${chat}<span>${say(l,'Feedback','आपकी राय')}</span></button>
 <dialog class="ifb-dialog" id="innerly-feedback" lang="${l}" dir="ltr" aria-labelledby="ifb-title" aria-describedby="ifb-description">
  <div class="ifb-book">
   <aside class="ifb-note"><span class="ifb-brand"><img src="assets/innerly-mark.svg?v=5" alt="" width="33" height="33">innerly.</span><p class="ifb-note-title">${say(l,'A little feedback.<br><em>A better Innerly.</em>','आपकी थोड़ी-सी राय।<br><em>एक बेहतर Innerly।</em>')}</p><div class="ifb-orbits" aria-hidden="true"><i></i><i></i><i></i><b>✦</b></div><p>${say(l,'You help shape this space.<br>We’re listening.','इस जगह को बेहतर बनाने में<br>आपकी बात मायने रखती है।')}</p><span class="ifb-note-foot">${say(l,'MADE TO GROW WITH YOU','आपके साथ बेहतर होता हुआ')}</span></aside>
   <div class="ifb-paper"><button type="button" class="ifb-close" aria-label="${say(l,'Close feedback','Feedback बंद करें')}">×</button>
    <span class="ifb-eyebrow">${say(l,'A NOTE TO INNERLY','INNERLY के नाम एक नोट')}</span><h2 id="ifb-title">${say(l,'What’s on your mind?','क्या कहना चाहेंगे?')}</h2><p id="ifb-description">${say(l,'An idea, a little love, or something we can improve.','कोई सुझाव, कुछ अच्छा लगा हो, या कुछ बेहतर हो सकता हो।')}</p>
    <form class="ifb-form"><fieldset><legend>${say(l,'I’d like to share…','मैं साझा करना चाहूँगा/चाहूँगी…')}</legend><div class="ifb-types">${[['idea','✦','An idea','एक सुझाव'],['problem','↗','An issue','एक समस्या'],['love','♡','Some love','कुछ अच्छा लगा']].map(([value,symbol,en,hi])=>`<label><input type="radio" name="feedback-kind" value="${value}"${value==='idea'?' checked':''}><span><b aria-hidden="true">${symbol}</b>${say(l,en,hi)}</span></label>`).join('')}</div></fieldset>
    <label class="ifb-field">${say(l,'Your message','आपका संदेश')}<textarea name="message" required minlength="3" maxlength="1500" rows="4" placeholder="${say(l,'What would make Innerly better for you?','Innerly आपके लिए कैसे बेहतर हो सकता है?')}" aria-describedby="ifb-privacy"></textarea></label>
    <label class="ifb-field">${say(l,'Your name','आपका नाम')} <small>${say(l,'(optional)','(ज़रूरी नहीं)')}</small><input name="name" maxlength="80" autocomplete="name" placeholder="${say(l,'What should we call you?','आपको किस नाम से बुलाएँ?')}"></label>
    <p id="ifb-privacy" class="ifb-privacy">${say(l,'Please leave personal health details and report answers out of your message.','कृपया संदेश में निजी स्वास्थ्य जानकारी या रिपोर्ट के जवाब न लिखें।')}</p>
    <button class="ifb-submit" type="submit">${say(l,'Open email draft','Email draft खोलें')}<span aria-hidden="true">↗</span></button>
    <p class="ifb-delivery">${say(l,'Opens your mail app. Review your message, then send.','आपकी mail app खुलेगी। संदेश देखकर वहाँ से भेजें।')}<br><a href="mailto:${CONTACT}">${CONTACT}</a></p>
    <p class="ifb-status" role="status"></p></form>
   </div>
   <div class="ifb-fold" aria-hidden="true"><span>innerly.</span><strong>${say(l,'Your voice<br>belongs here.','आपकी बात<br>मायने रखती है।')}</strong>${chat}<small>${say(l,'A LITTLE NOTE. A LITTLE BETTER.','एक छोटी-सी राय। थोड़ी-सी बेहतरी।')}</small></div>
  </div>
 </dialog>`;
}
export function mountFeedback(){
 if(document.querySelector('#innerly-feedback'))return;
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('./feedback.css?v=2',import.meta.url).href;document.head.append(css);
 const root=document.createElement('div');root.id='innerly-feedback-widget';document.body.append(root);
 let locale,launcher,dialog,form,hasOpened=false;
 try{hasOpened=sessionStorage.getItem('innerly.feedback.opened.v1')==='1';}catch{}
 function render(){
  const l=document.documentElement.lang==='hi'?'hi':'en';if(locale===l)return;
  const previous=form?{kind:form.elements['feedback-kind'].value,message:form.elements.message.value,name:form.elements.name.value}:null;
  locale=l;root.innerHTML=feedbackMarkup(l);launcher=root.querySelector('.ifb-launcher');dialog=root.querySelector('dialog');form=root.querySelector('form');
  if(previous){form.elements['feedback-kind'].value=previous.kind;form.elements.message.value=previous.message;form.elements.name.value=previous.name;}
  launcher.onclick=()=>{render();dialog.classList.toggle('ifb-first-open',!hasOpened);dialog.showModal();hasOpened=true;try{sessionStorage.setItem('innerly.feedback.opened.v1','1');}catch{}requestAnimationFrame(()=>requestAnimationFrame(()=>{if(dialog.open)dialog.classList.add('is-open');}));};
  root.querySelector('.ifb-close').onclick=()=>dialog.close();
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{dialog.classList.remove('is-open');launcher.focus({preventScroll:true});});
  form.addEventListener('submit',event=>{
   event.preventDefault();const message=form.elements.message.value.trim();
   form.elements.message.setCustomValidity(message.length<3?say(locale,'Please write a short message.','कृपया एक छोटा संदेश लिखें।'):'');
   if(!form.reportValidity())return;
   location.href=feedbackEmail({kind:form.elements['feedback-kind'].value,message,name:form.elements.name.value});
   root.querySelector('.ifb-status').textContent=say(locale,'Your email draft is ready to open. Send it from your mail app. If no app opens, use the email address above.','Email draft आपकी mail app में खुलेगा। वहीं से भेजें। App न खुले तो ऊपर दिए email पर लिखें।');
  });
  form.elements.message.addEventListener('input',()=>form.elements.message.setCustomValidity(''));
 }
 render();new MutationObserver(()=>{if(!dialog.open)render();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}
if(typeof document!=='undefined')mountFeedback();
