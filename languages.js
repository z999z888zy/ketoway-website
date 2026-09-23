/* Local, authored translations. No third-party translation requests or tracking. */
(()=>{'use strict';
 const all=window.KETOWAY_TRANSLATIONS;if(!all)return;
 const choices=[['en','English','EN','en'],['de','Deutsch','DE','de'],['fr','Français','FR','fr'],['es','Español','ES','es'],['zh-CN','简体中文','中文','cn']];
 const labels={en:['Language','Website language','Choose a language. Flags are visual references, not a shipping-country selection.','Language preference is stored on this device. Image and packaging text stays in its original language. Translations are for reference; confirm order details with Daisy.'],de:['Sprache','Webseitensprache','Sprache wählen. Flaggen dienen zur Orientierung, nicht zur Wahl des Lieferlandes.','Die Sprache wird auf diesem Gerät gespeichert. Bild- und Verpackungstexte bleiben im Original. Übersetzungen dienen zur Orientierung; Auftragsdetails mit Daisy bestätigen.'],fr:['Langue','Langue du site','Choisissez une langue. Les drapeaux sont des repères, pas une sélection du pays de livraison.','La langue est mémorisée sur cet appareil. Les textes des images et emballages restent dans leur langue originale. Traductions indicatives ; confirmez les détails avec Daisy.'],es:['Idioma','Idioma del sitio','Elija un idioma. Las banderas son referencias, no una selección del país de envío.','El idioma se guarda en este dispositivo. Los textos de imágenes y embalajes no cambian. Traducciones orientativas; confirme los detalles del pedido con Daisy.'],'zh-CN':['语言','网站语言','选择阅读语言。国旗仅作识别，不代表收货国家或价格地区。','语言偏好保存在本设备。图片和包装内的文字保持原文。译文仅供参考，订单细节请与 Daisy 确认。']};
 const picker=document.createElement('details');picker.className='language-picker';picker.dataset.noTranslate='';
 const summary=document.createElement('summary');summary.id='language-toggle';summary.setAttribute('aria-controls','language-options');summary.setAttribute('aria-expanded','false');picker.append(summary);
 const panel=document.createElement('div');panel.className='language-panel';panel.id='language-options';const title=document.createElement('strong');panel.append(title);
 const uk='<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice"><path fill="#012169" d="M0 0h60v30H0z"/><path stroke="#fff" stroke-width="6" d="m0 0 60 30M60 0 0 30"/><path stroke="#c8102e" stroke-width="2" d="m0 0 60 30M60 0 0 30"/><path stroke="#fff" stroke-width="10" d="M30 0v30M0 15h60"/><path stroke="#c8102e" stroke-width="6" d="M30 0v30M0 15h60"/></svg>';
 const cn='<svg viewBox="0 0 30 20"><path fill="#de2910" d="M0 0h30v20H0z"/><g fill="#ffde00"><path d="m5 2 0.9 2.8H9L6.5 6.6l.9 2.8L5 7.7 2.6 9.4l.9-2.8L1 4.8h3.1z"/><path d="m10 1 .3 1h1l-.8.6.3 1L10 3l-.8.6.3-1-.8-.6h1z"/><path d="m12 3 .3 1h1l-.8.6.3 1-.8-.6-.8.6.3-1-.8-.6h1z"/><path d="m12 6 .3 1h1l-.8.6.3 1-.8-.6-.8.6.3-1-.8-.6h1z"/><path d="m10 8 .3 1h1l-.8.6.3 1-.8-.6-.8.6.3-1-.8-.6h1z"/></g></svg>';
 const flag=(code)=>`<span class="language-flag flag-${code}" aria-hidden="true">${code==='en'?uk:code==='cn'?cn:''}</span>`;
 const buttons=choices.map(([code,name,short,country])=>{const b=document.createElement('button');b.type='button';b.dataset.language=code;b.lang=code;b.innerHTML=flag(country)+'<span>'+name+'</span><span class="language-check" aria-hidden="true">✓</span>';b.addEventListener('click',()=>{setLanguage(code,true);picker.open=false;summary.focus()});panel.append(b);return b});
 const note=document.createElement('p');panel.append(note);picker.append(panel);const header=document.querySelector('.header-inner');header.insertBefore(picker,header.querySelector('.header-quote'));
 let lang='en';try{lang=localStorage.getItem('ketoway-language')||'en'}catch{}const fromURL=new URL(location.href).searchParams.get('lang');if(choices.some(c=>c[0]===fromURL))lang=fromURL;if(!choices.some(c=>c[0]===lang))lang='en';
 const textState=new WeakMap(),attrState=new WeakMap(),englishTitle=document.title;
 const excluded=el=>!el||el.closest('script,style,noscript,textarea,[data-no-translate]');
 function translate(s){if(lang==='en')return s;const d=all[lang];if(d[s])return d[s];
  // Runtime style/finish captions and accessible button names preserve reference IDs.
  if(/\((?:M|N|B|C|P)\d{2}\)| — [MNB]\d{2}$/.test(s)){
   const terms=Object.keys(d).filter(k=>/^(Selected:|Style \d|Square$|Circle$|Star$|Concave square$|X shape$|Oval|Lip shape$|Wave with opening$|Rectangle|Contour with opening$|Black$|White$|Red$|Orange$|Green$|Royal blue$|Yellow$|Skin tone$|Sky blue$|Navy$|Pink$|Lavender$|Mint$|Purple$|Cream$|Coral$|Botanical$|Floral$|Leaves$|Garden$|Birds$|Space$|Geometry$|Lace$|Playful$)/.test(k)).sort((a,b)=>b.length-a.length);
   return s.replace(new RegExp(terms.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g'),k=>d[k]);
  }return s;
 }
 const observer=new MutationObserver(()=>{if(!pending){pending=true;queueMicrotask(()=>{pending=false;render()})}});let pending=false;
 function render(){observer.disconnect();
  // Preserve option values so inquiries always use the original category identifiers.
  document.querySelectorAll('option').forEach(o=>{if(!o.hasAttribute('value'))o.value=o.textContent});
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){
   if(excluded(node.parentElement)||!node.textContent.trim())continue;let st=textState.get(node);if(!st||node.textContent!==st.last)st={original:node.textContent};
   const trimmed=st.original.trim();const next=st.original.replace(trimmed,translate(trimmed));if(node.textContent!==next)node.textContent=next;st.last=next;textState.set(node,st);
  }
  document.querySelectorAll('[aria-label],[placeholder],[alt],[title]').forEach(el=>{if(excluded(el))return;const states=attrState.get(el)||{};for(const a of ['aria-label','placeholder','alt','title']){if(!el.hasAttribute(a))continue;const value=el.getAttribute(a);let st=states[a];if(!st||value!==st.last)st={original:value};const next=translate(st.original);if(value!==next)el.setAttribute(a,next);st.last=next;states[a]=st;}attrState.set(el,states)});
  document.title=lang==='en'?englishTitle:(document.querySelector('h1')?.innerText.replace(/\s+/g,' ').trim()||englishTitle)+' | KETOWAY';
  observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','alt','title']});
 }
 function setLanguage(code,save){lang=code;document.documentElement.lang=lang;document.documentElement.dataset.language=lang;const c=choices.find(c=>c[0]===lang),l=labels[lang];summary.innerHTML=flag(c[3])+`<span>${c[2]}</span><span aria-hidden="true">⌄</span>`;summary.setAttribute('aria-label',l[0]+': '+c[1]);title.textContent=l[1];note.textContent=l[2];buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===lang)));const footer=document.querySelector('[data-language-note]');footer.dataset.noTranslate='';footer.textContent=l[3];
  if(save){try{localStorage.setItem('ketoway-language',lang)}catch{}const u=new URL(location.href);u.searchParams.set('lang',lang);history.replaceState(null,'',u)}render();document.dispatchEvent(new CustomEvent('ketoway:language',{detail:lang}));
 }
 picker.addEventListener('toggle',()=>summary.setAttribute('aria-expanded',String(picker.open)));
 document.addEventListener('click',e=>{if(!picker.contains(e.target))picker.open=false});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&picker.open){picker.open=false;summary.focus()}});
 // Carry the language through navigation while preserving product, finish and sample parameters.
 document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||a.getAttribute('href').startsWith('#'))return;const u=new URL(a.href,location.href);if(u.origin===location.origin&&(/\.html$/.test(u.pathname)||u.pathname==='/')){u.searchParams.set('lang',lang);a.href=u.href}},true);
 window.KETOWAY_I18N={get language(){return lang},translate,refresh:render};setLanguage(lang,false);
})();
