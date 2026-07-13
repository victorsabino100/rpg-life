/* ATLAS — camada funcional de runtime.
   Corrige estilos inline que CSS não alcança (kanbans renderizados por JS)
   e remove emojis de todo texto, inclusive em conteúdo criado dinamicamente.
   Incluir no fim do <body>: <script src="atlas.js"></script> */
(function(){
var HARD={'#7c3aed':'#5A62E8','#8b5cf6':'#6C55C8','#3b82f6':'#2E7FA8','#f59e0b':'#A66A10','#10b981':'#1E7F5C','#ef4444':'#C7402E','#ec4899':'#E5533F','#06b6d4':'#2E7FA8','#22c55e':'#1E7F5C','#eab308':'#A66A10'};
var EMOJI=/[\u{1F000}-\u{1FAFF}\u{FE0F}\u{2B50}\u{2B55}\u{2705}\u{2728}\u{274C}\u{274E}\u{2753}\u{2754}\u{2755}\u{2757}\u{2764}\u{2795}-\u{2797}\u{27A1}\u{231A}\u{231B}\u{23E9}-\u{23FA}\u{2600}-\u{26FF}]/gu;
function hardColor(hex){return HARD[hex.toLowerCase()]||hex}
function fixEl(el){
  var st=el.getAttribute&&el.getAttribute('style');
  if(!st)return;
  // gradiente esmaecido de kanban -> cor sólida
  var m=st.match(/linear-gradient\(180deg,\s*(#[0-9a-fA-F]{6})38/);
  if(m){var c=hardColor(m[1]);
    el.style.background=c;el.style.borderBottomColor=c;el.style.borderRadius='0';
    var ts=el.querySelectorAll('.crm-col-title,.journey-col-headtitle');
    for(var i=0;i<ts.length;i++)ts[i].style.color='#fff';
    var tot=el.querySelector('.crm-col-total');if(tot)tot.style.color='rgba(255,255,255,.8)';
    var sp=el.querySelectorAll('span');
    for(var j=0;j<sp.length;j++){var s2=sp[j].getAttribute('style')||'';
      if(/background:\s*#[0-9a-fA-F]{6}22/.test(s2)){sp[j].style.background='#fff';sp[j].style.color='#17150F';sp[j].style.borderRadius='0'}}
    st=el.getAttribute('style');
  }
  // remapeia hexes antigos em qualquer inline
  var n=st;for(var k in HARD){n=n.split(k).join(HARD[k]);n=n.split(k.toUpperCase()).join(HARD[k])}
  if(n!==st)el.setAttribute('style',n);
}
function fixStyles(root){
  if(root.nodeType!==1&&root.nodeType!==9)return;
  if(root.nodeType===1)fixEl(root);
  var els=root.querySelectorAll?root.querySelectorAll('[style]'):[];
  for(var i=0;i<els.length;i++)fixEl(els[i]);
}
function stripEmoji(node){
  var w=document.createTreeWalker(node,NodeFilter.SHOW_TEXT),t;
  while(t=w.nextNode()){EMOJI.lastIndex=0;
    if(EMOJI.test(t.nodeValue)){EMOJI.lastIndex=0;t.nodeValue=t.nodeValue.replace(EMOJI,function(c){return (window._EIC&&window._EIC[c])?c:''})}}
}
function run(root){root=root||document.body;if(!root)return;fixStyles(root);stripEmoji(root)}
new MutationObserver(function(ms){
  for(var i=0;i<ms.length;i++)for(var j=0;j<ms[i].addedNodes.length;j++){
    var n=ms[i].addedNodes[j];
    if(n.nodeType===1)run(n);
    else if(n.nodeType===3){EMOJI.lastIndex=0;if(EMOJI.test(n.nodeValue)){EMOJI.lastIndex=0;n.nodeValue=n.nodeValue.replace(EMOJI,function(c){return (window._EIC&&window._EIC[c])?c:''})}}
  }
}).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState!=='loading')run();else document.addEventListener('DOMContentLoaded',function(){run()});
})();

/* ATLAS token guard: o app escreve --primary/--bg etc. inline no <html>;
   inline vence stylesheet, então removemos e mantemos removido. */
(function(){
var PROPS=['--primary','--primary-l','--primary-d','--gold','--pink','--pink-l','--bg','--surface','--surface2','--border','--border-soft','--text','--muted','--navy','--green','--red','--grad-brand'];
function clean(){var s=document.documentElement.style;for(var i=0;i<PROPS.length;i++)if(s.getPropertyValue(PROPS[i]))s.removeProperty(PROPS[i])}
new MutationObserver(clean).observe(document.documentElement,{attributes:true,attributeFilter:['style']});
clean();document.addEventListener('DOMContentLoaded',clean);setTimeout(clean,800);
})();

/* Quadro de ícones do modal de recompensa (renderizados pelo motor padrão do sistema) */
window._rwIcons=['🎁','🎮','📺','☕','🍕','🍽','🛍','🛒','📚','🎨','🎟','🔥','⭐','🏆','💎','🪙','💰','🎯','📅','💡','🧠','💪','🙏','✝','🥗','📈','⚡','🌞','🌙','⏰'];
window._rwIconGrid=function(cur){return window._rwIcons.map(function(e){var on=e===cur;return '<button type="button" data-ic="'+e+'" onclick="window._pickRwIcon(this)" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:19px;background:'+(on?'#17150F':'transparent')+';color:'+(on?'#F7F5F0':'inherit')+';border:1px solid #D8D3C6;cursor:pointer;padding:0">'+e+'</button>'}).join('')};
window._pickRwIcon=function(btn){var e=btn.getAttribute('data-ic');var i=document.getElementById('rw-icon');if(i)i.value=e;var g=document.getElementById('rw-icon-grid');if(g)g.querySelectorAll('button').forEach(function(b){var on=b===btn;b.style.background=on?'#17150F':'transparent';b.style.color=on?'#F7F5F0':'inherit'})};
