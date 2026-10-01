# Architectural Decision Records (ADR)

**Status:** Living Architectural Record

This document records the foundational architectural decisions governing Geometry Reasoning Stand 2 (Remix 2). These decisions are immutable constraints for future packages and implementations.

---

## ADR-001 — Remix 2 is Architecturally Independent from Remix 1

* **Status:** ACCEPTED / FROZEN
* **Context:** Remix 1 (`/src`) is a mature, production-grade interactive stand for the cyclic quadrilateral (CQNS-001). However, its codebase contains tight coupling between UI widgets, canvas rendering, and classical theorem evaluations.
* **Decision:** Remix 2 (`/remix2`) is implemented as an independent, clean-slate architecture. It does not import or depend on Remix 1 modules.
* **Reason:** Remix 1 serves as a behavioral and experimental reference benchmark. Rebuilding the kernel independently ensures zero legacy coupling and enables a genuinely universal geometry engine.

---

## ADR-002 — GeometryState is the Single Source of Truth

* **Status:** ACCEPTED / FROZEN
* **Context:** Complex geometry applications often suffer when multiple layers (canvas, relation graphs, math libraries) hold disparate copies of point coordinates.
* **Decision:** `UniversalGeometryState` is the sole source of truth for geometric entities and their canonical parameters. All state updates produce an immutable, versioned snapshot (`stateVersion`).
* **Reason:** Guarantees deterministic state reproducibility and prevents race conditions between UI interaction, construction lineage, and verification passes.

---

## ADR-003 — Construction is not Verification

* **Status:** ACCEPTED / FROZEN
* **Context:** Creating a geometric object (such as a diagonal segment $AC$ or a circle through three points) is an operational construction action. It does not prove that a theorem holds.
* **Decision:** The Construction DAG records parent-child dependencies and operational lineage. It is strictly forbidden from asserting that a theorem or metric invariant is `VERIFIED`.
* **Reason:** Conflating operational existence with deductive mathematical proof breaks formal epistemics.

---

## ADR-004 — Verification Layer is the Epistemic Authority

* **Status:** ACCEPTED / FROZEN
* **Context:** Invariants such as supplementary opposite angles ($\angle A + \angle C = 180^\circ$) or Ptolemy's equality ($AC \cdot BD = AB \cdot CD + BC \cdot DA$) require numerical and symbolic evaluation against defined epsilon tolerances ($\epsilon_{\text{dist}}, \epsilon_{\text{angle}}$).
* **Decision:** `VerificationLayer` is the sole authority permitted to issue epistemic status tags (`VERIFIED`, `DERIVED`, `INVALID`, `VANISHED`).
* **Reason:** Centralizes numerical threshold management ($\epsilon$) and ensures facts in the system have cryptographic/contractual validity.

---

## ADR-005 — Relation Graph is Strictly Passive

* **Status:** ACCEPTED / FROZEN
* **Context:** A graph data structure could easily be tempted to compute line intersections or check circle tangencies on the fly.
* **Decision:** The Relation Graph is a passive storage ledger of facts authorized by Verification. It possesses zero computational authority and never runs math routines.
* **Reason:** Prevents circular dependencies, hidden side-effects, and redundant computation loops.

---

## ADR-006 — Research Layer is Isolated and Read-Only

* **Status:** ACCEPTED / FROZEN
* **Context:** Research modules (such as harmonic spectrum analysis, discrete Fourier transforms on vertex angles, and exploratory invariant discovery) perform speculative mathematical operations.
* **Decision:** The Research Layer operates strictly on read-only snapshots of the state. It cannot write back to `GeometryState` or alter epistemic relation statuses.
* **Reason:** Canonical geometric truth must remain pristine and unpolluted by exploratory research experiments.

---

## ADR-007 — Principle of "No Magic Geometry"

* **Status:** ACCEPTED / FROZEN
* **Context:** In procedural CAD systems, auxiliary geometric primitives are often created implicitly through invisible coordinate injection.
* **Decision:** Every geometric primitive in Remix 2 must have an explicit provenance tag and construction lineage. Entities cannot appear without declared geometric origin.
* **Reason:** Ensures complete auditability and reproducibility of geometric reasoning traces.

---

## ADR-008 — Canonical Order Matters

* **Status:** ACCEPTED / FROZEN
* **Context:** Normalizing a set of circular angles by automatically sorting them in ascending order can destroy the user's declared traversal sequence or polygon vertex labeling ($A \to B \to C \to D$).
* **Decision:** Parametric normalization must preserve the declared input sequence of vertices, tracking wrap-around boundaries explicitly rather than silently sorting.
* **Reason:** Preserves semantic identity of polygon edges and topological orientation.

