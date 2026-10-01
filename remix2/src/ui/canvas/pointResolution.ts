/**
 * Universal Point-First Resolution & Confirmation Layer
 * R3 — Point-First Interactive Geometry Construction
 */

import { SnapTarget, AuxiliaryState, AuxiliaryPointType } from '../types/auxiliaryTypes';
import { CommandExecutionResult } from '../state/commandDispatcher';
import { SemanticCommand } from '../types/semanticCommands';

export interface PointResolutionContext {
  readonly currentAuxiliaryState: AuxiliaryState;
  readonly executeCommand: (cmd: SemanticCommand, auxiliaryOverride?: AuxiliaryState) => CommandExecutionResult;
}

export interface ResolvedPointResult {
  readonly success: boolean;
  readonly pointId: string | null;
  readonly pointCoord: { readonly x: number; readonly y: number };
  readonly isDynamic: boolean;
  readonly pointType: AuxiliaryPointType;
  readonly parentId?: string;
  readonly updatedAuxiliaryState: AuxiliaryState;
  readonly message?: string;
}

/**
 * Universal Point Resolver & Confirmer
 * 
 * Rules:
 * 1. Existing Point/Vertex/Center:
 *    If snap.entityType is 'vertex', 'point', or 'center', reuse its entityId directly (no new point created).
 * 2. Snap on Segment / Line:
 *    If snap.entityType is 'segment' or 'line', do NOT use snap.entityId as point ID!
 *    Construct an 'on_segment' point at the click/projected coordinate with parentId = snap.entityId.
 * 3. Snap on Circle:
 *    If snap.entityType is 'circle', construct an 'on_circle' point at the click/projected coordinate.
 * 4. Free Canvas (no snap):
 *    Construct a 'free' point at the click coordinate.
 */
