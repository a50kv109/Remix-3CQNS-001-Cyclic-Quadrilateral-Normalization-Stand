/**
 * Research Session Container Types
 * R3-01: Two-plane independent state management
 */

import { UniversalGeometryState } from '../../kernel/state/geometryState';
import { AuxiliaryState } from '../types/auxiliaryTypes';

export type PlaneId = 'PLANE_1' | 'PLANE_2';
export type Plane2Lifecycle = 'BUILDING' | 'FIXED';

export interface PlaneSession {
  readonly geoState: UniversalGeometryState;
  readonly auxState: AuxiliaryState;
}

export interface ResearchSession {
  readonly plane1: PlaneSession;
  readonly plane2: PlaneSession;
  readonly activePlane: PlaneId;
  readonly plane2Lifecycle: Plane2Lifecycle;
}
