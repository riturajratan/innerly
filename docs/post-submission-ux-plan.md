# Innerly: post-submission experience

Implemented locally · 12 November 2026

## Outcome

Make completion feel acknowledged, give the reader something meaningful to explore immediately, then offer the complete six-category report and PDF for USD 1. Keep an explicit development bypass. Scope begins at final submission and covers preview, report access, full report and PDF.

Pricing assumption: preserve the existing USD 1 one-time purchase for one report. Use “Unlock full report — $1”, not “Subscribe”. A recurring subscription requires a separately defined billing interval, recurring benefit and cancellation experience.

## What the current implementation tells us

- `dist/innerly-v1-preview.mjs` already previews Self-Awareness and Relationships, shows four blurred decorative category graphics, and offers $1 access plus Skip for now.
- Preview graphics are static; answer lists expand through details. Direct mark selection is implemented in the full-report explorer, but not in these preview cards.
- The full report has six infographic styles with different reading directions. This adds learning effort before users can understand their answers.
- The assessment contains 36 questions, six in each category, with five frequency choices. Answers are not validated clinical scores. Positive and negative statements coexist.
- Current access is an in-memory preview state. The static application already contains the answers. Payment enforcement is a later backend milestone, described in `report-access-plan.md`.

## Proposed sequence

Submit → completion acknowledgement → two interactive category previews → softly blurred remaining report → unlock offer / development bypass → full report → PDF.

### 1. Completion and orientation

On successful validation of all 36 answers, transition directly into the report preview and focus its heading. Preserve the completed plant motif from the questionnaire as a small success illustration.

Headline: “You made time for yourself.”

Supporting copy: “All 36 answers are complete. Let's explore your reflection.”

Hindi: “आपने अपने लिए समय निकाला।” / “आपके सभी 36 जवाब पूरे हैं। अब अपनी report समझें।”

Show 36/36 answered, six areas and report date. Say “saved” only after a successful save; completion and persistence are separate states. A small, once-only 300–450 ms check/plant transition can acknowledge the submission; reduced-motion users get the final state immediately. Do not add a forced analysis countdown. If preparation later becomes asynchronous, show its real pending/error state and a retry action that keeps answers intact.

### 2. Preview that gives value before the offer

Two free categories: Understanding yourself and You & your relationships. Both cards show a complete graph, a short factual observation, and a visible “Explore my answers” affordance.

Use horizontal question-position plots as the primary chart language: six question rows, five labeled stops from Never to Almost always, and one selected marker per row. Keep the scale identical across categories. Each category has its own stable accent, while answer frequencies are conveyed by position and text.

Tapping/clicking a row, pressing Enter/Space, or selecting a labeled answer chip opens the exact question and response in the card. Display one relevant reflection prompt below it. Hover may supplement this but cannot be necessary. Prefer native buttons with generous row targets to tiny interactive SVG dots.

The default detail can show the first question, avoiding an empty instructional panel. Selected state persists while reading that category. Do not auto-cycle selections or rerender the whole page on every tap.

Observation examples must be derived literally from answers, such as “You chose ‘Often’ for 3 of these 6 statements.” Do not infer high self-awareness, resilience percentages, diagnoses, personality types or a best/worst area from response frequency.

### 3. Progressive preview and the access offer

Below the free cards, show the four remaining category titles and 2–3 visible chart silhouettes at the start of a softly blurred region. Use 5–7 px blur on graphic bodies only; retain crisp category names and unlock copy. Label these as report-format previews. Decorative data must not masquerade as computed hidden results.

Desktop: remaining categories in a two-column grid with one centered offer card. Mobile: a compact two-category teaser, then the offer in normal document flow; show remaining category names in the benefits list. Avoid a tall overlay that obscures the first free graphs or creates awkward reading order.

Offer title: “Keep your full reflection.”

Benefits:

- All six categories and all 36 responses.
- Tap-to-explore graphs and reflection prompts.
- A complete PDF to keep.

Primary action: “Unlock full report — $1”.

Price note: “One-time payment for this report. No subscription.”

Development state: “Payments are coming soon. Explore the full report free for now.”

Secondary action directly under the primary action: “Skip for now — view full report”. It must remain easy to discover, with a full 44–48 px touch target and normal contrast. No guilt-based dismissal copy or repeated modal.

During development the primary action opens a small, closable explanation of the forthcoming purchase, with a free-preview action. It must not simulate a charge or imply payment success. Skip directly opens all six categories and the existing print/save-PDF route, preserving the report and current language.

### 4. Full report after skip or a future verified purchase

