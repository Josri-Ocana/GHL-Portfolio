// Illustrative architecture, not a claim about a delivered client system.
export const systemOverviewNodes = [
  {
    name: "Landing page",
    stage: "CAPTURE",
    position: "node-one",
    symbol: "M3 5h18v14H3z M3 9h18 M7 13h5 M7 16h8",
  },
  {
    name: "Form & survey",
    stage: "QUALIFY",
    position: "node-two",
    symbol: "M5 3h14v18H5z M9 8h6 M9 12h6 M9 16h3",
  },
  {
    name: "CRM & pipeline",
    stage: "ORGANIZE",
    position: "node-three",
    symbol: "M3 5h18v14H3z M9 5v14 M15 5v14 M5 9h2 M11 12h2 M17 15h2",
  },
  {
    name: "Email & SMS",
    stage: "FOLLOW UP",
    position: "node-four",
    symbol: "M3 5h18v14H3z M3 6l9 7 9-7",
  },
  {
    name: "API & webhook",
    stage: "CONNECT",
    position: "node-five",
    symbol: "M8 4L2 12l6 8 M16 4l6 8-6 8 M14 3l-4 18",
  },
  {
    name: "Appointment",
    stage: "BOOK",
    position: "node-six",
    symbol: "M4 5h16v16H4z M4 10h16 M8 2v6 M16 2v6 M8 15l3 3 5-5",
  },
] as const;
