/**
 * R3-02 — Headless Agent Interface Adapter
 * Unified, headless Agent Interface for multi-plane ResearchSession operations.
 */

import { UniversalGeometryState } from '../kernel/state/geometryState';
import { TopologyGuard } from '../kernel/topology/topologyGuard';
import { AuxiliaryState } from '../ui/types/auxiliaryTypes';
import { SemanticCommand, SemanticCommandType } from '../ui/types/semanticCommands';
import { ResearchSession, PlaneSession } from '../ui/types/researchSession';
import { GeometryStateSnapshot } from '../types/snapshot';
import { createGeometryStateSnapshot } from './index';
import { dispatchSemanticCommand, CommandExecutionContext } from '../ui/state/commandDispatcher';

export type PlaneAddress = 'PLANE_1' | 'PLANE_2';

export interface ObjectAddress {
  readonly planeId: PlaneAddress;
  readonly localId: string;
}

export interface AgentCommand<TCommand extends SemanticCommand = SemanticCommand> {
  readonly planeId: PlaneAddress;
  readonly command: TCommand;
  readonly expectedStateVersion?: number;
  readonly metadata?: {
    readonly agentId: string;
    readonly intent?: string;
    readonly timestamp?: string;
  };
}

export interface PlaneObservation {
  readonly planeId: PlaneAddress;
  readonly lifecycle: 'BUILDING' | 'FIXED';
  readonly stateVersion: number;
  readonly domainProfile: 'CYCLIC' | 'CARTESIAN';
  readonly snapshot: GeometryStateSnapshot;
  readonly verificationStatus: 'VALID' | 'DEGENERATE' | 'INVALID';
}

export interface AgentObservation {
  readonly sessionId: string;
  readonly plane1: PlaneObservation;
  readonly plane2: PlaneObservation;
  readonly uiMetadata?: {
    readonly activePlaneUI: PlaneAddress;
  };
}

export type AgentErrorCode =
  | 'INVALID_PLANE'
  | 'PLANE_FIXED_READ_ONLY'
  | 'CONCURRENCY_STATE_MISMATCH'
  | 'INVALID_COMMAND'
  | 'COMMAND_REJECTED';

export interface AgentExecutionResult {
  readonly success: boolean;
  readonly planeId: PlaneAddress;
  readonly commandType: SemanticCommandType;
  readonly errorCode?: AgentErrorCode;
  readonly message?: string;
  readonly updatedStateVersion?: number;
  readonly observation?: PlaneObservation;
}

/**
 * Creates a PlaneObservation DTO for a given plane session.
 */
export function createPlaneObservation(
  planeId: PlaneAddress,
  planeSession: PlaneSession,
  lifecycle: 'BUILDING' | 'FIXED'
): PlaneObservation {
  const snapshot = createGeometryStateSnapshot(
    planeSession.geoState,
    planeSession.auxState
  );

  const report = TopologyGuard.validate(planeSession.geoState);

  return {
    planeId,
    lifecycle,
    stateVersion: planeSession.geoState.stateVersion,
    domainProfile: planeSession.geoState.domainProfile,
    snapshot,
    verificationStatus: report.status === 'VALID' ? 'VALID' : 'DEGENERATE'
  };
}

/**
 * Produces a full ResearchSessionObservation DTO.
 */
export function getResearchSessionObservation(
  session: ResearchSession,
  sessionId: string = 'research-session-1'
): AgentObservation {
  return {
    sessionId,
    plane1: createPlaneObservation('PLANE_1', session.plane1, 'BUILDING'),
    plane2: createPlaneObservation('PLANE_2', session.plane2, session.plane2Lifecycle),
    uiMetadata: {
      activePlaneUI: session.activePlane
    }
  };
}

/**
 * Helper to check if a command type mutates geometry/state.
 */
function isMutationCommand(type: SemanticCommandType): boolean {
  const readOnlyTypes: SemanticCommandType[] = [
    'GET_ACTIVE_SNAPSHOT',
    'GET_ENTITY_MEASUREMENT',
    'GET_CHECKPOINT_INFO',
    'MEASURE_DISTANCE'
  ];
  return !readOnlyTypes.includes(type);
}

/**
 * Build CommandExecutionContext for a target plane session.
 */
