import {validWorkbookReport} from './innerly-v1-model.mjs';
// Account answers stay in memory only and are invalidated before switching users.
export function createAccountReportStore({api,onChange=()=>{}}){
 let state={userId:null,reports:[],cursor:null,loaded:false,loading:false,error:''},generation=0,revision=0;
 const emit=()=>onChange({...state,reports:[...state.reports]});
 const current=g=>g===generation;
 return {
  get state(){return {...state,reports:[...state.reports]};},
  setUser(userId){if(userId===state.userId)return;generation++;state={userId,reports:[],cursor:null,loaded:false,loading:false,error:''};emit();},
  async load(more=false){
   if(!state.userId||state.loading||(more&&!state.cursor))return;
   const g=generation,r=revision,cursor=more?state.cursor:null;state.loading=true;state.error='';emit();
   try{const data=await api('/reports/history'+(cursor?'?cursor='+encodeURIComponent(cursor):''));if(!current(g)||r!==revision)return;
    const rows=data.reports.filter(validWorkbookReport).map(r=>({...r,cloudId:r.id}));
    const unique=new Map((more?[...state.reports,...rows]:rows).map(r=>[r.id,r]));
    state.reports=[...unique.values()].sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt)||a.id.localeCompare(b.id));state.cursor=data.nextCursor;state.loaded=true;
   }catch(error){if(current(g))state.error=error.message;}finally{if(current(g)){state.loading=false;emit();if(r!==revision)await this.load();}}
  },
  async save(report,consent){
   const g=generation;if(!state.userId)throw new Error('Please sign in to save this report.');
   const result=await api('/reports','POST',{clientId:report.clientId||report.id,version:report.version,language:report.language,answers:report.answers,assessedAt:report.createdAt,consent});
   if(!current(g))return null;
   revision++;const saved={...report,id:result.id,clientId:report.clientId||report.id,cloudId:result.id};state.reports=[saved,...state.reports.filter(r=>r.id!==saved.id)].sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt)||a.id.localeCompare(b.id));emit();return saved;
  },
  async remove(id){const g=generation;await api('/reports/'+encodeURIComponent(id),'DELETE');if(!current(g))return;revision++;state.reports=state.reports.filter(r=>r.id!==id);emit();},
 };
}
