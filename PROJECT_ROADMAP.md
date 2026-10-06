# Client-focused portfolio roadmap

Internal development planning — 2026-10-05. **35 planned concepts: 12 high priority, 13 advanced/differentiator, 10 medium priority.** This document is not public website content: keep it outside `public/`, routes, metadata, and application imports. No system is claimed as built or tested here. Existing illustrative demo records are not evidence that these planned integrations exist. A subsequent explicit user request approved 26 of the first 30 requested concepts for public, clearly labeled architecture browsing; four direct overlaps remain represented by existing illustrative records. Public concept visibility does not change their planned build status.

Lead with the business problem and solution; tools support the story. Build one system, test it, capture evidence, and only then consider publication. The eventual portfolio should demonstrate automation, CRM architecture, lead management, appointments, client operations, AI, Make/n8n, APIs/webhooks, websites/funnels, and reporting/attribution.

## Publication and evidence gates

- **PLANNED → IN PROGRESS:** internal by default. The explicitly approved public concept records are the exception: their pages must say CONCEPT and must not imply implementation, testing or delivery. Do not publish additional roadmap entries without authorization.
- **BUILT + TESTED:** eligible for an accurately labeled Demo Build once an end-to-end test, branch/error tests, and evidence exist. This is eligibility, not automatic publication.
- **REAL CLIENT PROJECT:** publish only supplied facts with permission and confidentiality review. Redact contact data, credentials, private endpoints, and sensitive operational details in captures.
- Never invent clients, testimonials, revenue, conversion rates, outcomes, or screenshots. Use controlled test records and clearly identify simulated inputs. Accelerated demonstration timing must be disclosed; test real timing separately.
- When no measured business result exists, use **WHAT I DELIVERED** or **WHAT THIS DEMO DEMONSTRATES**. Case-study angles below describe intended value, not achieved results.
- Each build checklist below is open. Before completion, also test duplicates/re-entry, missing or invalid inputs, unhappy paths, cancellation/stop conditions, and final CRM state where applicable. Use isolated test destinations; do not message real leads or charge real customers during demonstrations.
- When implementation begins, use `SECURITY.md` for inputs, APIs, integrations, secrets, dependencies, and deployment. For messaging, verify the actual consent/opt-out configuration and applicable sending requirements before enabling a live sequence.

### Assets for every completed build

Capture a clean cover, 2–5 supporting screenshots, workflow overview, relevant CRM/pipeline and form/calendar views, relevant integration execution, and desktop/mobile website views where applicable. Record a 1–3 minute video. Keep challenge, solution, actual tools, implementation notes, test evidence, verified outcome if available, and appropriate live/repository URLs together. Screenshot suggestions below are capture plans, not existing assets.

### Video standard

| Time | Evidence/story |
| --- | --- |
| 0:00 | What the system is |
| 0:10 | Business problem |
| 0:25 | Trigger |
| 0:40 | Workflow logic |
| 1:00 | CRM/pipeline/data |
| 1:20 | Integration, if relevant |
| 1:40 | Live test |
| 1:55 | Final state |

Adjust the timing to the system and stay approximately 1–3 minutes. **Trigger it → show execution → show the final state.** Do not substitute a tour of screenshots for evidence of a working system. Each entry's video plan supplies the specific test to demonstrate.

## HIGH PRIORITY — Phase 1: core client needs

Build order: 01 Speed-to-Lead → 02 Missed Call Text Back → 03 Appointment/No-Show Recovery → 04 Lead Nurture → 05 Database Reactivation → 06 Lead Routing → 07 Sales Pipeline → 08 Review Automation → 09 Client Intake → 10 Customer Onboarding → 11 Quote Request → 12 Website to CRM.

### 01. Speed-to-Lead Follow-Up System

- **Category:** Automation / Lead Management.
- **Business problem:** Paid leads can sit unanswered when manual responses are delayed.
- **Why clients need it:** Establish immediate acknowledgement, ownership, and a follow-up exit when a lead responds or books.
- **System flow:** Lead source → create/update contact → create opportunity → instant SMS → instant email → assign sales rep → wait → replied/booked? YES: stop nurture and move pipeline; NO: continue follow-up.
- **Tools:** GoHighLevel, forms, workflows, pipelines, SMS, email, calendars.
- **Build checklist:** [ ] Lead capture form; [ ] contact create/update; [ ] opportunity/pipeline; [ ] SMS/email; [ ] assignment; [ ] reply detection; [ ] booking detection; [ ] follow-up sequence; [ ] stop conditions; [ ] end-to-end test lead.
- **Screenshots to capture:** Form; workflow with exits; contact/conversation; assigned opportunity; stopped sequence after reply/booking.
- **Video walkthrough plan:** Submit a test lead, show acknowledgements and assignment, then demonstrate reply and booking exits with separate controlled runs.
- **Case study angle:** NEVER MISS A NEW LEAD — Never let a paid lead sit unanswered.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** HIGH — first recommended build.

### 02. Missed Call Text Back

- **Category:** Lead Recovery / Local Business.
- **Business problem:** Unanswered calls leave potential customers without a response.
- **Why clients need it:** Give callers a conversation path while staff are unavailable.
- **System flow:** Incoming call → missed call → instant SMS → customer reply → contact/opportunity → staff notification → follow-up.
- **Tools:** GoHighLevel, LC Phone, conversations, workflows, SMS, pipeline.
- **Build checklist:** [ ] Test number; [ ] missed-call trigger; [ ] response; [ ] reply detection; [ ] opportunity creation; [ ] staff alert; [ ] follow-up path; [ ] repeated-call suppression and stop test.
- **Screenshots to capture:** Call event; workflow; SMS/reply thread; resulting opportunity and notification.
- **Video walkthrough plan:** Call the test number, intentionally miss the call, reply to the SMS, and show CRM activity.
- **Case study angle:** TURN MISSED CALLS INTO CONVERSATIONS — Automatic missed-call recovery.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** HIGH — build second.

