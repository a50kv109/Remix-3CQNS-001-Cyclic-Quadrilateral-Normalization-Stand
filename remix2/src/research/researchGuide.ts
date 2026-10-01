/**
 * R3 — Agent Research Guide & DRA Heuristics
 * Knowledge & guidance layer providing research heuristics ("rails, not tracks")
 * for AI agents and human researchers working with the Geometry Research Stand.
 * 
 * Does NOT modify runtime state, geometry engine, or verification layer.
 */

export interface AgentChecklistStep {
  readonly stepNumber: number;
  readonly name: string;
  readonly question: string;
}

export const AGENT_RESEARCH_CHECKLIST: readonly AgentChecklistStep[] = [
  { stepNumber: 1, name: "QUESTION", question: "What exactly am I trying to find out?" },
  { stepNumber: 2, name: "OBJECT", question: "Which geometric object or relation is being investigated?" },
  { stepNumber: 3, name: "VARIABLE", question: "What can be changed while keeping the relevant conditions?" },
  { stepNumber: 4, name: "CONSTRUCTION", question: "What additional geometric objects might expose the relation?" },
  { stepNumber: 5, name: "MEASUREMENT", question: "What quantities should be observed?" },
  { stepNumber: 6, name: "RELATION / EXPRESSION", question: "Can the observations be combined into a meaningful expression, ratio, difference, product, sum, or square?" },
  { stepNumber: 7, name: "PARAMETER SWEEP", question: "Would several controlled states reveal a pattern better than one observation?" },
  { stepNumber: 8, name: "PATTERN", question: "What appears to remain constant? What changes systematically?" },
  { stepNumber: 9, name: "HYPOTHESIS", question: "Can the observed pattern be stated as a testable hypothesis?" },
  { stepNumber: 10, name: "COUNTEREXAMPLE", question: "What change of state could potentially break the hypothesis?" },
  { stepNumber: 11, name: "NEXT EXPERIMENT", question: "What is the most informative next observation?" },
  { stepNumber: 12, name: "EPISTEMIC STATUS", question: "Is this raw measurement, derived expression, empirical observation, hypothesis, or formally VERIFIED fact?" }
];

export const DRA_REMINDER = {
  title: "DETERMINISTIC REASONING ANCHOR (DRA)",
  subtitle: "Heuristic for External Deterministic Verification",
  principles: [
    "Can this part of the research question be represented explicitly?",
    "Is there an appropriate deterministic operation in the stand?",
    "Would checking it externally reduce ambiguity?",
    "What exactly does the tool establish vs. what remains my interpretation or hypothesis?"
  ],
  epistemicBoundary: [
    "TOOL-VERIFIED FACT",
    "AGENT INTERPRETATION",
    "AGENT HYPOTHESIS"
  ],
  note: "The Verification Layer remains the sole authority for VERIFIED mathematical facts."
};
