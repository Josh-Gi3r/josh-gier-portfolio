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
    @media(max-width:760px){.hotspot-games{min-width:48px;min-height:48px}.hotspot-games .interaction-marker{width:20px;height:20px}}
  `;
  document.head.append(style);
}
