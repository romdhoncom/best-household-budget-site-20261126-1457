// DompetKeluarga — one renderer per section. Each view builds its HTML from
// the data in data.js and wires its own controls; the router in main.js
// swaps views in and out.

import {
  CATEGORIES, GOALS, INCOME, MONTHLY, TIPS, TRANSACTIONS,
  formatRupiah, formatShort, spentByCategory, totalIncome, totalSpent,
} from './data.js';
import { drawBarChart, drawDoughnut, drawMonthlyChart } from './charts.js';

// Mutable working state: the seeded data, edited live by the forms.
export const state = {
  transactions: TRANSACTIONS.map((t) => ({ ...t })),
  budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
  goals: GOALS.map((g) => ({ ...g })),
  categoryFilter: 'semua',
  searchText: '',
};

export function spent() {
  return state.transactions.reduce((s, t) => s + t.amount, 0);
}

export function spentByCat() {
  const map = new Map(CATEGORIES.map((c) => [c.id, 0]));
  for (const t of state.transactions) map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  return CATEGORIES.map((c) => ({ ...c, spent: map.get(c.id) ?? 0, budget: state.budgets[c.id] }));
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function categoryName(id) {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

function dateLabel(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} Nov ${y}`;
}

function moneyCard(label, value, sub, tone) {
  return `<div class="card money ${tone || ''}">
    <div class="money-label">${label}</div>
    <div class="money-value">${formatRupiah(value)}</div>
    <div class="money-sub">${sub}</div>
  </div>`;
}

// ---------------------------------------------------------------- overview

export function renderOverview(root) {
  const income = totalIncome();
  const out = spent();
  const saved = income - out;
  const byCat = spentByCat().filter((c) => c.spent > 0).sort((a, b) => b.spent - a.spent);
  // The chart helpers take {label, value, color}; map the category rows over.
  const chartRows = byCat.map((c) => ({ label: c.name, value: c.spent, color: c.color }));
  const months = MONTHLY.map((m) => (m.month === 'Nov' ? { ...m, spent: out } : m));
  const topTx = [...state.transactions].sort((a, b) => b.amount - a.amount).slice(0, 5);

  root.innerHTML = `
  <section class="hero">
    <div>
      <p class="eyebrow">November 2026 · Keluarga Rahmawati · Bandung</p>
      <h1>Uang keluarga, terkendali.</h1>
      <p class="lede">DompetKeluarga merangkum pemasukan, pengeluaran, anggaran dan tabungan
      satu keluarga dalam satu halaman — tanpa aplikasi, tanpa langganan.</p>
    </div>
    <div class="hero-chart">
      <canvas id="donut" width="230" height="230" role="img" aria-label="Pengeluaran per kategori"></canvas>
      <div class="legend">${byCat.map((c) => `<span><i style="background:${c.color}"></i>${esc(c.name)} — ${formatShort(c.spent)}</span>`).join('')}</div>
    </div>
  </section>
  <div class="money-grid">
    ${moneyCard('Pemasukan bulan ini', income, '4 sumber · gaji + usaha sampingan', 'in')}
    ${moneyCard('Pengeluaran bulan ini', out, `${state.transactions.length} transaksi tercatat`, 'out')}
    ${moneyCard('Sisa untuk ditabung', saved, `${Math.round((saved / income) * 100)}% dari pemasukan`, 'save')}
  </div>
  <div class="two-col">
    <section class="card">
      <h2>Pengeluaran per kategori</h2>
      <canvas id="bars" role="img" aria-label="Batang pengeluaran per kategori"></canvas>
    </section>
    <section class="card">
      <h2>Enam bulan terakhir</h2>
      <canvas id="monthly" role="img" aria-label="Pemasukan dan pengeluaran enam bulan terakhir"></canvas>
      <p class="chart-note"><span class="swatch in"></span> Pemasukan &nbsp; <span class="swatch out"></span> Pengeluaran</p>
    </section>
  </div>
  <div class="two-col">
    <section class="card">
      <h2>Pengeluaran terbesar bulan ini</h2>
      <ol class="top-list">${topTx.map((t) => `<li><span>${esc(t.desc)}</span><b>${formatRupiah(t.amount)}</b></li>`).join('')}</ol>
      <p><a class="link" href="#/pengeluaran">Lihat semua transaksi →</a></p>
    </section>
    <section class="card">
      <h2>Catatan untuk bulan ini</h2>
      ${TIPS.map((t) => `<div class="tip"><b>${esc(t.title)}</b><p>${esc(t.body)}</p></div>`).join('')}
    </section>
  </div>`;

  drawDoughnut(root.querySelector('#donut'), chartRows, formatShort, 'total belanja');
  drawBarChart(root.querySelector('#bars'), chartRows, formatShort);
  drawMonthlyChart(root.querySelector('#monthly'), months, formatShort);
}

// ---------------------------------------------------------------- expenses

function transactionRow(t) {
  return `<tr><td>${dateLabel(t.date)}</td><td>${esc(t.desc)}</td><td><span class="tag">${esc(categoryName(t.category))}</span></td><td class="num">${formatRupiah(t.amount)}</td></tr>`;
}

export function renderExpenses(root) {
  const filtered = state.transactions.filter((t) => {
    const okCat = state.categoryFilter === 'semua' || t.category === state.categoryFilter;
    const q = state.searchText.trim().toLowerCase();
    const okText = !q || t.desc.toLowerCase().includes(q) || categoryName(t.category).toLowerCase().includes(q);
    return okCat && okText;
  });
  const total = filtered.reduce((s, t) => s + t.amount, 0);

  root.innerHTML = `
  <h1>Pengeluaran</h1>
  <p class="lede">Semua transaksi November 2026. Saring berdasarkan kategori atau cari
  berdasarkan nama — dan tambahkan transaksi baru lewat formulir di bawah.</p>
  <div class="toolbar">
    <label>Kategori
      <select id="f-cat">
        <option value="semua">Semua kategori</option>
        ${CATEGORIES.map((c) => `<option value="${c.id}" ${state.categoryFilter === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
      </select>
    </label>
    <label>Cari
      <input id="f-search" type="search" placeholder="cth: pasar, bensin, SPP" value="${esc(state.searchText)}">
    </label>
    <div class="toolbar-total">Menampilkan <b>${filtered.length}</b> transaksi · total <b>${formatRupiah(total)}</b></div>
  </div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead>
      <tbody>${filtered.length ? filtered.map(transactionRow).join('') : '<tr><td colspan="4" class="empty">Tidak ada transaksi yang cocok.</td></tr>'}</tbody>
    </table>
  </div>
  <section class="card">
    <h2>Tambah transaksi</h2>
    <form id="add-tx" class="form-grid">
      <label>Tanggal <input name="date" type="date" value="2026-11-27" required></label>
      <label>Keterangan <input name="desc" type="text" placeholder="cth: Belanja sayur — Pasar Kosambi" required maxlength="80"></label>
      <label>Kategori
        <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select>
      </label>
      <label>Jumlah (Rp) <input name="amount" type="number" min="1000" step="1000" placeholder="50000" required></label>
      <button class="btn" type="submit">Simpan transaksi</button>
      <p class="form-note" id="tx-note" role="status"></p>
    </form>
  </section>`;

  root.querySelector('#f-cat').addEventListener('change', (e) => {
    state.categoryFilter = e.target.value;
    renderExpenses(root);
  });
  root.querySelector('#f-search').addEventListener('input', (e) => {
    state.searchText = e.target.value;
    renderExpenses(root);
    const input = root.querySelector('#f-search');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  });
  root.querySelector('#add-tx').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const tx = {
      date: String(data.get('date')),
      desc: String(data.get('desc')).trim(),
      category: String(data.get('category')),
      amount: Number(data.get('amount')),
    };
    if (!tx.desc || !(tx.amount > 0)) return;
    state.transactions.unshift(tx);
    renderExpenses(root);
    root.querySelector('#tx-note').textContent = `Tersimpan: ${tx.desc} — ${formatRupiah(tx.amount)}. Total bulan ini sekarang ${formatRupiah(spent())}.`;
  });
}

// ---------------------------------------------------------------- budget

export function renderBudget(root) {
  const byCat = spentByCat();
  const totalBudget = byCat.reduce((s, c) => s + c.budget, 0);
  const totalOut = spent();
  const pct = Math.round((totalOut / totalBudget) * 100);

  root.innerHTML = `
  <h1>Anggaran</h1>
  <p class="lede">Anggaran bulanan per kategori. Bilah menunjukkan pemakaian terhadap
  anggaran — ubah angkanya dan bilah langsung menyesuaikan.</p>
  <div class="money-grid">
    ${moneyCard('Total anggaran', totalBudget, '8 kategori', '')}
    ${moneyCard('Terpakai', totalOut, `${pct}% dari total anggaran`, pct > 100 ? 'out' : 'in')}
    ${moneyCard('Sisa anggaran', totalBudget - totalOut, totalBudget - totalOut >= 0 ? 'Masih dalam batas' : 'Anggaran terlampaui', totalBudget - totalOut >= 0 ? 'save' : 'out')}
  </div>
  <div class="budget-list">
    ${byCat.map((c) => {
      const p = Math.min(100, Math.round((c.spent / c.budget) * 100));
      const over = c.spent > c.budget;
      return `<section class="card budget-row ${over ? 'over' : ''}">
        <div class="budget-head">
          <h2><span class="dot" style="background:${c.color}"></span>${esc(c.name)}</h2>
          <span class="budget-figures">${formatRupiah(c.spent)} <span class="muted">dari</span> ${formatRupiah(c.budget)}</span>
        </div>
        <div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="Pemakaian anggaran ${esc(c.name)}">
          <div class="bar-fill" style="width:${p}%;background:${over ? '#c0564f' : c.color}"></div>
        </div>
        <div class="budget-foot">
          <span>${p}% terpakai · sisa ${formatRupiah(Math.max(0, c.budget - c.spent))}</span>
          <label>Ubah anggaran
            <input type="number" min="0" step="50000" value="${c.budget}" data-budget="${c.id}" aria-label="Anggaran ${esc(c.name)}">
          </label>
        </div>
        ${over ? '<p class="warn">Anggaran kategori ini terlampaui — kurangi belanja atau pindahkan dana dari kategori lain.</p>' : ''}
      </section>`;
    }).join('')}
  </div>`;

  root.querySelectorAll('[data-budget]').forEach((input) => {
    input.addEventListener('change', (e) => {
      const value = Number(e.target.value);
      if (value >= 0) {
        state.budgets[e.target.dataset.budget] = value;
        renderBudget(root);
      }
    });
  });
}

// ---------------------------------------------------------------- goals

export function renderGoals(root) {
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);

  root.innerHTML = `
  <h1>Target Tabungan</h1>
  <p class="lede">Tiga target yang sedang dikejar keluarga ini. Tambahkan setoran dan
  lihat bilah kemajuannya bergerak — setiap rupiah tercatat.</p>
  <div class="money-grid">
    ${moneyCard('Total target', totalTarget, '3 target aktif', '')}
    ${moneyCard('Terkumpul', totalSaved, `${Math.round((totalSaved / totalTarget) * 100)}% dari semua target`, 'save')}
    ${moneyCard('Kekurangan', totalTarget - totalSaved, 'Dengan laju Rp 2,5 jt/bulan: ± 5 tahun lagi', '')}
  </div>
  <div class="goal-list">
    ${state.goals.map((g) => {
      const p = Math.min(100, Math.round((g.saved / g.target) * 100));
      return `<section class="card goal-row">
        <div class="budget-head">
          <h2>${esc(g.name)}</h2>
          <span class="budget-figures">${formatRupiah(g.saved)} <span class="muted">dari</span> ${formatRupiah(g.target)}</span>
        </div>
        <div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="Kemajuan ${esc(g.name)}">
          <div class="bar-fill" style="width:${p}%"></div>
        </div>
        <p class="muted">${esc(g.note)} · ${p}% tercapai · kurang ${formatRupiah(g.target - g.saved)}</p>
        <form class="contribute" data-goal="${g.id}">
          <label>Tambah setoran (Rp)
            <input name="amount" type="number" min="10000" step="10000" placeholder="250000" required>
          </label>
          <button class="btn" type="submit">Setor</button>
          <span class="form-note" role="status"></span>
        </form>
      </section>`;
    }).join('')}
  </div>`;

  root.querySelectorAll('.contribute').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = Number(new FormData(form).get('amount'));
      if (!(amount > 0)) return;
      const goal = state.goals.find((g) => g.id === form.dataset.goal);
      goal.saved += amount;
      renderGoals(root);
      const note = root.querySelector(`[data-goal="${goal.id}"] .form-note`);
      if (note) note.textContent = `Setoran ${formatRupiah(amount)} tercatat. Terkumpul sekarang ${formatRupiah(goal.saved)}.`;
    });
  });
}

