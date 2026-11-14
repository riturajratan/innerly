import {createFeedbackMotion} from './feedback-motion.mjs?v=3';
const say=(l,en,hi)=>l==='hi'?hi:en;
export const FEEDBACK_STORAGE='innerly.feedback.pending.v1';
export function validateFeedback({name='',email='',message=''}={},l='en'){
 const errors={};
 if(!name.trim())errors.name=say(l,'Please enter your name.','कृपया अपना नाम लिखें।');
 else if(name.trim().length>80)errors.name=say(l,'Use 80 characters or fewer.','80 अक्षरों तक लिखें।');
 if(!email.trim())errors.email=say(l,'Please enter your email.','कृपया अपना email लिखें।');
 else if(email.trim().length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))errors.email=say(l,'Enter a valid email, like name@example.com.','सही email लिखें, जैसे name@example.com।');
 if(message.trim().length<10)errors.message=say(l,'Please write at least 10 characters.','कृपया कम से कम 10 अक्षर लिखें।');
 else if(message.trim().length>1500)errors.message=say(l,'Keep your message within 1,500 characters.','संदेश 1,500 अक्षरों तक रखें।');
 return errors;
}
export function saveFeedback(storage,entry){
 const raw=storage.getItem(FEEDBACK_STORAGE),rows=raw===null?[]:JSON.parse(raw);
 if(!Array.isArray(rows))throw new Error('Feedback storage is unavailable.');
 if(rows.some(row=>row?.id===entry.id))return;
 storage.setItem(FEEDBACK_STORAGE,JSON.stringify([...rows,entry]));
}
export function feedbackMarkup(l='en'){
 return `<button class="ifb-launcher" type="button" aria-label="${say(l,'Open feedback','Feedback खोलें')}" aria-haspopup="dialog" aria-controls="innerly-feedback" aria-expanded="false"><span class="ifb-mind"><img src="assets/innerly-mark.svg?v=5" width="38" height="38" alt=""><svg class="ifb-idle-waves" viewBox="0 0 64 48" fill="none" aria-hidden="true"><path d="M31 18C43 22 46 6 61 9M31 18C43 27 50 12 63 18M31 18C21 10 13 14 2 7M31 18C20 17 15 27 2 22"/></svg></span><span>${say(l,'Feedback','आपकी राय')}</span></button>
 <dialog class="ifb-dialog" id="innerly-feedback" lang="${l}" dir="ltr" aria-labelledby="ifb-title" aria-describedby="ifb-description">
  <button type="button" class="ifb-close" aria-label="${say(l,'Close feedback','Feedback बंद करें')}">×</button><svg class="ifb-energy" aria-hidden="true" focusable="false" hidden></svg><div class="ifb-surface"><div class="ifb-book">
   <aside class="ifb-note"><span class="ifb-brand"><img src="assets/innerly-mark.svg?v=5" alt="" width="33" height="33">innerly.</span><p class="ifb-note-title">${say(l,'A little feedback.<br><em>A better Innerly.</em>','आपकी थोड़ी-सी राय।<br><em>एक बेहतर Innerly।</em>')}</p><div class="ifb-orbits" aria-hidden="true"><i></i><i></i><i></i><b>✦</b></div><p>${say(l,'You help shape this space.<br>We’re listening.','इस जगह को बेहतर बनाने में<br>आपकी बात मायने रखती है।')}</p><span class="ifb-note-foot">${say(l,'MADE TO GROW WITH YOU','आपके साथ बेहतर होता हुआ')}</span></aside>
   <div class="ifb-paper">
    <span class="ifb-eyebrow">${say(l,'A NOTE TO INNERLY','INNERLY के नाम एक नोट')}</span><h2 id="ifb-title">${say(l,'What’s on your mind?','क्या कहना चाहेंगे?')}</h2><p id="ifb-description">${say(l,'An idea, a little love, or something we can improve.','कोई सुझाव, कुछ अच्छा लगा हो, या कुछ बेहतर हो सकता हो।')}</p>
    <form class="ifb-form" novalidate><fieldset><legend>${say(l,'I’d like to share…','मैं साझा करना चाहूँगा/चाहूँगी…')}</legend><div class="ifb-types">${[['idea','✦','An idea','एक सुझाव'],['problem','↗','An issue','एक समस्या'],['love','♡','Some love','कुछ अच्छा लगा']].map(([value,symbol,en,hi])=>`<label><input type="radio" name="feedback-kind" value="${value}"${value==='idea'?' checked':''}><span><b aria-hidden="true">${symbol}</b>${say(l,en,hi)}</span></label>`).join('')}</div></fieldset>
    <div class="ifb-contact-fields"><label class="ifb-field" for="ifb-name"><span id="ifb-name-label">${say(l,'Name','नाम')}</span><input aria-labelledby="ifb-name-label" id="ifb-name" name="name" required maxlength="80" autocomplete="name" placeholder="${say(l,'Your name','आपका नाम')}" aria-describedby="ifb-name-error"><span class="ifb-error" id="ifb-name-error"></span></label>
    <label class="ifb-field" for="ifb-email"><span id="ifb-email-label">Email</span><input aria-labelledby="ifb-email-label" id="ifb-email" name="email" type="email" required maxlength="254" autocomplete="email" placeholder="name@example.com" aria-describedby="ifb-email-error"><span class="ifb-error" id="ifb-email-error"></span></label></div>
    <label class="ifb-field" for="ifb-message"><span id="ifb-message-label">${say(l,'Message','संदेश')}</span><textarea aria-labelledby="ifb-message-label" id="ifb-message" name="message" required minlength="10" maxlength="1500" rows="3" placeholder="${say(l,'What would make Innerly better for you?','Innerly आपके लिए कैसे बेहतर हो सकता है?')}" aria-describedby="ifb-message-error ifb-privacy"></textarea><span class="ifb-message-meta"><span class="ifb-error" id="ifb-message-error"></span><small class="ifb-character-count">0 / 1500</small></span></label>
    <p id="ifb-privacy" class="ifb-privacy">${say(l,'Please leave personal health details and report answers out of your message.','कृपया संदेश में निजी स्वास्थ्य जानकारी या रिपोर्ट के जवाब न लिखें।')}</p>
    <button class="ifb-submit" type="submit">${say(l,'Submit feedback','Feedback जमा करें')}<span aria-hidden="true">↗</span></button>
    <p class="ifb-delivery">${say(l,'Saved on this device for now. Online delivery is coming later.','अभी इसी device पर सेव होगा। Online भेजने की सुविधा बाद में जुड़ेगी।')}</p>
    <p class="ifb-status" role="status"></p></form>
    <div class="ifb-success" hidden tabindex="-1"><span class="ifb-success-icon" aria-hidden="true">✓</span><h3>${say(l,'A little note.<br>A little better.','आपकी राय।<br>बेहतरी की शुरुआत।')}</h3><p>${say(l,'Thank you for helping Innerly grow.','Innerly को बेहतर बनाने में मदद के लिए धन्यवाद।')}</p><p class="ifb-saved-note">${say(l,'Your feedback is saved on this device. It has not been sent to the team yet.','आपका feedback इसी device पर सेव है। अभी टीम को भेजा नहीं गया है।')}</p><button class="ifb-submit" type="button" data-feedback-done>${say(l,'Done','ठीक है')}<span aria-hidden="true">✓</span></button><button type="button" class="ifb-another" data-feedback-another>${say(l,'Write another note','एक और राय लिखें')}</button></div>
   </div>
  </div></div>
 </dialog>`;
}
export function mountFeedback(){
 if(document.querySelector('#innerly-feedback'))return;
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('./feedback.css?v=5',import.meta.url).href;document.head.append(css);
 const root=document.createElement('div');root.id='innerly-feedback-widget';document.body.append(root);
 let locale,launcher,dialog,form,motion,hasOpened=false,submitted=false;
 try{hasOpened=sessionStorage.getItem('innerly.feedback.waves-opened.v1')==='1';}catch{}
 function render(){
  const l=document.documentElement.lang==='hi'?'hi':'en';if(locale===l)return;
  const previous=form&&!submitted?{kind:form.elements['feedback-kind'].value,name:form.elements.name.value,email:form.elements.email.value,message:form.elements.message.value}:null;
  motion?.destroy();locale=l;submitted=false;root.innerHTML=feedbackMarkup(l);launcher=root.querySelector('.ifb-launcher');dialog=root.querySelector('dialog');form=root.querySelector('form');
  motion=createFeedbackMotion({dialog,launcher,surface:root.querySelector('.ifb-surface'),energy:root.querySelector('.ifb-energy')});
  if(previous){form.elements['feedback-kind'].value=previous.kind;for(const key of ['name','email','message'])form.elements[key].value=previous[key];}
  launcher.onclick=()=>{render();motion.open(!hasOpened);hasOpened=true;try{sessionStorage.setItem('innerly.feedback.waves-opened.v1','1');}catch{}};
  root.querySelector('.ifb-close').onclick=()=>motion.close();
  root.querySelector('[data-feedback-done]').onclick=()=>motion.close();
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)motion.close();}});
  function values(){return Object.fromEntries(['name','email','message'].map(key=>[key,form.elements[key].value.trim()]));}
  function fieldError(key,error){form.elements[key].setAttribute('aria-invalid',String(!!error));root.querySelector(`#ifb-${key}-error`).textContent=error||'';}
  function counter(){root.querySelector('.ifb-character-count').textContent=`${form.elements.message.value.length} / 1500`;}
  counter();
  for(const key of ['name','email','message']){
   form.elements[key].addEventListener('blur',()=>{if(form.elements[key].value||form.elements[key].getAttribute('aria-invalid')==='true')fieldError(key,validateFeedback(values(),locale)[key]);});
   form.elements[key].addEventListener('input',()=>{if(form.elements[key].getAttribute('aria-invalid')==='true')fieldError(key,validateFeedback(values(),locale)[key]);counter();});
  }
  form.addEventListener('submit',event=>{
   event.preventDefault();if(submitted)return;
   const data=values(),errors=validateFeedback(data,locale);
   for(const key of ['name','email','message'])fieldError(key,errors[key]);
   const first=Object.keys(errors)[0];
   if(first){root.querySelector('.ifb-status').textContent=say(locale,'Please check the highlighted fields.','कृपया हाइलाइट किए गए fields ठीक करें।');form.elements[first].focus();return;}
   const button=form.querySelector('[type="submit"]');button.disabled=true;
   try{saveFeedback(localStorage,{id:crypto.randomUUID(),createdAt:new Date().toISOString(),kind:form.elements['feedback-kind'].value,...data,status:'pending'});}
   catch{button.disabled=false;root.querySelector('.ifb-status').textContent=say(locale,'Your feedback could not be saved. Your message is still here; please try again.','Feedback सेव नहीं हो सका। आपका संदेश यहीं है; कृपया फिर कोशिश करें।');return;}
   submitted=true;form.hidden=true;root.querySelector('.ifb-success').hidden=false;root.querySelector('.ifb-success').focus({preventScroll:true});
  });
  root.querySelector('[data-feedback-another]').onclick=()=>{
   submitted=false;form.reset();form.hidden=false;form.querySelector('[type="submit"]').disabled=false;root.querySelector('.ifb-success').hidden=true;
   for(const key of ['name','email','message'])fieldError(key,'');root.querySelector('.ifb-status').textContent='';counter();form.elements.name.focus();
  };
 }
 render();new MutationObserver(()=>{if(!dialog.open)render();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}
if(typeof document!=='undefined')mountFeedback();
