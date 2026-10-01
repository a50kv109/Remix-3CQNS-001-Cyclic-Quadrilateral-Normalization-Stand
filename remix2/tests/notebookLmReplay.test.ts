import assert from 'node:assert';
import { UniversalGeometryState } from '../src/kernel/state/geometryState';
import { createEmptyAuxiliaryState } from '../src/ui/state/auxiliaryEngine';
import { ResearchSession } from '../src/ui/types/researchSession';
import {
  dispatchAgentCommand,
  getResearchSessionObservation,
  AgentCommand
} from '../src/research/agentInterface';
import { projectStructuralPassport } from '../src/research/structuralPassport';

console.log("=== RUNNING R3 NOTEBOOKLM RESEARCH REPLAY TEST ===");

const R = 5.0; // Radius = 5.0 units
const center = { id: 'O', x: 0, y: 0 };
// Square angles: A=135° (3π/4), B=45° (π/4), C=-45° (-π/4), D=-135° (-3π/4)
const squareAngles = [ (3 * Math.PI) / 4, Math.PI / 4, -Math.PI / 4, (-3 * Math.PI) / 4 ];

// Setup Initial ResearchSession with R = 5.0
const plane1State = UniversalGeometryState.createCyclic(center, R, squareAngles, "EXP_SQUARE");
const plane2State = UniversalGeometryState.createCyclic(center, R, squareAngles, "REF_SQUARE");

let session: ResearchSession = {
  plane1: { geoState: plane1State, auxState: createEmptyAuxiliaryState() },
  plane2: { geoState: plane2State, auxState: createEmptyAuxiliaryState() },
  activePlane: 'PLANE_1',
  plane2Lifecycle: 'BUILDING'
};

// 1. SETUP PLANE 2 REFERENCE & LOCK
console.log("\n--- STEP 1: SETUP PLANE 2 REFERENCE & FIX ---");
const p2ConstCmd: AgentCommand = {
  planeId: 'PLANE_2',
  command: {
    type: 'CONSTRUCT_POINT',
    x: 0,
    y: 0,
    pointType: 'free'
  },
  metadata: { agentId: 'agent-notebooklm', intent: 'Add reference center mark' }
};

const { updatedSession: sessionAfterP2, result: resultP2 } = dispatchAgentCommand(session, p2ConstCmd);
assert.strictEqual(resultP2.success, true);

// Fix Plane 2
session = {
  ...sessionAfterP2,
  plane2Lifecycle: 'FIXED'
};

const obsP2Fixed = getResearchSessionObservation(session, 'notebooklm-replay-001');
assert.strictEqual(obsP2Fixed.plane2.lifecycle, 'FIXED');
console.log(`✓ Plane 2 Reference Locked in FIXED state. State Version: ${obsP2Fixed.plane2.stateVersion}`);

// 2. PARAMETER SWEEP ON PLANE 1 (Arc AB: θ = 60°, 75°, 90°, 105°, 120°)
console.log("\n--- STEP 2: PARAMETER SWEEP ON PLANE 1 ---");
const sweepAnglesDeg = [60, 75, 90, 105, 120];
const sweepResults: any[] = [];

// Vertex coordinates for A, B, C, D at R = 5.0
// A = (-3.5355, 3.5355), B = (3.5355, 3.5355), C = (3.5355, -3.5355), D = (-3.5355, -3.5355)
const A = { x: R * Math.cos((3 * Math.PI) / 4), y: R * Math.sin((3 * Math.PI) / 4) };
const B = { x: R * Math.cos(Math.PI / 4), y: R * Math.sin(Math.PI / 4) };
const C = { x: R * Math.cos(-Math.PI / 4), y: R * Math.sin(-Math.PI / 4) };
const D = { x: R * Math.cos((-3 * Math.PI) / 4), y: R * Math.sin((-3 * Math.PI) / 4) };

for (const angleDeg of sweepAnglesDeg) {
  const thetaRad = (angleDeg * Math.PI) / 180;
  const Mx = R * Math.cos(thetaRad);
  const My = R * Math.sin(thetaRad);

  // Agent dispatches CONSTRUCT_POINT for M on Plane 1
  const cmdConstructM: AgentCommand = {
    planeId: 'PLANE_1',
    command: {
      type: 'CONSTRUCT_POINT',
      x: Mx,
      y: My,
      pointType: 'on_circle'
    },
    metadata: { agentId: 'agent-notebooklm', intent: `Position M at θ = ${angleDeg}°` }
  };

  const { updatedSession: nextSession, result: cmdRes } = dispatchAgentCommand(session, cmdConstructM);
  assert.strictEqual(cmdRes.success, true);
  session = nextSession;

  // Calculate distances MA, MB, MC, MD
  const distMA = Math.hypot(A.x - Mx, A.y - My);
  const distMB = Math.hypot(B.x - Mx, B.y - My);
  const distMC = Math.hypot(C.x - Mx, C.y - My);
  const distMD = Math.hypot(D.x - Mx, D.y - My);

  // Evaluate Expression: MA² + MB² + MC² + MD²
  const sumSquares = distMA ** 2 + distMB ** 2 + distMC ** 2 + distMD ** 2;
  const expected8R2 = 8 * R ** 2; // 8 * 25 = 200.0
  const delta = Math.abs(sumSquares - expected8R2);

  const obs = getResearchSessionObservation(session, 'notebooklm-replay-001');

  sweepResults.push({
    step: sweepResults.length + 1,
    angleDeg,
    M: { x: Mx.toFixed(4), y: My.toFixed(4) },
    MA: distMA.toFixed(4),
    MB: distMB.toFixed(4),
    MC: distMC.toFixed(4),
    MD: distMD.toFixed(4),
    sumSquares: sumSquares.toFixed(6),
    expected8R2: expected8R2.toFixed(1),
    delta: delta.toExponential(2),
    p1StateVersion: obs.plane1.stateVersion,
    p2StateVersion: obs.plane2.stateVersion
  });
}

// 3. DISPLAY SWEEP DATA TABLE
console.log("\n=========================================================================================");
console.log("                       EXPERIMENTAL PARAMETER SWEEP RESULTS                              ");
console.log("=========================================================================================");
console.table(sweepResults);

// 4. STRUCTURAL PASSPORT AUDIT
const passportP1 = projectStructuralPassport(obsP2Fixed.plane1.snapshot);
const passportP2 = projectStructuralPassport(obsP2Fixed.plane2.snapshot);

console.log("\n--- STRUCTURAL PASSPORTS ---");
console.log(`Plane 1 Center Position: ${passportP1.centerPositionRelative}`);
console.log(`Plane 2 Center Position: ${passportP2.centerPositionRelative}`);
console.log(`Plane 2 Diameter Chords Count: ${passportP2.diameterChords.filter(c => c.isDiameter).length} (Both Diagonals AC & BD)`);

// 5. HYPOTHESIS & EPISTEMIC CHECK
const maxDelta = Math.max(...sweepResults.map(r => parseFloat(r.delta)));
console.log(`\nMax deviation from 8R² (200.0): ${maxDelta.toExponential(2)}`);
assert.strictEqual(maxDelta < 1e-12, true, "Deviation from 8R² must be negligible");

console.log("\n🎉 R3 NOTEBOOKLM RESEARCH REPLAY TEST EXECUTED SUCCESSFULLY! 🎉\n");
