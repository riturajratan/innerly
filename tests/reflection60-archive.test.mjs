import {test} from "node:test";import assert from "node:assert/strict";
import {completeReflection,reflectionTopics,responseCounts,topicResponses,makeReflectionReport,readReflectionReports} from "../dist/reflection60-model.mjs";
const full=(n=2)=>Array(60).fill(n);
test('response charts partition 59 non-sensitive statements exactly once and exclude self-harm responses',()=>{
 const items=reflectionTopics.flatMap(t=>t.items).sort((a,b)=>a-b);assert.deepEqual(items,Array.from({length:60},(_,i)=>i+1).filter(n=>n!==2));
 for(const v of [0,1,2,3,4,'skip']){const a=full(3);a[1]=v;assert.deepEqual(responseCounts(a),[0,0,0,59,0]);for(const t of reflectionTopics){const s=topicResponses(a,t);assert.equal(s.total,t.items.length);assert.equal(s.agreed,t.items.length);}}
});
