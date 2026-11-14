// Read the latest value before every write; never prune another report to save space.
function storedRows(storage,key){
 const raw=storage.getItem(key),rows=raw===null?[]:JSON.parse(raw);
 if(!Array.isArray(rows))throw new Error('The existing report store could not be read.');
 return rows;
}
export function saveLocalReport(storage,key,report){
 if(!report||typeof report.id!=='string'||!report.id)throw new Error('A report ID is required.');
 const rows=storedRows(storage,key);
 if(rows.some(row=>row?.id===report.id))return rows;
 const next=[report,...rows];
 storage.setItem(key,JSON.stringify(next));
 return next;
}
// Explicit deletion removes only the requested record, including with stale page state.
export function removeLocalReport(storage,key,id){
 const rows=storedRows(storage,key),next=rows.filter(row=>row?.id!==id);
 storage.setItem(key,JSON.stringify(next));
 return next;
}