### 03. Appointment Reminder + No-Show Recovery

- **Category:** Appointment Automation.
- **Business problem:** Forgotten appointments and no-shows disrupt appointment businesses.
- **Why clients need it:** Keep bookings visible and offer a clear recovery path.
- **System flow:** Booking → confirmation → 24-hour reminder → 2-hour reminder → appointment status. SHOWED: thank you → review request; NO SHOW: recovery SMS → rebooking link → follow-up.
- **Tools:** GoHighLevel, calendar, SMS, email, workflows, pipeline.
- **Build checklist:** [ ] Calendar/time zone; [ ] confirmation; [ ] reminder schedules; [ ] showed/no-show branches; [ ] rebooking; [ ] cancellation/reschedule cleanup; [ ] duplicate reminder prevention; [ ] both branch tests.
- **Screenshots to capture:** Booking; scheduled reminders; status branches; recovery message; rebooked record.
- **Video walkthrough plan:** Book a test appointment, demonstrate reminder execution with disclosed test timing, then show no-show recovery and rebooking.
- **Case study angle:** REDUCE NO-SHOWS — Appointment Recovery System; do not claim a reduction without measurements.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** HIGH — build third.

### 04. Lead Nurture System

- **Category:** Lead Follow-Up.
- **Business problem:** Leads who are not ready immediately can disappear from manual follow-up.
- **Why clients need it:** Maintain a consistent sequence that stops when engagement requires a different response.
- **System flow:** New lead → SMS → email → wait → follow-up → engagement check → booking? YES: stop nurture; NO: continue sequence.
- **Tools:** GoHighLevel, SMS, email, workflows, calendars, tags.
- **Build checklist:** [ ] Entry criteria; [ ] message sequence; [ ] waits; [ ] engagement/booking detection; [ ] reply handoff; [ ] opt-out and completion exits; [ ] re-entry guards; [ ] timed branch tests.
- **Screenshots to capture:** Sequence timing; engagement conditions; booking exit; conversation and contact tags.
- **Video walkthrough plan:** Show timing/stop logic, trigger a test sequence, and demonstrate booking cancelling pending nurture.
- **Case study angle:** Stay in front of leads without manual follow-up.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** HIGH — build fourth.

### 05. Database Reactivation System

- **Category:** Lead Reactivation.
- **Business problem:** Existing contacts can remain unused without a structured re-engagement process.
- **Why clients need it:** Identify eligible contacts and route renewed interest into sales work.
- **System flow:** Old contacts → segment → reactivation campaign → reply detection → qualification → opportunity → sales pipeline.
- **Tools:** GoHighLevel, Smart Lists, tags, SMS, email, workflows, pipeline.
- **Build checklist:** [ ] Eligible test segment; [ ] exclusions/opt-outs; [ ] campaign; [ ] reply detection; [ ] qualification; [ ] opportunity deduplication; [ ] stop conditions; [ ] controlled segment test.
- **Screenshots to capture:** Segment filters; workflow; test reply; qualification; new opportunity.
- **Video walkthrough plan:** Select a small test-contact segment and show a reply becoming a qualified opportunity.
- **Case study angle:** WAKE UP OLD LEADS — Reuse existing contact relationships without inventing generated opportunities.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** HIGH — build fifth.

### 06. Lead Routing + Round Robin System

- **Category:** CRM / Sales Operations.
- **Business problem:** Unclear ownership and inconsistent distribution leave leads unattended.
- **Why clients need it:** Apply predictable assignment rules with escalation for untouched records.
- **System flow:** New lead → qualification → location/service/source check → assign representative → opportunity → SLA timer → notification → escalate if untouched.
- **Tools:** GoHighLevel, workflows, users, custom fields, pipeline, tasks, internal notifications.
- **Build checklist:** [ ] Routing fields/rules; [ ] representative pool; [ ] round-robin assignment; [ ] unavailable-user fallback; [ ] opportunity; [ ] SLA timer; [ ] notification/escalation; [ ] multi-lead distribution test.
- **Screenshots to capture:** Routing conditions; assignment configuration; differently owned opportunities; escalation task.
- **Video walkthrough plan:** Submit several test leads, show assignment outcomes, and demonstrate the untouched-lead escalation.
- **Case study angle:** Get every lead to the right salesperson automatically.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** HIGH — build sixth.

### 07. Automated Sales Pipeline

- **Category:** CRM Systems.
- **Business problem:** Sales stages and next actions can vary between team members.
- **Why clients need it:** Make each stage create appropriate work and preserve a clear final state.
- **System flow:** New lead → contacted → qualified → appointment → proposal → won/lost; stage changes may trigger tags, tasks, SMS, email, notifications, follow-up, and reporting.
- **Tools:** GoHighLevel, opportunities, pipelines, workflows, tasks, custom fields.
- **Build checklist:** [ ] Stage definitions; [ ] transition rules; [ ] stage actions; [ ] ownership; [ ] won/lost cleanup; [ ] backward-transition/re-entry guards; [ ] complete stage test.
- **Screenshots to capture:** Pipeline overview; stage-triggered workflow; assigned tasks; won/lost final records.
- **Video walkthrough plan:** Move a test opportunity through stages and show each configured action and terminal cleanup.
- **Case study angle:** Turn the CRM into an operating sales system.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** HIGH — build seventh.

