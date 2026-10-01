# Tools & Semantic Commands Reference

**Status:** Living Architectural Specification

---

## 1. Overview

The **CQNS-001 Stand** operates through a unified, headless command architecture. Both human UI interactions and autonomous agent commands dispatch `SemanticCommand` DTOs through the `CommandDispatcher`.

---

## 2. Command Index

| Command Type | Action Description | Core Inputs | Target Output | Provenance DAG Lineage |
| :--- | :--- | :--- | :--- | :--- |
| `SELECT` | Vertex drag / entity selection | `entityId`, `position` | Updated vertex position | Canonical vertex mutation |
| `CONSTRUCT_POINT` | Create point (free, chord, or circle) | `mode`, `coords`, `targetId` | Auxiliary Point (`AuxPoint`) | `['circle_main']` or `[segmentId]` |
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
| `CONSTRUCT_INTERSECTION` | Materialize line/segment intersection | `entity1Id`, `entity2Id` | Auxiliary Intersection Point | `[entity1Id, entity2Id]` |
| `ERASE_ENTITY` | Construction-aware deletion | `entityId` | Removed entity & descendents | Recursive DAG cleanup |

---

## 3. Point-First Universal Construction Protocol

To prevent orphan dynamic points or ID mismatches, multi-step tools execute via `resolveOrCreatePoint`:
1. **Dynamic Point Resolution:** If a user clicks on a segment or circle, an auxiliary point (`on_segment` or `on_circle`) is dynamically created first.
2. **Command Dispatch:** Construction commands consume strictly validated point IDs.
3. **Atomic Rollback:** If construction fails (e.g. self-connection), the dynamically resolved point is automatically rolled back.

---

## 4. Verification Status

- **Automated Test Suites (`commandDispatcher.test.ts`, `toolsAndAuxiliary.test.ts`):** `PASSED`
- **Build & Typecheck:** `PASSED`
- **Browser UI Manual Verification:** `NOT BROWSER VERIFIED`
