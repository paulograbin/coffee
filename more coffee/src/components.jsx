import React, { useState } from 'react';
import { decimalUnits, money, weight } from './math.js';

export function NumberField({ value, onChange, label, digits = 2, ...props }) {
  const [draft, setDraft] = useState(null);
  const [invalid, setInvalid] = useState(false);
  return <input {...props} title={invalid ? 'Use a nonnegative number with at most ' + digits + ' decimal places. Invalid edits are discarded when you leave this field.' : undefined} aria-label={label} aria-invalid={invalid} inputMode="decimal" value={draft ?? value / 10 ** digits}
    onChange={e => { setDraft(e.target.value); try { const number = decimalUnits(e.target.value, digits); onChange(number); setInvalid(false); } catch { setInvalid(true); } }}
    onBlur={() => { setDraft(null); setInvalid(false); }} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }} />;
}

export function SectionTitle({ number, title, detail, children }) {
  return <div className="section-heading"><div className="section-heading-main"><span className="section-number">{number}</span><div><h2>{title}</h2><p>{detail}</p></div></div>{children}</div>;
}

export function CoffeeEditor({ order, result, update, removeCoffee }) {
  function edit(id, field, value) { update(o => ({ ...o, coffees: o.coffees.map(c => c.id === id ? { ...c, [field]: value } : c) })); }
  return <div className="table-scroll"><table className="coffee-table"><thead><tr><th>Coffee</th><th>Price / kg</th><th>Purchased kg</th><th>Allocated</th><th></th></tr></thead><tbody>
    {result.coffees.map((c, i) => <tr key={c.id}><td><div className="coffee-name"><span className={'bean-swatch swatch-' + i % 4}><Bean /></span><input aria-label={'Coffee name ' + (i + 1)} value={c.name} maxLength={150} onChange={e => edit(c.id, 'name', e.target.value)} /></div></td>
      <td><div className="unit-input"><span>R$</span><NumberField label={'Price per kg for ' + c.name} value={c.priceCents} onChange={v => edit(c.id, 'priceCents', v)} /></div></td>
      <td><NumberField className="quantity-input" label={'Purchased kg of ' + c.name} digits={3} value={c.orderedGrams} onChange={v => edit(c.id, 'orderedGrams', v)} /></td>
      <td><span className={c.difference ? 'allocation-warning' : 'allocation-good'}>{weight(c.allocatedGrams)} kg {c.difference === 0 ? '✓' : ''}</span></td>
      <td><button className="icon-button" aria-label={'Remove ' + c.name} onClick={() => removeCoffee(c.id)}>×</button></td></tr>)}
    {!order.coffees.length && <tr><td colSpan="5" className="empty">Add a coffee to start building this order.</td></tr>}
  </tbody></table></div>;
}

export function ParticipantEditor({ order, result, update, removePerson }) {
  function edit(id, field, value) { update(o => ({ ...o, participants: o.participants.map(p => p.id === id ? { ...p, [field]: value } : p) })); }
  function allocate(participantId, coffeeId, grams) {
    update(o => ({ ...o, allocations: [...o.allocations.filter(a => a.participantId !== participantId || a.coffeeId !== coffeeId), { participantId, coffeeId, grams }] }));
  }
  return <><div className="table-scroll"><table className="allocation-table"><thead><tr><th>Participant</th>{order.coffees.map(c => <th key={c.id}><span className="column-coffee" title={c.name}>{c.name}</span><span className="column-unit">grams</span></th>)}<th>Total</th><th>Freight exempt</th><th>Markup exempt</th><th></th></tr></thead><tbody>
    {result.rows.map((p, i) => <tr key={p.id}><td><div className="person"><span className={'avatar avatar-' + i % 4}>{p.name.slice(0, 1).toUpperCase() || '?'}</span><input aria-label={'Participant name ' + (i + 1)} value={p.name} maxLength={150} onChange={e => edit(p.id, 'name', e.target.value)} /></div></td>
      {order.coffees.map(c => <td key={c.id}><NumberField className="allocation-input" label={p.name + ' grams of ' + c.name} digits={0} value={order.allocations.find(a => a.participantId === p.id && a.coffeeId === c.id)?.grams ?? 0} onChange={v => allocate(p.id, c.id, v)} /></td>)}
      <td className="numeric">{weight(p.grams)} kg</td><td className="exemption-cell"><label className="switch"><input type="checkbox" aria-label={'Exempt ' + p.name + ' from freight'} checked={p.freightExempt} onChange={e => edit(p.id, 'freightExempt', e.target.checked)} /><span /></label></td>
      <td className="exemption-cell"><label className="switch"><input type="checkbox" aria-label={'Exempt ' + p.name + ' from markup'} checked={p.markupExempt} onChange={e => edit(p.id, 'markupExempt', e.target.checked)} /><span /></label></td>
      <td><button className="icon-button" aria-label={'Remove ' + p.name} onClick={() => removePerson(p.id)}>×</button></td></tr>)}
    {!order.participants.length && <tr><td colSpan={order.coffees.length + 5} className="empty">Add the people joining this order.</td></tr>}
  </tbody></table></div><p className="table-note">Enter quantities in grams. 250 g = ¼ kg · 500 g = ½ kg · 1,000 g = 1 kg</p></>;
}

