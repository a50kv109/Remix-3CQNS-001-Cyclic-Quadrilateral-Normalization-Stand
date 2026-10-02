/**
 * CQNS-001 × PGS-2D End-to-End Portable Geometric State Experiment
 * 
 * Verifies full round-trip capability:
 * CONSTRUCT -> CQNS STATE -> PGS EXPORT -> .pgs.json -> RESET CQNS -> PGS IMPORT -> RESTORED CQNS -> GeometryCore VERIFY -> COMPARE
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';
import { UniversalGeometryState } from '../src/kernel/state/geometryState';
import { TopologyGuard } from '../src/kernel/topology/topologyGuard';
import { createDefaultQuadrilateralState, CANONICAL_CENTER, CANONICAL_RADIUS } from '../src/ui/state/defaultState';
import {
  exportToPGS,
  exportToPGSJson,
  importFromPGS,
  inspectPGS,
  PGSPassport,
  PGSImportResult,
  PGSInspectionSummary
} from '../src/kernel/pgsAdapter';
import { AuxiliaryState } from '../src/ui/types/auxiliaryTypes';
import { CyclicInput, CartesianInput, Point } from '../src/types/geometry';

const ROOT_DIR = process.cwd();

function extractPointsFromState(state: UniversalGeometryState): { points: Point[]; center: Point; radius: number } {
  if (state.domainProfile === 'CYCLIC') {
    const cyclicInput = state.canonicalInputs as CyclicInput;
    const center = cyclicInput.referenceCircle.center;
    const radius = cyclicInput.referenceCircle.radius;
    const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
    const points: Point[] = cyclicInput.angles.map((rawAngle, i) => {
      const normAngle = ((rawAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      return {
        id: labels[i] || `V${i + 1}`,
        x: center.x + radius * Math.cos(normAngle),
        y: center.y + radius * Math.sin(normAngle)
      };
    });
    return { points, center, radius };
  } else {
    const cartesianInput = state.canonicalInputs as CartesianInput;
    const points = [...cartesianInput.vertices];
    return { points, center: { id: 'O', x: 0, y: 0 }, radius: 160 };
  }
}

function calculateQuadMetrics(points: Point[]) {
  const N = points.length;
  const sideLengths: Record<string, number> = {};
  for (let i = 0; i < N; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % N];
    const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    sideLengths[`${p1.id}${p2.id}`] = Math.round(len * 1000) / 1000;
  }
  return sideLengths;
}

console.log('=== STARTING END-TO-END PGS-2D EXPERIMENT ===\n');

// ============================================================
// TEST CASE 1 — BASIC CYCLIC QUADRILATERAL
// ============================================================
console.log('--- TEST CASE 1: BASIC CYCLIC QUADRILATERAL ---');
const origState1 = createDefaultQuadrilateralState();
const origData1 = extractPointsFromState(origState1);
const origSides1 = calculateQuadMetrics(origData1.points);

console.log('Original State 1 Vertex Coordinates:');
origData1.points.forEach(p => console.log(`  Vertex ${p.id}: (${p.x.toFixed(4)}, ${p.y.toFixed(4)})`));
console.log(`Reference Circle: Center (${origData1.center.x}, ${origData1.center.y}), Radius=${origData1.radius}`);
console.log('Original Side Lengths:', origSides1);

// Export
const jsonStr1 = exportToPGSJson(origState1, undefined, {
  passportId: 'TEST_01_BASIC_CYCLIC_QUADRILATERAL',
  generatorName: 'CQNS-001 E2E Test Suite'
});
const passportPath1 = path.join(ROOT_DIR, 'TEST_01_BASIC_CYCLIC_QUADRILATERAL.pgs.json');
fs.writeFileSync(passportPath1, jsonStr1, 'utf-8');
console.log(`Exported passport saved to: ${passportPath1}`);

// Inspect
const passport1: PGSPassport = JSON.parse(jsonStr1);
const inspection1 = inspectPGS(passport1);
console.log('Passport 1 Inspection Summary:', {
  passportId: inspection1.passportId,
  pgsVersion: inspection1.pgsVersion,
  transferMode: inspection1.transferMode,
  objectCount: inspection1.objectCount,
  countsByType: inspection1.countsByType,
  countsByRole: inspection1.countsByRole,
  polygonTopology: inspection1.polygonTopology,
  validationIsValid: inspection1.validationReport.isValid
});

// RESET CQNS State
let workingState1: UniversalGeometryState | null = origState1;
workingState1 = null; // Evidence of reset
console.log('CQNS State Reset: workingState1 is now NULL');

// IMPORT
const importRes1: PGSImportResult = importFromPGS(jsonStr1);
assert.equal(importRes1.success, true, `Import 1 failed: ${importRes1.error}`);
const restoredState1 = importRes1.geometryState!;
const restoredData1 = extractPointsFromState(restoredState1);
const restoredSides1 = calculateQuadMetrics(restoredData1.points);

// Receiver Verification
const topoVal1 = TopologyGuard.validate(restoredState1);
console.log('Receiver GeometryCore Verification 1:', {
  passed: importRes1.receiverVerification.passed,
  verifiedBy: importRes1.receiverVerification.verifiedBy,
  topologyStatus: topoVal1.status,
  profile: topoVal1.profile,
  issues: topoVal1.issues
});

// Compare
let maxDiff1 = 0;
for (let i = 0; i < origData1.points.length; i++) {
  const op = origData1.points[i];
  const rp = restoredData1.points[i];
  assert.equal(op.id, rp.id, `Vertex ID mismatch at index ${i}: ${op.id} vs ${rp.id}`);
  const diff = Math.hypot(rp.x - op.x, rp.y - op.y);
  if (diff > maxDiff1) maxDiff1 = diff;
}
console.log(`Test 1 Max Coordinate Difference: ${maxDiff1.toExponential(4)} mm`);
assert.ok(maxDiff1 < 1e-3, 'Test 1 coordinates diverged');
console.log('Test 1 RESULT: ROUND_TRIP_SUCCESS\n');


// ============================================================
// TEST CASE 2 — ASYMMETRIC CYCLIC QUADRILATERAL
// ============================================================
console.log('--- TEST CASE 2: MODIFIED ASYMMETRIC GEOMETRY ---');
const degToRad = (d: number) => (d * Math.PI) / 180;
const asymAngles = [20, 105, 190, 310].map(degToRad);
const origState2 = UniversalGeometryState.createCyclic(CANONICAL_CENTER, CANONICAL_RADIUS, asymAngles, 'ASYMMETRIC_TEST');
const origData2 = extractPointsFromState(origState2);
const origSides2 = calculateQuadMetrics(origData2.points);

console.log('Original Asymmetric State Vertex Coordinates:');
origData2.points.forEach(p => console.log(`  Vertex ${p.id}: (${p.x.toFixed(4)}, ${p.y.toFixed(4)})`));
console.log('Original Side Lengths:', origSides2);

// Export
const jsonStr2 = exportToPGSJson(origState2, undefined, {
  passportId: 'TEST_02_ASYMMETRIC_CYCLIC_QUADRILATERAL',
  generatorName: 'CQNS-001 E2E Test Suite'
});
const passportPath2 = path.join(ROOT_DIR, 'TEST_02_ASYMMETRIC_CYCLIC_QUADRILATERAL.pgs.json');
fs.writeFileSync(passportPath2, jsonStr2, 'utf-8');
console.log(`Exported passport saved to: ${passportPath2}`);

// Inspect
const passport2: PGSPassport = JSON.parse(jsonStr2);
const inspection2 = inspectPGS(passport2);
console.log('Passport 2 Inspection Summary:', {
  passportId: inspection2.passportId,
  polygonTopology: inspection2.polygonTopology,
  validationIsValid: inspection2.validationReport.isValid
});

// RESET
let workingState2: UniversalGeometryState | null = origState2;
workingState2 = null;
console.log('CQNS State Reset: workingState2 is now NULL');

// IMPORT
const importRes2 = importFromPGS(jsonStr2);
assert.equal(importRes2.success, true, `Import 2 failed: ${importRes2.error}`);
const restoredState2 = importRes2.geometryState!;
const restoredData2 = extractPointsFromState(restoredState2);
const restoredSides2 = calculateQuadMetrics(restoredData2.points);

// Receiver Verification
const topoVal2 = TopologyGuard.validate(restoredState2);
console.log('Receiver GeometryCore Verification 2:', {
  passed: importRes2.receiverVerification.passed,
  topologyStatus: topoVal2.status,
  profile: topoVal2.profile,
  issues: topoVal2.issues
});

// Compare
let maxDiff2 = 0;
for (let i = 0; i < origData2.points.length; i++) {
  const op = origData2.points[i];
  const rp = restoredData2.points[i];
  assert.equal(op.id, rp.id);
  const diff = Math.hypot(rp.x - op.x, rp.y - op.y);
  if (diff > maxDiff2) maxDiff2 = diff;
}
console.log(`Test 2 Max Coordinate Difference: ${maxDiff2.toExponential(4)} mm`);
assert.ok(maxDiff2 < 1e-3, 'Test 2 coordinates diverged');
console.log('Test 2 RESULT: ROUND_TRIP_SUCCESS\n');


// ============================================================
// TEST CASE 3 — RICH GEOMETRIC STATE WITH RELATIONSHIPS
// ============================================================
console.log('--- TEST CASE 3: RICH GEOMETRIC STATE WITH ADDITIONAL RELATIONSHIPS ---');
const richAngles = [30, 120, 210, 300].map(degToRad);
const origState3 = UniversalGeometryState.createCyclic(CANONICAL_CENTER, CANONICAL_RADIUS, richAngles, 'RICH_TEST');
const origData3 = extractPointsFromState(origState3);

// Construct auxiliary state with diagonals and intersection
const auxState3: AuxiliaryState = {
  selectedEntityId: null,
  selectedEntityType: null,
  points: [
    { id: 'I1', label: 'E', x: 0, y: 0, type: 'intersection', parentIds: ['diag_A_C', 'diag_B_D'] }
  ],
  segments: [
    { id: 'diag_A_C', label: 'AC', p1Id: 'A', p2Id: 'C', type: 'diagonal', lengthMm: 320.0 },
    { id: 'diag_B_D', label: 'BD', p1Id: 'B', p2Id: 'D', type: 'diagonal', lengthMm: 320.0 },
    { id: 'aux_O_E', label: 'OE', p1Id: 'O', p2Id: 'I1', type: 'segment', lengthMm: 0.0 }
  ],
  lines: [],
  circles: [],
  measurements: []
};

// Export
const jsonStr3 = exportToPGSJson(origState3, auxState3, {
  passportId: 'TEST_03_RICH_CYCLIC_QUADRILATERAL',
  includeDiagonals: true,
  includeAuxiliary: true,
  includeDomainMetadata: true,
  generatorName: 'CQNS-001 E2E Test Suite'
});
const passportPath3 = path.join(ROOT_DIR, 'TEST_03_RICH_CYCLIC_QUADRILATERAL.pgs.json');
fs.writeFileSync(passportPath3, jsonStr3, 'utf-8');
console.log(`Exported passport saved to: ${passportPath3}`);

// Inspect
const passport3: PGSPassport = JSON.parse(jsonStr3);
const inspection3 = inspectPGS(passport3);
console.log('Passport 3 Inspection Summary:', {
  passportId: inspection3.passportId,
  objectCount: inspection3.objectCount,
  countsByType: inspection3.countsByType,
  countsByRole: inspection3.countsByRole,
  polygonTopology: inspection3.polygonTopology,
  validationIsValid: inspection3.validationReport.isValid
});

// RESET
let workingState3: UniversalGeometryState | null = origState3;
let workingAux3: AuxiliaryState | null = auxState3;
workingState3 = null;
workingAux3 = null;
console.log('CQNS State Reset: workingState3 and workingAux3 are now NULL');

// IMPORT
const importRes3 = importFromPGS(jsonStr3);
assert.equal(importRes3.success, true, `Import 3 failed: ${importRes3.error}`);
const restoredState3 = importRes3.geometryState!;
const restoredAux3 = importRes3.auxiliaryState!;

// Receiver Verification
const topoVal3 = TopologyGuard.validate(restoredState3);
console.log('Receiver GeometryCore Verification 3:', {
  passed: importRes3.receiverVerification.passed,
  topologyStatus: topoVal3.status,
  diagonalsRestored: restoredAux3.segments.filter(s => s.type === 'diagonal').length
});

assert.equal(restoredAux3.segments.filter(s => s.type === 'diagonal').length, 2, 'Diagonals AC and BD should be preserved as diagonals');
console.log('Test 3 RESULT: ROUND_TRIP_SUCCESS\n');


// ============================================================
// TEST CASE 4 — FAILURE / INVALID PASSPORT TEST
// ============================================================
console.log('--- TEST CASE 4: FAILURE / INVALID PASSPORT TEST ---');

// Corrupt Passport 1 by changing transferMode to invalid value and deleting objects
const corruptPassport = JSON.parse(jsonStr1);
corruptPassport.transferMode = 'INVALID_MODE' as any;
delete corruptPassport.objects;

const corruptJson = JSON.stringify(corruptPassport, null, 2);
const corruptPath = path.join(ROOT_DIR, 'TEST_04_CORRUPTED_PASSPORT.pgs.json');
fs.writeFileSync(corruptPath, corruptJson, 'utf-8');

console.log(`Corrupted passport written to: ${corruptPath}`);
const corruptImportRes = importFromPGS(corruptJson);

console.log('Corrupted Import Attempt Result:', {
  success: corruptImportRes.success,
  error: corruptImportRes.error,
  isValid: corruptImportRes.validationReport.isValid,
  validationErrors: corruptImportRes.validationReport.errors
});

assert.equal(corruptImportRes.success, false, 'Corrupted passport import MUST fail');
assert.ok(corruptImportRes.validationReport.errors.length > 0, 'Structural errors must be reported');
console.log('Failure Test RESULT: REJECTED_AS_EXPECTED\n');

// Clean up temporary corrupted file
fs.unlinkSync(corruptPath);

console.log('=== ALL E2E PGS EXPERIMENTS COMPLETED SUCCESSFULLY ===');
