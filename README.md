# Innerly — V1 wellbeing reflection

**Deployment: GitHub Pages publishes `dist/` after checks on pushes to `main`.**

## Our core mission

Help people understand their current state of mind, identify thinking and behavioural patterns that may contribute to mental stress, and discover practical ways to improve their mental well-being, resilience and overall quality of life.

Product journey: understand your mind → notice thinking and behavioural patterns → explore practical next steps. This is the direction for the experience; it does not establish clinical validity or promise an outcome. Keep the homepage brief, with the complete mission available in English and Hindi under “Our core mission.”

## Current experience

The active check-in uses the 36 approved questions from `Innerly_V1_Questionnaire.xlsx` (Question Bank, A2:C37), preserving IDs Q01–Q36, exact English wording, order and six dimensions. The five active options are Never, Rarely, Sometimes, Often and Almost Always. Per the owner’s 10 November update, all 36 answers are required before a new report can be generated. The workbook’s original sixth option remains only in source data and earlier saved reports. Duration follows the workbook: 8–12 minutes.

All questions, five active response choices, dimension labels and the questionnaire notice are bundled in the existing 20 languages: en, hi, zh, es, fr, ar, bn, pt, ru, ur, id, de, ja, mr, te, tr, ta, vi, ko, it. Translation assets live in `dist/innerly-v1-locales/`. The workbook extraction is `dist/innerly-v1-source.json`; `dist/innerly-v1-questions.mjs` is its browser module, with parity checked in tests. Translations are editorial drafts requiring fluent-speaker review before validation claims. Texts are nested under `texts` so Indonesian code `id` cannot overwrite a question ID.

The continuous round-option layout, answer selection ring, automatic next-unanswered scrolling, review navigator, tree/completion percentage, larger text, reduced motion, and Save & take a break remain. The current question stays clear while other questions gently blur. Clicking or keyboard-focusing another question makes it clear immediately; automatic scrolling, review jumps and resume update the same focus state. Other questions remain interactive, reduced motion is respected, and printing removes the blur. There are no five-question page boundaries. Browser/manual/URL language selection and Arabic/Urdu RTL remain. Homepage and detailed reports remain English/Hindi, with a native-language coverage notice.

The homepage uses a blue, navy and lilac visual system with a centred welcome and original multi-generation editorial artwork. A dedicated relationship explorer leads into an independent three-view report preview, exact workbook question examples, a short journey and privacy/language FAQs. Five yellow start actions connect to the same check-in (four on mobile). All examples are labelled illustrative and do not collect responses. There are no ratings, outcome claims or population comparisons. English and Hindi layouts support mobile, larger text and reduced motion. The people are conceptual illustrations, not testimonials or real customers. See `design/innerly-everyday-v2-prompt.txt` for provenance.

All test-start actions share the label “Start My Test” in English (with localized equivalents) and a warm yellow background with dark text, including homepage sections, history and report restart. Saving and printing retain their existing styles.

## Report semantics

No scoring key, reverse-scoring rules or validation were supplied. **Reports describe responses without calculating clinical totals, disorder labels, severity bands or a percentage of mental health.** Six workbook dimensions contain six questions each. Five-color charts count the actual frequency selections; selecting a category opens its six responses and an optional reflection prompt. Skips are tracked separately, never as zero/Never. Earlier all-skipped reports retain an explicit no-responses state; new reports require every answer. Positive and negative wording are both present, so higher frequency is not interpreted as uniformly better or worse. Numeric values 0–4 are response indexes, not scored points.

The result begins with two actual dimension profiles (self-awareness and relationships) and four labelled, decorative blurred previews. Full-report access is planned as a **one-time USD 1 payment for that report**, with no subscription. Checkout is not connected: the page states payments are coming soon and offers **Skip for now — view full report**. Preview access is temporary in-memory UI state, not a paid entitlement. The static app is not a secure paywall; [the backend access plan](docs/report-access-plan.md) defines authenticated ownership checks, provider webhooks and server-only report/PDF delivery required before charging.

The full report opens with six original infographic cards: response tracks, frequency columns, emotion spokes, decision tiles, relationship bubbles and coping rings. Every graphic displays the original question responses, with a frequency-based observation and an Explore action. A back-to-overview action makes it easy to compare areas. The free preview uses the same style for its two open dimensions; locked illustrations remain decorative. The print summary includes all six cards. English/Hindi layouts adapt from three columns to two and one.

