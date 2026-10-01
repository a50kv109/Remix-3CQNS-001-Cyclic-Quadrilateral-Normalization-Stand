# Research Workspace & Agent Protocol Specification

**Status:** Living Architectural Specification (Remix 3 / CQNS-001)

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

## 5. Agent Operating Protocol & Intersection Fallback

### A. Two Operating Levels for Agents
1. **Level A — Semantic Construction:**
   The agent executes explicit semantic operations (`INTERSECT`, `CONSTRUCT_POINT`, `CONSTRUCT_SEGMENT`, `CONSTRUCT_DIAGONAL`, etc.).
2. **Level B — Human-Equivalent Fallback:**
   If a specialized semantic shortcut is unavailable, the agent executes the task via a user-equivalent sequence of primitive tools. The resulting configuration must remain a valid geometric construction without violating construction semantics.

### B. Intersection Fallback Rule

> ### INTERSECTION FALLBACK:
> Если необходимо выделить точку пересечения, а `Intersection Mode` не используется или недоступен, агент может воспользоваться обычным инструментом `POINT` (`CONSTRUCT_POINT`) и поставить точку в месте визуального пересечения.  
> 
> **Критическое семантическое правило:**  
> Точка `POINT` в месте пересечения и семантическая конструкция `INTERSECT` **НЕ являются тождественными операциями**:  
> * Обычная точка `POINT` имеет $0$ или $1$ родителя и не обновляется динамически при деформации родительских линий;  
> * Семантическое пересечение `INTERSECT` имеет ровно $2$ родительских объекта в DAG и динамически отслеживает изменения геометрии.  
> 
> Если исследовательская задача требует сохранения явной математической связи точки с родительскими объектами, обязателен `INTERSECT`. Fallback через `POINT` допустим как человеко-эквивалентный обходной путь, но **не должен превращаться в произвольную координатную инъекцию**.  
> 
> Фундаментальный принцип: **NO MAGIC GEOMETRY**.

---

## 6. Verification Status

- **Automated Regression Test Suite (`researchGuide.test.ts`):** `PASSED`
- **Build & Static Typecheck:** `PASSED`
- **Desktop Browser UI Verification:** `VERIFIED` across research panels, checklist cards, and checkpoint buffers.
- **Mobile Touch Interaction:** `NOT TESTED`
