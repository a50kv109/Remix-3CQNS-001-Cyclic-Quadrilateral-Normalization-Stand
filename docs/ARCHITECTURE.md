# Geometry Reasoning Stand — Architecture Specification (Remix 2 & Remix 3)

**Status:** Living Architectural Specification (Remix 3 Current State)

---

## 1. General Architectural Hierarchy

Geometry Reasoning Stand is organized into strictly decoupled horizontal layers with two-plane operational research support:

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
│  - Tool Quantity Setting (1|2)│                     │  - State Guarding   │
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
- **Architectural Distinction:**
  - *Current Implementation:* Same-Stand Clone reproducing constructions within the same stand instance.
  - *Future / Conceptual:* Universal Construction Pattern (UCP) with cross-stand serialization and inter-stand compatibility validation.

---

## 3. Toolset & Geometric Semantics

### A. 12 Canonical School Tools
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
- **Interactive UX:** Point-first resolution (`resolveOrCreatePoint`) commits persistent point on $S^1$, commits tangent line in `AuxiliaryState.lines`, and clears temporary previews.

### C. Tangent Quantity Setting (`1 | 2`)
- **Status:** `IMPLEMENTED` / `TESTED` (UI Path)
- **Semantics:** Pre-configured batch size for the active tangent construction session:
  - **Quantity = 1 (Default):** 1 click $\rightarrow$ 1 tangent constructed $\rightarrow$ tool automatically completes and returns to `SELECT`.
  - **Quantity = 2:** 1st click $\rightarrow$ 1st tangent constructed $\rightarrow$ stays active (`tangentStep = 1`) $\rightarrow$ 2nd click $\rightarrow$ 2nd tangent constructed $\rightarrow$ tool automatically completes.
  - **Escape Handling:** Pressing ESC after the 1st tangent in Mode 2 retains the 1st tangent and cancels only the pending 2nd step.
- **Epistemic Note:** Quantity is an operational session parameter, NOT the total tangent count in `GeometryState`.

---

## 4. Human Path vs. Agent Path

To preserve formal epistemics, human UI capabilities are explicitly decoupled from autonomous agent interfaces:

```text
A. HUMAN INTERACTION PATH:
   Human User
       ↓
   React UI Shell / Toolbar / Canvas Event
       ↓
   App UI State (e.g. tangentQuantity, lineCircleMode)
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

### Capability Audit Matrix

| Feature | Human UI Path | Agent Execution Path | Status / Audit Note |
| :--- | :--- | :--- | :--- |
| **Two-Plane Switching** | `IMPLEMENTED` | `IMPLEMENTED` | Tested via `agentInterface.test.ts` & `twoPlaneScenario.test.ts` |
| **Plane 2 FIXED Guard** | `IMPLEMENTED` | `IMPLEMENTED` | Tested: Rejects agent mutations with `PLANE_FIXED_READ_ONLY` |
| **`CONSTRUCT_TANGENT`** | `IMPLEMENTED` | `IMPLEMENTED` | Command executes deterministically via `dispatchSemanticCommand` |
| **Tangent Quantity 1/2** | `IMPLEMENTED` | `NOT YET AGENT-AUDITED` | UI session batching; agent dispatches discrete commands directly |
| **Same-Stand Clone** | `IMPLEMENTED` | `NOT YET AGENT-AUDITED` | Pure TypeScript function `clonePlane1ToPlane2`; programmatic agent adapter wrapper not yet benchmarked |
| **Universal Construction Pattern** | `FUTURE` | `FUTURE` | Conceptual serialization for cross-stand transfer |

---

## 5. Core Constitutional Principles

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

## 6. Verification & Build Integrity

- **Active Test Suites:** 23 passing test suites in `npm test` (100% PASS).
- **Static Typecheck:** Zero errors (`tsc -p remix2/tsconfig.json --noEmit`).
- **Production Build:** Verified (`vite build`).
- **Dev Server:** Port 3000, Vite SPA.
