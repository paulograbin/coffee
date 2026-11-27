export const money = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
export const weight = (grams) => new Intl.NumberFormat('en', { maximumFractionDigits: 3 }).format(grams / 1000);
export const uid = () => crypto.randomUUID();

// Parse decimal input without floating point multiplication of money.
export function decimalUnits(value, digits = 2) {
  const text = String(value).trim().replace(',', '.');
  if (!new RegExp('^\\d+(?:\\.\\d{0,' + digits + '})?$').test(text)) throw new Error('Use a positive number with at most ' + digits + ' decimal places.');
  const [whole, fraction = ''] = text.split('.');
  const result = Number(whole) * 10 ** digits + Number(fraction.padEnd(digits, '0'));
  if (!Number.isSafeInteger(result) || result > 1_000_000_000) throw new Error('This value is too large.');
  return result;
}
const roundRatio = (a, b) => Number((BigInt(a) + BigInt(b) / 2n) / BigInt(b));

// Largest remainder distribution: all cents accounted for, ties in participant order.
export function distribute(total, weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (!sum) return weights.map(() => 0);
  const divisor = BigInt(sum);
  const parts = weights.map((w, index) => {
    const numerator = BigInt(total) * BigInt(w);
    return { index, cents: Number(numerator / divisor), remainder: numerator % divisor };
  });
  let remaining = total - parts.reduce((s, p) => s + p.cents, 0);
  const ranked = [...parts].sort((a, b) => a.remainder === b.remainder ? a.index - b.index : a.remainder > b.remainder ? -1 : 1);
  for (const p of ranked) if (remaining > 0 && weights[p.index] > 0) { p.cents++; remaining--; }
  return parts.map(p => p.cents);
}

export function calculate(order) {
  const rows = order.participants.map(p => ({ ...p, grams: 0, coffee: 0, freight: 0, markup: 0 }));
  const coffees = order.coffees.map(c => {
    const quantities = rows.map(p => order.allocations.filter(a => a.participantId === p.id && a.coffeeId === c.id).reduce((sum, a) => sum + a.grams, 0));
    const grams = quantities.reduce((a, b) => a + b, 0);
    const cost = roundRatio(BigInt(c.priceCents) * BigInt(grams), 1000);
    const shares = distribute(cost, quantities);
    rows.forEach((row, i) => { row.grams += quantities[i]; row.coffee += shares[i]; });
    return { ...c, allocatedGrams: grams, cost, difference: c.orderedGrams - grams };
  });
  const grams = rows.reduce((s, p) => s + p.grams, 0);
  const coffee = rows.reduce((s, p) => s + p.coffee, 0);
  const eligible = rows.map(p => p.grams && !p.freightExempt ? order.freightSplit === 'equal' ? 1 : p.grams : 0);
  const freight = distribute(order.freightCents, eligible);
  const markupWeights = rows.map(p => p.markupExempt ? 0 : order.markupMode === 'percent' ? p.coffee : p.grams);
  const markupBasis = markupWeights.reduce((sum, value) => sum + value, 0);
  const markupTotal = order.markupMode === 'perKg'
    ? roundRatio(BigInt(order.markupValue) * BigInt(markupBasis), 1000)
    : order.markupMode === 'percent' ? roundRatio(BigInt(markupBasis) * BigInt(order.markupValue), 10000) : markupBasis ? order.markupValue : 0;
  const markup = distribute(markupTotal, markupWeights);
  rows.forEach((p, i) => { p.freight = freight[i]; p.markup = markup[i]; p.total = p.coffee + p.freight + p.markup; p.balance = p.total - p.paidCents; });
  const freightAllocated = freight.reduce((a, b) => a + b, 0);
  return { rows, coffees, grams, coffee, markup: markupTotal, freight: freightAllocated,
    unassignedFreight: order.freightCents - freightAllocated, total: coffee + markupTotal + freightAllocated,
    paid: rows.reduce((s, p) => s + p.paidCents, 0), balance: rows.reduce((s, p) => s + p.balance, 0) };
}

