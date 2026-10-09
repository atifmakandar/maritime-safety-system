import test from 'node:test';
import assert from 'node:assert/strict';
import { addDays, riskLevel, riskScore, overdue, drillStatus, today } from '../src/safety.ts';

test('risk classification uses residual score thresholds', () => {
  assert.equal(riskScore({ likelihood: 3, consequence: 5 }), 15);
  assert.equal(riskLevel(15), 'High'); assert.equal(riskLevel(8), 'Medium'); assert.equal(riskLevel(7), 'Low');
});
test('date arithmetic and overdue handling preserve completed actions', () => {
  assert.equal(addDays('2026-01-31', 30), '2026-03-02');
  assert.equal(overdue({ status: 'Complete', dueDate: '2000-01-01' }), false);
  assert.equal(overdue({ status: 'Open', dueDate: '2000-01-01' }), true);
  assert.equal(overdue({ status: 'Open', dueDate: today() }), false);
  assert.equal(drillStatus({ nextDate: addDays(today(), 7) }), 'Due soon');
  assert.equal(drillStatus({ nextDate: addDays(today(), 8) }), 'Ready');
});
