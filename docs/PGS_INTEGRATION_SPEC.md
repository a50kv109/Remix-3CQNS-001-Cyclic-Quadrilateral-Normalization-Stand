# PGS-2D / CQNS-001 — Portable Geometric State Specification & Pre-Release Freeze

**Document Version:** 1.0.0  
**Target Schema:** PGS-2D Schema Version `0.1`  
**Supported Transfer Mode:** `EXACT_STATE`  
**Stand Implementation:** CQNS-001 Cyclic Quadrilateral Normalization Stand (Remix 3)  
**Status:** Pre-Release Specification & Repository Freeze for Independent Evaluation  

---

## 1. Executive Summary

This document defines the architectural specification, data contract, dual passport model, and experimental evidence for the integration of the **PGS-2D Portable Geometric State Gateway** into **CQNS-001 (Remix 3)**.

The objective of this integration is to enable lossless semantic geometric state exchange between CQNS-001, external geometry stands, AI reasoning agents, CAD tools, and visualization adapters (e.g. Blender).

---

## 2. Universal State Pipeline & Architectural Flow

The `UniversalGeometryState` (+ `AuxiliaryState`) serves as the single immutable Source of Truth. The stand projects two decoupled passport views from this underlying state:

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

---

## 3. Dual Passport Model

| Property / Aspect | CQNS Geometry Passport | PGS-2D Portable Passport |
| :--- | :--- | :--- |
| **Primary Scope** | Internal CQNS Stand state & diagnostics | Cross-stand portable semantic state |
| **Target Audience** | Human researcher on CQNS-001 | Foreign Stands, AI Agents, Blender, External Systems |
| **Format** | Dynamic React UI Panel | Standardized `.pgs.json` document |
| **Domain Info** | CQNS `CYCLIC` profile & preset provenance | Standardized `EUCLIDEAN_2D` domain metadata |
| **Identifiers** | CQNS internal IDs (`A`, `B`, `C`, `D`, `circle_S1`) | Stable portable IDs (`pt_A`, `pt_B`, `circ_S1`, `poly_1`) |
| **Verification** | Live `TopologyGuard` report & DRA heuristics | Source verification claim + Receiver verification |
| **Invariants Covered** | Ptolemy relation, opposite angle sum, area metrics | Topological relations, incident boundaries, concyclicity |

---

## 4. PGS-2D Schema 0.1 Data Contract Mapping

The exported `.pgs.json` passport conforms to the following schema contract:

```json
{
  "schemaVersion": "0.1",
  "passportId": "TEST_01_BASIC_CYCLIC_QUADRILATERAL",
  "generator": "CQNS GeometryCore v0.1",
  "timestamp": "2026-10-02T10:00:00.000Z",
  "transferMode": "EXACT_STATE",
  "domain": {
    "domainType": "EUCLIDEAN_2D",
    "profile": "CYCLIC",
    "units": "mm",
    "referenceCircle": {
      "center": [0, 0],
      "radius": 160
    }
  },
  "objects": [
    {
      "portableId": "pt_A",
      "type": "point",
      "role": "primary",
      "label": "A",
      "cartesian": [113.13708498984761, 113.1370849898476]
    },
    {
      "portableId": "circ_S1",
      "type": "circle",
      "role": "reference",
      "label": "S¹",
      "geometry": {
        "center": [0, 0],
        "radius": 160
      }
    },
    {
      "portableId": "poly_4",
      "type": "polygon",
      "role": "primary",
      "label": "Polygon(4)",
      "vertices": ["pt_A", "pt_B", "pt_C", "pt_D"]
    }
  ],
  "relations": [
    {
      "relationType": "concyclic",
      "targetIds": ["pt_A", "pt_B", "pt_C", "pt_D"],
      "referenceCircleId": "circ_S1"
    }
  ],
  "sourceClaim": {
    "verifiedBy": "CQNS-TopologyGuard & GeometryCore",
    "isConcyclic": true,
    "isValid": true
  }
}
```

---

## 5. Scope & Transfer Mode Rules

1. **`EXACT_STATE` Mode:** Fully implemented and verified. Reconstructs identical geometric objects, coordinates, topology, circumcircle, and diagonals on any target receiver stand.
2. **`CONSTRUCTIVE_STATE` Mode:** **NOT IMPLEMENTED.** Step-by-step DAG constructive history replay is not supported in schema 0.1 and is explicitly not claimed as implemented.

---

## 6. Pre-Release Test Fixtures & Experimental Results

The repository includes pre-generated `.pgs.json` test fixtures:

1. `TEST_01_BASIC_CYCLIC_QUADRILATERAL.pgs.json`: Standard symmetric square inscribed in circumcircle $R=160\text{ mm}$.
2. `TEST_02_ASYMMETRIC_CYCLIC_QUADRILATERAL.pgs.json`: Deformed cyclic quadrilateral with non-equal side lengths.
3. `TEST_03_RICH_CYCLIC_QUADRILATERAL.pgs.json`: Cyclic state with auxiliary chords, diagonals, and measurements.
4. `TEST_04_CORRUPTED_PASSPORT.pgs.json`: Structural corruption fixture used for error rejection validation.
5. `cqns-001-pgs-passport.pgs.json`: UI project menu export fixture.

### E2E Round-Trip Verification Results (`npx tsx remix2/tests/e2ePgsExperiment.test.ts`):
* **Test 1 (Basic Cyclic):** `ROUND_TRIP_SUCCESS` (Max coordinate deviation: `0.0000e+0 mm`)
* **Test 2 (Asymmetric Cyclic):** `ROUND_TRIP_SUCCESS` (Max coordinate deviation: `0.0000e+0 mm`)
* **Test 3 (Rich Auxiliary):** `ROUND_TRIP_SUCCESS` (Diagonals and auxiliary state fully restored)
* **Test 4 (Corrupted Passport):** `REJECTED_AS_EXPECTED` (Structural validation error caught correctly)

---

## 7. Verification & Audit Trail

```bash
# Typecheck (0 errors)
npm run lint

# All 27 regression suites (100% pass)
npm test

# E2E PGS Experiment (100% pass)
npx tsx remix2/tests/e2ePgsExperiment.test.ts

# Production build
npm run build:r2
```
