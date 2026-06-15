// ══════════════════════════════════════════════
// SUPABASE — Client, Auth & Data Layer
// ══════════════════════════════════════════════

const SUPABASE_URL = 'https://dulgunzbtekqhnjxdins.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0DmW4pNpKGRTZnW8davfbQ_A2H0dHvi';

export const sb = (SUPABASE_URL.startsWith('http'))
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export let currentUser = null;
export let currentProfile = null;

// ── Cache ──
let __dbCache = null;
let __syncTimeout = null;

export function getDB() {
  if (__dbCache) return __dbCache;
  try { __dbCache = JSON.parse(localStorage.getItem('treino_db') || '{}'); }
  catch { __dbCache = {}; }
  return __dbCache;
}

export function setDB(d) {
  __dbCache = d;
  localStorage.setItem('treino_db', JSON.stringify(d));
  scheduleCloudSync();
}

function scheduleCloudSync() {
  clearTimeout(__syncTimeout);
  __syncTimeout = setTimeout(syncDBToCloud, 800);
}

export async function syncDBToCloud() {
  if (!currentUser) return;
  const badge = document.getElementById('syncBadge');
  try {
    const { error } = await sb.from('user_data').upsert({
      user_id: currentUser.id,
      data: __dbCache,
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
    if (badge) { badge.textContent = '☁️ Dados sincronizados na nuvem'; badge.className = 'sync-badge'; }
  } catch (e) {
    if (badge) { badge.textContent = '⚠️ Falha ao sincronizar — salvo localmente'; badge.className = 'sync-badge sync-badge--err'; }
    console.error('sync error', e);
  }
}

export async function loadDBFromCloud() {
  if (!currentUser) return;
  __dbCache = null;
  try {
    let { data, error } = await sb.from('user_data').select('data').eq('user_id', currentUser.id).maybeSingle();
    if (error) throw error;
    if (!data) {
      await sb.from('user_data').upsert({ user_id: currentUser.id, data: {}, updated_at: new Date().toISOString() });
      data = { data: {} };
    }
    __dbCache = (data && data.data) ? data.data : {};
    localStorage.setItem('treino_db', JSON.stringify(__dbCache));
  } catch (e) {
    console.error('load db error', e);
    __dbCache = {};
  }
}

// ── Record helpers ──
export function getRecords() {
  const d = getDB();
  return d.records || {};
}

export function saveRecordDB(exId, val) {
  const d = getDB();
  if (!d.records) d.records = {};
  if (!d.recordHistory) d.recordHistory = {};
  if (!d.recordHistory[exId]) d.recordHistory[exId] = [];
  d.recordHistory[exId].push({ date: getTodayStr(), value: val });
  const cur = d.records[exId] || 0;
  if (val > cur) { d.records[exId] = val; setDB(d); return true; }
  setDB(d);
  return false;
}

export function getProgressionDB() {
  const d = getDB();
  return d.progression || {};
}

export function saveProgressionDB(skillKey, levelIdx) {
  const d = getDB();
  if (!d.progression) d.progression = {};
  if (!d.progression[skillKey]) d.progression[skillKey] = {};
  d.progression[skillKey][levelIdx] = true;
  setDB(d);
}

// ── Day helpers ──
export function getKey(date) { return 'day_' + date; }
export function getTodayStr() {
  const n = new Date();
  return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');
}

export function getTrainingStartDate() {
  const d = getDB();
  return d.training_started_date || null;
}

export function startTraining() {
  const today = getTodayStr();
  const d = getDB();
  if (!d.training_started_date) {
    d.training_started_date = today;
    setDB(d);
  }
}

// ── Date utilities ──
export function getDayOfWeek(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.getDay();
}

export function getWeekStart(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const ms = d.getTime() + diff * 86400000;
  const ws = new Date(ms);
  return ws.getFullYear() + '-' + String(ws.getMonth() + 1).padStart(2, '0') + '-' + String(ws.getDate()).padStart(2, '0');
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function isPast(dateStr) { return dateStr < getTodayStr(); }

export function dateToDayIdx(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const dow = d.getDay();
  if (dow === 0 || dow === 6) return -1;
  return dow - 1;
}

// ── Profile helpers ──
export async function loadProfile() {
  if (!currentUser) return;
  try {
    const { data, error } = await sb.from('profiles').select('*').eq('id', currentUser.id).single();
    if (error) throw error;
    currentProfile = data;
    if (currentProfile && currentProfile.main_goal && !Array.isArray(currentProfile.main_goal)) {
      currentProfile.main_goal = [currentProfile.main_goal];
    }
  } catch (e) {
    console.error('load profile error', e);
    currentProfile = null;
  }
}

export async function saveProfile(profile) {
  if (!sb || !currentUser) return;
  const { error } = await sb.from('profiles').upsert(profile);
  if (error) throw error;
  currentProfile = profile;
}

export async function updateProfile(updates) {
  if (!sb || !currentUser) return;
  const { data, error } = await sb.from('profiles').update(updates).eq('id', currentUser.id).select().single();
  if (error) throw error;
  currentProfile = { ...currentProfile, ...data };
}

// ── Auth helpers ──
export async function signIn(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email, password) {
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await sb.auth.signOut();
  currentUser = null;
  currentProfile = null;
  __dbCache = null;
  localStorage.removeItem('treino_db');
}

export async function resetPassword(email) {
  const { error } = await sb.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function deleteUserAccount(password) {
  // Re-authenticate
  const { error: authErr } = await sb.auth.signInWithPassword({
    email: currentUser.email,
    password
  });
  if (authErr) throw new Error('Senha incorreta. Verifique e tente novamente.');

  await sb.from('user_data').delete().eq('user_id', currentUser.id);
  await sb.from('profiles').delete().eq('id', currentUser.id);
  await sb.rpc('delete_user');
  await signOut();
}

export async function clearUserProgress() {
  __dbCache = {};
  localStorage.setItem('treino_db', '{}');
  clearTimeout(__syncTimeout);
  if (currentUser) {
    const { error } = await sb.from('user_data').upsert({
      user_id: currentUser.id,
      data: {},
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
  }
}

// ── UI helpers ──
export function show(id) { document.getElementById(id).style.display = ''; }
export function hide(id) { document.getElementById(id).style.display = 'none'; }

export function translateAuthError(msg) {
  if (/invalid login credentials/i.test(msg)) return 'E-mail ou senha incorretos.';
  if (/already registered|already exists/i.test(msg)) return 'Este e-mail já está cadastrado.';
  if (/password.*at least/i.test(msg)) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (/Email not confirmed/i.test(msg)) return 'Confirme seu e-mail antes de entrar.';
  return msg;
}
