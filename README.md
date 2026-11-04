# Innerly

Live site: https://www.riturajratan.com/innerly/

A static, browser-local personality reflection experience. The assessment has 45 original questions, five dimensions, a short report, and a full report opened by a button. No payment is collected. The full report is free for now; a future $1 checkout would require a payment provider and server-side access control.

## Run locally

From this directory: `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist`.

## Check scoring

`node --test tests/model.test.mjs`

## Experience

Default body text is 20px, with a persistent 23px larger-text mode, large answer controls, keyboard-operable radios, and no time limit. Selecting an answer briefly highlights its soft choice color, then advances automatically after 350ms; Previous and Next arrow buttons allow browsing without selecting or changing an answer. Selecting an answer still advances automatically. Reports require all 45 answers; a reminder links back to the first unanswered question. Pending progression is cancelled when navigating away. The quiz shell, question heading, and five radio controls are kept mounted between questions. The prompt and answer space are measured off-screen per viewport, text size, and question format; question fade animations are disabled. Drafts, completed profiles, text size, and action checklists are kept in local storage. Previous short-assessment reports remain readable. No responses are sent to a backend.

The five 0–100 dimension scores describe preferences, not an overall personality grade. The questionnaire and interpretation thresholds are original and unvalidated. Do not present them as a diagnosis, validated psychometric measure, or basis for eligibility decisions.

The PDF button opens the browser print dialog. The summary card downloads an SVG and does not publish it.

## Interactive full report

The full report has a clickable profile map, five selectable preference graphs, category-specific explanations and suggestions, and a saved activity plan with a completion chart. Plan completion measures activities marked as tried; it does not claim personality improvement. Recommendations use each category's own interpretation band. Additional details are expandable. Print temporarily expands all categories so the PDF includes the entire report.

Report logic checks: `node --test tests/report.test.mjs`.

## Chart gallery

Full reports include Profile map, Bar, Pie, and Line tabs in one explorer, with the activity donut in the action plan below. Bars use independent category scores. Pie slices count the five categories in left/mixed/right interpretation bands; they are not percentages of a person. Line points come only from compatible saved assessments up to the viewed report, with at most eight points. A first assessment renders a single point, without an invented trend. Graph selection is linked to category suggestions, and printing expands all chart panels.

Chart checks: `node --test tests/charts.test.mjs`.

## GitHub Pages deployment

The Pages workflow runs the checks and deploys `dist/` after a push to `main`. It can also be run manually from the repository's Actions tab. Repository Settings → Pages uses GitHub Actions as the publishing source. The public site does not require ChatGPT sign-in.

## Quick assessment navigation

Use Last question to jump directly to question 45, or Questions to choose any saved question. Answered questions are marked in the picker. When all 45 answers are present, Go to results opens the report from any question. Filling the last unanswered question also finishes automatically, even when that question is in the middle of the assessment.

## Calm progress companion

A small seed-to-flower SVG companion appears above each question. Its growth depends only on completed questions, not which responses were chosen. The persistent illustration uses gentle breathing and sway while the question screen remains still. The motion toggle is saved locally, and reduced-motion device preferences disable animation and transitions. The companion adds no audio, timers, streaks, or answer grading.

## Reflection journey

The question companion now follows a curved five-chapter path: Start, Settle in, Explore, Reflect, and Discover. The traveler moves according to completed-answer count. Chapters unlock at 0, 11, 22, 33, and 45 completed answers; unlocked checkpoints revisit their question sections without changing answers. The final chapter opens completed results. Motion pause and reduced-motion preferences also cover the path and traveler.

## Discovery V2 and languages

The illustrated homepage leads to the existing original 45-question assessment. English and Hindi cover questions, all scenario choices, category interpretations, suggestions, chart controls, accessible labels, and summary exports. Language priority is a supported `?lang=en` or `?lang=hi` URL, a saved manual choice, browser language order, then English. Switching language preserves answer positions and scoring. Explicit user choice updates the shareable language URL. Hindi translations should receive a fluent-speaker editorial review before expanding the questionnaire or claiming validated measurement across languages.

Completion now shows a report preparation illustration with steps tied to actual scoring, graph preparation, and local saving. There is no simulated countdown. Continue opens an optional save screen; Skip immediately opens the useful free summary. Full report remains free, with a concise explanation of what is included.

The optional email form creates a `mailto:` draft containing the summary in the visitor's own email app. Visitors review and send it themselves. Innerly does not send messages, collect email addresses, promise delivery, or synchronize reports across devices. Automatic report email needs a backend and transactional email provider. Future $1 one-time payment and server-verified report access are not implemented.

Run all checks: `node --check dist/app.js` and `node --test tests/*.test.mjs`.

## Linked graph dashboard

Five category cards select a dimension across the map, bar, pie, and line views. Its score, interpretation, strength, and suggested activity update together; the explanation sits beside the active graph on desktop and below it on mobile. The map includes an expandable exact-score table. Chart tabs support arrow keys and Home/End. Category selection preserves focus in pie controls and the history selector. Switching English/Hindi retains the selected category and graph view.

With two or more compatible saved assessments, the line view shows first displayed score, latest displayed score, and signed point change. This compares only the displayed history window and does not call an increase an improvement. Reports sharing a timestamp keep the viewed assessment as the last point. No example scores or simulated history are used in actual reports.
