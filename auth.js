// Supabase email/password authentication for the static Prepwise site.
let prepwiseClient = null;
let prepwiseUser = null;

function setAccountUI(user) {
  prepwiseUser = user || null;
  const email = user?.email || '';
  const fullName = user?.user_metadata?.full_name || email.split('@')[0] || 'Guest learner';
  const initial = (fullName.trim()[0] || 'G').toUpperCase();
  const nameNode = document.getElementById('profileName');
  const detailNode = document.getElementById('profileDetail');
  const profile = document.getElementById('profileButton');
  const avatar = document.getElementById('profileAvatar');
  const topAvatar = document.getElementById('topAccountButton');
  if (nameNode) nameNode.textContent = user ? fullName : 'Guest learner';
  if (detailNode) detailNode.textContent = user ? email : 'Sign in to Prepwise';
  if (profile) profile.setAttribute('aria-label', user ? `Signed in as ${email}` : 'Guest learner profile');
  if (avatar) avatar.textContent = initial;
  if (topAvatar) {
    topAvatar.textContent = initial;
    topAvatar.setAttribute('aria-label', user ? `Account: ${email}` : 'Sign in');
    topAvatar.title = user ? email : 'Sign in to Prepwise';
  }
}

function showAuthMessage(message, isError = false) {
  const status = document.getElementById('authStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('auth-error', isError);
  status.classList.toggle('auth-success', !isError);
}

function renderAuthForm(mode = 'signin') {
  if (typeof openModal !== 'function') return;
  const signup = mode === 'signup';
  openModal(signup ? 'Create your student account' : 'Sign in to Prepwise', 'Use your email and password to access your account.', 'Continue', '↗');
  const copy = document.getElementById('modalText');
  const actions = document.querySelector('.modal-actions');
  if (actions) actions.style.display = 'none';
  copy.innerHTML = `<form class="auth-form" id="authForm" data-mode="${signup ? 'signup' : 'signin'}">
    ${signup ? '<label>Student name<input name="name" type="text" autocomplete="name" maxlength="80" required placeholder="Your name"></label>' : ''}
    <label>Email address<input name="email" type="email" autocomplete="email" maxlength="254" required placeholder="you@example.com"></label>
    <label>Password<input name="password" type="password" autocomplete="${signup ? 'new-password' : 'current-password'}" minlength="8" maxlength="72" required placeholder="At least 8 characters"></label>
    <button class="button button-primary auth-submit" type="submit">${signup ? 'Create account' : 'Sign in'}</button>
    <p class="auth-status" id="authStatus" role="status" aria-live="polite"></p>
    <div class="auth-switch">${signup ? 'Already registered?' : 'New to Prepwise?'} <button class="text-button" type="button" data-auth-switch="${signup ? 'signin' : 'signup'}">${signup ? 'Sign in' : 'Create an account'}</button></div>
    ${!signup ? '<button class="text-button auth-forgot" type="button" data-auth-reset>Forgot password?</button>' : ''}
  </form>`;
  const close = document.getElementById('modalClose');
  if (close) close.onclick = () => { if (actions) actions.style.display = ''; closeModal(); };
  document.getElementById('modalCancel').textContent = 'Close';
  document.getElementById('modalCancel').onclick = () => { if (actions) actions.style.display = ''; closeModal(); };
}

function showAccountDialog() {
  if (!prepwiseUser) return renderAuthForm('signin');
  const email = prepwiseUser.email || '';
  openModal('Your Prepwise account', email, 'Sign out', 'G');
  document.getElementById('modalAction').onclick = async () => {
    const button = document.getElementById('modalAction');
    button.disabled = true;
    const { error } = await prepwiseClient.auth.signOut();
    if (error) { button.disabled = false; showToast(error.message); return; }
    setAccountUI(null);
    closeModal();
    showToast('You are signed out.');
  };
  document.getElementById('modalCancel').textContent = 'Close';
}

function renderPasswordRecovery() {
  openModal('Choose a new password', 'Set a password with at least 8 characters.', 'Save password', '↗');
  const copy = document.getElementById('modalText');
  document.querySelector('.modal-actions').style.display = 'none';
  copy.innerHTML = '<form class="auth-form" id="setPasswordForm"><label>New password<input name="password" type="password" autocomplete="new-password" minlength="8" maxlength="72" required placeholder="At least 8 characters"></label><label>Confirm new password<input name="confirmPassword" type="password" autocomplete="new-password" minlength="8" maxlength="72" required placeholder="Enter it again"></label><button class="button button-primary auth-submit" type="submit">Save new password</button><p class="auth-status" id="authStatus" role="status" aria-live="polite"></p></form>';
  document.getElementById('modalCancel').textContent = 'Close';
}

async function handlePasswordRecovery(form) {
  const data = new FormData(form);
  const password = String(data.get('password') || '');
  const confirmPassword = String(data.get('confirmPassword') || '');
  if (password !== confirmPassword) { showAuthMessage('The passwords do not match.', true); return; }
  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  button.textContent = 'Saving…';
  const { error } = await prepwiseClient.auth.updateUser({ password });
  if (error) {
    showAuthMessage(error.message, true);
    button.disabled = false;
    button.textContent = 'Save new password';
    return;
  }
  closeModal();
  showToast('Your password has been updated.');
}

async function handleAuthSubmit(form) {
  if (!prepwiseClient) { showAuthMessage('Could not connect to sign-in. Check your internet connection and reload.', true); return; }
  const button = form.querySelector('[type="submit"]');
  const data = new FormData(form);
  const email = String(data.get('email') || '').trim();
  const password = String(data.get('password') || '');
  const signup = form.dataset.mode === 'signup';
  button.disabled = true;
  button.textContent = signup ? 'Creating account…' : 'Signing in…';
  let result;
  try {
    result = signup
      ? await prepwiseClient.auth.signUp({ email, password, options: { data: { full_name: String(data.get('name') || '').trim() } } })
      : await prepwiseClient.auth.signInWithPassword({ email, password });
  } catch (error) {
    showAuthMessage(error.message || 'Connection failed. Please try again.', true);
    button.disabled = false;
    button.textContent = signup ? 'Create account' : 'Sign in';
    return;
  }
  if (result?.error) {
    showAuthMessage(result.error.message, true);
    button.disabled = false;
    button.textContent = signup ? 'Create account' : 'Sign in';
    return;
  }
  if (signup && result?.data?.user && !result.data.session) {
    showAuthMessage('Account created. Check your email for the confirmation link, then return here to sign in.');
    button.disabled = false;
    button.textContent = 'Create account';
    return;
  }
  if (result?.data?.user) {
    setAccountUI(result.data.user);
    closeModal();
    showToast(signup ? 'Your Prepwise account is ready.' : 'Welcome back to Prepwise.');
  }
}

document.addEventListener('click', async event => {
  if (event.target.closest('#profileButton,#topAccountButton')) { showAccountDialog(); return; }
  const switchButton = event.target.closest('[data-auth-switch]');
  if (switchButton) { renderAuthForm(switchButton.dataset.authSwitch); return; }
  if (event.target.closest('[data-auth-reset]')) {
    const email = document.querySelector('#authForm [name="email"]')?.value.trim();
    if (!email) { showAuthMessage('Enter your email above first, then choose Forgot password.', true); return; }
    if (!prepwiseClient) { showAuthMessage('Sign-in is not connected. Reload the page and try again.', true); return; }
    const { error } = await prepwiseClient.auth.resetPasswordForEmail(email);
    showAuthMessage(error ? error.message : 'If an account exists for that email, a password reset email will arrive shortly.', Boolean(error));
  }
});

document.addEventListener('submit', event => {
  if (event.target.id !== 'authForm') return;
  event.preventDefault();
  handleAuthSubmit(event.target);
});
document.addEventListener('submit', event => {
  if (event.target.id !== 'setPasswordForm') return;
  event.preventDefault();
  handlePasswordRecovery(event.target);
});

if (window.supabase?.createClient && window.PREPWISE_SUPABASE_CONFIG) {
  prepwiseClient = window.supabase.createClient(window.PREPWISE_SUPABASE_CONFIG.url, window.PREPWISE_SUPABASE_CONFIG.publishableKey);
  prepwiseClient.auth.getSession().then(({ data, error }) => {
    if (!error) setAccountUI(data.session?.user || null);
  });
  prepwiseClient.auth.onAuthStateChange((event, session) => {
    setAccountUI(session?.user || null);
    if (event === 'PASSWORD_RECOVERY') renderPasswordRecovery();
  });
} else {
  setAccountUI(null);
}