The full report includes an interactive six-area overview, every dimension’s six response positions, all 36 responses in a selectable map, optional question-specific reflection prompts, and a single-question timeline from up to eight actual same-language/version saved check-ins. Missing responses break the line, and a first report shows one point. Dimension/question selection persists between views. Printing includes all six dimensions and every exact question/response. These views retain the original answer frequencies without combining mixed positive/negative statements into a score.

## Versioned local data

- Questionnaire: `innerly-workbook-v1`.
- Draft: `innerly-workbook-v1-draft`.
- Completed reflection reports: `innerly-workbook-v1-reports`.
- Earlier 60- and 46-question draft keys remain untouched; their answers are never mapped onto new questions.
- Earlier 60-statement reports remain readable from `innerly-reflections-60-v1` with their original questions, agreement scale and descriptive method.
- Earlier saved PHQ-4 reports remain readable through My check-ins with their original method. They use the existing `innerly-mental-checkin-v1` key. Saving/deleting a report writes only its own version's namespace.
- Earlier personality reports remain accessible through `dist/personality.html`.

Previously skipped values in same-version drafts become unanswered when resumed; numeric answers are preserved. Earlier completed reports keep their original skips.

Answers are in page memory until the visitor explicitly saves in this browser. A saved draft then autosaves subsequent changes. Storage failure keeps in-memory answers and shows an error. Clerk is configured locally with Google and verified email-code login; a password is not required at signup. The production instance has verified DNS, issued SSL certificates and email-code login configured, with Google deferred. Its hosted email login screen opens correctly, and the Pages workflow injects the production publishable key from the repository Actions variable. Real production email delivery still needs an owner test. No cloud database, translation service, payments or response analytics are connected. Accounts do not sync or protect browser-saved reports. See [Clerk setup](docs/clerk-setup.md) for email/Google configuration and deployment.

The homepage’s example questions and report previews do not save responses or change questionnaire progress. Topic and report controls have independent state.

## Local development

```sh
node scripts/render-home.mjs
node scripts/render-mental-home.mjs
node --check dist/mental-app.mjs
node --check dist/checkin-flow.mjs
node --test tests/*.test.mjs
python3 -m http.server 4298 --bind 127.0.0.1 --directory dist
```

`render-home.mjs` now updates the legacy personality entry. `render-mental-home.mjs` updates the new public entry. The GitHub Pages workflow renders both entries, checks JavaScript syntax and runs the test suite before publishing `dist/`.

## Earlier personality implementation notes

The following notes describe the retained legacy experience, not the new mental-health homepage.

# Innerly

Live site: https://www.riturajratan.com/innerly/

A static, browser-local personality reflection experience. The active assessment now uses the **36 statements supplied by the user**, with light English grammar edits. The previous 45-question set is removed from the active questionnaire. Short summary and full report are free; no payment is collected.

## Run and verify

Run `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist` from this directory.

Checks: `node --check dist/app.js` and `node --test tests/*.test.mjs`.

GitHub Pages deploys `dist/` after checks on each push to `main`. There is no account or ChatGPT sign-in requirement.

## Question languages

All 36 statements and all five agreement choices are bundled in 20 languages: English, Hindi, Mandarin Chinese (Simplified), Spanish, French, Arabic, Bengali, Portuguese, Russian, Urdu, Indonesian, German, Japanese, Marathi, Telugu, Turkish, Tamil, Vietnamese, Korean, and Italian. This is a practical set of widely used languages, not a claimed statistical ranking of total or native speakers.

Question language follows a supported `?lang=` URL, saved manual preference, browser language order, primary device language as a fallback, then English. Regional codes match the corresponding supported language. A manual language change preserves all answer positions and scoring metadata. Arabic and Urdu use right-to-left layout. Main assessment controls, response choices, progress text and journey labels are localized; some secondary help/privacy copy remains English outside Hindi.

**Detailed reports remain English/Hindi.** Entering report views selects English unless Hindi is active, and the report language selector offers English/Hindi. Returning to the questionnaire restores the question language. No translation API, external translation request, or API key is needed. Translations are working editorial drafts and need fluent-speaker review before any claims of validated cross-cultural measurement.

## Exploratory scoring

Five independent scores summarize 33 of the supplied statements:

