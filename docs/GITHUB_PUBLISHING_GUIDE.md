# GitHub Publishing & Architecture Guide
### Geometry Reasoning Stand v2 (Remix 2)

Welcome to the comprehensive publishing and architecture guide for **Geometry Reasoning Stand v2 (Remix 2)**. This document serves as the primary technical blueprint and developer onboarding reference for publishing, maintaining, and contributing to the repository on GitHub.

---

## 1. Project Overview & Philosophy

The **Geometry Reasoning Stand v2** is a modular, high-fidelity geometric reasoning, parametric exploration, and straightedge-and-compass auxiliary construction environment. It is designed to be utilized as a reliable "external laboratory" or "epistemic instrument" by both human researchers and autonomous AI agents.

### The Prime Constitutional Axiom
> **"AGENT MAY BE WRONG. THE STAND MUST NOT."**

To maintain absolute mathematical authority, the system enforces a strict boundary between:
1. **Factual Geometry (Deterministic Stand Output):** Computed coordinates, lengths, areas, and exact Euclidean metrics.
2. **Speculative Reasoning (External Agent Interpretation):** Hypotheses, qualitative summaries, and analytical claims. The Stand never swallows or validates raw speculative claims; it only returns deterministic mathematical facts.

---

## 2. Core Architectural Decoupling

The Remix 2 architecture is divided into five strictly decoupled, unidirectional layers to eliminate "epistemic drift" and state mutation side effects:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                               GEOMETRY REASONING STAND                  │
│                                                                         │
│   [Human User Interface]        [Autonomous AI Agent]     [AAM Gateway] │
│              │                            │                     │       │
│              └────────────────────────────┼─────────────────────┘       │
│                                           ▼                             │
│                              [SemanticCommand Protocol]                 │
│                                           │                             │
│                                           ▼                             │
│                                 [CommandDispatcher]                     │
│                                           │                             │
│                    ┌──────────────────────┴──────────────────────┐      │
│                    ▼                                             ▼      │
│         [UniversalGeometryState]                       [AuxiliaryState / DAG]  │
│         - Immutable Kernel (Points/Angles)             - Straightedge & Compass│
│         - TopologyGuard (Validation)                   - Auto-Recomputation    │
│                    │                                             │      │
│                    └──────────────────────┬──────────────────────┘      │
│                                           ▼                             │
│                       [Observation & Operational Memory Layer]          │
│                       - CheckpointBuffer (3-Slot Return Memory)         │
│                       - GeometryStateSnapshot (Pure Observation DTO)    │
│                       - GeometryResearchTable (Read-Only Dataset)       │
│                       - SnapshotDiff (DTO Subtract Comparison)          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Module Contracts

| Module | Purpose / Contract |
|---|---|
| **`UniversalGeometryState`** | Single Source of Truth for canonical geometric primitives. Produces immutable versioned state (`stateVersion`). |
| **`GeometryCore`** | Pure, stateless mathematical coordinate arithmetic and Euclidean metric authority. |
| **`TopologyGuard`** | Verifies structural prerequisites (e.g. non-degeneracy, angle order) before state commits. |
| **`AuxiliaryEngine`** | Straightedge-and-compass Construction DAG. Auto-recomputes dependent intersections and measurements. |
| **`CommandDispatcher`** | Executes structured `SemanticCommand` protocols for both UI and autonomous agents with transactional rollback on failure. |
| **`CheckpointBuffer`** | Pure 3-slot operational return memory (`1 | 2 | 3`) allowing agents to restore previous states. |
| **`GeometryStateSnapshot`** | Stateless, immutable observation DTO capturing coordinates, constructions, and area metrics. |

---

## 3. The Deterministic Reasoning Anchor (DRA) Pattern

A core contribution of this project is the formalization of the **Deterministic Reasoning Anchor (DRA)** pattern. This is a cognitive pattern for agent-based reasoning where the agent uses a deterministic tool as an external "epistemic anchor."

### The DRA Cycle
Rather than relying on speculative reasoning, the agent:
1. **Structural Recognition:** Identifies a formalizable sub-problem (e.g. *"This relation depends on distances from $M$ to $A, B, C, D$"*).
2. **Applicability Decision:** Evaluates if external verification is useful and identifies the corresponding stand operations.
3. **Semantic Projection:** Expresses the sub-problem in the language of the stand (`dispatchAgentCommand`).
4. **Deterministic Operation:** The stand returns raw coordinates, distances, and area metrics via a stateless `GeometryStateSnapshot`.
5. **Epistemic Separation:** The agent separates **verified facts** from **hypotheses**:
   $$\text{TOOL-VERIFIED FACT} \neq \text{AGENT INTERPRETATION} \neq \text{AGENT HYPOTHESIS}$$
