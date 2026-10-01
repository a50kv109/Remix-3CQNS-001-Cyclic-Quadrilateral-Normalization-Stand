# Geometry Reasoning Stand — Architectural Roadmap (Remix 2 & Remix 3)

**Status:** Living Development & Release Roadmap (Remix 3 Current State)

---

## 1. Status Legend

* **FROZEN:** Fully implemented, verified against authoritative regression suites, and locked against breaking modifications.
* **IMPLEMENTED:** Fully coded in `remix2/src` with passing unit and regression tests in `remix2/tests`.
* **NOT YET AGENT-AUDITED:** Implemented and tested in the UI/standalone layer, but end-to-end autonomous agent interaction is pending a dedicated audit suite.
* **OPEN / NON-BLOCKING:** Active capability enhancement identified; existing fallback paths are fully functional.
* **FUTURE / CONCEPTUAL:** High-level architectural target specified for subsequent development phases.

---

## 2. Package Roadmap Matrix

| Package ID | Component Name | Factual Status | Implementation & Test Files |
| :--- | :--- | :--- | :--- |
| **R2-00** | **Foundation / Project Skeleton** | **FROZEN** | `remix2/src/index.ts`<br>`remix2/tests/foundation.test.ts` |
| **R2-01** | **Universal Geometry State** | **FROZEN** | `remix2/src/kernel/state/geometryState.ts`<br>`remix2/tests/geometryState.test.ts` |
| **R2-02** | **Domain Profile Contract** | **FROZEN** | `remix2/src/types/geometry.ts`<br>`remix2/tests/domainProfiles.test.ts` |
| **R2-03** | **Topology & Arc Guard** | **FROZEN** | `remix2/src/kernel/topology/topologyGuard.ts`<br>`remix2/tests/topologyGuard.test.ts` |
| **R2-04** | **Universal Arc/Chord Normalizer** | **FROZEN** | `remix2/src/kernel/arcChordNormalizer.ts`<br>`remix2/tests/arcChordNormalizer.test.ts` |
| **R2-05** | **UI Shell & Viewport Normalization** | **FROZEN** | `remix2/src/ui/`<br>`remix2/tests/uiShell.test.ts`<br>`remix2/tests/normalizationStep1.test.ts` |
| **R2-05.1** | **Canonical Geometry Stand Active Tools** | **FROZEN** | `remix2/src/ui/types/auxiliaryTypes.ts`<br>`remix2/src/ui/state/auxiliaryEngine.ts`<br>`remix2/tests/toolsAndAuxiliary.test.ts` |
| **R2-05.2** | **Semantic Command Dispatcher** | **FROZEN** | `remix2/src/ui/types/semanticCommands.ts`<br>`remix2/src/ui/state/commandDispatcher.ts`<br>`remix2/tests/commandDispatcher.test.ts` |
| **R2-05.3** | **Machine Angle Control & Topological DAG** | **FROZEN** | `remix2/tests/machineAngleControlRegression.test.ts` |
| **R2-06** | **State Snapshot Projection Layer** | **FROZEN** | `remix2/src/types/snapshot.ts`<br>`remix2/src/research/index.ts`<br>`remix2/tests/geometryStateSnapshotRegression.test.ts` |
| **R2-07** | **Reference Circle & Area Metrics** | **FROZEN** | `remix2/tests/areaMeasurementRegression.test.ts` |
| **R2-08** | **Geometry Research Row Mapper** | **FROZEN** | `remix2/src/types/researchTable.ts`<br>`remix2/src/research/tableMapper.ts`<br>`remix2/tests/geometryResearchRowMapperRegression.test.ts` |
| **R2-09** | **Read-Only Geometry Research Table** | **FROZEN** | `remix2/src/ui/components/GeometryResearchTable.tsx`<br>`remix2/tests/geometryResearchTableRegression.test.ts` |
| **R2-10** | **Checkpoint Buffer (3-Slot Return Memory)** | **FROZEN** | `remix2/src/research/checkpointBuffer.ts`<br>`remix2/tests/checkpointBufferRegression.test.ts` |
| **R2-11** | **Agent Observation Utilities** | **FROZEN** | `remix2/src/research/snapshotDiff.ts`<br>`remix2/tests/agentObservationUtilities.test.ts` |
| **R3-01** | **Two-Plane Research Session** | **IMPLEMENTED** | `remix2/src/ui/types/researchSession.ts`<br>`remix2/tests/twoPlaneScenario.test.ts`<br>`remix2/tests/runtimeCrashFix.test.ts` |
| **R3-01.1** | **Research Plane UI Controls & Status** | **IMPLEMENTED** | `remix2/src/ui/components/ResearchPlaneControls.tsx`<br>`remix2/tests/researchPlaneControls.test.ts` |
| **R3-01.2** | **Same-Stand Construction Clone (`P1 → P2`)** | **IMPLEMENTED / TESTED**<br>*(Agent Access: NOT YET AUDITED)* | `remix2/src/research/planeClone.ts`<br>`remix2/tests/tangentAndPlaneClone.test.ts` |
| **R3-02** | **Headless Agent Interface Adapter** | **IMPLEMENTED / TESTED** | `remix2/src/research/agentInterface.ts`<br>`remix2/tests/agentInterface.test.ts` |
| **R3-03** | **Tangent Tool & Session Quantity UX (1\|2)** | **IMPLEMENTED / TESTED**<br>*(Agent Access: NOT YET AUDITED)* | `remix2/src/ui/canvas/SchoolToolbar.tsx`<br>`remix2/src/ui/canvas/GeometryCanvas.tsx`<br>`remix2/tests/tangentAndPlaneClone.test.ts` |
| **R3-04.1** | **Point-First Universal Construction Protocol** | **IMPLEMENTED / TESTED** | `remix2/src/ui/canvas/pointResolution.ts`<br>`remix2/tests/segmentCommitRegression.test.ts` |
| **R3-04.2** | **Structural Passport Projection & Invariants** | **IMPLEMENTED / TESTED** | `remix2/src/research/structuralPassport.ts`<br>`remix2/tests/structuralPassport.test.ts` |
| **R3-06** | **AAM Language Kernel & Multi-Language Gateway (RU/UA/EN)** | **IMPLEMENTED / TESTED** | `remix2/src/ui/i18n/translations.ts`<br>`remix2/tests/researchGuide.test.ts` |
| **R3-05** | **Universal Construction Pattern (UCP)** | **FUTURE / CONCEPTUAL** | Cross-stand portable serialization & inter-stand compatibility validation |