---

## ADR-009 — UI Interaction Constraints are Not Topology

* **Status:** ACCEPTED / FROZEN
* **Context:** In canvas drag interactions, developers often place UI constraints (such as preventing a mouse pointer from coming within 15px of another point) directly into mathematical validation rules.
* **Decision:** `TopologyGuard` validates pure mathematical topology (non-coincidence, non-degeneracy, collinearity). UI drag thresholds and mouse clamping belong exclusively to the UI/SOL interaction layer.
* **Reason:** Prevents interactive UI ergonomics from artificially constraining mathematical theorem proofs.

---

## ADR-010 — Universal Architecture First, Domain Adapters Second

* **Status:** ACCEPTED / FROZEN
* **Context:** CQNS ($N=4$ cyclic quadrilateral) is the primary target. It would be easy to hardcode four vertices into every kernel class.
* **Decision:** The common kernel (state, topology, mesh, DAG, verification) is designed to handle arbitrary $N$-gons and both Cartesian and Cyclic profiles. Specific polygon behaviors are encapsulated in Domain Profiles and Adapters.
* **Reason:** Enables seamless addition of Triangle ($N=3$), Pentagon ($N=5$), Hexagon ($N=6$), and arbitrary polygons without redesigning the architecture.

---

## ADR-011 — Headless Semantic Command Dispatcher as Unified Machine Gateway

* **Status:** ACCEPTED / FROZEN
* **Context:** Both human UI interactions (mouse dragging, tool selection) and autonomous AI agents require a unified, deterministic execution gateway to mutate state and construct geometry without browser or canvas dependencies.
* **Decision:** All operational actions are formalized as discriminated `SemanticCommand` DTOs and routed through `dispatchSemanticCommand(command, context)`. The dispatcher executes mutations against `TopologyGuard`, records provenance, and automatically triggers dynamic DAG recalculations.
* **Reason:** Guarantees 100% feature parity between human UI and headless autonomous agents in CI/CD or background scripts.

---

## ADR-012 — Headless State Snapshot Projection Layer (`GeometryStateSnapshot`)

* **Status:** ACCEPTED / FROZEN
* **Context:** Machine agents and research modules require serializable, immutable, full-state observations of canonical parameters, coordinates, DAG lineage, and area metrics without coupling to viewport rendering structures.
* **Decision:** Implement `createGeometryStateSnapshot(geoState, auxState)` as a pure projection function emitting `GeometryStateSnapshot`. Snapshots contain strictly raw observations and perform no speculative theorem proving.
* **Reason:** Decouples observation data export from active state structures, providing a stable contract for external analysis datasets.

---

## ADR-013 — 3-Slot Operational Return Memory (`CheckpointBuffer v0.1`)

* **Status:** ACCEPTED / FROZEN
* **Context:** Autonomous agents exploring geometric parameter spaces require fast, memory-safe return points (e.g. Baseline, Control, Branch) without saving full undo trees or polluting external snapshot logs.
* **Decision:** Implement `CheckpointBuffer` providing strictly 3 isolated memory slots (`1 | 2 | 3`). Restoring a checkpoint commits a restore mutation with monotonic `stateVersion` increment ($v_{restore} > v_{live}$) and provenance logging (`RESTORE_CHECKPOINT_1_FROM_V1`), dynamically recalculating the auxiliary DAG.
* **Reason:** Ensures operational return points do not break version monotonicity, causality, or references.

---

## ADR-014 — Agent Observation Utilities & Snapshot Diff as Pure Observation Layers

* **Status:** ACCEPTED / FROZEN
* **Context:** Autonomous agents need to query specific entity measurements, capture active snapshots, and compute mathematical deltas between two experimental states.
* **Decision:** Implement `GET_ACTIVE_SNAPSHOT` and `GET_ENTITY_MEASUREMENT` as read-only semantic commands, and `diffGeometrySnapshots(snapA, snapB)` as a pure DTO comparison function (subtraction $after - before$). These utilities are strictly forbidden from performing new geometric calculations or formula duplication.
* **Reason:** Preserves the foundational axiom: *Agent May Be Wrong. The Stand Must Not.* The stand provides raw verified facts; the agent interprets them.

---

## ADR-015 — Two-Plane Independent State Model (`PLANE_1` & `PLANE_2`)

* **Status:** ACCEPTED / IMPLEMENTED
* **Context:** Exploratory geometric research requires comparing live deformations with a fixed canonical reference benchmark without losing active work or causing state pollution.
* **Decision:** Encapsulate stand research sessions in a `ResearchSession` containing two completely isolated plane sessions (`plane1` and `plane2`). Plane 1 serves as the mutable experimental scratchpad. Plane 2 acts as a reference baseline that can transition to `FIXED`. When `FIXED`, mutations directed to Plane 2 are rejected with `PLANE_FIXED_READ_ONLY`, while Plane 1 remains fully mutable.
* **Reason:** Prevents accidental modification of baseline references during active deformation studies.

