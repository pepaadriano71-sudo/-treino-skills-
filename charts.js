// ══════════════════════════════════════════════
// CHARTS — Weekly Bar Chart & Record Evolution
// ══════════════════════════════════════════════

import { getDB, getKey, getWeekStart, addDays, getTodayStr } from './supabase.js';
import { EXERCISES } from '../data/skills.js';

let weekChartInstance = null;
let evoChartInstance = null;

export function renderWeekChart() {
  const db = getDB();
  const today = getTodayStr();
  const canvas = document.getElementById('weekChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const labels = [], trainedData = [], skippedData = [];
  const thisWeekStart = getWeekStart(today);
  for (let w = 7; w >= 0; w--) {
    const ws = addDays(thisWeekStart, -w * 7);
    let trained = 0, skipped = 0;
    for (let i = 0; i < 5; i++) {
      const ds = addDays(ws, i);
      const v = db[getKey(ds)];
      if (v === 'trained') trained++;
      else if (v === 'skipped') skipped++;
    }
    labels.push(ws.slice(5).split('-').reverse().join('/'));
    trainedData.push(trained);
    skippedData.push(skipped);
  }

  if (weekChartInstance) weekChartInstance.destroy();
  weekChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Treinados', data: trainedData, backgroundColor: 'rgba(74,245,74,0.6)', borderRadius: 3 },
        { label: 'Perdidos', data: skippedData, backgroundColor: 'rgba(245,74,74,0.5)', borderRadius: 3 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#888', font: { size: 10 } } } },
      scales: {
        x: { stacked: true, ticks: { color: '#555', font: { size: 9 } }, grid: { color: '#252525' } },
        y: { stacked: true, beginAtZero: true, max: 5, ticks: { color: '#555', font: { size: 9 }, stepSize: 1 }, grid: { color: '#252525' } }
      }
    }
  });
}

export function populateEvoSkillSelect() {
  const sel = document.getElementById('evoSkillSelect');
  if (!sel) return;
  const records = (getDB().records) || {};
  const history = (getDB().recordHistory) || {};
  const opts = [];
  EXERCISES.filter(e => e.hasRecord).forEach(ex => {
    const seen = opts.find(o => o.id === ex.id);
    if (!seen) opts.push({ id: ex.id, name: ex.name, count: (history[ex.id] || []).length });
  });
  sel.innerHTML = opts.map(o => `<option value="${o.id}">${o.name}${o.count ? ` (${o.count} registro${o.count === 1 ? '' : 's'})` : ' (sem histórico)'}</option>`).join('');
}

export function renderEvoChart() {
  const canvas = document.getElementById('evoChart');
  if (!canvas || typeof Chart === 'undefined') return;
  const sel = document.getElementById('evoSkillSelect');
  const exId = sel ? sel.value : null;
  const db = getDB();
  const history = (db.recordHistory && db.recordHistory[exId]) ? db.recordHistory[exId] : [];

  const labels = history.map(h => h.date.slice(5).split('-').reverse().join('/'));
  const data = history.map(h => h.value);

  if (evoChartInstance) evoChartInstance.destroy();
  evoChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels.length ? labels : ['--'],
      datasets: [{
        label: 'Recorde (s / reps)',
        data: data.length ? data : [0],
        borderColor: '#c8f54a',
        backgroundColor: 'rgba(200,245,74,0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#555', font: { size: 9 } }, grid: { color: '#252525' } },
        y: { beginAtZero: true, ticks: { color: '#555', font: { size: 9 } }, grid: { color: '#252525' } }
      }
    }
  });
}