Open the report at its heading with a clear status: “Full preview” in development or “Report unlocked” after verified purchase. A compact category navigator lets the reader jump to any of the six areas. Use the same card/graph interaction learned in the preview.

Information order:

1. Report date and completion summary.
2. Six category sections with response graphs, exact answers and optional reflection prompts.
3. “A small next step”: choose an existing reflection prompt connected to a selected question.
4. “Print / save PDF”, with “Save on this device” as a secondary action.
5. Method and privacy details, collapsed on screen and included appropriately in the PDF.

PDF: first page contains date and category overview; each following section includes legible graphs, question text and answers. No blur, unlock cards, clipped graphs or interactive-only content in the full-report print view. Name the current action “Print / save PDF” because it uses the browser dialog; use “Download PDF” only once a file is actually generated directly.

For repeat check-ins, keep actual history optional and secondary. A first-time user sees no invented trend line. Comparisons must retain the current questionnaire/version/language compatibility rules.

## Visual system

Retain the homepage's light background, navy typography, blue/lilac surfaces and warm yellow primary action. Increase chart contrast and reduce decorative card clutter.

Category accents (subject to contrast verification):

| Category | Accent |
| --- | --- |
| Self-awareness | Blue `#456FE8` |
| Thinking patterns | Violet `#8060C9` |
| Emotional responses | Teal `#168B89` |
| Decisions | Amber `#B87814` |
| Relationships | Rose `#B4558A` |
| Coping and growth | Deep teal `#3D7886` |

Yellow is the primary purchase/download action; category colors belong to graph marks and small identity accents. Text and explicit labels carry meaning alongside color. Never use red/green to imply unhealthy/healthy answers. Keep one primary action per section and generous whitespace around charts.

## Responsive and interaction requirements

- At 360–430 px: single-column free cards, in-flow unlock offer, no horizontal page scrolling. The first free graph should begin in the first screenful on a typical 390 × 844 device.
- At desktop widths: two free cards side by side, bounded readable line lengths, no stretched full-width paragraphs.
- Long Hindi labels wrap; all five response labels remain discoverable without hover. Questionnaire languages keep existing fallback disclosure for report translations.
- Keyboard selection, visible focus, screen-reader question/answer labels, reduced motion and 200% text zoom must work. Announce selected details politely without replaying the entire report.
- Refresh/back/sign-in must not silently lose completed answers; reuse the existing consent-aware local save/return behavior. Do not silently persist sensitive answers to create a smoother transition.

## Implementation order

1. Update the preview composition in `innerly-v1-preview.mjs` and its styles in `innerly-v1-report.css`.
2. Add accessible shared response-position plots and selection details in the graph layer; connect preview events in `mental-app.mjs`. Preserve legacy report behavior.
3. Refine the full-report hierarchy in `innerly-v1-views.mjs` and print styles. Reuse the current data model and existing reflection prompts.
4. Verify actual questionnaire submission → preview → offer → Skip → six-category report → print/save PDF, in English/Hindi and mobile/desktop.
5. Add payments only after server-created orders, verified webhooks and protected report/PDF retrieval exist. Remove the production bypass then; CSS blur alone cannot protect paid content.

## Acceptance checks

- Exactly 36 valid answers produce the preview; failed preparation retains answers and offers recovery.
- Preview contains two real category graphs. Row selection shows the corresponding exact question and response, including Never at the first position.
- Four remaining category names are visible; blurred bodies are decorative and noninteractive, with no hidden controls in the tab order.
- Price, one-time billing and the development bypass are clear together.
- Skip unlocks the same report, its six categories and print view without payment details.
- No fabricated scores, comparisons, “saved” claims or payment success states appear.
- Keyboard/mobile interactions and the printable full report remain usable.

An inline concept accompanies this plan using explicitly labeled illustrative responses. It demonstrates chart selection, the offer and free-preview reveal; it is not an implemented checkout or a user's real report.


## Implementation verification

The preview, consistent response-position graphs, category response-count bars, one-time $1 offer, development bypass and expanded print content are implemented. All 120 Node tests pass. Browser checks covered a real 36-answer submission, free preview question selection, offer dialog, Skip to the full six-category report, full-report keyboard selection, English/Hindi switching and a 390 px viewport with no horizontal overflow. Browser console checks reported no errors in the final sample view. Print markup includes all 36 exact questions, responses and reflection prompts; PDF pagination has not been visually verified.

Deployment uses the existing `riturajratan/innerly` main branch and GitHub Pages workflow. Release changes are prepared against the latest remote main in an isolated checkout.
