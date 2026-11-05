import {test} from 'node:test';
import assert from 'node:assert/strict';
import {journeyState} from '../dist/journey.mjs';
const answers=n=>Array.from({length:36},(_,i)=>i<n?0:null);
test('journey checkpoints unlock from completed answers, not question position',()=>{for(const [n,index] of [[0,0],[8,0],[9,1],[17,1],[18,2],[26,2],[27,3],[35,3],[36,4]]){const state=journeyState(answers(n));assert.equal(state.activeIndex,index);assert.equal(state.stops.filter(s=>s.available).length,index+1)}assert.equal(journeyState(answers(36)).stops[4].question,35)});
test('the traveler stays on the route and only reflects completion',()=>{let previous=0;for(let n=0;n<=36;n++){const state=journeyState(answers(n));assert.ok(state.x>=previous);assert.ok(state.x>=10&&state.x<=90);assert.ok(state.y>=47&&state.y<=63);previous=state.x}assert.equal(journeyState(answers(0)).progress,0);assert.equal(journeyState(answers(36)).progress,1);assert.deepEqual(journeyState(Array(36).fill(0)),journeyState(Array(36).fill(4)))});
