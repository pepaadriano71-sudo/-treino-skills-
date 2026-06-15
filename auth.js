// ══════════════════════════════════════════════
// AUTH — Login, Signup, Password Recovery
// ══════════════════════════════════════════════

import {
  sb, currentUser, loadProfile, loadDBFromCloud,
  signIn, signUp, resetPassword, translateAuthError,
  show, hide
} from './supabase.js';

let authMode = 'login';

export function initAuth() {
  if (!sb) {
    hide('loadingScreen');
    showAuthMsg('⚠️ Configure SUPABASE_URL e SUPABASE_ANON_KEY no início do script para ativar contas e sincronização. Veja SETUP.md.', true);
    show('authScreen');
    return;
  }
  sb.auth.getSession().then(({ data }) => {
    if (data.session && data.session.user) {
      onAuthSuccess(data.session.user);
    } else {
      hide('loadingScreen');
      show('authScreen');
    }
  });
}

export function setAuthTab(mode) {
  authMode = mode;
  document.getElementById('tab-login').classList.toggle('active', mode === 'login');
  document.getElementById('tab-signup').classList.toggle('active', mode === 'signup');
  document.getElementById('authSubmitBtn').textContent = mode === 'login' ? 'Entrar' : 'Criar conta';
  document.getElementById('forgotBtn').style.display = mode === 'login' ? '' : 'none';
  document.getElementById('authMsg').textContent = '';
}

export function showAuthMsg(text, isErr) {
  const el = document.getElementById('authMsg');
  el.textContent = text;
  el.className = 'auth-msg ' + (isErr ? 'auth-msg--err' : 'auth-msg--ok');
}

export async function handleAuthSubmit() {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  if (!email || !password) { showAuthMsg('Preencha e-mail e senha.', true); return; }

  const btn = document.getElementById('authSubmitBtn');
  btn.disabled = true;
  showAuthMsg('', false);

  try {
    if (authMode === 'login') {
      const { data } = await signIn(email, password);
      await onAuthSuccess(data.user);
    } else {
      const { data } = await signUp(email, password);
      if (data.user && !data.session) {
        showAuthMsg('Conta criada! Verifique seu e-mail para confirmar antes de entrar.', false);
      } else if (data.user) {
        await onAuthSuccess(data.user);
      }
    }
  } catch (e) {
    showAuthMsg(translateAuthError(e.message), true);
  } finally {
    btn.disabled = false;
  }
}

export async function handleForgotPassword() {
  const email = document.getElementById('authEmail').value.trim();
  if (!email) { showAuthMsg('Digite seu e-mail para recuperar a senha.', true); return; }
  try {
    await resetPassword(email);
    showAuthMsg('Enviamos um link de recuperação para seu e-mail.', false);
  } catch (e) {
    showAuthMsg(translateAuthError(e.message), true);
  }
}

export function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🔓'; }
  else { input.type = 'password'; btn.textContent = '🔒'; }
}

async function onAuthSuccess(user) {
  currentUser = user;
  await loadProfile();
  await loadDBFromCloud();
  if (!currentProfile || !currentProfile.name) {
    hide('authScreen');
    import('./profile.js').then(m => m.showSetupScreen());
  } else {
    import('./app.js').then(m => m.enterApp());
  }
}
