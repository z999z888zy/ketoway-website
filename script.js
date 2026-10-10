// Web3Forms access keys are intended for client-side forms.
const FORM_ENDPOINT = "https://api.web3forms.com/submit";
const FORM_ACCESS_KEY = "fd279dc5-30c6-4160-af59-0d159d307a33";

const menu = document.querySelector('#menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('is-open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('is-open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });

const form = document.querySelector('[data-kt-form]');
if (form) {
  const params = new URLSearchParams(location.search);
  const selected = params.get('product')?.slice(0, 200);
  if (selected) {
    const exact = [...form.elements.product.options].find(option => option.value === selected);
    const category = ['Mouth Tape', 'Nasal Strips', 'Wellness Patches', 'Functional Patches'].find(value => selected.startsWith(value));
    if (exact) form.elements.product.value = exact.value;
    else if (category) {
      form.elements.product.value = category;
      form.elements.message.value = `Interested in: ${selected}\n`;
    }
  }
  if (params.get('request') === 'Sample') form.elements.message.value += 'I would like to request the US$20 sample package (up to 20 pieces, including worldwide shipping and import duties).\n';
  if (params.get('request') === 'Documentation') form.elements.message.value += 'I would like to confirm product documentation for my destination market.\n';

  const status = document.querySelector('#form-status');
  const fallback = document.querySelector('#message-fallback');
  const emailFallback = document.querySelector('#email-fallback');
  const web3Forms = FORM_ENDPOINT.includes('api.web3forms.com/submit');
  const endpointHasFormId = /\/submit\/[^/]+\/?$/.test(FORM_ENDPOINT);
  const connected = Boolean(FORM_ENDPOINT) && (!web3Forms || Boolean(FORM_ACCESS_KEY) || endpointHasFormId);
  if (connected) {
    const actions = form.querySelectorAll('button[type="submit"]');
    if (actions[0]) actions[0].textContent = 'Send inquiry ↗';
    if (actions[1]) actions[1].hidden = true;
    form.querySelector('.fine').textContent = 'Your project details are sent securely to our team. We use them only to respond to your inquiry.';
  }

  function preparedMessage(data) {
    return ['Hello Daisy, I would like to discuss a KETOWAY project.', '',
      ...['name', 'email', 'company', 'phone', 'product', 'quantity', 'country', 'postcode', 'message']
        .map(key => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${data.get(key) || '-'}`)].join('\n');
  }
  function showFallback(data, email, openNow) {
    const message = preparedMessage(data);
    const url = email
      ? `mailto:daisy@ketowayinc.com?subject=${encodeURIComponent('KETOWAY product inquiry')}&body=${encodeURIComponent(message)}`
      : `https://wa.me/8613803378851?text=${encodeURIComponent(message)}`;
    fallback.href = url;
    fallback.hidden = false;
    fallback.textContent = email ? 'Open your prepared email ↗' : 'Continue on WhatsApp ↗';
    if (email) fallback.removeAttribute('target');
    else { fallback.target = '_blank'; fallback.rel = 'noopener noreferrer'; }
    if (openNow) {
      if (email) location.href = url;
      else window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
  function showEmailFallback(data) {
    emailFallback.href = `mailto:daisy@ketowayinc.com?subject=${encodeURIComponent('KETOWAY product inquiry')}&body=${encodeURIComponent(preparedMessage(data))}`;
    emailFallback.hidden = false;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (String(data.get('website') || '').trim() || form.elements.botcheck.checked) return; // Honeypots: never send spam.
    fallback.hidden = true;
    emailFallback.hidden = true;
    if (!connected) {
      const email = event.submitter?.value === 'email';
      showFallback(data, email, true);
      status.textContent = email
        ? 'Your email draft is ready. Send it in your email app to complete your inquiry. If it did not open, use the link below.'
        : 'Your message is ready for WhatsApp. Send it there to complete your inquiry. If it did not open, use the link below.';
      return;
    }
    const button = event.submitter || form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Sending your inquiry…';
    const reference = `KT-${Date.now().toString(36).toUpperCase().slice(-8)}`;
    const fields = Object.fromEntries(data.entries());
    delete fields.website;
    const attribution = window.KT?.flat?.() || {};
    const payload = { ...fields, ...attribution, reference, subject: `KETOWAY inquiry ${reference}`, botcheck: false };
    if (FORM_ACCESS_KEY) payload.access_key = FORM_ACCESS_KEY;
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) throw new Error('Form service did not confirm receipt');
      status.textContent = `✅ Received — we reply within 1 business day. Reference: ${reference}`;
      form.reset();
    } catch {
      status.textContent = 'We could not confirm delivery. Please send your prepared message via WhatsApp or email instead.';
      showFallback(data, false, false);
      showEmailFallback(data);
    } finally {
      button.disabled = false;
    }
  });
}