### 08. Customer Review Automation

- **Category:** Reputation Management.
- **Business problem:** Completed services do not consistently lead to review requests.
- **Why clients need it:** Make requests and appropriate reminders a repeatable process.
- **System flow:** Service completed → wait → review request → reminder → feedback/review path → CRM update.
- **Tools:** GoHighLevel, reputation, SMS, email, workflows.
- **Build checklist:** [ ] Completion trigger; [ ] delay; [ ] request destination; [ ] reminder limit; [ ] feedback/status capture; [ ] duplicate/opt-out prevention; [ ] test delivery. Do not restrict review access by sentiment.
- **Screenshots to capture:** Trigger/wait; request message; destination; reminder/CRM state.
- **Video walkthrough plan:** Mark a test service complete and demonstrate request, follow-up, and recorded final state without posting a fake review.
- **Case study angle:** Create a repeatable review-generation process.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** HIGH — build eighth.

### 09. Client Intake System

- **Category:** Operations / CRM.
- **Business problem:** New-client information arrives in scattered, repetitive administrative exchanges.
- **Why clients need it:** Convert intake answers into structured records and assigned work.
- **System flow:** Application/purchase → intake form → custom fields → document collection → pipeline → internal notification → task assignment → confirmation.
- **Tools:** GoHighLevel, forms, custom fields, file uploads, workflows, pipeline, tasks.
- **Build checklist:** [ ] Intake fields/validation; [ ] field mapping; [ ] document handling/access; [ ] pipeline; [ ] notification; [ ] tasks/owner; [ ] confirmation; [ ] incomplete/duplicate submission tests.
- **Screenshots to capture:** Intake form; redacted document status; mapped client record; task/confirmation.
- **Video walkthrough plan:** Submit test intake information and show the resulting CRM record and internal process.
- **Case study angle:** Turn onboarding information into structured CRM data.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** HIGH — build ninth.

### 10. Customer Onboarding System

- **Category:** Operations.
- **Business problem:** Handoffs after purchase can be inconsistent or incomplete.
- **Why clients need it:** Give each new customer an owned path from payment to kickoff.
- **System flow:** Payment/contract → welcome email → intake → internal tasks → team assignment → kickoff calendar → onboarding pipeline → complete.
- **Tools:** GoHighLevel, payments, forms, calendars, tasks, pipeline, email, workflows.
- **Build checklist:** [ ] Verified test payment/contract trigger; [ ] welcome; [ ] intake; [ ] tasks/owner; [ ] kickoff scheduling; [ ] pipeline completion; [ ] failed/duplicate trigger handling; [ ] end-to-end test.
- **Screenshots to capture:** Test trigger; onboarding workflow; assigned tasks; kickoff booking; completed pipeline.
- **Video walkthrough plan:** Use a sandbox purchase or test contract, then show welcome, intake, ownership, and kickoff.
- **Case study angle:** FROM PAYMENT TO KICKOFF — Customer Onboarding System.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** HIGH — build tenth.

### 11. Quote / Estimate Request System

- **Category:** Local Business / Lead Generation.
- **Business problem:** Incomplete quote requests slow service estimates and responses.
- **Why clients need it:** Capture the service details staff need before creating sales work.
- **System flow:** Website → quote form → vehicle/property/service details → CRM → opportunity → internal alert → follow-up → appointment/estimate.
- **Tools:** GoHighLevel, forms/surveys, custom fields, pipeline, workflows, SMS, email.
- **Build checklist:** [ ] Service-specific fields; [ ] required/conditional validation; [ ] CRM mapping; [ ] opportunity; [ ] alert; [ ] follow-up; [ ] appointment/estimate path; [ ] complete/incomplete request tests.
- **Screenshots to capture:** Conditional form; field mapping; detailed opportunity; alert; estimate/booking state.
- **Video walkthrough plan:** Submit a complete test request and prove the same details reach the CRM and assigned owner.
- **Case study angle:** Turn website inquiries into organized sales opportunities.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** HIGH — build eleventh.

### 12. Website → CRM System

- **Category:** Funnels & Websites.
- **Business problem:** A standalone website form does not establish an operational lead journey.
- **Why clients need it:** Connect service selection and inquiry capture to ownership, booking, and follow-up.
- **System flow:** Landing page → service selection → request form → CRM contact → opportunity → calendar → confirmation → follow-up.
- **Tools:** GoHighLevel, website/funnel, forms, pipeline, calendar, workflows.
- **Build checklist:** [ ] Responsive page; [ ] service selection; [ ] validated form; [ ] contact/opportunity mapping; [ ] calendar; [ ] confirmation; [ ] follow-up exits; [ ] desktop/mobile end-to-end tests.
- **Screenshots to capture:** Desktop/mobile page; form; CRM contact/opportunity; booking and confirmation.
- **Video walkthrough plan:** Start on the website, submit a test lead, switch to CRM, and prove where it went through booking.
- **Case study angle:** FROM PAGE TO PIPELINE — The frontend connects directly to business operations.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** HIGH — build twelfth.

## ADVANCED / DIFFERENTIATOR — Phase 2