| Category | Items (one-based) | Reversed items | Count |
| --- | --- | --- | --- |
| Social style: reserved → outward | 1, 5, 9, 13, 17, 32, 33 | 9, 13, 32, 33 | 7 |
| Information style: details → ideas/patterns | 2, 6, 10, 18, 22, 25 | 2, 6, 18, 22, 25 | 6 |
| Planning style: improvisation → structure | 4, 8, 12, 14, 16, 20, 24, 29 | 12, 29 | 8 |
| Decision priorities: people/values → logic/efficiency | 3, 7, 11, 15, 19, 21, 23 | 11, 19, 21 | 7 |
| Decision pace: deliberation → quicker action | 26, 27, 28, 30, 31 | 26, 30, 31 | 5 |

The displayed response positions are 1–5, internally scored 0–4; reversed items use `4 - response`. Each category divides its sum by its own `count × 4` and rounds to 0–100. Scores below 40 lean left, 40–60 are mixed, and above 60 lean right. These are illustrative, unvalidated bands. The uneven item counts and polarity balance come from the supplied set; there is no claim of psychometric equivalence, MBTI/64-type matching, population rarity, diagnosis, or an overall quality grade.

Items 34–36 (calm self-description, noticing emotions, and neglecting one's own feelings) are displayed as **three separate selected responses** in the report. They are not combined into a score or added to unrelated dimensions. All 36 responses are required before a report is generated.

## Data compatibility

`personality-36-v1` identifies the new model. Previous `personality-45-v1` reports remain saved and open as clearly labeled read-only earlier reports, with their original category labels and interpretations. Old scores never enter new assessment history charts. Previous unfinished answers are archived locally and are not silently reinterpreted as the new questions. Earlier short-assessment records under `innerly-v1` remain viewable.

The local storage key stays `innerly-personality-v2`. Answers, unfinished progress, reports, text size, motion preference, question language, and action plans stay in this browser. No response collection backend exists.

## Interaction and reports

Default body type is 20px with persistent 23px larger-text mode. The assessment shows five questions per page (seven groups of five and a final question), each with a keyboard-operable five-point radio group and a filled selection ring. New answers guide to the next unanswered question in the visible group; completing a group opens the next automatically. Editing an existing answer stays in place. A compact top progress bar and optional Previous/Next controls after the questions support review; all 36 answers are needed for a report. A 36-question picker jumps directly to the relevant group. Mobile question headings reserve consistent space and guided scrolling aligns answer rows with the preceding tap position when there is enough room to keep the question readable. Short screens fall back to reading-first positioning. Motion pause and reduced-motion preferences are respected.

A five-chapter plant journey unlocks at 0, 9, 18, 27 and 36 completed answers. The journey stays visible while scrolling through questions in the assessment’s own sticky progress header. Growth depends on completion, not response values. Motion pause and reduced-motion settings are supported. On five-question pages, checkpoint labels collapse to accessible numbered stops while the current chapter remains visible.

Completion shows actual scoring, graph preparation and local-save steps, without a simulated countdown. An optional email form opens a user-reviewed `mailto:` summary draft in their own mail app; it does not send or collect addresses. Skip opens the report immediately.

The report explorer links five category cards to four purpose-led views: Your inner landscape, Your natural preferences, How your traits meet, and Your journey over time. These offer a whole-profile map, two-ended preference paths, an interactive two-dimension comparison, and dated personal snapshots. The journey uses actual compatible saved reports only, up to eight; one report renders one point. Differences are not labeled improvement. Action-plan completion tracks activities marked as tried, not personality improvement.

Graphs, tabs, exact-score table and category actions are keyboard accessible. Language changes retain the selected category and graph tab in report views. PDF uses browser print and temporarily expands all graph panels and details. Summary card downloads an SVG and does not publish it.

Automatic email delivery and future $1 one-time report access require a backend/provider integration and are not implemented.

After preparation, a report-ready preview introduces the actual profile and a softened graph preview, with prominent free full-report and PDF actions. Skip for now opens the summary. Unopened reports in history return to the preview; expanded reports open normally. Email remains an optional action within the report. No payment, subscription, rarity claim, or artificial type code is shown. PDF uses the browser print dialog and includes the full report.

Navigation refinement: the growing plant, chapter path, progress bar and answered count stay together in a sticky assessment header; Previous/Next are non-sticky optional page controls after the questions. Answering a previously unanswered item guides forward; editing an existing response stays in place. Completing all answers makes the footer Next action open results directly. The shared visual theme uses white surfaces, cool blue accents and restrained borders across assessment and report preview.

Agreement controls use a filled inner disc, a white gap and a colored outer ring when selected. Strong choices are slightly larger, while every mobile target remains at least 48px. A brief fill animation respects reduced-motion and the site motion pause. The current question has a subtle border emphasis; completed questions keep readable text and remain fully editable.

A newly completed five-question group advances automatically after 220ms, independently of the final answer’s position within the group. Ordinary touch/pointer/scroll or Tab events do not cancel that completed-group move; explicit page navigation and further answer edits do. Incomplete groups guide to another unanswered item in the same group before moving elsewhere. The final completed group still presents the results action.

Detailed report explorer: every dimension now includes a 0–100 preference ruler, score-specific everyday/relationship/pressure stories in English and Hindi, a supportive need, strength/watch-point details and a practical activity. A linked graph reading changes with the selected category and graph type. A personal overview highlights the greatest distance from 50 and the score closest to 50; neither is a quality ranking or confidence estimate. Users can save a “Feels like me / Depends / Not quite me” reflection without changing their scores.

New reports retain all 36 responses locally so a per-dimension response-count histogram can filter actual item-level answers and show the exact reverse-adjusted score calculation. Evidence is displayed only when the retained responses reproduce the report’s scores. Older reports remain usable and explain that answer-level detail is unavailable. Reflections, plans and response evidence survive reloads; nothing is sent to a server. Print includes all five categories’ situation stories and the selected category’s full answer list even when the on-screen list is filtered.

Purpose-led exploration replaces generic visualization labels: “Your inner landscape” keeps the whole-profile map; “Your natural preferences” uses five two-ended preference paths; “How your traits meet” lets the user compare any two distinct dimensions in a shared coordinate picture; “Your journey over time” uses only actual saved assessments with dated, selectable snapshots. Pairings show coexistence, not a correlation or prediction. The former aggregate grouping view is replaced by the two-dimension explorer. English/Hindi labels, keyboard navigation, linked category stories and print headings follow the new view names.

The homepage leads with clear benefits, a Start/Continue test action, four explicitly illustrative interactive report previews, five optional starting reasons, a relationship communication example and practical FAQs. A starting reason goes straight into the same 36-question assessment; an existing draft resumes without losing answers. The reason is saved with the draft and completed report, then prioritizes relevant dimensions and a report context without changing scoring. Relationship copy describes possible preference mismatches rather than diagnosing a relationship or a partner.

An earlier visual layer, retained beneath the final editorial styles, is `dist/joyful.css`: deep teal, warm golden actions, white surfaces and mint/lavender/coral benefit sections. Original code-native illustrations live in `dist/joyful-art.mjs`; the five decorative characters are not real users or personality-type claims. The homepage centers the main message and CTA, then separates the interactive example report into its own section. The shared palette also applies to questions, report previews and the report explorer. Example scores remain explicitly illustrative.

### Professional homepage direction

The homepage uses a restrained navy/sky-blue palette with one gold action colour. `professional.css` is the final presentation layer; `professional-art.mjs` contains the original geometric adult illustrations and benefit icons. Benefits explain self-awareness, relationships and work preferences; the report preview and social-energy examples are clearly illustrative. The feature strip reflects the actual 36 questions, 5 dimensions and estimated 6–9 minutes. Full reports remain English/Hindi. No invented ratings, accuracy rates, customer counts, country rankings or personality-type totals are published.

### Editorial homepage refinement

The latest homepage uses the original AI-generated editorial illustration in `dist/assets/innerly-editorial-people.webp`, a white/navy/sky-blue palette and a single gold primary action. It replaces the geometric character strip with a mature adult illustration. Clear benefit cards cover self-awareness, relationships and work preferences; an interactive report preview explains the actual product. The social-energy explorer now includes reserved, balanced and outgoing illustrative examples, with no population rankings or claims about the visitor before they answer.

Language selection is available only in the header dropdown, without repeated language promotions in the hero, feature strip, FAQ or results. The first visit follows the browser/device regional language settings; a supported URL or saved manual selection takes priority. No IP lookup or geolocation permission is used. Detailed report views offer English/Hindi in the same dropdown. Start and Continue preserve the existing assessment/resume flow. No global test counter, testimonials, numeric accuracy claim or fixed personality-type total is invented. The app stores responses locally and has no population analytics backend.

Artwork provenance and the exact generation prompt are recorded in `design/ARTWORK.md`. The production WebP is about 223 KB. Original source illustration remains in the image generator's output directory.

### Interactive relationship explorer

The homepage includes original conversation artwork and three editable, explicitly fictional examples: communication, planning and recharging. Two native range controls move the graph markers and change the conversation prompt. These are educational examples, not personal results or compatibility scores. The relationship CTA starts the existing assessment with relationship intent. Report charts draw in on view changes; hover and marker movement are subtle and respect reduced-motion preferences. The assessment plant journey, progress bar and answered count remain inside its own sticky header while scrolling; the site header and footer are not used for this progress UI.

### Homepage showcase and discovery

The hero highlights the actual 36 questions, five dimensions and estimated 6–9 minutes, with a large gold Start/Continue action. An illustrated final invitation repeats that action. The profile comparison shows two clearly illustrative profiles across all five dimensions; readers can switch social, planning and decision examples. No population rankings, test-volume totals or accuracy percentages are invented.

Two SVG adult characters on the left react to a conversation-tone slider: tension, a neutral pause, then a friendly exchange. Gaze, eyebrows, head tilt, eye openness and smile move smoothly. This is independent of the two preference sliders on the right, so differences in personality preferences are never treated as conflict or a compatibility score. These are fictional illustrations, not inferred moods or traits assigned to gender. Transitions follow reduced-motion settings. Testimonial cards use supplied names and sample copy, with a section-level disclosure that they are not submitted customer reviews. The supplied Sanjay Gupta avatar is stored locally; there is no review or aggregate-rating schema.

The homepage is pre-rendered with `node scripts/render-home.mjs` and refreshed by the Pages workflow before tests. Run this command whenever homepage markup changes. Search/share metadata includes a canonical URL, robots meta, title, description, keywords, Open Graph, Twitter card and a 1200×630 PNG. JSON-LD describes the website, webpage and web application without fabricated reviews. `dist/sitemap.xml` lists only the public homepage. The keywords tag is included as requested; Google does not use it for rankings. Domain-root robots.txt is managed by the parent portfolio, not this subpath project.

The hero keeps the four-adult editorial panorama. The bottom invitation uses its own garden-path illustration in `dist/assets/innerly-next-chapter.webp`, giving the two sections different scenes within the same restrained visual style.

### Visual homepage journey (November 2026)

The homepage uses a short story: recognise an everyday need → explore an example report → begin the 36-question reflection → choose a small action. `dist/story-home.mjs` owns the four life-area previews (work/business, relationships, home/family, emotional wellbeing), four report views and clickable score explanations. It preserves the existing questionnaire, scoring, saved answers and reports. `story-home.css` scopes the new visual system to the homepage, with large touch targets, A+ reading support, responsive layouts, keyboard controls, brief interaction-triggered motion, an explicit motion toggle and `prefers-reduced-motion` support. English and Hindi copy are authored; the existing question-language selector remains in the header. No demographic is assigned a personality.

The country explorer is separate from the individual assessment. It visualises **published life evaluation averages**, not country personality or Innerly customer statistics. Data: World Happiness Report 2026, Figure 2.1, based on the Gallup World Poll. [Official download and methodology](https://www.worldhappiness.report/data-sharing/). Latest observations are three-year averages for 2023–2025; earlier points show rolling averages by their final survey year, 2020–2025. The 147 countries/territories match the latest source table. Both confidence limits are retained, missing periods remain missing, and duplicate country selections are collapsed. The source table is available from every chart, including exact periods and 95% confidence intervals.

To refresh the bundled dataset, download the official [WHR26 workbook](https://files.worldhappiness.report/WHR26_Data_Figure_2.1.xlsx), then run `python3 scripts/extract-wellbeing.py /path/to/WHR26_Data_Figure_2.1.xlsx`. The extractor uses Python's standard library and writes `dist/data/world-wellbeing.mjs`. Source citation: Helliwell, J. F., Layard, R., Sachs, J. D., De Neve, J.-E., Aknin, L. B., & Wang, S. (Eds.). (2026). *World Happiness Report 2026*. University of Oxford: Wellbeing Research Centre.

Emotional-wellbeing copy offers reflection prompts; it explicitly does not screen for depression. The expandable support note links to the [WHO depression fact sheet](https://www.who.int/news-room/fact-sheets/detail/depression). Sample report scores and example journeys remain labelled as fictional/illustrative. The homepage does not display the older placeholder review component or invented accuracy, popularity or compatibility figures.

After markup changes, run `node scripts/render-home.mjs` to regenerate the public HTML, then `node --check dist/app.js` and `node --test tests/*.test.mjs`. Browser QA covers life-area switching, per-score insights, report views, country comparisons, Hindi, larger text, motion controls, and starting/resuming the existing test.
