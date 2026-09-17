const menu = document.querySelector('#menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() { menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); nav.classList.remove('is-open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',open?'Close navigation':'Open navigation'); nav.classList.toggle('is-open',open); });
document.addEventListener('keydown', e => { if(e.key==='Escape') { closeMenu(); menu.focus(); } });
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
const form = document.querySelector('#inquiry-form');
if(form){
  const params = new URLSearchParams(location.search);
  const selected = params.get('product');
  if(selected){
    const match = [...form.elements.product.options].find(o=>o.value===selected);
    if(match) form.elements.product.value=selected;
    else if(selected.startsWith('Nasal Strips'))form.elements.product.value='Nasal Strips';
    else if(selected.startsWith('Mouth Tape'))form.elements.product.value='Mouth Tape';
    else if(selected.startsWith('Functional Patches'))form.elements.product.value='Functional Patches';
    if(!match)form.elements.message.value=`Interested in: ${selected.slice(0,200)}\n`;
  }
  if(params.get('request')==='Sample')form.elements.message.value+='I would like to request samples.\n';
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(form);
    const message = ['Hello Daisy, I would like to discuss a KETOWAY project.','',...['name','email','company','phone','product','quantity','country','postcode','message'].map(k=>`${k.charAt(0).toUpperCase()+k.slice(1)}: ${data.get(k)||'-'}`)].join('\n');
    const email = e.submitter?.value==='email';
    const url = email?`mailto:daisy@ketowayinc.com?subject=${encodeURIComponent('KETOWAY product inquiry')}&body=${encodeURIComponent(message)}`:`https://wa.me/8613803378851?text=${encodeURIComponent(message)}`;
    const fallback=document.querySelector('#message-fallback');fallback.href=url;fallback.hidden=false;
    if(!email){fallback.target='_blank';fallback.rel='noopener noreferrer';window.open(url,'_blank','noopener,noreferrer');}else{fallback.removeAttribute('target');location.href=url;}
    document.querySelector('#form-status').textContent=email?'Your email draft is ready. Send it in your email app. If it did not open, use the link below.':'Your message is ready for WhatsApp. Send it there to complete your inquiry. If it did not open, use the link below.';
  });
}