Build order after the core systems: 13 AI Appointment Setter → 14 AI Support Triage → 15 AI Lead Qualification → 16 GHL + Make → 17 GHL + n8n → 18 REST API/Webhook → 19 CRM/Sheets Sync → 20 Lead Attribution → 21 Reporting → 22 Multi-Location Routing → 23 SLA Escalation → 24 Failed Payment Recovery → 25 Document Collection.

Tools in this phase are candidates, not claims of configured capabilities. Confirm provider features, permissions, and test access when each build starts. Do not make autonomous AI decisions about refunds, account access, cancellation, or other sensitive actions without an explicitly defined human approval boundary.

### 13. AI Appointment Setter

- **Category:** AI / Appointment Automation.
- **Business problem:** Lead conversations and booking questions consume staff availability.
- **Why clients need it:** Handle bounded qualification and booking while retaining human handoff.
- **System flow:** Lead → AI conversation → qualification → question/objection handling → calendar → confirmation → human handoff.
- **Tools:** Candidates: GoHighLevel Conversational AI, calendars, workflows, CRM.
- **Build checklist:** [ ] Approved knowledge/criteria; [ ] conversation bounds; [ ] qualification; [ ] availability/booking checks; [ ] confirmation; [ ] human handoff; [ ] unsupported-question/adversarial tests.
- **Screenshots to capture:** Conversation; qualification fields; calendar booking; handoff record.
- **Video walkthrough plan:** Run a test conversation to booking, then show a separate out-of-scope question reaching a person.
- **Case study angle:** QUALIFY. BOOK. HAND OFF. — AI Appointment System.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** ADVANCED / DIFFERENTIATOR — Phase 2 first.

### 14. AI Customer Support Triage

- **Category:** AI / Support Operations.
- **Business problem:** Unsorted support requests delay ownership and prioritization.
- **Why clients need it:** Create structured work from messages while keeping uncertain decisions reviewable.
- **System flow:** Request → AI classification → sentiment → category → priority → department/person → notification → CRM/ticket record.
- **Tools:** Candidates: n8n, OpenAI, Gmail, Google Sheets, GoHighLevel.
- **Build checklist:** [ ] Billing/technical/access/refund/cancellation/product categories; [ ] validated output schema; [ ] priority rules; [ ] uncertainty fallback; [ ] routing/record; [ ] duplicate and adversarial input tests.
- **Screenshots to capture:** Test request; structured classification; routed ticket; review fallback.
- **Video walkthrough plan:** Submit contrasting synthetic requests and show routing plus human review for an uncertain request.
- **Case study angle:** Turn incoming support requests into structured, routed work.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** ADVANCED / DIFFERENTIATOR.

### 15. AI Lead Qualification System

- **Category:** AI / Lead Management.
- **Business problem:** Sales teams lack consistent triage of incoming leads.
- **Why clients need it:** Surface relevant leads using explicit, reviewable criteria.
- **System flow:** Lead → form/conversation → qualification criteria → AI evaluation → lead score → qualified/unqualified branch → CRM/sales team.
- **Tools:** Candidates: GoHighLevel, forms, n8n or Make, OpenAI, workflows.
- **Build checklist:** [ ] Approved business criteria; [ ] schema/score bounds; [ ] explanation fields; [ ] branches; [ ] uncertain/manual review path; [ ] missing-data and consistency tests.
- **Screenshots to capture:** Criteria; test input; validated evaluation; CRM branch and explanation.
- **Video walkthrough plan:** Compare controlled qualified, unqualified, and incomplete leads without claiming predictive accuracy.
- **Case study angle:** Prioritize human sales attention with explainable qualification.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** ADVANCED / DIFFERENTIATOR.

### 16. GHL + Make Integration

- **Category:** Integrations / APIs.
- **Business problem:** Native CRM actions do not cover every external operational handoff.
- **Why clients need it:** Move validated data to an external service and confirm the result in CRM.
- **System flow:** GHL trigger → webhook → Make → validate → transform → external service → response → update GHL.
- **Tools:** Candidates: GoHighLevel, Make, authenticated webhook/API, one approved test service.
- **Build checklist:** [ ] Trigger; [ ] authentication; [ ] validation/mapping; [ ] destination call; [ ] response checks; [ ] retries/idempotency; [ ] CRM success/failure states; [ ] execution tests.
- **Screenshots to capture:** Redacted scenario; payload mapping; test execution; external result; CRM confirmation.
- **Video walkthrough plan:** Trigger a record change and trace the same test record through Make to destination and CRM.
- **Case study angle:** Connect CRM events to external business systems with verified handoffs.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** ADVANCED / DIFFERENTIATOR.

### 17. GHL + n8n Integration

- **Category:** Integrations / Workflow Architecture.
- **Business problem:** Some business logic requires processing outside native CRM workflows.
- **Why clients need it:** Support custom validation and API orchestration with visible recovery paths.
- **System flow:** GHL → webhook → n8n → code/validation → API/AI → external app → result → GHL.
- **Tools:** Candidates: GoHighLevel, n8n, authenticated API; AI only if the selected problem needs it.
- **Build checklist:** [ ] Defined external task; [ ] webhook trust boundary; [ ] schema/code; [ ] credentials; [ ] response checks; [ ] retries/error branch; [ ] CRM return; [ ] replay/failure tests.
- **Screenshots to capture:** Redacted graph; validation; success/error executions; CRM return state.
- **Video walkthrough plan:** Run an actual test handoff and demonstrate a failed request reaching the controlled recovery branch.
- **Case study angle:** CONNECT THE STACK — Automation beyond native CRM actions.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** ADVANCED / DIFFERENTIATOR.

