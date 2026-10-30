// ---------- Mobile menu ----------
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

function setMenu(open) {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ---------- Scroll reveal ----------
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObs.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in')); // old browsers: show everything
}

// ---------- Active navigation link ----------
const links = [...menu.querySelectorAll('a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
function updateActive() {
  const y = window.scrollY + 120;
  let current = null;
  sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}

// ---------- Back-to-top button ----------
const topBtn = document.getElementById('top-btn');
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => {
  topBtn.hidden = window.scrollY < 600;
  updateActive();
}, { passive: true });
updateActive();

// ---------- Contact form validation ----------
const form = document.getElementById('form');
const formStatus = document.getElementById('status');
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function check(id, ok, msg) {
  const field = document.getElementById(id);
  document.getElementById('e-' + id).textContent = ok ? '' : msg;
  field.classList.toggle('invalid', !ok);
  field.setAttribute('aria-invalid', String(!ok));
  return ok;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  const results = [
    check('name', name.length >= 2, 'Enter your name.'),
    check('email', emailRe.test(email), 'Enter a valid email address, like name@example.com.'),
    check('subject', subject.length >= 3, 'Enter a subject of at least 3 characters.'),
    check('message', message.length >= 10, 'Write a message of at least 10 characters.')
  ];
  if (results.includes(false)) {
    form.querySelector('.invalid').focus();
    return;
  }

  // No server here: open the visitor's email app with the message filled in.
  const body = encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')');
  window.location.href = 'mailto:suryakanth2004sk@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + body;
  formStatus.textContent = 'Your email app should open with the message ready. If it does not, write to suryakanth2004sk@gmail.com.';
  form.reset();
});

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();
