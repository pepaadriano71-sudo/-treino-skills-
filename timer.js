// ══════════════════════════════════════════════
// TIMER — Stopwatch, Countdown & Quick Records
// ══════════════════════════════════════════════

import { getRecords, saveRecordDB } from './supabase.js';
import { EXERCISES, SKILLS_PROGRESSION, SKILL_META } from '../data/skills.js';

// ── Timer State ──
let tInterval = null;
let tSecs = 0;
let tRunning = false;
let tMode = 'hold';
let tCD = 120;
const TIMER_RING_CIRC = 628.3;

function fmt(s) {
  const m = Math.floor(Math.abs(s) / 60), r = Math.abs(s) % 60;
  return String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
}

export function tRender() {
  const d = document.getElementById('timerDisp');
  if (d) {
    d.textContent = fmt(tSecs);
    d.className = 'timer-big' + (tRunning ? (tMode === 'hold' ? ' timer-big--go' : ' timer-big--rest') : '');
  }
  const ring = document.getElementById('timerRingFg');
  if (ring) {
    ring.classList.toggle('timer-ring__fg--rest', tMode === 'rest');
    let pct;
    if (tMode === 'rest') {
      pct = tCD > 0 ? Math.max(0, Math.min(1, tSecs / tCD)) : 0;
    } else {
      pct = (tSecs % 60) / 60;
      if (tSecs > 0 && pct === 0) pct = 1;
    }
    ring.style.strokeDashoffset = TIMER_RING_CIRC - (TIMER_RING_CIRC * pct);
  }
}

export function setTimerMode(m) {
  tMode = m; clearInterval(tInterval); tRunning = false;
  document.getElementById('startBtn').textContent = 'INICIAR';
  document.getElementById('tmode-hold').classList.toggle('active', m === 'hold');
  document.getElementById('tmode-rest').classList.toggle('active', m === 'rest');
  document.getElementById('timerPresets').style.display = m === 'rest' ? 'flex' : 'none';
  document.getElementById('timer-mode-lbl').textContent = m === 'hold' ? 'MODO: SEGURAR' : 'MODO: DESCANSO';
  tSecs = m === 'rest' ? tCD : 0; tRender();
}

export function setCD(s) {
  clearInterval(tInterval); tRunning = false;
  document.getElementById('startBtn').textContent = 'INICIAR';
  tCD = s; tSecs = s; tRender();
}

export function timerStartStop() {
  if (tRunning) {
    clearInterval(tInterval); tRunning = false;
    document.getElementById('startBtn').textContent = 'RETOMAR';
  } else {
    tRunning = true;
    document.getElementById('startBtn').textContent = 'PAUSAR';
    tInterval = setInterval(() => {
      if (tMode === 'rest') {
        if (tSecs > 0) tSecs--;
        if (tSecs <= 0) { tSecs = 0; clearInterval(tInterval); tRunning = false; document.getElementById('startBtn').textContent = 'INICIAR'; }
      } else { tSecs++; }
      tRender();
    }, 1000);
  }
  tRender();
}

export function timerReset() {
  clearInterval(tInterval); tRunning = false;
  tSecs = tMode === 'rest' ? tCD : 0;
  document.getElementById('startBtn').textContent = 'INICIAR';
  tRender();
}

// ── Quick Records ──
export function renderQuickRecords() {
  const records = getRecords();
  const list = document.getElementById('quickRecords');
  list.innerHTML = '';

  let any = false;
  Object.entries(SKILLS_PROGRESSION).forEach(([key, skill]) => {
    const exsWithRecord = EXERCISES.filter(e => e.hasRecord && e.skillKey === key);
    const seen = new Set();
    const unique = exsWithRecord.filter(e => { if (seen.has(e.id)) return false; seen.add(e.id); return true; });
    if (unique.length === 0) return;
    any = true;
    const meta = SKILL_META[key] || { icon: '🏆', color: 'var(--accent)' };

    const group = document.createElement('div');
    group.className = 'rec-group';
    group.innerHTML = `<div class="rec-group__head"><span style="font-size:16px">${meta.icon}</span><span class="rec-group__name" style="color:${meta.color}">${skill.name}</span></div>`;

    unique.forEach(ex => {
      const rec = records[ex.id] || 0;
      const lvl = (ex.levelIdx != null) ? skill.levels[ex.levelIdx] : null;
      const target = lvl ? lvl.target : null;
      const unit = lvl ? lvl.unit : 's';
      const pct = target ? Math.min(100, Math.round(rec / target * 100)) : 0;

      const card = document.createElement('div');
      card.className = 'rec-card' + (rec ? ' has-record' : '');
      card.style.setProperty('--accent-c', meta.color);
      card.innerHTML = `
        <div class="rec-card__info">
          <div class="rec-card__name">${ex.name}</div>
          <div class="rec-card__en">${ex.nameEn}</div>
          ${target ? `<div class="rec-card__bar"><div class="rec-card__bar-fill" style="width:${pct}%;background:${meta.color}"></div></div>` : ''}
        </div>
        <div>
          <div class="rec-card__val ${rec ? '' : 'rec-card__val--empty'}">${rec || '—'}${rec ? unit : ''}</div>
          ${target ? `<div class="rec-card__target">meta: ${target}${unit}</div>` : ''}
        </div>
        <div class="rec-card-input-wrap">
          <input type="number" placeholder="${unit}" min="1" max="999" id="qr_${ex.id}" class="input input--sm rec-card-input">
          <button onclick="window.__saveQuickRecord('${ex.id}')" class="btn" title="Salvar" style="padding:7px 10px;font-size:13px">✓</button>
        </div>
      `;
      group.appendChild(card);
    });
    list.appendChild(group);
  });

  if (!any) {
    list.innerHTML = '<div class="rec-empty">Nenhum exercício com recorde configurado ainda.</div>';
  }
}

export function saveQuickRecord(exId) {
  const val = parseInt(document.getElementById('qr_' + exId).value);
  if (!val || val < 1) return;
  saveRecordDB(exId, val);
  renderQuickRecords();
  import('./progression.js').then(m => m.renderProgressao());
}