### 18. REST API + Webhook System

- **Category:** APIs / Integrations.
- **Business problem:** Unvalidated or unconfirmed data exchanges can corrupt operational records.
- **Why clients need it:** Establish authenticated, observable exchanges with deliberate failure behavior.
- **System flow:** Trigger → webhook → authentication → JSON validation → API request → error handling → response → CRM update.
- **Tools:** Candidates: authenticated webhook receiver, REST service, GoHighLevel, Make or n8n.
- **Build checklist:** [ ] Authentication/replay controls; [ ] schema; [ ] fixed destination; [ ] timeouts; [ ] bounded retries/idempotency; [ ] safe logs; [ ] response mapping; [ ] invalid/auth/failure tests.
- **Screenshots to capture:** Redacted request/response; validation rejection; error path; CRM result.
- **Video walkthrough plan:** Show a successful exchange and rejected invalid/unauthenticated test inputs, with secrets hidden.
- **Case study angle:** Reliable authenticated API handoffs with explicit error handling.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** ADVANCED / DIFFERENTIATOR.

### 19. CRM ↔ Google Sheets Sync

- **Category:** Data Integration / Operations.
- **Business problem:** CRM and spreadsheet records can diverge or duplicate.
- **Why clients need it:** Maintain consistent mapped records across operational tools.
- **System flow:** CRM record → webhook/automation → Sheets → mapping → deduplication → update/append → confirmation. Add the reverse path only after conflict rules are defined and tested.
- **Tools:** Candidates: GoHighLevel, Google Sheets, Make or n8n, webhooks.
- **Build checklist:** [ ] Stable record key; [ ] mappings; [ ] upsert; [ ] source-of-truth/conflict rules; [ ] loop prevention; [ ] reverse path; [ ] duplicate/concurrent/error tests.
- **Screenshots to capture:** Field map; matched CRM/row; upsert execution; reverse update and conflict outcome.
- **Video walkthrough plan:** Update a test record in each direction and show that retries do not create duplicates or loops.
- **Case study angle:** Synchronize operational data across systems.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** ADVANCED / DIFFERENTIATOR.

### 20. Lead Source Attribution System

- **Category:** Reporting / Attribution.
- **Business problem:** Lead records can lose the source context needed for marketing decisions.
- **Why clients need it:** Preserve traceable source data from visit to opportunity.
- **System flow:** Traffic source → UTM parameters → form → contact custom fields → opportunity → revenue/pipeline source → reporting.
- **Tools:** Candidates: GoHighLevel, website/forms, custom fields, workflows, reporting.
- **Build checklist:** [ ] Parameter allowlist/lengths; [ ] first/last-touch rules; [ ] form mapping; [ ] opportunity linkage; [ ] unknown-source fallback; [ ] report definitions; [ ] controlled-source tests.
- **Screenshots to capture:** Test tagged URL; captured fields; linked opportunity; explicitly labeled test-source report.
- **Video walkthrough plan:** Submit two differently tagged test leads and trace their source fields into the pipeline/report.
- **Case study angle:** Trace which channels produced recorded leads; disclose attribution limits.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** ADVANCED / DIFFERENTIATOR.

### 21. Marketing Reporting System

- **Category:** Reporting / Business Operations.
- **Business problem:** Disconnected CRM and campaign data complicate routine reporting.
- **Why clients need it:** Produce understandable summaries from defined, reconciled records.
- **System flow:** GHL/ads/CRM → collect data → Sheets/dashboard → defined KPIs → weekly summary.
- **Tools:** Candidates: GoHighLevel, approved ads connector, Make or n8n, Sheets/dashboard.
- **Build checklist:** [ ] Data permissions; [ ] metric definitions; [ ] lead/appointment/pipeline/win/source mapping; [ ] time zones; [ ] reconciliation; [ ] missing-data handling; [ ] scheduled summary; [ ] test dataset verification.
- **Screenshots to capture:** Definitions; source records; labeled test dashboard; reconciled weekly summary.
- **Video walkthrough plan:** Trace a controlled dataset through aggregation and reconcile displayed values to its source records.
- **Case study angle:** Turn CRM data into useful business reporting; never invent performance metrics.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** ADVANCED / DIFFERENTIATOR.

### 22. Multi-Location Lead Routing

- **Category:** CRM / Multi-Location Operations.
- **Business problem:** Leads can reach the wrong branch or service team.
- **Why clients need it:** Apply service-area ownership before booking and follow-up.
- **System flow:** Lead → ZIP/location → service area → location/team → pipeline → calendar → follow-up.
- **Tools:** Candidates: GoHighLevel, forms, location fields, workflows, pipelines, calendars.
- **Build checklist:** [ ] Supplied service-area rules; [ ] location validation; [ ] team/pipeline/calendar mapping; [ ] overlap/out-of-area fallback; [ ] notifications; [ ] boundary-location tests.
- **Screenshots to capture:** Area rules; location conditions; differently routed test leads; fallback case.
- **Video walkthrough plan:** Submit test locations for two branches and an unsupported area, showing each final destination.
- **Case study angle:** Route leads automatically across multiple business locations.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** ADVANCED / DIFFERENTIATOR.

### 23. SLA / Escalation System

