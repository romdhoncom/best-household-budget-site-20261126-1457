// DompetKeluarga — hash router. Each section is reached by a link; the
// router swaps the matching view into #view and updates the nav state.

import {
  renderBudget, renderExpenses, renderGoals, renderOverview, renderPlanner,
} from './views.js';

const ROUTES = [
  { hash: '#/overview', label: 'Beranda', render: renderOverview },
  { hash: '#/pengeluaran', label: 'Pengeluaran', render: renderExpenses },
  { hash: '#/anggaran', label: 'Anggaran', render: renderBudget },
  { hash: '#/tabungan', label: 'Target Tabungan', render: renderGoals },
  { hash: '#/perencana', label: 'Perencana', render: renderPlanner },
];

const view = document.getElementById('view');
const nav = document.getElementById('nav');

for (const route of ROUTES) {
  const link = document.createElement('a');
  link.href = route.hash;
  link.textContent = route.label;
  link.dataset.route = route.hash;
  nav.appendChild(link);
}

function currentRoute() {
  const hash = window.location.hash || '#/overview';
  return ROUTES.find((r) => r.hash === hash) ?? ROUTES[0];
}

function route() {
  const active = currentRoute();
  if (window.location.hash !== active.hash) {
    window.history.replaceState(null, '', active.hash);
  }
  for (const link of nav.querySelectorAll('a')) {
    const on = link.dataset.route === active.hash;
    link.classList.toggle('active', on);
    if (on) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  active.render(view);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
