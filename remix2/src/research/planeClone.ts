/**
 * Plane 1 -> Plane 2 Construction Clone Engine
 * R3-01.2: Construction Pattern Same-Stand Clone
 * 
 * Recreates the full geometric construction from Plane 1 onto Plane 2
 * via topological reconstruction and dependency remapping.
 * 
 * Guarantees:
 * 1. Deep state isolation (zero shared mutable object references).
 * 2. Independent object IDs on Plane 2 (e.g. `p2_pt_...`, `p2_seg_...`).
 * 3. Topological parent dependency remapping (Construction DAG preservation).
 * 4. Strict rejection if Plane 2 is in 'FIXED' lifecycle.
 * 5. Safe validation via TopologyGuard on the cloned state.
 */

import { ResearchSession, PlaneSession } from '../ui/types/researchSession';
import { UniversalGeometryState } from '../kernel/state/geometryState';
import {
  AuxiliaryState,
  AuxiliaryPoint,
  AuxiliarySegment,
  AuxiliaryLine,
  AuxiliaryCircle,
  AuxiliaryMeasurement
} from '../ui/types/auxiliaryTypes';
import { TopologyGuard } from '../kernel/topology/topologyGuard';

export interface ClonePlaneResult {
  readonly success: boolean;
  readonly message: string;
  readonly session: ResearchSession;
  readonly errorCode?: 'PLANE_FIXED_READ_ONLY' | 'TOPOLOGY_ERROR';
}

import { CyclicInput, CartesianInput } from '../types/geometry';

/**
 * Deep clones a UniversalGeometryState using domain-profile factories
 */
function cloneGeometryState(sourceGeo: UniversalGeometryState): UniversalGeometryState {
  if (sourceGeo.domainProfile === 'CYCLIC') {
    const cyclicInput = sourceGeo.canonicalInputs as CyclicInput;
    return UniversalGeometryState.createCyclic(
      cyclicInput.referenceCircle.center,
      cyclicInput.referenceCircle.radius,
      cyclicInput.angles,
      `CLONED_FROM_PLANE_1_v${sourceGeo.stateVersion}`,
      [...sourceGeo.constructionLineage, `CLONE_P1_v${sourceGeo.stateVersion}`]
    );
  }

  const cartesianInput = sourceGeo.canonicalInputs as CartesianInput;
  return UniversalGeometryState.createCartesian(
    cartesianInput.vertices,
    `CLONED_FROM_PLANE_1_v${sourceGeo.stateVersion}`,
    [...sourceGeo.constructionLineage, `CLONE_P1_v${sourceGeo.stateVersion}`]
  );
}

/**
 * Reconstructs AuxiliaryState with remapped IDs and DAG parent dependencies
 */