- **Category:** Operations / Service Accountability.
- **Business problem:** Assigned leads or requests can remain untouched without follow-through.
- **Why clients need it:** Make overdue work visible to an accountable owner and manager.
- **System flow:** Lead/request → assign user → timer → team responded? YES: continue; NO: reminder → task → manager notification → escalation.
- **Tools:** Candidates: GoHighLevel, workflows, tasks, users, internal notifications.
- **Build checklist:** [ ] Response definition; [ ] business hours/time zone; [ ] deadline; [ ] response exit; [ ] escalation levels; [ ] reassignment behavior; [ ] on-time/overdue tests.
- **Screenshots to capture:** Timer/exit; assignment; overdue task; escalation notification.
- **Video walkthrough plan:** Compare responded and untouched test requests using clearly disclosed accelerated timing.
- **Case study angle:** Prevent leads and requests from being ignored.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** ADVANCED / DIFFERENTIATOR.

### 24. Failed Payment Recovery

- **Category:** Payments / Customer Operations.
- **Business problem:** Failed payments leave staff chasing unresolved accounts manually.
- **Why clients need it:** Offer a controlled recovery path and stop reminders after resolution.
- **System flow:** Payment failed → email → SMS → retry link → wait → recovered? YES: restore/continue; NO: task → escalation/cancellation process.
- **Tools:** Candidates: GoHighLevel, sandbox payment provider, workflows, SMS/email, tasks.
- **Build checklist:** [ ] Verified failure event; [ ] safe provider link; [ ] recovery messages; [ ] recovered exit; [ ] retry limits; [ ] human cancellation approval; [ ] duplicate/out-of-order sandbox tests.
- **Screenshots to capture:** Sandbox failure; recovery sequence; redacted provider state; success/exception outcome.
- **Video walkthrough plan:** Trigger sandbox failure, complete recovery, and prove queued reminders stop; demonstrate unresolved escalation separately.
- **Case study angle:** Automate payment recovery steps without claiming recovered revenue.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** ADVANCED / DIFFERENTIATOR.

### 25. Document Collection Workflow

- **Category:** Operations / Document Management.
- **Business problem:** Repeated requests and missing files slow document-heavy client work.
- **Why clients need it:** Track required items and route submissions for review; potential contexts include tax, insurance, legal, finance, and consulting.
- **System flow:** Client → document request → reminder → upload → CRM status → internal notification → review.
- **Tools:** Candidates: GoHighLevel, forms/uploads, workflows, controlled-access storage, tasks.
- **Build checklist:** [ ] Required-document list; [ ] access/file limits; [ ] upload validation; [ ] missing-item reminders; [ ] status mapping; [ ] review owner; [ ] rejection/resubmission; [ ] synthetic-file tests.
- **Screenshots to capture:** Request/checklist; synthetic upload; missing/completed statuses; reviewer task.
- **Video walkthrough plan:** Upload harmless synthetic files, show reminders stop for received items, and demonstrate review/resubmission.
- **Case study angle:** Automate document-heavy client processes with clear review ownership.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** ADVANCED / DIFFERENTIATOR.

## MEDIUM PRIORITY — optional additional builds

These supplement the two core phases. Select them when a concrete business problem warrants a separate build; do not expand scope just to add portfolio cards.

### 26. Referral Automation

- **Category:** Customer Growth / CRM.
- **Business problem:** Referral introductions are inconsistently captured and followed up.
- **Why clients need it:** Record a referral's origin and assign the introduction.
- **System flow:** Eligible customer → referral request → referral form → source linkage → opportunity → owner notification → follow-up.
- **Tools:** Candidates: GoHighLevel, forms, custom fields, workflows, pipeline.
- **Build checklist:** [ ] Eligibility; [ ] form; [ ] referrer mapping; [ ] duplicate handling; [ ] ownership; [ ] consent-safe contact path; [ ] test referral.
- **Screenshots to capture:** Request/form; linked referral record; assigned opportunity.
- **Video walkthrough plan:** Submit a test referral and prove its source and assigned follow-up.
- **Case study angle:** Turn referrals into tracked sales work.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** MEDIUM.

### 27. Membership / Course Access Automation

- **Category:** Customer Access / Operations.
- **Business problem:** Manual entitlement changes delay access or leave stale permissions.
- **Why clients need it:** Match access to verified purchase and lifecycle state.
- **System flow:** Verified purchase → entitlement → access grant → welcome → cancellation/expiry → access review/revoke.
- **Tools:** Candidates: GoHighLevel memberships/courses, sandbox payments, workflows, email.
- **Build checklist:** [ ] Product mapping; [ ] verified events; [ ] grant; [ ] welcome; [ ] cancellation/expiry; [ ] replay guards; [ ] test-account access checks.
- **Screenshots to capture:** Entitlement rule; test purchase; granted/revoked test access.
- **Video walkthrough plan:** Show sandbox purchase unlocking the test account and expiry removing the entitlement.
- **Case study angle:** Keep customer access aligned with purchase status.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** MEDIUM.

### 28. Abandoned Form Recovery

- **Category:** Lead Recovery / Funnels.
- **Business problem:** Partially completed inquiries never reach staff.
- **Why clients need it:** Offer an appropriate return path where a usable, consented contact exists.
- **System flow:** Permitted partial capture → inactivity → completion check → eligible reminder → return → submission → stop recovery.
- **Tools:** Candidates: website/form platform with supported partial capture, GoHighLevel, workflows.
- **Build checklist:** [ ] Confirm partial-capture support; [ ] consent/contact gate; [ ] inactivity; [ ] completion detection; [ ] safe return link; [ ] reminder cap; [ ] abandonment/completion tests.
- **Screenshots to capture:** Capture gate; inactivity/exit logic; test reminder; final submission.
- **Video walkthrough plan:** Abandon a consented test form, show a reminder, then complete it and prove recovery stops.
- **Case study angle:** Help eligible inquiries resume unfinished forms.
- **Status:** PLANNED — feasibility and build/test evidence not supplied.
- **Priority:** MEDIUM.