6. **Reasoning Update:** Integrates the verified facts to update its search path or mathematical proof.

---

## 4. The Agent Research Protocol (Heuristic "Rails")

To guide autonomous research without restricting freedom or forcing the agent into hardcoded algorithmic "tracks," the stand exposes a 12-step **Agent Research Protocol Checklist** and **Research Patterns** inside its knowledge layer:

### Agent Research Checklist
Before and during any geometric experiment, the agent should formulate:
1. **`QUESTION`**: What exactly am I trying to find out?
2. **`OBJECT`**: Which geometric object or relation is being investigated?
3. **`VARIABLE`**: What can be changed while keeping the relevant conditions?
4. **`CONSTRUCTION`**: What additional geometric objects might expose the relation?
5. **`MEASUREMENT`**: What quantities should be observed?
6. **`RELATION / EXPRESSION`**: Can the observations be combined into a meaningful expression, ratio, sum, product, or square?
7. **`PARAMETER SWEEP`**: Would several controlled states reveal a pattern better than one observation?
8. **`PATTERN`**: What appears to remain constant? What changes systematically?
9. **`HYPOTHESIS`**: Can the observed pattern be stated as a testable hypothesis?
10. **`COUNTEREXAMPLE`**: What change of state could potentially break the hypothesis?
11. **`NEXT EXPERIMENT`**: What is the most informative next observation?
12. **`EPISTEMIC STATUS`**: Is this raw measurement, derived expression, empirical observation, hypothesis, or formally `VERIFIED` fact?

---

## 5. Development, Verification, & Testing

The repository maintains an extensive test suite ensuring zero regressions across all core mathematical boundaries.

### Setup Instructions
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the interactive local development server:
   ```bash
   npm run dev:r2
   ```
3. Run the full headless test runner suite:
   ```bash
   npm test
   ```
4. Verify TypeScript type-safety:
   ```bash
   npm run lint:r2
   ```

### Core Tests List

| Test Suite | File Path | Focus |
|---|---|---|
| **Foundation** | `remix2/tests/foundation.test.ts` | Base package and skeleton check. |
| **Geometry State** | `remix2/tests/geometryState.test.ts` | Circular vertex commit and domain transitions. |
| **Topology Guard** | `remix2/tests/topologyGuard.test.ts` | Non-degeneracy, non-coincidence and angular order checks. |
| **Arc/Chord Normalizer** | `remix2/tests/arcChordNormalizer.test.ts` | Complex angular intervals and arc-length tracking. |
| **Tools & Auxiliary** | `remix2/tests/toolsAndAuxiliary.test.ts` | Construction DAG straightedge-and-compass operations. |
| **Command Dispatcher** | `remix2/tests/commandDispatcher.test.ts` | Execution of `SemanticCommand` protocols. |
| **Snapshot Regression** | `remix2/tests/geometryStateSnapshotRegression.test.ts` | `GeometryStateSnapshot` serialization and determinism. |
| **Checkpoint Buffer** | `remix2/tests/checkpointBufferRegression.test.ts` | Multi-slot memory isolation and restore mechanisms. |
| **Agent Observation** | `remix2/tests/agentObservationUtilities.test.ts` | Dynamic state diffing and metric extraction. |
| **Structural Passport** | `remix2/tests/structuralPassport.test.ts` | Relative center position (`INSIDE`, `OUTSIDE`, `BOUNDARY`) and diameter chord checks. |
| **Research Guide** | `remix2/tests/researchGuide.test.ts` | Integrity of Agent Checklist and DRA Heuristic constants. |

---

## 6. Contribution Guidelines

When introducing new domain presets, auxiliary constructions, or agent observation utilities, follow these three strict rules:
1. **Never duplicate mathematical formula authority:** All coordinates, metrics, and distances must be derived strictly via `GeometryCore`.
2. **Keep the observation layer read-only:** Snapshot projections and diff utilities must never mutate the geometric state.
3. **Respect the epistemic boundary:** Never allow empirical hypotheses to be represented as formally verified Euclidean truths.

---

*This repository is actively maintained as part of the Google AI Studio Build Research Stand initiative.*
