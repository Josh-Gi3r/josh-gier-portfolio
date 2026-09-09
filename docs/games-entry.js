const plane=document.querySelector('#room-plane');
if(plane&&!plane.querySelector('.hotspot-games')){
  const link=document.createElement('a');
  link.className='hotspot hotspot-games';
  link.href='/games.html';
  link.setAttribute('aria-label','Explore games and fan projects on the PlayStation');
  link.innerHTML='<span class="interaction-marker"><span class="marker-ring" aria-hidden="true"></span><span class="marker-label">Games</span></span>';
  plane.append(link);

  const style=document.createElement('style');
  style.textContent=`
    .hotspot-games{left:70.4%;top:70.2%;width:10.8%;height:10.5%;--marker-x:43%;--marker-y:30%}
    .hotspot-games .marker-ring{animation:games-invite 2.1s ease-in-out infinite}
    .hotspot-games:hover .marker-ring,.hotspot-games:focus-visible .marker-ring{animation:none;transform:scale(1.22);background:var(--amber);box-shadow:0 0 0 6px #f1c8792b,0 0 24px #f1c87999}
    @keyframes games-invite{0%,58%,100%{background:#151a1820;box-shadow:0 0 10px #fff4d52b;transform:scale(1)}68%{background:#e7ba73;box-shadow:0 0 0 5px #e7ba7336,0 0 22px #e7ba73b8;transform:scale(1.14)}82%{background:#151a1820;box-shadow:0 0 0 13px #e7ba7300,0 0 12px #fff4d52b;transform:scale(1)}}
    @media(max-width:760px){.hotspot-games{min-width:48px;min-height:48px}.hotspot-games .interaction-marker{width:20px;height:20px}}
    @media(prefers-reduced-motion:reduce){.hotspot-games .marker-ring{animation:none}}
  `;
  document.head.append(style);
}