### 29. Customer Support Ticket Workflow

- **Category:** Support Operations.
- **Business problem:** Support conversations lack clear ownership and status.
- **Why clients need it:** Track requests through response and resolution without requiring AI.
- **System flow:** Request → ticket/contact → category → assign → acknowledge → status updates → resolution → close.
- **Tools:** Candidates: GoHighLevel forms/conversations, ticket system or pipeline, tasks, workflows.
- **Build checklist:** [ ] Ticket ID; [ ] intake; [ ] category/owner; [ ] acknowledgement; [ ] status transitions; [ ] reopen handling; [ ] duplicate/resolution tests.
- **Screenshots to capture:** Intake; assigned ticket; response task; resolved state.
- **Video walkthrough plan:** Submit and resolve a test request while tracing its owner and status.
- **Case study angle:** Give support requests an accountable path to resolution.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** MEDIUM.

### 30. WordPress Lead Generation Website

- **Category:** Websites / Lead Generation.
- **Business problem:** Service websites may capture inquiries without a CRM handoff.
- **Why clients need it:** Combine usable service pages with verified lead delivery.
- **System flow:** Service page → validated inquiry → integration → CRM contact/opportunity → alert → follow-up.
- **Tools:** Candidates: WordPress, approved form integration, GoHighLevel, webhook/Make/n8n as needed.
- **Build checklist:** [ ] Approved content; [ ] responsive pages; [ ] accessible form; [ ] spam/validation controls; [ ] CRM mapping; [ ] update/security plan; [ ] desktop/mobile lead tests.
- **Screenshots to capture:** Desktop/mobile pages; form; redacted integration; CRM result.
- **Video walkthrough plan:** Submit from the actual test site and verify the inquiry in CRM.
- **Case study angle:** Connect a service website to the lead operation.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** MEDIUM.

### 31. Conversion Funnel + Payment

- **Category:** Funnels / Payments.
- **Business problem:** Offer, checkout, and fulfillment can become disconnected.
- **Why clients need it:** Preserve a consistent path from interest to verified purchase.
- **System flow:** Offer → checkout → verified payment → CRM/order → confirmation → fulfillment handoff; failure → recovery path.
- **Tools:** Candidates: GoHighLevel funnels, sandbox payments, forms, workflows, email.
- **Build checklist:** [ ] Offer/checkout; [ ] server-verified payment; [ ] order deduplication; [ ] CRM mapping; [ ] confirmation; [ ] failure/refund handling; [ ] sandbox tests.
- **Screenshots to capture:** Desktop/mobile funnel; sandbox checkout; verified order; fulfillment handoff.
- **Video walkthrough plan:** Complete a sandbox checkout and show the confirmed order and next action.
- **Case study angle:** Connect checkout to customer operations; do not claim conversion improvements.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** MEDIUM.

### 32. Post-Purchase Upsell Automation

- **Category:** Customer Journey / Sales.
- **Business problem:** Relevant follow-on offers are delivered inconsistently.
- **Why clients need it:** Present an eligible next offer without duplicating purchases or overmessaging.
- **System flow:** Verified purchase → eligibility → delay → offer → accepted? YES: order/CRM update; NO: stop or bounded follow-up.
- **Tools:** Candidates: GoHighLevel, sandbox payments, tags, workflows, email/SMS.
- **Build checklist:** [ ] Eligibility/exclusions; [ ] offer; [ ] wait; [ ] acceptance verification; [ ] reminder cap; [ ] refund/opt-out exits; [ ] sandbox branch tests.
- **Screenshots to capture:** Eligibility; offer; test acceptance; final order/exclusion state.
- **Video walkthrough plan:** Compare eligible and excluded test purchases and show a verified acceptance.
- **Case study angle:** Offer the next relevant step after purchase without claiming additional revenue.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** MEDIUM.

### 33. Cancellation / Retention Workflow

- **Category:** Customer Operations / Retention.
- **Business problem:** Cancellation requests can lack acknowledgement and clear follow-through.
- **Why clients need it:** Route requests consistently while respecting the customer's decision.
- **System flow:** Cancellation request → acknowledge → reason capture → optional assistance → human review where required → confirmed cancellation/retention → CRM update.
- **Tools:** Candidates: GoHighLevel, forms, workflows, tasks, email, subscription provider.
- **Build checklist:** [ ] Clear request path; [ ] acknowledgement; [ ] optional assistance; [ ] accountable approval; [ ] provider confirmation; [ ] access/billing cleanup; [ ] both outcome tests.
- **Screenshots to capture:** Request; review task; confirmed status; cleanup record.
- **Video walkthrough plan:** Process a test cancellation end to end and show the optional assistance path separately.
- **Case study angle:** Handle cancellation requests with clear ownership and closure.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** MEDIUM.

### 34. Renewal Reminder System

