const plane=document.querySelector('#room-plane');
if(plane){
  const selectors=['.hotspot-tv','.hotspot-computer','.hotspot-board','.hotspot-games'];
  const introDelay=120;
  const overviewLength=1900;
  const reminderDelay=6000;
  const reminderLength=1300;
  let activeCue=null;
  let cueTimer=null;
  let reminderTimer=null;
  let overviewTimer=null;
  let introTimer=null;
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

  const clearOverview=()=>{
    if(overviewTimer){clearTimeout(overviewTimer);overviewTimer=null;}
    plane.classList.remove('room-cue-overview');
  };

  const showCue=(target,duration=reminderLength)=>{
    if(!target||!isRoom())return;
    clearOverview();
    clearCue();
    activeCue=target;
    target.classList.add('is-cued');
    cueTimer=setTimeout(()=>{
      target.classList.remove('is-cued');
      if(activeCue===target)activeCue=null;
      cueTimer=null;
    },duration);
  };

  const scheduleReminder=()=>{
    clearTimeout(reminderTimer);
    reminderTimer=setTimeout(()=>{
      if(!isRoom()){
        scheduleReminder();
        return;
      }
      const interactive=plane.querySelector('.hotspot:hover,.hotspot:focus-visible');
      if(interactive||plane.classList.contains('room-cue-overview')){
        scheduleReminder();
        return;
      }
      const hotspots=selectors.map(s=>plane.querySelector(s)).filter(Boolean);
      if(hotspots.length){
        const target=hotspots[reminderIndex%hotspots.length];
        reminderIndex+=1;
        showCue(target,reminderLength);
      }
      scheduleReminder();
    },reminderDelay);
  };

  const showOverview=()=>{
    if(!isRoom())return;
    clearCue();
    plane.classList.add('room-cue-overview');
    overviewTimer=setTimeout(()=>{
      plane.classList.remove('room-cue-overview');
      overviewTimer=null;
      scheduleReminder();
    },overviewLength);
  };

  const runIntro=()=>{
    if(introRan||!isRoom())return;
    const hotspots=selectors.map(s=>plane.querySelector(s));
    if(hotspots.some(h=>!h)){
      introTimer=setTimeout(runIntro,60);
      return;
    }
    introRan=true;
    introTimer=setTimeout(showOverview,introDelay);
  };

  const stopWhenAway=()=>{
    if(isRoom()){
      if(!introRan)runIntro();
      else scheduleReminder();
    }else{
      clearTimeout(introTimer);
      clearTimeout(reminderTimer);
      clearCue();
      clearOverview();
    }
  };

  // The visitor should understand every destination immediately. Hover/focus
  // remains instant confirmation once the short four-label overview is gone.
  plane.addEventListener('pointerover',e=>{
    if(e.target.closest('.hotspot')){
      clearCue();
      clearOverview();
    }
  });
  plane.addEventListener('focusin',e=>{
    if(e.target.closest('.hotspot')){
      clearCue();
      clearOverview();
    }
  });

  addEventListener('hashchange',()=>setTimeout(stopWhenAway,50));
  document.addEventListener('visibilitychange',stopWhenAway);

  runIntro();
}
