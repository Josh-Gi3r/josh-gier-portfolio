const plane=document.querySelector('#room-plane');
if(plane){
  const selectors=['.hotspot-tv','.hotspot-computer','.hotspot-board','.hotspot-games'];
  const cueLength=1850;
  const gap=520;
  const firstDelay=950;
  const reminderDelay=11500;
  let activeCue=null;
  let cueTimer=null;
  let reminderTimer=null;
  let introTimers=[];
  let introRan=false;
  let reminderIndex=0;

  const isRoom=()=>{
    const hash=location.hash.slice(1)||'room';
    return hash==='room'&&!document.body.classList.contains('away')&&!document.body.classList.contains('transitioning')&&!document.body.classList.contains('mobile-menu-open')&&!document.hidden;
  };

  const clearCue=()=>{
    if(cueTimer){clearTimeout(cueTimer);cueTimer=null;}
    activeCue?.classList.remove('is-cued');
    activeCue=null;
  };

  const clearIntro=()=>{
    introTimers.forEach(clearTimeout);
    introTimers=[];
  };

  const scheduleReminder=()=>{
    clearTimeout(reminderTimer);
    reminderTimer=setTimeout(()=>{
      if(!isRoom()){
        scheduleReminder();
        return;
      }
      const interactive=plane.querySelector('.hotspot:hover,.hotspot:focus-visible');
      if(interactive){
        scheduleReminder();
        return;
      }
      const hotspots=selectors.map(s=>plane.querySelector(s)).filter(Boolean);
      if(hotspots.length){
        const target=hotspots[reminderIndex%hotspots.length];
        reminderIndex+=1;
        showCue(target,1600);
      }
      scheduleReminder();
    },reminderDelay);
  };

  const showCue=(target,duration=cueLength)=>{
    if(!target||!isRoom())return;
    clearCue();
    activeCue=target;
    target.classList.add('is-cued');
    cueTimer=setTimeout(()=>{
      target.classList.remove('is-cued');
      if(activeCue===target)activeCue=null;
      cueTimer=null;
    },duration);
  };

  const runIntro=()=>{
    if(introRan||!isRoom())return;
    const hotspots=selectors.map(s=>plane.querySelector(s));
    if(hotspots.some(h=>!h)){
      setTimeout(runIntro,120);
      return;
    }
    introRan=true;
    clearIntro();
    hotspots.forEach((target,index)=>{
      const id=setTimeout(()=>showCue(target),firstDelay+index*(cueLength+gap));
      introTimers.push(id);
    });
    const end=firstDelay+hotspots.length*(cueLength+gap)+1200;
    introTimers.push(setTimeout(scheduleReminder,end));
  };

  const stopWhenAway=()=>{
    if(isRoom()){
      if(!introRan)setTimeout(runIntro,500);
      else scheduleReminder();
    }else{
      clearCue();
      clearTimeout(reminderTimer);
    }
  };

  // Hover and keyboard focus are immediate confirmation, independent of the
  // ambient teaching sequence. A user taking control cancels the current cue.
  plane.addEventListener('pointerover',e=>{
    if(e.target.closest('.hotspot'))clearCue();
  });
  plane.addEventListener('focusin',e=>{
    if(e.target.closest('.hotspot'))clearCue();
  });

  addEventListener('hashchange',()=>setTimeout(stopWhenAway,80));
  document.addEventListener('visibilitychange',stopWhenAway);

  setTimeout(runIntro,220);
}