function cloneAuxiliaryState(
  sourceAux: AuxiliaryState,
  idMap: Map<string, string>
): AuxiliaryState {
  // 1. Remap Canonical and Base References (A, B, C, D, O, base chords map to themselves)
  idMap.set('A', 'A');
  idMap.set('B', 'B');
  idMap.set('C', 'C');
  idMap.set('D', 'D');
  idMap.set('O', 'O');
  idMap.set('center', 'O');
  idMap.set('circle_main', 'circle_main');
  idMap.set('chord_AB', 'chord_AB');
  idMap.set('chord_BC', 'chord_BC');
  idMap.set('chord_CD', 'chord_CD');
  idMap.set('chord_DA', 'chord_DA');

  // 2. Clone and remap Auxiliary Points
  const clonedPoints: AuxiliaryPoint[] = sourceAux.points.map((pt, idx) => {
    const newPtId = `p2_${pt.id || `pt_${idx + 1}`}`;
    idMap.set(pt.id, newPtId);

    const remappedParents = pt.parentIds?.map((pid) => idMap.get(pid) || pid);

    return {
      id: newPtId,
      label: pt.label,
      x: pt.x,
      y: pt.y,
      type: pt.type,
      parentIds: remappedParents ? [...remappedParents] : undefined,
      color: pt.color,
      isProtected: pt.isProtected
    };
  });

  // 3. Clone and remap Auxiliary Segments
  const clonedSegments: AuxiliarySegment[] = sourceAux.segments.map((seg, idx) => {
    const newSegId = `p2_${seg.id || `seg_${idx + 1}`}`;
    idMap.set(seg.id, newSegId);

    const newP1Id = idMap.get(seg.p1Id) || seg.p1Id;
    const newP2Id = idMap.get(seg.p2Id) || seg.p2Id;
    const remappedParents = seg.parentIds?.map((pid) => idMap.get(pid) || pid);

    return {
      id: newSegId,
      label: seg.label,
      p1Id: newP1Id,
      p2Id: newP2Id,
      type: seg.type,
      lengthMm: seg.lengthMm,
      color: seg.color,
      parentIds: remappedParents ? [...remappedParents] : undefined
    };
  });

  // 4. Clone and remap Auxiliary Lines
  const clonedLines: AuxiliaryLine[] = sourceAux.lines.map((line, idx) => {
    const newLineId = `p2_${line.id || `line_${idx + 1}`}`;
    idMap.set(line.id, newLineId);

    const remappedThrough = idMap.get(line.throughPointId) || line.throughPointId;
    const remappedRefSeg = line.referenceSegmentId ? (idMap.get(line.referenceSegmentId) || line.referenceSegmentId) : undefined;
    const remappedP1 = line.point1Id ? (idMap.get(line.point1Id) || line.point1Id) : undefined;
    const remappedP2 = line.point2Id ? (idMap.get(line.point2Id) || line.point2Id) : undefined;
    const remappedP3 = line.point3Id ? (idMap.get(line.point3Id) || line.point3Id) : undefined;

    return {
      id: newLineId,
      label: line.label,
      type: line.type,
      throughPointId: remappedThrough,
      referenceSegmentId: remappedRefSeg,
      point1Id: remappedP1,
      point2Id: remappedP2,
      point3Id: remappedP3,
      anchorPoint: { x: line.anchorPoint.x, y: line.anchorPoint.y },
      direction: { dx: line.direction.dx, dy: line.direction.dy },
      equation: line.equation ? { ...line.equation } : undefined,
      color: line.color
    };
  });

  // 5. Clone and remap Auxiliary Circles
  const clonedCircles: AuxiliaryCircle[] = sourceAux.circles.map((circ, idx) => {
    const newCircId = `p2_${circ.id || `circ_${idx + 1}`}`;
    idMap.set(circ.id, newCircId);

    const remappedCenter = idMap.get(circ.centerPointId) || circ.centerPointId;
    const remappedR1 = circ.radiusPoint1Id ? (idMap.get(circ.radiusPoint1Id) || circ.radiusPoint1Id) : undefined;
    const remappedR2 = circ.radiusPoint2Id ? (idMap.get(circ.radiusPoint2Id) || circ.radiusPoint2Id) : undefined;

    return {
      id: newCircId,
      label: circ.label,
      type: circ.type,
      centerPointId: remappedCenter,
      radius: circ.radius,
      radiusPoint1Id: remappedR1,
      radiusPoint2Id: remappedR2,
      color: circ.color
    };
  });

  // 6. Clone and remap Measurements
  const clonedMeasurements: AuxiliaryMeasurement[] = sourceAux.measurements.map((m, idx) => {
    const newMeasId = `p2_${m.id || `meas_${idx + 1}`}`;
    const newP1Id = idMap.get(m.p1Id) || m.p1Id;
    const newP2Id = idMap.get(m.p2Id) || m.p2Id;

    return {
      id: newMeasId,
      p1Id: newP1Id,
      p2Id: newP2Id,
      distanceMm: m.distanceMm,
      label: m.label
    };
  });

  return {
    points: clonedPoints,
    segments: clonedSegments,
    lines: clonedLines,
    circles: clonedCircles,
    measurements: clonedMeasurements,
    selectedEntityId: null,
    selectedEntityType: null
  };
}

/**
 * Clones the geometric construction from Plane 1 to Plane 2.
 * 
 * Rules:
 * - If Plane 2 is FIXED, clone is rejected with PLANE_FIXED_READ_ONLY.
 * - Creates completely independent state objects (no shared references).
 * - Preserves Construction DAG dependencies via ID remapping table.
 */
export function clonePlane1ToPlane2(session: ResearchSession): ClonePlaneResult {
  // 1. Lifecycle Guard: Plane 2 must not be FIXED
  if (session.plane2Lifecycle === 'FIXED') {
    return {
      success: false,
      errorCode: 'PLANE_FIXED_READ_ONLY',
      message: 'PLANE 2 IS FIXED — CLONE REJECTED',
      session
    };
  }

  // 2. Clone Canonical Geometry State
  const clonedGeoState = cloneGeometryState(session.plane1.geoState);

  // Validate topology of cloned geometry
  const report = TopologyGuard.validate(clonedGeoState);
  if (report.status === 'DEGENERATE') {
    return {
      success: false,
      errorCode: 'TOPOLOGY_ERROR',
      message: `Cannot clone: source Plane 1 geometry is degenerate (${report.issues.join(', ')})`,
      session
    };
  }

  // 3. Reconstruct Auxiliary Constructions with ID remap
  const idMap = new Map<string, string>();
  const clonedAuxState = cloneAuxiliaryState(session.plane1.auxState, idMap);

  const updatedPlane2: PlaneSession = {
    geoState: clonedGeoState,
    auxState: clonedAuxState
  };

  const updatedSession: ResearchSession = {
    ...session,
    plane2: updatedPlane2
  };

  const countSummary = `${clonedAuxState.points.length} точ., ${clonedAuxState.segments.length} отр., ${clonedAuxState.lines.length} прям., ${clonedAuxState.circles.length} окр.`;

  return {
    success: true,
    message: `Конструкция Plane 1 успешно скопирована на Plane 2 (${countSummary})`,
    session: updatedSession
  };
}
