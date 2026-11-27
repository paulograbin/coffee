import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import seed from '../coffee.json';
import { calculate, money, normalizeOrder, settlementText, uid, weight } from './math.js';
import { Bean, CoffeeEditor, CostSettings, ParticipantEditor, SectionTitle, Settlement } from './components.jsx';
import './styles.css';

const STORAGE_KEY = 'coffeer:v1';
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const data = JSON.parse(raw); if (data.version !== 1 || !Array.isArray(data.orders) || !data.orders.length) throw new Error(); return { orders: data.orders.map(normalizeOrder), activeId: data.activeId, warning: '' }; }
  } catch { return { orders: [normalizeOrder(seed)], warning: 'Saved data could not be loaded. Your original saved data will not be overwritten until you make an edit. Export a backup of this order when ready.' }; }
  return { orders: [normalizeOrder(seed)], warning: '' };
}
function download(filename, body, type) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function App() {
  const [initial] = useState(load);
  const [orders, setOrders] = useState(initial.orders);
  const [activeId, setActiveId] = useState(initial.activeId ?? initial.orders[0].id);
  const [storageError, setStorageError] = useState(initial.warning);
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState('');
  const [confirm, setConfirm] = useState(null);
  const fileInput = useRef(null);
  const dialogRef = useRef(null);
  const order = orders.find(o => o.id === activeId) ?? orders[0];
  const result = calculate(order);
  const differences = result.coffees.filter(c => c.difference !== 0);
  const missingNames = !order.name.trim() || order.coffees.some(c => !c.name.trim()) || order.participants.some(p => !p.name.trim());
  const draft = differences.length > 0 || result.unassignedFreight > 0 || !result.grams || missingNames;
  useEffect(() => { if (!dirty) return; try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, orders, activeId })); setStorageError(''); } catch { setStorageError('Browser storage is unavailable or full. Export JSON to keep a backup of your changes.'); } }, [orders, activeId, dirty]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 4500); return () => clearTimeout(timer); }, [notice]);
  useEffect(() => { if (confirm) dialogRef.current?.showModal(); }, [confirm]);
  function update(fn) { setDirty(true); setOrders(previous => previous.map(o => o.id === order.id ? fn(o) : o)); }
  function addOrder(copy = false) {
    const next = copy ? { ...structuredClone(order), id: uid(), name: order.name + ' (copy)', participants: order.participants.map(p => ({ ...p, paidCents: 0 })) } : { id: uid(), name: 'New coffee order', coffees: [], participants: [], allocations: [], freightCents: 0, freightSplit: 'weight', markupMode: 'perKg', markupValue: 1000 };
    setOrders(previous => [...previous, next]); setActiveId(next.id); setDirty(true); setNotice(copy ? 'Order duplicated. Payments reset.' : 'New order created.');
  }
  function removeCoffee(id) { setConfirm({ title: 'Remove this coffee?', detail: 'Its quantities will also be removed from each participant.', action: () => update(o => ({ ...o, coffees: o.coffees.filter(c => c.id !== id), allocations: o.allocations.filter(a => a.coffeeId !== id) })) }); }
  function removePerson(id) { setConfirm({ title: 'Remove this participant?', detail: 'Their allocations and recorded payment will be removed from this order.', action: () => update(o => ({ ...o, participants: o.participants.filter(p => p.id !== id), allocations: o.allocations.filter(a => a.participantId !== id) })) }); }
  async function importFile(event) {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    try {
      if (file.size > 5_000_000) throw new Error('Choose a JSON file smaller than 5 MB.');
      const data = JSON.parse(await file.text());
      if (data.version !== undefined && data.version !== 1) throw new Error('Unsupported backup version.');
      const sources = data.orders ?? [data];
      if (!Array.isArray(sources) || !sources.length || sources.length > 100) throw new Error('Expected 1–100 orders.');
      const imported = sources.map(source => ({ ...normalizeOrder(source), id: uid() }));
      setOrders(previous => [...previous, ...imported]); setActiveId(imported[0].id); setDirty(true); setNotice('Imported ' + imported.length + ' order(s). Existing orders were kept.');
    } catch (e) { setNotice('Import failed: ' + e.message); }
  }
  function exportJson() {
    try { orders.forEach(normalizeOrder); download('coffeer-backup.json', JSON.stringify({ version: 1, activeId: order.id, orders }, null, 2), 'application/json'); setNotice('All orders exported.'); } catch (e) { setNotice('Before exporting: ' + e.message); }
  }
  async function copySummary() {
    const text = settlementText(order, result);
    try { await navigator.clipboard.writeText(text); setNotice('Settlement copied. Ready to share.'); } catch { download('settlement.txt', text, 'text/plain'); setNotice('Clipboard unavailable. Summary downloaded instead.'); }
  }
  function csv() {
    const safe = v => '"' + String(v).replace(/^[=+@\-]/, x => "'" + x).replaceAll('"', '""') + '"';
    const rows = [['Order', order.name, draft ? 'DRAFT — review warnings' : 'Allocated'], ['Participant', 'Weight kg', 'Coffee BRL', 'Markup BRL', 'Freight BRL', 'Total BRL', 'Paid BRL', 'Balance BRL'], ...result.rows.map(p => [p.name, p.grams / 1000, ...[p.coffee, p.markup, p.freight, p.total, p.paidCents, p.balance].map(v => (v / 100).toFixed(2))]), ['TOTAL', result.grams / 1000, ...[result.coffee, result.markup, result.freight, result.total, result.paid, result.balance].map(v => (v / 100).toFixed(2))], ['Unassigned freight BRL', (result.unassignedFreight / 100).toFixed(2)]];
    download('coffee-settlement.csv', '\uFEFF' + rows.map(row => row.map(safe).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
  }
  return <><header className="app-header"><a className="brand" href="#"><span className="brand-icon"><Bean /></span>coffeer<span className="brand-dot">.</span></a><span className="tagline">Good coffee. Fair shares.</span><div className="header-actions"><button className="quiet-button" onClick={() => fileInput.current.click()}>Import JSON</button><button className="secondary-button" onClick={exportJson}>Export backup ↗</button><input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={importFile}/></div></header>
    <main><div className="order-toolbar"><label className="order-switcher">Your orders<select aria-label="Select order" value={order.id} onChange={e => { setActiveId(e.target.value); setDirty(true); }}>{orders.map(o => <option value={o.id} key={o.id}>{o.name || 'Unnamed order'}</option>)}</select></label><div className="button-group"><button className="quiet-button" onClick={() => addOrder(true)}>Duplicate</button><button className="secondary-button" onClick={() => addOrder()}>＋ New order</button></div></div>
      <div className="page-heading"><div><input className="order-name" aria-label="Order name" maxLength={150} value={order.name} onChange={e => update(o => ({ ...o, name: e.target.value }))}/><p>A little less accounting. A lot more coffee.</p></div><div className="save-state"><span className={storageError ? 'dot warning-dot' : 'dot'} />{storageError ? 'Backup needed' : 'Saved in this browser'}</div></div>
      {storageError && <div className="alert" role="alert">{storageError}</div>}
      <div className="overview"><div><span>In the order</span><strong>{weight(result.grams)} <small>kg</small></strong><p>{order.coffees.length} coffees · {order.participants.length} participants</p></div><div><span>Coffee subtotal</span><strong>{money(result.coffee)}</strong><p>Based on allocated quantities</p></div><div><span>Freight + markup</span><strong>{money(result.freight + result.markup)}</strong><p>{money(result.freight)} freight + {money(result.markup)} markup</p></div><div className="grand-total"><span>Order total</span><strong data-testid="order-total">{money(result.total)}</strong><a href="#settlement">See everyone’s share <span>↘</span></a></div></div>
      <section className="section"><SectionTitle number="01" title="The coffee lineup" detail="Set the price and purchased quantity for each coffee."><button className="secondary-button" onClick={() => update(o => ({ ...o, coffees: [...o.coffees, { id: uid(), name: 'New coffee', priceCents: 0, orderedGrams: 0 }] }))}>＋ Add coffee</button></SectionTitle><CoffeeEditor order={order} result={result} update={update} removeCoffee={removeCoffee}/></section>
      <section className="section"><SectionTitle number="02" title="Who’s having what?" detail="Allocate the coffee and choose any freight or markup exemptions."><button className="secondary-button" onClick={() => update(o => ({ ...o, participants: [...o.participants, { id: uid(), name: 'New participant', freightExempt: false, markupExempt: false, paidCents: 0 }] }))}>＋ Add participant</button></SectionTitle><ParticipantEditor order={order} result={result} update={update} removePerson={removePerson}/></section>
      <section className="section"><SectionTitle number="03" title="The shared costs" detail="Make the split work for your group."/><CostSettings order={order} update={update}/></section>
      <div className={draft ? 'validation-banner needs-attention' : 'validation-banner'}><span className="validation-icon">{draft ? '!' : '✓'}</span><div><strong>{draft ? 'A few things to check' : 'All coffee allocated. The math checks out.'}</strong>{!draft && <p>Everyone’s share adds up to {money(result.total)}. No missing cents.</p>}{differences.map(c => <p key={c.id}>{c.name}: {weight(Math.abs(c.difference))} kg {c.difference > 0 ? 'still unallocated' : 'over the purchased quantity'}. Settlement uses allocated quantities only.</p>)}{result.unassignedFreight > 0 && <p>{money(result.unassignedFreight)} freight is unassigned: no non-exempt participant has coffee. It is excluded from the settlement.</p>}{!result.grams && <p>Add coffee quantities to calculate the settlement.</p>}{missingNames && <p>Give the order, every coffee, and every participant a name.</p>}</div></div>
      <Settlement order={order} result={result} update={update} onCopy={copySummary} onCsv={csv}/>
      <footer><span>Made for the people you share coffee with.</span><span>BRL · Local browser storage · Export backups to keep your orders</span></footer>
    </main>{notice && <div className="toast" role="status">{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}>×</button></div>}
    {confirm && <dialog ref={dialogRef} onCancel={() => setConfirm(null)} onClose={() => setConfirm(null)}><h2>{confirm.title}</h2><p>{confirm.detail}</p><div className="dialog-actions"><button className="secondary-button" autoFocus onClick={() => setConfirm(null)}>Cancel</button><button className="danger-button" onClick={() => { confirm.action(); setConfirm(null); }}>Remove</button></div></dialog>}
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