function buildExecutionContext(planeSession: PlaneSession): CommandExecutionContext {
  const geoState = planeSession.geoState;
  const derivedVertices = geoState.getDerivedCartesianVertices();
  const cyclicInputs = geoState.canonicalInputs as any;

  const centerPt = cyclicInputs?.referenceCircle
    ? {
        id: 'O',
        x: cyclicInputs.referenceCircle.center.x,
        y: cyclicInputs.referenceCircle.center.y
      }
    : { id: 'O', x: 0, y: 0 };

  const radiusVal = cyclicInputs?.referenceCircle ? cyclicInputs.referenceCircle.radius : 160;

  const baseChords = derivedVertices.map((v, idx) => {
    const nextV = derivedVertices[(idx + 1) % derivedVertices.length];
    return {
      id: `chord_${v.id}_${nextV.id}`,
      p1: { id: v.id, x: v.x, y: v.y },
      p2: { id: nextV.id, x: nextV.x, y: nextV.y },
      label: `chord_${v.id}_${nextV.id}`
    };
  });

  return {
    canonicalVertices: derivedVertices.map((v, idx) => ({
      id: v.id,
      cartesian: { id: v.id, x: v.x, y: v.y },
      label: ['A', 'B', 'C', 'D', 'E', 'F'][idx] || v.id
    })),
    circumcircle: {
      center: centerPt,
      radius: radiusVal
    },
    baseChords,
    auxiliaryState: planeSession.auxState,
    geometryState: geoState
  };
}

/**
 * Dispatches an AgentCommand to the explicitly addressed plane.
 * NEVER uses activePlane as routing target.
 */
export function dispatchAgentCommand(
  session: ResearchSession,
  agentCommand: AgentCommand
): { updatedSession: ResearchSession; result: AgentExecutionResult } {
  const planeId = agentCommand.planeId;
  if (planeId !== 'PLANE_1' && planeId !== 'PLANE_2') {
    return {
      updatedSession: session,
      result: {
        success: false,
        planeId,
        commandType: agentCommand.command?.type ?? 'SELECT',
        errorCode: 'INVALID_PLANE',
        message: `Invalid planeId: ${planeId}`
      }
    };
  }

  if (!agentCommand.command || !agentCommand.command.type) {
    return {
      updatedSession: session,
      result: {
        success: false,
        planeId,
        commandType: 'SELECT',
        errorCode: 'INVALID_COMMAND',
        message: 'Command payload is invalid or missing type'
      }
    };
  }

  const targetPlaneSession = planeId === 'PLANE_1' ? session.plane1 : session.plane2;
  const targetLifecycle = planeId === 'PLANE_1' ? 'BUILDING' : session.plane2Lifecycle;

  // 1. Concurrency Check
  if (
    agentCommand.expectedStateVersion !== undefined &&
    agentCommand.expectedStateVersion !== targetPlaneSession.geoState.stateVersion
  ) {
    return {
      updatedSession: session,
      result: {
        success: false,
        planeId,
        commandType: agentCommand.command.type,
        errorCode: 'CONCURRENCY_STATE_MISMATCH',
        message: `State version mismatch on ${planeId}: expected ${agentCommand.expectedStateVersion}, found ${targetPlaneSession.geoState.stateVersion}`
      }
    };
  }

  // 2. Fixed Plane 2 Guard
  if (planeId === 'PLANE_2' && session.plane2Lifecycle === 'FIXED' && isMutationCommand(agentCommand.command.type)) {
    return {
      updatedSession: session,
      result: {
        success: false,
        planeId,
        commandType: agentCommand.command.type,
        errorCode: 'PLANE_FIXED_READ_ONLY',
        message: 'Plane 2 is FIXED and protected against canonical mutation'
      }
    };
  }

  // 3. Dispatch to CommandDispatcher
  const execContext = buildExecutionContext(targetPlaneSession);
  const dispatchResult = dispatchSemanticCommand(agentCommand.command, execContext);

  if (dispatchResult.status !== 'SUCCESS' || !dispatchResult.success) {
    return {
      updatedSession: session,
      result: {
        success: false,
        planeId,
        commandType: agentCommand.command.type,
        errorCode: 'COMMAND_REJECTED',
        message: dispatchResult.message || `Command ${agentCommand.command.type} rejected by dispatcher`
      }
    };
  }

  // 4. Update Target Plane Session
  const nextGeoState = dispatchResult.updatedGeometryState || targetPlaneSession.geoState;
  const nextAuxState = dispatchResult.updatedAuxiliaryState || targetPlaneSession.auxState;

  const updatedPlaneSession: PlaneSession = {
    geoState: nextGeoState,
    auxState: nextAuxState
  };

  const updatedSession: ResearchSession = {
    ...session,
    plane1: planeId === 'PLANE_1' ? updatedPlaneSession : session.plane1,
    plane2: planeId === 'PLANE_2' ? updatedPlaneSession : session.plane2
  };

  const updatedObservation = createPlaneObservation(planeId, updatedPlaneSession, targetLifecycle);

  return {
    updatedSession,
    result: {
      success: true,
      planeId,
      commandType: agentCommand.command.type,
      updatedStateVersion: nextGeoState.stateVersion,
      observation: updatedObservation
    }
  };
}
