/**
 * PGS-2D JSON Codec
 * Serializes and deserializes PGSPassport structures to/from .pgs.json text.
 */

import { PGSPassport } from './pgsTypes';
import { validatePGSPassport } from './pgsValidator';

export function encodePGSJson(passport: PGSPassport, pretty: boolean = true): string {
  const validation = validatePGSPassport(passport);
  if (!validation.isValid) {
    throw new Error(`Cannot encode invalid PGS Passport: ${validation.errors.join('; ')}`);
  }
  return pretty ? JSON.stringify(passport, null, 2) : JSON.stringify(passport);
}

export function decodePGSJson(jsonText: string): PGSPassport {
  if (typeof jsonText !== 'string' || !jsonText.trim()) {
    throw new Error('PGS JSON payload must be a non-empty string.');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err: any) {
    throw new Error(`Malformed JSON in PGS document: ${err.message}`);
  }

  const validation = validatePGSPassport(parsed);
  if (!validation.isValid) {
    throw new Error(`PGS Structural Validation Failed: ${validation.errors.join('; ')}`);
  }

  return parsed as PGSPassport;
}
