// ══════════════════════════════════════════════
// PROFILE — Setup, Edit, Display, Danger Zone
// ══════════════════════════════════════════════

import {
  currentUser, currentProfile, saveProfile, updateProfile,
  clearUserProgress, deleteUserAccount, show, hide
} from './supabase.js';
import { GOAL_LABELS, LEVEL_LABELS, EQUIP_LABELS, DAY_LABELS } from '../data/skills.js';

// ── Setup Screen ──
export function showSetupScreen() {
  hide('loadingScreen'); hide('authScreen');
  show('setupScreen');
  if (currentProfile) {
    document.getElementById('setupName').value = currentProfile.name || '';
    document.getElementById('setupAge').value = currentProfile.age || '';
    document.getElementById('setupWeight').value = currentProfile.weight || '';
    document.getElementById('setupHeight').value = currentProfile.height || '';
    document.getElementById('setupLevel').value = currentProfile.level || 'iniciante';
    document.getElementById('setupTime').value = currentProfile.time_per_session || '';

    (currentProfile.main_goal || []).forEach(v => {
      const el = document.querySelector(`#setupGoal [data-val="${v}"]`);
      if (el) el.classList.add('sel');
    });
    (currentProfile.equipment || []).forEach(v => {
      const el = document.querySelector(`#setupEquip [data-val="${v}"]`);
      if (el) el.classList.add('sel');
    });
    (currentProfile.available_days || []).forEach(v => {
      const el = document.querySelector(`#setupDays [data-val="${v}"]`);
      if (el) el.classList.add('sel');
    });
  }
}

export function toggleChip(el) { el.classList.toggle('sel'); }

export function showSetupMsg(text, isErr) {
  const el = document.getElementById('setupMsg');
  el.textContent = text;
  el.className = 'auth-msg ' + (isErr ? 'auth-msg--err' : 'auth-msg--ok');
}

export async function handleSetupSubmit() {
  const name = document.getElementById('setupName').value.trim();
  if (!name) { showSetupMsg('Digite seu nome.', true); return; }

  const equipment = [...document.querySelectorAll('#setupEquip .chip-toggle.sel')].map(e => e.dataset.val);
  const days = [...document.querySelectorAll('#setupDays .chip-toggle.sel')].map(e => parseInt(e.dataset.val));
  const goals = [...document.querySelectorAll('#setupGoal .chip-toggle.sel')].map(e => e.dataset.val);

  const profile = {
    id: currentUser.id,
    name,
    age: parseInt(document.getElementById('setupAge').value) || null,
    weight: parseFloat(document.getElementById('setupWeight').value) || null,
    height: parseFloat(document.getElementById('setupHeight').value) || null,
    level: document.getElementById('setupLevel').value,
    main_goal: goals,
    equipment,
    available_days: days,
    time_per_session: parseInt(document.getElementById('setupTime').value) || null,
    updated_at: new Date().toISOString()
  };

  const btn = document.getElementById('setupSubmitBtn');
  btn.disabled = true;
  try {
    await saveProfile(profile);
    hide('setupScreen');
    import('./app.js').then(m => m.enterApp());
  } catch (e) {
    showSetupMsg('Erro ao salvar perfil: ' + e.message, true);
  } finally {
    btn.disabled = false;
  }
}

