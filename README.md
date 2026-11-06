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

Default body type is 20px with persistent 23px larger-text mode. The assessment displays five questions per page (seven pages of five and a final page of one). Each question has its own keyboard-operable five-point radio group, visible scale endpoints, neutral midpoint, and full selected-response label. Choosing an answer saves it, then gently scrolls to the next unanswered question after 450ms without replacing the current group’s controls. Completing a group automatically opens the next unanswered group. Manual input or scrolling cancels a pending move; reduced-motion and motion-pause preferences use instant positioning. Red-to-amber-to-green circles replace numeric choices, with a visible check and full accessible response labels. A sticky bottom progress bar stays visible while answering. The last answer leaves the user at the results button for explicit confirmation. The Next button also advances to the next group; Previous restores the prior group with its answers. Manual page browsing can skip unanswered items, but a report still requires all 36 answers. A 36-question picker jumps to the relevant page and focuses the requested question. A compact progress companion and bottom Previous/Next controls keep navigation close. Drafts from the earlier single-question layout resume on the corresponding five-question page.

A five-chapter plant journey unlocks at 0, 9, 18, 27 and 36 completed answers. Growth depends on completion, not response values. Motion pause and reduced-motion settings are supported. On five-question pages, checkpoint labels collapse to accessible numbered stops while the current chapter remains visible.

Completion shows actual scoring, graph preparation and local-save steps, without a simulated countdown. An optional email form opens a user-reviewed `mailto:` summary draft in their own mail app; it does not send or collect addresses. Skip opens the report immediately.

The report explorer links five category cards to Profile map, Bar, Pie and Line tabs, explanations, strengths and small suggested activities. Pie slices count category bands, not parts of a person. Line points use actual compatible saved reports only, up to eight; one report renders one point. Comparison shows the first displayed score, latest displayed score and signed point change without calling an increase improvement. Action-plan donut tracks activities marked as tried, not personality improvement.

Graphs, tabs, exact-score table and category actions are keyboard accessible. Language changes retain the selected category and graph tab in report views. PDF uses browser print and temporarily expands all graph panels and details. Summary card downloads an SVG and does not publish it.

Automatic email delivery and future $1 one-time report access require a backend/provider integration and are not implemented.

After preparation, a report-ready preview introduces the actual profile and a softened graph preview, with prominent free full-report and PDF actions. Skip for now opens the summary. Unopened reports in history return to the preview; expanded reports open normally. Email remains an optional action within the report. No payment, subscription, rarity claim, or artificial type code is shown. PDF uses the browser print dialog and includes the full report.

Navigation refinement: progress stays in a compact top bar; Previous/Next are non-sticky optional page controls after the questions. Answering a previously unanswered item guides forward; editing an existing response stays in place. Completing all answers makes the footer Next action open results directly. The shared visual theme uses white surfaces, cool blue accents and restrained borders across assessment and report preview.

Agreement controls use a filled inner disc, a white gap and a colored outer ring when selected. Strong choices are slightly larger, while every mobile target remains at least 48px. A brief fill animation respects reduced-motion and the site motion pause. The current question has a subtle border emphasis; completed questions keep readable text and remain fully editable.
