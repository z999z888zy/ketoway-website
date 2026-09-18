/* Independent, keyboard-accessible shape / finish configurators. No tracking or upload. */
(()=>{
 'use strict';
 const catalog=window.KETOWAY_CONFIG;
 if(!catalog)return;
 const colors=[['C01','Black','#22252a'],['C02','White','#ffffff'],['C03','Red','#ee3947'],['C04','Orange','#f5763b'],['C05','Green','#15875d'],['C06','Royal blue','#334fcd'],['C07','Yellow','#f6e623'],['C08','Skin tone','#d6b99b'],['C09','Sky blue','#57b4d3'],['C10','Navy','#24365f'],['C11','Pink','#e264a0'],['C12','Lavender','#a58abf'],['C13','Mint','#a8d5c9'],['C14','Purple','#704b91'],['C15','Cream','#e5dfb8'],['C16','Coral','#edacb7']].map(([id,name,color])=>({id,name,color}));
 const finishes=[...colors,...catalog.patterns];
 const defaults=key=>({shape:catalog[key].shape[0].id,finish:key==='body'?'C08':'C01'});
 const make=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text)node.textContent=text;return node};
 const paint=(el,finish)=>{el.style.backgroundColor=finish.color||'#e7eef8';el.style.backgroundImage=finish.image?`url("${finish.image}")`:'none';el.style.backgroundSize=finish.image?'38px 38px':'auto'};
 const mask=(el,shape)=>{el.style.maskImage=`url("${shape.mask}")`;el.style.webkitMaskImage=`url("${shape.mask}")`};
 for(const root of document.querySelectorAll('[data-configurator]')){
  const key=root.dataset.configurator,product=catalog[key];if(!product)continue;
  let state=defaults(key);
  root.classList.add('is-ready');
  const uid='config-'+key+'-'+[...document.querySelectorAll('[data-configurator]')].indexOf(root);
  const panel=make('div','config-controls');
  const eyebrow=make('p','eyebrow','LIVE CUSTOMIZATION / '+product.name.toUpperCase());
  const heading=make('h3','','Choose it. See it.');panel.append(eyebrow,heading,make('p','config-intro','Select a shape, then a color or print. Your preview updates instantly.'));
  const shapeField=make('fieldset','config-field');shapeField.append(make('legend','','01 / Choose a style'));
  const shapeGrid=make('div','shape-options');
  const shapeButtons=[];
  for(const shape of product.shape){
   const button=make('button','shape-choice');button.type='button';button.dataset.shape=shape.id;button.setAttribute('aria-label',shape.name+' — '+shape.id);button.title=shape.name+' — '+shape.id;
   const silhouette=make('span','shape-silhouette');mask(silhouette,shape);silhouette.setAttribute('aria-hidden','true');
   button.append(silhouette,make('span','shape-ref',shape.id));button.addEventListener('click',()=>{state.shape=shape.id;update()});shapeButtons.push(button);shapeGrid.append(button);
  }
  shapeField.append(shapeGrid);panel.append(shapeField);
  const colorField=make('fieldset','config-field');colorField.append(make('legend','','02 / Choose a color'));
  const colorGrid=make('div','finish-options');const finishButtons=[];
  const finishButton=finish=>{
   const button=make('button','finish-choice');button.type='button';button.dataset.finish=finish.id;button.setAttribute('aria-label',finish.name);button.title=finish.name;const chip=make('span','finish-chip');paint(chip,finish);chip.setAttribute('aria-hidden','true');button.append(chip);button.addEventListener('click',()=>{state.finish=finish.id;update()});finishButtons.push(button);return button;
  };
  colors.forEach(c=>colorGrid.append(finishButton(c)));colorField.append(colorGrid);panel.append(colorField);
  const printField=make('fieldset','config-field');printField.append(make('legend','','Or choose a printed pattern'));
  const printGrid=make('div','finish-options pattern-options');catalog.patterns.forEach(p=>printGrid.append(finishButton(p)));printField.append(printGrid);panel.append(printField);
  const summary=make('p','config-summary');summary.id=uid+'-summary';summary.setAttribute('role','status');summary.setAttribute('aria-live','polite');summary.setAttribute('aria-atomic','true');panel.append(summary);
  const actions=make('div','config-actions');const inquiry=make('a','button','Ask about this design ↗');
  const reset=make('button','config-reset','Reset');reset.type='button';reset.addEventListener('click',()=>{state=defaults(key);update()});actions.append(inquiry,reset);panel.append(actions);
  panel.append(make('p','config-disclaimer','Customization illustration only. Preview references are not SKU codes. Final size, material, print and color are confirmed with your sample.'));
  const view=make('div','config-view');const figure=make('figure','config-figure config-'+key);
  const picture=make('img','config-model');picture.src='assets/'+product.model;picture.alt=product.name+' wearing illustration';picture.loading='lazy';picture.decoding='async';
  const applied=make('span','applied-patch');applied.setAttribute('aria-hidden','true');applied.style.left=product.x+'%';applied.style.top=product.y+'%';applied.style.width=product.w+'%';applied.style.height=product.h+'%';applied.style.transform=`translate(-50%,-50%) rotate(${product.rotation}deg)`;
  const fabric=make('span','patch-fabric');applied.append(fabric);
  const modelStage=make('div','config-model-stage');modelStage.append(picture,applied);figure.append(modelStage);
  const zoom=make('div','config-detail');const flat=make('span','flat-patch');flat.setAttribute('aria-hidden','true');zoom.append(make('span','detail-label','YOUR SELECTED DESIGN'),flat);figure.append(zoom);view.append(figure);
  const caption=make('p','config-view-caption');view.append(caption);root.replaceChildren(panel,view);
  function update(){
   const shape=product.shape.find(s=>s.id===state.shape),finish=finishes.find(f=>f.id===state.finish);
   for(const b of shapeButtons)b.setAttribute('aria-pressed',String(b.dataset.shape===state.shape));
   for(const b of finishButtons)b.setAttribute('aria-pressed',String(b.dataset.finish===state.finish));
   mask(applied,shape);paint(applied,finish);mask(flat,shape);paint(flat,finish);
   const label=shape.name+' ('+shape.id+') · '+finish.name+' ('+finish.id+')';summary.textContent='Selected: '+label;caption.textContent=label;
   inquiry.href='contact.html?'+new URLSearchParams({product:product.name,style:shape.id,finish:finish.id}).toString();
   root.dataset.selectedShape=shape.id;root.dataset.selectedFinish=finish.id;
  }
  update();
 }
 // Carry only recognized reference IDs into the existing WhatsApp / email draft form.
 const form=document.querySelector('#inquiry-form');
 if(form){const params=new URLSearchParams(location.search);const key=['mouth','nasal','body'].find(k=>catalog[k].name===params.get('product'));
  if(key){const shape=catalog[key].shape.find(s=>s.id===params.get('style'));const finish=finishes.find(f=>f.id===params.get('finish'));
   if(shape&&finish)form.elements.message.value+=`Customization preview request:\nProduct: ${catalog[key].name}\nStyle reference: ${shape.id} — ${shape.name}\nColor / print reference: ${finish.id} — ${finish.name}\nPlease confirm the available dimensions, material and sample.\n`;
  }
 }
})();
