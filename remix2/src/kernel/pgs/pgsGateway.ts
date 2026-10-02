/**
 * PGS-2D Gateway for CQNS-001 Stand
 * 
 * Thin translation boundary between CQNS UniversalGeometryState
 * and the portable PGS-2D semantic state contract.
 * 
 * Principles:
 * 1. NO MAGIC GEOMETRY — explicit identity and topological preservation.
 * 2. SOURCE_CLAIM ≠ RECEIVER_VERIFICATION — receiver always independently validates geometry.
 * 3. EDGE ≠ DIAGONAL — boundary edges and internal diagonals are strictly distinguished.
 * 4. portableId ≠ CQNS localId ≠ displayLabel.
 * 5. Stand-agnostic transfer via EXACT_STATE.
 */

import { UniversalGeometryState } from '../state/geometryState';
import { Point, CyclicInput, CartesianInput } from '../../types/geometry';
import { TopologyGuard } from '../topology/topologyGuard';
import { AuxiliaryState, AuxiliaryPoint, AuxiliarySegment } from '../../ui/types/auxiliaryTypes';
import {
  PGSPassport,
  PGSObject,
  PGSSemanticType,
  PGSSemanticRole,
  PGSValidationReport,
  PGSInspectionSummary,
  PointGeometry,
  SegmentGeometry,
  CircleGeometry,
  PolygonGeometry
} from './pgsTypes';
import { validatePGSPassport } from './pgsValidator';
import { decodePGSJson, encodePGSJson } from './pgsJsonCodec';

export interface PGSExportOptions {
  readonly includeDiagonals?: boolean;
  readonly includeAuxiliary?: boolean;
  readonly includeDomainMetadata?: boolean;
  readonly passportId?: string;
  readonly generatorName?: string;
}

export interface PGSImportOptions {
  readonly enforceTopologyValidation?: boolean;
  readonly targetDomainProfile?: 'CYCLIC' | 'CARTESIAN';
}

export interface PGSImportResult {
  readonly success: boolean;
  readonly geometryState?: UniversalGeometryState;
  readonly auxiliaryState?: AuxiliaryState;
  readonly identityMap: Record<string, string>; // portableId -> localId
  readonly reverseIdentityMap: Record<string, string>; // localId -> portableId
  readonly validationReport: PGSValidationReport;
  readonly receiverVerification: {
    readonly passed: boolean;
    readonly report?: any;
    readonly verifiedBy: string;
  };
  readonly sourceClaim?: {
    readonly verified: boolean;
    readonly engine?: string;
    readonly timestamp?: string;
  };
  readonly unsupportedCapabilities: readonly string[];
  readonly warnings: readonly string[];
  readonly error?: string;
}

/**
 * Normalizes an angle into [0, 2pi)
 */
