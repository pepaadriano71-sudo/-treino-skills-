// ══════════════════════════════════════════════
// PROGRESSION — Skill Cards, Levels, History
// ══════════════════════════════════════════════

import { getRecords, getProgressionDB, getDB } from './supabase.js';
import { SKILLS_PROGRESSION, EXERCISES, SKILL_META } from '../data/skills.js';

// ── State ──
let openSkillCard = null;
let skillTab = {};

// ── SVG Ring Helper ──
function svgRing(pct, size, color, extraClass) {
  const r = (size - 4) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (c * Math.min(100, Math.max(0, pct)) / 100);
  return `<div class="${extraClass || 'ring-wrap'}" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle class="ring__bg" cx="${size / 2}" cy="${size / 2}" r="${r}"/>
      <circle class="ring__fg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${color}" stroke-dasharray="${c}" stroke-dashoffset="${offset}"/>
    </svg>
    <div class="ring__txt">${Math.round(pct)}%</div>
  </div>`;
}

export function toggleSkillCard(key) {
  openSkillCard = (openSkillCard === key) ? null : key;
  renderProgressao();
}

export function setSkillTab(key, tab) {
  skillTab[key] = tab;
  renderProgressao();
}

export function renderProgressao() {
  const list = document.getElementById('progressionList');
  list.innerHTML = '';
  const records = getRecords();
  const progDB = getProgressionDB();
  const db = getDB();
  const recordHistory = db.recordHistory || {};

  Object.entries(SKILLS_PROGRESSION).forEach(([key, skill]) => {
    let currentLevelIdx = 0;
    skill.levels.forEach((lv, i) => { if (progDB[key] && progDB[key][i]) currentLevelIdx = i + 1; });
    currentLevelIdx = Math.min(currentLevelIdx, skill.levels.length - 1);

    const masteredCount = skill.levels.filter((lv, i) => progDB[key] && progDB[key][i]).length;
    const curEx = EXERCISES.find(e => e.skillKey === key && e.levelIdx === currentLevelIdx);
    const curRec = curEx ? records[curEx.id] || 0 : 0;
    const curLvl = skill.levels[currentLevelIdx];
    const curPartial = (!progDB[key] || !progDB[key][currentLevelIdx]) && curLvl ? Math.min(1, curRec / curLvl.target) : 0;
    const overallPct = ((masteredCount + curPartial) / skill.levels.length) * 100;
    const color = skill.color || 'var(--accent)';

    const isOpen = openSkillCard === key;
    const tab = skillTab[key] || 'detalhes';

    const card = document.createElement('div');
    card.className = 'skill-card' + (isOpen ? ' open' : '');

    let html = `<div class="skill-card__head" onclick="window.__toggleSkillCard('${key}')">
      ${svgRing(overallPct, 42, color)}
      <div class="skill-card__info">
        <div class="skill-card__name">${skill.name}</div>
        <div class="skill-card__sub">${masteredCount}/${skill.levels.length} níveis dominados</div>
      </div>
      <div class="skill-card__chevron">▶</div>
    </div>`;

    if (isOpen) {
      html += `<div class="skill-card__body">
        <div class="skill-tabs">
          <button class="skill-tab ${tab === 'detalhes' ? 'active' : ''}" onclick="event.stopPropagation();window.__setSkillTab('${key}','detalhes')">ℹ Detalhes</button>
          <button class="skill-tab ${tab === 'historico' ? 'active' : ''}" onclick="event.stopPropagation();window.__setSkillTab('${key}','historico')">⏱ Histórico</button>
        </div>
        <div class="skill-tab-content">`;

      if (tab === 'detalhes') {
        skill.levels.forEach((lv, i) => {
          const mastered = progDB[key] && progDB[key][i];
          const isCurrent = i === currentLevelIdx && !mastered;
          const isLocked = i > currentLevelIdx && !mastered;
          const exForLevel = EXERCISES.find(e => e.skillKey === key && e.levelIdx === i);
          const rec = exForLevel ? records[exForLevel.id] || 0 : 0;
          const pct = mastered ? 100 : (rec ? Math.min(100, Math.round(rec / lv.target * 100)) : 0);
          const barColor = mastered ? 'var(--green)' : (pct >= 70 ? 'var(--accent2)' : color);

          html += `<div class="lvl-row" style="${isLocked ? 'opacity:0.4' : ''}">
            <div class="lvl-num">${i + 1}</div>
            <div class="lvl-body">
              <div class="lvl-name">${lv.name}</div>
              <div class="lvl-sub">Meta: ${lv.target}${lv.unit === 's' ? 's' : ' reps'}${rec ? ` · Recorde: ${rec}${lv.unit === 's' ? 's' : ' reps'}` : ''}${isCurrent ? ' · <span style="color:' + color + '">atual</span>' : ''}${mastered ? ' · <span style="color:var(--green)">dominado ✓</span>' : ''}</div>
              <div class="lvl-bar-track"><div class="lvl-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>
            </div>
            ${svgRing(pct, 30, barColor, 'lvl-pct-ring')}
          </div>`;
        });
      } else {
        const exIds = EXERCISES.filter(e => e.skillKey === key).map(e => e.id);
        const seen = new Set();
        let entries = [];
        exIds.forEach(exId => {
          if (seen.has(exId)) return;
          seen.add(exId);
          const ex = EXERCISES.find(e => e.id === exId);
          const lv = skill.levels[ex.levelIdx];
          (recordHistory[exId] || []).forEach(h => {
            entries.push({ date: h.date, value: h.value, unit: lv ? lv.unit : 's', levelName: lv ? lv.name : ex.name });
          });
        });
        entries.sort((a, b) => b.date < a.date ? -1 : b.date > a.date ? 1 : 0);

        if (entries.length === 0) {
          html += `<div class="history-empty">Nenhum recorde registrado ainda para ${skill.name}.<br>Registre seus tempos/repetições no Treino para ver o histórico aqui.</div>`;
        } else {
          entries.slice(0, 15).forEach(e => {
            html += `<div class="history-row">
              <div><div>${e.levelName}</div><div class="history-date">${e.date.split('-').reverse().join('/')}</div></div>
              <div class="history-val">${e.value}${e.unit === 's' ? 's' : ' reps'}</div>
            </div>`;
          });
        }
      }
      html += `</div></div>`;
    }

    card.innerHTML = html;
    list.appendChild(card);
  });
}
