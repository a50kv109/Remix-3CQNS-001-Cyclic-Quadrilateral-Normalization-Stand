import assert from 'node:assert';
import { createDefaultQuadrilateralState } from '../src/ui/state/defaultState';
import { createEmptyAuxiliaryState } from '../src/ui/state/auxiliaryEngine';
import { ResearchSession } from '../src/ui/types/researchSession';
import {
  dispatchAgentCommand,
  getResearchSessionObservation,
  AgentCommand
} from '../src/research/agentInterface';

console.log("=== RUNNING R3-03 TWO-PLANE AGENT SCENARIO TEST ===");

// PHASE 1 — INITIAL OBSERVATION
const initialSession: ResearchSession = {
  plane1: { geoState: createDefaultQuadrilateralState(), auxState: createEmptyAuxiliaryState() },
  plane2: { geoState: createDefaultQuadrilateralState(), auxState: createEmptyAuxiliaryState() },
  activePlane: 'PLANE_1',
  plane2Lifecycle: 'BUILDING'
};

const obsPhase1 = getResearchSessionObservation(initialSession, 'scenario-session-001');

console.log("\n--- PHASE 1: INITIAL OBSERVATION ---");
console.log(`Session ID: ${obsPhase1.sessionId}`);
console.log(`Plane 1: stateVersion=${obsPhase1.plane1.stateVersion}, domainProfile=${obsPhase1.plane1.domainProfile}, pointsCount=${obsPhase1.plane1.snapshot.points.length}`);
console.log(`Plane 2: lifecycle=${obsPhase1.plane2.lifecycle}, stateVersion=${obsPhase1.plane2.stateVersion}, domainProfile=${obsPhase1.plane2.domainProfile}, pointsCount=${obsPhase1.plane2.snapshot.points.length}`);

assert.strictEqual(obsPhase1.plane1.planeId, 'PLANE_1');
assert.strictEqual(obsPhase1.plane2.planeId, 'PLANE_2');
assert.strictEqual(obsPhase1.plane2.lifecycle, 'BUILDING');
assert.strictEqual(obsPhase1.plane1.stateVersion, 1);
assert.strictEqual(obsPhase1.plane2.stateVersion, 1);
console.log("✓ Phase 1 Verified: Both planes exist independently in initial state.");

// PHASE 2 — BUILD REFERENCE ON PLANE_2
console.log("\n--- PHASE 2: BUILD REFERENCE ON PLANE_2 ---");
const buildReferenceCmd: AgentCommand = {
  planeId: 'PLANE_2',
  command: {
    type: 'CONSTRUCT_POINT',
    x: 75,
    y: 75,
    pointType: 'free'
  },
  metadata: {
    agentId: 'agent-001',
    intent: 'Construct reference calibration point on Plane 2'
  }
};

const { updatedSession: sessionAfterPhase2, result: resultPhase2 } = dispatchAgentCommand(initialSession, buildReferenceCmd);
const obsPhase2 = getResearchSessionObservation(sessionAfterPhase2, 'scenario-session-001');

console.log(`Command Result: success=${resultPhase2.success}, planeId=${resultPhase2.planeId}, updatedStateVersion=${resultPhase2.updatedStateVersion}`);
console.log(`Plane 1 Points: ${obsPhase2.plane1.snapshot.points.length}`);
console.log(`Plane 2 Points: ${obsPhase2.plane2.snapshot.points.length}`);

assert.strictEqual(resultPhase2.success, true);
assert.strictEqual(resultPhase2.planeId, 'PLANE_2');
assert.strictEqual(obsPhase2.plane2.snapshot.points.length, obsPhase1.plane2.snapshot.points.length + 1);
assert.strictEqual(obsPhase2.plane1.snapshot.points.length, obsPhase1.plane1.snapshot.points.length);
assert.strictEqual(sessionAfterPhase2.plane1.geoState.stateVersion, initialSession.plane1.geoState.stateVersion);
console.log("✓ Phase 2 Verified: Reference geometry built on Plane 2; Plane 1 remains pristine.");

// PHASE 3 — FIX REFERENCE (PLANE 2)
console.log("\n--- PHASE 3: FIX REFERENCE (PLANE 2) ---");
const sessionPhase3: ResearchSession = {
  ...sessionAfterPhase2,
  plane2Lifecycle: 'FIXED'
};

const obsPhase3 = getResearchSessionObservation(sessionPhase3, 'scenario-session-001');
console.log(`Plane 2 Lifecycle: ${obsPhase3.plane2.lifecycle}`);
console.log(`Plane 2 Fixed State Version: ${obsPhase3.plane2.stateVersion}`);

