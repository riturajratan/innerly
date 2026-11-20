import {test} from 'node:test';
import assert from 'node:assert/strict';
import {currentProfile} from '../dist/current-profile.mjs';
import {reportSnapshot} from '../dist/report-concept-view.mjs';
const supportive=reportSnapshot(Array(36).fill(0)).items.map(i=>i.category==='support'?0:4);
test('current profile reflects each question direction and does not invent anchors',()=>{
 for(const [answers,mode,areaMode] of [[supportive,'supported','support'],[supportive.map(v=>4-v),'building','focus'],[Array(36).fill(2),'exploring','varies']]){
  const snapshot=reportSnapshot(answers),before=structuredClone(snapshot),profile=currentProfile(snapshot);
  assert.equal(profile.mode,mode);assert.equal(profile.areas.length,6);
  for(const area of profile.areas){assert.equal(area.mode,areaMode);assert.equal(area.counts[areaMode],6);assert.equal(area.evidence.category,areaMode);}
  assert.deepEqual(snapshot,before);
 }
});
test('changing answers updates area pattern without turning a mixed group into a trait',()=>{
 const answers=[...supportive];answers[0]=2;answers[1]=2;
 assert.equal(currentProfile(reportSnapshot(answers)).areas[0].mode,'support');
 answers[2]=2;
 const area=currentProfile(reportSnapshot(answers)).areas[0];assert.equal(area.mode,'mixed');assert.equal(area.counts.support,3);assert.equal(area.counts.varies,3);
});
