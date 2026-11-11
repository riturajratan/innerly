import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dimensionGraphic,dimensionObservation,dimensionInfographicGrid} from '../dist/dimension-infographics.mjs';
import {workbookDimensions} from '../dist/innerly-v1-model.mjs';

test('each dimension renders its own accessible visual and preserves all six question IDs',()=>{
 const answers=Array.from({length:36},(_,i)=>i%5);
 const graphics=workbookDimensions.map(d=>dimensionGraphic(answers,d.id));
 assert.equal(new Set(graphics).size,6);
 for(const [index,graphic] of graphics.entries()){
  assert.match(graphic,/role="img" aria-label=/);
  for(const question of workbookDimensions[index].items)assert.ok(graphic.includes(`Q${String(question+1).padStart(2,'0')}`));
  assert.doesNotMatch(graphic,/undefined|NaN|Infinity/);
 }
});
test('a changed answer changes only its own dimension and Never differs from missing in every visual',()=>{
 const before=Array(36).fill(0),after=[...before];after[26]=4;
 for(const d of workbookDimensions){
  assert.equal(dimensionGraphic(before,d.id)===dimensionGraphic(after,d.id),d.id!=='dimension-5');
  const missing=Array(36).fill('skip');
  assert.notEqual(dimensionGraphic(before,d.id),dimensionGraphic(missing,d.id));
  assert.match(dimensionGraphic(missing,d.id),/Not answered/);
  assert.equal(dimensionObservation(missing,d.id),'No responses recorded in this area.');
 }
});
test('observations describe actual frequency counts, including ties, without inventing a score',()=>{
 const answers=Array(36).fill(2);
 assert.equal(dimensionObservation(answers,'dimension-1'),'“Sometimes” appears in 6 of 6 answers.');
 answers.splice(0,6,0,0,4,4,1,'skip');
 assert.equal(dimensionObservation(answers,'dimension-1'),'Your responses range from Never to Almost Always.');
 assert.match(dimensionObservation(answers,'dimension-1','hi'),/कभी नहीं.*लगभग हमेशा/);
 for(const l of ['en','hi']){
  const grid=dimensionInfographicGrid(answers,l);
  assert.equal((grid.match(/data-workbook-dimension=/g)||[]).length,6);
  assert.doesNotMatch(grid,/undefined|NaN|Infinity|mental-health score:|health:.*%/);
 }
 assert.doesNotMatch(dimensionInfographicGrid(answers,'en','dimension-1',false),/data-workbook-dimension=/);
});
