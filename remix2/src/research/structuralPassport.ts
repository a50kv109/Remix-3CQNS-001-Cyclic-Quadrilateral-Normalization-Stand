/**
 * R3-04.2 — Structural Passport Projection
 * Pure research projection module deriving structural metrics from GeometryStateSnapshot.
 * Does NOT mutate snapshot, does NOT create VERIFIED facts, does NOT introduce a second geometry engine.
 */

import { GeometryStateSnapshot, SnapshotPoint } from '../types/snapshot';

export type CenterPositionRelative = 'INSIDE' | 'OUTSIDE' | 'BOUNDARY';

export type ChordEntityType = 'SIDE' | 'DIAGONAL';

export interface DiameterChordInfo {
  readonly entityId: string;
  readonly entityType: ChordEntityType;
  readonly label: string;
  readonly p1Id: string;
  readonly p2Id: string;
  readonly length: number;
  readonly isDiameter: boolean;
}

export interface StructuralPassport {
  readonly centerPositionRelative: CenterPositionRelative;
  readonly diameterChords: readonly DiameterChordInfo[];
}

function euclideanDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

/**
 * Checks if point O lies on segment P-Q within specified tolerance epsilon.
 */
function isPointOnSegment(
  O: { x: number; y: number },
  P: { x: number; y: number },
  Q: { x: number; y: number },
  eps: number = 1e-4
): boolean {
  const distPO = euclideanDistance(P, O);
  const distOQ = euclideanDistance(O, Q);
  const distPQ = euclideanDistance(P, Q);
  return Math.abs(distPO + distOQ - distPQ) < eps;
}

/**
 * Determines position of center O relative to polygon vertices (INSIDE / OUTSIDE / BOUNDARY).
 */
export function determineCenterPositionRelative(
  center: { x: number; y: number },
  vertices: readonly SnapshotPoint[],
  eps: number = 1e-4
): CenterPositionRelative {
  if (vertices.length < 3) {
    return 'OUTSIDE';
  }

  const n = vertices.length;

  // 1. Check BOUNDARY: Does center lie on any boundary segment V_i -> V_{i+1}?
  for (let i = 0; i < n; i++) {
    const P = vertices[i];
    const Q = vertices[(i + 1) % n];
    if (isPointOnSegment(center, P, Q, eps)) {
      return 'BOUNDARY';
    }
  }

  // 2. Ray Casting algorithm for INSIDE vs OUTSIDE
  let inside = false;
  const x = center.x;
  const y = center.y;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = vertices[i].x;
    const yi = vertices[i].y;
    const xj = vertices[j].x;
    const yj = vertices[j].y;

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-12) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside ? 'INSIDE' : 'OUTSIDE';
}

/**
 * Pure projection function:
 * Converts a GeometryStateSnapshot into a StructuralPassport.
 */
export function projectStructuralPassport(
  snapshot: GeometryStateSnapshot,
  eps: number = 1e-4
): StructuralPassport {
  const refCircle = snapshot.parameters.referenceCircle;
  const center = refCircle?.center ?? { id: 'O', x: 0, y: 0 };
  const radius = refCircle?.radius ?? 160;
  const diameter = 2 * radius;

  // Extract canonical vertices
  const canonicalPoints = snapshot.points.filter((p) => p.type === 'canonical');

  // 1. Determine Center Position
  const centerPositionRelative = determineCenterPositionRelative(
    center,
    canonicalPoints,
    eps
  );

  // 2. Analyze Diameter Chords (Sides & Diagonals)
  const diameterChords: DiameterChordInfo[] = [];

  if (canonicalPoints.length >= 3) {
    const n = canonicalPoints.length;

    // Check canonical sides
    for (let i = 0; i < n; i++) {
      const p1 = canonicalPoints[i];
      const p2 = canonicalPoints[(i + 1) % n];
      const length = euclideanDistance(p1, p2);
      const isDiameter = Math.abs(length - diameter) < eps;
      const label = `${p1.label}${p2.label}`;

      diameterChords.push({
        entityId: `side_${label}`,
        entityType: 'SIDE',
        label,
        p1Id: p1.id,
        p2Id: p2.id,
        length,
        isDiameter
      });
    }

    // Check canonical diagonals (for n >= 4)
    if (n >= 4) {
      for (let i = 0; i < n; i++) {
        for (let j = i + 2; j < n; j++) {
          if (i === 0 && j === n - 1) continue; // Skip adjacent edge

          const p1 = canonicalPoints[i];
          const p2 = canonicalPoints[j];
          const length = euclideanDistance(p1, p2);
          const isDiameter = Math.abs(length - diameter) < eps;
          const label = `${p1.label}${p2.label}`;

          diameterChords.push({
            entityId: `diag_${label}`,
            entityType: 'DIAGONAL',
            label,
            p1Id: p1.id,
            p2Id: p2.id,
            length,
            isDiameter
          });
        }
      }
    }
  }

  return {
    centerPositionRelative,
    diameterChords
  };
}
