# Question-level comparison

The 14 November 2026 prototype uses mock comparison data at the owner's explicit request. The personal report itself comes from the visitor's submitted 36 answers. Only the reference histograms are synthetic.

## What the number means

Each question has five fictional response counts totaling 100. If the selected answer is “Often”, the mock cumulative percentage includes Never, Rarely, Sometimes and Often. It is an inclusive cumulative frequency, including ties. The histogram also shows the numbers below, equal to and above the selected answer.

The number is not a validated health score, global percentile, comparative mental stability, or an indication that the visitor is healthier than that percentage of people. High-frequency agreement can describe either a supportive pattern or a difficulty, depending on the statement. The guidance layer preserves that distinction separately.

The comparison tab is labeled “World comparison · mock”. Every result row says “mock cumulative”; the panel and question detail explicitly describe the fictional reference. The real report remains read-only. Saving continues to store only the existing report schema, without adding synthetic scores or comparison records.

## Replacing the prototype reference

A genuine comparison needs a reviewed data source using the same questionnaire version, exact items, response options, language and administration conditions, plus a clearly documented population, sampling method, sample size, collection dates and weighting where applicable. A convenience sample of site users must be called a site-user comparison, not “the world”. Any clinical interpretation also needs appropriate validation; another instrument's norms cannot simply be applied to these questions.

The reference-population principle is described in [HealthMeasures' reference-population guidance](https://healthmeasures.net/interpret-scores/reference-populations/). Innerly's original 36 questions are not PROMIS and do not inherit its scoring or norms.

There is currently no respondent collection backend or real population-reference dataset in this project. Do not silently turn this synthetic adapter into a collection or analytics mechanism.
