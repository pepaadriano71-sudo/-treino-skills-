// ══════════════════════════════════════════════
// WORKOUT — Training Page, Day Detail, Exercise Modal
// ══════════════════════════════════════════════

import {
  getDB, setDB, getKey, getTodayStr, getWeekStart, addDays, isPast,
  getTrainingStartDate, startTraining, getRecords, saveRecordDB,
  saveProgressionDB, currentProfile
} from './supabase.js';
import { EXERCISES, WEEK_DAYS, DAY_LABELS, SKILLS_PROGRESSION } from '../data/skills.js';

// ── State ──
let _selectedTreinoDate = undefined;
let _selectedTreinoWdIdx = 0;
let currentExId = null;

// ── Render Training Page ──
export function renderTreino() {
  const today = getTodayStr();
  const weekStart = getWeekStart(today);
  const ptDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const d = new Date(today + 'T12:00:00');
  document.getElementById('todayName').textContent = ptDays[d.getDay()];
  document.getElementById('todayDate').textContent = today.split('-').reverse().join('/');

  const startDate = getTrainingStartDate();
  const availDays = (currentProfile && currentProfile.available_days && currentProfile.available_days.length > 0)
    ? currentProfile.available_days : [1, 2, 3, 4, 5];

  // Show/hide start banner
  const banner = document.getElementById('startBanner');
  if (banner) banner.style.display = startDate ? 'none' : 'block';

  // Build week dates
  const sundayOfWeek = addDays(weekStart, -1);
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const ds = addDays(sundayOfWeek, i);
    const dow = new Date(ds + 'T12:00:00').getDay();
    if (availDays.includes(dow)) weekDates.push({ ds, dow });
  }

  // Auto-mark past days as skipped
  const db = getDB();
  if (startDate) {
    weekDates.forEach(({ ds }) => {
      const k = getKey(ds);
      if (isPast(ds) && ds >= startDate && !db[k]) { db[k] = 'skipped'; setDB(db); }
    });
  }

  // Count stats
  let trained = 0, skipped = 0;
  weekDates.forEach(({ ds }) => {
    if (startDate && ds < startDate) return;
    const v = db[getKey(ds)];
    if (v === 'trained') trained++;
    else if (v === 'skipped') skipped++;
  });
  const total = trained + skipped;
  const numDays = weekDates.length || 1;
  const pct = total > 0 ? Math.round(trained / total * 100) : 0;

  document.getElementById('ws-done').textContent = trained;
  document.getElementById('ws-skip').textContent = skipped;
  document.getElementById('ws-pct').textContent = pct + '%';

  const circ = 163.4;
  document.getElementById('ring-done').style.strokeDashoffset = circ - (circ * (trained / numDays));
  document.getElementById('ring-done-txt').textContent = Math.round(trained / numDays * 100) + '%';
  document.getElementById('ring-skip').style.strokeDashoffset = circ - (circ * (skipped / numDays));
  document.getElementById('ring-skip-txt').textContent = Math.round(skipped / numDays * 100) + '%';

  // Day strip
  const dowToWD = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };
  const strip = document.getElementById('weekStrip');
  strip.innerHTML = '';

  if (_selectedTreinoDate === undefined || !weekDates.some(w => w.ds === _selectedTreinoDate)) {
    const todayEntry = weekDates.find(w => w.ds === today);
    _selectedTreinoDate = todayEntry ? todayEntry.ds : (weekDates[0] ? weekDates[0].ds : today);
  }

  weekDates.forEach(({ ds, dow }) => {
    const v = db[getKey(ds)];
    const isToday = ds === today;
    const beforeStart = startDate && ds < startDate;
    const wdIdx = dowToWD[dow] !== undefined ? dowToWD[dow] : null;
    const dayInfo = wdIdx !== null ? WEEK_DAYS[wdIdx] : {
      name: DAY_LABELS[dow], icon: '📅', focus: 'Treino livre', color: 'var(--dim)'
    };
    const chip = document.createElement('div');
    let cls = 'day-chip';
    if (ds === _selectedTreinoDate) cls += ' current';
    if (v === 'trained') cls += ' trained';
    else if (v === 'skipped' && !beforeStart) cls += ' skipped';
    chip.className = cls;
    const dd = ds.split('-');
    chip.innerHTML = `<div class="day-chip__dow">${DAY_LABELS[dow]}</div><div class="day-chip__icon">${dayInfo.icon}</div><div class="day-chip__date">${dd[2]}/${dd[1]}</div><div class="day-chip__dot"></div>`;
    chip.onclick = () => { _selectedTreinoDate = ds; renderTreino(); };
    strip.appendChild(chip);
  });

  // Detail panel
  const sel = weekDates.find(w => w.ds === _selectedTreinoDate) || weekDates[0];
  if (sel) {
    const v = db[getKey(sel.ds)];
    const beforeStart = startDate && sel.ds < startDate;
    const wdIdx = dowToWD[sel.dow] !== undefined ? dowToWD[sel.dow] : null;
    const dayInfo = wdIdx !== null ? WEEK_DAYS[wdIdx] : {
      name: DAY_LABELS[sel.dow], icon: '📅', focus: 'Treino livre', color: 'var(--dim)'
    };
    let statusTxt;
    if (v === 'trained') statusTxt = '✓ Treinado';
    else if (v === 'skipped' && !beforeStart) statusTxt = '✗ Perdido';
    else if (sel.ds === today) statusTxt = 'Hoje';
    else statusTxt = sel.ds.split('-').reverse().join('/');
    document.getElementById('wd-icon').textContent = dayInfo.icon;
    document.getElementById('wd-name').textContent = dayInfo.name + ' · ' + dayInfo.focus;
    document.getElementById('wd-sub').textContent = statusTxt;
    _selectedTreinoWdIdx = wdIdx !== null ? wdIdx : 0;
  }
}

