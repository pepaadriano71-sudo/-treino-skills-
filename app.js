// ══════════════════════════════════════════════
// APP — Main Controller, Navigation, Init
// ══════════════════════════════════════════════

import { hide, show } from './supabase.js';
import { renderTreino, cleanDirtySkippedDays, autoMarkPastDays } from './workout.js';
import { renderCal, renderHeatmap, renderStats } from './calendar.js';
import { renderWeekChart, populateEvoSkillSelect, renderEvoChart } from './charts.js';
import { renderProgressao } from './progression.js';
import { renderQuickRecords } from './timer.js';
import { renderPerfil } from './profile.js';

// ── Navigation ──
const PAGE_MAP = { treino: 0, calendario: 1, progressao: 2, timer: 3, perfil: 4 };

export function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-tab')[PAGE_MAP[id]].classList.add('active');

  switch (id) {
    case 'treino': renderTreino(); break;
    case 'calendario':
      renderCal(); renderHeatmap(); renderStats();
      renderWeekChart(); populateEvoSkillSelect(); renderEvoChart();
      break;
    case 'progressao': renderProgressao(); break;
    case 'timer': renderQuickRecords(); break;
    case 'perfil': renderPerfil(); break;
  }
}

// ── App Entry ──
export function enterApp() {
  hide('loadingScreen'); hide('authScreen'); hide('setupScreen');
  show('appShell');
  document.getElementById('appShell').classList.add('active');
  cleanDirtySkippedDays();
  autoMarkPastDays();
  renderTreino();
  import('./timer.js').then(m => m.tRender());
}

// ── Global Window Bindings (for HTML onclick handlers) ──
export function initGlobalBindings() {
  // Workout
  window.__openExModal = (exId) => import('./workout.js').then(m => m.openExModal(exId));
  window.__markDayTrained = (dateStr) => import('./workout.js').then(m => m.markDayTrained(dateStr));
  window.__closeDayModal = () => import('./workout.js').then(m => m.closeDayModal());
  window.__closeDayModalBg = (e) => { if (e.target === document.getElementById('dayModalBg')) import('./workout.js').then(m => m.closeDayModal()); };
  window.__closeExModal = () => import('./workout.js').then(m => m.closeExModal());
  window.__closeExModalBg = (e) => { if (e.target === document.getElementById('exModalBg')) import('./workout.js').then(m => m.closeExModal()); };
  window.__saveRecord = () => import('./workout.js').then(m => m.saveRecord());
  window.__markExDone = () => import('./workout.js').then(m => m.markExDone());
  window.__openSelectedDay = () => import('./workout.js').then(m => m.openSelectedDay());
  window.__startTraining = () => import('./workout.js').then(m => m.startTraining());

  // Calendar
  window.__calPrev = () => import('./calendar.js').then(m => m.calPrev());
  window.__calNext = () => import('./calendar.js').then(m => m.calNext());

  // Progression
  window.__toggleSkillCard = (key) => import('./progression.js').then(m => m.toggleSkillCard(key));
  window.__setSkillTab = (key, tab) => import('./progression.js').then(m => m.setSkillTab(key, tab));

  // Timer
  window.__setTimerMode = (mode) => import('./timer.js').then(m => m.setTimerMode(mode));
  window.__setCD = (s) => import('./timer.js').then(m => m.setCD(s));
  window.__timerStartStop = () => import('./timer.js').then(m => m.timerStartStop());
  window.__timerReset = () => import('./timer.js').then(m => m.timerReset());
  window.__saveQuickRecord = (exId) => import('./timer.js').then(m => m.saveQuickRecord(exId));

  // Charts
  window.__renderEvoChart = () => import('./charts.js').then(m => m.renderEvoChart());

  // Profile
  window.__openEditProfile = () => import('./profile.js').then(m => m.openEditProfile());
  window.__closeEditProfile = () => import('./profile.js').then(m => m.closeEditProfile());
  window.__closeEditProfileBg = (e) => { if (e.target === document.getElementById('editProfileBg')) import('./profile.js').then(m => m.closeEditProfile()); };
  window.__handleEditProfileSubmit = () => import('./profile.js').then(m => m.handleEditProfileSubmit());
  window.__openClearProgress = () => import('./profile.js').then(m => m.openClearProgress());
  window.__closeClearProgress = () => import('./profile.js').then(m => m.closeClearProgress());
  window.__closeClearProgressBg = (e) => { if (e.target === document.getElementById('clearProgressBg')) import('./profile.js').then(m => m.closeClearProgress()); };
  window.__handleClearProgress = () => import('./profile.js').then(m => m.handleClearProgress());
  window.__openDeleteAccount = () => import('./profile.js').then(m => m.openDeleteAccount());
  window.__closeDeleteAccount = () => import('./profile.js').then(m => m.closeDeleteAccount());
  window.__closeDeleteAccountBg = (e) => { if (e.target === document.getElementById('deleteAccountBg')) import('./profile.js').then(m => m.closeDeleteAccount()); };
  window.__handleDeleteAccount = () => import('./profile.js').then(m => m.handleDeleteAccount());
  window.__handleLogout = () => import('./profile.js').then(m => m.handleLogout());

  // Auth
  window.__setAuthTab = (mode) => import('./auth.js').then(m => m.setAuthTab(mode));
  window.__handleAuthSubmit = () => import('./auth.js').then(m => m.handleAuthSubmit());
  window.__handleForgotPassword = () => import('./auth.js').then(m => m.handleForgotPassword());
  window.__togglePasswordVisibility = (inputId, btn) => import('./auth.js').then(m => m.togglePasswordVisibility(inputId, btn));

  // Setup
  window.__toggleChip = (el) => el.classList.toggle('sel');
  window.__handleSetupSubmit = () => import('./profile.js').then(m => m.handleSetupSubmit());

  // Navigation
  window.__showPage = (id) => showPage(id);
}