function normalizeAngle(rad: number): number {
  return ((rad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

/**
 * 1. EXPORT: CQNS State -> PGS-2D Passport (EXACT_STATE)
 */
export function exportToPGS(
  geometryState: UniversalGeometryState,
  auxiliaryState?: AuxiliaryState,
  options: PGSExportOptions = {}
): PGSPassport {
  const isCyclic = geometryState.domainProfile === 'CYCLIC';
  const passportId = options.passportId || `pgs_cqns_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const timestamp = new Date().toISOString();

  let center: Point = { id: 'O', x: 0, y: 0 };
  let radius = 160.0;
  const vertices: Point[] = [];
  const vertexLabels = ['A', 'B', 'C', 'D'];

  if (isCyclic) {
    const cyclicInput = geometryState.canonicalInputs as CyclicInput;
    center = cyclicInput.referenceCircle.center;
    radius = cyclicInput.referenceCircle.radius;
    const angles = cyclicInput.angles;

    for (let i = 0; i < angles.length; i++) {
      const normAngle = normalizeAngle(angles[i]);
      const x = center.x + radius * Math.cos(normAngle);
      const y = center.y + radius * Math.sin(normAngle);
      const label = vertexLabels[i] || `V${i + 1}`;
      vertices.push({ id: label, x, y });
    }
  } else {
    const cartesianInput = geometryState.canonicalInputs as CartesianInput;
    for (let i = 0; i < cartesianInput.vertices.length; i++) {
      const v = cartesianInput.vertices[i];
      vertices.push({ id: v.id || vertexLabels[i] || `V${i + 1}`, x: v.x, y: v.y });
    }
  }

  const objects: PGSObject[] = [];
  const identityMap: Record<string, string> = {};

  // 1. Reference Center Point O
  const centerPortableId = 'pt_O';
  identityMap[centerPortableId] = center.id;
  objects.push({
    portableId: centerPortableId,
    semanticType: 'point',
    semanticRole: 'reference',
    displayLabel: center.id || 'O',
    geometry: { x: center.x, y: center.y } as PointGeometry
  });

  // 2. Reference Circumcircle S¹
  const circlePortableId = 'circle_S1';
  identityMap[circlePortableId] = 'circumcircle';
  objects.push({
    portableId: circlePortableId,
    semanticType: 'circle',
    semanticRole: 'reference',
    displayLabel: 'S¹',
    geometry: {
      centerPointId: centerPortableId,
      radius
    } as CircleGeometry,
    relations: isCyclic ? [
      {
        relationType: 'circumscribes',
        targetEntityIds: ['poly_ABCD']
      }
    ] : undefined
  });

  // 3. Four Canonical Boundary Vertices
  const vertexPortableIds: string[] = [];
  for (let i = 0; i < vertices.length; i++) {
    const v = vertices[i];
    const portId = `pt_${v.id}`;
    vertexPortableIds.push(portId);
    identityMap[portId] = v.id;

    objects.push({
      portableId: portId,
      semanticType: 'point',
      semanticRole: 'boundary',
      displayLabel: v.id,
      geometry: { x: v.x, y: v.y } as PointGeometry,
      relations: isCyclic ? [
        {
          relationType: 'incident_on',
          targetEntityIds: [circlePortableId]
        }
      ] : undefined
    });
  }

  // 4. Boundary Edges (AB, BC, CD, DA)
  const edgePortableIds: string[] = [];
  const N = vertices.length;
  for (let i = 0; i < N; i++) {
    const v1 = vertices[i];
    const v2 = vertices[(i + 1) % N];
    const edgeId = `edge_${v1.id}${v2.id}`;
    const p1PortId = `pt_${v1.id}`;
    const p2PortId = `pt_${v2.id}`;
    edgePortableIds.push(edgeId);
    identityMap[edgeId] = `${v1.id}${v2.id}`;

    const length = Math.hypot(v2.x - v1.x, v2.y - v1.y);

    objects.push({
      portableId: edgeId,
      semanticType: 'segment',
      semanticRole: 'boundary',
      displayLabel: `${v1.id}${v2.id}`,
      geometry: {
        startPointId: p1PortId,
        endPointId: p2PortId,
        length
      } as SegmentGeometry
    });
  }

  // 5. Canonical Primary Polygon (Polygon(4))
  const polyPortableId = 'poly_ABCD';
  identityMap[polyPortableId] = 'canonical_quadrilateral';
  objects.push({
    portableId: polyPortableId,
    semanticType: 'polygon',
    semanticRole: 'primary',
    displayLabel: 'ABCD',
    geometry: {
      vertexIds: vertexPortableIds,
      edgeIds: edgePortableIds,
      isClosed: true
    } as PolygonGeometry,
    domainMetadata: {
      isCyclic,
      vertexCount: N
    }
  });

  // 6. Explicit Diagonals (AC, BD)
  // Preserves strict distinction: EDGE !== DIAGONAL
  if (options.includeDiagonals !== false && N === 4) {
    const diagPairs = [
      { v1: vertices[0], v2: vertices[2], label: 'AC' },
      { v1: vertices[1], v2: vertices[3], label: 'BD' }
    ];

    for (const d of diagPairs) {
      const diagPortId = `diag_${d.label}`;
      identityMap[diagPortId] = `diag_${d.label}`;
      const len = Math.hypot(d.v2.x - d.v1.x, d.v2.y - d.v1.y);

      objects.push({
        portableId: diagPortId,
        semanticType: 'segment',
        semanticRole: 'diagonal',
        displayLabel: d.label,
        geometry: {
          startPointId: `pt_${d.v1.id}`,
          endPointId: `pt_${d.v2.id}`,
          length: len
        } as SegmentGeometry
      });
    }
  }

  // 7. Auxiliary Objects from AuxiliaryState if provided
  if (options.includeAuxiliary && auxiliaryState) {
    // Points
    for (const pt of auxiliaryState.points) {
      const portId = `aux_pt_${pt.id}`;
      identityMap[portId] = pt.id;
      objects.push({
        portableId: portId,
        semanticType: 'point',
        semanticRole: pt.type === 'intersection' ? 'derived' : 'auxiliary',
        displayLabel: pt.label || pt.id,
        geometry: { x: pt.x, y: pt.y } as PointGeometry,
        construction: pt.parentIds ? {
          operation: pt.type,
          inputEntityIds: pt.parentIds
        } : undefined
      });
    }

    // Auxiliary Segments
    for (const seg of auxiliaryState.segments) {
      if (seg.type === 'diagonal') continue; // Already covered
      const portId = `aux_seg_${seg.id}`;
      identityMap[portId] = seg.id;
      objects.push({
        portableId: portId,
        semanticType: 'segment',
        semanticRole: 'auxiliary',
        displayLabel: seg.label || seg.id,
        geometry: {
          startPointId: identityMap[`pt_${seg.p1Id}`] ? `pt_${seg.p1Id}` : `aux_pt_${seg.p1Id}`,
          endPointId: identityMap[`pt_${seg.p2Id}`] ? `pt_${seg.p2Id}` : `aux_pt_${seg.p2Id}`,
          length: seg.lengthMm
        } as SegmentGeometry
      });
    }
  }

  // 8. Domain Invariants & Metadata
  let domainMetadata: Record<string, any> | undefined;
  if (options.includeDomainMetadata !== false) {
    domainMetadata = {
      standDomain: 'CYCLIC_QUADRILATERAL',
      domainProfile: geometryState.domainProfile,
      stateVersion: geometryState.stateVersion,
      inscribedCircleRadiusMm: radius,
      vertexOrder: vertexLabels.slice(0, N),
      inscribedOppositeAngleSumDeg: 180.0
    };
  }

  const passport: PGSPassport = {
    pgsVersion: '0.1',
    passportId,
    transferMode: 'EXACT_STATE',
    generator: {
      name: options.generatorName || 'CQNS-001 Normalization Stand',
      version: '0.1.0',
      standId: 'cyclic-quadrilateral-normalization-stand'
    },
    timestamp,
    units: {
      length: 'mm',
      angle: 'rad'
    },
    objects,
    identityMap,
    domainMetadata,
    sourceClaim: {
      verified: true,
      engine: 'CQNS-GeometryCore',
      timestamp
    }
  };

  const validation = validatePGSPassport(passport);
  if (!validation.isValid) {
    throw new Error(`Exported PGS passport failed structural validation: ${validation.errors.join('; ')}`);
  }

  return passport;
}

/**
 * 2. IMPORT: PGS-2D Passport -> CQNS State
 */
export function importFromPGS(
  passportOrJson: PGSPassport | string,
  options: PGSImportOptions = {}
): PGSImportResult {
  let passport: PGSPassport;
  try {
    passport = typeof passportOrJson === 'string'
      ? decodePGSJson(passportOrJson)
      : passportOrJson;
  } catch (err: any) {
    return {
      success: false,
      identityMap: {},
      reverseIdentityMap: {},
      validationReport: { isValid: false, errors: [err.message], warnings: [] },
      receiverVerification: { passed: false, verifiedBy: 'CQNS-Gateway-PreCheck' },
      unsupportedCapabilities: [],
      warnings: [],
      error: `Failed to parse or structurally validate PGS document: ${err.message}`
    };
  }

  const validationReport = validatePGSPassport(passport);
  if (!validationReport.isValid) {
    return {
      success: false,
      identityMap: {},
      reverseIdentityMap: {},
      validationReport,
      receiverVerification: { passed: false, verifiedBy: 'CQNS-Structural-Validator' },
      unsupportedCapabilities: [],
      warnings: validationReport.warnings,
      error: `Invalid PGS Passport structure: ${validationReport.errors.join('; ')}`
    };
  }

  const unsupportedCapabilities: string[] = [];
  const warnings: string[] = [...validationReport.warnings];

  // Transfer mode check
  if (passport.transferMode !== 'EXACT_STATE' && passport.transferMode !== 'HYBRID_STATE') {
    unsupportedCapabilities.push(`Unsupported transferMode: ${passport.transferMode}. CQNS Gateway currently imports EXACT_STATE.`);
    return {
      success: false,
      identityMap: {},
      reverseIdentityMap: {},
      validationReport,
      receiverVerification: { passed: false, verifiedBy: 'CQNS-TransferMode-Guard' },
      unsupportedCapabilities,
      warnings,
      error: `Unsupported transferMode: ${passport.transferMode}. Requires EXACT_STATE.`
    };
  }

  // Find Points Map (portableId -> { x, y, label })
  const pointMap = new Map<string, { x: number; y: number; label?: string }>();
  for (const obj of passport.objects) {
    if (obj.semanticType === 'point') {
      const geom = obj.geometry as PointGeometry;
      pointMap.set(obj.portableId, { x: geom.x, y: geom.y, label: obj.displayLabel });
    }
  }

  // Find Primary Polygon
  const primaryPolygon = passport.objects.find(
    (o) => o.semanticType === 'polygon' && (o.semanticRole === 'primary' || (o.geometry as PolygonGeometry).vertexIds?.length === 4)
  ) || passport.objects.find((o) => o.semanticType === 'polygon');

  let vertexIds: string[] = [];
  if (primaryPolygon) {
    const polyGeom = primaryPolygon.geometry as PolygonGeometry;
    vertexIds = [...polyGeom.vertexIds];
  } else {
    // Collect boundary points or first 4 points
    const boundaryPoints = passport.objects.filter(
      (o) => o.semanticType === 'point' && (o.semanticRole === 'boundary' || o.semanticRole === 'primary')
    );
    if (boundaryPoints.length >= 3) {
      vertexIds = boundaryPoints.map((p) => p.portableId);
    } else {
      vertexIds = Array.from(pointMap.keys()).slice(0, 4);
    }
  }

  if (vertexIds.length < 3) {
    return {
      success: false,
      identityMap: {},
      reverseIdentityMap: {},
      validationReport,
      receiverVerification: { passed: false, verifiedBy: 'CQNS-Polygon-Extractor' },
      unsupportedCapabilities,
      warnings,
      error: `Insufficient vertices to construct a polygon (found ${vertexIds.length}, required >= 3).`
    };
  }

  const defaultLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
  const localVertices: Point[] = [];
  const identityMap: Record<string, string> = {};
  const reverseIdentityMap: Record<string, string> = {};

  for (let i = 0; i < vertexIds.length; i++) {
    const pId = vertexIds[i];
    const ptData = pointMap.get(pId);
    if (!ptData) {
      return {
        success: false,
        identityMap: {},
        reverseIdentityMap: {},
        validationReport,
        receiverVerification: { passed: false, verifiedBy: 'CQNS-Vertex-Resolver' },
        unsupportedCapabilities,
        warnings,
        error: `Polygon vertex "${pId}" not found in points dictionary.`
      };
    }

    const localId = passport.identityMap?.[pId] || ptData.label || defaultLabels[i] || `V${i + 1}`;
    localVertices.push({ id: localId, x: ptData.x, y: ptData.y });
    identityMap[pId] = localId;
    reverseIdentityMap[localId] = pId;
  }

  // Find reference circle if present
  const circleObj = passport.objects.find((o) => o.semanticType === 'circle');
  let center: Point = { id: 'O', x: 0, y: 0 };
  let radius = 160.0;

  if (circleObj) {
    const circGeom = circleObj.geometry as CircleGeometry;
    const centerPt = pointMap.get(circGeom.centerPointId);
    if (centerPt) {
      center = { id: passport.identityMap?.[circGeom.centerPointId] || centerPt.label || 'O', x: centerPt.x, y: centerPt.y };
      identityMap[circGeom.centerPointId] = center.id;
      reverseIdentityMap[center.id] = circGeom.centerPointId;
    }
    radius = circGeom.radius;
    identityMap[circleObj.portableId] = 'circumcircle';
    reverseIdentityMap['circumcircle'] = circleObj.portableId;
  } else {
    // Derive center and radius from vertices if concyclic
    const xs = localVertices.map((v) => v.x);
    const ys = localVertices.map((v) => v.y);
    const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
    const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
    center = { id: 'O', x: Math.round(cx * 100) / 100, y: Math.round(cy * 100) / 100 };
    radius = Math.round(Math.hypot(localVertices[0].x - center.x, localVertices[0].y - center.y) * 100) / 100;
  }

  // Calculate angles relative to center
  const anglesRad = localVertices.map((v) => {
    const angle = Math.atan2(v.y - center.y, v.x - center.x);
    return normalizeAngle(angle);
  });

  // Verify whether all vertices lie on circle within epsilon
  const eps = 1.0; // 1mm tolerance
  const isConcyclic = localVertices.every((v) => {
    const d = Math.hypot(v.x - center.x, v.y - center.y);
    return Math.abs(d - radius) < eps;
  });

  let geometryState: UniversalGeometryState;
  const targetProfile = options.targetDomainProfile || (isConcyclic ? 'CYCLIC' : 'CARTESIAN');

  if (targetProfile === 'CYCLIC' && isConcyclic) {
    geometryState = UniversalGeometryState.createCyclic(
      center,
      radius,
      anglesRad,
      `PGS_IMPORT_${passport.passportId}`
    );
  } else {
    geometryState = UniversalGeometryState.createCartesian(
      localVertices,
      `PGS_IMPORT_${passport.passportId}`
    );
    if (!isConcyclic) {
      warnings.push('Imported vertices are not strictly concyclic; constructed as CARTESIAN domain profile.');
    }
  }

  // Receiver Mathematical Verification (TopologyGuard & Invariants)
  const topologyReport = TopologyGuard.validate(geometryState);
  if (topologyReport.status !== 'VALID') {
    return {
      success: false,
      identityMap,
      reverseIdentityMap,
      validationReport,
      receiverVerification: {
        passed: false,
        report: topologyReport,
        verifiedBy: 'CQNS-TopologyGuard'
      },
      unsupportedCapabilities,
      warnings,
      error: `Topology validation failed on imported geometry: ${topologyReport.issues.join('; ')}`
    };
  }

  // Auxiliary State Reconstruction (diagonals, auxiliary segments)
  const auxPoints: AuxiliaryPoint[] = [];
  const auxSegments: AuxiliarySegment[] = [];

  for (const obj of passport.objects) {
    if (obj.semanticType === 'segment') {
      const geom = obj.geometry as SegmentGeometry;
      const localP1 = identityMap[geom.startPointId];
      const localP2 = identityMap[geom.endPointId];

      if (localP1 && localP2) {
        if (obj.semanticRole === 'diagonal') {
          auxSegments.push({
            id: `diag_${localP1}_${localP2}`,
            label: `${localP1}${localP2}`,
            p1Id: localP1,
            p2Id: localP2,
            type: 'diagonal',
            lengthMm: geom.length || Math.hypot(
              (pointMap.get(geom.endPointId)?.x || 0) - (pointMap.get(geom.startPointId)?.x || 0),
              (pointMap.get(geom.endPointId)?.y || 0) - (pointMap.get(geom.startPointId)?.y || 0)
            )
          });
          identityMap[obj.portableId] = `diag_${localP1}_${localP2}`;
        } else if (obj.semanticRole === 'auxiliary') {
          auxSegments.push({
            id: `aux_${localP1}_${localP2}`,
            label: obj.displayLabel || `${localP1}${localP2}`,
            p1Id: localP1,
            p2Id: localP2,
            type: 'segment',
            lengthMm: geom.length || 0
          });
          identityMap[obj.portableId] = `aux_${localP1}_${localP2}`;
        }
      }
    }
  }

  const auxiliaryState: AuxiliaryState = {
    selectedEntityId: null,
    selectedEntityType: null,
    points: auxPoints,
    segments: auxSegments,
    lines: [],
    circles: [],
    measurements: []
  };

  return {
    success: true,
    geometryState,
    auxiliaryState,
    identityMap,
    reverseIdentityMap,
    validationReport,
    receiverVerification: {
      passed: true,
      report: topologyReport,
      verifiedBy: 'CQNS-TopologyGuard & GeometryCore'
    },
    sourceClaim: passport.sourceClaim,
    unsupportedCapabilities,
    warnings
  };
}

/**
 * 3. INSPECT: Returns structured summary of PGS document without mutating state
 */
export function inspectPGS(passportOrJson: PGSPassport | string): PGSInspectionSummary {
  const passport = typeof passportOrJson === 'string'
    ? decodePGSJson(passportOrJson)
    : passportOrJson;

  const validationReport = validatePGSPassport(passport);

  const countsByType: Record<PGSSemanticType, number> = {
    point: 0,
    segment: 0,
    line: 0,
    circle: 0,
    polygon: 0,
    angle: 0,
    composite: 0
  };

  const countsByRole: Record<PGSSemanticRole, number> = {
    primary: 0,
    boundary: 0,
    diagonal: 0,
    auxiliary: 0,
    construction: 0,
    measurement: 0,
    reference: 0,
    derived: 0
  };

  for (const obj of passport.objects || []) {
    if (obj.semanticType && countsByType[obj.semanticType] !== undefined) {
      countsByType[obj.semanticType]++;
    }
    if (obj.semanticRole && countsByRole[obj.semanticRole] !== undefined) {
      countsByRole[obj.semanticRole]++;
    }
  }

  let polygonTopology: PGSInspectionSummary['polygonTopology'];
  const poly = passport.objects?.find((o) => o.semanticType === 'polygon');
  if (poly) {
    const g = poly.geometry as PolygonGeometry;
    polygonTopology = {
      vertexCount: g.vertexIds?.length || 0,
      boundaryEdges: g.edgeIds || [],
      isClosed: g.isClosed ?? true
    };
  }

  return {
    pgsVersion: passport.pgsVersion,
    passportId: passport.passportId,
    transferMode: passport.transferMode,
    generator: passport.generator,
    timestamp: passport.timestamp,
    objectCount: passport.objects?.length || 0,
    countsByType,
    countsByRole,
    polygonTopology,
    sourceClaim: passport.sourceClaim,
    validationReport
  };
}

/**
 * 4. Helper for JSON round-trip export
 */
export function exportToPGSJson(
  geometryState: UniversalGeometryState,
  auxiliaryState?: AuxiliaryState,
  options?: PGSExportOptions,
  pretty: boolean = true
): string {
  const passport = exportToPGS(geometryState, auxiliaryState, options);
  return encodePGSJson(passport, pretty);
}
