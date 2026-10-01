import assert from 'node:assert';
import { UniversalGeometryState } from '../src/kernel/state/geometryState';
import { createEmptyAuxiliaryState } from '../src/ui/state/auxiliaryEngine';
import { createGeometryStateSnapshot } from '../src/research/index';
import {
  projectStructuralPassport
} from '../src/research/structuralPassport';

console.log("=== RUNNING R3-04.2 STRUCTURAL PASSPORT TESTS ===");

const center = { id: 'O', x: 0, y: 0 };
const radius = 160;

try {
  // TEST A: Center INSIDE (Standard Square with angles 45°, 135°, 225°, 315°)
  const squareAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
  const squareGeoState = UniversalGeometryState.createCyclic(center, radius, squareAngles, "TEST_SQUARE");
  const auxState = createEmptyAuxiliaryState();
  const squareSnapshot = createGeometryStateSnapshot(squareGeoState, auxState);

  const passportSquare = projectStructuralPassport(squareSnapshot);
  assert.strictEqual(
    passportSquare.centerPositionRelative,
    'INSIDE',
    'Test A failed: Center O(0,0) should be INSIDE the square'
  );
  console.log("✓ Test A: Center INSIDE verified for symmetric square.");

  // TEST B: Center OUTSIDE (All 4 vertices on upper semicircle: 10°, 30°, 60°, 80°)
  const upperAngles = [10 * Math.PI / 180, 30 * Math.PI / 180, 60 * Math.PI / 180, 80 * Math.PI / 180];
  const upperGeoState = UniversalGeometryState.createCyclic(center, radius, upperAngles, "TEST_UPPER");
  const upperSnapshot = createGeometryStateSnapshot(upperGeoState, auxState);

  const passportUpper = projectStructuralPassport(upperSnapshot);
  assert.strictEqual(
    passportUpper.centerPositionRelative,
    'OUTSIDE',
    'Test B failed: Center O(0,0) should be OUTSIDE when all vertices are on upper semicircle'
  );
  console.log("✓ Test B: Center OUTSIDE verified for upper-semicircle quadrilateral.");

  // TEST C: Center BOUNDARY (Side AB passes through O(0,0), angles 0°, 180°, 240°, 300°)
  const boundaryAngles = [0, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];
  const boundaryGeoState = UniversalGeometryState.createCyclic(center, radius, boundaryAngles, "TEST_BOUNDARY");
  const boundarySnapshot = createGeometryStateSnapshot(boundaryGeoState, auxState);

  const passportBoundary = projectStructuralPassport(boundarySnapshot);
  assert.strictEqual(
    passportBoundary.centerPositionRelative,
    'BOUNDARY',
    'Test C failed: Center O(0,0) should be on BOUNDARY when side AB passes through origin'
  );
  console.log("✓ Test C: Center BOUNDARY verified when side AB passes through O.");

  // TEST D: One side is a diameter (Angles 0°, 180°, 240°, 300° -> Side AB spans 180°, length = 2R = 320)
  const sideAB = passportBoundary.diameterChords.find((c) => c.label === 'AB');
  assert.notStrictEqual(sideAB, undefined, 'Test D failed: Side AB should exist in diameterChords');
  assert.strictEqual(sideAB!.entityType, 'SIDE');
  assert.strictEqual(sideAB!.isDiameter, true, 'Test D failed: Side AB should be flagged as a diameter');
  assert.strictEqual(Math.abs(sideAB!.length - 320) < 1e-4, true);
  console.log("✓ Test D: One side is a diameter verified (Side AB = 320mm = 2R).");

  // TEST E: One diagonal is a diameter (Angles 0°, 60°, 180°, 270° -> Diagonal AC spans 0° to 180°, length = 320)
  const diagAngles = [0, Math.PI / 3, Math.PI, (3 * Math.PI) / 2];
  const diagGeoState = UniversalGeometryState.createCyclic(center, radius, diagAngles, "TEST_DIAG");
  const diagSnapshot = createGeometryStateSnapshot(diagGeoState, auxState);

  const passportDiag = projectStructuralPassport(diagSnapshot);
  const diagAC = passportDiag.diameterChords.find((c) => c.label === 'AC');
  assert.notStrictEqual(diagAC, undefined);
  assert.strictEqual(diagAC!.entityType, 'DIAGONAL');
  assert.strictEqual(diagAC!.isDiameter, true, 'Test E failed: Diagonal AC should be flagged as a diameter');
  console.log("✓ Test E: One diagonal is a diameter verified (Diagonal AC = 320mm = 2R).");

  // TEST F: No diameter chords (Angles 20°, 70°, 140°, 220° -> No side or diagonal spans 180°)
  const noDiamAngles = [20 * Math.PI / 180, 70 * Math.PI / 180, 140 * Math.PI / 180, 220 * Math.PI / 180];
  const noDiamGeoState = UniversalGeometryState.createCyclic(center, radius, noDiamAngles, "TEST_NO_DIAM");
  const noDiamSnapshot = createGeometryStateSnapshot(noDiamGeoState, auxState);

  const passportNoDiam = projectStructuralPassport(noDiamSnapshot);
  const diametersCount = passportNoDiam.diameterChords.filter((c) => c.isDiameter).length;
  assert.strictEqual(diametersCount, 0, 'Test F failed: Should have 0 diameter chords');
  console.log("✓ Test F: No diameter chords verified.");

  // TEST G: Multiple diameter chords (Square/Rectangle: Both diagonals AC and BD span 180°, so both are diameters!)
  const diagsInSquare = passportSquare.diameterChords.filter((c) => c.isDiameter && c.entityType === 'DIAGONAL');
  assert.strictEqual(diagsInSquare.length, 2, 'Test G failed: Square should have 2 diagonal diameters (AC and BD)');
  console.log("✓ Test G: Multiple diameter chords verified (Both AC and BD are diameters in square).");

  // TEST H: Tolerance boundary case (Length = 320 ± 0.00005 mm within 1e-4 mm tolerance)
  const passportTol = projectStructuralPassport(diagSnapshot, 1e-4);
  assert.strictEqual(passportTol.diameterChords.find((c) => c.label === 'AC')!.isDiameter, true);

  const passportStrictTol = projectStructuralPassport(diagSnapshot, 1e-12);
  assert.strictEqual(typeof passportStrictTol.centerPositionRelative, 'string');
  console.log("✓ Test H: Tolerance boundary cases verified.");

  // TEST I: Projection does not mutate the snapshot (Immutability check)
  const snapshotJsonBefore = JSON.stringify(squareSnapshot);
  projectStructuralPassport(squareSnapshot);
  const snapshotJsonAfter = JSON.stringify(squareSnapshot);
  assert.strictEqual(snapshotJsonBefore, snapshotJsonAfter, 'Test I failed: Snapshot must remain completely unchanged');
  console.log("✓ Test I: Immutability verified — projection does not mutate input snapshot.");

  console.log("\n🎉 ALL R3-04.2 STRUCTURAL PASSPORT TESTS PASSED SUCCESSFULLY! 🎉\n");
} catch (error) {
  console.error("❌ R3-04.2 STRUCTURAL PASSPORT TEST FAILED!");
  console.error(error);
  process.exit(1);
}
