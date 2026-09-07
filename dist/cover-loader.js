const COVER_BY_COLOR={
  '#beacd9':'jedstar-cover',
  '#d3c2a6':'aier-cover'
};
const cache=new Map();
async function loadCover(name){
  if(cache.has(name)) return cache.get(name);
  const r=await fetch(`/assets/${name}.b64?v=2`,{cache:'force-cache'});
  if(!r.ok) throw new Error(`cover ${name} ${r.status}`);
  const b64=(await r.text()).trim();
  const url=`data:image/webp;base64,${b64}`;
  cache.set(name,url);
  return url;
}
async function applyCovers(){
  const nodes=[...document.querySelectorAll('.tv-channel,.case-paper')];
  for(const node of nodes){
    const style=node.getAttribute('style')||'';
    const match=Object.entries(COVER_BY_COLOR).find(([color])=>style.includes(color));
    if(!match||node.dataset.coverApplied==='1') continue;
    const [,name]=match;
    try{
      const url=await loadCover(name);
      if(node.classList.contains('tv-channel')){
        node.style.backgroundImage=`linear-gradient(90deg,rgba(4,8,10,.68),rgba(4,8,10,.18)),url("${url}")`;
        node.style.backgroundSize='cover';
        node.style.backgroundPosition='center';
        node.querySelector('.channel-title-card')?.remove();
        node.querySelector('.tv-channel-shade')?.style.setProperty('background','linear-gradient(90deg,rgba(0,0,0,.48),rgba(0,0,0,.06) 72%)');
      }else{
        const header=node.querySelector('.case-header');
        if(header){
          header.style.backgroundImage=`linear-gradient(90deg,rgba(9,12,12,.86),rgba(9,12,12,.24)),url("${url}")`;
          header.style.backgroundSize='cover';
          header.style.backgroundPosition='center';
          header.style.color='#fff';
          header.style.padding='clamp(2.5rem,7vw,7rem)';
        }
      }
      node.dataset.coverApplied='1';
    }catch(e){console.warn(e)}
  }
}
new MutationObserver(()=>applyCovers()).observe(document.documentElement,{subtree:true,childList:true});
applyCovers();
