import {test} from 'node:test';
import assert from 'node:assert/strict';
import {traits} from '../dist/model.mjs';
import {categoryInsight,selectedActions,planProgress} from '../dist/report.mjs';
test('each category recommendation follows its own score band',()=>{
 for(let i=0;i<5;i++)for(const [score,level] of [[0,0],[39,0],[40,1],[60,1],[61,2],[100,2]]){const scores=Array(5).fill(50);scores[i]=score;const item=categoryInsight(scores,i);assert.equal(item.step,traits[i].profiles[level].step);assert.equal(item.score,score);assert.equal(item.trait.name,traits[i].name)}
 assert.throws(()=>categoryInsight([50,50],0));assert.throws(()=>categoryInsight(Array(5).fill(50),5));
});
test('an action plan deduplicates categories and counts only selected completed activities',()=>{
 const r={scores:[10,50,90,40,60],categoryPlan:[0,2,2,4,-1,5,'1'],categoryDone:{0:true,2:false,3:true,4:true}};
 assert.deepEqual(selectedActions(r).map(a=>a.index),[0,2,4]);assert.equal(selectedActions(r)[1].step,traits[2].profiles[2].step);
 assert.deepEqual(planProgress(r),{total:3,done:2,percent:67});
});
test('empty and removed plans do not invent progress',()=>{
 assert.deepEqual(planProgress({scores:Array(5).fill(50)}),{total:0,done:0,percent:0});
 assert.deepEqual(planProgress({scores:Array(5).fill(50),categoryPlan:[],categoryDone:{1:true}}),{total:0,done:0,percent:0});
});
