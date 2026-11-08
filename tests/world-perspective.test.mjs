import {test} from 'node:test';
import assert from 'node:assert/strict';
import {countryNames, countrySeries, latestEvaluation, trendSegments, worldCharts} from '../dist/world-perspective.mjs';
import {lifeAreas, lifeSceneMarkup, reportViewMarkup} from '../dist/story-home.mjs';

test('published country means retain uncertainty bounds and chronological, unique years',()=>{
 assert.equal(countryNames.length,147);
 for(const name of countryNames){
  const rows=countrySeries(name);
  assert.equal(new Set(rows.map(r=>r[0])).size,rows.length);
  assert.deepEqual(rows.map(r=>r[0]),rows.map(r=>r[0]).toSorted());
  for(const [year,mean,lo,hi] of rows){assert.ok(year>=2020&&year<=2025);assert.ok(lo>=0&&hi<=10&&lo<=mean&&mean<=hi);}
  assert.equal(latestEvaluation(name)[0],2025);
 }
 assert.deepEqual(latestEvaluation('India'),[2025,4.536,4.47,4.601]);
 assert.equal(latestEvaluation('Finland')[1],7.764);
 assert.deepEqual(countrySeries('toString'),[]);
 assert.equal(latestEvaluation('Unknown'),null);
});

test('missing survey periods are not interpolated or connected; duplicate country selections render once',()=>{
 const example=[[2020,4,3.9,4.1],[2021,4.1,4,4.2],[2023,4.3,4.2,4.4]];
 assert.deepEqual(trendSegments(example),[example.slice(0,2),example.slice(2)]);
 assert.equal((worldCharts('India','India').match(/class="world-country"/g)||[]).length,1);
 assert.match(worldCharts('Unknown','Unknown'),/No published data/);
 assert.match(worldCharts(),/2023–2025/);
 assert.match(worldCharts(),/not personality scores/);
 assert.match(worldCharts(),/worldhappiness.report\/data-sharing/);
 assert.doesNotMatch(worldCharts('Oman','India'),/NaN|undefined/);
});

test('life stories connect to real report intents and keep medical support distinct from personality',()=>{
 for(const language of ['en','hi']){
  const scenes=lifeAreas.map(a=>lifeSceneMarkup(a.key,language));
  assert.equal(new Set(scenes).size,4);
  for(const [i,scene] of scenes.entries()) assert.ok(scene.includes(`data-start-intent="${lifeAreas[i].intent}"`));
  const wellbeing=scenes[3];
  assert.match(wellbeing,/who.int\/news-room\/fact-sheets\/detail\/depression/);
  const views=['preferences','landscape','connections','journey'].map(v=>reportViewMarkup(v,language));
  assert.equal(new Set(views).size,4);
 }
 assert.match(lifeSceneMarkup('wellbeing'),/does not screen for depression/);
 assert.match(reportViewMarkup('journey'),/Fictional planning scores/);
});