export function CostSettings({ order, update }) {
  const edit = (key, value) => update(o => ({ ...o, [key]: value }));
  return <div className="cost-settings"><div><h3>Freight</h3><div className="form-pair"><label>Total freight (R$)<NumberField label="Total freight" value={order.freightCents} onChange={v => edit('freightCents', v)} /></label><label>Split between participants<select aria-label="Freight split" value={order.freightSplit} onChange={e => edit('freightSplit', e.target.value)}><option value="weight">By weight</option><option value="equal">Equally</option></select></label></div><p>Exempt people pay no freight. The full cost is shared by the other people who ordered.</p></div>
    <div><h3>Markup</h3><div className="form-pair"><label>{order.markupMode === 'percent' ? 'Percentage (%)' : 'Amount (R$)'}<NumberField label="Markup amount" value={order.markupValue} onChange={v => edit('markupValue', v)} /></label><label>Apply markup<select aria-label="Markup mode" value={order.markupMode} onChange={e => edit('markupMode', e.target.value)}><option value="perKg">Per kilogram</option><option value="flat">Flat fee for the order</option><option value="percent">Percentage of coffee cost</option></select></label></div><p>{order.markupMode === 'perKg' ? 'Charged on non-exempt participants’ allocated weight.' : order.markupMode === 'flat' ? 'One fee, shared by allocated weight among non-exempt participants. No fee if none have coffee.' : 'Applied to non-exempt participants’ coffee cost, before freight.'} Set to 0 for no markup.</p></div></div>;
}

export function Settlement({ order, result, update, onCopy, onCsv }) {
  return <section className="settlement section" id="settlement"><SectionTitle number="04" title="Everyone’s share" detail="The full breakdown. Every cent accounted for."><div className="button-group"><button className="quiet-button" onClick={onCsv}>Export CSV</button><button className="secondary-button" onClick={onCopy}>Copy summary ↗</button></div></SectionTitle>
    <div className="table-scroll"><table className="settlement-table"><thead><tr><th>Participant</th><th>Coffee</th><th>Markup</th><th>Freight</th><th>Total</th><th>Paid (R$)</th><th>Balance</th></tr></thead><tbody>{result.rows.map(p => <tr key={p.id}><td><strong>{p.name || 'Unnamed'}</strong>{p.freightExempt && <small>Freight exempt</small>}{p.markupExempt && <small>Markup exempt</small>}</td><td>{money(p.coffee)}</td><td>{money(p.markup)}</td><td>{money(p.freight)}</td><td className="total-cell">{money(p.total)}</td><td><NumberField className="payment-input" label={'Paid by ' + p.name} value={p.paidCents} onChange={v => update(o => ({ ...o, participants: o.participants.map(x => x.id === p.id ? { ...x, paidCents: v } : x) }))} /></td><td className={p.balance === 0 ? 'paid-balance' : 'balance'}>{p.balance === 0 ? 'Settled ✓' : money(Math.abs(p.balance))}{p.balance < 0 && <small>Credit to return</small>}</td></tr>)}</tbody>
    <tfoot><tr><td>Order total</td><td>{money(result.coffee)}</td><td>{money(result.markup)}</td><td>{money(result.freight)}</td><td>{money(result.total)}</td><td>{money(result.paid)}</td><td>{money(result.balance)}</td></tr></tfoot></table></div>
    <p className="table-note">Balances are amounts payable to the organizer. A negative balance is a credit to return. Cents are distributed by largest remainder; ties follow participant order.</p>
  </section>;
}

export function Bean() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="12" cy="12" rx="6.5" ry="9" transform="rotate(35 12 12)" stroke="currentColor" strokeWidth="1.6"/><path d="M16.7 5.2C9 7 15 17 7.3 18.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
