import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {comparisonMarkup, preferenceShowcaseMarkup, sampleTestimonialsMarkup} from '../dist/home-showcase.mjs';
import {discoveryHomeMarkup} from '../dist/start-experience.mjs';

test('comparison choices show two distinct five-dimension examples without country rankings', () => {
  for (const language of ['en', 'hi']) {
    const alternatives = ['social', 'planning', 'decisions'].map(key => comparisonMarkup(key, language));
    assert.equal(new Set(alternatives).size, 3);
    for (const markup of alternatives) {
      assert.equal((markup.match(/class="profile-bar-track"/g) || []).length, 10);
      assert.equal((markup.match(/ILLUSTRATIVE PROFILE|काल्पनिक profile/g) || []).length, 2);
    }
    assert.match(preferenceShowcaseMarkup(language), language === 'hi' ? /काल्पनिक profiles/ : /Fictional examples/);
    assert.equal(comparisonMarkup('invalid', language), comparisonMarkup('social', language));
  }
});

test('placeholder ratings and names are clearly separated from real customer feedback', () => {
  const markup = sampleTestimonialsMarkup();
  for (const name of ['Sanjay Gupta', 'Rituraj Ratan', 'Alex']) assert.ok(markup.includes(name));
  assert.match(markup, /not submitted customer reviews/);
  assert.doesNotMatch(markup, /Sample review · not submitted|भेजी हुई नहीं/);
  assert.match(markup, /assets\/sanjay-gupta.jpg/);
  assert.equal((markup.match(/★★★★★/g) || []).length, 3);
  assert.doesNotMatch(markup, /verified|aggregateRating|reviewCount/);
});

test('legacy HTML contains the earlier homepage content and coherent share metadata without invented review schema', () => {
  const html = readFileSync(new URL('../dist/personality.html', import.meta.url), 'utf8');
  const content = html.match(/<main\b[^>]*id="app"[^>]*>([\s\S]*?)<\/main>/)[1];
  assert.equal(content, discoveryHomeMarkup({}));
  assert.equal((content.match(/<h1>/g) || []).length, 1);
  assert.match(html, /rel="canonical" href="https:\/\/www\.riturajratan\.com\/innerly\/"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schema['@graph'].find(item => item['@type'] === 'WebApplication').isAccessibleForFree, true);
  assert.doesNotMatch(JSON.stringify(schema), /aggregateRating|reviewCount|95%|210M/);
  const image = new URL('../dist/assets/innerly-social-cover.png', import.meta.url);
  assert.ok(existsSync(image));
  const png = readFileSync(image);
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.match(readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8'), /https:\/\/www\.riturajratan\.com\/innerly\//);
});
