# Geometry Reasoning Stand — Architecture Specification (Remix 2 & Remix 3)

**Status:** Living Architectural Specification (Remix 3 Current State)

---

## 1. General Architectural Hierarchy

Geometry Reasoning Stand is organized into strictly decoupled horizontal layers with two-plane operational research support and multi-language normalization:

```text
                           GEOMETRY REASONING STAND
                                      │
                         ┌────────────┴────────────┐
                         │    RESEARCH SESSION     │
                         │   (Multi-Plane Shell)   │
                         └────────────┬────────────┘
                                      │
               ┌──────────────────────┴──────────────────────┐
               │                                             │
      ┌────────▼─────────┐                          ┌────────▼─────────┐
      │     PLANE 1      │                          │     PLANE 2      │
      │  (EXPERIMENT)    │                          │   (REFERENCE)    │
      │  - Active/Mutable│                          │  - BUILDING/FIXED│
      │  - GeometryState │ ──[ SAME-STAND CLONE ]──►│  - GeometryState │
      │  - AuxiliaryState│                          │  - AuxiliaryState│
      │  - Construct. DAG│                          │  - Construct. DAG│
      │  - Snapshots     │                          │  - Snapshots     │
      └────────┬─────────┘                          └────────┬─────────┘
               │                                             │
               └──────────────────────┬──────────────────────┘
                                      │
    ┌─────────────────────────────────┴─────────────────────────────────┐
    │                                                                   │
┌───▼───────────────────────────┐                     ┌─────────────────▼───┐
│     HUMAN INTERACTION PATH    │                     │     AGENT PATH      │
│  - Presentation Projection    │                     │  - Headless Adapter │
│  - SVG Canvas / Live Preview  │                     │  - Explicit planeId │
│  - 12 Canonical Tools         │                     │  - Multi-Plane Obs. │
│  - Language Selector (RU/UA/EN│                     │  - State Guarding   │
└───┬───────────────────────────┘                     └─────────────────┬───┘
    │                                                                   │
    └─────────────────────────────────┬─────────────────────────────────┘
                                      │
                                      ▼
             ┌─────────────────────────────────────────────────┐
             │       HEADLESS SEMANTIC COMMAND DISPATCHER      │
             │  - SemanticCommand Protocol (Unified DTOs)      │
             │  - TopologyGuard Validation & Atomic Rollbacks  │
             │  - Straightedge, Compass & Tangent DAG Engine   │
             │  - GeometryCore Pure Invariants & Formulas      │
             └─────────────────────────────────────────────────┘
```

---

## 2. Multi-Plane Research Architecture (Remix 3)

### A. Plane 1 (Experimental Plane)
- **Role:** Primary interactive workspace for continuous geometric exploration, dynamic mutations, and ad-hoc constructions.
- **Mutability:** Always mutable. Changes on Plane 1 never implicitly mutate Plane 2.
- **State Isolation:** Maintains independent instances of `UniversalGeometryState`, `AuxiliaryState`, and its own Construction DAG lineage.

### B. Plane 2 (Reference / Standard Plane)
- **Role:** Analytical benchmark, comparison baseline, or target pattern plane.
- **Lifecycle States:**
  - `BUILDING`: Mutable, accepting independent construction commands and clones.
  - `FIXED`: Immutable reference benchmark. Any canonical mutation or clone attempt targeting Plane 2 is rejected with `PLANE_FIXED_READ_ONLY`.
- **Epistemic Invariant:** Plane 1 remains fully mutable even when Plane 2 is `FIXED`.

### C. Same-Stand Construction Clone (`PLANE 1 → PLANE 2`)
- **Status:** `IMPLEMENTED` / `TESTED` (Internal Stand Engine)
- **Mechanics:**
  1. **Memory Isolation:** Deep clone of `UniversalGeometryState` using domain profile factories (`createCyclic` / `createCartesian`), producing completely independent mutable references.
  2. **Topological ID Remapping:** All auxiliary entities on Plane 1 receive independent Plane 2 IDs (`p2_pt_...`, `p2_seg_...`, `p2_line_...`, `p2_circ_...`, `p2_meas_...`).
  3. **DAG Parent Remapping:** Parent references (`parentIds`, `p1Id`, `p2Id`, `throughPointId`, `referenceSegmentId`) are topologically remapped through an internal ID translation ledger (`idMap`).
  4. **Lifecycle Guard:** If Plane 2 is `FIXED`, the clone operation is strictly rejected with `PLANE_FIXED_READ_ONLY`.

---

## 3. Toolset & Geometric Semantics

