const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  siteNav.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const quoteForm = document.querySelector('#quote-form');
const formNote = document.querySelector('#form-note');

quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  const message = [
    'Hello KETOWAY, I would like to request a quotation.',
    '',
    `Name: ${data.get('name') || '-'}`,
    `Business email: ${data.get('email') || '-'}`,
    `Company: ${data.get('company') || '-'}`,
    `WhatsApp / phone: ${data.get('contact') || '-'}`,
    `Product: ${data.get('product') || '-'}`,
    `Estimated quantity: ${data.get('quantity') || '-'}`,
    `Project details: ${data.get('message') || '-'}`
  ].join('\n');

  const whatsappUrl = `https://wa.me/8618888888888?text=${encodeURIComponent(message)}`;
  formNote.textContent = 'Opening WhatsApp with your inquiry details…';
  formNote.classList.add('success');
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

document.querySelector('#year').textContent = new Date().getFullYear();
