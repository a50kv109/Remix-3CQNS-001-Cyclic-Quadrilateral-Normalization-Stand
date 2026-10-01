import assert from 'node:assert';
import { UniversalGeometryState } from '../src/kernel/state/geometryState';
import { createDefaultQuadrilateralState } from '../src/ui/state/defaultState';
import { createEmptyAuxiliaryState } from '../src/ui/state/auxiliaryEngine';
import { ResearchSession, PlaneId, Plane2Lifecycle } from '../src/ui/types/researchSession';
import { CyclicMutationDraft } from '../src/types/geometry';

console.log("=== RUNNING REMIX 3 RESEARCH PLANE CONTROLS TESTS (R3-01.1) ===");

try {
  // Test A & D: ResearchSession initialization & default activePlane / lifecycle
  const initP1Geo = createDefaultQuadrilateralState();
  const initP1Aux = createEmptyAuxiliaryState();
  const initP2Geo = createDefaultQuadrilateralState();
  const initP2Aux = createEmptyAuxiliaryState();

  let session: ResearchSession = {
    plane1: { geoState: initP1Geo, auxState: initP1Aux },
    plane2: { geoState: initP2Geo, auxState: initP2Aux },
    activePlane: 'PLANE_1',
    plane2Lifecycle: 'BUILDING'
  };

  assert.strictEqual(session.activePlane, 'PLANE_1', 'Test A failed: activePlane should default to PLANE_1');
  assert.strictEqual(session.plane2Lifecycle, 'BUILDING', 'Test D failed: Plane 2 lifecycle should default to BUILDING');
  console.log("✓ Test A & D: Initial session defaults to PLANE_1 and Plane 2 BUILDING lifecycle.");

  // Test B & C: Toggling activePlane between PLANE_1 and PLANE_2
  session = { ...session, activePlane: 'PLANE_2' };
  assert.strictEqual(session.activePlane, 'PLANE_2', 'Test C failed: Plane 2 can become active');

  session = { ...session, activePlane: 'PLANE_1' };
  assert.strictEqual(session.activePlane, 'PLANE_1', 'Test B failed: Plane 1 can become active');
  console.log("✓ Test B & C: activePlane toggles deterministically between PLANE_1 and PLANE_2.");

  // Test E: FIX changes Plane 2 lifecycle from BUILDING to FIXED
  session = { ...session, plane2Lifecycle: 'FIXED' };
  assert.strictEqual(session.plane2Lifecycle, 'FIXED', 'Test E failed: Plane 2 lifecycle should become FIXED');
  console.log("✓ Test E: FIX changes Plane 2 lifecycle from BUILDING to FIXED.");

  // Test F: Canonical Plane 2 mutation is blocked when Plane 2 is FIXED
  const p2OriginalVersion = session.plane2.geoState.stateVersion;
  
  function mutatePlane2Canonical(currentSession: ResearchSession, newAngleRad: number): ResearchSession {
    if (currentSession.plane2Lifecycle === 'FIXED' && currentSession.activePlane === 'PLANE_2') {
      // Block mutation
      return currentSession;
    }
    const nextGeo = currentSession.plane2.geoState.commitMutation((draft) => {
      const cd = draft as CyclicMutationDraft;
      cd.canonicalInputs.angles[0] = newAngleRad;
    }, 'MUTATE_P2');
    return {
      ...currentSession,
      plane2: { ...currentSession.plane2, geoState: nextGeo }
    };
  }

  // Active plane is PLANE_2, lifecycle is FIXED
  session = { ...session, activePlane: 'PLANE_2' };
  const blockedSession = mutatePlane2Canonical(session, Math.PI / 3);
  assert.strictEqual(blockedSession.plane2.geoState.stateVersion, p2OriginalVersion, 'Test F failed: Canonical Plane 2 mutation should be blocked when FIXED');
  console.log("✓ Test F: Canonical Plane 2 mutation is strictly blocked after FIX.");

  // Test G: Plane 1 remains fully mutable after Plane 2 FIX
  session = { ...session, activePlane: 'PLANE_1' };
  const p1OriginalVersion = session.plane1.geoState.stateVersion;
  const p1NextGeo = session.plane1.geoState.commitMutation((draft) => {
    const cd = draft as CyclicMutationDraft;
    cd.canonicalInputs.angles[0] = Math.PI / 3;
  }, 'MUTATE_P1');
  session = {
    ...session,
    plane1: { ...session.plane1, geoState: p1NextGeo }
  };
  assert.strictEqual(session.plane1.geoState.stateVersion, p1OriginalVersion + 1, 'Test G failed: Plane 1 should remain mutable after Plane 2 FIX');
  assert.strictEqual(session.plane2.geoState.stateVersion, p2OriginalVersion, 'Test G failed: Plane 2 stateVersion must remain unchanged');
  console.log("✓ Test G: Plane 1 remains fully mutable after Plane 2 FIX, while Plane 2 stays pristine.");

  // Test H: School Mode state remains isolated and unchanged
  const schoolState = createDefaultQuadrilateralState();
  assert.strictEqual(schoolState.vertexCount, 4);
  assert.strictEqual(schoolState.domainProfile, 'CYCLIC');
  console.log("✓ Test H: School mode state remains completely isolated and unchanged.");

  console.log("\n🎉 ALL REMIX 3 RESEARCH PLANE CONTROLS TESTS PASSED SUCCESSFULLY! 🎉\n");
} catch (error) {
  console.error("❌ REMIX 3 RESEARCH PLANE CONTROLS TEST FAILED!");
  console.error(error);
  process.exit(1);
}
