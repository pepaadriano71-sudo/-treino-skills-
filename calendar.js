// ══════════════════════════════════════════════
// CALENDAR — Monthly Calendar, Heatmap, Stats
// ══════════════════════════════════════════════

import {
  getDB, getKey, getTodayStr, getWeekStart, addDays,
  getTrainingStartDate, currentProfile
} from './supabase.js';
import { MONTH_NAMES, MONTH_NAMES_SHORT, DAY_LABELS, SKILLS_PROGRESSION, EXERCISES } from '../data/skills.js';

// ── Calendar State ──
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();

// ── Monthly Calendar ──
export function renderCal() {
  document.getElementById('calMonthTitle').textContent = MONTH_NAMES[calMonth] + ' ' + calYear;

  const dayNames = document.getElementById('calDayNames');
  dayNames.innerHTML = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => `<div class="cal-day-name">${d}</div>`).join('');

  const cells = document.getElementById('calCells');
  cells.innerHTML = '';
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = getTodayStr();
  const db = getDB();
  const startDate = getTrainingStartDate();
  const availDays = (currentProfile && currentProfile.available_days && currentProfile.available_days.length > 0)
    ? currentProfile.available_days : [1, 2, 3, 4, 5];

  for (let i = 0; i < firstDay; i++) cells.innerHTML += `<div class="cal-cell empty"></div>`;

  let totalT = 0, totalS = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = calYear + '-' + String(calMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    const v = db[getKey(ds)];
    const isToday = ds === today;
    const isFuture = ds > today;
    const dayOfWeek = new Date(ds + 'T12:00:00').getDay();
    const isTrainingDay = availDays.includes(dayOfWeek);
    const beforeStart = startDate && ds < startDate;
    let cls = 'cal-cell';
    if (v === 'trained') { cls += ' trained'; totalT++; }
    else if (v === 'skipped' && !beforeStart) { cls += ' skipped'; totalS++; }
    else if (isToday) cls += ' today';
    else if (isFuture || !isTrainingDay || beforeStart) cls += ' future';
    cells.innerHTML += `<div class="${cls}" title="${ds}">${d}</div>`;
  }

  document.getElementById('total-trained').textContent = totalT;
  document.getElementById('total-skip').textContent = totalS;
  const tot = totalT + totalS;
  document.getElementById('total-pct').textContent = tot > 0 ? Math.round(totalT / tot * 100) + '%' : '—';
}

export function calPrev() { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCal(); }
export function calNext() { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCal(); }

// ── Annual Heatmap ──
export function renderHeatmap() {
  const db = getDB();
  const today = getTodayStr();
  const endOfWeek = addDays(getWeekStart(today), 6);
  const totalDays = 52 * 7;
  const startDate = addDays(endOfWeek, -(totalDays - 1));

  const grid = document.getElementById('heatmapGrid');
  const monthsRow = document.getElementById('heatmapMonths');
  const daynames = document.getElementById('heatmapDaynames');
  grid.innerHTML = ''; monthsRow.innerHTML = ''; daynames.innerHTML = '';

  ['', 'Seg', '', 'Qua', '', 'Sex', ''].forEach(d => {
    const s = document.createElement('span'); s.textContent = d; daynames.appendChild(s);
  });

  let lastMonth = -1;
  for (let w = 0; w < 52; w++) {
    const weekCol = document.createElement('div');
    weekCol.className = 'heatmap-week';
    const weekStartDate = addDays(startDate, w * 7);
    const wd = new Date(weekStartDate + 'T12:00:00');
    const m = wd.getMonth();
    const lbl = document.createElement('div');
    lbl.className = 'heatmap-month__lbl';
    lbl.style.width = '14px';
    if (m !== lastMonth) { lbl.textContent = MONTH_NAMES_SHORT[m]; lastMonth = m; }
    monthsRow.appendChild(lbl);

    for (let dow = 0; dow < 7; dow++) {
      const ds = addDays(weekStartDate, dow);
      const cell = document.createElement('div');
      if (ds > today) {
        cell.className = 'heatmap-cell heatmap-cell--future';
      } else {
        const v = db[getKey(ds)];
        const beforeStart = getTrainingStartDate() && ds < getTrainingStartDate();
        let cls = 'heatmap-cell ';
        if (v === 'trained') cls += 'heatmap-cell--3';
        else if (v === 'skipped' && !beforeStart) cls += 'heatmap-cell--skip';
        else cls += 'heatmap-cell--0';
        cell.className = cls;
        cell.title = ds + (v === 'trained' ? ' — treinei' : (!beforeStart && v === 'skipped') ? ' — não treinei' : '');
      }
      weekCol.appendChild(cell);
    }
    grid.appendChild(weekCol);
  }

  const scroller = document.querySelector('.heatmap-scroll');
  if (scroller) scroller.scrollLeft = scroller.scrollWidth;
}

