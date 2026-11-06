import {test} from 'node:test';
import assert from 'node:assert/strict';
import {avatarExpression, expressiveAvatarMarkup} from '../dist/expressive-avatars.mjs';

test('illustrated expressions react continuously within safe bounds and do not reverse a friendly smile', () => {
  for (let value = 0; value <= 100; value++) {
    const face = avatarExpression(value);
    assert.ok(Math.abs(face.tilt) <= 6);
    assert.ok(Math.abs(face.gaze) <= 3);
    assert.ok(face.smile >= .55 && face.smile <= 1);
    assert.ok(Object.values(face).every(Number.isFinite));
  }
  assert.deepEqual(avatarExpression(-100), avatarExpression(0));
  assert.deepEqual(avatarExpression(200), avatarExpression(100));
  assert.deepEqual(avatarExpression(NaN), avatarExpression(50));
  assert.notDeepEqual(avatarExpression(10), avatarExpression(90));
});
test('both demo characters remain illustrations without attributing emotion or personality to gender', () => {
  const male = expressiveAvatarMarkup(0, 50), female = expressiveAvatarMarkup(1, 50);
  assert.notEqual(male, female);
  for (const markup of [male, female]) {
    assert.match(markup, /aria-hidden="true"/);
    assert.doesNotMatch(markup, /happy|sad|angry|compatible|diagnos/);
  }
});