---

## 3. Active Capabilities & Status Details

### A. Two-Plane Operational Research
- **Plane 1 (Experiment):** Mutable scratchpad for ad-hoc constructions and continuous parameter manipulation.
- **Plane 2 (Reference Benchmark):** Can transition to `FIXED`. When `FIXED`, mutations and clone attempts are rejected with `PLANE_FIXED_READ_ONLY`, while Plane 1 remains mutable.
- **State Isolation:** Deep isolation with zero shared mutable references.

### B. Same-Stand Construction Clone (`clonePlane1ToPlane2`)
- **Factual Status:** `IMPLEMENTED` / `TESTED`
- **Scope:** Recreates constructions within the same stand using topological DAG remapping and independent ID generation (`p2_...`).
- **Agent Audit Status:** `NOT YET AGENT-AUDITED` (programmatic execution via pure TS function is verified; agent wrapper protocol pending formal audit).

### C. Tangent Tool & Quantity UX (1 | 2)
- **Factual Status:** `IMPLEMENTED` / `TESTED`
- **Scope:**
  - `CONSTRUCT_TANGENT`: GeometryCore pure perpendicular calculation $\vec{u} \perp \vec{r}$.
  - Quantity Setting `1 | 2`: Configurable batch size per tool invocation with single-tangent or double-tangent auto-completion and safe ESC rollback.
- **Agent Audit Status:** `NOT YET AGENT-AUDITED` (Agent dispatches discrete `CONSTRUCT_TANGENT` commands; multi-step batching is currently a UI presentation feature).

### D. Universal Construction Pattern (UCP)
- **Factual Status:** `FUTURE` / `CONCEPTUAL`
- **Scope:** Portable standalone construction serialization and inter-stand transfer between disparate geometry stands. Kept conceptually distinct from same-stand cloning.

---

## 4. Test Suite Execution & Integrity

All **23 of 23** test suites execute cleanly with 100% pass rate:

```bash
npm test
# Result: 23 test suites passed (100% PASS)
```