// ── Statistics ──
export function renderStats() {
  const db = getDB();
  const today = getTodayStr();

  const dayEntries = Object.keys(db)
    .filter(k => k.startsWith('day_'))
    .map(k => ({ date: k.replace('day_', ''), status: db[k] }))
    .sort((a, b) => a.date < b.date ? -1 : 1);

  let totalTrained = 0, totalSkipped = 0;
  dayEntries.forEach(e => { if (e.status === 'trained') totalTrained++; else if (e.status === 'skipped') totalSkipped++; });

  const minutesPerSession = (currentProfile && currentProfile.time_per_session) ? currentProfile.time_per_session : 45;
  const totalHours = (totalTrained * minutesPerSession / 60);
  document.getElementById('stat-hours').textContent = totalHours.toFixed(1) + 'h';
  document.getElementById('stat-hours-sub').textContent = `${totalTrained} treino(s) × ${minutesPerSession}min`;

  // Best skill
  const progDB = db.progression || {};
  let bestSkill = null, bestLevel = -1;
  Object.entries(SKILLS_PROGRESSION).forEach(([key, skill]) => {
    let masteredCount = 0;
    skill.levels.forEach((lv, i) => { if (progDB[key] && progDB[key][i]) masteredCount++; });
    if (masteredCount > bestLevel) { bestLevel = masteredCount; bestSkill = skill; }
  });
  if (bestSkill && bestLevel > 0) {
    document.getElementById('stat-best-skill').textContent = bestSkill.name;
    document.getElementById('stat-best-skill-sub').textContent = `${bestLevel}/${bestSkill.levels.length} níveis dominados`;
  } else {
    document.getElementById('stat-best-skill').textContent = '--';
    document.getElementById('stat-best-skill-sub').textContent = 'registre recordes para começar';
  }

  // Most trained skill
  const recordHistory = db.recordHistory || {};
  const skillCounts = {};
  Object.entries(recordHistory).forEach(([exId, history]) => {
    const ex = EXERCISES.find(e => e.id === exId);
    if (ex && ex.skillKey) skillCounts[ex.skillKey] = (skillCounts[ex.skillKey] || 0) + history.length;
  });
  let mostSkillKey = null, mostCount = 0;
  Object.entries(skillCounts).forEach(([key, count]) => { if (count > mostCount) { mostCount = count; mostSkillKey = key; } });
  if (mostSkillKey) {
    document.getElementById('stat-most-skill').textContent = SKILLS_PROGRESSION[mostSkillKey].name;
    document.getElementById('stat-most-skill-sub').textContent = `${mostCount} recorde(s) registrado(s)`;
  } else {
    document.getElementById('stat-most-skill').textContent = '--';
    document.getElementById('stat-most-skill-sub').textContent = 'sem dados ainda';
  }

  // Streaks
  let currentStreak = 0, bestStreak = 0, run = 0;
  for (let i = 0; i < dayEntries.length; i++) {
    if (dayEntries[i].status === 'trained') { run++; bestStreak = Math.max(bestStreak, run); }
    else run = 0;
  }
  for (let i = dayEntries.length - 1; i >= 0; i--) {
    if (dayEntries[i].status === 'trained') currentStreak++;
    else break;
  }
  document.getElementById('stat-streak').textContent = currentStreak + (currentStreak === 1 ? ' dia' : ' dias');
  document.getElementById('stat-best-streak-sub').textContent = `melhor: ${bestStreak} dia${bestStreak === 1 ? '' : 's'}`;

  // Best week
  const weekMap = {};
  dayEntries.forEach(e => {
    const ws = getWeekStart(e.date);
    if (!weekMap[ws]) weekMap[ws] = { trained: 0, total: 0 };
    weekMap[ws].total++;
    if (e.status === 'trained') weekMap[ws].trained++;
  });
  let bestWeek = null, bestWeekPct = -1;
  Object.entries(weekMap).forEach(([ws, v]) => {
    const pct = v.total > 0 ? v.trained / v.total : 0;
    if (pct > bestWeekPct || (pct === bestWeekPct && v.trained > (bestWeek ? bestWeek.trained : 0))) {
      bestWeekPct = pct; bestWeek = { ws, ...v };
    }
  });
  if (bestWeek && bestWeek.trained > 0) {
    document.getElementById('stat-best-week').textContent = Math.round(bestWeekPct * 100) + '%';
    document.getElementById('stat-best-week-sub').textContent = `semana de ${bestWeek.ws.split('-').reverse().join('/')} — ${bestWeek.trained}/${bestWeek.total} treinos`;
  } else {
    document.getElementById('stat-best-week').textContent = '--';
    document.getElementById('stat-best-week-sub').textContent = 'sem dados ainda';
  }

  // Best month
  const monthMap = {};
  dayEntries.forEach(e => {
    const ym = e.date.slice(0, 7);
    if (!monthMap[ym]) monthMap[ym] = { trained: 0, total: 0 };
    monthMap[ym].total++;
    if (e.status === 'trained') monthMap[ym].trained++;
  });
  let bestMonth = null, bestMonthPct = -1;
  Object.entries(monthMap).forEach(([ym, v]) => {
    const pct = v.total > 0 ? v.trained / v.total : 0;
    if (pct > bestMonthPct || (pct === bestMonthPct && v.trained > (bestMonth ? bestMonth.trained : 0))) {
      bestMonthPct = pct; bestMonth = { ym, ...v };
    }
  });
  if (bestMonth && bestMonth.trained > 0) {
    const [yy, mm] = bestMonth.ym.split('-');
    document.getElementById('stat-best-month').textContent = Math.round(bestMonthPct * 100) + '%';
    document.getElementById('stat-best-month-sub').textContent = `${MONTH_NAMES[parseInt(mm) - 1]}/${yy} — ${bestMonth.trained}/${bestMonth.total} treinos`;
  } else {
    document.getElementById('stat-best-month').textContent = '--';
    document.getElementById('stat-best-month-sub').textContent = 'sem dados ainda';
  }
}
