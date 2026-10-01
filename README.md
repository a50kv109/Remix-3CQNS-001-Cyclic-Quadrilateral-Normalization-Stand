# CQNS-001 Cyclic Quadrilateral Normalization Stand

[![Remix 2 Core](https://img.shields.io/badge/Architecture-Remix%202%20Kernel-purple.svg)](./remix2)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](./tsconfig.json)
[![Tests](https://img.shields.io/badge/Regression%20Suites-23%20Passing-emerald.svg)](./remix2/tests)

## Overview

**CQNS-001 Cyclic Quadrilateral Normalization Stand** (Remix 2) is an interactive and automated geometric reasoning, parametric exploration, invariant analysis, and dynamic construction environment.

The system is designed for both human researchers and autonomous AI agents working with cyclic quadrilateral ($N=4$) geometry in a circumcircle $S^1$.

---

## Forensic Verification & Build Status

* **TypeScript Typecheck (`npm run lint`):** `PASSED` (Zero errors)
* **Automated Test Suites (`npm run test`):** `PASSED` (23 regression test suites passing)
* **Production Build (`npm run build`):** `PASSED`
* **UI / Browser Interactive Verification:** `NOT BROWSER VERIFIED` (Requires manual browser UI testing)

---

## Purpose

The stand provides a deterministic environment to:
1. Construct and manipulate cyclic quadrilaterals with concyclic vertices $A, B, C, D$ on a reference circumcircle $S^1$ centered at $O(0,0)$ with radius $R$.
2. Execute straightedge & compass auxiliary constructions (segments, lines, circles, parallel/perpendicular lines, angle bisectors, tangents, diagonals, and line/segment intersections).
3. Track structural topology and invariants (opposite angle sums $\angle A + \angle C = 180^\circ$, Ptolemy's theorem $AC \cdot BD = AB \cdot CD + BC \cdot DA$, area metrics $S_{circle}, S_{quad}, S_{gap}$).
4. Provide a dual-plane research workspace (**Plane 1 / Plane 2**) for comparative geometric experiments.
5. Offer headless semantic execution (`CommandDispatcher`) and pure read-only observation DTOs (`GeometryStateSnapshot`) for AI agents.
6. Provide full multi-language UI normalization (**RU / UA / EN**) backed by the **AAM Language Gateway** with persistent user preference.

---

## Core Constitutional Principle

> **AGENT MAY BE WRONG. THE STAND MUST NOT.**

The stand enforces a strict architectural boundary:
* **Mathematical Truth & Invariants (`GeometryCore` / `UniversalGeometryState`):** Coordinates, metrics, and invariants are computed purely and immutably.
* **Construction Lineage (Auxiliary DAG):** Every constructed point, segment, line, circle, and intersection maintains strict provenance and parenting in an acyclic graph.
* **Observation Layer:** Pure read-only projections (`GeometryStateSnapshot`, `GeometryResearchTable`) expose observations without modifying state.
* **Agent Epistemic Boundary:** Hypotheses and agent interpretations are strictly separated from tool-verified mathematical facts via the **Deterministic Reasoning Anchor (DRA)**.

---

## Architecture Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CQNS-001 Architecture                           │
│                                                                        │
│   [Human UI]           [Autonomous AI Agent]     [AAM Language Kernel] │
│   (RU/UA/EN)                     │                (Semantic Gateway)   │
│        │                         │                        │            │
│        └─────────────────────────┼────────────────────────┘            │
│                                  ▼                                     │
│                     [SemanticCommand Protocol]                         │
│                                  │                                     │
│                                  ▼                                     │
│                       [CommandDispatcher]                              │
│                                  │                                     │
│                 ┌────────────────┴────────────────┐                    │
│                 ▼                                 ▼                    │
│     [UniversalGeometryState]          [AuxiliaryState / DAG]           │
│     - Immutable Kernel                - Straightedge & Compass         │
│     - Versioned & Deep-Frozen         - Dynamic Vertex Tracking        │
│     - TopologyGuard                   - Automatic Recomputation        │
│                 │                                 │                    │
│                 └────────────────┬────────────────┘                    │
│                                  ▼                                     │
│               [Observation & Research Session Layer]                   │
│               - Two-Plane Workspace (Plane 1 / Plane 2)                │
│               - 3-Slot Checkpoint Buffer (Return Points)               │
│               - GeometryStateSnapshot & Research Table                 │
│               - Agent Research Guide & DRA Heuristics                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Geometry Domain

* **Domain Target:** Canonical Cyclic Quadrilateral ($N = 4$ concyclic vertices on circumcircle $S^1$)
* **Canonical Vertices:** $A, B, C, D$ ordered cyclically counterclockwise.
* **Center & Radius:** Center $O(0,0)$, $R = 160\text{ mm}$ (academic scale $1\text{ px} = 1\text{ mm}$).
* **Initial Scene:** Contains circumcircle $S^1$, center $O$, four vertices $A, B, C, D$, four sides $AB, BC, CD, DA$, and zero initial diagonals (diagonals appear only via explicit construction).

---

## Geometry Tools & Semantic Commands

The stand features canonical tools powered by a unified headless `CommandDispatcher`:

1. **Select (`SELECT`):** Select entities or drag canonical vertices $A, B, C, D$.
2. **Point (`CONSTRUCT_POINT`):** Create free, snapped-to-circle, or snapped-to-segment points.
3. **Segment (`CONSTRUCT_SEGMENT`):** Connect two points with a segment using Point-First resolution.
4. **Ruler (`MEASURE_DISTANCE`):** Measure distance between two points in mm.
5. **Compass (`CONSTRUCT_COMPASS`):** Anchor needle and set leg span to draw circles.
6. **Line / Circle (`CONSTRUCT_LINE`, `CONSTRUCT_CIRCLE`):** Construct infinite lines or center-radius circles.
7. **Parallel (`CONSTRUCT_PARALLEL`):** Construct a line through a point parallel to a reference segment.
8. **Perpendicular (`CONSTRUCT_PERPENDICULAR`):** Construct a line through a point perpendicular to a reference segment.
9. **Angle Bisector (`CONSTRUCT_ANGLE_BISECTOR`):** Bisect an angle defined by 3 points.
10. **Diagonal (`CONSTRUCT_DIAGONAL`):** Single-click vertex selection automatically constructs diagonal to opposite vertex ($A \leftrightarrow C$, $B \leftrightarrow D$).
11. **Tangent (`CONSTRUCT_TANGENT`):** Construct tangent line to $S^1$ at a selected point (supports 1 | 2 batch quantity modes).
12. **Intersection (`CONSTRUCT_INTERSECTION`):** Detect and materialize line-line and segment-segment intersection points ($I_1, I_2, I_3$ namespace).
13. **Eraser (`ERASE_ENTITY`):** Construction-aware entity deletion with dependency DAG cleanup (protecting canonical vertices $A, B, C, D$, center $O$, and circumcircle $S^1$).

---

## Key Research & Localization Features

* **Construction Undo (LIFO):** Dedicated Undo button with pre-command snapshots, atomic rollback, and isolation from non-construction UI state changes.
* **Construction-Aware Eraser:** Recursively removes selected objects and their dependent construction-owned children while preserving shared or canonical objects.
* **Dockable Toolbar:** Floating tool palette configurable to `LEFT`, `RIGHT`, or `BOTTOM` positions with safe-area bounds.
* **Two-Plane Research Session:** Independent `Plane 1` and `Plane 2` workspaces with `BUILDING` and `FIXED` lifecycle locks.
* **AAM Language Kernel & Semantic Gateway (RU / UA / EN):** Integrated multi-language gateway driven by `translations.ts` and `getSavedLanguage` / `saveLanguagePreference` storing user preference in `localStorage` (`cqns_language_preference`).
* **Complete Panel Localization:** Full 3-language translation across all UI panels:
  - Summary Table Panel
  - Structural Passport Panel
  - AAM Gateway Panel
  - Education Panel (including the 12-step Agent Research Checklist and DRA Heuristics)
  - Geometry Research Table
  - Numeric Angles Modal
  - Research Plane Controls
* **Agent Research Checklist:** 12-step research protocol (Question, Object, Variable, Construction, Measurement, Relation, Parameter Sweep, Pattern, Hypothesis, Counterexample, Next Experiment, Epistemic Status) with localized explanations for RU, UA, and EN.
* **Deterministic Reasoning Anchor (DRA):** Methodological heuristic defining boundaries between tool-verified facts, agent interpretations, and hypotheses.

---

## Current Status Matrix

| Feature / Subsystem | Code Status | Verification Status |
| :--- | :--- | :--- |
| Universal Geometry Kernel (`GeometryCore`) | `IMPLEMENTED` | `PASSED` (23 Test Suites) / **NOT BROWSER VERIFIED** |
| Headless Command Dispatcher | `IMPLEMENTED` | `PASSED` (Automated Test) / **NOT BROWSER VERIFIED** |
| Construction Undo (LIFO) | `IMPLEMENTED` | **NOT BROWSER VERIFIED** |
| Construction-Aware Eraser | `IMPLEMENTED` | **NOT BROWSER VERIFIED** |
| Dockable Toolbar (LEFT/RIGHT/BOTTOM) | `IMPLEMENTED` | **NOT BROWSER VERIFIED** |
| Single-Click Semantic Diagonal Tool | `IMPLEMENTED` | **NOT BROWSER VERIFIED** |
| Intersection Research Mode | `IMPLEMENTED` | **NOT BROWSER VERIFIED** |
| Two-Plane Research (Plane 1 / Plane 2) | `IMPLEMENTED` | `PASSED` (Automated Test) / **NOT BROWSER VERIFIED** |
| Language Switcher (RU / UA / EN) & Persistence | `IMPLEMENTED` | `PASSED` (Build & Typecheck) / **NOT BROWSER VERIFIED** |
| Education Panel & 12-Step Checklist | `IMPLEMENTED` | `PASSED` (Automated Test) / **NOT BROWSER VERIFIED** |
| Line × Circle / Circle × Circle Intersections | `PARTIAL` | **NOT BROWSER VERIFIED** (Math in core, UI materialization pending) |
| Mobile Touch Dragging | `PARTIAL` | **NOT BROWSER VERIFIED** |

---

## Project Documentation Index

Detailed architectural documentation is available in [`/docs`](./docs):

* **[Architecture (`docs/ARCHITECTURE.md`)](./docs/ARCHITECTURE.md):** Layered hierarchy, kernel immutability, DAG recomputation, and plane isolation.
* **[Tools & Commands (`docs/TOOLS_COMMANDS.md`)](./docs/TOOLS_COMMANDS.md):** Reference for all semantic construction commands, inputs, outputs, and provenance.
* **[Localization (`docs/LOCALIZATION.md`)](./docs/LOCALIZATION.md):** RU/UA/EN language gateway, `translations.ts` structure, and `localStorage` persistence contracts.
* **[Research Workspace (`docs/RESEARCH.md`)](./docs/RESEARCH.md):** Two-plane research sessions, 12-step Agent Research Checklist, and DRA heuristics.
* **[Verification & Testing (`docs/VERIFICATION.md`)](./docs/VERIFICATION.md):** 23 regression test suites, typecheck procedures, and manual browser verification protocol.
* **[Architectural Decisions (`docs/DECISIONS.md`)](./docs/DECISIONS.md):** Architectural Decision Records (ADR-001 through ADR-020).

---

## Getting Started & Scripts

```bash
# Install dependencies
npm install

# Run Vite development server (Port 3000)
npm run dev

# Run TypeScript type check
npm run lint

# Run all 23 regression test suites
npm run test

# Build production bundle
npm run build
```
