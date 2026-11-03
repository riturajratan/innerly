import {test} from 'node:test';
import assert from 'node:assert/strict';
import {growthState} from '../dist/companion.mjs';
const a=count=>Array.from({length:45},(_,i)=>i<count?2:null);
test('the plant follows completed answers through fixed growth stages',()=>{for(const [count,stage] of [[0,0],[1,1],[14,1],[15,2],[29,2],[30,3],[39,3],[40,4],[44,4],[45,4]]){assert.equal(growthState(a(count)).stage,stage);assert.equal(growthState(a(count)).answered,count)}assert.equal(growthState(a(0)).stem,0);assert.equal(growthState(a(45)).stem,1)});
test('disagreement and agreement produce identical growth at the same completion count',()=>{const low=Array(45).fill(0),high=Array(45).fill(4);assert.deepEqual(growthState(low),growthState(high));assert.equal(growthState(new Array(45)).stage,0)});
