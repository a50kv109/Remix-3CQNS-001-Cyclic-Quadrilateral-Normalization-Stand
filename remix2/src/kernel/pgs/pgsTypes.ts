/**
 * PGS-2D (Portable Geometric State 2D) Type Definitions
 * Specification Version: 0.1
 * 
 * Stand-agnostic semantic contract for transferring 2D geometric state
 * between independent Geometry Stands and external downstream tools.
 */

export type PGSSemanticType =
  | 'point'
  | 'segment'
  | 'line'
  | 'circle'
  | 'polygon'
  | 'angle'
  | 'composite';

export type PGSSemanticRole =
  | 'primary'
  | 'boundary'
  | 'diagonal'
  | 'auxiliary'
  | 'construction'
  | 'measurement'
  | 'reference'
  | 'derived';

export type PGSTransferMode =
  | 'EXACT_STATE'
  | 'CONSTRUCTIVE_STATE'
  | 'HYBRID_STATE';

export interface PointGeometry {
  readonly x: number;
  readonly y: number;
}

export interface SegmentGeometry {
  readonly startPointId: string;
  readonly endPointId: string;
  readonly length?: number;
}

export interface LineGeometry {
  readonly point1Id: string;
  readonly point2Id: string;
  readonly isInfinite: boolean;
}

export interface CircleGeometry {
  readonly centerPointId: string;
  readonly radius: number;
}

export interface PolygonGeometry {
  readonly vertexIds: readonly string[];
  readonly edgeIds?: readonly string[];
  readonly isClosed: boolean;
}

export interface AngleGeometry {
  readonly vertexPointId: string;
  readonly arm1PointId: string;
  readonly arm2PointId: string;
  readonly angleRad?: number;
  readonly angleDeg?: number;
}

export type PGSGeometry =
  | PointGeometry
  | SegmentGeometry
  | LineGeometry
  | CircleGeometry
  | PolygonGeometry
  | AngleGeometry;

export interface ConstructionReference {
  readonly operation: string;
  readonly inputEntityIds: readonly string[];
  readonly parameters?: Record<string, any>;
}

export interface RelationRecord {
  readonly relationType: string;
  readonly targetEntityIds: readonly string[];
  readonly metadata?: Record<string, any>;
}

export interface ConstraintRecord {
  readonly constraintType: string;
  readonly targetEntityIds: readonly string[];
  readonly expression?: string;
}

export interface MeasurementRecord {
  readonly measurementType: 'distance' | 'angle' | 'area' | 'ratio';
  readonly value: number;
  readonly unit: string;
  readonly targetEntityIds: readonly string[];
}

export interface PGSObject {
  readonly portableId: string;
  readonly semanticType: PGSSemanticType;
  readonly semanticRole: PGSSemanticRole;
  readonly displayLabel?: string;
  readonly geometry: PGSGeometry;
  readonly construction?: ConstructionReference;
  readonly relations?: readonly RelationRecord[];
  readonly constraints?: readonly ConstraintRecord[];
  readonly measurements?: readonly MeasurementRecord[];
  readonly domainMetadata?: Record<string, any>;
}

export interface PGSGeneratorInfo {
  readonly name: string;
  readonly version: string;
  readonly standId?: string;
}

export interface PGSUnits {
  readonly length: 'mm' | 'm' | 'unit';
  readonly angle: 'rad' | 'deg';
}

export interface PGSSourceClaim {
  readonly verified: boolean;
  readonly engine?: string;
  readonly timestamp?: string;
  readonly checksum?: string;
}

export interface PGSPassport {
  readonly pgsVersion: string;
  readonly passportId: string;
  readonly transferMode: PGSTransferMode;
  readonly generator: PGSGeneratorInfo;
  readonly timestamp: string;
  readonly units: PGSUnits;
  readonly objects: readonly PGSObject[];
  readonly identityMap?: Record<string, string>; // portableId -> localId
  readonly domainMetadata?: Record<string, any>;
  readonly sourceClaim?: PGSSourceClaim;
}

export interface PGSValidationReport {
  readonly isValid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

export interface PGSInspectionSummary {
  readonly pgsVersion: string;
  readonly passportId: string;
  readonly transferMode: PGSTransferMode;
  readonly generator: PGSGeneratorInfo;
  readonly timestamp: string;
  readonly objectCount: number;
  readonly countsByType: Record<PGSSemanticType, number>;
  readonly countsByRole: Record<PGSSemanticRole, number>;
  readonly polygonTopology?: {
    readonly vertexCount: number;
    readonly boundaryEdges: readonly string[];
    readonly isClosed: boolean;
  };
  readonly sourceClaim?: PGSSourceClaim;
  readonly validationReport: PGSValidationReport;
}
