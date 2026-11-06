import {test} from 'node:test';
import assert from 'node:assert/strict';
import {relationshipExample, relationshipSectionMarkup} from '../dist/relationship-preview.mjs';

test('relationship examples stay hypothetical and offer distinct everyday prompts', () => {
  for (const language of ['en', 'hi']) {
    const examples = ['communication', 'planning', 'energy'].map(topic => relationshipExample(topic, undefined, undefined, language));
    assert.equal(new Set(examples.map(example => example.title)).size, 3);
    assert.equal(new Set(examples.map(example => example.insight)).size, 3);
    const section = relationshipSectionMarkup(language);
    assert.match(section, language === 'hi' ? /काल्पनिक पसंद/ : /Fictional preferences/);
    assert.match(section, /data-start-intent="relationships"/);
    assert.equal((section.match(/type="range"/g) || []).length, 2);
    assert.doesNotMatch(section, /match rate|\d+% compatible|soulmate/);
  }
});

test('changing the graph changes the prompt without ranking either person', () => {
  for (const topic of ['communication', 'planning', 'energy']) {
    const apart = relationshipExample(topic, 0, 100);
    const together = relationshipExample(topic, 50, 50);
    assert.notEqual(apart.insight, together.insight);
    assert.equal(apart.insight, relationshipExample(topic, 100, 0).insight);
    assert.deepEqual(relationshipExample(topic, -20, 180).values, [0, 100]);
    assert.deepEqual(relationshipExample(topic, NaN, undefined).values, relationshipExample(topic).values);
  }
  assert.equal(relationshipExample('unknown').key, 'communication');
});
