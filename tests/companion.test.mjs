import {test} from 'node:test';
import assert from 'node:assert/strict';
import {growthState} from '../dist/companion.mjs';
const a=count=>Array.from({length:36},(_,i)=>i<count?2:null);
test('the plant follows completed answers through fixed growth stages',()=>{for(const [count,stage] of [[0,0],[1,1],[11,1],[12,2],[23,2],[24,3],[31,3],[32,4],[35,4],[36,4]]){assert.equal(growthState(a(count)).stage,stage);assert.equal(growthState(a(count)).answered,count)}assert.equal(growthState(a(0)).stem,0);assert.equal(growthState(a(36)).stem,1)});
test('disagreement and agreement produce identical growth at the same completion count',()=>{const low=Array(36).fill(0),high=Array(36).fill(4);assert.deepEqual(growthState(low),growthState(high));assert.equal(growthState(new Array(36)).stage,0)});
