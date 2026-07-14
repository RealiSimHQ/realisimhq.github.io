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
if (glow && matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    glow.style.setProperty('--mx', `${event.clientX - 180}px`);
    glow.style.setProperty('--my', `${event.clientY - 180}px`);
  }, { passive: true });
}

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
const packageSelect = form?.querySelector('select[name="package"]');
const gearField = form?.querySelector('textarea[name="gear"]');
const gearBuilder = document.getElementById('gearBuilder');
let gearType = 'Driving Sim';

document.querySelectorAll('.gear-type').forEach((button) => {
  button.addEventListener('click', () => {
    gearType = button.dataset.gearType || gearType;
    document.querySelectorAll('.gear-type').forEach((item) => item.classList.toggle('active', item === button));
  });
});

document.getElementById('useGearBuilder')?.addEventListener('click', () => {
  if (!gearBuilder || !gearField || !packageSelect || !note) return;
  const data = new FormData(gearBuilder);
  const lines = [...data.entries()].map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1')}: ${value}`);
  packageSelect.value = gearType === 'Flight Sim' ? 'Flight Simulator Support' : 'Not Sure Yet';
  gearField.value = [`I'm looking into this: ${gearType}`, '', 'What I have / need:', ...lines].join('\n');
  document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.pushState(null, '', '#book');
  note.textContent = `${gearType} details added. Add your contact info and send the estimate request.`;
});

const startServiceRequest = (card) => {
  if (!form || !packageSelect || !gearField) return;
  const packageName = card.dataset.package || card.querySelector('h3')?.textContent?.trim() || 'Not Sure Yet';
  const serviceInfo = card.dataset.serviceInfo || packageName;
  packageSelect.value = packageName;
  gearField.value = `I'm looking into this: ${serviceInfo}\n\nMy setup / hardware / issue:`;
  document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.pushState(null, '', '#book');
  note.textContent = `${packageName} selected. Add your contact info and send the estimate request.`;
  setTimeout(() => {
    const firstEmpty = form.querySelector('input:placeholder-shown, textarea');
    firstEmpty?.focus({ preventScroll: true });
  }, 450);
};

document.querySelectorAll('.package-card[data-package]').forEach((card) => {
  card.addEventListener('click', () => startServiceRequest(card));
  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    startServiceRequest(card);
  });
});

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
