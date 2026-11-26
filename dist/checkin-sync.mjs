import {supportedLanguage} from './mental-language.mjs?v=mh-14';
// Owner-scoped local recovery plus encrypted account drafts. Never upload guest
// drafts on sign-in, and never overwrite a newer draft from another tab/device.
export function createCheckinSync({api,storage,onRestore=()=>{},onStatus=()=>{},onSaved=()=>{}}){
 let owner=null,generation=0,state,ready=false,running=false,timer,blocked=false,locallySaved=true;
 const blank=()=>({revision:0,draft:null,dirty:false,pending:[]});
 const key=()=>`knowyourmind-checkin:${owner||'guest'}`;
 const persist=()=>{try{storage.setItem(key(),JSON.stringify(state));locallySaved=true;return true;}catch{locallySaved=false;onStatus('Could not save on this device. Keep this page open.');return false;}};
 const current=g=>g===generation;
 const validDraft=d=>d&&typeof d.id==='string'&&/^[a-zA-Z0-9_-]{8,128}$/.test(d.id)&&d.version==='innerly-workbook-v1'&&supportedLanguage(d.language)&&Array.isArray(d.answers)&&d.answers.length===36&&d.answers.every(v=>v===null||(Number.isInteger(v)&&v>=0&&v<=4));
 const recovery=()=>locallySaved?'Saved on this device. Account sync will retry when you reconnect.':'Could not save yet. Keep this page open and retry sync.';
 async function drain(){
  if(!owner||!ready||running||(blocked&&!state.pending.length))return;
  const g=generation;running=true;
  try{
   while(current(g)&&(state.pending.length||(!blocked&&state.dirty))){
    onStatus('Saving…');
    if(state.pending.length){
     const report=state.pending[0];
     const result=await api('/reports','POST',{clientId:report.id,version:report.version,language:report.language,answers:report.answers,assessedAt:report.createdAt,consent:report.consent});
     if(!current(g))return;
     // A newer check-in on another device must survive completion of this one.
     const remote=await api('/draft');if(!current(g))return;
     if(remote.draft&&remote.revision===state.revision){try{const cleared=await api('/draft','DELETE',{id:remote.draft.id,revision:remote.revision});if(!current(g))return;state.revision=cleared.revision;}catch(error){if(!current(g))return;if(!String(error.message).includes('another tab'))throw error;}}
     state.pending=state.pending.filter(r=>r.id!==report.id);persist();onSaved({...report,id:result.id,clientId:report.id,cloudId:result.id});
    }else{
     const draft=state.draft;if(!draft){state.dirty=false;persist();continue;}
     const payload={id:draft.id,language:draft.language,answers:[...draft.answers],revision:state.revision};
     const result=await api('/draft','PUT',payload);if(!current(g))return;
     state.revision=result.revision;
     if(state.draft===draft)state.dirty=false;
     persist();
    }
   }
   if(current(g)&&!blocked)onStatus('Saved to your account');
  }catch(error){if(current(g)){blocked=String(error.message).includes('another tab');onStatus(blocked?'A newer check-in exists in another tab or device. Your answers are safe here; choose Keep this draft to continue with these answers.':recovery());}}
  finally{if(current(g)){running=false;if(!blocked&&(state.pending.length||state.dirty))timer=setTimeout(drain,15000);}}
 }
 return {
  dispose(){clearTimeout(timer);generation++;ready=false;},
  get draft(){return state?.draft||null;},
  get locallySaved(){return locallySaved;},
  isPending(id){return state?.pending.some(r=>r.id===id)||false;},
  async setUser(id){
   clearTimeout(timer);owner=id;const g=++generation;running=false;ready=false;blocked=false;state=blank();
   try{const cached=JSON.parse(storage.getItem(key()));if(cached&&Array.isArray(cached.pending)&&Number.isSafeInteger(cached.revision)&&cached.revision>=0&&typeof cached.dirty==='boolean'&&(!cached.draft||validDraft(cached.draft))&&cached.pending.every(r=>validDraft(r)&&r.answers.every(Number.isInteger)&&Number.isFinite(Date.parse(r.createdAt))&&r.consent==='cloud-reports-v1'))state=cached;}catch{}
   onRestore(state.draft);if(!owner){ready=true;onStatus(state.draft?'Saved on this device':'');return;}
   try{const remote=await api('/draft');if(!current(g))return;
    if(state.dirty&&state.revision!==remote.revision){blocked=true;onStatus('A newer check-in exists in another tab or device. Your answers are safe here; choose Keep this draft to continue with these answers.');}
    else if(!state.dirty){state.draft=state.pending.some(r=>r.id===remote.draft?.id)?null:remote.draft;state.revision=remote.revision;persist();onRestore(state.draft);}
    ready=true;await drain();
   }catch{if(current(g)){onStatus(recovery());timer=setTimeout(()=>this.setUser(owner),15000);}}
  },
  update(answers,language){if(!state)state=blank();state.draft={id:state.draft?.id||crypto.randomUUID(),version:'innerly-workbook-v1',language,answers:[...answers],savedAt:new Date().toISOString()};state.dirty=!!owner;const stored=persist();if(stored)onStatus(owner?'Saving…':'Saved on this device');clearTimeout(timer);timer=setTimeout(drain,800);return state.draft;},
  fresh(answers,language){if(!state)state=blank();state.draft=null;return this.update(answers,language);},
  complete(report,consent){if(!owner){state.draft=null;state.dirty=false;persist();return;}if(!state.pending.some(r=>r.id===report.id))state.pending.push({...report,consent});state.draft=null;state.dirty=false;persist();clearTimeout(timer);drain();},
  async discard(){
   if(running)throw new Error('Please wait for saving to finish.');
   clearTimeout(timer);const g=generation;
   if(owner){const remote=await api('/draft');if(!current(g))return;
    if(remote.draft){if(remote.draft.id!==state.draft?.id||remote.revision!==state.revision)throw new Error('Draft changed. Reload first.');const result=await api('/draft','DELETE',{id:remote.draft.id,revision:remote.revision});if(!current(g))return;state.revision=result.revision;}}
   state.draft=null;state.dirty=false;persist();onRestore(null);
  },
  async keepCurrent(){const g=generation;const remote=await api('/draft');if(!current(g))return;state.revision=remote.revision;blocked=false;ready=true;state.dirty=!!state.draft;persist();return drain();},
  retry(){if(!ready)return this.setUser(owner);clearTimeout(timer);return drain();},
 };
}
