import {test} from 'node:test';
import assert from 'node:assert/strict';
import {journeyState} from '../dist/journey.mjs';
const answers=n=>Array.from({length:45},(_,i)=>i<n?0:null);
test('journey checkpoints unlock from completed answers, not question position',()=>{for(const [n,index] of [[0,0],[10,0],[11,1],[21,1],[22,2],[32,2],[33,3],[44,3],[45,4]]){const state=journeyState(answers(n));assert.equal(state.activeIndex,index);assert.equal(state.stops.filter(s=>s.available).length,index+1)}assert.equal(journeyState(answers(45)).stops[4].question,44)});
test('the traveler stays on the route and only reflects completion',()=>{let previous=0;for(let n=0;n<=45;n++){const state=journeyState(answers(n));assert.ok(state.x>=previous);assert.ok(state.x>=10&&state.x<=90);assert.ok(state.y>=47&&state.y<=63);previous=state.x}assert.equal(journeyState(answers(0)).progress,0);assert.equal(journeyState(answers(45)).progress,1);assert.deepEqual(journeyState(Array(45).fill(0)),journeyState(Array(45).fill(4)))});
