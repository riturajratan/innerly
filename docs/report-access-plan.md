# Full report access

## Preview release

The initial result shows two actual response profiles: Self-Awareness and
Relationships. Four decorative blurred illustrations introduce the remaining
dimensions. Those illustrations are labelled as format previews and do not
contain hidden answers, scores or paid interpretations.

The planned price is **USD 1 once for one report**, as chosen by the owner on
10 November 2026. There is no recurring subscription. Checkout is not connected
and the page says payments are coming soon. The offer opens a free-preview
dialog; **Skip for now — view full report** opens the same full report.

Preview access is an in-memory Set of report IDs. It is not written to local
storage, sent to Clerk or treated as a paid entitlement. Reloading or opening a
saved report in a new page returns to its preview. The underlying static app
already has the answers and report-rendering code. This is a demonstration of
the purchase flow, not a secure paywall. Do not charge until the backend flow
below is implemented and verified.

## Production flow

1. Keep answering available to guests. Before storing answers on a server, obtain
   explicit consent for cloud storage and explain report retention/deletion.
2. Require a Clerk session for purchase and saved account access. The backend
   verifies Clerk session tokens and derives the user ID from that token.
3. `POST /assessments` validates question IDs, questionnaire version, language
   and all 36 responses. It creates a private assessment owned by the signed-in
   user and records the report/method version. Keep the questionnaire's current
   descriptive method; do not introduce a clinical score without a reviewed key.
4. `GET /assessments/:id/preview` checks ownership and returns only the two
   permitted dimension profiles and the report outline. It never returns hidden
   full-report data for CSS to blur.
5. `POST /assessments/:id/checkout` checks ownership and existing access. It
   creates a one-time provider order from a server-side price catalogue. The
   client cannot set the amount, currency, report ID ownership or paid status.
   A future INR price for India must be explicit; do not silently treat USD 1
   as INR 1. Provider accounts and supported methods still need setup.
6. The payment webhook verifies the provider signature, event/order IDs,
   captured/success status, expected amount, currency and linked assessment.
   Process duplicate events idempotently. Create the report entitlement in the
   same transaction as the verified payment update. A checkout success redirect
   alone must not grant access.
7. `GET /assessments/:id/report` and `GET /assessments/:id/download` both verify
   the authenticated owner and entitlement on every request. Render full data
   and the PDF on the server; return private, non-cacheable responses or short
   lived signed download links. Static public assets must contain no reports.
8. Preserve the current free preview for non-purchasers. Paid access remains
   available to its owner on later sign-in and other devices. Treat refunds,
   failed payments and duplicate purchases according to an explicit policy.

## Minimal records

- `assessments`: ID, owner ID, questionnaire version, question language,
  encrypted response payload, report/method version, created/deleted timestamps.
- `payments`: ID, owner ID, assessment ID, provider order/payment IDs, amount,
  currency, status and verification timestamps. Unique provider payment ID.
- `report_entitlements`: owner ID, assessment ID, verified payment ID, grant/
  revocation timestamps. Unique owner + assessment.
- `payment_events`: unique provider event ID, processing outcome and timestamp;
  retain only fields needed for reconciliation, not questionnaire answers.

Clerk stores identity only. Questionnaire answers must not be copied into
Clerk metadata, analytics, checkout descriptions or payment-provider metadata.
Use opaque assessment IDs for payment reconciliation.

## Release checks before payments

Verify unpaid and wrong-owner requests cannot retrieve a full report or PDF,
including guessed URLs and alternate download endpoints. Check modified client
prices, forged/duplicate webhooks, payment retries, capture delays, refunds and
expired sessions. Confirm an actual one-time payment grants only the purchased
report and a duplicate notification cannot double-charge or double-grant.
Remove the free bypass from production only after server enforcement works.

## Current dimension graphs

- Six overview distributions keep the workbook's exact grouping, six questions
  each, with actual frequency counts.
- Each dimension opens six response positions; selecting a question shows its
  exact wording, chosen response and an optional reflection prompt.
- A 36-answer map links every question to its detail without hiding low/zero
  frequency selections or treating earlier skips as Never.
- Over time compares one selected question across up to eight saved reports,
  with the same questionnaire version and question language, ending at the
  report being viewed. Missing values break the connecting line. The first
  report shows one actual point; it does not invent history.
- Full print/PDF output includes every original question and response under
  all six dimension headings. No diagnostic total, reverse-scoring, population
  ranking or treatment-effect claim is calculated.

Current history uses only reports saved in this browser. Backend history will
need the same filtering and ownership checks when account sync is implemented.
