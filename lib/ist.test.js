import assert from 'node:assert';
import { getResearchDay, isNewDayAvailable, isDormantPeriod, getCurrentStudyDay } from './ist.js';

console.log('Running tests for lib/ist.js...');

function testGetResearchDay() {
  console.log('Testing getResearchDay...');

  // 2026-04-21 12:00 UTC is 2026-04-21 17:30 IST
  const t1 = new Date('2026-04-21T12:00:00Z');
  const d1 = getResearchDay(t1);
  // Should be April 21st IST
  assert.strictEqual(d1.getDate(), 21);
  assert.strictEqual(d1.getMonth(), 3); // 0-indexed, 3 = April
  assert.strictEqual(d1.getHours(), 0);

  // 2026-04-21 00:00 UTC is 2026-04-21 05:30 IST (Before 06:00 IST)
  const t2 = new Date('2026-04-21T00:00:00Z');
  const d2 = getResearchDay(t2);
  // Should be 2026-04-20 IST
  assert.strictEqual(d2.getDate(), 20);
  assert.strictEqual(d2.getHours(), 0);

  // Exactly 06:00 IST (00:30 UTC)
  const t3 = new Date('2026-04-21T00:30:00Z');
  const d3 = getResearchDay(t3);
  // Should be 2026-04-21 IST
  assert.strictEqual(d3.getDate(), 21);
  assert.strictEqual(d3.getHours(), 0);

  console.log('✅ getResearchDay passed');
}

function testIsNewDayAvailable() {
  console.log('Testing isNewDayAvailable...');

  // Case 1: No lastLoginDateStr
  assert.strictEqual(isNewDayAvailable(null), true);

  // Case 2: Same research day
  // lastLogin: 2026-04-21 07:00 IST (Research Day: April 21)
  // now: 2026-04-21 17:00 IST (Research Day: April 21)
  const lastLogin1 = '2026-04-21T01:30:00Z';
  const now1 = new Date('2026-04-21T11:30:00Z');
  assert.strictEqual(isNewDayAvailable(lastLogin1, now1), false);

  // Case 3: Next research day
  // lastLogin: 2026-04-21 23:00 IST (Research Day: April 21)
  // now: 2026-04-22 07:00 IST (Research Day: April 22)
  const lastLogin2 = '2026-04-21T17:30:00Z';
  const now2 = new Date('2026-04-22T01:30:00Z');
  assert.strictEqual(isNewDayAvailable(lastLogin2, now2), true);

  // Case 4: Next calendar day, but SAME research day (Before 06:00 IST)
  // lastLogin: 2026-04-21 23:00 IST (Research Day: April 21)
  // now: 2026-04-22 05:00 IST (Research Day: April 21)
  const lastLogin3 = '2026-04-21T17:30:00Z';
  const now3 = new Date('2026-04-21T23:30:00Z');
  assert.strictEqual(isNewDayAvailable(lastLogin3, now3), false);

  console.log('✅ isNewDayAvailable passed');
}

function testIsDormantPeriod() {
  console.log('Testing isDormantPeriod...');

  // hour >= 1 && hour < 6 IST

  // 00:30 IST (19:00 UTC previous day) -> False
  assert.strictEqual(isDormantPeriod(new Date('2026-04-20T19:00:00Z')), false);

  // 01:00 IST (19:30 UTC previous day) -> True
  assert.strictEqual(isDormantPeriod(new Date('2026-04-20T19:30:00Z')), true);

  // 03:00 IST (21:30 UTC previous day) -> True
  assert.strictEqual(isDormantPeriod(new Date('2026-04-20T21:30:00Z')), true);

  // 05:59 IST (00:29 UTC same day) -> True
  assert.strictEqual(isDormantPeriod(new Date('2026-04-21T00:29:00Z')), true);

  // 06:00 IST (00:30 UTC same day) -> False
  assert.strictEqual(isDormantPeriod(new Date('2026-04-21T00:30:00Z')), false);

  console.log('✅ isDormantPeriod passed');
}

function testGetCurrentStudyDay() {
  console.log('Testing getCurrentStudyDay...');

  const startDate = '2026-04-21T06:30:00Z'; // 12:00 IST

  // Same research day
  const now1 = new Date('2026-04-21T12:00:00Z'); // 17:30 IST
  assert.strictEqual(getCurrentStudyDay(startDate, now1), 1);

  // Next research day
  const now2 = new Date('2026-04-22T01:00:00Z'); // 06:30 IST
  assert.strictEqual(getCurrentStudyDay(startDate, now2), 2);

  // Missed multiple days
  const now3 = new Date('2026-04-25T12:00:00Z'); // 17:30 IST
  assert.strictEqual(getCurrentStudyDay(startDate, now3), 5);

  // Before 6 AM on start day (Technically research day before start day)
  const now4 = new Date('2026-04-21T00:00:00Z'); // 05:30 IST
  assert.strictEqual(getCurrentStudyDay(startDate, now4), 0);

  console.log('✅ getCurrentStudyDay passed');
}

try {
  testGetResearchDay();
  testIsNewDayAvailable();
  testIsDormantPeriod();
  testGetCurrentStudyDay();
  console.log('All tests passed! 🎉');
} catch (error) {
  console.error('Test failed! ❌');
  console.error(error);
  process.exit(1);
}
