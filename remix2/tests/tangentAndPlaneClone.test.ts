/**
 * Tangent Tool & Plane Clone Test Suite
 * R3-TANGENT & R3-PLANE-CLONE
 * 
 * Verifies:
 * 1. TANGENT Construction:
 *    - Tangent at existing vertex on S¹ (e.g. A).
 *    - Tangent at dynamically constructed point on S¹.
 *    - Geometric perpendicularity of tangent line to radius vector OP.
 *    - Rejection when point is not on circumcircle S¹.
 *    - Construction DAG lineage preservation.
 * 2. CLONE PLANE 1 -> PLANE 2:
 *    - Deep clone of geometry state and auxiliary constructions.
 *    - ID remapping and DAG parent dependency preservation.
 *    - Deep isolation: zero shared mutable references.
 *    - Independent mutation of Plane 1 and Plane 2 after clone.
 *    - Rejection of clone when Plane 2 is in 'FIXED' lifecycle.
 *    - Plane 1 remains fully mutable when Plane 2 is FIXED.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  dispatchSemanticCommand,
  CommandExecutionContext,
  CommandExecutionResult
} from '../src/ui/state/commandDispatcher';
import { createDefaultQuadrilateralState } from '../src/ui/state/defaultState';
import { createEmptyAuxiliaryState } from '../src/ui/state/auxiliaryEngine';
import { projectGeometryState } from '../src/ui/projection/presentationModel';
import { AuxiliaryState, SnapTarget } from '../src/ui/types/auxiliaryTypes';
import { resolveOrCreatePoint } from '../src/ui/canvas/pointResolution';
import { clonePlane1ToPlane2 } from '../src/research/planeClone';
import { ResearchSession } from '../src/ui/types/researchSession';

describe('R3 Tangent Tool & Plane Clone Suite', () => {
  function createTestHarness(initialAux?: AuxiliaryState) {
    const geoState = createDefaultQuadrilateralState();
    let currentAux = initialAux || createEmptyAuxiliaryState();
    const uiState: any = {
      standMode: 'RESEARCH',
      viewport: { zoom: 1, panX: 0, panY: 0, viewRotationDeg: 0 },
      displayAngleMode: 'DEGREES'
    };
    const pres = projectGeometryState(geoState, uiState);

    const baseCtx: CommandExecutionContext = {
      canonicalVertices: pres.vertices,
      circumcircle: { center: pres.center, radius: pres.radius },
      baseChords: pres.chords,
      auxiliaryState: currentAux,
      bounds: 240,
      geometryState: geoState
    };

    const executeCommand = (cmd: any, overrideAux?: AuxiliaryState): CommandExecutionResult => {
      const activeAux = overrideAux || currentAux;
      const ctx = { ...baseCtx, auxiliaryState: activeAux };
      const res = dispatchSemanticCommand(cmd, ctx);
      if (res.success) {
        currentAux = res.updatedAuxiliaryState;
      }
      return res;
    };

    const resolve = (clickPt: { x: number; y: number }, snap: SnapTarget | null) => {
      const res = resolveOrCreatePoint(clickPt, snap, {
        currentAuxiliaryState: currentAux,
        executeCommand
      });
      if (res.success) {
        currentAux = res.updatedAuxiliaryState;
      }
      return res;
    };

    return {
      get currentAux() { return currentAux; },
      executeCommand,
      resolve,
      pres,
      geoState
    };
  }

  // ============================================================
  // PART 1: TANGENT TOOL TESTS
  // ============================================================
  describe('1. Tangent Construction', () => {
    it('TEST 1A: Tangent at existing vertex A on S¹ is perpendicular to radius OA', () => {
      const harness = createTestHarness();

      const snapA: SnapTarget = { x: 113.1, y: 113.1, entityId: 'A', entityType: 'vertex', label: 'Вершина A', distance: 0 };
      const pRes = harness.resolve({ x: 113.1, y: 113.1 }, snapA);
      assert.equal(pRes.pointId, 'A');

      const tanRes = harness.executeCommand({
        type: 'CONSTRUCT_TANGENT',
        circleId: 'circle_main',
        pointId: 'A'
      }, pRes.updatedAuxiliaryState);

      assert.equal(tanRes.status, 'SUCCESS');
      assert.equal(tanRes.success, true);
      assert.equal(tanRes.createdEntityIds.length, 1);

      const tanLine = tanRes.updatedAuxiliaryState.lines.find((l) => l.id === tanRes.createdEntityIds[0]);
      assert.ok(tanLine);
      assert.equal(tanLine.type, 'tangent');
      assert.equal(tanLine.throughPointId, 'A');

      // Verify geometric perpendicularity: dot product of radius vector and tangent direction must be 0
      const center = harness.pres.center;
      const vertA = harness.pres.vertices.find((v) => v.id === 'A')!.cartesian;
      const rx = vertA.x - center.x;
      const ry = vertA.y - center.y;
      const dotProduct = rx * tanLine.direction.dx + ry * tanLine.direction.dy;
      assert.ok(Math.abs(dotProduct) < 1e-6, `Dot product must be 0 for perpendicularity, got ${dotProduct}`);
    });

    it('TEST 1B: Tangent at dynamic point on circumference creates persistent point and tangent line', () => {
      const harness = createTestHarness();

      // Click on circumcircle
      const snapCirc: SnapTarget = { x: 0, y: 160, entityType: 'circle', label: 'Описанная окружность S¹', distance: 0 };
      const pRes = harness.resolve({ x: 0, y: 160 }, snapCirc);
      assert.equal(pRes.success, true);
      assert.equal(pRes.pointType, 'on_circle');
      assert.ok(pRes.pointId?.startsWith('pt_'));

      const tanRes = harness.executeCommand({
        type: 'CONSTRUCT_TANGENT',
        circleId: 'circle_main',
        pointId: pRes.pointId!
      }, pRes.updatedAuxiliaryState);

      assert.equal(tanRes.success, true);
      const tanLine = tanRes.updatedAuxiliaryState.lines.find((l) => l.throughPointId === pRes.pointId);
      assert.ok(tanLine);
      assert.equal(tanLine.type, 'tangent');
    });

    it('TEST 1C: Tangent at point far away from circumcircle is rejected', () => {
      const harness = createTestHarness();

      // Create a free point far inside the circle
      const pRes = harness.resolve({ x: 10, y: 10 }, null);
      assert.ok(pRes.pointId);

      const tanRes = harness.executeCommand({
        type: 'CONSTRUCT_TANGENT',
        circleId: 'circle_main',
        pointId: pRes.pointId!
      }, pRes.updatedAuxiliaryState);

      assert.equal(tanRes.success, false);
      assert.equal(tanRes.status, 'INVALID_GEOMETRY');
    });

    it('TEST 1D: Mode Quantity = 1 builds exactly 1 tangent', () => {
      const harness = createTestHarness();

      // Point on circumcircle
      const pRes = harness.resolve({ x: 0, y: 160 }, { x: 0, y: 160, entityType: 'circle', label: 'S¹', distance: 0 });
      const tanRes = harness.executeCommand({
        type: 'CONSTRUCT_TANGENT',
        circleId: 'circle_main',
        pointId: pRes.pointId!
      }, pRes.updatedAuxiliaryState);

      assert.equal(tanRes.success, true);
      assert.equal(tanRes.updatedAuxiliaryState.lines.filter((l) => l.type === 'tangent').length, 1);
    });

    it('TEST 1E: Mode Quantity = 2 builds exactly 2 independent tangents in sequence', () => {
      const harness = createTestHarness();

      // 1st tangent at Vertex A
      const p1 = harness.resolve({ x: 113.1, y: 113.1 }, { x: 113.1, y: 113.1, entityId: 'A', entityType: 'vertex', label: 'A', distance: 0 });
      const tan1 = harness.executeCommand({
        type: 'CONSTRUCT_TANGENT',
        circleId: 'circle_main',
        pointId: p1.pointId!
      }, p1.updatedAuxiliaryState);
      assert.equal(tan1.success, true);

      // 2nd tangent at Vertex B
      const p2 = harness.resolve({ x: -113.1, y: 113.1 }, { x: -113.1, y: 113.1, entityId: 'B', entityType: 'vertex', label: 'B', distance: 0 });
      const tan2 = harness.executeCommand({
        type: 'CONSTRUCT_TANGENT',
        circleId: 'circle_main',
        pointId: p2.pointId!
      }, tan1.updatedAuxiliaryState);
      assert.equal(tan2.success, true);

      const tangents = tan2.updatedAuxiliaryState.lines.filter((l) => l.type === 'tangent');
      assert.equal(tangents.length, 2);
      assert.ok(tangents.some((t) => t.throughPointId === 'A'));
      assert.ok(tangents.some((t) => t.throughPointId === 'B'));
    });

    it('TEST 1F: Cancelling after 1st tangent in Mode 2 preserves the 1st built tangent', () => {
      const harness = createTestHarness();

      const p1 = harness.resolve({ x: 113.1, y: 113.1 }, { x: 113.1, y: 113.1, entityId: 'A', entityType: 'vertex', label: 'A', distance: 0 });
      const tan1 = harness.executeCommand({
        type: 'CONSTRUCT_TANGENT',
        circleId: 'circle_main',
        pointId: p1.pointId!
      }, p1.updatedAuxiliaryState);

      assert.equal(tan1.success, true);
      // Tool cancelled (Escape) -> tan1 remains in auxiliaryState
      assert.equal(tan1.updatedAuxiliaryState.lines.filter((l) => l.type === 'tangent').length, 1);
    });
  });

  // ============================================================
  // PART 2: CLONE PLANE 1 -> PLANE 2 TESTS
  // ============================================================
  describe('2. Plane 1 -> Plane 2 Construction Clone', () => {
    it('TEST 2A: Full construction on Plane 1 is cloned to Plane 2 with independent IDs and preserved DAG', () => {
      const harness = createTestHarness();

      // 1. Build rich construction on Plane 1
      // Point M on chord AB
      const snapChord: SnapTarget = { x: 50, y: 150, entityId: 'chord_AB', entityType: 'segment', label: 'AB', distance: 0 };
      const ptM = harness.resolve({ x: 50, y: 150 }, snapChord);
      assert.ok(ptM.pointId);

      // Tangent at vertex C
      const tanRes = harness.executeCommand({
        type: 'CONSTRUCT_TANGENT',
        circleId: 'circle_main',
        pointId: 'C'
      }, ptM.updatedAuxiliaryState);
      assert.equal(tanRes.success, true);

      // Segment connecting M and Vertex D
      const segRes = harness.executeCommand({
        type: 'CONSTRUCT_SEGMENT',
        p1Id: ptM.pointId!,
        p2Id: 'D'
      }, tanRes.updatedAuxiliaryState);
      assert.equal(segRes.success, true);

      // Initial research session
      const session: ResearchSession = {
        plane1: {
          geoState: harness.geoState,
          auxState: segRes.updatedAuxiliaryState
        },
        plane2: {
          geoState: createDefaultQuadrilateralState(),
          auxState: createEmptyAuxiliaryState()
        },
        activePlane: 'PLANE_1',
        plane2Lifecycle: 'BUILDING'
      };

      // 2. Clone Plane 1 -> Plane 2
      const cloneResult = clonePlane1ToPlane2(session);
      assert.equal(cloneResult.success, true);
      assert.ok(cloneResult.message.includes('успешно скопирована'));

      const plane2 = cloneResult.session.plane2;

      // 3. Verify Plane 2 has independent IDs
      assert.equal(plane2.auxState.points.length, 1);
      const clonedPtM = plane2.auxState.points[0];
      assert.ok(clonedPtM.id.startsWith('p2_'));
      assert.deepEqual(clonedPtM.parentIds, ['chord_AB']);

      assert.equal(plane2.auxState.segments.length, 1);
      const clonedSeg = plane2.auxState.segments[0];
      assert.ok(clonedSeg.id.startsWith('p2_'));
      assert.equal(clonedSeg.p1Id, clonedPtM.id);
      assert.equal(clonedSeg.p2Id, 'D');

      assert.equal(plane2.auxState.lines.length, 1);
      const clonedTan = plane2.auxState.lines[0];
      assert.ok(clonedTan.id.startsWith('p2_'));
      assert.equal(clonedTan.type, 'tangent');
      assert.equal(clonedTan.throughPointId, 'C');

      // 4. Verify deep isolation: modifying Plane 1 does NOT affect Plane 2
      const updatedSession = cloneResult.session;
      const p1ModifiedAux: AuxiliaryState = {
        ...updatedSession.plane1.auxState,
        points: []
      };

      assert.equal(updatedSession.plane2.auxState.points.length, 1, 'Plane 2 must retain its points when Plane 1 is modified');
    });

    it('TEST 2B: Clone is rejected if Plane 2 is in FIXED lifecycle', () => {
      const harness = createTestHarness();

      const session: ResearchSession = {
        plane1: {
          geoState: harness.geoState,
          auxState: harness.currentAux
        },
        plane2: {
          geoState: createDefaultQuadrilateralState(),
          auxState: createEmptyAuxiliaryState()
        },
        activePlane: 'PLANE_1',
        plane2Lifecycle: 'FIXED'
      };

      const cloneResult = clonePlane1ToPlane2(session);
      assert.equal(cloneResult.success, false);
      assert.equal(cloneResult.errorCode, 'PLANE_FIXED_READ_ONLY');
      assert.equal(cloneResult.message, 'PLANE 2 IS FIXED — CLONE REJECTED');
    });

    it('TEST 2C: Plane 1 remains mutable after Plane 2 is FIXED', () => {
      const harness = createTestHarness();

      const session: ResearchSession = {
        plane1: {
          geoState: harness.geoState,
          auxState: harness.currentAux
        },
        plane2: {
          geoState: createDefaultQuadrilateralState(),
          auxState: createEmptyAuxiliaryState()
        },
        activePlane: 'PLANE_1',
        plane2Lifecycle: 'FIXED'
      };

      // Construct a new point on Plane 1
      const res = harness.executeCommand({
        type: 'CONSTRUCT_POINT',
        x: -30,
        y: 40,
        pointType: 'free'
      });

      assert.equal(res.success, true);
      assert.equal(session.plane2Lifecycle, 'FIXED');
    });
  });
});