export function openSelectedDay() {
  if (!_selectedTreinoDate) return;
  openDayModal(_selectedTreinoWdIdx || 0, _selectedTreinoDate);
}

// ── Day Modal ──
export function openDayModal(dayIdx, dateStr) {
  const dayInfo = WEEK_DAYS[dayIdx];
  const exs = EXERCISES.filter(e => e.day === dayIdx);
  const db = getDB();
  const status = db[getKey(dateStr)];

  let html = `<div style="padding:18px 18px 0"><div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><div style="font-size:22px">${dayInfo.icon}</div><div><div style="font-size:17px;font-weight:700;color:${dayInfo.color}">${dayInfo.name}</div><div style="font-size:11px;color:var(--muted);font-family:'Space Mono',monospace">${dayInfo.focus}</div></div></div>`;
  html += `<div style="display:flex;flex-direction:column;gap:7px;margin-bottom:14px">`;
  exs.forEach(ex => {
    const rec = getRecords()[ex.id];
    html += `<div onclick="window.__openExModal('${ex.id}')" class="day-exercise"><div><div class="day-exercise__name">${ex.name}</div><div class="day-exercise__en">${ex.nameEn}</div>${rec ? `<div class="day-exercise__record">🏆 Recorde: ${rec}s</div>` : ''}</div><div class="day-exercise__sets">${ex.sets}</div></div>`;
  });
  html += `</div>`;
  if (status !== 'trained') {
    html += `<button onclick="window.__markDayTrained('${dateStr}')" class="btn btn--primary btn--block" style="margin-bottom:14px">✓ MARCAR DIA COMO TREINADO</button>`;
  } else {
    html += `<div class="badge badge--green" style="width:100%;text-align:center;margin-bottom:14px">✓ DIA TREINADO!</div>`;
  }
  html += `</div>`;

  document.getElementById('dmTitle').textContent = dayInfo.name + ' — Exercícios';
  document.getElementById('dmEn').textContent = dateStr.split('-').reverse().join('/');
  document.getElementById('dmBody').innerHTML = html;
  document.getElementById('dayModalBg').classList.add('open');
  window._modalDayDate = dateStr;
}

export function closeDayModal() { document.getElementById('dayModalBg').classList.remove('open'); }
export function closeDayModalBg(e) { if (e.target === document.getElementById('dayModalBg')) closeDayModal(); }

export function markDayTrained(dateStr) {
  const db = getDB();
  db[getKey(dateStr)] = 'trained';
  setDB(db);
  closeDayModal();
  renderTreino();
}

// ── Exercise Modal ──
export function openExModal(exId) {
  const ex = EXERCISES.find(e => e.id === exId);
  if (!ex) return;
  currentExId = exId;

  document.getElementById('mTitle').textContent = ex.name;
  document.getElementById('mEn').textContent = ex.nameEn;

  const wrap = document.getElementById('mVideoWrap');
  const link = document.getElementById('mVideoLink');
  const thumb = document.getElementById('mVideoThumb');
  if (ex.yt) {
    wrap.style.display = 'block';
    link.href = `https://www.youtube.com/watch?v=${ex.yt}`;
    thumb.src = `https://img.youtube.com/vi/${ex.yt}/hqdefault.jpg`;
    thumb.onerror = () => { thumb.src = `https://img.youtube.com/vi/${ex.yt}/mqdefault.jpg`; };
  } else {
    wrap.style.display = 'none';
  }

  document.getElementById('mHow').textContent = ex.how;
  document.getElementById('mTip').innerHTML = '💡 ' + ex.tip;

  const eq = document.getElementById('mEquip');
  eq.innerHTML = '';
  const colors = { chão: 'var(--accent)', parede: 'var(--purple)', livros: 'var(--accent3)', barra: 'var(--accent2)' };
  ex.equip.forEach(e => {
    eq.innerHTML += `<span class="chip" style="color:${colors[e] || 'var(--dim)'};border-color:${colors[e] || 'var(--dim)'}33">${e}</span>`;
  });

  document.getElementById('mSetsName').textContent = 'Séries / Volume';
  document.getElementById('mSets').textContent = ex.sets;

  const recSec = document.getElementById('mRecordSection');
  if (ex.hasRecord) {
    const unit = (ex.skillKey && SKILLS_PROGRESSION[ex.skillKey] && ex.levelIdx != null)
      ? SKILLS_PROGRESSION[ex.skillKey].levels[ex.levelIdx]?.unit || 's' : 's';
    const isReps = unit === 'reps';
    recSec.style.display = 'block';
    recSec.querySelector('.record-label').textContent = `🏆 Salvar meu recorde (${isReps ? 'repetições' : 'segundos'})`;
    document.getElementById('mRecordInput').placeholder = isReps ? 'ex: 3' : 'ex: 12';
    document.getElementById('mRecordInput').value = '';
    const rec = getRecords()[exId] || 0;
    document.getElementById('mRecordBest').innerHTML = rec ? `Seu recorde atual: <span>${rec}${unit}</span>` : `Nenhum recorde salvo ainda`;
    renderModalProgress(ex, rec);
  } else {
    recSec.style.display = 'none';
    document.getElementById('mProgSection').innerHTML = '';
  }

  const doneBtn = document.getElementById('mDoneBtn');
  doneBtn.style.display = 'block';
  doneBtn.className = 'btn btn--block';
  doneBtn.textContent = '✓ Feito';

  document.getElementById('exModalBg').classList.add('open');
}

