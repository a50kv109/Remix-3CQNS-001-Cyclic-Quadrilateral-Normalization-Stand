# Localization & AAM Language Gateway (RU / UA / EN)

**Status:** Living Documentation Specification

---

## 1. Overview

The **CQNS-001 Stand** integrates multi-language normalization across all user interface panels, educational materials, and research protocols.

The system supports three languages:
- **Russian (`RU`)** — Default
- **Ukrainian (`UA`)**
- **English (`EN`)**

---

## 2. Architecture & Persistence

### A. Core Architecture (`translations.ts`)
All user-facing strings are localized via `getTranslation(language: Language): TranslationDictionary` in `remix2/src/ui/i18n/translations.ts`.

```typescript
import { Language } from '../types/uiTypes';
import { translations } from './translations';

export function getTranslation(language: Language = 'RU') {
  return translations[language] || translations.RU;
}
```

### B. Persistence Layer
User language selection is persisted across sessions using browser `localStorage`:
- **Storage Key:** `cqns_language_preference`
- **Reader (`getSavedLanguage`):** Retrieves saved code (`'RU' | 'UA' | 'EN'`). Defaults to `'RU'` if uninitialized or invalid.
- **Writer (`saveLanguagePreference`):** Saves selected language code to `localStorage`.

```typescript
export function getSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem('cqns_language_preference');
    if (saved === 'RU' || saved === 'UA' || saved === 'EN') {
      return saved;
    }
  } catch (e) {
    // Fallback for sandboxed or storage-disabled environments
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

## 3. Coverage Inventory

Language normalization is applied across 100% of the UI shell and analytical panels:

1. **Header Bar (`HeaderBar.tsx`):** `RU / UA / EN` toggle buttons with active state highlighting and persistent storage callback.
2. **Summary Table Panel (`SummaryTablePanel.tsx`):** Geometric properties, opposite angle sums ($\angle A + \angle C = 180^\circ$, $\angle B + \angle D = 180^\circ$), Ptolemy equation breakdown ($AC \cdot BD = AB \cdot CD + BC \cdot DA$), and area metrics ($S_{circle}, S_{quad}, S_{gap}$).
3. **Structural Passport Panel (`PassportPanel.tsx`):** Quadrilateral classification, side/diagonal equality badges, center location status, and invariant verification summaries.
4. **AAM Gateway Panel (`AAMGatewayPanel.tsx`):** State hash, normalized representation schema, SOL command contracts, and version descriptors.
5. **Education Panel (`EducationPanel.tsx`):**
   - **Agent Research Checklist (12-step protocol):**
     1. `QUESTION` / `ВОПРОС` / `ПИТАННЯ`
     2. `OBJECT` / `ОБЪЕКТ` / `ОБ'ЄКТ`
     3. `VARIABLE` / `ПЕРЕМЕННАЯ` / `ЗМІННА`
     4. `CONSTRUCTION` / `ПОСТРОЕНИЕ` / `ПOБУДОВА`
     5. `MEASUREMENT` / `ИЗМЕРЕНИЕ` / `ВИМІРЮВАННЯ`
     6. `RELATION` / `СВЯЗЬ / ВЫРАЖЕНИЕ` / `ЗВ'ЯЗОК / ВЫРАЗ`
     7. `PARAMETER SWEEP` / `ВАРИАЦИЯ ПАРАМЕТРОВ` / `ВАРИАЦІЯ ПАРАМЕТРІВ`
     8. `PATTERN` / `ЗАКОНОМЕРНОСТЬ` / `ЗАКОНОМІРНІСТЬ`
     9. `HYPOTHESIS` / `ГИПОТЕЗА` / `ГІПОТЕЗА`
     10. `COUNTEREXAMPLE` / `КОНТРПРИМЕР` / `КОНТРПРИКЛАД`
     11. `NEXT EXPERIMENT` / `СЛЕДУЮЩИЙ ЭКСПЕРИМЕНТ` / `НАСТУПНИЙ ЕКСПЕРИМЕНТ`
     12. `EPISTEMIC STATUS` / `ЭПИСТЕМИЧЕСКИЙ СТАТУС` / `ЕПІСТЕМІЧНИЙ СТАТУС`
   - **Deterministic Reasoning Anchor (DRA) Heuristics:** Tool-verified facts, agent interpretations, hypotheses, and epistemic notes.
   - **Theorem Cards:** Opposite angles, inscribed angle theorem, and Ptolemy's theorem cards with live dynamic evaluations.
6. **Geometry Research Table (`GeometryResearchTable.tsx`):** Table column headers, snapshot versions, step indices, and metrics.
7. **Numeric Angles Modal (`NumericAnglesModal.tsx`):** Dialog title, vertex angle inputs, submit buttons, and validation errors.
8. **Research Plane Controls (`ResearchPlaneControls.tsx`):** Plane 1 / Plane 2 selection, FIX Plane 2 toggle, and Clone to Plane 2 action tooltips.

---

## 4. Status

- **Code Implementation:** `COMPLETE`
- **Build & Typecheck:** `PASSED`
- **Browser UI Manual Verification:** `NOT BROWSER VERIFIED`