function integer(value, name) {
  if (!Number.isSafeInteger(value) || value < 0 || value > 1_000_000_000) throw new Error(name + ' must be a nonnegative whole number within limits.');
  return value;
}
function name(value, field) {
  if (typeof value !== 'string' || !value.trim() || value.length > 150) throw new Error(field + ' must contain 1–150 characters.');
  return value.trim();
}
function uniqueIds(items, field) {
  const ids = items.map(x => x.id);
  if (ids.some(x => typeof x !== 'string' || !x) || new Set(ids).size !== ids.length) throw new Error(field + ' IDs must be unique.');
}
export function normalizeOrder(source) {
  if (!source || !Array.isArray(source.coffees) || !Array.isArray(source.participants) || !Array.isArray(source.allocations)) throw new Error('Expected coffees, participants, and allocations arrays.');
  if (source.coffees.length > 100 || source.participants.length > 200 || source.allocations.length > 20000) throw new Error('This order exceeds the supported size.');
  const legacy = !('freightCents' in source);
  const order = {
    id: String(source.id ?? uid()), name: name(source.name ?? 'November coffee order', 'Order name'),
    freightCents: legacy ? decimalUnits(source.freightCost ?? 0) : integer(source.freightCents, 'Freight'),
    freightSplit: source.freightSplit ?? 'weight', markupMode: source.markupMode ?? 'perKg',
    markupValue: legacy ? decimalUnits(source.markupCost ?? 0) : integer(source.markupValue, 'Markup'),
    coffees: source.coffees.map(c => ({ id: String(c.id), name: name(c.name, 'Coffee name'), priceCents: integer(legacy ? c.priceInCents : c.priceCents, 'Coffee price'), orderedGrams: legacy ? decimalUnits(c.weight, 3) : integer(c.orderedGrams, 'Ordered grams') })),
    participants: source.participants.map(p => ({ id: String(p.id), name: name(p.name, 'Participant name'), freightExempt: p.freightExempt === true, markupExempt: p.markupExempt === true, paidCents: integer(p.paidCents ?? 0, 'Payment') })),
    allocations: source.allocations.map(a => ({ participantId: String(a.participantId), coffeeId: String(a.coffeeId), grams: integer(legacy ? a.amount : a.grams, 'Allocation grams') })),
  };
  if (!['weight', 'equal'].includes(order.freightSplit) || !['perKg', 'flat', 'percent'].includes(order.markupMode)) throw new Error('Unknown freight or markup rule.');
  uniqueIds(order.coffees, 'Coffee'); uniqueIds(order.participants, 'Participant');
  const pairs = new Set();
  for (const a of order.allocations) {
    if (!order.coffees.some(c => c.id === a.coffeeId) || !order.participants.some(p => p.id === a.participantId)) throw new Error('An allocation references a missing participant or coffee.');
    const key = JSON.stringify([a.participantId, a.coffeeId]);
    if (pairs.has(key)) throw new Error('Duplicate participant/coffee allocation.');
    pairs.add(key);
  }
  return order;
}

export function settlementText(order, result) {
  return [order.name, '', ...result.rows.map(p => p.name + ': ' + money(p.total) + ' (coffee ' + money(p.coffee) + ', markup ' + money(p.markup) + ', freight ' + money(p.freight) + ') — paid ' + money(p.paidCents) + ', balance ' + money(p.balance)), '', 'Total: ' + money(result.total), 'Freight: ' + (order.freightSplit === 'weight' ? 'by weight' : 'equally') + ', redistributed among non-exempt participants who ordered.', result.unassignedFreight ? 'Unassigned freight: ' + money(result.unassignedFreight) : '', result.coffees.some(c => c.difference) ? 'Draft: purchased and allocated quantities do not match.' : ''].filter(Boolean).join('\n');
}
