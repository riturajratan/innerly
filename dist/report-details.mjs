// Keep summary links, deep links and answer filters connected to the full report.
export function mountReportDetails(root,{signal}={}){
 const details=root.querySelector('#report-details');
 if(!details)return;
 const revealHash=hash=>{
  if(!hash||hash==='#')return;
  let id;try{id=decodeURIComponent(hash.slice(1));}catch{return;}
  const target=document.getElementById(id);
  if(target&&details.contains(target))details.open=true;
 };
 root.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');
  if(link){
   if(link.classList.contains('report-back-summary'))details.open=false;
   revealHash(link.getAttribute('href'));
  }
  if(event.target.closest('[data-personal-group],[data-filter],[data-area-jump]'))details.open=true;
 },{signal});
 window.addEventListener('hashchange',()=>revealHash(location.hash),{signal});
 revealHash(location.hash);
}
