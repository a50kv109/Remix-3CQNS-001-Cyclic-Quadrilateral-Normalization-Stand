/**
 * PGS-2D Structural Validator
 * Validates syntactic and topological integrity of a PGSPassport.
 * 
 * Note: Structural validation checks schema and internal consistency;
 * it does NOT substitute for mathematical verification by GeometryCore.
 */

import { PGSPassport, PGSValidationReport, PointGeometry, SegmentGeometry, CircleGeometry, PolygonGeometry } from './pgsTypes';

export function validatePGSPassport(passport: any): PGSValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!passport || typeof passport !== 'object') {
    return {
      isValid: false,
      errors: ['Passport must be a non-null JSON object.'],
      warnings: []
    };
  }

  // 1. Top-level headers
  if (!passport.pgsVersion || typeof passport.pgsVersion !== 'string') {
    errors.push('Missing or invalid "pgsVersion" string.');
  }

  if (!passport.passportId || typeof passport.passportId !== 'string') {
    errors.push('Missing or invalid "passportId" string.');
  }

  if (!passport.transferMode || !['EXACT_STATE', 'CONSTRUCTIVE_STATE', 'HYBRID_STATE'].includes(passport.transferMode)) {
    errors.push(`Invalid "transferMode": "${passport.transferMode}". Must be EXACT_STATE, CONSTRUCTIVE_STATE, or HYBRID_STATE.`);
  }

  if (!passport.generator || typeof passport.generator !== 'object' || !passport.generator.name) {
    errors.push('Missing or invalid "generator" metadata object.');
  }

  if (!passport.timestamp || typeof passport.timestamp !== 'string') {
    warnings.push('Missing or non-standard "timestamp".');
  }

  if (!passport.units || typeof passport.units !== 'object') {
    warnings.push('Missing "units" descriptor; assuming default mm/rad.');
  }

  // 2. Objects array
  if (!Array.isArray(passport.objects) || passport.objects.length === 0) {
    errors.push('"objects" must be a non-empty array of PGSObject entries.');
    return { isValid: false, errors, warnings };
  }

  const objectIdSet = new Set<string>();
  const pointIds = new Set<string>();
  const segmentIds = new Set<string>();

  // Pass 1: Index IDs and check uniqueness
  for (let i = 0; i < passport.objects.length; i++) {
    const obj = passport.objects[i];
    if (!obj || typeof obj !== 'object') {
      errors.push(`Object at index ${i} is not a valid object.`);
      continue;
    }

    if (!obj.portableId || typeof obj.portableId !== 'string') {
      errors.push(`Object at index ${i} is missing a valid "portableId".`);
      continue;
    }

    if (objectIdSet.has(obj.portableId)) {
      errors.push(`Duplicate portableId detected: "${obj.portableId}".`);
    }
    objectIdSet.add(obj.portableId);

    if (obj.semanticType === 'point') {
      pointIds.add(obj.portableId);
    } else if (obj.semanticType === 'segment') {
      segmentIds.add(obj.portableId);
    }
  }

  // Pass 2: Structural and topological reference checks
  for (const obj of passport.objects) {
    if (!obj || !obj.portableId) continue;

    if (!obj.semanticType) {
      errors.push(`Object "${obj.portableId}" is missing "semanticType".`);
    }

    if (!obj.semanticRole) {
      errors.push(`Object "${obj.portableId}" is missing "semanticRole".`);
    }

    if (!obj.geometry || typeof obj.geometry !== 'object') {
      errors.push(`Object "${obj.portableId}" is missing "geometry" payload.`);
      continue;
    }

    switch (obj.semanticType) {
      case 'point': {
        const geom = obj.geometry as PointGeometry;
        if (typeof geom.x !== 'number' || !Number.isFinite(geom.x) || typeof geom.y !== 'number' || !Number.isFinite(geom.y)) {
          errors.push(`Point "${obj.portableId}" has invalid or non-finite coordinates (x: ${geom.x}, y: ${geom.y}).`);
        }
        break;
      }

      case 'segment': {
        const geom = obj.geometry as SegmentGeometry;
        if (!geom.startPointId || !pointIds.has(geom.startPointId)) {
          errors.push(`Segment "${obj.portableId}" references missing start point "${geom.startPointId}".`);
        }
        if (!geom.endPointId || !pointIds.has(geom.endPointId)) {
          errors.push(`Segment "${obj.portableId}" references missing end point "${geom.endPointId}".`);
        }
        if (geom.startPointId && geom.endPointId && geom.startPointId === geom.endPointId) {
          errors.push(`Segment "${obj.portableId}" has degenerate zero-length reference: start === end (${geom.startPointId}).`);
        }
        break;
      }

      case 'circle': {
        const geom = obj.geometry as CircleGeometry;
        if (!geom.centerPointId || !pointIds.has(geom.centerPointId)) {
          errors.push(`Circle "${obj.portableId}" references missing center point "${geom.centerPointId}".`);
        }
        if (typeof geom.radius !== 'number' || geom.radius <= 0 || !Number.isFinite(geom.radius)) {
          errors.push(`Circle "${obj.portableId}" has invalid radius: ${geom.radius}.`);
        }
        break;
      }

      case 'polygon': {
        const geom = obj.geometry as PolygonGeometry;
        if (!Array.isArray(geom.vertexIds) || geom.vertexIds.length < 3) {
          errors.push(`Polygon "${obj.portableId}" must have at least 3 vertexIds.`);
        } else {
          for (const vId of geom.vertexIds) {
            if (!pointIds.has(vId)) {
              errors.push(`Polygon "${obj.portableId}" references missing vertex point "${vId}".`);
            }
          }
        }
        if (geom.edgeIds) {
          for (const eId of geom.edgeIds) {
            if (!segmentIds.has(eId)) {
              warnings.push(`Polygon "${obj.portableId}" boundary edge "${eId}" is not explicitly indexed as a segment object.`);
            }
          }
        }
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
