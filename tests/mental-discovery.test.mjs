import {test} from 'node:test';import assert from 'node:assert/strict';
import {topLifeEvaluations,rankedCountryRows,countryDetail,globalDiscovery} from '../dist/mental-discovery.mjs';
import {latestEvaluation} from '../dist/world-perspective.mjs';
import {growthState} from '../dist/checkin-flow.mjs';
test('completion percentage follows completed questions and never rounds unfinished work to 100%',()=>{
 for(const [count,percent] of [[0,0],[1,2],[5,13],[18,50],[35,97],[36,100]]){
 const values=Array.from({length:36},(_,i)=>i<count?0:null);assert.equal(growthState(values).percent,percent);
 if(count)values[0]=4;assert.equal(growthState(values).percent,percent);
 }
 const skipped=Array(36).fill(0);skipped[1]='skip';assert.equal(growthState(skipped).percent,97);skipped[35]='skip';assert.equal(growthState(skipped).percent,94);
});
test('discovery ranks the actual source means and leaves exact uncertainty accessible',()=>{
 assert.equal(topLifeEvaluations.length,10);assert.equal(topLifeEvaluations[0].name,'Finland');for(let i=0;i<10;i++){assert.deepEqual(topLifeEvaluations[i].row,latestEvaluation(topLifeEvaluations[i].name));if(i)assert.ok(topLifeEvaluations[i-1].row[1]>=topLifeEvaluations[i].row[1]);}
 assert.equal((rankedCountryRows().match(/data-country=/g)||[]).length,5);assert.equal((rankedCountryRows('Finland',true).match(/data-country=/g)||[]).length,10);assert.match(rankedCountryRows('Finland'),/data-country="Finland"/);assert.equal(rankedCountryRows('Finland'),rankedCountryRows('India'));
 assert.match(countryDetail('India'),/4\.536/);assert.match(countryDetail('India'),/4\.470–4\.601/);assert.match(countryDetail('India'),/2023–2025/);assert.doesNotMatch(countryDetail('Oman'),/NaN|undefined/);
 assert.match(countryDetail('Unknown'),/No published data/);assert.match(globalDiscovery(),/not mental-health or personality scores/);assert.match(globalDiscovery(),/worldhappiness.report\/data-sharing/);assert.match(globalDiscovery('hi'),/देश या क्षेत्र चुनें/);
});
