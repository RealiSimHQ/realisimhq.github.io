const reveals = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  }
}, { threshold: 0.13 });
reveals.forEach((el) => io.observe(el));

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  if (!glow) return;
  glow.style.setProperty('--mx', `${event.clientX - 180}px`);
  glow.style.setProperty('--my', `${event.clientY - 180}px`);
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', link.getAttribute('href'));
  });
});

const form = document.getElementById('bookingForm');
const note = document.getElementById('formNote');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent('RealiSimHQ estimate request');
  const body = encodeURIComponent([
    'RealiSimHQ estimate request',
    '',
    `Name: ${data.get('name') || ''}`,
    `Contact: ${data.get('contact') || ''}`,
    `Location: ${data.get('location') || ''}`,
    `Package: ${data.get('package') || ''}`,
    '',
    'Hardware / software / goals:',
    `${data.get('gear') || ''}`,
  ].join('\n'));

  const recipient = window.REALISIMHQ_BOOKING_EMAIL || 'booking@realisimhq.com';
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  note.textContent = 'Opening your email client with the estimate request. If it does not open, text Ryan at 330-601-6536.';
});
