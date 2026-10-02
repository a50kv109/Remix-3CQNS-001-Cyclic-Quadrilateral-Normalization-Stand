/**
 * R3 PGS-2D Integration & Gateway Test Suite
 * 
 * Verifies:
 * TEST 1: CQNS Polygon(4) -> PGS Exact State
 * TEST 2: PGS Exact State -> CQNS
 * TEST 3: Portable identity preservation (portableId vs localId)
 * TEST 4: Boundary topology preservation
 * TEST 5: EDGE vs DIAGONAL preservation (boundary edges vs internal diagonals)
 * TEST 6: Coordinate and state preservation
 * TEST 7: PGS structural validation before import
 * TEST 8: CQNS GeometryCore verification after import
 * TEST 9: CQNS -> PGS -> CQNS round trip
 * TEST 10: Source verification claim does not bypass receiver verification
 * TEST 11: Unsupported PGS capability is reported explicitly
 * TEST 12: No PGS dependency leaks into GeometryCore
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { UniversalGeometryState } from '../src/kernel/state/geometryState';
import { createDefaultQuadrilateralState } from '../src/ui/state/defaultState';
import {
  exportToPGS,
  exportToPGSJson,
  importFromPGS,
  inspectPGS,
  validatePGSPassport,
  decodePGSJson,
  encodePGSJson
} from '../src/kernel/pgsAdapter';
import { PolygonGeometry, SegmentGeometry } from '../src/kernel/pgs/pgsTypes';

describe('CQNS-001 × PGS-2D Gateway Test Suite', () => {
  // TEST 1: CQNS Polygon(4) -> PGS Exact State
  it('TEST 1: CQNS Polygon(4) -> PGS Exact State', () => {
    const geoState = createDefaultQuadrilateralState();
    const passport = exportToPGS(geoState);

    assert.equal(passport.pgsVersion, '0.1');
    assert.equal(passport.transferMode, 'EXACT_STATE');
    assert.ok(passport.passportId.startsWith('pgs_cqns_'));
    assert.equal(passport.units.length, 'mm');

    // Find primary polygon
    const poly = passport.objects.find((o) => o.semanticType === 'polygon' && o.semanticRole === 'primary');
    assert.ok(poly, 'Primary polygon must exist');
    assert.equal(poly.displayLabel, 'ABCD');
    const geom = poly.geometry as PolygonGeometry;
    assert.equal(geom.vertexIds.length, 4);
    assert.equal(geom.edgeIds?.length, 4);
    assert.equal(geom.isClosed, true);
  });

  // TEST 2: PGS Exact State -> CQNS
  it('TEST 2: PGS Exact State -> CQNS', () => {
    const geoState = createDefaultQuadrilateralState();
    const passportJson = exportToPGSJson(geoState);

    const importRes = importFromPGS(passportJson);
    assert.equal(importRes.success, true, `Import failed: ${importRes.error}`);
    assert.ok(importRes.geometryState, 'GeometryState must be reconstructed');
    assert.equal(importRes.geometryState.vertexCount, 4);
    assert.equal(importRes.receiverVerification.passed, true);
  });

  // TEST 3: Portable identity preservation
  it('TEST 3: Portable identity preservation (portableId vs localId)', () => {
    const geoState = createDefaultQuadrilateralState();
    const passport = exportToPGS(geoState);

    // Verify identity map
    assert.equal(passport.identityMap?.['pt_A'], 'A');
    assert.equal(passport.identityMap?.['pt_B'], 'B');
    assert.equal(passport.identityMap?.['pt_C'], 'C');
    assert.equal(passport.identityMap?.['pt_D'], 'D');
    assert.equal(passport.identityMap?.['pt_O'], 'O');

    const importRes = importFromPGS(passport);
    assert.equal(importRes.identityMap['pt_A'], 'A');
    assert.equal(importRes.reverseIdentityMap['A'], 'pt_A');
  });

  // TEST 4: Boundary topology preservation
  it('TEST 4: Boundary topology preservation', () => {
    const geoState = createDefaultQuadrilateralState();
    const passport = exportToPGS(geoState);

    const poly = passport.objects.find((o) => o.semanticType === 'polygon')!;
    const geom = poly.geometry as PolygonGeometry;

    assert.deepEqual(geom.vertexIds, ['pt_A', 'pt_B', 'pt_C', 'pt_D']);
    assert.deepEqual(geom.edgeIds, ['edge_AB', 'edge_BC', 'edge_CD', 'edge_DA']);

    // Check edge start/end integrity
    const edgeAB = passport.objects.find((o) => o.portableId === 'edge_AB')!;
    const geomAB = edgeAB.geometry as SegmentGeometry;
    assert.equal(geomAB.startPointId, 'pt_A');
    assert.equal(geomAB.endPointId, 'pt_B');
    assert.equal(edgeAB.semanticRole, 'boundary');
  });

  // TEST 5: EDGE vs DIAGONAL preservation
  it('TEST 5: EDGE vs DIAGONAL preservation', () => {
    const geoState = createDefaultQuadrilateralState();
    const passport = exportToPGS(geoState, undefined, { includeDiagonals: true });

    // Boundary edges
    const edges = passport.objects.filter((o) => o.semanticType === 'segment' && o.semanticRole === 'boundary');
    assert.equal(edges.length, 4, 'Must have exactly 4 boundary edges');

    // Diagonals
    const diagonals = passport.objects.filter((o) => o.semanticType === 'segment' && o.semanticRole === 'diagonal');
    assert.equal(diagonals.length, 2, 'Must have exactly 2 diagonals');

    const diagAC = passport.objects.find((o) => o.portableId === 'diag_AC');
    assert.ok(diagAC);
    assert.equal(diagAC.semanticRole, 'diagonal');

    // Polygon boundary edgeIds must NOT contain diagonals
    const poly = passport.objects.find((o) => o.semanticType === 'polygon')!;
    const geom = poly.geometry as PolygonGeometry;
    assert.ok(!geom.edgeIds?.includes('diag_AC'), 'Diagonals must not be inside polygon boundary edgeIds');
    assert.ok(!geom.edgeIds?.includes('diag_BD'), 'Diagonals must not be inside polygon boundary edgeIds');
  });

  // TEST 6: Coordinate/state preservation
  it('TEST 6: Coordinate/state preservation within numerical epsilon', () => {
    const geoState = createDefaultQuadrilateralState();
    const passport = exportToPGS(geoState);

    const ptA = passport.objects.find((o) => o.portableId === 'pt_A')!;
    const geomA = ptA.geometry as { x: number; y: number };

    // Default square radius 160 at 45 deg: x = 160*cos(45) = 113.137, y = 113.137
    assert.ok(Math.abs(geomA.x - 113.137) < 0.01);
    assert.ok(Math.abs(geomA.y - 113.137) < 0.01);

    const importRes = importFromPGS(passport);
    assert.equal(importRes.success, true);
  });

  // TEST 7: PGS structural validation before import
  it('TEST 7: PGS structural validation before import', () => {
    const geoState = createDefaultQuadrilateralState();
    const passport = exportToPGS(geoState);

    // Valid passport
    const rep1 = validatePGSPassport(passport);
    assert.equal(rep1.isValid, true);
    assert.equal(rep1.errors.length, 0);

    // Corrupted passport (missing vertex point)
    const corrupted = JSON.parse(JSON.stringify(passport));
    corrupted.objects = corrupted.objects.filter((o: any) => o.portableId !== 'pt_C');

    const rep2 = validatePGSPassport(corrupted);
    assert.equal(rep2.isValid, false);
    assert.ok(rep2.errors.some((e) => e.includes('pt_C')));

    const importRes = importFromPGS(corrupted);
    assert.equal(importRes.success, false);
    assert.ok(importRes.error !== undefined);
  });

  // TEST 8: CQNS GeometryCore verification after import
  it('TEST 8: CQNS GeometryCore verification after import', () => {
    const geoState = createDefaultQuadrilateralState();
    const passportJson = exportToPGSJson(geoState);

    const importRes = importFromPGS(passportJson);
    assert.equal(importRes.success, true);
    assert.equal(importRes.receiverVerification.passed, true);
    assert.ok(importRes.receiverVerification.verifiedBy.includes('TopologyGuard'));
  });

  // TEST 9: CQNS -> PGS -> CQNS round trip
  it('TEST 9: CQNS -> PGS -> CQNS round trip preserves cyclic topology', () => {
    const initialGeo = createDefaultQuadrilateralState();
    const passport = exportToPGS(initialGeo);

    const importRes = importFromPGS(passport);
    assert.equal(importRes.success, true);

    const finalGeo = importRes.geometryState!;
    assert.equal(finalGeo.domainProfile, 'CYCLIC');
    assert.equal(finalGeo.vertexCount, initialGeo.vertexCount);

    // Re-export round-tripped state and check structural equivalence
    const passport2 = exportToPGS(finalGeo);
    assert.equal(passport2.objects.length, passport.objects.length);
  });

  // TEST 10: Source verification claim does not bypass receiver verification
  it('TEST 10: Source verification claim does not bypass receiver verification', () => {
    const initialGeo = createDefaultQuadrilateralState();
    const passport = exportToPGS(initialGeo);

    // Passport claims verified = true
    assert.equal(passport.sourceClaim?.verified, true);

    // Tamper with points to create duplicate/coincident vertices
    const tampered = JSON.parse(JSON.stringify(passport));
    const ptA = tampered.objects.find((o: any) => o.portableId === 'pt_A');
    const ptB = tampered.objects.find((o: any) => o.portableId === 'pt_B');
    ptB.geometry.x = ptA.geometry.x;
    ptB.geometry.y = ptA.geometry.y;

    const importRes = importFromPGS(tampered);
    // Receiver validation must catch the topology error even though sourceClaim.verified was true
    assert.equal(importRes.success, false);
    assert.equal(importRes.receiverVerification.passed, false);
    assert.ok(importRes.error?.includes('Topology validation failed'));
  });

  // TEST 11: Unsupported PGS capability is reported explicitly
  it('TEST 11: Unsupported PGS capability is reported explicitly', () => {
    const geoState = createDefaultQuadrilateralState();
    const passport = exportToPGS(geoState);

    const unsupported = {
      ...passport,
      transferMode: 'CONSTRUCTIVE_STATE' as any
    };

    const importRes = importFromPGS(unsupported);
    assert.equal(importRes.success, false);
    assert.ok(importRes.unsupportedCapabilities.length > 0);
    assert.ok(importRes.unsupportedCapabilities[0].includes('CONSTRUCTIVE_STATE'));
  });

  // TEST 12: No PGS dependency leaks into GeometryCore
  it('TEST 12: No PGS dependency leaks into GeometryCore', () => {
    // Read kernel files and ensure they do NOT import from pgsAdapter or pgs
    const kernelDir = path.resolve(process.cwd(), 'remix2/src/kernel');
    const geometryCorePath = path.join(kernelDir, 'dag/geometryCore.ts');
    const geometryStatePath = path.join(kernelDir, 'state/geometryState.ts');
    const topologyGuardPath = path.join(kernelDir, 'topology/topologyGuard.ts');

    const coreContent = fs.readFileSync(geometryCorePath, 'utf8');
    const stateContent = fs.readFileSync(geometryStatePath, 'utf8');
    const topoContent = fs.readFileSync(topologyGuardPath, 'utf8');

    assert.ok(!coreContent.includes('pgs'), 'geometryCore must not import pgs');
    assert.ok(!coreContent.includes('PGSPassport'), 'geometryCore must not reference PGSPassport');
    assert.ok(!stateContent.includes('pgs'), 'geometryState must not import pgs');
    assert.ok(!topoContent.includes('pgs'), 'topologyGuard must not import pgs');
  });
});