### A. Canonical School Tools
1. **`SELECT`**: Vertex inspection and parametric drag exploration.
2. **`POINT`**: Free point, point on chord/segment (`on_segment`), or point on circumcircle (`on_circle`).
3. **`SEGMENT`**: Point-to-point chord or auxiliary segment.
4. **`RULER`**: Two-point distance measurement.
5. **`COMPASS`**: Center + radius point or numerical radius circle.
6. **`LINE_CIRCLE`**: Extended straightedge line or center-radius circle.
7. **`PARALLEL`**: Parallel line through point relative to reference chord/line.
8. **`PERPENDICULAR`**: Normal line through point relative to reference chord/line.
9. **`ANGLE_BISECTOR`**: Angle bisector ray through 3 points (arm 1, vertex, arm 2).
10. **`DIAGONAL`**: Quadrilateral diagonal ($AC$ or $BD$).
11. **`TANGENT`**: Tangent line to circumcircle $S^1$ through point $P \in S^1$.
12. **`ERASER`**: Deletion of auxiliary entity and dependent DAG descendents.

### B. Tangent Tool Specification (`CONSTRUCT_TANGENT`)
- **Status:** `IMPLEMENTED` / `TESTED`
- **Geometric Semantics:** For a point $P \in S^1(O, R)$, the tangent line $L(P)$ is defined by:
  $$\vec{r} = P - O, \quad \vec{u} = \left(-\frac{r_y}{\|\vec{r}\|}, \frac{r_x}{\|\vec{r}\|}\right), \quad L(P) = \{ P + t \cdot \vec{u} \mid t \in \mathbb{R} \}$$
- **Verification:** Dot product of tangent direction and radius vector is strictly zero ($\vec{u} \cdot \vec{r} = 0$).
- **DAG Lineage:** `parentIds: ['circle_main', pointId]`.

---

## 4. Language Kernel & Semantic Gateway (RU / UA / EN)

### A. Semantic Gateway Principle
The language layer operates as a **Semantic Gateway** — a normalization layer providing language-invariant mapping for UI presentations, educational protocols, and research observations:
- **Languages Supported:** Russian (`RU`), Ukrainian (`UA`), English (`EN`).
- **Persistence:** User language choice is loaded via `getSavedLanguage()` and saved via `saveLanguagePreference(lang)` into browser `localStorage` under key `cqns_language_preference` (defaulting to `'RU'`).

### B. Normalized Subsystems
- **Summary Table Panel:** Invariant metrics, opposite angle sums, Ptolemy ratios, area breakdown.
- **Structural Passport Panel:** Quadrilateral classification, diagonal properties, center location status.
- **AAM Gateway Panel:** Normalized representation export, state hash, version status.
- **Education Panel & Research Checklist:** Complete 12-step research protocol (Question, Object, Variable, Construction, Measurement, Relation, Parameter Sweep, Pattern, Hypothesis, Counterexample, Next Experiment, Epistemic Status) and DRA Heuristic Rails.
- **Numeric Angles Modal:** Dialog headers, vertex input labels, validation error messages.
- **Research Plane Controls:** Controls, clone buttons, tooltips, plane status badges.

---

## 5. Human Path vs. Agent Path

```text
A. HUMAN INTERACTION PATH:
   Human User
       ↓
   Header Bar Language Selector (RU/UA/EN) & Toolbar
       ↓
   App UI State (language, activeTool, standMode)
       ↓
   resolveOrCreatePoint / Dynamic Snapping
       ↓
   dispatchSemanticCommand(command, context)
       ↓
   UniversalGeometryState & AuxiliaryEngine DAG

B. AGENT EXECUTION PATH:
   Autonomous Agent / Machine Runner
       ↓
   AgentInterface Adapter (agentInterface.ts)
       ↓
   AgentCommand { planeId: 'PLANE_1' | 'PLANE_2', command: SemanticCommand }
       ↓
   Plane 2 FIXED & Concurrency Version Guard
       ↓
   dispatchSemanticCommand(command, context)
       ↓
   PlaneObservation / Multi-Plane AgentObservation DTO
```

---

## 6. Core Constitutional Principles

1. **The Prime Constitutional Axiom:**
   > **AGENT MAY BE WRONG. THE STAND MUST NOT.**
   The stand produces mathematically verified facts (coordinates, equations, lengths, areas, invariants). The agent consumes and reasons about these facts.
2. **Epistemic Separation:**
   - *Mathematical Fact* $\neq$ *Software Action* $\neq$ *Research Interpretation*.
3. **Construction $\neq$ Verification:**
   - Constructing an auxiliary entity records operational lineage in the DAG; it does not prove a geometric theorem.
4. **No Magic Geometry:**
   - All geometric entities must possess explicit provenance and traceable parent identifiers.
5. **UI Capability $\neq$ Agent Capability:**
   - Presence of a UI button or visual widget does not constitute proof of autonomous agent access until verified by headless integration tests.

---

## 7. Verification & Build Integrity

- **Active Test Suites:** 23 passing test suites in `npm test` (100% PASS).
- **Static Typecheck:** Zero errors (`tsc -p remix2/tsconfig.json --noEmit`).
- **Production Build:** Verified (`vite build`).
- **Browser/UI Verification Status:** `NOT BROWSER VERIFIED` (Automated build and tests pass; manual browser UI interaction is pending user verification).