// ── Profile Display ──
export function renderPerfil() {
  if (!currentProfile) return;
  document.getElementById('pf-name').textContent = currentProfile.name || '--';
  document.getElementById('pf-email').textContent = currentUser ? currentUser.email : '--';
  document.getElementById('pf-age').textContent = currentProfile.age ? currentProfile.age + ' anos' : '--';
  document.getElementById('pf-weight').textContent = currentProfile.weight ? currentProfile.weight + ' kg' : '--';
  document.getElementById('pf-height').textContent = currentProfile.height ? currentProfile.height + ' cm' : '--';
  document.getElementById('pf-level').textContent = LEVEL_LABELS[currentProfile.level] || '--';
  const goalsArr = currentProfile.main_goal || [];
  document.getElementById('pf-goal').textContent = goalsArr.map(g => GOAL_LABELS[g] || g).join(', ') || '--';
  document.getElementById('pf-equip').textContent = (currentProfile.equipment || []).map(e => EQUIP_LABELS[e] || e).join(', ') || '--';
  document.getElementById('pf-days').textContent = (currentProfile.available_days || []).slice().sort().map(d => DAY_LABELS[d]).join(', ') || '--';
  document.getElementById('pf-time').textContent = currentProfile.time_per_session ? currentProfile.time_per_session + ' min' : '--';
}

// ── Edit Profile Modal ──
export function openEditProfile() {
  if (!currentProfile) return;
  document.getElementById('editName').value = currentProfile.name || '';
  document.getElementById('editAge').value = currentProfile.age || '';
  document.getElementById('editWeight').value = currentProfile.weight || '';
  document.getElementById('editHeight').value = currentProfile.height || '';
  document.getElementById('editLevel').value = currentProfile.level || 'iniciante';
  document.getElementById('editTime').value = currentProfile.time_per_session || '';
  document.getElementById('editProfileMsg').textContent = '';
  document.getElementById('editProfileMsg').className = 'auth-msg';

  document.querySelectorAll('#editGoal .chip-toggle, #editEquip .chip-toggle, #editDays .chip-toggle')
    .forEach(el => el.classList.remove('sel'));

  (currentProfile.main_goal || []).forEach(v => {
    const el = document.querySelector(`#editGoal [data-val="${v}"]`);
    if (el) el.classList.add('sel');
  });
  (currentProfile.equipment || []).forEach(v => {
    const el = document.querySelector(`#editEquip [data-val="${v}"]`);
    if (el) el.classList.add('sel');
  });
  (currentProfile.available_days || []).forEach(v => {
    const el = document.querySelector(`#editDays [data-val="${String(v)}"]`);
    if (el) el.classList.add('sel');
  });

  document.getElementById('editProfileBg').style.display = 'block';
}

export function closeEditProfile() {
  document.getElementById('editProfileBg').style.display = 'none';
}

export function closeEditProfileBg(e) {
  if (e.target === document.getElementById('editProfileBg')) closeEditProfile();
}

export async function handleEditProfileSubmit() {
  const name = document.getElementById('editName').value.trim();
  if (!name) {
    const msg = document.getElementById('editProfileMsg');
    msg.textContent = 'Digite seu nome.'; msg.className = 'auth-msg auth-msg--err'; return;
  }
  const goals = [...document.querySelectorAll('#editGoal .chip-toggle.sel')].map(e => e.dataset.val);
  const equipment = [...document.querySelectorAll('#editEquip .chip-toggle.sel')].map(e => e.dataset.val);
  const days = [...document.querySelectorAll('#editDays .chip-toggle.sel')].map(e => parseInt(e.dataset.val));

  const updates = {
    name,
    age: parseInt(document.getElementById('editAge').value) || null,
    weight: parseFloat(document.getElementById('editWeight').value) || null,
    height: parseFloat(document.getElementById('editHeight').value) || null,
    level: document.getElementById('editLevel').value,
    main_goal: goals,
    equipment,
    available_days: days,
    time_per_session: parseInt(document.getElementById('editTime').value) || null,
    updated_at: new Date().toISOString()
  };

  const btn = document.getElementById('editProfileSubmitBtn');
  btn.disabled = true; btn.textContent = 'Salvando...';
  try {
    await updateProfile(updates);
    closeEditProfile();
    renderPerfil();
    import('./workout.js').then(m => m.renderTreino());
  } catch (e) {
    const msg = document.getElementById('editProfileMsg');
    msg.textContent = 'Erro ao salvar: ' + e.message; msg.className = 'auth-msg auth-msg--err';
  } finally {
    btn.disabled = false; btn.textContent = 'Salvar alterações';
  }
}

