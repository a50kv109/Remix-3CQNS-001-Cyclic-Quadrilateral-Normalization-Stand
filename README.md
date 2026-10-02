# CQNS-001 Cyclic Quadrilateral Normalization Stand (Remix 3)

[![Architecture](https://img.shields.io/badge/Architecture-Remix%203%20Stand-purple.svg)](./remix2)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](./tsconfig.json)
[![Tests](https://img.shields.io/badge/Regression%20Suites-27%20Passing-emerald.svg)](./remix2/tests)
[![PGS Specification](https://img.shields.io/badge/PGS--2D-Schema%200.1%20(EXACT__STATE)-green.svg)](./TEST_01_BASIC_CYCLIC_QUADRILATERAL.pgs.json)

## 1. Overview

**CQNS-001 Cyclic Quadrilateral Normalization Stand (Remix 3)** is an interactive and automated geometric reasoning, parametric exploration, invariant analysis, dynamic construction environment, and PGS-2D portable semantic exchange node.

> **Architecture Note:** The current Remix 3 implementation uses the `/remix2/` technical foundation directory inherited from the previous project stage. It is not an unmaintained legacy codebase; `/remix2/` is the authoritative source directory housing the Remix 3 mathematical kernel, UI components, and test suites.

The system is designed for both human researchers and autonomous AI agents working with cyclic quadrilateral ($N=4$) geometry inscribed in a reference circumcircle $S^1$.

---

## 2. Forensic Verification & Build Status

* **TypeScript Typecheck (`npm run lint`):** `PASSED` (Zero errors via `tsc -p remix2/tsconfig.json --noEmit`)
* **Automated Regression Suites (`npm run test`):** `PASSED` (All 27 regression test suites passing 100%)
* **Production Build (`npm run build:r2`):** `PASSED` (Vite production bundle compiled successfully)
* **PGS-2D Round-Trip Verification (`npx tsx remix2/tests/e2ePgsExperiment.test.ts`):** `ROUND_TRIP_SUCCESS` across symmetric, asymmetric, and rich auxiliary geometric states.
* **Desktop Browser Verification:** `VERIFIED` across core interactive features (Undo, Eraser, Diagonal, Toolbar docking, RU/UA/EN Localization, Education, On-Demand Intersection Mode, and PGS Passport UI).
* **Mobile / Touch Verification:** `NOT TESTED` (Requires dedicated touch-screen testing).

---

## 3. Purpose & PGS-2D Integration

The stand provides a deterministic environment to:
1. Construct and manipulate cyclic quadrilaterals with concyclic vertices $A, B, C, D$ on a reference circumcircle $S^1$ centered at $O(0,0)$ with radius $R = 160\text{ mm}$.
2. Execute straightedge & compass auxiliary constructions (segments, lines, circles, parallel/perpendicular lines, angle bisectors, tangents, diagonals, and line/segment intersections).
3. Track structural topology and invariants (opposite angle sums $\angle A + \angle C = 180^\circ$, Ptolemy's theorem $AC \cdot BD = AB \cdot CD + BC \cdot DA$, area metrics $S_{circle}, S_{quad}, S_{gap}$).
4. Provide a dual-plane research workspace (**Plane 1 / Plane 2**) with independent states and lifecycle locks (`BUILDING` vs `FIXED`).
5. Offer headless semantic execution (`CommandDispatcher`) and pure read-only observation DTOs (`GeometryStateSnapshot`) for AI agents.
6. Provide full multi-language UI normalization (**RU / UA / EN**) backed by semantic terminology alignment with persistent user preference storage.
7. Export and import portable semantic geometric passports (`.pgs.json`) according to the **PGS-2D Specification (Schema v0.1, Transfer Mode: EXACT_STATE)**.

---

## 4. Architectural Dual Passport Model

In CQNS-001, `UniversalGeometryState` is the single source of truth for geometry. The system projects two complementary passport views:

```text
                    CQNS UNIVERSAL GEOMETRY STATE
                                 │
                      ┌──────────┴──────────┐
                      ▼                     ▼
               CQNS Geometry          PGS Gateway
                 Passport                  │
                      │                    ▼
                internal view       PGS-2D Passport
                      │                    │
                CQNS Stand Scope    ┌──────┴──────┐
                                    ▼             ▼
                               UI inspection   .pgs.json
                                                   │
                                                   ▼
                                         Other Stand / AI Agent
```

### 1. CQNS Geometry Passport
* **Role:** Internal, stand-specific view of current geometry.
* **Scope:** CQNS domain metadata (`CYCLIC` profile), preset origins, internal `TopologyGuard` reports, DRA research facts, and internal state parameters.
* **Question Answered:** *"What does this specific CQNS Stand know about the current object?"*

### 2. PGS-2D Portable Passport
* **Role:** Standardized, portable semantic exchange artifact (`.pgs.json`).
* **Scope:** Schema version `0.1`, transfer mode `EXACT_STATE`, stable portable identifiers (`portableId`), topological boundaries, relations, measurements, source verification claim, and receiver verification status.
* **Question Answered:** *"How do we transfer this geometric state to another Stand, AI Agent, or CAD software without losing semantic meaning?"*

> **Transfer Mode Notice:** The current PGS Gateway implementation operates strictly in `EXACT_STATE` mode. Full `CONSTRUCTIVE_STATE` DAG history replay is not implemented in Schema 0.1 and is explicitly not claimed as implemented.

---

## 5. Core Constitutional Principle

> **AGENT MAY BE WRONG. THE STAND MUST NOT.**

The stand enforces a strict architectural boundary:
* **Mathematical Truth & Invariants (`GeometryCore` / `UniversalGeometryState`):** Coordinates, metrics, and invariants are computed purely and immutably.
* **Construction Lineage (Auxiliary DAG):** Every constructed point, segment, line, circle, and intersection maintains strict provenance and parenting in an acyclic graph.
* **Observation Layer:** Pure read-only projections (`GeometryStateSnapshot`, `GeometryResearchTable`) expose observations without mutating state.
* **Agent Epistemic Boundary:** Hypotheses and agent interpretations are strictly separated from tool-verified mathematical facts via the **Deterministic Reasoning Anchor (DRA)**.

---

## 6. Intersection Mode: On-Demand Semantic Contract

The stand enforces a clear semantic distinction between transient visual observations and persistent geometric constructions:

1. **On-Demand Interaction:** Intersection Mode does **not** globally clutter the canvas with pre-rendered markers. Instead, candidates are revealed dynamically via **cursor-proximity interaction** ($\le 12\text{ mm}$ snap radius).
2. **Transient Observation vs. Mutation:** The candidate indicator (`◇ intersection candidate`) is a transient visual hint. Hovering over an intersection does **not** mutate `GeometryState` or pollute the DAG.
3. **Semantic Materialization:** Clicking on an active candidate executes `CONSTRUCT_INTERSECTION`, creating a first-class `AuxiliaryPoint` with:
   - Unique ID ($I_1, I_2, I_3, \dots$)
   - Type `intersection`
   - Explicit parent IDs (`parentIds: [segA_id, segB_id]`)
   - Full DAG lineage and dynamic tracking across parent deformations.
4. **Clean OFF State:** When Intersection Mode is `OFF`, candidate generation is completely disabled, ensuring zero candidate interference during standard drafting.

### Intersection Fallback for Agents

> **INTERSECTION FALLBACK:**  
> If an agent needs to mark an intersection point while Intersection Mode is disabled or unavailable, the agent may use the standard `POINT` tool (`CONSTRUCT_POINT`) to place a point at the visual intersection coordinate.  
> **Crucial Semantic Invariant:** A `POINT` placed at an intersection coordinate is **not** semantically identical to an `INTERSECT` construction. An ordinary point has $0$ or $1$ parent and will not dynamically update when intersecting lines move; an `INTERSECT` point has $2$ parents and tracks dynamic deformations. The `POINT` fallback must remain an explicit geometric construction and must never be used as an arbitrary coordinate injection (**NO MAGIC GEOMETRY**).

---

## 7. Two Levels of Agent Operation

The stand documents two distinct operating levels for autonomous agents:

* **Level A — Semantic Construction:** Direct dispatch of high-level semantic commands (`INTERSECT`, `CONSTRUCT_POINT`, `CONSTRUCT_SEGMENT`, `CONSTRUCT_DIAGONAL`, `CONSTRUCT_PARALLEL`, `CONSTRUCT_TANGENT`).
* **Level B — Human-Equivalent Fallback:** When a specialized semantic shortcut is not directly exposed, the agent can accomplish the same geometric task through a valid user-equivalent sequence of primitive tools without violating construction semantics.

---

## 8. Status Matrix

| Feature / Subsystem | Status | Verification Evidence |
| :--- | :--- | :--- |
| **Basic Geometry Kernel** | `VERIFIED` | 27 regression test suites (`geometryState.test.ts`, `domainProfiles.test.ts`, etc.) |
| **Auxiliary Constructions** | `VERIFIED` | Segment, Line, Circle, Parallel, Perpendicular, Bisector verified in tests and desktop browser |
| **Measurement & Invariants** | `VERIFIED` | Ruler, Ptolemy, Area metrics verified in `areaMeasurementRegression.test.ts` and UI |
| **Composability** | `VERIFIED` | Using constructed points/intersections as parents for new segments verified in tests and UI |
| **Intersection Mode (On-Demand)** | `VERIFIED` | Hover snap and click materialization verified in `sequentialIntersection.test.ts` and desktop UI |
| **Dynamic Intersection Tracking** | `VERIFIED` | Coordinate update across deformation with preserved IDs verified in Test E |
| **Single-Click Diagonal Tool** | `VERIFIED` | AC/BD construction verified in `commandDispatcher.test.ts` and desktop browser |
| **Eraser / Construction Undo (LIFO)** | `VERIFIED` | Cascading DAG removal and LIFO history rollback verified in tests and desktop browser |
| **Two-Plane Research Workspaces** | `VERIFIED` | Independent states and P1 $\to$ P2 clone verified in `tangentAndPlaneClone.test.ts` |
| **Plane 2 FIXED Lifecycle Lock** | `VERIFIED` | `PLANE_FIXED_READ_ONLY` mutation rejection verified in tests and desktop UI |
| **Research Workflow & Checkpoints** | `VERIFIED` | 3-slot CheckpointBuffer and snapshots verified in `checkpointBufferRegression.test.ts` |
| **Education Panel & DRA** | `VERIFIED` | 12-step checklist cards and DRA heuristics verified in `researchGuide.test.ts` and UI |
| **Localization (RU / UA / EN)** | `VERIFIED` | Multi-language normalization via `translations.ts` and `localStorage` verified in desktop browser |
| **Dockable Toolbar (LEFT/RIGHT/BOTTOM)**| `VERIFIED` | Viewport bounds and dynamic re-docking verified in desktop browser |
| **PGS-2D Gateway & Codec** | `VERIFIED` | `pgsGateway.test.ts` & `e2ePgsExperiment.test.ts` (100% round-trip success) |
| **PGS Passport Dual-View UI** | `VERIFIED` | `PassportPanel.tsx` `[CQNS STATE]` / `[PGS-2D]` tabs verified in `pgsPassportIntegration.test.ts` |
| **Project Menu PGS Export** | `VERIFIED` | HeaderBar Project dropdown `Export PGS-2D Passport (.pgs.json)` verified |
| **Agent Interface Adapter** | `PARTIAL` | Headless execution verified in `agentInterface.test.ts`; autonomous closed-loop audit pending |
| **Mobile / Touch Dragging** | `NOT TESTED` | Touch gestures and small viewport ergonomics require physical mobile device testing |

---

## 9. Test Fixtures & Reproducibility Artifacts

The repository contains pre-generated, verified `.pgs.json` passport fixtures:
* `TEST_01_BASIC_CYCLIC_QUADRILATERAL.pgs.json` — Symmetric cyclic square passport ($R=160\text{ mm}$, 4 vertices, circumcircle).
* `TEST_02_ASYMMETRIC_CYCLIC_QUADRILATERAL.pgs.json` — Deformed cyclic quadrilateral passport with non-uniform side lengths.
* `TEST_03_RICH_CYCLIC_QUADRILATERAL.pgs.json` — Cyclic quadrilateral passport with auxiliary chords, diagonals, and measurements.
* `TEST_04_CORRUPTED_PASSPORT.pgs.json` — Invalid passport for validation rejection testing.
* `cqns-001-pgs-passport.pgs.json` — Direct project export passport artifact.

---

## 10. Verification Commands

```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript strict typecheck (zero errors)
npm run lint

# 3. Run all 27 automated regression test suites
npm test

# 4. Run End-to-End PGS-2D Round-Trip Experiment
npx tsx remix2/tests/e2ePgsExperiment.test.ts

# 5. Compile production bundle
npm run build:r2

# 6. Start development server on port 3000
npm run dev:r2
```