assert.strictEqual(obsPhase3.plane2.lifecycle, 'FIXED');
assert.strictEqual(obsPhase3.plane2.stateVersion, obsPhase2.plane2.stateVersion);
console.log("✓ Phase 3 Verified: Plane 2 lifecycle transitioned to FIXED.");

// PHASE 4 — EXPERIMENT ON PLANE_1
console.log("\n--- PHASE 4: EXPERIMENT ON PLANE_1 ---");
const experimentCmd: AgentCommand = {
  planeId: 'PLANE_1',
  command: {
    type: 'SET_CANONICAL_VERTEX_ANGLE',
    vertexId: 'A',
    angle: 45
  },
  metadata: {
    agentId: 'agent-001',
    intent: 'Mutate vertex angle A on Plane 1 to 45 degrees'
  }
};

const { updatedSession: sessionAfterPhase4, result: resultPhase4 } = dispatchAgentCommand(sessionPhase3, experimentCmd);
const obsPhase4 = getResearchSessionObservation(sessionAfterPhase4, 'scenario-session-001');

console.log(`Command Result: success=${resultPhase4.success}, planeId=${resultPhase4.planeId}, updatedStateVersion=${resultPhase4.updatedStateVersion}`);
console.log(`Plane 1 State Version: ${obsPhase4.plane1.stateVersion}`);
console.log(`Plane 2 State Version: ${obsPhase4.plane2.stateVersion}`);

assert.strictEqual(resultPhase4.success, true);
assert.strictEqual(resultPhase4.planeId, 'PLANE_1');
assert.strictEqual(obsPhase4.plane1.stateVersion, obsPhase3.plane1.stateVersion + 1);
assert.strictEqual(obsPhase4.plane2.stateVersion, obsPhase3.plane2.stateVersion);
assert.strictEqual(sessionAfterPhase4.plane2, sessionPhase3.plane2);
console.log("✓ Phase 4 Verified: Experimental mutation executed on Plane 1; Plane 2 remains 100% identical and locked.");

// Attempt forbidden mutation on FIXED Plane 2 to re-verify safety guard
const forbiddenCmd: AgentCommand = {
  planeId: 'PLANE_2',
  command: {
    type: 'SET_CANONICAL_VERTEX_ANGLE',
    vertexId: 'A',
    angle: 60
  }
};
const { result: forbiddenResult } = dispatchAgentCommand(sessionAfterPhase4, forbiddenCmd);
assert.strictEqual(forbiddenResult.success, false);
assert.strictEqual(forbiddenResult.errorCode, 'PLANE_FIXED_READ_ONLY');
console.log("✓ Safety Guard Re-verified: Attempted mutation on FIXED Plane 2 rejected with PLANE_FIXED_READ_ONLY.");

// PHASE 5 — FINAL OBSERVATION & SUMMARY
console.log("\n--- PHASE 5: FINAL OBSERVATION & SUMMARY ---");
const finalObs = getResearchSessionObservation(sessionAfterPhase4, 'scenario-session-001');

console.log(`
============================================================
              R3-03 RESEARCH SCENARIO REPORT
============================================================
Session ID:              ${finalObs.sessionId}
Active Plane (UI):       ${finalObs.uiMetadata?.activePlaneUI}

PLANE 1 (EXPERIMENTAL)
- Lifecycle:             ${finalObs.plane1.lifecycle}
- State Version:         ${finalObs.plane1.stateVersion}
- Domain Profile:        ${finalObs.plane1.domainProfile}
- Vertices Count:        ${finalObs.plane1.snapshot.metadata.vertexCount}
- Auxiliary Points:      ${finalObs.plane1.snapshot.points.length}
- Verification Status:   ${finalObs.plane1.verificationStatus}

PLANE 2 (REFERENCE)
- Lifecycle:             ${finalObs.plane2.lifecycle}
- State Version:         ${finalObs.plane2.stateVersion}
- Domain Profile:        ${finalObs.plane2.domainProfile}
- Vertices Count:        ${finalObs.plane2.snapshot.metadata.vertexCount}
- Auxiliary Points:      ${finalObs.plane2.snapshot.points.length}
- Verification Status:   ${finalObs.plane2.verificationStatus}
============================================================
`);

console.log("🎉 R3-03 TWO-PLANE SCENARIO TEST EXECUTED SUCCESSFULLY ON REAL INFRASTRUCTURE PATH! 🎉\n");
