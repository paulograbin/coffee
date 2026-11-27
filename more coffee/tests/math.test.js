import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculate, decimalUnits, distribute, normalizeOrder, settlementText } from '../src/math.js';
const seed = JSON.parse(readFileSync(new URL('../coffee.json', import.meta.url)));
const order = () => normalizeOrder(seed);

test('original coffee order reproduces the agreed settlement, with every cent reconciled', () => {
  const r = calculate(order());
  assert.equal(r.grams, 8000); assert.equal(r.coffee, 111000); assert.equal(r.markup, 8000); assert.equal(r.freight, 7038); assert.equal(r.total, 126038);
  assert.deepEqual(r.rows.map(p => p.total), [31609, 19780, 18780, 30209, 12830, 12830]);
  assert.ok(r.coffees.every(c => c.difference === 0));
});
test('money and kilogram decimals parse precisely and reject invalid inputs', () => {
  assert.equal(decimalUnits('70.38'), 7038); assert.equal(decimalUnits('109,50'), 10950); assert.equal(decimalUnits('0.125', 3), 125);
  for (const x of ['-1', 'Infinity', '1e3', '1.234', '', 'NaN', '100000000000000']) assert.throws(() => decimalUnits(x));
});
test('flat fee and percentage markup use the correct basis', () => {
  const o = order(); o.markupMode = 'flat'; assert.equal(calculate(o).total, 119038);
  o.markupMode = 'percent'; assert.equal(calculate(o).total, 129138);
  assert.equal(calculate(o).markup, 11100);
  o.markupValue = 0; assert.equal(calculate(o).total, 118038);
});
test('freight exemption redistributes the entire cost among eligible weights', () => {
  const o = order(); o.participants[0].freightExempt = true;
  const r = calculate(o); assert.equal(r.rows[0].freight, 0); assert.equal(r.freight, 7038); assert.equal(r.total, 126038);
  assert.deepEqual(r.rows.map(p => p.freight), [0, 1173, 1173, 2346, 1173, 1173]);
});
test('markup exemptions apply to every mode independently of freight and reconcile cents', () => {
  const o = normalizeOrder({
    name: 'Exemptions', freightCents: 101, markupValue: 1000,
    coffees: [{ id: 'c', name: 'Coffee', priceCents: 10000, orderedGrams: 1000 }],
    participants: [
      { id: 'a', name: 'A', markupExempt: true },
      { id: 'b', name: 'B', freightExempt: true },
      { id: 'c', name: 'C' },
      { id: 'empty', name: 'Empty' },
    ],
    allocations: [
      { participantId: 'a', coffeeId: 'c', grams: 333 },
      { participantId: 'b', coffeeId: 'c', grams: 333 },
      { participantId: 'c', coffeeId: 'c', grams: 334 },
    ],
  });
  for (const [mode, expected] of [['perKg', [0, 333, 334, 0]], ['percent', [0, 333, 334, 0]], ['flat', [0, 499, 501, 0]]]) {
    o.markupMode = mode;
    const r = calculate(o);
    assert.deepEqual(r.rows.map(p => p.markup), expected);
    assert.deepEqual(r.rows.map(p => p.freight), [50, 0, 51, 0]);
    assert.equal(r.markup, expected.reduce((a, b) => a + b, 0));
    assert.equal(r.rows.reduce((sum, p) => sum + p.total, 0), r.total);
    assert.equal(r.rows.reduce((sum, p) => sum + p.balance, 0), r.balance);
  }
});
test('all markup-exempt or unallocated orders charge no markup in any mode', () => {
  for (const mode of ['perKg', 'percent', 'flat']) {
    const o = order(); o.markupMode = mode;
    o.participants.forEach(p => { p.markupExempt = true; });
    o.participants.push({ id: 'empty', name: 'Empty', markupExempt: false, paidCents: 0 });
    const r = calculate(o);
    assert.equal(r.markup, 0); assert.equal(r.total, 118038);
    assert.ok(r.rows.every(p => p.markup === 0));
    o.allocations = [];
    assert.equal(calculate(o).markup, 0);
    assert.equal(calculate(o).total, 0);
  }
});
test('markup exemptions survive JSON backups and default off for older orders', () => {
  const o = order();
  assert.ok(o.participants.every(p => p.markupExempt === false));
  o.participants[0].markupExempt = true;
  assert.deepEqual(normalizeOrder(JSON.parse(JSON.stringify(o))), o);
  o.participants.forEach(p => { delete p.markupExempt; });
  assert.ok(normalizeOrder(o).participants.every(p => p.markupExempt === false));
});
test('equal freight excludes exempt people and people without allocations', () => {
  const o = order(); o.freightSplit = 'equal'; o.participants[0].freightExempt = true;
  o.participants.push({id:'empty', name:'Empty', paidCents:0, freightExempt:false});
  const r = calculate(o); assert.equal(r.rows[0].freight, 0); assert.equal(r.rows.at(-1).freight, 0);
  assert.deepEqual(r.rows.slice(1,6).map(p => p.freight), [1408,1408,1408,1407,1407]);
});
test('all-exempt and empty orders explicitly report unassigned freight', () => {
  const o = order(); o.participants.forEach(p => { p.freightExempt = true; });
  const r = calculate(o); assert.equal(r.unassignedFreight, 7038); assert.equal(r.freight, 0); assert.equal(r.total, 119000);
  o.allocations = []; const empty = calculate(o); assert.equal(empty.total, 0); assert.equal(empty.unassignedFreight, 7038);
});
test('fractional gram allocations reconcile coffee and per-kg markup rounding', () => {
  const o = order(); o.coffees = [{ id:'c', name:'Fractional', priceCents:10951, orderedGrams:1000 }];
  o.allocations = [{participantId:'1',coffeeId:'c',grams:333},{participantId:'2',coffeeId:'c',grams:333},{participantId:'3',coffeeId:'c',grams:334}];
  const r = calculate(o); assert.equal(r.coffee,10951); assert.equal(r.markup,1000); assert.equal(r.rows.reduce((s,p)=>s+p.total,0),r.total);
  assert.deepEqual(r.rows.slice(0,3).map(p=>p.coffee),[3647,3647,3657]);
});
test('purchase discrepancies and overpayments remain visible', () => {
  const o = order(); o.coffees[0].orderedGrams = 1500; o.participants[0].paidCents = 40000;
  const r = calculate(o); assert.equal(r.coffees[0].difference,500); assert.equal(r.rows[0].balance,-8391); assert.equal(r.balance,86038);
  assert.match(settlementText(o,r), /Draft:/);
});
test('JSON round-trip preserves values and invalid references are rejected', () => {
  const o = order(); assert.deepEqual(normalizeOrder(JSON.parse(JSON.stringify(o))),o);
  o.allocations[0].coffeeId = 'missing'; assert.throws(()=>normalizeOrder(o),/missing/);
  const duplicate = order(); duplicate.participants[1].id = duplicate.participants[0].id; assert.throws(()=>normalizeOrder(duplicate),/unique/);
  const bad = order(); bad.freightCents = -1; assert.throws(()=>normalizeOrder(bad),/nonnegative/);
});
test('largest remainder conservation across many different splits', () => {
  for(let total=0;total<400;total++) {
    const weights = [total%7, 5, 11, total%13, 0]; const shares=distribute(total,weights);
    assert.equal(shares.reduce((a,b)=>a+b,0),total); assert.equal(shares[4],0);
    shares.forEach((share,i)=>assert.ok(Math.abs(share-total*weights[i]/weights.reduce((a,b)=>a+b,0))<1));
  }
});
test('summary contains actual line breaks', () => { const o=order(); assert.ok(settlementText(o,calculate(o)).includes('\nPaulo:')); });
