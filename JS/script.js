const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ===== Reveal on scroll =====
const revealEls = qsa('.reveal');
const revealIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealIO.unobserve(e.target);
    }
  }
}, { threshold: 0.12 });
revealEls.forEach(el => revealIO.observe(el));

// ===== Highlight current section in nav =====
const sections = qsa('main > section, header.hero');
const navLinks = qsa('.navigation a');
const linkById = new Map(navLinks.map(a => [a.getAttribute('href').replace('#','') || 'top', a]));

const sectionIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id || 'top';
    const link = linkById.get(id);
    if (!link) return;
    if (entry.intersectionRatio >= 0.5) {
      navLinks.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { threshold: [0.5], rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '64px'} 0px 0px 0px` });

sections.forEach(sec => sectionIO.observe(sec));

// Toast
const form = qs('#contact-form');
const modal = qs('#modal');
const btnOk = qs('#modal-ok');
const toast = qs('#toast');

function showToast(msg, ms = 4000) {
  toast.textContent = msg;
  toast.hidden = false;
  toast.classList.add('show');
  setTimeout(() => { 
    toast.classList.remove('show');
    toast.hidden = true;
  }, ms);
}

// Modal open/close
function openModal()  {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() { 
  modal.hidden = true;  
  document.body.style.overflow = '';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = qs('#name').value.trim();
  const email   = qs('#email').value.trim();
  const subject = qs('#subject').value.trim();
  const message = qs('#message').value.trim();

  if (!name || !email || !subject || !message) {
    showToast('Fill out the form you cunt!!');
    return;
  }

  // populate modal (overwrite each time)
  qs('#modalName').textContent    = name;
  qs('#modalEmail').textContent   = email;
  qs('#modalSubject').textContent = subject;
  qs('#modalMessage').textContent = message;

  openModal();
});

// Backdrop / Cancel
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]') || e.target.classList.contains('modal__backdrop')) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) 
    closeModal();
});

btnOk.addEventListener('click', () => {
  form.reset();
  closeModal();
  showToast('Submited. NOW FUCK OFF!!');
});