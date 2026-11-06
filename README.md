# Innerly

Live site: https://www.riturajratan.com/innerly/

A static, browser-local personality reflection experience. The active assessment now uses the **36 statements supplied by the user**, with light English grammar edits. The previous 45-question set is removed from the active questionnaire. Short summary and full report are free; no payment is collected.

## Run and verify

Run `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist` from this directory.

Checks: `node --check dist/app.js` and `node --test tests/*.test.mjs`.

GitHub Pages deploys `dist/` after checks on each push to `main`. There is no account or ChatGPT sign-in requirement.

## Question languages

All 36 statements and all five agreement choices are bundled in 20 languages: English, Hindi, Mandarin Chinese (Simplified), Spanish, French, Arabic, Bengali, Portuguese, Russian, Urdu, Indonesian, German, Japanese, Marathi, Telugu, Turkish, Tamil, Vietnamese, Korean, and Italian. This is a practical set of widely used languages, not a claimed statistical ranking of total or native speakers.

Question language follows a supported `?lang=` URL, saved manual preference, browser language order, then English. Regional codes match the corresponding supported language. A manual language change preserves all answer positions and scoring metadata. Arabic and Urdu use right-to-left layout. Main assessment controls, response choices, progress text and journey labels are localized; some secondary help/privacy copy remains English outside Hindi.

**Detailed reports remain English/Hindi.** This scope is disclosed on the homepage in every question language and repeated above results. Entering report views selects English unless Hindi is active, and the report language selector offers English/Hindi. Returning to the questionnaire restores the question language. No translation API, external translation request, or API key is needed. Translations are working editorial drafts and need fluent-speaker review before any claims of validated cross-cultural measurement.

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

A five-chapter plant journey unlocks at 0, 9, 18, 27 and 36 completed answers. Growth depends on completion, not response values. Motion pause and reduced-motion settings are supported. On five-question pages, checkpoint labels collapse to accessible numbered stops while the current chapter remains visible.

Completion shows actual scoring, graph preparation and local-save steps, without a simulated countdown. An optional email form opens a user-reviewed `mailto:` summary draft in their own mail app; it does not send or collect addresses. Skip opens the report immediately.

The report explorer links five category cards to four purpose-led views: Your inner landscape, Your natural preferences, How your traits meet, and Your journey over time. These offer a whole-profile map, two-ended preference paths, an interactive two-dimension comparison, and dated personal snapshots. The journey uses actual compatible saved reports only, up to eight; one report renders one point. Differences are not labeled improvement. Action-plan completion tracks activities marked as tried, not personality improvement.

Graphs, tabs, exact-score table and category actions are keyboard accessible. Language changes retain the selected category and graph tab in report views. PDF uses browser print and temporarily expands all graph panels and details. Summary card downloads an SVG and does not publish it.

Automatic email delivery and future $1 one-time report access require a backend/provider integration and are not implemented.

After preparation, a report-ready preview introduces the actual profile and a softened graph preview, with prominent free full-report and PDF actions. Skip for now opens the summary. Unopened reports in history return to the preview; expanded reports open normally. Email remains an optional action within the report. No payment, subscription, rarity claim, or artificial type code is shown. PDF uses the browser print dialog and includes the full report.

Navigation refinement: progress stays in a compact top bar; Previous/Next are non-sticky optional page controls after the questions. Answering a previously unanswered item guides forward; editing an existing response stays in place. Completing all answers makes the footer Next action open results directly. The shared visual theme uses white surfaces, cool blue accents and restrained borders across assessment and report preview.

Agreement controls use a filled inner disc, a white gap and a colored outer ring when selected. Strong choices are slightly larger, while every mobile target remains at least 48px. A brief fill animation respects reduced-motion and the site motion pause. The current question has a subtle border emphasis; completed questions keep readable text and remain fully editable.

A newly completed five-question group advances automatically after 220ms, independently of the final answer’s position within the group. Ordinary touch/pointer/scroll or Tab events do not cancel that completed-group move; explicit page navigation and further answer edits do. Incomplete groups guide to another unanswered item in the same group before moving elsewhere. The final completed group still presents the results action.

Detailed report explorer: every dimension now includes a 0–100 preference ruler, score-specific everyday/relationship/pressure stories in English and Hindi, a supportive need, strength/watch-point details and a practical activity. A linked graph reading changes with the selected category and graph type. A personal overview highlights the greatest distance from 50 and the score closest to 50; neither is a quality ranking or confidence estimate. Users can save a “Feels like me / Depends / Not quite me” reflection without changing their scores.

New reports retain all 36 responses locally so a per-dimension response-count histogram can filter actual item-level answers and show the exact reverse-adjusted score calculation. Evidence is displayed only when the retained responses reproduce the report’s scores. Older reports remain usable and explain that answer-level detail is unavailable. Reflections, plans and response evidence survive reloads; nothing is sent to a server. Print includes all five categories’ situation stories and the selected category’s full answer list even when the on-screen list is filtered.

Purpose-led exploration replaces generic visualization labels: “Your inner landscape” keeps the whole-profile map; “Your natural preferences” uses five two-ended preference paths; “How your traits meet” lets the user compare any two distinct dimensions in a shared coordinate picture; “Your journey over time” uses only actual saved assessments with dated, selectable snapshots. Pairings show coexistence, not a correlation or prediction. The former aggregate grouping view is replaced by the two-dimension explorer. English/Hindi labels, keyboard navigation, linked category stories and print headings follow the new view names.

The homepage leads with clear benefits, a Start/Continue test action, four explicitly illustrative interactive report previews, five optional starting reasons, a relationship communication example and practical FAQs. A starting reason goes straight into the same 36-question assessment; an existing draft resumes without losing answers. The reason is saved with the draft and completed report, then prioritizes relevant dimensions and a report context without changing scoring. Relationship copy describes possible preference mismatches rather than diagnosing a relationship or a partner.
