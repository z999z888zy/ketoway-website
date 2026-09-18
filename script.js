const menu=document.querySelector('#menu-toggle');
const nav=document.querySelector('#main-nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');nav.classList.remove('is-open')}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('is-open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus()}});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
const form=document.querySelector('#inquiry-form');
if(form){
 const params=new URLSearchParams(location.search);
 const selected=params.get('product')?.slice(0,200);
 if(selected){
  const exact=[...form.elements.product.options].find(o=>o.value===selected);
  const category=['Mouth Tape','Nasal Strips','Wellness Patches','Functional Patches'].find(x=>selected.startsWith(x));
  if(exact)form.elements.product.value=exact.value;
  else if(category){form.elements.product.value=category;form.elements.message.value=`Interested in: ${selected}\n`}
 }
 if(params.get('request')==='Sample')form.elements.message.value+='I would like to request the US$20 sample package (up to 20 pieces, including worldwide shipping and import duties).\n';
 if(params.get('request')==='Documentation')form.elements.message.value+='I would like to confirm product documentation for my destination market.\n';
 form.addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(form);
  const message=['Hello Daisy, I would like to discuss a KETOWAY project.','',...['name','email','company','phone','product','quantity','country','postcode','message'].map(k=>`${k.charAt(0).toUpperCase()+k.slice(1)}: ${data.get(k)||'-'}`)].join('\n');
  const email=e.submitter?.value==='email';
  const url=email?`mailto:daisy@ketowayinc.com?subject=${encodeURIComponent('KETOWAY product inquiry')}&body=${encodeURIComponent(message)}`:`https://wa.me/8613803378851?text=${encodeURIComponent(message)}`;
  const fallback=document.querySelector('#message-fallback');fallback.href=url;fallback.hidden=false;
  if(email){fallback.removeAttribute('target');location.href=url}else{fallback.target='_blank';fallback.rel='noopener noreferrer';window.open(url,'_blank','noopener,noreferrer')}
  document.querySelector('#form-status').textContent=email?'Your email draft is ready. Send it in your email app to complete your inquiry. If it did not open, use the link below.':'Your message is ready for WhatsApp. Send it there to complete your inquiry. If it did not open, use the link below.';
 });
}
