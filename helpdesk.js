// A static mailto form needs a public support address.
const PREPWISE_SUPPORT_EMAIL = 'majjijaaswanth03@gmail.com';

const helpNav = document.querySelector('.tools-label + .main-nav');
if (helpNav && !document.querySelector('[data-page="help"]')) {
  const link = document.createElement('a');
  link.className = 'nav-link';
  link.href = '#help';
  link.dataset.page = 'help';
  link.innerHTML = '<span class="nav-icon">?</span>Help Desk';
  link.addEventListener('click', event => {
    event.preventDefault();
    navigate('help');
  });
  helpNav.append(link);
}

function renderHelpDesk() {
  const page = document.getElementById('pageContent');
  page.innerHTML = [
    '<div class="subject-toolbar helpdesk-heading"><div><div class="lesson-label">PREPWISE SUPPORT</div><h1 class="subject-title">Help Desk</h1><p class="subject-subtitle">Find a quick answer or send a question about your study space.</p></div></div>',
    '<div class="helpdesk-grid">',
    '<section class="helpdesk-panel helpdesk-faq" aria-labelledby="helpFaqTitle"><div class="helpdesk-panel-heading"><span class="helpdesk-icon">✳</span><div><span class="section-kicker">QUICK ANSWERS</span><h2 id="helpFaqTitle">Frequently asked questions</h2></div></div>',
    '<details><summary>How do I create an account?</summary><p>Choose the profile icon, select Create an account, and enter your name, email, and password. If a confirmation email arrives, open its link and then sign in.</p></details>',
    '<details><summary>Why didn’t I receive a confirmation email?</summary><p>Check your spam folder. Email delivery for student sign-ups is still being configured, so confirmation messages may not reach every address yet.</p></details>',
    '<details><summary>Where can I find my subject notes?</summary><p>Open My notes and choose DWDM, DAA, or Compiler Design. Pick a unit to see its notes and important questions.</p></details>',
    '<details><summary>Will my timetable and paper photos follow me to another device?</summary><p>Not yet. They are saved in this browser on this device and are not synced to your account.</p></details>',
    '<details><summary>Does the doubt solver use an AI model?</summary><p>It searches the study notes on this site for related material. It does not connect to an AI model or a live tutor.</p></details>',
    '<button class="button button-primary helpdesk-doubt-button" type="button" data-help-action="doubts">Ask a study doubt <span>→</span></button></section>',
    '<section class="helpdesk-panel helpdesk-query" aria-labelledby="helpQueryTitle"><div class="helpdesk-panel-heading"><span class="helpdesk-icon helpdesk-icon-purple">✉</span><div><span class="section-kicker">CONTACT SUPPORT</span><h2 id="helpQueryTitle">Send us a query</h2></div></div>',
    '<p class="helpdesk-intro">Tell us what you need help with. Your email app will open with the message addressed to Prepwise support.</p>',
    '<form id="helpQueryForm" class="helpdesk-form"><label>Your name<input name="name" autocomplete="name" maxlength="80" required placeholder="Name"></label>',
    '<label>Your email<input name="replyEmail" type="email" autocomplete="email" maxlength="254" required placeholder="you@example.com"></label>',
    '<label>What is this about?<select name="category" required><option value="">Choose a topic</option><option>Account or sign-in</option><option>Subject notes</option><option>Previous papers</option><option>Study timetable</option><option>Website issue</option><option>Other</option></select></label>',
    '<label>Your question<textarea name="message" rows="5" maxlength="3000" required placeholder="Describe what happened and what you need help with."></textarea></label>',
    '<button class="button button-primary form-submit" type="submit">Prepare support email <span>↗</span></button><p class="helpdesk-note" id="helpdeskStatus" role="status">Your message is not stored on this website. Review it in your email app and press Send there.</p></form></section></div>'
  ].join('');

  document.getElementById('helpQueryForm').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const category = String(data.get('category'));
    const subject = '[Prepwise Help Desk] ' + category;
    const body = [
      'Name: ' + String(data.get('name')).trim(),
      'Reply email: ' + String(data.get('replyEmail')).trim(),
      'Topic: ' + category,
      '',
      String(data.get('message')).trim()
    ].join('\n');
    const mailto = 'mailto:' + PREPWISE_SUPPORT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    document.getElementById('helpdeskStatus').textContent = 'Your email app should open with the message ready. Check the details, then press Send.';
    window.location.href = mailto;
  });
}

document.addEventListener('click', event => {
  if (event.target.closest('[data-help-action="doubts"]')) navigate('doubts');
});
const prepwiseNavigate = window.navigate;
window.navigate = function(page) {
  if (page !== 'help') return prepwiseNavigate(page);
  if (window.restoreDashboard) window.restoreDashboard();
  document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.page === 'help'));
  document.getElementById('crumbCurrent').textContent = 'Help Desk';
  document.getElementById('sidebar').classList.remove('open');
  renderHelpDesk();
};
const helpDeskStyle = document.createElement('style');
helpDeskStyle.textContent = '.helpdesk-heading{margin-bottom:18px}.helpdesk-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(280px,.9fr);gap:16px;align-items:start}.helpdesk-panel{background:#fff;border:1px solid var(--line);border-radius:12px;padding:21px}.helpdesk-panel-heading{display:flex;align-items:center;gap:11px;margin-bottom:13px}.helpdesk-icon{display:grid;place-items:center;width:38px;height:38px;flex:none;border-radius:11px;background:#f1f8f4;color:#63a786;font-size:18px}.helpdesk-icon-purple{background:#f1f0ff;color:#716bd3}.helpdesk-panel-heading h2{margin:4px 0 0;font:700 15px var(--display);letter-spacing:-.3px}.helpdesk-faq details{border-top:1px solid #f0f0f4;padding:12px 1px}.helpdesk-faq summary{color:#4c4d63;font:600 11px/1.5 var(--font);cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:12px}.helpdesk-faq summary::-webkit-details-marker{display:none}.helpdesk-faq summary:after{content:"＋";color:#7770d1;font-size:13px}.helpdesk-faq details[open] summary:after{content:"−"}.helpdesk-faq details p,.helpdesk-intro{font:10px/1.7 var(--font);color:#85869a;margin:8px 0 0}.helpdesk-doubt-button{margin-top:10px}.helpdesk-form{display:grid;gap:11px}.helpdesk-form label{display:grid;gap:6px;color:#56576d;font-size:10px;font-weight:700}.helpdesk-form input,.helpdesk-form select,.helpdesk-form textarea{width:100%;border:1px solid #e8e8ef;border-radius:7px;padding:10px;color:#292a3e;background:#fff;font:11px var(--font);outline:none}.helpdesk-form input,.helpdesk-form select{height:39px;padding-top:0;padding-bottom:0}.helpdesk-form textarea{resize:vertical;min-height:100px;line-height:1.5}.helpdesk-form input:focus,.helpdesk-form select:focus,.helpdesk-form textarea:focus{border-color:#8b84dc;box-shadow:0 0 0 3px #827add20}.helpdesk-note{font:9px/1.6 var(--font);color:#9293a7;margin:0}@media(max-width:850px){.helpdesk-grid{grid-template-columns:1fr}}';
document.head.appendChild(helpDeskStyle);