---

## ADR-016 — Point-First Universal Construction Protocol

* **Status:** ACCEPTED / IMPLEMENTED
* **Context:** Multi-step straightedge/compass tools (e.g. connecting a free point to a point on a chord or circle) previously suffered from orphan dynamic points and premature tool cancellation when attempting to pass segment IDs as endpoints.
* **Decision:** Implement universal two-phase point resolution (`resolveOrCreatePoint`):
  1. Points on chords/segments (`on_segment`) or circles (`on_circle`) are resolved and committed dynamically into `auxiliaryState.points` before segment or line creation.
  2. Construction commands consume strictly point IDs (`p1Id`, `p2Id`).
  3. If construction commitment fails, dynamic points are atomically rolled back (`rollbackDynamicPoint`).
* **Reason:** Guarantees zero orphan points, unambiguous entity references, and robust multi-step construction lifecycles.

---

## ADR-017 — Same-Stand Construction Clone via Topological DAG Remapping

* **Status:** ACCEPTED / IMPLEMENTED
* **Context:** Transferring constructions from Plane 1 to Plane 2 must reproduce the geometric construction without sharing mutable memory references or causing ID collisions.
* **Decision:** Implement `clonePlane1ToPlane2` using domain profile deep cloning and a topological DAG remapping ledger (`idMap`). Auxiliary objects receive independent Plane 2 IDs (`p2_pt_...`, `p2_seg_...`), and all parent references are remapped. If Plane 2 is `FIXED`, cloning is rejected.
* **Reason:** Preserves the Construction DAG and memory isolation without relying on visual/SVG scrapers.

---

## ADR-018 — Tangent Tool Semantics & Session Quantity UX Setting

* **Status:** ACCEPTED / IMPLEMENTED
* **Context:** Constructing tangents to the circumcircle $S^1$ requires clean mathematical semantics, and users often need to construct either 1 or 2 tangents in a focused workflow without endless active states.
* **Decision:** 
  1. Implement `CONSTRUCT_TANGENT` using pure perpendicularity ($\vec{u} \perp \vec{r}$) and DAG lineage `['circle_main', pointId]`.
  2. Implement an interactive tool quantity setting (`tangentQuantity: 1 | 2`, default `1`): Mode 1 completes immediately after 1 tangent; Mode 2 completes after 2 tangents.
  3. Pressing ESC after the 1st tangent in Mode 2 commits the 1st tangent and cancels only the pending 2nd operation.
* **Reason:** Delivers predictable, non-intrusive interactive ergonomics while adhering to strict geometric invariants.

---

## ADR-019 — Decoupling Human UI Capabilities from Agent Access Audits

* **Status:** ACCEPTED / IMPLEMENTED
* **Context:** Introducing new UI controls (such as tool quantity toggles or UI clone buttons) creates a risk that external reasoning engines assume autonomous agents automatically possess equivalent headless capabilities.
* **Decision:** Maintain a strict epistemic distinction between Human UI Path and Agent Path. Capabilities implemented in UI components remain marked as `NOT YET AGENT-AUDITED` until corresponding headless agent integration test scenarios are formally executed and verified.
* **Reason:** Preserves the Prime Constitutional Axiom and prevents hallucinated agent capabilities during external model reviews.

---

## ADR-020 — AAM Language Kernel & Semantic Gateway Integration

* **Status:** ACCEPTED / IMPLEMENTED
* **Context:** The stand requires full multi-language normalization (`RU`, `UA`, `EN`) across UI shells, analytical tables, structural passports, educational checklist cards, theorem proofs, and modal dialogs with persistent language memory across sessions.
* **Decision:**
  1. Centralize language dictionaries in `translations.ts` and expose a unified getter `getTranslation(language)`.
  2. Implement `getSavedLanguage()` and `saveLanguagePreference(lang)` using browser `localStorage` (`cqns_language_preference`) with safe fallback to `'RU'`.
  3. Pass `language` down through `UIState` to all panels (`SummaryTablePanel`, `PassportPanel`, `AAMGatewayPanel`, `EducationPanel`, `GeometryResearchTable`, `NumericAnglesModal`, `ResearchPlaneControls`).
  4. Fully localize the 12-step Agent Research Checklist and DRA Heuristic cards in `RU`, `UA`, and `EN`.
* **Reason:** Guarantees language normalization, semantic consistency across all research panels, and user preference persistence without breaking mathematical core immutability.


