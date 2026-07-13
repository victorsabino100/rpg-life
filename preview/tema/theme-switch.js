/* Seletor de temas do RPG Life — Atlas · Arcade · Nimbus.
   Botão único na barra lateral: cada clique alterna para o próximo tema.
   Troca o <link id="skin-css"> ao vivo e persiste em localStorage. */
(function(){
  var SKINS=[
    {id:'atlas', name:'Atlas',  href:'tema/atlas.css'},
    {id:'arcade',name:'Arcade', href:'tema/arcade.css'},
    {id:'nimbus',name:'Nimbus', href:'tema/nimbus.css'}
  ];
  var KEY='rpg_skin';
  var ICON='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/></svg>';
  function link(){ return document.getElementById('skin-css'); }
  function idx(){ try{ var i=SKINS.findIndex(function(x){return x.id===localStorage.getItem(KEY);}); return i<0?0:i; }catch(e){ return 0; } }
  function apply(i){
    var s=SKINS[((i%SKINS.length)+SKINS.length)%SKINS.length];
    var l=link(); if(l && l.getAttribute('href')!==s.href) l.setAttribute('href',s.href);
    try{localStorage.setItem(KEY,s.id);}catch(e){}
    var b=document.getElementById('skin-cycle'); if(b) b.querySelector('.skin-cur').textContent=s.name;
    try{window.dispatchEvent(new CustomEvent('rpgskinchange',{detail:s.id}));}catch(e){}
  }
  function mount(){
    var footer=document.querySelector('.sidebar-footer');
    if(!footer || document.getElementById('skin-cycle')) return false;
    var btn=document.createElement('button');
    btn.id='skin-cycle'; btn.type='button';
    btn.innerHTML=ICON+'<span>Tema: <b class="skin-cur" style="font-weight:700"></b></span>';
    btn.style.cssText='display:flex;align-items:center;justify-content:center;gap:8px';
    btn.title='Clique para alternar o tema';
    btn.addEventListener('click',function(){ apply(idx()+1); });
    var toggle=document.getElementById('theme-toggle');
    if(toggle) footer.insertBefore(btn, toggle); else footer.appendChild(btn);
    return true;
  }
  apply(idx()); // aplica o tema salvo imediatamente (antes do botão existir)
  function boot(){ if(!mount()){ var n=0, t=setInterval(function(){ if(mount()||++n>40) clearInterval(t); },150); } apply(idx()); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
