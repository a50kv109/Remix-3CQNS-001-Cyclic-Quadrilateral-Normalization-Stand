# Verification & Testing Specification

**Status:** Living Architectural Specification

---

## 1. Overview

The **CQNS-001 Stand** enforces strict verification standards across mathematical kernel evaluation, semantic command dispatch, regression test suites, and type checking.

---

## 2. Test Suite Matrix (23 Passing Test Suites)

The system maintains 23 automated regression test suites executed via `npm run test` (`tsx remix2/tests/...`):

1. `foundation.test.ts` — Kernel math primitives, vector operations, coordinate transformations.
2. `geometryState.test.ts` — `UniversalGeometryState` immutability, state versioning, deep freezing.
3. `domainProfiles.test.ts` — Cyclic ($N=4$) and Cartesian domain profile factories.
4. `topologyGuard.test.ts` — Topology validation (non-coincidence, non-collinearity, non-degeneracy).
5. `arcChordNormalizer.test.ts` — Angular normalization, order preservation, wrap-around bounds.
6. `uiShell.test.ts` — Presentation model projections, angle mode formatting, preset generators.
7. `toolsAndAuxiliary.test.ts` — Auxiliary state mutations, parent ID DAG lineage tracking.
8. `commandDispatcher.test.ts` — Headless `dispatchSemanticCommand` execution and rollback handling.
9. `normalizationStep1.test.ts` — Cyclic order normalization and vertex labeling.
10. `machineAngleControlRegression.test.ts` — Direct angle mutation and numeric angle control.
11. `geometryStateSnapshotRegression.test.ts` — Pure snapshot creation and read-only observations.
12. `areaMeasurementRegression.test.ts` — Area metrics ($S_{circle}, S_{quad}, S_{gap}$).
13. `geometryResearchRowMapperRegression.test.ts` — Snapshot to `GeometryResearchRow` mapping.
14. `geometryResearchTableRegression.test.ts` — Research table data formatting and step indices.
15. `checkpointBufferRegression.test.ts` — 3-Slot operational return memory (`CheckpointBuffer`).
16. `agentObservationUtilities.test.ts` — Agent measurement queries and snapshot diffing.
17. `researchPlaneControls.test.ts` — Plane 1 / Plane 2 state controls and FIXED status guard.
18. `agentInterface.test.ts` — Headless machine agent adapter execution.
19. `structuralPassport.test.ts` — Quadrilateral classification and invariant verification.
20. `researchGuide.test.ts` — 12-step Agent Research Checklist and DRA heuristics.
21. `runtimeCrashFix.test.ts` — Safe SVG CTM inversion guards and plane switch stability.
22. `segmentCommitRegression.test.ts` — Point-First universal construction protocol.
23. `tangentAndPlaneClone.test.ts` — Tangent construction, 1/2 quantity modes, and `clonePlane1ToPlane2`.

---

## 3. Strict Distinctions: Build / Test vs. Browser Verification

To adhere strictly to the **Prime Constitutional Axiom** (*Agent May Be Wrong. The Stand Must Not*), verification statuses are explicitly categorized:

* **Build & Typecheck:** `PASSED` (`npm run lint` / `tsc -p remix2/tsconfig.json --noEmit` produces zero errors).
* **Automated Regression Suite:** `PASSED` (All 23 test suites pass 100%).
* **Browser UI Interactive Verification:** `NOT BROWSER VERIFIED` (Requires manual browser interaction to confirm visual rendering, drag responsiveness, and language switching in live DOM).

---

## 4. Verification Commands

```bash
# Typecheck
npm run lint

# Regression Tests
npm run test

# Production Build
npm run build
```
