# Research Workspace & Agent Protocol Specification

**Status:** Living Architectural Specification

---

## 1. Overview

The research workspace provides structured methodologies and multi-plane isolation for geometric research, invariant exploration, and autonomous agent evaluation.

---

## 2. Multi-Plane Research Workspaces (Plane 1 & Plane 2)

The stand implements a dual-plane research architecture:

### A. Plane 1 (Experimental Plane)
- **Role:** Primary active workspace for human dragging, tool constructions, and agent experiments.
- **Mutability:** Always mutable.
- **State:** Independent `UniversalGeometryState` and `AuxiliaryState`.

### B. Plane 2 (Reference Plane)
- **Role:** Analytical baseline or target reference.
- **Lifecycle States:**
  - `BUILDING`: Accepting mutations and clones.
  - `FIXED`: Immutable reference. All mutation attempts targeting Plane 2 are rejected with `PLANE_FIXED_READ_ONLY`.

### C. Construction Clone (`PLANE 1 → PLANE 2`)
Executes `clonePlane1ToPlane2` using topological DAG remapping and independent entity IDs (`p2_pt_...`, `p2_seg_...`), preserving memory isolation between planes.

---

## 3. Agent Research Checklist (12-Step Protocol)

The stand includes a formal 12-step research heuristic protocol for scientific geometric investigation:

| Step | Name (EN / RU / UA) | Primary Objective |
| :---: | :--- | :--- |
| 1 | **QUESTION** / ВОПРОС / ПИТАННЯ | Formulate the target geometric question or invariant under investigation. |
| 2 | **OBJECT** / ОБЪЕКТ / ОБ'ЄКТ | Identify target geometric primitives (quadrilateral, chords, circles). |
| 3 | **VARIABLE** / ПЕРЕМЕННАЯ / ЗМІННА | Identify independent parameters (vertex angles, chord lengths). |
| 4 | **CONSTRUCTION** / ПОСТРОЕНИЕ / ПOБУДОВА | Execute straightedge & compass constructions to build test configurations. |
| 5 | **MEASUREMENT** / ИЗМЕРЕНИЕ / ВИМІРЮВАННЯ | Measure distances, angles, areas, and ratios. |
| 6 | **RELATION** / СВЯЗЬ / ВЫРАЖЕНИЕ | Derive algebraic relations or equality expressions ($AC \cdot BD = AB \cdot CD + BC \cdot DA$). |
| 7 | **PARAMETER SWEEP** / ВАРИАЦИЯ ПАРАМЕТРОВ / ВАРИАЦІЯ ПАРАМЕТРІВ | Deform vertices continuously to sweep parameter spaces. |
| 8 | **PATTERN** / ЗАКОНОМЕРНОСТЬ / ЗАКОНОМІРНІСТЬ | Observe invariant patterns or constant ratios across deformation. |
| 9 | **HYPOTHESIS** / ГИПОТЕЗА / ГІПОТЕЗА | Propose a formal geometric theorem or invariant hypothesis. |
| 10 | **COUNTEREXAMPLE** / КОНТРПРИМЕР / КОНТРПРИКЛАД | Test edge cases, degenerate configurations, or collinear vertices to find counterexamples. |
| 11 | **NEXT EXPERIMENT** / СЛЕДУЮЩИЙ ЭКСПЕРИМЕНТ / НАСТУПНИЙ ЕКСПЕРИМЕНТ | Design follow-up constructions or auxiliary entity additions. |
| 12 | **EPISTEMIC STATUS** / ЭПИСТЕМИЧЕСКИЙ СТАТУС / ЕПІСТЕМІЧНИЙ СТАТУС | Assign epistemic confidence (`VERIFIED`, `DERIVED`, `HYPOTHETICAL`, `INVALID`). |

---

## 4. Deterministic Reasoning Anchor (DRA)

The **DRA** establishes strict epistemic boundaries for human and autonomous reasoning:

1. **Tool-Verified Fact:** Numerical coordinates, distance measurements, angle sums, and area computations calculated by the kernel.
2. **Agent Interpretation:** Structural inferences or relational groupings proposed by an AI agent or human researcher.
3. **Agent Hypotheses:** Unproven geometric conjectures requiring formal verification or deductive proof.

---

## 5. Verification Status

- **Automated Regression Test Suite (`researchGuide.test.ts`):** `PASSED`
- **Build & Typecheck:** `PASSED`
- **Browser UI Manual Verification:** `NOT BROWSER VERIFIED`
