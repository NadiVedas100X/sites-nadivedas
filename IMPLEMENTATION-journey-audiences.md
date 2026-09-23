# Journey and audience implementation

Completion requires live QA, not just a build.

- [x] Journey step order implemented; isolated 390px and 1440px browser journeys pass through validation → time → payment boundary → thumbprint → Nadi → confirmation
- [x] Unpaid preference does not reserve; verified-payment availability recheck tested
- [x] Preserve original Nadi interest separately from final Nadi selection in website/Pooja ingestion
- [ ] Meta custom-event export: BLOCKED by verified Religion/core-setup restriction; detailed custom events retained first-party, not disguised or exported
- [x] CRM current-state AND segments implemented, owner test number excluded
- [x] Interakt add-on purchase confirmed in UI; one nv_audience_stages list field published (old CRM ae47ddb, GitHub run 33987387347 succeeded). Fresh deliveries accepted without quota errors; paid segment visibly returned 8 opted-in contacts.
- [x] Eleven Interakt saved dynamic segments created and verified in menu, with WhatsApp opt-in filter enabled. Uses replacement list membership, not additive tags.
- [ ] Historical Interakt delivery pass completed; 208 country-code holds remain. Live production membership-transition QA remains pending (isolated transition tests pass).
- [ ] Meta saved audiences: not created; permission/restriction review needed
- [x] Email audiences remain in CRM; no campaigns sent
- [x] Reports audience builder live-tested: paid + leaf confirmed + FR unpaid returned 463 contacts
- [x] Automated tests: website 9, Pooja recovery 2, old CRM audiences 7, isolated cron 1 passed
- [ ] Full live end-to-end QA: no real payment/slot used; actual Meta/Interakt delivery not passed

Published: website v204 (b6c9233), Pooja v370 (df6b37c), old CRM via GitHub deployment.
Meta evidence: Events Manager dataset 424480907320631, nadivedas.com category Religion;
details show possible European-region blocking and core setup elsewhere.
Interakt browser workspace: NadiVedas, WhatsApp +91 99922 29463. The new
nv_audience_stages field and live paid audience are verified visible here.
Selection List UI allows 10 predefined options; configured campaign filter values:
payment_success, payment_failed, fr_unpaid, thumbprint_missing, nadi_undecided,
lf_not_done, lf_overdue, leaf_confirmed, fr_undecided, puja_unpaid.
Other raw predicate values remain in the API list; not exposed as selectable options.
Outstanding QA: mobile layout, concurrent paid-slot capacity handling, live outbound
delivery and dynamic list membership transitions. Existing cross-CRM capacity check
is not an atomic distributed reservation and is not claimed as such.

Segments: unpaid/failed payment; paid/no thumbprint; paid/no Nadi decision;
paid/LF not done; overdue LF not done; leaf confirmed/FR undecided or unpaid;
FR paid/puja unpaid. Unknown values must not be assumed false. Successful retries
override failed attempts for customer-stage targeting, without rewriting attempts.

No automatic campaign messages are authorized by this change. No real payments
or live slot reservations should be created for QA.

## Historical delivery repair — 6 September 2026 IST

- Dedicated AUDIENCE_SYNC_SECRET configured on Pages and the automation Worker;
  no existing general-purpose cron credential was rotated.
- Repair run 33989024220 completed successfully, processing all order customers, including May.
  Source audit: 2,470 distinct customers; 810 distinct customers have May orders.
- Live scheduled-worker diagnostic 33989277768: minute trigger returned HTTP 200
  and respected the active backfill lease (`busy: true`).
- Nine focused audience/cron tests pass. These are isolated tests, not a claim
  that production customer stages were deliberately changed during QA.
- Live Interakt "CRM - Paid, LF not done" increased to 1,125 contacts after sync.
  The run recorded 2,174 successful deliveries; the scheduled worker also ran
  concurrently under the delivery lease, so this is not a unique-contact total.
- Post-run diagnostic 33990067245: 211 queued, 208 country-code holds, 3 without
  errors; source grew to 2,472 customers while running. Minute worker returned
  HTTP 200 after backfill stopped. Subsequent edits continue to enqueue updates.
- The CRM segment has 1,244 matching contacts; Interakt includes its WhatsApp
  opt-in filter and requires valid international phone numbers. Exact per-contact
  reconciliation of the 119-contact segment difference remains outstanding.
  Contacts without verified country codes remain held; consent is not changed
  and no campaign is sent. Meta category review remains pending.

## Follow-up QA and reconciliation — 6 September 2026 IST

- Published old CRM e3339d0; Deploy Admin Vue App 33991307756 succeeded.
- Live Reports → Audience lists → Check audience phone counts verified:
  paid/LF-not-done = 1,246 CRM contacts, 1,136 unique valid international phones,
  105 requiring country/number verification, five duplicate phone records.
- Interakt still shows 1,125 LF-not-done contacts both with and without the
  WhatsApp opt-in filter. Thus the remaining 11-phone difference is NOT proven
  to be caused by opt-out and must not be described as reconciled.
- Global sync queue: 224 pending, 208 country-code holds at the latest check.
- Ten CRM audience/cron tests and nine website logic tests pass.
- Browser QA fixtures repaired (pricing response, local image binding bypass,
  payment state, accessible button labels and React transition waits). Both
  390px and 1440px pass the full isolated journey including artificial-image
  upload and Nadi selection. All API mutations intercepted; no real booking,
  payment, thumbprint or campaign was created. This is not live payment QA.
- Meta restriction rechecked in Events Manager: Religion / Pending review.
- Pooja CRM concurrent Guruji allocation now uses a single conditional SQL
  update (674a65d), with a passing unpaid/concurrent/replay isolation test and
  production build. Version 371 deployment succeeded
  (appgdep_6a9c82e2354081918c29fe6e3da25785); public CRM page returned HTTP 200.
  Shared cross-CRM capacity safety remains unresolved, not QA-passed.
