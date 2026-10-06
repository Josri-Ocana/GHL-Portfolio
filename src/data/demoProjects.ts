import type { Project } from "@/types/project";

// DEMO CONTENT: fictional scenarios and original illustrative mockups, not client work.
const samples: Array<
  Pick<
    Project,
    | "slug"
    | "title"
    | "category"
    | "tools"
    | "summary"
    | "problem"
    | "solution"
    | "demoVisual"
    | "workflowVisualization"
  > & {
    steps: string[];
    stepDescriptions?: string[];
    stepIcons?: NonNullable<Project["workflowSteps"]>[number]["icon"][];
    stepTypes?: NonNullable<Project["workflowSteps"]>[number]["type"][];
    notes: string[];
  }
> = [
  {
    slug: "demo-lead-follow-up",
    workflowVisualization: {
      type: "timeline",
      overview: { stepIds: ["step-1", "step-2", "step-10"] },
    },
    stepTypes: [
      "trigger",
      "data",
      "data",
      "action",
      "action",
      "condition",
      "condition",
      "action",
      "condition",
      "output",
    ],
    stepIcons: [
      "trigger",
      "database",
      "database",
      "mapping",
      "mapping",
      "validation",
      "validation",
      "workflow",
      "validation",
      "workflow",
    ],
    stepDescriptions: [
      "Starts the journey with a submitted inquiry.",
      "Matches the inquiry to its CRM contact.",
      "Creates an opportunity for the new inquiry.",
      "Places the opportunity in its pipeline stage.",
      "Adds the tag used by this workflow.",
      "Checks SMS consent before any message sends.",
      "Checks email consent before any message sends.",
      "Pauses before checking for booking or reply.",
      "Checks whether the contact booked or replied.",
      "Continues follow-up or exits when conditions match.",
    ],
    title: "GoHighLevel Lead Follow-Up Automation",
    category: "Automation",
    tools: ["GoHighLevel", "Email", "SMS", "Pipeline", "Tags", "Triggers"],
    summary:
      "A sample journey from form submission to CRM routing, email and SMS follow-up, and an appointment check.",
    problem:
      "Demo scenario: a service business needs a repeatable way to handle inquiries without sending follow-up after a booking or reply.",
    solution:
      "The proposed workflow updates the contact, creates an opportunity, assigns a stage and tag, then checks channel consent before messaging. Wait steps lead to booking and reply checks with explicit exit conditions.",
    steps: [
      "Form submitted",
      "Contact created / updated",
      "Opportunity created",
      "Pipeline stage assigned",
      "Tag applied",
      "SMS eligibility check",
      "Email eligibility check",
      "Wait",
      "Booking / reply check",
      "Follow-up or exit",
    ],
    notes: [
      "Use contact matching to avoid duplicate records.",
      "Check consent and channel availability before any SMS or email action.",
      "Stop follow-up on reply, booking, or opt-out; test each branch with synthetic records.",
    ],
    demoVisual: {
      kind: "flow",
      headline: "FROM INQUIRY TO NEXT STEP",
      labels: [
        "Form submitted",
        "CRM + opportunity",
        "Consent check",
        "Email / SMS",
        "Booked? → Exit",
      ],
    },
  },
  {
    slug: "demo-crm-routing",
    workflowVisualization: {
      type: "timeline",
      overview: { stepIds: ["step-1", "step-5", "step-8"] },
    },
    stepTypes: ["trigger", "condition", "data", "data", "action", "action", "action", "output"],
    stepIcons: [
      "trigger",
      "validation",
      "database",
      "database",
      "mapping",
      "mapping",
      "workflow",
      "workflow",
    ],
    stepDescriptions: [
      "Receives an inquiry from a supported source.",
      "Identifies where the incoming inquiry came from.",
      "Updates the contact with the inquiry details.",
      "Creates the opportunity used for pipeline tracking.",
      "Routes the inquiry to its selected pipeline.",
      "Sets the stage for the next action.",
      "Notifies the owner responsible for this inquiry.",
      "Creates a task for the next follow-up.",
    ],
    title: "CRM Pipeline & Lead Routing System",
    category: "CRM",
    tools: [
      "GoHighLevel",
      "Pipelines",
      "Opportunities",
      "Custom Fields",
      "Tags",
      "Internal Notifications",
    ],
    summary:
      "A CRM architecture sample that routes website, ad, referral, and manually entered inquiries into a defined pipeline.",
    problem:
      "Demo scenario: leads arrive from several sources and need consistent ownership, stages, and next actions.",
    solution:
      "Normalize the source into a custom field, update the contact, and select the appropriate pipeline. Assign a stage and owner before creating a notification and follow-up task.",
    steps: [
      "Website / ad / referral / manual entry",
      "Detect source",
      "Update contact",
      "Create opportunity",
      "Select pipeline",
      "Assign stage",
      "Notify owner",
      "Create follow-up task",
    ],
    notes: [
      "Define a fallback route for unknown sources.",
      "Keep source attribution separate from lifecycle stage.",
      "Check for an existing open opportunity before creating another.",
    ],
    demoVisual: {
      kind: "pipeline",
      headline: "A PLACE FOR EVERY INQUIRY",
      labels: ["New inquiry", "Qualified", "Appointment", "Next action"],
    },
  },
  {
    slug: "demo-appointment-booking",
    workflowVisualization: { type: "canvas" },
    stepTypes: ["trigger", "action", "action", "condition", "condition", "data", "output"],
    stepIcons: [
      "trigger",
      "validation",
      "workflow",
      "validation",
      "mapping",
      "database",
      "workflow",
    ],
    stepDescriptions: [
      "Starts the workflow when an appointment books.",
      "Confirms the booking with the appointment contact.",
      "Schedules each reminder around the booked time.",
      "Checks the booking status before moving forward.",
      "Selects the attended or no-show follow-up path.",
      "Updates the pipeline to reflect appointment status.",
      "Follows the next action for that status.",
    ],
    title: "Appointment Booking Workflow",
    category: "Workflow",
    tools: ["GoHighLevel", "Calendars", "Email", "SMS", "Pipeline", "Workflow Automation"],
    summary:
      "A booking lifecycle sample with confirmations, reminders, and separate attended or no-show paths.",
    problem:
      "Demo scenario: appointment communications need to follow booking status and stop when a meeting is cancelled or rescheduled.",
    solution:
      "Use calendar events as the entry point, schedule reminders relative to the appointment, then branch on attendance before updating the pipeline and proposing follow-up.",
    steps: [
      "Appointment booked",
      "Confirmation",
      "Reminder",
      "Status check",
      "Attended / no-show branch",
      "Update pipeline",
      "Follow-up",
    ],
    notes: [
      "Respect the calendar timezone.",
      "Cancellation and rescheduling should invalidate obsolete reminders.",
      "Keep attendance-dependent actions behind a confirmed status check.",
    ],
    demoVisual: {
      kind: "flow",
      headline: "BOOKED. REMINDED. REVIEWED.",
      labels: ["Calendar event", "Confirmation", "Reminder", "Attendance?", "Update + follow-up"],
    },
  },
  {
    slug: "demo-client-onboarding",
    workflowVisualization: { type: "canvas" },
    stepTypes: ["trigger", "data", "data", "action", "data", "action", "action", "output"],
    stepIcons: [
      "trigger",
      "json",
      "mapping",
      "mapping",
      "database",
      "workflow",
      "workflow",
      "validation",
    ],
    stepDescriptions: [
      "Starts onboarding for the newly accepted client.",
      "Collects the details needed for client onboarding.",
      "Maps intake responses into the contact fields.",
      "Marks the contact with its client tag.",
      "Updates the opportunity for the onboarding handoff.",
      "Assigns the internal task for the next action.",
      "Welcomes the client and explains the next step.",
      "Tracks the tasks needed to complete onboarding.",
    ],
    title: "Client Onboarding Automation",
    category: "Automation",
    tools: ["GoHighLevel", "Forms", "Custom Fields", "Tasks", "Internal Notifications", "Email"],
    summary:
      "An illustrative intake flow that maps submitted details into a CRM record and prepares an onboarding checklist.",
    problem:
      "Demo scenario: a newly accepted client needs one clear intake path and an internal handoff with defined responsibilities.",
    solution:
      "Map intake responses to custom fields, apply a lifecycle tag, update the opportunity, and create internal tasks. A welcome message explains the next step while incomplete submissions stay in review.",
    steps: [
      "New client",
      "Intake form",
      "Map contact data",
      "Apply client tag",
      "Update opportunity",
      "Create internal task",
      "Welcome email",
      "Onboarding checklist",
    ],
    notes: [
      "Collect only information needed for onboarding.",
      "Route missing required fields to manual review.",
      "Assign a task owner and an explicit completion condition.",
    ],
    demoVisual: {
      kind: "flow",
      headline: "A CLEAR START",
      labels: ["Intake", "Field mapping", "Client record", "Owner + task", "Welcome checklist"],
    },
  },
  {
    slug: "demo-make-integration",
    workflowVisualization: {
      type: "timeline",
      overview: { stepIds: ["step-1", "step-5", "step-7"] },
    },
    stepTypes: ["trigger", "data", "condition", "data", "action", "condition", "output"],
    stepIcons: ["trigger", "webhook", "json", "mapping", "integration", "validation", "database"],
    stepDescriptions: [
      "Trigger received from GoHighLevel.",
      "Payload leaves GHL through the configured webhook.",
      "Incoming data is checked before processing.",
      "Fields are mapped into the required destination format.",
      "Sends the prepared request to the connected service.",
      "The returned response is validated.",
      "Updates CRM records to confirm the final state.",
    ],
    title: "GoHighLevel + Make Integration",
    category: "Integrations",
    tools: ["GoHighLevel", "Make.com", "Webhook", "JSON", "API"],
    summary:
      "A sample webhook exchange that transforms CRM event data and returns a confirmation to the contact record.",
    problem:
      "Demo scenario: a CRM event must reach another application without losing field context or creating duplicate updates.",
    solution:
      "Receive the event in a Make scenario, validate the payload, map fields, and call an external application. Record the response back in the CRM and route failed requests for review.",
    steps: [
      "GoHighLevel event",
      "Webhook received",
      "Validate JSON",
      "Transform data",
      "External app request",
      "Response check",
      "CRM confirmation / review",
    ],
    notes: [
      "Keep API credentials on the server or in the integration provider's credential store.",
      "Use an event identifier for deduplication and bounded retries.",
      "This diagram contains no live endpoint, credentials, or external application connection.",
    ],
    demoVisual: {
      kind: "flow",
      headline: "ONE EVENT. A CLEAR HANDOFF.",
      labels: ["GHL event", "Webhook", "Make + JSON", "External app", "CRM confirmation"],
    },
  },
  {
    slug: "demo-auto-shop-funnel",
    workflowVisualization: { type: "canvas" },
    stepTypes: ["trigger", "action", "data", "data", "action", "output"],
    stepIcons: ["workflow", "mapping", "form", "database", "calendar", "validation"],
    stepDescriptions: [
      "Visitor reviews the service and offer.",
      "Visitor selects the service they need.",
      "Lead submits their contact and request details.",
      "Lead information is created or updated in the CRM.",
      "Qualified lead continues to appointment booking.",
      "Submission and booking flow reaches confirmation.",
    ],
    title: "Auto Shop Website Funnel",
    category: "Websites",
    tools: ["GoHighLevel", "Forms", "Calendar", "CRM"],
    summary:
      "A fictional auto-service page concept pairing service information with an appointment request and CRM handoff.",
    problem:
      "Demo scenario: a visitor needs to understand available repair services and request a suitable appointment.",
    solution:
      "Organize the page around services, an explanation of the booking process, and a concise request form. Route submitted service preferences to a CRM opportunity before calendar confirmation.",
    steps: [
      "Service overview",
      "Choose service",
      "Request form",
      "CRM contact",
      "Calendar",
      "Confirmation",
    ],
    notes: [
      "The preview is an original wireframe, not a live business website.",
      "The trust area explains the service process; no reviews or customer claims are fabricated.",
      "Form fields and the CTA in the mockup are illustrative, not interactive controls.",
    ],
    demoVisual: {
      kind: "website",
      headline: "CARE FOR THE ROAD AHEAD.",
      labels: ["Diagnostics", "Maintenance", "Repair planning"],
      action: "Request a service visit",
    },
  },
  {
    slug: "demo-consultation-funnel",
    workflowVisualization: { type: "canvas" },
    stepTypes: ["trigger", "data", "condition", "action", "output", "action"],
    stepIcons: ["workflow", "form", "validation", "calendar", "validation", "email"],
    stepDescriptions: [
      "Introduces the consultation before collecting inquiry details.",
      "Collects the visitor's goals for the consultation.",
      "Checks whether the inquiry fits the consultation scope.",
      "Offers the calendar after the inquiry qualifies.",
      "Explains preparation for the booked consultation.",
      "Starts the appropriate follow-up for the inquiry.",
    ],
    title: "Consultation Booking Funnel",
    category: "Funnels",
    tools: ["GoHighLevel", "Calendar", "Form", "Workflow"],
    summary:
      "A consultation funnel concept that qualifies an inquiry before offering a calendar and a clear confirmation.",
    problem:
      "Demo scenario: a service provider needs context about an inquiry before a consultation is booked.",
    solution:
      "Introduce the consultation, collect the visitor's goals, and show the calendar after qualification. A confirmation page explains preparation and starts the appropriate follow-up branch.",
    steps: [
      "Landing page",
      "Qualification form",
      "Eligibility check",
      "Calendar",
      "Confirmation",
      "Follow-up",
    ],
    notes: [
      "Explain what the consultation covers before asking for details.",
      "Provide a useful alternative for inquiries outside the defined scope.",
      "Do not claim availability until a real calendar is configured.",
    ],
    demoVisual: {
      kind: "website",
      headline: "LET’S MAKE THE NEXT STEP CLEAR.",
      labels: ["Your goals", "A focused conversation", "A practical next step"],
      action: "Explore a consultation",
    },
  },
  {
    slug: "demo-program-application",
    workflowVisualization: { type: "canvas" },
    stepTypes: ["trigger", "action", "condition", "action", "data", "output"],
    stepIcons: ["workflow", "workflow", "validation", "workflow", "form", "database"],
    stepDescriptions: [
      "Introduces the fictional program and its proposed scope.",
      "Explains the outline before requesting applicant details.",
      "Shows the eligibility guidance for prospective applicants.",
      "Answers questions before the application is submitted.",
      "Collects application responses in structured fields.",
      "Assigns a review stage without claiming acceptance.",
    ],
    title: "Program Application Landing Page",
    category: "Funnels",
    tools: ["GoHighLevel", "Application Form", "Workflow", "Pipeline"],
    summary:
      "A sample application page that explains a fictional program and routes submissions into a review pipeline.",
    problem:
      "Demo scenario: applicants need clear scope, eligibility guidance, and an explanation of what follows submission.",
    solution:
      "Present the program outline and eligibility before the application. Store responses in structured fields and assign a review stage with a receipt confirmation rather than an acceptance claim.",
    steps: [
      "Program overview",
      "Benefits and scope",
      "Eligibility",
      "FAQ",
      "Application",
      "Review pipeline",
    ],
    notes: [
      "No real program, credential, or outcome is represented.",
      "Distinguish submission confirmation from acceptance.",
      "Keep review decisions with the responsible team.",
    ],
    demoVisual: {
      kind: "website",
      headline: "A THOUGHTFUL FIRST STEP.",
      labels: ["Explore the outline", "Check the fit", "Prepare your application"],
      action: "View application steps",
    },
  },
  {
    slug: "demo-local-service",
    workflowVisualization: { type: "canvas" },
    stepTypes: ["trigger", "action", "condition", "action", "data", "output"],
    stepIcons: ["workflow", "workflow", "validation", "workflow", "form", "database"],
    stepDescriptions: [
      "Introduces the fictional service website concept.",
      "Helps visitors find the service relevant to their inquiry.",
      "Shows where visitors can check the proposed service coverage.",
      "Explains the next steps before an inquiry is submitted.",
      "Collects the inquiry topic and its source.",
      "Passes the submitted inquiry into the CRM.",
    ],
    title: "Local Service Lead-Generation Website",
    category: "Websites",
    tools: ["GoHighLevel", "Forms", "SEO Structure", "CRM"],
    summary:
      "A fictional service website concept with clear service pages, coverage information, and source-aware lead capture.",
    problem:
      "Demo scenario: visitors need to find a relevant service and check coverage before making an inquiry.",
    solution:
      "Use a semantic page hierarchy for services and coverage, then pass the inquiry topic and source into the CRM. Keep testimonials absent until real, approved evidence is available.",
    steps: [
      "Homepage",
      "Service details",
      "Coverage check",
      "Process information",
      "Lead capture",
      "CRM routing",
    ],
    notes: [
      "Coverage names and business contact details are intentionally unconfigured.",
      "No ratings, reviews, or local-business schema claims are invented.",
      "Use real service and location facts before enabling search indexing.",
    ],
    demoVisual: {
      kind: "website",
      headline: "THE RIGHT HELP. A CLEAR PLAN.",
      labels: ["Find a service", "Check coverage", "Tell us what you need"],
      action: "Plan an inquiry",
    },
  },
];

export const demoProjects: Project[] = samples.map((sample, i) => ({
  ...sample,
  number: String(i + 1).padStart(2, "0"),
  isDemo: true,
  tags: [sample.category, "Demo"],
  published: true,
  featured: [0, 1, 4].includes(i),
  role: "Demo architecture & visual documentation",
  description: `Demonstration only—not client work or a deployed implementation. ${sample.summary}`,
  objective: `Illustrate the proposed path from ${sample.steps[0].toLowerCase()} to ${sample.steps.at(-1)!.toLowerCase()}, with readable handoffs and explicit decision points.`,
  workflowSteps: sample.steps.map((title, index) => ({
    id: `step-${index + 1}`,
    title,
    description: sample.stepDescriptions?.[index],
    icon: sample.stepIcons?.[index],
    type: sample.stepTypes?.[index],
  })),
  implementationNotes: sample.notes,
  demonstrates: [
    sample.summary,
    "An illustrative architecture to review before configuring and testing a real implementation.",
  ],
  demoVideoSlot: true,
  gallery: [],
  results: [],
}));
