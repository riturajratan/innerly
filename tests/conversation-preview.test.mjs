import {test} from 'node:test';
import assert from 'node:assert/strict';
import {conversationMoment, conversationSceneMarkup} from '../dist/conversation-preview.mjs';

test('the conversation demo moves from tension through a neutral pause to warmth', () => {
  for (const language of ['en', 'hi']) {
    const tense = conversationMoment(0, language), neutral = conversationMoment(50, language), warm = conversationMoment(100, language);
    assert.deepEqual([tense.phase, neutral.phase, warm.phase], ['tense', 'neutral', 'warm']);
    assert.ok(tense.smile < 0 && warm.smile > 0);
    assert.ok(Math.abs(neutral.smile) < .1);
    assert.ok(tense.brow > neutral.brow);
    assert.equal(neutral.brow, warm.brow);
    assert.equal(new Set([tense.title, neutral.title, warm.title]).size, 3);
    assert.doesNotMatch(conversationSceneMarkup(language), /\d+%|match score|compatibility score/);
  }
});
test('conversation animation handles invalid positions without losing both characters', () => {
  assert.deepEqual(conversationMoment(-100), conversationMoment(0));
  assert.deepEqual(conversationMoment(200), conversationMoment(100));
  assert.deepEqual(conversationMoment(NaN), conversationMoment(50));
  const markup = conversationSceneMarkup();
  assert.equal((markup.match(/data-avatar="/g) || []).length, 2);
  assert.match(markup, /id="conversation-tone"/);
  assert.match(markup, /Illustrated conversation: tension to understanding/);
});
