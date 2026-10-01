import assert from 'node:assert';
import {
  AGENT_RESEARCH_CHECKLIST,
  DRA_REMINDER
} from '../src/research/researchGuide';

console.log("=== RUNNING R3 RESEARCH GUIDE TESTS ===");

try {
  // Test A: Checklist completeness
  assert.strictEqual(AGENT_RESEARCH_CHECKLIST.length, 12, 'Checklist should contain exactly 12 heuristic steps');
  assert.strictEqual(AGENT_RESEARCH_CHECKLIST[0].name, 'QUESTION');
  assert.strictEqual(AGENT_RESEARCH_CHECKLIST[11].name, 'EPISTEMIC STATUS');
  console.log("✓ Test A: Agent Research Checklist contains all 12 heuristic questions.");

  // Test B: DRA Reminder structure
  assert.strictEqual(DRA_REMINDER.title, 'DETERMINISTIC REASONING ANCHOR (DRA)');
  assert.strictEqual(DRA_REMINDER.epistemicBoundary.length, 3);
  assert.strictEqual(DRA_REMINDER.epistemicBoundary[0], 'TOOL-VERIFIED FACT');
  assert.strictEqual(DRA_REMINDER.epistemicBoundary[1], 'AGENT INTERPRETATION');
  assert.strictEqual(DRA_REMINDER.epistemicBoundary[2], 'AGENT HYPOTHESIS');
  console.log("✓ Test B: DRA Reminder contains required epistemic boundary distinctions.");

  console.log("\n🎉 ALL RESEARCH GUIDE TESTS PASSED SUCCESSFULLY! 🎉\n");
} catch (error) {
  console.error("❌ RESEARCH GUIDE TEST FAILED!");
  console.error(error);
  process.exit(1);
}
