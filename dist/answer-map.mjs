import {answerInterpretation} from './answer-interpretations.mjs?v=1';

const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function answerMapPreview(item,language='en'){
 const hi=language==='hi',insight=answerInterpretation(item,language);
 const headings={support:['Why this is a strength','यह मजबूती क्यों है'],focus:['Why this needs attention','यहाँ ध्यान क्यों दें'],varies:['Why this is worth exploring','इसे और क्यों समझें']};
 return {...insight,id:item.id,index:item.index,category:item.category,response:item.response,heading:headings[item.category][hi?1:0]};
}

export function answerMapPreviewMarkup(item,language='en',id='cs-map-preview'){
 const hi=language==='hi',t=(en,hin)=>hi?hin:en,preview=answerMapPreview(item,language),esc=escapeHTML;
 return `<div class="cs-map-preview-heading"><span><i aria-hidden="true"></i>${esc(preview.heading)}</span><button type="button" data-map-close aria-label="${t('Close insight','Insight बंद करें')}">×</button></div><h4 id="${id}-title">${esc(preview.title)}</h4><p id="${id}-meaning">${esc(preview.meaning)}</p><div class="cs-map-preview-footer"><span>${preview.id} · ${t('Your answer','आपका जवाब')}: <b>${esc(preview.response)}</b></span><button type="button" data-map-detail>${t('View answer detail','जवाब विस्तार से देखें')} <span aria-hidden="true">→</span></button></div>`;
}

