/* Local category filtering. No tracking, external scripts or form submission. */
(()=>{
 const search=document.querySelector('#product-search');if(!search)return;
 const cards=[...document.querySelectorAll('#catalog-results .product-card')];
 const buttons=[...document.querySelectorAll('[data-filter]')];let selected='all';
 const keywords={mouth:'mouth tape x h lip collagen openings',nasal:'nasal strips nose breathing',wellness:'wellness patches functional body sleep nad+ women b12 energy'};
 function update(){const words=search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);let count=0;for(const card of cards){const category=card.dataset.category;const matches=(selected==='all'||selected===category)&&words.every(w=>(keywords[category]+' '+card.textContent.toLowerCase()).includes(w));card.hidden=!matches;if(matches)count++}document.querySelector('#catalog-status').textContent=count+' product '+(count===1?'category':'categories');document.querySelector('#catalog-empty').hidden=count>0;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===selected)))}
 search.addEventListener('input',update);buttons.forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.filter;update()}));update();
})();
