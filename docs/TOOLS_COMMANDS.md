# Tools & Semantic Commands Reference

**Status:** Living Architectural Specification (Remix 3 / CQNS-001)

---

## 1. Overview

The **CQNS-001 Stand** operates through a unified, headless command architecture. Both human UI interactions and autonomous agent interactions dispatch `SemanticCommand` DTOs through the `CommandDispatcher`.

---

## 2. Command Index

| Command Type | Action Description | Core Inputs | Target Output | Provenance DAG Lineage |
| :--- | :--- | :--- | :--- | :--- |
| `SELECT` | Vertex drag / entity selection | `entityId`, `position` | Updated vertex position | Canonical vertex mutation |
| `CONSTRUCT_POINT` | Create point (free, on chord, on circle) | `pointType`, `coords`, `parentId` | Auxiliary Point (`AuxPoint`) | `['circle_main']` or `[parentId]` |
| `CONSTRUCT_SEGMENT` | Connect 2 points | `p1Id`, `p2Id` | Auxiliary Segment (`AuxSegment`) | `[p1Id, p2Id]` |
| `MEASURE_DISTANCE` | Measure distance between 2 points | `p1Id`, `p2Id` | Auxiliary Measurement | `[p1Id, p2Id]` |
| `CONSTRUCT_COMPASS` | Construct circle by center & radius | `centerPointId`, `radiusPointId` / `radius` | Auxiliary Circle (`AuxCircle`) | `[centerPointId, radiusPointId]` |
| `CONSTRUCT_LINE` | Construct infinite line through 2 points | `p1Id`, `p2Id` | Auxiliary Line (`AuxLine`) | `[p1Id, p2Id]` |
| `CONSTRUCT_CIRCLE` | Construct circle through 2 points | `p1Id`, `p2Id` | Auxiliary Circle (`AuxCircle`) | `[p1Id, p2Id]` |
| `CONSTRUCT_PARALLEL` | Construct parallel line | `throughPointId`, `referenceSegmentId` | Auxiliary Line (`AuxLine`) | `[throughPointId, referenceSegmentId]` |
| `CONSTRUCT_PERPENDICULAR` | Construct perpendicular line | `throughPointId`, `referenceSegmentId` | Auxiliary Line (`AuxLine`) | `[throughPointId, referenceSegmentId]` |
| `CONSTRUCT_ANGLE_BISECTOR` | Construct angle bisector ray | `p1Id`, `p2Id`, `p3Id` | Auxiliary Line (`AuxLine`) | `[p1Id, p2Id, p3Id]` |
| `CONSTRUCT_DIAGONAL` | Construct quadrilateral diagonal | `vertexId` ($A, B, C, D$) | Auxiliary Segment ($AC$ or $BD$) | `[v1, v2]` |
| `CONSTRUCT_TANGENT` | Construct tangent line to $S^1$ | `pointId` ($P \in S^1$) | Auxiliary Line (`AuxLine`) | `['circle_main', pointId]` |
| `CONSTRUCT_INTERSECTION` | Materialize line/segment intersection | `entity1Id`, `entity2Id` | Auxiliary Intersection Point ($I_n$) | `[entity1Id, entity2Id]` |
| `ERASE_ENTITY` | Construction-aware deletion | `entityId` | Removed entity & descendents | Recursive DAG cleanup |

---

## 3. Intersection Mode: On-Demand Semantic Contract

* **On-Demand Discovery:** Intersection Mode does not automatically flood the screen with pre-rendered markers. Intersections are discovered **on-demand** through cursor-proximity interaction ($\le 12\text{ mm}$ snap radius).
* **Transient Observation:** When the cursor approaches within $12\text{ mm}$ of an intersection between two non-collinear segments/lines, the system presents an interactive candidate: `◇ intersection candidate`. This candidate is purely a transient UI observation; moving the cursor does **not** mutate `GeometryState` or the Construction DAG.
* **Semantic Materialization:** Clicking on an active candidate executes `CONSTRUCT_INTERSECTION`, materializing a first-class `AuxiliaryPoint` ($I_1, I_2, I_3, \dots$) with explicit parent IDs (`[entity1Id, entity2Id]`).
* **Dynamic Recomputation:** When either parent entity is deformed, the intersection coordinates are automatically recomputed via Kramer's rule, preserving the point's unique ID, label, and dependent child entities.
* **Clean State Isolation:** When Intersection Mode is `OFF`, candidate detection is completely bypassed, preventing interference with standard drawing operations.

---

## 4. Intersection Fallback for Agents

> ### INTERSECTION FALLBACK
> 
> Если необходимо выделить точку пересечения, а `Intersection Mode` не используется или недоступен, агент может воспользоваться обычным инструментом `POINT` (`CONSTRUCT_POINT`) и поставить точку в месте визуального пересечения.  
> 
> **Критическое семантическое правило:**  
> Точка `POINT`, поставленная в месте пересечения, и семантическая конструкция `INTERSECT` **НЕ являются тождественными операциями**:  
> 1. `POINT` имеет $0$ или $1$ родителя и не будет динамически следовать за пересекающимися прямыми при деформации фигуры.  
> 2. `INTERSECT` имеет ровно $2$ родительских объекта в DAG и динамически пересчитывает свои координаты при изменении родителей.  
> 
> Если исследовательская задача требует сохранения явной математической связи точки с родительскими объектами, обязателен `INTERSECT`. Fallback через `POINT` допустим как человеко-эквивалентный обходной путь, но **не должен превращаться в произвольную координатную инъекцию**.  
> 
> Сохраняется фундаментальный принцип: **NO MAGIC GEOMETRY**.

---

## 5. Two Levels of Agent Operation

The stand documents two formal operating modes for autonomous agents:

1. **Level A — Semantic Construction:**
   Direct execution of high-level semantic primitives (`INTERSECT`, `CONSTRUCT_POINT`, `CONSTRUCT_SEGMENT`, `CONSTRUCT_DIAGONAL`, `CONSTRUCT_PARALLEL`, `CONSTRUCT_TANGENT`). Each operation validates topological preconditions and emits structured success/failure observations.

2. **Level B — Human-Equivalent Fallback:**
   If a specific semantic command shortcut is unavailable or disabled, the agent is permitted to execute the task through a valid sequence of standard user tools (e.g. constructing an auxiliary point via `CONSTRUCT_POINT` followed by `CONSTRUCT_SEGMENT`).
   
   **Core Rule:** *An agent should be able to accomplish the same geometric task through a valid user-equivalent workflow without violating construction semantics.*

---

## 6. Verification Status

- **Automated Regression Suites (24 suites):** `PASSED`
- **Build & Strict Typecheck:** `PASSED`
- **Desktop UI Manual Verification:** `VERIFIED` across core tools (Point, Segment, Diagonal, Tangent, Eraser, Undo, and On-Demand Intersection).
- **Mobile Touch Interaction:** `NOT TESTED`
