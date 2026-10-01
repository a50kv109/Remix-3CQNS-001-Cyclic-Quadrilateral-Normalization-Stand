# Localization & Terminology Alignment (RU / UA / EN)

**Status:** Living Architectural Specification (Remix 3 / CQNS-001)

---

## 1. Overview

The **CQNS-001 Stand** integrates full multi-language normalization across all user interface panels, educational materials, and research protocols.

The system supports three languages:
- **Russian (`RU`)** — Default
- **Ukrainian (`UA`)**
- **English (`EN`)**

---

## 2. Architecture & Persistence

### A. Local Implementation (`translations.ts`)
All user-facing strings, panel headers, tool descriptions, and educational checklist cards are managed through a local dictionary in `remix2/src/ui/i18n/translations.ts`:

```typescript
import { Language } from '../types/uiTypes';
import { translations } from './translations';

export function getTranslation(language: Language = 'RU') {
  return translations[language] || translations.RU;
}
```

### B. Persistence Layer (`localStorage`)
The active language selection is stored in the browser's `localStorage` under the key `cqns_language_preference`:
- **Storage Key:** `cqns_language_preference`
- **Reader (`getSavedLanguage`):** Retrieves saved code (`'RU' | 'UA' | 'EN'`). Defaults to `'RU'` if uninitialized or invalid.
- **Writer (`saveLanguagePreference`):** Saves the selected language code.

```typescript
export function getSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem('cqns_language_preference');
    if (saved === 'RU' || saved === 'UA' || saved === 'EN') {
      return saved;
    }
  } catch (e) {
    // Graceful fallback for sandboxed environments
  }
  return 'RU';
}

export function saveLanguagePreference(language: Language): void {
  try {
    localStorage.setItem('cqns_language_preference', language);
  } catch (e) {
    // Non-blocking fallback
  }
}
```

---

## 3. Relationship to AAM Language Kernel

* **Terminology & Semantic Alignment:** UI terminology, schema keys, and concepts are aligned with the AAM Language Kernel and Universal Normalization Stand references.
* **Zero External Dependencies:** Runtime localization operates completely self-contained within the application bundle via `translations.ts` and `localStorage`. The project **does not require an external AAM repository or runtime network service** to deliver full multi-language support.

---

## 4. Coverage Inventory

Language normalization is applied across 100% of the UI shell and analytical panels:

1. **Header Bar (`HeaderBar.tsx`):** `RU / UA / EN` toggle buttons with active state highlighting and persistent storage callback.
2. **Summary Table Panel (`SummaryTablePanel.tsx`):** Geometric properties, opposite angle sums ($\angle A + \angle C = 180^\circ$), Ptolemy equation breakdown ($AC \cdot BD = AB \cdot CD + BC \cdot DA$), and area metrics ($S_{circle}, S_{quad}, S_{gap}$).
3. **Structural Passport Panel (`PassportPanel.tsx`):** Quadrilateral classification, side/diagonal equality badges, center location status, and invariant verification summaries.
4. **AAM Gateway Panel (`AAMGatewayPanel.tsx`):** State hash, normalized representation schema, SOL command contracts, and version descriptors.
5. **Education Panel (`EducationPanel.tsx`):**
   - **Agent Research Checklist (12-step protocol):** Fully localized in RU, UA, and EN (Question, Object, Variable, Construction, Measurement, Relation, Parameter Sweep, Pattern, Hypothesis, Counterexample, Next Experiment, Epistemic Status).
   - **Deterministic Reasoning Anchor (DRA):** Three epistemological boundary cards (Tool-Verified Fact, Agent Interpretation, Agent Hypothesis) fully translated.
6. **Geometry Research Table (`GeometryResearchTable.tsx`):** Normalized column headers and state observation parameters.
7. **School Toolbar & Guidance (`SchoolToolbar.tsx`, `GeometryCanvas.tsx`):** Interactive floating tool instructions and step-by-step prompts.

---

## 5. Verification Status

- **Automated Regression Test Suite (`researchGuide.test.ts`):** `PASSED`
- **Build & Static Typecheck:** `PASSED` (Zero TypeScript errors)
- **Desktop Browser UI Verification:** `VERIFIED` (Manual desktop testing confirms instant language switching across all panels and persistence across page reloads).
