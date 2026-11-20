import {test} from 'node:test';
import assert from 'node:assert/strict';
import {currentProfile,profileReading,profileSignals,currentProfileMarkup} from '../dist/current-profile.mjs';
import {reportSnapshot,reportAreas,icon,escapeHTML} from '../dist/report-concept-view.mjs';
const supportive=reportSnapshot(Array(36).fill(0)).items.map(i=>i.category==='support'?0:4);
test('all 36 answers contribute exactly once across the cross-question signals',()=>{
 assert.deepEqual(profileSignals.flatMap(s=>s.questions).sort((a,b)=>a-b),Array.from({length:36},(_,i)=>i+1));
});
test('extreme and neutral profiles preserve polarity, evidence and input answers',()=>{
 for(const [answers,mode,category] of [[supportive,'supported','support'],[supportive.map(v=>4-v),'building','focus'],[Array(36).fill(2),'exploring','varies']]){
  const snapshot=reportSnapshot(answers),before=structuredClone(snapshot),profile=currentProfile(snapshot);
  assert.equal(profile.mode,mode);
  assert.ok(profile.evidence.every(i=>i.category===category));
  assert.equal(profile.priority.category,category);
  assert.deepEqual(snapshot,before);
  for(const l of ['en','hi']){const copy=profileReading(profile,l);assert.ok(copy.title&&copy.reading);if(l==='hi')assert.match(copy.reading,/[\u0900-\u097F]/);}
 }
});
test('identical totals but different answer combinations produce different combined profiles',()=>{
 const make=signal=>supportive.map((value,index)=>signal.questions.includes(index+1)?value:4-value);
 const a=reportSnapshot(make(profileSignals[0])),b=reportSnapshot(make(profileSignals[1]));
 assert.deepEqual(a.counts,b.counts);
 const pa=currentProfile(a),pb=currentProfile(b);
 assert.equal(pa.mode,'contrast');assert.equal(pb.mode,'contrast');
 assert.notEqual(pa.primary.key,pb.primary.key);
 assert.notEqual(profileReading(pa).title,profileReading(pb).title);
 assert.notEqual(profileReading(pa).reading,profileReading(pb).reading);
});
test('one answer changes the signal evidence without inventing a dominant style at a boundary',()=>{
 const answers=Array(36).fill(2),qs=profileSignals[0].questions;
 qs.slice(0,5).forEach(q=>answers[q-1]=supportive[q-1]);
 assert.equal(currentProfile(reportSnapshot(answers)).primary,null);
 answers[qs[5]-1]=supportive[qs[5]-1];
 assert.equal(currentProfile(reportSnapshot(answers)).primary.key,'reflective');
});
test('combined profile leads with synthesis rather than six category cards',()=>{
 const snapshot=reportSnapshot(supportive),html=currentProfileMarkup(snapshot,{areas:reportAreas('en'),icon,escapeHTML});
 assert.doesNotMatch(html,/cp-grid|cp-area-title/);
 assert.match(html,/cp-synthesis/);assert.match(html,/cp-next/);
});
