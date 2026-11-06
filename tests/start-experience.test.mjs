import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validIntent,
  intentContext,
  intentDimensions,
  intentOptions,
  discoveryHomeMarkup,
  socialExampleMarkup,
} from "../dist/start-experience.mjs";
import { thumbScrollTarget } from "../dist/answer-position.mjs";
import { VERSION } from "../dist/model.mjs";
import { normalizeDatabase } from "../dist/storage.mjs";
test("starting reasons survive draft storage and select relevant report contexts", () => {
  const responses = Array.from({ length: 36 }, (_, i) => i % 5);
  assert.equal(validIntent("unknown"), "self");
  assert.equal(intentContext("relationships"), "relationships");
  assert.equal(intentContext("pressure"), "pressure");
  for (const { key } of intentOptions()) {
    assert.equal(new Set(intentDimensions(key)).size, 3);
    assert.ok(intentDimensions(key).every((i) => i >= 0 && i < 5));
    const draft = {
      version: VERSION,
      answers: responses,
      index: 4,
      intent: key,
    };
    const normalized = normalizeDatabase({ draft });
    assert.equal(normalized.draft.intent, key);
    assert.deepEqual(normalized.draft.answers, responses);
  }
});
test("thumb alignment returns the same viewport row while keeping a heading below the progress header", () => {
  const result = thumbScrollTarget({
    scrollY: 500,
    rowTop: 700,
    rowHeight: 60,
    headingTop: 400,
    headerHeight: 120,
    viewportHeight: 844,
    anchorY: 640,
  });
  assert.equal(result.top, 590);
  assert.equal(500 + 730 - result.top, 640);
  assert.ok(500 + 400 - result.top >= 144);
  const nextPage = thumbScrollTarget({
    scrollY: 1100,
    rowTop: -300,
    rowHeight: 60,
    headingTop: -630,
    headerHeight: 120,
    viewportHeight: 844,
    anchorY: 640,
  });
  assert.equal(1100 - 270 - nextPage.top, 640);
  assert.equal(nextPage.runway, 204);
});
test("short screens fall back to reading-first positioning and viewport edges never force hidden text", () => {
  assert.equal(
    thumbScrollTarget({
      scrollY: 0,
      rowTop: 500,
      rowHeight: 60,
      headingTop: 100,
      headerHeight: 150,
      viewportHeight: 568,
      anchorY: 450,
    }),
    null,
  );
  const result = thumbScrollTarget({
    scrollY: 100,
    rowTop: 400,
    rowHeight: 60,
    headingTop: 250,
    headerHeight: 140,
    viewportHeight: 844,
    anchorY: 200,
  });
  assert.ok(100 + 250 - result.top >= 164);
  assert.equal(
    thumbScrollTarget({
      scrollY: 0,
      rowTop: NaN,
      rowHeight: 60,
      headingTop: 0,
      headerHeight: 100,
      viewportHeight: 844,
      anchorY: 600,
    }),
    null,
  );
});

test("homepage states real questionnaire scope and offers start or resume without invented popularity", () => {
  const home = discoveryHomeMarkup({});
  assert.equal((home.match(/<h1>/g) || []).length, 1);
  assert.match(home, /data-action="start"/);
  assert.match(home, /minutes, at your own pace/);
  for (const language of ["en", "hi"]) {
    assert.doesNotMatch(
      discoveryHomeMarkup({ language }),
      /hero-language-summary|home-language-section|data-choose-language|question languages|भाषा|languages are supported|Detailed reports in English/,
    );
  }
  assert.equal((home.match(/data-social-example=/g) || []).length, 3);
  assert.match(home, /innerly-editorial-people.webp/);
  assert.doesNotMatch(home, /95%|210M|5-star|4\.9|Total tests taken/);
  const resumed = discoveryHomeMarkup({
    draft: { answers: [0, null, 4, null] },
  });
  assert.match(resumed, /2 of 36 answers saved/);
  assert.match(resumed, /data-action="resume"/);
  assert.doesNotMatch(resumed, /data-action="start"/);
});
test("social-energy examples include a balanced view and stay illustrative in English and Hindi", () => {
  for (const language of ["en", "hi"]) {
    const quiet = socialExampleMarkup("quiet", language),
      balanced = socialExampleMarkup("balanced", language),
      outgoing = socialExampleMarkup("outgoing", language);
    assert.match(balanced, /left:50%/);
    assert.notEqual(quiet, balanced);
    assert.notEqual(balanced, outgoing);
    assert.doesNotMatch(balanced, /compatibility|diagnos|population/);
  }
});
