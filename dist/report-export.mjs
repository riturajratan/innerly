const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const text=(language,en,hi)=>language==='hi'?hi:en;
export const exportModes=['consolidated','full'];
export function exportTitle(mode,language='en'){
 if(!exportModes.includes(mode))throw new Error('Unknown report export format.');
 return mode==='full'?text(language,'Full detailed report','पूरी विस्तृत रिपोर्ट'):text(language,'Consolidated report','समेकित रिपोर्ट');
}
export function reportExportChoices(language='en'){
 const t=(en,hi)=>text(language,en,hi);
 return `<form method="dialog" class="report-export-form"><div class="report-export-heading"><h2 id="report-export-title">${t('Choose your PDF','अपनी PDF चुनें')}</h2><button class="export-close" value="cancel" aria-label="${t('Close','बंद करें')}">×</button></div><p>${t('Both start with your meter and answer breakdown.','दोनों के पहले पेज पर आपका मीटर और जवाबों का ब्योरा होगा।')}</p><fieldset><legend class="sr-only">${t('Report format','रिपोर्ट का प्रकार')}</legend>${exportModes.map((mode,i)=>`<label class="report-export-option"><input type="radio" name="report-export-mode" value="${mode}"${i===0?' checked':''}><span class="export-option-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h7"/>${i?'<path d="M3 7v14"/>':''}</svg></span><span><strong>${exportTitle(mode,language)}</strong><small>${i?t('Summary + six areas + all 36 answers','सारांश + छह पहलू + सभी 36 जवाब'):t('Your patterns, strengths and next steps','आपके पैटर्न, मजबूतियाँ और अगले कदम')}</small></span></label>`).join('')}</fieldset><div class="report-export-footer"><button class="export-cancel" value="cancel">${t('Cancel','रद्द करें')}</button><button class="export-primary" type="button" data-export-preview>${t('Preview PDF','PDF की झलक देखें')}</button></div><p class="report-export-error" role="status"></p></form>`;
}

export function reportExportDocument({mode,language='en',intro,overview,summary,detail='',styles=[],scriptURL}){
 const title=exportTitle(mode,language),t=(en,hi)=>text(language,en,hi);
 return `<!doctype html><html lang="${language==='hi'?'hi':'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Innerly — ${title}</title>${styles.map(({href,media})=>`<link rel="stylesheet" href="${escapeHTML(href)}"${media?` media="${escapeHTML(media)}"`:''}>`).join('')}<style media="print">@page{@top-right{content:${JSON.stringify(title)};font:8pt 'DM Sans',sans-serif;color:#647d70}}</style></head><body class="report-export-document" data-export-mode="${mode}"><nav class="export-preview-toolbar" aria-label="${t('PDF preview controls','PDF झलक के विकल्प')}"><div><strong>innerly.</strong><span>${title}</span></div><div><button class="export-cancel" data-close-preview>${t('Close preview','झलक बंद करें')}</button><button class="export-primary" data-save-pdf>${t('Print / Save PDF','Print / PDF सेव करें')}</button></div></nav><main class="export-paper"><section class="export-first-page" aria-label="${t('First PDF page','PDF का पहला पेज')}"><header class="export-paper-brand"><strong>innerly.</strong><span>${title}</span></header>${intro}${overview}</section><div class="export-report-body">${summary}${mode==='full'?detail:''}</div><footer class="export-paper-footer">innerly. · ${t('A reflection on your answers, not a health score.','आपके जवाबों पर आधारित reflection, health score नहीं।')}</footer></main><script type="module" src="${escapeHTML(scriptURL)}"></script></body></html>`;
}

