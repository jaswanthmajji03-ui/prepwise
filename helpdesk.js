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
