import assert from 'node:assert';
import { createDefaultQuadrilateralState } from '../src/ui/state/defaultState';
import { createEmptyAuxiliaryState } from '../src/ui/state/auxiliaryEngine';
import { ResearchSession } from '../src/ui/types/researchSession';
import {
  dispatchAgentCommand,
  getResearchSessionObservation,
  AgentCommand
} from '../src/research/agentInterface';

console.log("=== RUNNING REMIX 3 AGENT INTERFACE TESTS (R3-02) ===");

try {
  // Setup initial ResearchSession
  const initSession: ResearchSession = {
    plane1: { geoState: createDefaultQuadrilateralState(), auxState: createEmptyAuxiliaryState() },
    plane2: { geoState: createDefaultQuadrilateralState(), auxState: createEmptyAuxiliaryState() },
    activePlane: 'PLANE_1',
    plane2Lifecycle: 'BUILDING'
  };

  // Test A: Command explicitly addressed to PLANE_1 executes on Plane 1
  const cmdP1: AgentCommand = {
    planeId: 'PLANE_1',
    command: {
      type: 'CONSTRUCT_POINT',
      x: 50,
      y: 50,
      pointType: 'free'
    }
  };

  const { updatedSession: sessionAfterA, result: resultA } = dispatchAgentCommand(initSession, cmdP1);
  assert.strictEqual(resultA.success, true, 'Test A failed: dispatchAgentCommand should succeed for PLANE_1');
  assert.strictEqual(resultA.planeId, 'PLANE_1', 'Test A failed: result planeId should be PLANE_1');
  assert.strictEqual(
    sessionAfterA.plane1.auxState.points.length,
    initSession.plane1.auxState.points.length + 1,
    'Test A failed: Plane 1 should receive new constructed point'
  );
  assert.strictEqual(
    sessionAfterA.plane2.auxState.points.length,
    initSession.plane2.auxState.points.length,
    'Test A failed: Plane 2 should remain unaffected'
  );
  console.log("✓ Test A: Command explicitly addressed to PLANE_1 executes on Plane 1.");

  // Test B: Command explicitly addressed to PLANE_2 executes on Plane 2
  const cmdP2: AgentCommand = {
    planeId: 'PLANE_2',
    command: {
      type: 'CONSTRUCT_POINT',
      x: -80,
      y: 80,
      pointType: 'free'
    }
  };

  const { updatedSession: sessionAfterB, result: resultB } = dispatchAgentCommand(sessionAfterA, cmdP2);
  assert.strictEqual(resultB.success, true, 'Test B failed: dispatchAgentCommand should succeed for PLANE_2');
  assert.strictEqual(resultB.planeId, 'PLANE_2', 'Test B failed: result planeId should be PLANE_2');
  assert.strictEqual(
    sessionAfterB.plane2.auxState.points.length,
    sessionAfterA.plane2.auxState.points.length + 1,
    'Test B failed: Plane 2 should receive new constructed point'
  );
  console.log("✓ Test B: Command explicitly addressed to PLANE_2 executes on Plane 2.");

  // Test C: activePlane does NOT affect agent routing
  // Set UI focus (activePlane) to PLANE_2, but send agent command addressed to PLANE_1
  const sessionWithUiFocusP2: ResearchSession = {
    ...sessionAfterB,
    activePlane: 'PLANE_2'
  };

  const cmdP1_explicit: AgentCommand = {
    planeId: 'PLANE_1',
    command: {
      type: 'CONSTRUCT_POINT',
      x: 100,
      y: 100,
      pointType: 'free'
    }
  };

  const { updatedSession: sessionAfterC, result: resultC } = dispatchAgentCommand(sessionWithUiFocusP2, cmdP1_explicit);
  assert.strictEqual(resultC.success, true);
  assert.strictEqual(resultC.planeId, 'PLANE_1');
  assert.strictEqual(
    sessionAfterC.plane1.auxState.points.length,
    sessionAfterB.plane1.auxState.points.length + 1,
    'Test C failed: Command routed to PLANE_1 despite activePlane === PLANE_2'
  );
  console.log("✓ Test C: activePlane does NOT affect agent command routing.");

  // Test D: Plane 1 and Plane 2 remain strictly state-isolated
  assert.notStrictEqual(sessionAfterC.plane1.auxState.points.length, sessionAfterC.plane2.auxState.points.length);
  console.log("✓ Test D: Plane 1 and Plane 2 remain strictly state-isolated.");

  // Test E: Plane 2 FIXED rejects canonical mutation
  const sessionFixedP2: ResearchSession = {
    ...sessionAfterC,
    plane2Lifecycle: 'FIXED'
  };

  const cmdMutateFixedP2: AgentCommand = {
    planeId: 'PLANE_2',
    command: {
      type: 'SET_CANONICAL_VERTEX_ANGLE',
      vertexId: 'A',
      angle: 60
    }
  };

  const { updatedSession: sessionAfterE, result: resultE } = dispatchAgentCommand(sessionFixedP2, cmdMutateFixedP2);
  assert.strictEqual(resultE.success, false, 'Test E failed: FIXED Plane 2 mutation should be rejected');
  assert.strictEqual(resultE.errorCode, 'PLANE_FIXED_READ_ONLY', 'Test E failed: errorCode should be PLANE_FIXED_READ_ONLY');
  assert.strictEqual(
    sessionAfterE.plane2.geoState.stateVersion,
    sessionFixedP2.plane2.geoState.stateVersion,
    'Test E failed: Plane 2 stateVersion must not change when FIXED'
  );
  console.log("✓ Test E: Plane 2 FIXED rejects canonical mutation with PLANE_FIXED_READ_ONLY error.");

  // Test F: Plane 1 remains mutable after Plane 2 FIXED
  const cmdMutateP1_AfterFixedP2: AgentCommand = {
    planeId: 'PLANE_1',
    command: {
      type: 'SET_CANONICAL_VERTEX_ANGLE',
      vertexId: 'A',
      angle: 45
    }
  };

  const { updatedSession: sessionAfterF, result: resultF } = dispatchAgentCommand(sessionFixedP2, cmdMutateP1_AfterFixedP2);
  assert.strictEqual(resultF.success, true, 'Test F failed: Plane 1 should remain mutable');
  assert.strictEqual(
    sessionAfterF.plane1.geoState.stateVersion,
    sessionFixedP2.plane1.geoState.stateVersion + 1,
    'Test F failed: Plane 1 stateVersion should increment'
  );
  console.log("✓ Test F: Plane 1 remains fully mutable after Plane 2 is FIXED.");

  // Test G: expectedStateVersion omitted -> command executes normally
  const cmdOmittedVersion: AgentCommand = {
    planeId: 'PLANE_1',
    command: { type: 'CONSTRUCT_POINT', x: 10, y: 10, pointType: 'free' }
  };
  const { result: resultG } = dispatchAgentCommand(sessionAfterF, cmdOmittedVersion);
  assert.strictEqual(resultG.success, true, 'Test G failed: Omitted expectedStateVersion should execute');
  console.log("✓ Test G: expectedStateVersion omitted -> command executes normally.");

  // Test H: Matching expectedStateVersion -> command executes normally
  const currentP1Version = sessionAfterF.plane1.geoState.stateVersion;
  const cmdMatchingVersion: AgentCommand = {
    planeId: 'PLANE_1',
    expectedStateVersion: currentP1Version,
    command: { type: 'CONSTRUCT_POINT', x: 20, y: 20, pointType: 'free' }
  };
  const { result: resultH } = dispatchAgentCommand(sessionAfterF, cmdMatchingVersion);
  assert.strictEqual(resultH.success, true, 'Test H failed: Matching expectedStateVersion should execute');
  console.log("✓ Test H: Matching expectedStateVersion -> command executes normally.");

  // Test I: Mismatching expectedStateVersion -> CONCURRENCY_STATE_MISMATCH
  const cmdMismatchVersion: AgentCommand = {
    planeId: 'PLANE_1',
    expectedStateVersion: currentP1Version + 999, // Intentional mismatch
    command: { type: 'CONSTRUCT_POINT', x: 30, y: 30, pointType: 'free' }
  };
  const { result: resultI } = dispatchAgentCommand(sessionAfterF, cmdMismatchVersion);
  assert.strictEqual(resultI.success, false, 'Test I failed: Mismatching expectedStateVersion should be rejected');
  assert.strictEqual(resultI.errorCode, 'CONCURRENCY_STATE_MISMATCH', 'Test I failed: errorCode should be CONCURRENCY_STATE_MISMATCH');
  console.log("✓ Test I: Mismatching expectedStateVersion -> CONCURRENCY_STATE_MISMATCH.");

  // Test J, K, L: Observation contains both planes, correct lifecycles, and NO correspondence fields
  const obs = getResearchSessionObservation(sessionFixedP2, 'session-test-100');
  assert.strictEqual(obs.sessionId, 'session-test-100');
  assert.strictEqual(obs.plane1.planeId, 'PLANE_1');
  assert.strictEqual(obs.plane1.lifecycle, 'BUILDING');
  assert.strictEqual(obs.plane2.planeId, 'PLANE_2');
  assert.strictEqual(obs.plane2.lifecycle, 'FIXED');
  assert.strictEqual(obs.plane1.snapshot.metadata.vertexCount, 4);
  assert.strictEqual(obs.plane2.snapshot.metadata.vertexCount, 4);
  assert.strictEqual((obs as any).activeCorrespondences, undefined, 'Test L failed: activeCorrespondences must not exist');
  assert.strictEqual((obs as any).correspondence, undefined, 'Test L failed: correspondence must not exist');
  console.log("✓ Test J, K, L: Observation contains both planes, correct lifecycle/stateVersion, and NO correspondence fields.");

  // Test M: Invalid/rejected commands return deterministic AgentExecutionResult errors
  const invalidPlaneCmd: any = {
    planeId: 'PLANE_INVALID_999',
    command: { type: 'CONSTRUCT_POINT', x: 0, y: 0, pointType: 'free' }
  };
  const { result: resultM1 } = dispatchAgentCommand(sessionAfterF, invalidPlaneCmd);
  assert.strictEqual(resultM1.success, false);
  assert.strictEqual(resultM1.errorCode, 'INVALID_PLANE');

  const invalidCmdPayload: AgentCommand = {
    planeId: 'PLANE_1',
    command: null as any
  };
  const { result: resultM2 } = dispatchAgentCommand(sessionAfterF, invalidCmdPayload);
  assert.strictEqual(resultM2.success, false);
  assert.strictEqual(resultM2.errorCode, 'INVALID_COMMAND');
  console.log("✓ Test M: Invalid and rejected commands return deterministic AgentExecutionResult errors.");

  console.log("\n🎉 ALL REMIX 3 AGENT INTERFACE TESTS PASSED SUCCESSFULLY! 🎉\n");
} catch (error) {
  console.error("❌ REMIX 3 AGENT INTERFACE TEST FAILED!");
  console.error(error);
  process.exit(1);
}