export function closeExModal() { document.getElementById('exModalBg').classList.remove('open'); }
export function closeExModalBg(e) { if (e.target === document.getElementById('exModalBg')) closeExModal(); }

export function renderModalProgress(ex, currentRec) {
  if (!ex.skillKey) return;
  const skill = SKILLS_PROGRESSION[ex.skillKey];
  const level = skill.levels[ex.levelIdx];
  if (!level) return;
  const target = level.target;
  const unit = level.unit || 's';
  const pct = Math.min(100, Math.round(currentRec / target * 100));
  const sec = document.getElementById('mProgSection');
  let barCls = 'progress-bar__fill';
  if (pct >= 100) barCls += ' progress-bar__fill--done';
  else if (pct >= 70) barCls += ' progress-bar__fill--close';

  sec.innerHTML = `
    <div style="margin-top:10px;font-family:'Space Mono',monospace;font-size:9px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px">Progresso para dominar</div>
    <div class="prog-row">
      <div class="prog-name">${currentRec}${unit} / ${target}${unit}</div>
      <div class="progress-bar" style="flex:2"><div class="${barCls}" style="width:${pct}%"></div></div>
      <div class="prog-pct">${pct}%</div>
    </div>
    ${pct >= 100 ? `<div class="next-level">🎉 <strong>Dominado!</strong> Próxima etapa desbloqueada na aba Progressão.</div>` : ''}
  `;
  if (pct >= 100) saveProgressionDB(ex.skillKey, ex.levelIdx);
}

export function saveRecord() {
  const val = parseInt(document.getElementById('mRecordInput').value);
  if (!val || val < 1) return;
  const ex = EXERCISES.find(e => e.id === currentExId);
  const unit = (ex && ex.skillKey && SKILLS_PROGRESSION[ex.skillKey] && ex.levelIdx != null)
    ? SKILLS_PROGRESSION[ex.skillKey].levels[ex.levelIdx]?.unit || 's' : 's';
  const improved = saveRecordDB(currentExId, val);
  const rec = getRecords()[currentExId];
  document.getElementById('mRecordBest').innerHTML = `Seu recorde atual: <span>${rec}${unit}</span>${improved ? ' 🎉 Novo recorde!' : ''}`;
  if (ex && ex.hasRecord) renderModalProgress(ex, rec);
}

export function markExDone() {
  const btn = document.getElementById('mDoneBtn');
  btn.className = 'btn btn--success btn--block';
  btn.textContent = '✓ Feito!';
}

// ── Auto-mark past days ──
export function autoMarkPastDays() {
  const startDate = getTrainingStartDate();
  if (!startDate) return;
  const today = getTodayStr();
  const db = getDB();
  const availDays = (currentProfile && currentProfile.available_days && currentProfile.available_days.length > 0)
    ? currentProfile.available_days : [1, 2, 3, 4, 5];

  for (let offset = 60; offset >= 1; offset--) {
    const ds = addDays(today, -offset);
    if (ds < startDate) continue;
    const dow = new Date(ds + 'T12:00:00').getDay();
    if (!availDays.includes(dow)) continue;
    if (!db[getKey(ds)]) { db[getKey(ds)] = 'skipped'; }
  }
  setDB(db);
}

export function cleanDirtySkippedDays() {
  const startDate = getTrainingStartDate();
  const db = getDB();
  let dirty = false;
  Object.keys(db).forEach(k => {
    if (!k.startsWith('day_')) return;
    const ds = k.replace('day_', '');
    if (db[k] === 'skipped') {
      if (!startDate || ds < startDate) {
        delete db[k];
        dirty = true;
      }
    }
  });
  if (dirty) setDB(db);
}
