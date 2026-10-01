/**
 * Point-First Construction & Segment Commit Regression Tests (R3-POINT-FIRST)
 * 
 * Verifies:
 * 1. resolveOrCreatePoint:
 *    - Case A: Snap to existing vertex (A, B, C, D) or point (pt_...) or center (O) -> reuse pointId directly.
 *    - Case B: Snap to segment/chord -> create 'on_segment' point with parentId.
 *    - Case C: Snap to circle/circumference -> create 'on_circle' point with parentId.
 *    - Case D: Free canvas -> create 'free' point.
 * 2. Cross-Combinations:
 *    - free -> free
 *    - vertex -> free
 *    - point -> free
 *    - free -> segment
 *    - free -> circle
 *    - segment -> segment
 *    - circle -> circle
 *    - segment -> circle
 *    - circle -> segment
 * 3. Two-Step Tool Lifecycles:
 *    - SEGMENT (CONSTRUCT_SEGMENT)
 *    - RULER (MEASURE_DISTANCE)
 *    - COMPASS (CONSTRUCT_COMPASS)
 *    - LINE_CIRCLE (CONSTRUCT_LINE and CONSTRUCT_CIRCLE)
 * 4. Atomic Rollback on Failure:
 *    - When subsequent construction fails, dynamic point is erased cleanly via rollbackDynamicPoint.
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
import { resolveOrCreatePoint, rollbackDynamicPoint } from '../src/ui/canvas/pointResolution';

describe('R3 Point-First Universal Construction Suite', () => {
  function createTestHarness(initialAux?: AuxiliaryState) {
    const geoState = createDefaultQuadrilateralState();
    let currentAux = initialAux || createEmptyAuxiliaryState();
    const uiState: any = {
      standMode: 'SCHOOL',
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
      pres
    };
  }

  it('A. free -> free: Both points created dynamically with unique IDs, segment created', () => {
    const harness = createTestHarness();

    // Step 1: P1 free
    const p1 = harness.resolve({ x: -50, y: 80 }, null);
    assert.equal(p1.success, true);
    assert.equal(p1.isDynamic, true);
    assert.equal(p1.pointType, 'free');
    assert.ok(p1.pointId);

    // Step 2: P2 free
    const p2 = harness.resolve({ x: 120, y: -60 }, null);
    assert.equal(p2.success, true);
    assert.equal(p2.isDynamic, true);
    assert.equal(p2.pointType, 'free');
    assert.ok(p2.pointId);
    assert.notEqual(p1.pointId, p2.pointId);

    // Commit Segment
    const segRes = harness.executeCommand(
      { type: 'CONSTRUCT_SEGMENT', p1Id: p1.pointId!, p2Id: p2.pointId! },
      p2.updatedAuxiliaryState
    );
    assert.equal(segRes.success, true);
    assert.ok(segRes.updatedAuxiliaryState.segments.some((s) => s.p1Id === p1.pointId && s.p2Id === p2.pointId));
  });

  it('B. existing vertex -> free: Reuses vertex ID, creates P2 dynamically, segment created', () => {
    const harness = createTestHarness();

    // Step 1: Snap to vertex A
    const snapA: SnapTarget = { x: 113.1, y: 113.1, entityId: 'A', entityType: 'vertex', label: 'Вершина A', distance: 0 };
    const p1 = harness.resolve({ x: 113.1, y: 113.1 }, snapA);
    assert.equal(p1.success, true);
    assert.equal(p1.isDynamic, false);
    assert.equal(p1.pointId, 'A');

    // Step 2: Free space P2
    const p2 = harness.resolve({ x: 0, y: 50 }, null);
    assert.equal(p2.success, true);
    assert.equal(p2.isDynamic, true);

    const segRes = harness.executeCommand(
      { type: 'CONSTRUCT_SEGMENT', p1Id: 'A', p2Id: p2.pointId! },
      p2.updatedAuxiliaryState
    );
    assert.equal(segRes.success, true);
    assert.ok(segRes.updatedAuxiliaryState.segments.some((s) => s.p1Id === 'A' && s.p2Id === p2.pointId));
  });

  it('C. existing point -> free: Reuses existing auxiliary point, creates P2, segment created', () => {
    const harness = createTestHarness();

    // Create an initial point
    const initPt = harness.resolve({ x: -100, y: -50 }, null);
    assert.ok(initPt.pointId);

    // Step 1: Snap to that existing point
    const snapPt: SnapTarget = { x: -100, y: -50, entityId: initPt.pointId, entityType: 'point', label: 'P1', distance: 0 };
    const p1 = harness.resolve({ x: -100, y: -50 }, snapPt);
    assert.equal(p1.isDynamic, false);
    assert.equal(p1.pointId, initPt.pointId);

    // Step 2: Free point P2
    const p2 = harness.resolve({ x: 40, y: 40 }, null);
    assert.equal(p2.isDynamic, true);

    const segRes = harness.executeCommand(
      { type: 'CONSTRUCT_SEGMENT', p1Id: p1.pointId!, p2Id: p2.pointId! },
      p2.updatedAuxiliaryState
    );
    assert.equal(segRes.success, true);
  });

  it('D. free -> segment (SNAP ON CHORD): Crucial user scenario - creates on_segment point, NOT using chord ID as point', () => {
    const harness = createTestHarness();

    // Step 1: Free space P1
    const p1 = harness.resolve({ x: -10, y: 100 }, null);
    assert.equal(p1.success, true);

    // Step 2: Snap on chord AB (entityType === 'segment')
    const snapChord: SnapTarget = {
      x: 0,
      y: 160,
      entityId: 'chord_AB',
      entityType: 'segment',
      label: 'Отрезок chord_AB',
      distance: 0
    };
    const p2 = harness.resolve({ x: 0, y: 160 }, snapChord);

    assert.equal(p2.success, true);
    assert.equal(p2.isDynamic, true);
    assert.equal(p2.pointType, 'on_segment');
    assert.equal(p2.parentId, 'chord_AB');
    // Must NOT be 'chord_AB'!
    assert.notEqual(p2.pointId, 'chord_AB');
    assert.ok(p2.pointId?.startsWith('pt_'));

    // Check DAG lineage: P2 has parentId 'chord_AB' in auxiliaryState
    const pointInAux = p2.updatedAuxiliaryState.points.find((p) => p.id === p2.pointId);
    assert.ok(pointInAux);
    assert.deepEqual(pointInAux.parentIds, ['chord_AB']);

    // Segment commit between P1 and P2 on chord
    const segRes = harness.executeCommand(
      { type: 'CONSTRUCT_SEGMENT', p1Id: p1.pointId!, p2Id: p2.pointId! },
      p2.updatedAuxiliaryState
    );
    assert.equal(segRes.success, true);
    assert.ok(segRes.updatedAuxiliaryState.segments.some((s) => s.p1Id === p1.pointId && s.p2Id === p2.pointId));
  });

  it('E. free -> circle (SNAP ON CIRCUMFERENCE): Creates on_circle point on S¹', () => {
    const harness = createTestHarness();

    const p1 = harness.resolve({ x: 0, y: 0 }, null);
    const snapCircle: SnapTarget = {
      x: 160,
      y: 0,
      entityType: 'circle',
      label: 'Описанная окружность S¹',
      distance: 0
    };
    const p2 = harness.resolve({ x: 160, y: 0 }, snapCircle);

    assert.equal(p2.success, true);
    assert.equal(p2.pointType, 'on_circle');
    assert.ok(p2.pointId?.startsWith('pt_'));

    const segRes = harness.executeCommand(
      { type: 'CONSTRUCT_SEGMENT', p1Id: p1.pointId!, p2Id: p2.pointId! },
      p2.updatedAuxiliaryState
    );
    assert.equal(segRes.success, true);
  });

  it('F. segment -> segment: Connects points on two different chords (e.g. BC to AB)', () => {
    const harness = createTestHarness();

    const snapBC: SnapTarget = { x: -113.1, y: -72.4, entityId: 'chord_BC', entityType: 'segment', label: 'Отрезок BC', distance: 0 };
    const p1 = harness.resolve({ x: -113.1, y: -72.4 }, snapBC);
    assert.equal(p1.pointType, 'on_segment');
    assert.equal(p1.parentId, 'chord_BC');

    const snapAB: SnapTarget = { x: 50, y: 150, entityId: 'chord_AB', entityType: 'segment', label: 'Отрезок AB', distance: 0 };
    const p2 = harness.resolve({ x: 50, y: 150 }, snapAB);
    assert.equal(p2.pointType, 'on_segment');
    assert.equal(p2.parentId, 'chord_AB');

    const segRes = harness.executeCommand(
      { type: 'CONSTRUCT_SEGMENT', p1Id: p1.pointId!, p2Id: p2.pointId! },
      p2.updatedAuxiliaryState
    );
    assert.equal(segRes.success, true);
    assert.ok(segRes.updatedAuxiliaryState.segments.some((s) => s.p1Id === p1.pointId && s.p2Id === p2.pointId));
  });

  it('G. circle -> circle: Connects two points on circumcircle S¹', () => {
    const harness = createTestHarness();

    const snapCirc1: SnapTarget = { x: 0, y: 160, entityType: 'circle', label: 'S¹', distance: 0 };
    const p1 = harness.resolve({ x: 0, y: 160 }, snapCirc1);

    const snapCirc2: SnapTarget = { x: 0, y: -160, entityType: 'circle', label: 'S¹', distance: 0 };
    const p2 = harness.resolve({ x: 0, y: -160 }, snapCirc2);

    const segRes = harness.executeCommand(
      { type: 'CONSTRUCT_SEGMENT', p1Id: p1.pointId!, p2Id: p2.pointId! },
      p2.updatedAuxiliaryState
    );
    assert.equal(segRes.success, true);
  });

  it('H. segment -> circle & I. circle -> segment', () => {
    const harness = createTestHarness();

    const snapSeg: SnapTarget = { x: 100, y: 0, entityId: 'chord_DA', entityType: 'segment', label: 'DA', distance: 0 };
    const p1 = harness.resolve({ x: 100, y: 0 }, snapSeg);

    const snapCirc: SnapTarget = { x: -160, y: 0, entityType: 'circle', label: 'S¹', distance: 0 };
    const p2 = harness.resolve({ x: -160, y: 0 }, snapCirc);

    const segRes = harness.executeCommand(
      { type: 'CONSTRUCT_SEGMENT', p1Id: p1.pointId!, p2Id: p2.pointId! },
      p2.updatedAuxiliaryState
    );
    assert.equal(segRes.success, true);
  });

  it('J. RULER Lifecycle: Resolves P1 & P2, stores distance measurement', () => {
    const harness = createTestHarness();

    const p1 = harness.resolve({ x: -50, y: -50 }, null);
    const snapChord: SnapTarget = { x: 50, y: 50, entityId: 'chord_CD', entityType: 'segment', label: 'CD', distance: 0 };
    const p2 = harness.resolve({ x: 50, y: 50 }, snapChord);

    const measRes = harness.executeCommand(
      { type: 'MEASURE_DISTANCE', p1Id: p1.pointId!, p2Id: p2.pointId! },
      p2.updatedAuxiliaryState
    );
    assert.equal(measRes.success, true);
    assert.ok(measRes.updatedAuxiliaryState.measurements.some((m) => m.p1Id === p1.pointId && m.p2Id === p2.pointId));
  });

  it('K. COMPASS Lifecycle: Center + Radius Point resolved, creates circle', () => {
    const harness = createTestHarness();

    // Center point
    const center = harness.resolve({ x: 0, y: 0 }, { x: 0, y: 0, entityId: 'O', entityType: 'center', label: 'Центр O', distance: 0 });
    assert.equal(center.pointId, 'O');

    // Radius point on chord
    const snapChord: SnapTarget = { x: 80, y: 60, entityId: 'chord_AB', entityType: 'segment', label: 'AB', distance: 0 };
    const radiusPt = harness.resolve({ x: 80, y: 60 }, snapChord);
    assert.ok(radiusPt.pointId);

    const compassRes = harness.executeCommand(
      {
        type: 'CONSTRUCT_COMPASS',
        centerId: 'O',
        radius: 100,
        radiusPointId: radiusPt.pointId!
      },
      radiusPt.updatedAuxiliaryState
    );
    assert.equal(compassRes.success, true);
    assert.ok(compassRes.updatedAuxiliaryState.circles.some((c) => c.centerPointId === 'O' && (c.radiusPoint2Id === radiusPt.pointId || c.radiusPoint1Id === radiusPt.pointId)));
  });

  it('L. LINE_CIRCLE Lifecycle: Creates line and circle with resolved point entities', () => {
    const harness = createTestHarness();

    const p1 = harness.resolve({ x: -40, y: 30 }, null);
    const p2 = harness.resolve({ x: 40, y: -30 }, null);

    // Line
    const lineRes = harness.executeCommand(
      { type: 'CONSTRUCT_LINE', p1Id: p1.pointId!, p2Id: p2.pointId! },
      p2.updatedAuxiliaryState
    );
    assert.equal(lineRes.success, true);

    // Circle
    const circleRes = harness.executeCommand(
      {
        type: 'CONSTRUCT_CIRCLE',
        centerId: p1.pointId!,
        radius: 50,
        radiusPointId: p2.pointId!
      },
      lineRes.updatedAuxiliaryState
    );
    assert.equal(circleRes.success, true);
  });

  it('M. Atomic Rollback: When segment commit fails on self-connection, dynamic P2 is cleaned up', () => {
    const harness = createTestHarness();

    const p1 = harness.resolve({ x: 20, y: 20 }, null);
    const p1Id = p1.pointId!;

    // Attempt connecting P1 to itself (degenerate)
    const segFailRes = harness.executeCommand(
      { type: 'CONSTRUCT_SEGMENT', p1Id, p2Id: p1Id },
      p1.updatedAuxiliaryState
    );
    assert.equal(segFailRes.success, false);

    // Rollback dynamic point
    rollbackDynamicPoint(p1Id, p1.updatedAuxiliaryState, harness.executeCommand);
    assert.ok(!harness.currentAux.points.some((p) => p.id === p1Id), 'Dynamic point must be rolled back');
  });
});
