# Verification & Testing Specification

**Status:** Living Architectural Specification (Remix 3 / CQNS-001)

---

## 1. Overview

The **CQNS-001 Stand** enforces strict verification standards across mathematical kernel evaluation, semantic command dispatch, regression test suites, and live browser user interactions.

To adhere strictly to the **Prime Constitutional Axiom** (*Agent May Be Wrong. The Stand Must Not*), the project enforces a fundamental epistemic distinction:

$$\text{HEADLESS TEST} \neq \text{BROWSER VERIFICATION}$$

* **Headless Unit & Regression Tests** verify:
  - Exact mathematical formulas and floating-point invariants;
  - Deterministic state transitions in `UniversalGeometryState`;
  - Semantic command dispatch and atomic rollback handling in `CommandDispatcher`;
  - Acyclic dependency graphs (DAG) and parent lineage tracking;
  - Plane 1 / Plane 2 memory isolation and `FIXED` lifecycle guards.
* **Browser Interactive Verification** is strictly required to verify:
  - Mouse pointer and pointermove tracking;
  - On-demand hover candidate detection within cursor proximity ($\le 12\text{ mm}$);
  - React re-render cycles, memoized callback dependency arrays, and spatial updates;
  - SVG DOM rendering, snap ring indicators, and animated candidate pulses;
  - Floating toolbar docking, language switching in the DOM, and modal dialogs;
  - Touch hit-testing on mobile devices.

---

## 2. Regression Test Inventory (24 Test Suites — All Passing)

The system maintains 24 automated regression test suites executed via `npm run test` (`tsx remix2/tests/...`):

1. `foundation.test.ts` — Kernel math primitives, vector operations, coordinate transformations.
2. `geometryState.test.ts` — `UniversalGeometryState` immutability, state versioning, deep freezing.
3. `domainProfiles.test.ts` — Cyclic ($N=4$) and Cartesian domain profile factories.
4. `topologyGuard.test.ts` — Topology validation (non-coincidence, non-collinearity, non-degeneracy).
5. `arcChordNormalizer.test.ts` — Angular normalization, order preservation, wrap-around bounds.
6. `uiShell.test.ts` — Presentation model projections, angle mode formatting, preset generators.
7. `toolsAndAuxiliary.test.ts` — Auxiliary state mutations, parent ID DAG lineage tracking.
8. `commandDispatcher.test.ts` — Headless `dispatchSemanticCommand` execution, diagonal pairing, and rollback handling.
9. `normalizationStep1.test.ts` — Cyclic order normalization and vertex labeling.
10. `machineAngleControlRegression.test.ts` — Direct angle mutation and numeric angle control.
11. `geometryStateSnapshotRegression.test.ts` — Pure snapshot creation and read-only observations.
12. `areaMeasurementRegression.test.ts` — Area metrics ($S_{circle}, S_{quad}, S_{gap}$).
13. `geometryResearchRowMapperRegression.test.ts` — Snapshot to `GeometryResearchRow` mapping.
14. `geometryResearchTableRegression.test.ts` — Research table data formatting and step indices.
15. `checkpointBufferRegression.test.ts` — 3-Slot operational return memory (`CheckpointBuffer`).
16. `agentObservationUtilities.test.ts` — Agent measurement queries and snapshot diffing.
17. `researchPlaneControls.test.ts` — Plane 1 / Plane 2 state controls and `FIXED` status guard.
18. `agentInterface.test.ts` — Headless machine agent adapter execution.
19. `structuralPassport.test.ts` — Quadrilateral classification and invariant verification.
20. `researchGuide.test.ts` — 12-step Agent Research Checklist and DRA heuristics.
21. `runtimeCrashFix.test.ts` — Safe SVG CTM inversion guards and plane switch stability.
22. `segmentCommitRegression.test.ts` — Point-First universal construction protocol.
23. `tangentAndPlaneClone.test.ts` — Tangent construction, 1/2 quantity modes, and `clonePlane1ToPlane2`.
24. `sequentialIntersection.test.ts` — **Sequential Intersection & Candidate Scanner Suite:**
    - **TEST A & B:** Sequential intersections ($I_1 \to I_2 \to I_3$) in a continuous session without reload or toggle; visibility of newly added geometry (chords, segments, lines);
    - **TEST C:** Intersection Mode OFF enforces zero candidate targets and zero DAG pollution;
    - **TEST D:** Provenance distinction between ordinary point (`GIVEN_POINT`, 0 parents) and intersection point (`INTERSECT`, 2 parents);
    - **TEST E:** Dynamic intersection tracking across geometric deformation (updates coordinates while preserving IDs and parent lineage);
    - **TEST F:** Composability (using materialized $I_1$ as parent for secondary dependent constructions);
    - **TEST G & UNDO:** LIFO history rollback, DAG integrity, and zero dangling references.

---

## 3. Verified Scenarios vs. Remaining Limitations

### A. Verified Scenarios (Headless + Desktop Browser)
* **On-Demand Intersection Mode:** Cursor proximity revelation ($\le 12\text{ mm}$), non-mutating hover observation, click materialization as first-class $I_n$.
* **Construction Undo (LIFO):** Pre-command snapshots, atomic rollback of auxiliary state and geometry.
* **Construction-Aware Eraser:** Recursive deletion of selected entities and their dependent children while protecting canonical quadrilateral primitives.
* **Single-Click Diagonal Tool:** Constructing $AC$ or $BD$ with automatic opposite vertex resolution.
* **Dockable Toolbar:** Safe-area positioning at `LEFT`, `RIGHT`, or `BOTTOM` without viewport displacement.
* **Localization (RU / UA / EN):** Complete UI dictionary coverage and `localStorage` persistence.
* **Dual-Plane Workspace:** Mutable Plane 1, immutable Plane 2 under `FIXED`, and isolated topological cloning.

### B. Remaining Limitations
* **Mobile / Touch Devices:** `NOT TESTED`. Touch-drag handling on mobile screens has not been validated on real devices.
* **Line × Circle / Circle × Circle Intersections:** `PARTIAL`. Algebraic solvers exist in the kernel, but dedicated UI candidate snapping is deferred to future work.
* **Autonomous Agent Closed-Loop Audit:** `PARTIAL`. Headless adapter is tested, but full multi-turn autonomous agent reasoning sessions require external evaluation.

---

## 4. Verification Commands

```bash
# Typecheck
npm run lint

# Run all 24 regression test suites
npm test

# Production build
npm run build:r2
```