// ── Danger Zone ──
export function openClearProgress() {
  document.getElementById('clearProgressConfirm').value = '';
  document.getElementById('clearProgressMsg').textContent = '';
  document.getElementById('clearProgressMsg').className = 'auth-msg';
  document.getElementById('clearProgressBg').style.display = 'block';
}

export function closeClearProgress() {
  document.getElementById('clearProgressBg').style.display = 'none';
}

export function closeClearProgressBg(e) {
  if (e.target === document.getElementById('clearProgressBg')) closeClearProgress();
}

export async function handleClearProgress() {
  const confirm = document.getElementById('clearProgressConfirm').value.trim().toUpperCase();
  const msg = document.getElementById('clearProgressMsg');
  const btn = document.getElementById('clearProgressBtn');
  if (confirm !== 'LIMPAR') {
    msg.textContent = 'Digite LIMPAR (em letras maiúsculas) para confirmar.';
    msg.className = 'auth-msg auth-msg--err'; return;
  }
  btn.disabled = true; btn.textContent = 'Limpando...';
  msg.textContent = ''; msg.className = 'auth-msg';
  try {
    await clearUserProgress();
    window._selectedTreinoDate = undefined;
    closeClearProgress();
    import('./workout.js').then(m => m.renderTreino());
    import('./timer.js').then(m => m.renderQuickRecords());
    import('./progression.js').then(m => m.renderProgressao());
    const badge = document.getElementById('syncBadge');
    if (badge) { badge.textContent = '☁️ Dados sincronizados na nuvem'; badge.className = 'sync-badge'; }
  } catch (e) {
    msg.textContent = 'Erro ao limpar progresso: ' + (e.message || e); msg.className = 'auth-msg auth-msg--err';
  } finally {
    btn.disabled = false; btn.textContent = 'Limpar todo o progresso';
  }
}

export function openDeleteAccount() {
  document.getElementById('deleteAccountPassword').value = '';
  document.getElementById('deleteAccountMsg').textContent = '';
  document.getElementById('deleteAccountMsg').className = 'auth-msg';
  document.getElementById('deleteAccountBg').style.display = 'block';
}

export function closeDeleteAccount() {
  document.getElementById('deleteAccountBg').style.display = 'none';
}

export function closeDeleteAccountBg(e) {
  if (e.target === document.getElementById('deleteAccountBg')) closeDeleteAccount();
}

export async function handleDeleteAccount() {
  const password = document.getElementById('deleteAccountPassword').value;
  const msg = document.getElementById('deleteAccountMsg');
  const btn = document.getElementById('deleteAccountBtn');
  if (!password) {
    msg.textContent = 'Digite sua senha para confirmar.'; msg.className = 'auth-msg auth-msg--err'; return;
  }
  btn.disabled = true; btn.textContent = 'Verificando...';
  msg.textContent = ''; msg.className = 'auth-msg';
  try {
    await deleteUserAccount(password);
    hide('appShell');
    document.getElementById('authEmail').value = '';
    document.getElementById('authPassword').value = '';
    import('./auth.js').then(m => m.setAuthTab('login'));
    const authMsg = document.getElementById('authMsg');
    authMsg.textContent = 'Conta excluída com sucesso.';
    authMsg.className = 'auth-msg auth-msg--ok';
    show('authScreen');
  } catch (e) {
    msg.textContent = e.message || 'Erro ao excluir conta.'; msg.className = 'auth-msg auth-msg--err';
    btn.disabled = false; btn.textContent = 'Excluir minha conta permanentemente';
  }
}

// ── Logout ──
export async function handleLogout() {
  const { signOut } = await import('./supabase.js');
  await signOut();
  hide('appShell');
  document.getElementById('authEmail').value = '';
  document.getElementById('authPassword').value = '';
  import('./auth.js').then(m => m.setAuthTab('login'));
  show('authScreen');
}