// ---------------------------------------------------------------- planner

export function renderPlanner(root) {
  const income = totalIncome();
  root.innerHTML = `
  <h1>Perencana Anggaran</h1>
  <p class="lede">Aturan 50/30/20 untuk pemasukan keluarga ini: 50% kebutuhan, 30%
  keinginan, 20% tabungan. Geser pembagiannya dan lihat angkanya berubah.</p>
  <section class="card">
    <h2>Pemasukan bulanan keluarga</h2>
    <ul class="income-list">
      ${INCOME.map((i) => `<li><span>${esc(i.source)}</span><b>${formatRupiah(i.amount)}</b><small>${esc(i.note)}</small></li>`).join('')}
    </ul>
    <p class="total-line">Total pemasukan <b>${formatRupiah(income)}</b></p>
  </section>
  <section class="card">
    <h2>Atur pembagian 50/30/20</h2>
    <div class="sliders">
      <label>Kebutuhan <span id="v-need">50%</span>
        <input id="s-need" type="range" min="30" max="70" value="50">
      </label>
      <label>Keinginan <span id="v-want">30%</span>
        <input id="s-want" type="range" min="10" max="50" value="30">
      </label>
      <label>Tabungan <span id="v-save">20%</span>
        <input id="s-save" type="range" min="5" max="40" value="20">
      </label>
    </div>
    <div class="split" id="split"></div>
    <p class="muted" id="split-note"></p>
  </section>
  <section class="card">
    <h2>Apa kata angka keluarga ini?</h2>
    <p>Pengeluaran nyata bulan ini <b>${formatRupiah(spent())}</b> — sekitar
    <b>${Math.round((spent() / income) * 100)}%</b> dari pemasukan. Kebutuhan
    (belanja harian, tagihan, transportasi, pendidikan, kesehatan) menyerap
    sebagian besar; ruang terbesar untuk berhemat ada di makan di luar dan hiburan.</p>
    <p>Dengan menabung <b>${formatRupiah(income - spent())}</b> per bulan — sisa
    bulan ini — target Dana Darurat tercapai dalam
    <b>${Math.ceil((20000000 - 12400000) / Math.max(1, income - spent()))} bulan</b>.</p>
  </section>`;

  const need = root.querySelector('#s-need');
  const want = root.querySelector('#s-want');
  const save = root.querySelector('#s-save');
  const split = root.querySelector('#split');
  const note = root.querySelector('#split-note');

  function update() {
    let n = Number(need.value);
    let w = Number(want.value);
    let s = Number(save.value);
    const total = n + w + s;
    if (total !== 100) {
      // Keep the total at 100% by taking the remainder from savings.
      s = 100 - n - w;
      if (s < 0) { s = 0; w = 100 - n; }
      save.value = String(s);
      want.value = String(w);
    }
    root.querySelector('#v-need').textContent = n + '%';
    root.querySelector('#v-want').textContent = w + '%';
    root.querySelector('#v-save').textContent = s + '%';
    split.innerHTML = `
      <div class="split-row"><span>Kebutuhan</span><b>${formatRupiah((income * n) / 100)}</b><i>${n}%</i></div>
      <div class="split-row"><span>Keinginan</span><b>${formatRupiah((income * w) / 100)}</b><i>${w}%</i></div>
      <div class="split-row"><span>Tabungan</span><b>${formatRupiah((income * s) / 100)}</b><i>${s}%</i></div>`;
    note.textContent = s >= 20
      ? 'Pembagian ini sehat: tabungan 20% atau lebih memberi bantalan untuk keadaan darurat.'
      : 'Tabungan di bawah 20% — pertimbangkan memangkas keinginan agar dana darurat tetap tumbuh.';
  }
  need.addEventListener('input', update);
  want.addEventListener('input', update);
  save.addEventListener('input', update);
  update();
}