- **Category:** Customer Operations / Renewals.
- **Business problem:** Renewal dates and reminders are easy to miss manually.
- **Why clients need it:** Make upcoming renewals visible and stop reminders after resolution.
- **System flow:** Renewal date → scheduled reminders → renewal response/payment → verified status → stop reminders or assign follow-up.
- **Tools:** Candidates: GoHighLevel, date fields, workflows, email/SMS, tasks, payment provider.
- **Build checklist:** [ ] Date/time-zone rules; [ ] reminder windows; [ ] verified renewal; [ ] changed-date handling; [ ] cancellation/opt-out exits; [ ] task escalation; [ ] timing tests.
- **Screenshots to capture:** Renewal fields; reminder schedule; resolved/overdue states.
- **Video walkthrough plan:** Demonstrate a test renewal reminder and prove the resolved record exits the sequence.
- **Case study angle:** Keep renewals visible before they become overdue.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** MEDIUM.

### 35. Event Registration + Reminder System

- **Category:** Events / Appointment Operations.
- **Business problem:** Registration records and event communications can become fragmented.
- **Why clients need it:** Keep attendee details, reminders, and attendance status connected.
- **System flow:** Registration → contact/event record → confirmation → reminders → attendance → follow-up; cancellation → stop reminders.
- **Tools:** Candidates: GoHighLevel, forms, calendars/event platform, workflows, email/SMS.
- **Build checklist:** [ ] Registration; [ ] event/time-zone mapping; [ ] deduplication/capacity rules; [ ] confirmation; [ ] reminders; [ ] cancellation/attendance; [ ] test registration.
- **Screenshots to capture:** Registration page; attendee record; reminder schedule; attendance/follow-up state.
- **Video walkthrough plan:** Register a test attendee, demonstrate reminders, then compare attendance and cancellation paths.
- **Case study angle:** Connect event registration to reliable attendee communication.
- **Status:** PLANNED — build/test evidence not supplied.
- **Priority:** MEDIUM.

## Future portfolio presentation — no changes in this pass

### Featured selection

The homepage WorksWheel should eventually feature approximately **6–8 strongest completed builds**. The full `/work` archive may grow to **15–20+ verified projects**. A suggested eventual mix is Speed-to-Lead, AI Appointment Setter, Automated Sales Pipeline, Client Intake/Onboarding, GHL + n8n, Website → CRM, and Lead Source/Reporting. This is a future curation target, not permission to publish planned concepts or replace today's seven illustrative demo entries.

### Business-led names

Use the business solution as the headline, with a supporting system name and actual tools:

| Headline | Supporting name |
| --- | --- |
| NEVER MISS A NEW LEAD | Speed-to-Lead Automation |
| TURN MISSED CALLS INTO CONVERSATIONS | Missed Call Recovery |
| REDUCE NO-SHOWS | Appointment Recovery System |
| WAKE UP OLD LEADS | Database Reactivation |
| FROM PAYMENT TO KICKOFF | Customer Onboarding System |
| QUALIFY. BOOK. HAND OFF. | AI Appointment System |
| CONNECT THE STACK | GHL + n8n Integration |
| FROM PAGE TO PIPELINE | Website → CRM System |

These are proposed angles; substantiate any outcome claim before using it as achieved results. Avoid generic names such as Workflow #1, Automation Test, GHL Project, and n8n Demo. Do not rename existing public content in this planning pass.

### Visualization selection

| Actual project type | Appropriate presentation |
| --- | --- |
| Automation / CRM | WorkflowCanvas |
| API / webhook / Make / n8n | WorkflowCanvas or architecture visualization |
| Website / funnel | Browser/device previews |
| Marketing / lead journey | Funnel/journey visualization; select an implementation only when needed |
| Complex featured system | Existing cinematic Workflow & Architecture timeline where appropriate |

Do not force every project into one component. Preserve the successful WorksWheel, existing timelines, and current design while adding evidence-driven content later.

### Existing architecture handoff

This roadmap does not modify application data. When a build is eligible and approved for publication, reuse `Project` in `src/types/project.ts` and records under `src/data`, resolved by `src/data/projects.ts`:

- Use actual `title`, `slug`, supported `category`, `summary`, `tools`, `challenge`/`problem`, `solution`, and `implementationNotes`.
- Record real steps in `workflowSteps`; select `workflowVisualization` (`canvas`, `timeline`, or `none`) based on the project. Keep business copy in data rather than components.
- Add approved `coverImage`/`coverAlt`, `gallery` screenshots, `video` provider/URL/title, and optional `liveUrl`/`repositoryUrl` only when available.
- Use `deliverables`/`demonstrates` for unmeasured demo outcomes; reserve `results` for verified facts. Set `isDemo` honestly and keep drafts `published: false`.
- Existing public resolution uses `publishedProjects`/`getProject`; unpublished records remain inaccessible. No new project records or slugs were added here.
- Homepage curation is the explicit `featuredWorkSlugs` list in `src/data/featuredWork.ts`, not this document. Inclusion there remains a separate approved content change.
- Planning category names here are business groupings, not new TypeScript category values. Map to existing supported categories when publishing; do not expand types just for the roadmap.

## Next recommended build — not started

**01. Speed-to-Lead Follow-Up System.** First define one controlled lead source, one test pipeline, one assigned test representative, and the SMS/email/calendar test destinations. Build the smallest complete route from submission to ownership, then separately verify no-reply follow-up, reply stop, booking stop, duplicate submission, and opt-out behavior. Capture the form, workflow, conversation, and final CRM state only after those tests pass. Do not treat the existing illustrative lead-follow-up page as implementation evidence.

The original roadmap-only task created no GHL workflows, integrations, screenshots, cards, routes, visual changes, or features. The later concept-archive task adds approved architecture pages only; no system implementation has begun.
