# Geometry Reasoning Stand — Architecture Specification (Remix 3 / CQNS-001)

**Status:** Living Architectural Specification (Remix 3 Current State)

---

## 1. General Architectural Hierarchy

The **CQNS-001 Stand** is organized into strictly decoupled horizontal layers with two-plane operational research support, a headless command dispatcher, and local multi-language normalization:

> **Architecture Foundation:** The current Remix 3 implementation uses the `/remix2/` technical foundation directory inherited from the previous implementation phase. `/remix2/` is the active codebase housing the Remix 3 mathematical kernel, UI components, and test suites.

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

## 2. Multi-Plane Research Architecture

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

## 3. Intersection Engine: On-Demand Architecture

### A. Non-Mutating Candidate Discovery
* **On-Demand Interaction:** To prevent visual clutter and combinatorial explosion of virtual points, intersection candidates are computed dynamically within the cursor proximity threshold ($\le 12\text{ mm}$).
* **Spatial Scanning:** On each `pointermove` over the canvas, `findSnapTarget` evaluates pairs of non-parallel entities (chords, auxiliary segments, and auxiliary lines).
* **Transient Visual Observation:** When an intersection point is within $12\text{ mm}$ of the cursor, it is exposed as a `SnapTarget` with `entityType: 'intersection_candidate'`. Moving the cursor away discards the candidate with zero mutation to `GeometryState` or the Construction DAG.

### B. First-Class Materialization & DAG Tracking
* **Explicit Confirmation:** Clicking an active candidate invokes `resolveOrCreatePoint`, which dispatches `CONSTRUCT_INTERSECTION` with the two parent entity IDs.
* **Lineage Preservation:** The resulting `AuxiliaryPoint` receives:
  - Unique ID ($I_1, I_2, I_3, \dots$);
  - Type `intersection`;
  - Explicit parent identifiers `parentIds: [parent1Id, parent2Id]`.
* **Dynamic Recomputation:** When either parent entity is deformed, `recomputeAuxiliaryGeometry` evaluates Kramer's rule to update the intersection coordinates dynamically while preserving its identifier, label, and any downstream dependent constructions (composability).

---

## 4. Agent Architecture: Two Operating Levels

1. **Level A — Semantic Construction:**
   The agent directly invokes high-level semantic commands (`INTERSECT`, `CONSTRUCT_POINT`, `CONSTRUCT_SEGMENT`, `CONSTRUCT_DIAGONAL`, `CONSTRUCT_PARALLEL`, `CONSTRUCT_TANGENT`). Each operation validates topological preconditions and emits structured observations.

2. **Level B — Human-Equivalent Fallback:**
   When a specialized semantic shortcut is not directly available, the agent is designed to accomplish the task through a valid user-equivalent sequence of primitive tools. For example, if an automatic intersection command is not accessible, the agent may use `CONSTRUCT_POINT` to place an auxiliary point at the visual intersection coordinate.
   
   **Key Semantic Boundary:** A point constructed via `POINT` has $0$ or $1$ parent and does not dynamically track parent line movements; a point constructed via `INTERSECT` has $2$ parents and tracks dynamic updates. The fallback must never become an arbitrary coordinate injection (**NO MAGIC GEOMETRY**).

---

## 5. Localization & Terminology Alignment

* **Runtime Architecture:** Local, dependency-free implementation via `translations.ts` and browser `localStorage` (`cqns_language_preference`).
* **AAM Alignment:** Terminology, schema keys, and concepts are aligned with the AAM Language Kernel reference, but the stand contains **no external runtime network dependency** on external AAM repositories.

---

## 6. Verification & Build Integrity

- **Automated Regression Suites:** 24 passing test suites in `npm test` (100% PASS).
- **Static Typecheck:** Zero errors (`tsc -p remix2/tsconfig.json --noEmit`).
- **Production Build:** Verified (`vite build --config remix2/vite.config.ts`).
- **Desktop Browser Verification:** `VERIFIED` across core interactive features (Undo, Eraser, Diagonal, Toolbar, RU/UA/EN Localization, Education, and On-Demand Intersection Mode).
- **Mobile Touch Verification:** `NOT TESTED` (Requires physical touch-screen devices).
