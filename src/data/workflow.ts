export type WorkflowBranch = { label: string; action: string; target: string };
export type WorkflowStep = {
  key: string;
  label: string;
  title: string;
  description: string;
  actions?: string[];
  branches?: WorkflowBranch[];
  route?: string;
};

/** Illustrative automation logic, not a deployed client workflow. */
export const technicalWorkflow: WorkflowStep[] = [
  {
    key: "trigger",
    label: "TRIGGER",
    title: "Form Submitted",
    description: "A form submission starts the automation.",
  },
  {
    key: "contact",
    label: "CONTACT",
    title: "Create / Update Contact",
    description: "Create or update the contact record with the right source data.",
  },
  {
    key: "crm",
    label: "CRM",
    title: "Create Opportunity / Assign Pipeline",
    description: "Create an opportunity and place the lead in the correct pipeline.",
  },
  {
    key: "action",
    label: "ACTION",
    title: "Start Follow-Up",
    description: "Apply tags and begin email/SMS follow-up where consent allows.",
    actions: ["Add Tag", "Send SMS", "Send Email"],
  },
  {
    key: "decision",
    label: "DECISION",
    title: "Has Appointment?",
    description: "Check whether the lead has booked. Booked leads exit the reminder branch.",
    branches: [
      { label: "YES", action: "Move to Booked", target: "complete" },
      { label: "NO", action: "Continue Follow-Up", target: "follow-up" },
    ],
  },
  {
    key: "follow-up",
    label: "FOLLOW UP",
    title: "Send Reminder / Create Task / Update Pipeline",
    description: "On the No branch, send a reminder, create a task, and update the pipeline.",
    route: "NO BRANCH ONLY",
  },
  {
    key: "complete",
    label: "COMPLETE",
    title: "Lead Reaches Final State",
    description:
      "Both paths resolve to a clear CRM state: booked, or follow-up assigned for the team.",
  },
];