let previewId=0;
export function mountAnswerMap(root,{getSnapshot,language='en',onOpenQuestion,signal}={}){
 const doc=root.ownerDocument||root,win=doc.defaultView,controller=new AbortController();
 const options={signal:controller.signal},panel=doc.createElement('div');
 panel.id=`cs-map-preview-${++previewId}`;panel.className='cs-map-preview';panel.hidden=true;
 panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','false');panel.setAttribute('aria-labelledby',`${panel.id}-title`);panel.setAttribute('aria-describedby',`${panel.id}-meaning`);
 doc.body.append(panel);
 let trigger=null,index=null,pinned=false,openTimer=null,closeTimer=null,skipFocus=null;
 const cellFrom=target=>{const cell=target?.closest?.('[data-map-answer]');return cell&&root.contains(cell)?cell:null;};
 function cancelTimers(){clearTimeout(openTimer);clearTimeout(closeTimer);openTimer=null;closeTimer=null;}
 function hide(returnFocus=false){
  cancelTimers();const previous=trigger;
  if(previous){previous.setAttribute('aria-expanded','false');previous.removeAttribute('aria-describedby');previous.classList.remove('is-previewed');}
  panel.hidden=true;trigger=null;index=null;pinned=false;
  if(returnFocus&&previous?.isConnected){skipFocus=previous;previous.focus({preventScroll:true});}
 }
 function position(){
  if(!trigger?.isConnected)return hide();
  const rect=trigger.getBoundingClientRect(),box=panel.getBoundingClientRect(),map=trigger.closest('.cs-answer-map').getBoundingClientRect(),gap=10,margin=12;
  const header=doc.querySelector('.innerly-header')?.getBoundingClientRect();
  const minTop=header&&header.top<=0?Math.max(margin,header.bottom+8):margin;
  const beside=map.right+gap+box.width<=win.innerWidth-margin;
  const below=rect.bottom+gap+box.height<=win.innerHeight-margin;
  const mapLeft=Math.max(margin,map.left+8),mapRight=Math.min(win.innerWidth-box.width-margin,map.right-box.width-8);
  const left=beside?map.right+gap:Math.max(mapLeft<=mapRight?mapLeft:margin,Math.min(rect.left+rect.width/2-box.width/2,mapLeft<=mapRight?mapRight:win.innerWidth-box.width-margin));
  const preferredTop=beside?rect.top+rect.height/2-box.height/2:below?rect.bottom+gap:rect.top-box.height-gap;
  const top=Math.max(Math.min(minTop,win.innerHeight-box.height-margin),Math.min(preferredTop,win.innerHeight-box.height-margin));
  panel.style.left=`${left}px`;panel.style.top=`${Math.max(margin,top)}px`;panel.dataset.side=beside?'beside':below?'below':'above';
 }
 function show(cell,lock=false){
  cancelTimers();const next=Number(cell.dataset.mapAnswer),item=getSnapshot()?.items[next];
  if(!item||!cell.isConnected)return;
  if(trigger!==cell)hide();
  trigger=cell;index=next;pinned=lock;
  panel.className=`cs-map-preview ${item.category}`;
  panel.innerHTML=answerMapPreviewMarkup(item,language,panel.id);
  panel.hidden=false;panel.dataset.pinned=String(lock);
  cell.setAttribute('aria-expanded','true');cell.setAttribute('aria-controls',panel.id);cell.setAttribute('aria-describedby',`${panel.id}-meaning`);cell.classList.add('is-previewed');
  position();
 }
 function scheduleClose(){clearTimeout(closeTimer);if(!pinned)closeTimer=setTimeout(()=>hide(),180);}
 root.addEventListener('pointerover',event=>{
  const cell=cellFrom(event.target);if(!cell||event.pointerType==='touch'||pinned||cell.contains(event.relatedTarget))return;
  cancelTimers();openTimer=setTimeout(()=>show(cell),100);
 },options);
 root.addEventListener('pointerout',event=>{
  const cell=cellFrom(event.target);if(!cell||cell.contains(event.relatedTarget))return;
  clearTimeout(openTimer);if(!panel.contains(event.relatedTarget))scheduleClose();
 },options);
 root.addEventListener('focusin',event=>{
  const cell=cellFrom(event.target);if(!cell)return;
  if(cell===skipFocus){skipFocus=null;return;}
  skipFocus=null;if(!pinned)show(cell);
 },options);
 root.addEventListener('click',event=>{
  const cell=cellFrom(event.target);if(!cell)return;
  event.preventDefault();
  if(trigger===cell&&pinned){hide(true);return;}
  show(cell,true);panel.querySelector('[data-map-close]').focus({preventScroll:true});
 },options);
 panel.addEventListener('pointerenter',cancelTimers,options);
 panel.addEventListener('pointerleave',event=>{if(!trigger?.contains(event.relatedTarget))scheduleClose();},options);
 panel.addEventListener('click',event=>{
  if(event.target.closest('[data-map-close]')){hide(true);return;}
  if(event.target.closest('[data-map-detail]')){const selected=index,cell=trigger;skipFocus=cell;hide();onOpenQuestion?.(selected,cell);}
 },options);
 doc.addEventListener('pointerdown',event=>{if(!panel.hidden&&!panel.contains(event.target)&&!cellFrom(event.target))hide();},options);
 doc.addEventListener('focusin',event=>{if(!panel.hidden&&!panel.contains(event.target)&&!cellFrom(event.target))hide();},options);
 doc.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!panel.hidden){event.preventDefault();event.stopPropagation();hide(true);return;}
  const cell=cellFrom(event.target),delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-6,ArrowDown:6}[event.key];
  if(!cell||!delta)return;
  const next=Number(cell.dataset.mapAnswer)+delta,button=root.querySelector(`[data-map-answer="${next}"]`);
  if(button){event.preventDefault();pinned=false;button.focus();}
 },options);
 doc.addEventListener('scroll',event=>{if(!panel.contains(event.target))hide();},{...options,capture:true});
 win.addEventListener('resize',()=>hide(),options);
 function destroy(){hide();controller.abort();panel.remove();signal?.removeEventListener('abort',destroy);}
 if(signal?.aborted)destroy();else signal?.addEventListener('abort',destroy,{once:true});
 return {reset:()=>hide(),destroy};
}
