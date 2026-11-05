import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assessmentStatus} from '../dist/navigation.mjs';
test('complete answers include zero and allow results regardless of current position',()=>{assert.deepEqual(assessmentStatus(Array(36).fill(0)),{answered:36,remaining:0,complete:true,firstUnanswered:-1});assert.ok(assessmentStatus(Array.from({length:36},(_,i)=>i%5)).complete)});
test('a skipped answer keeps the results shortcut unavailable and identifies where to return',()=>{const answers=Array(36).fill(2);answers[3]=null;assert.deepEqual(assessmentStatus(answers),{answered:35,remaining:1,complete:false,firstUnanswered:3});answers[3]=4;assert.ok(assessmentStatus(answers).complete)});
test('sparse, invalid, and wrong-length drafts cannot count as complete',()=>{assert.equal(assessmentStatus(new Array(36)).answered,0);assert.equal(assessmentStatus(Array(36).fill(5)).complete,false);assert.equal(assessmentStatus(Array(35).fill(2)).complete,false);assert.equal(assessmentStatus(Array(37).fill(2)).complete,false)});