export function resolveOrCreatePoint(
  clickPt: { x: number; y: number },
  snap: SnapTarget | null,
  ctx: PointResolutionContext
): ResolvedPointResult {
  const { currentAuxiliaryState, executeCommand } = ctx;

  // Case A: Snap to already existing point or vertex
  if (snap) {
    if (snap.entityType === 'vertex' && snap.entityId) {
      return {
        success: true,
        pointId: snap.entityId,
        pointCoord: { x: snap.x, y: snap.y },
        isDynamic: false,
        pointType: 'free',
        updatedAuxiliaryState: currentAuxiliaryState
      };
    }
    if (snap.entityType === 'point' && snap.entityId) {
      return {
        success: true,
        pointId: snap.entityId,
        pointCoord: { x: snap.x, y: snap.y },
        isDynamic: false,
        pointType: 'free',
        updatedAuxiliaryState: currentAuxiliaryState
      };
    }
    if (snap.entityType === 'center') {
      return {
        success: true,
        pointId: snap.entityId || 'O',
        pointCoord: { x: snap.x, y: snap.y },
        isDynamic: false,
        pointType: 'free',
        updatedAuxiliaryState: currentAuxiliaryState
      };
    }

    // Case B: Snap to Segment / Line (must construct a point on segment)
    if (snap.entityType === 'segment' || snap.entityType === 'line') {
      const ptRes = executeCommand(
        {
          type: 'CONSTRUCT_POINT',
          x: snap.x,
          y: snap.y,
          pointType: 'on_segment',
          parentId: snap.entityId
        },
        currentAuxiliaryState
      );

      if (ptRes.success && ptRes.createdEntityIds.length > 0) {
        const createdId = ptRes.createdEntityIds[0];
        const createdPt = ptRes.updatedAuxiliaryState.points.find((p) => p.id === createdId);
        return {
          success: true,
          pointId: createdId,
          pointCoord: createdPt ? { x: createdPt.x, y: createdPt.y } : { x: snap.x, y: snap.y },
          isDynamic: true,
          pointType: 'on_segment',
          parentId: snap.entityId,
          updatedAuxiliaryState: ptRes.updatedAuxiliaryState
        };
      }
      return {
        success: false,
        pointId: null,
        pointCoord: { x: snap.x, y: snap.y },
        isDynamic: false,
        pointType: 'on_segment',
        updatedAuxiliaryState: currentAuxiliaryState,
        message: ptRes.message || 'Failed to create point on segment'
      };
    }

    // Case C: Snap to Circle (must construct a point on circle)
    if (snap.entityType === 'circle') {
      const ptRes = executeCommand(
        {
          type: 'CONSTRUCT_POINT',
          x: snap.x,
          y: snap.y,
          pointType: 'on_circle',
          parentId: snap.entityId
        },
        currentAuxiliaryState
      );

      if (ptRes.success && ptRes.createdEntityIds.length > 0) {
        const createdId = ptRes.createdEntityIds[0];
        const createdPt = ptRes.updatedAuxiliaryState.points.find((p) => p.id === createdId);
        return {
          success: true,
          pointId: createdId,
          pointCoord: createdPt ? { x: createdPt.x, y: createdPt.y } : { x: snap.x, y: snap.y },
          isDynamic: true,
          pointType: 'on_circle',
          parentId: snap.entityId,
          updatedAuxiliaryState: ptRes.updatedAuxiliaryState
        };
      }
      return {
        success: false,
        pointId: null,
        pointCoord: { x: snap.x, y: snap.y },
        isDynamic: false,
        pointType: 'on_circle',
        updatedAuxiliaryState: currentAuxiliaryState,
        message: ptRes.message || 'Failed to create point on circle'
      };
    }

    // Case D: Snap to Intersection Candidate (constructs a first-class intersection point)
    if (snap.entityType === 'intersection_candidate' && snap.parentIds) {
      const ptRes = executeCommand(
        {
          type: 'CONSTRUCT_INTERSECTION',
          entity1Id: snap.parentIds[0],
          entity2Id: snap.parentIds[1]
        },
        currentAuxiliaryState
      );

      if (ptRes.success && ptRes.createdEntityIds.length > 0) {
        const createdId = ptRes.createdEntityIds[0];
        const createdPt = ptRes.updatedAuxiliaryState.points.find((p) => p.id === createdId);
        return {
          success: true,
          pointId: createdId,
          pointCoord: createdPt ? { x: createdPt.x, y: createdPt.y } : { x: snap.x, y: snap.y },
          isDynamic: true,
          pointType: 'intersection',
          parentId: snap.parentIds[0],
          updatedAuxiliaryState: ptRes.updatedAuxiliaryState
        };
      }
      return {
        success: false,
        pointId: null,
        pointCoord: { x: snap.x, y: snap.y },
        isDynamic: false,
        pointType: 'intersection',
        updatedAuxiliaryState: currentAuxiliaryState,
        message: ptRes.message || 'Failed to materialize intersection point'
      };
    }
  }

  // Case D: Free canvas (no snap) -> construct a free point
  const ptRes = executeCommand(
    {
      type: 'CONSTRUCT_POINT',
      x: clickPt.x,
      y: clickPt.y,
      pointType: 'free'
    },
    currentAuxiliaryState
  );

  if (ptRes.success && ptRes.createdEntityIds.length > 0) {
    const createdId = ptRes.createdEntityIds[0];
    const createdPt = ptRes.updatedAuxiliaryState.points.find((p) => p.id === createdId);
    return {
      success: true,
      pointId: createdId,
      pointCoord: createdPt ? { x: createdPt.x, y: createdPt.y } : { x: clickPt.x, y: clickPt.y },
      isDynamic: true,
      pointType: 'free',
      updatedAuxiliaryState: ptRes.updatedAuxiliaryState
    };
  }

  return {
    success: false,
    pointId: null,
    pointCoord: { x: clickPt.x, y: clickPt.y },
    isDynamic: false,
    pointType: 'free',
    updatedAuxiliaryState: currentAuxiliaryState,
    message: ptRes.message || 'Failed to create point'
  };
}

/**
 * Helper to rollback a point created dynamically if a subsequent construction command fails
 */
export function rollbackDynamicPoint(
  pointId: string,
  currentAux: AuxiliaryState,
  executeCommand: (cmd: SemanticCommand, auxiliaryOverride?: AuxiliaryState) => CommandExecutionResult
): void {
  executeCommand({ type: 'ERASE_ENTITY', entityId: pointId }, currentAux);
}
