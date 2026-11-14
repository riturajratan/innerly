import {test} from 'node:test';
import assert from 'node:assert/strict';
import {saveLocalReport,removeLocalReport} from '../dist/report-storage.mjs';
import {makeWorkbookReport,readWorkbookReports} from '../dist/innerly-v1-model.mjs';

const make=id=>makeWorkbookReport(Array(36).fill(2),{id,createdAt:'2026-11-14T06:00:00Z',language:'en'});
function store(value=null){return {value,getItem(){return this.value;},setItem(key,next){this.value=next;}};}

test('saving and reloading preserves every report beyond the old 50-report limit',()=>{
 const earlier=Array.from({length:65},(_,i)=>make(`earlier-${i}`)),storage=store(JSON.stringify(earlier)),latest=make('latest');
 saveLocalReport(storage,'reports',latest);
 assert.deepEqual(readWorkbookReports(storage.value),[latest,...earlier]);
 const before=storage.value;saveLocalReport(storage,'reports',latest);assert.equal(storage.value,before);
});

test('a save reads the current store and preserves unfamiliar records and another tab’s save',()=>{
 const old=make('old'),other=make('other-tab'),unknown={id:'future-version',version:'future',answers:[1,2],extra:'keep'},storage=store(JSON.stringify([old]));
 storage.value=JSON.stringify([other,unknown,old]);
 saveLocalReport(storage,'reports',make('new'));
 assert.deepEqual(JSON.parse(storage.value).slice(1),[other,unknown,old]);
 const before=storage.value;saveLocalReport(storage,'reports',{...old,answers:Array(36).fill(4)});assert.equal(storage.value,before);
});

test('unreadable storage and quota failures never replace or prune existing data',()=>{
 for(const value of ['broken JSON','{"unexpected":"object"}']){
  const storage=store(value);assert.throws(()=>saveLocalReport(storage,'reports',make('new')));assert.equal(storage.value,value);
 }
 const storage=store(JSON.stringify([make('keep')])),before=storage.value;
 storage.setItem=()=>{throw new Error('QuotaExceededError');};
 assert.throws(()=>saveLocalReport(storage,'reports',make('new')));assert.equal(storage.value,before);
});

test('explicit deletion removes only the chosen ID from the latest store',()=>{
 const keep=make('keep'),other=make('other-tab'),unknown={id:'future',extra:true},storage=store(JSON.stringify([keep,other,unknown]));
 removeLocalReport(storage,'reports','keep');assert.deepEqual(JSON.parse(storage.value),[other,unknown]);
});
