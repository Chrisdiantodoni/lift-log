const moveDialog = document.getElementById('move-dialog');
let lastGuideButton = null;
function showMove(name) {
 const g = exerciseGuides[name];
 if (!g) return;
 document.getElementById('move-title').textContent = name;
 document.getElementById('move-muscles').textContent = g.muscle;
 const photos = g.images.length ? `<div class="move-photos">${g.images.map((src,i)=>`<figure><img src="${esc(src)}" alt="${esc(name)}: ${i===0?'posisi awal':'posisi gerakan'}" loading="lazy"><figcaption><span>0${i+1}</span> ${i===0?'Posisi awal':'Posisi gerakan'}</figcaption></figure>`).join('')}</div>` : `<div class="video-area"><p>Lihat demonstrasi lutut ditekuk lewat preview video.</p><button class="primary" type="button" data-play>Putar preview video</button><div id="move-video"></div></div>`;
 const alternatives = g.alternatives ? `<div class="move-alternatives"><span>Pilihan alat:</span>${g.alternatives.map(a=>`<button type="button" data-alternative="${esc(a)}" class="${g.assetId===exerciseGuides[a].assetId?'selected':''}">${esc(a)}</button>`).join('')}<small>Ini pilihan panduan; catatan latihan tetap disimpan di latihan yang kamu buka.</small></div>` : '';
 document.getElementById('move-content').innerHTML = `${alternatives}${photos}<div class="move-instructions"><h3>Cara melakukan</h3><ol>${g.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><div class="move-tip"><strong>Perhatikan</strong><p>${esc(g.tip)}</p></div><p class="move-general">Mulai dengan beban ringan dan gerakan terkontrol. Hentikan jika terasa nyeri tajam. Bentuk mesin di gym bisa berbeda; sesuaikan kursi dan bantalan.</p><div class="move-links"><a class="tutorial-link" href="${esc(g.url)}" target="_blank" rel="noopener noreferrer">▷ &nbsp; Buka tutorial / video</a>${g.imageSource?`<a href="${esc(g.imageSource)}" target="_blank" rel="noopener noreferrer">Sumber foto demonstrasi</a>`:''}</div>${g.variant?`<p class="move-source">Foto: free-exercise-db · Public domain. Contoh varian: ${esc(g.variant)}.</p>`:''}</div>`;
 document.querySelector('[data-play]')?.addEventListener('click', e=>{
  document.getElementById('move-video').innerHTML = `<iframe title="Video ${esc(name)}" src="${esc(g.videoEmbed)}" allow="fullscreen; picture-in-picture" allowfullscreen></iframe><p class="move-general">Jika video tidak dapat diputar, gunakan link tutorial di bawah.</p>`;
  e.currentTarget.hidden = true;
 });
 if (!moveDialog.open) moveDialog.showModal();
 moveDialog.scrollTop = 0;
}
document.getElementById('exercises').addEventListener('click', e=>{
 const b = e.target.closest('[data-guide]');
 if (b) {lastGuideButton=b;showMove(b.dataset.guide);}
});
moveDialog.addEventListener('click',e=>{
 const a=e.target.closest('[data-alternative]');if(a)showMove(a.dataset.alternative);
 if(e.target===moveDialog){const r=moveDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)moveDialog.close();}
});
document.getElementById('move-close').addEventListener('click',()=>moveDialog.close());
moveDialog.addEventListener('close',()=>{document.getElementById('move-content').innerHTML='';lastGuideButton?.focus();});