function copySection(node,{remove=[]}={}){
 if(!node)throw new Error('The report is still loading.');
 const clone=node.cloneNode(true);
 remove.forEach(selector=>clone.querySelectorAll(selector).forEach(child=>child.remove()));
 clone.removeAttribute('id');
 // SVG paint servers must retain their fragment IDs in the isolated document.
 clone.querySelectorAll('[id]').forEach(child=>{if(!child.closest('svg'))child.removeAttribute('id');});
 clone.querySelectorAll('details').forEach(detail=>detail.open=true);
 if(clone.tagName==='DETAILS')clone.open=true;
 // Navigation and controls belong to the interactive report, not its snapshot.
 clone.querySelectorAll('.report-back-summary,.report-detail-link,.chart-mode,.area-open,.try-check,.qe-tabs,.cs-map-preview').forEach(child=>child.remove());
 clone.querySelectorAll('button').forEach(button=>{button.disabled=true;button.tabIndex=-1;});
 clone.querySelectorAll('a').forEach(link=>link.removeAttribute('href'));
 [clone,...clone.querySelectorAll('*')].forEach(child=>{
  for(const name of ['aria-controls','aria-labelledby','aria-describedby','aria-haspopup'])child.removeAttribute(name);
  if(child.getAttribute('role')==='button'){child.removeAttribute('role');child.removeAttribute('tabindex');}
 });
 return clone.outerHTML;
}

export function collectReportExport(root,mode,language='en'){
 exportTitle(mode,language);
 const intro=copySection(root.querySelector('.report-intro'),{remove:['.title-spark','.intro-bottom']});
 const overview=copySection(root.querySelector('.cs-overall'),{remove:['.cp-reading']})+
  copySection(root.querySelector('.cp-synthesis'))+
  copySection(root.querySelector('.cs-area-overview'),{remove:['.cs-detail-heading p']});
 const summary=copySection(root.querySelector('.consolidated-summary'),{remove:['.cs-overall','.cs-area-overview','.cs-mock-details','.cs-detail-heading p','.cs-data-facts','.cs-answer-map .cs-chart-note']});
 const detail=mode==='full'?`<section class="export-explanation">${copySection(root.querySelector('.cp-reading'))}</section>`+copySection(root.querySelector('#report-details'),{remove:['.personal-benchmark']}):'';
 return {intro,overview,summary,detail};
}

export function createReportExporter({getRoot,getLanguage=()=> 'en',host=window}){
 const document=host.document;
 let chooser,trigger;
 function open(button){
  const root=getRoot();if(!root?.querySelector('.consolidated-summary'))return false;
  const language=getLanguage();trigger=button||document.activeElement;
  chooser?.remove();chooser=document.createElement('dialog');chooser.className='report-export-dialog';chooser.setAttribute('aria-labelledby','report-export-title');chooser.innerHTML=reportExportChoices(language);document.body.append(chooser);
  chooser.addEventListener('close',event=>{event.currentTarget.remove();if(trigger?.isConnected)trigger.focus({preventScroll:true});},{once:true});
  chooser.querySelector('[data-export-preview]').addEventListener('click',()=>{
   const mode=chooser.querySelector('input:checked').value;
   const styles=[...document.querySelectorAll('link[rel="stylesheet"]')].filter(link=>!link.disabled).map(link=>({href:link.href,media:link.media}));
   const html=reportExportDocument({mode,language,...collectReportExport(getRoot(),mode,language),styles,scriptURL:new URL('./report-export-preview.mjs?v=1',import.meta.url).href});
   const preview=document.createElement('dialog');preview.className='report-export-host';preview.setAttribute('aria-label',text(language,'PDF preview','PDF की झलक'));
   const frame=document.createElement('iframe');frame.title=text(language,'PDF preview','PDF की झलक');frame.srcdoc=html;preview.append(frame);
   const closePreview=event=>{if(event.source===frame.contentWindow&&event.origin===host.location.origin&&event.data?.type==='innerly-close-export')preview.close();};
   host.addEventListener('message',closePreview);
   preview.addEventListener('close',()=>{host.removeEventListener('message',closePreview);preview.remove();if(trigger?.isConnected)trigger.focus({preventScroll:true});},{once:true});
   chooser.close();document.body.append(preview);preview.showModal();
  });
  chooser.showModal();return true;
 }
 return {open};
}
