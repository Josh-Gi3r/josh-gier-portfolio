const plane=document.querySelector('#room-plane');
if(plane){
  const selectors=['.hotspot-tv','.hotspot-computer','.hotspot-board','.hotspot-games'];
  const cueLength=2500;
  const gap=360;
  const firstDelay=520;
  const overviewLength=4200;
  const reminderDelay=8000;
  let activeCue=null;
  let cueTimer=null;
  let reminderTimer=null;
  let overviewTimer=null;
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

  const clearOverview=()=>{
    clearTimeout(overviewTimer);
    overviewTimer=null;
    plane.classList.remove('room-cue-overview');
  };

  const clearIntro=()=>{
    introTimers.forEach(clearTimeout);
    introTimers=[];
  };

  const showCue=(target,duration=cueLength)=>{
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
        showCue(target,1900);
      }
      scheduleReminder();
    },reminderDelay);
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
      introTimers.push(setTimeout(()=>showCue(target),firstDelay+index*(cueLength+gap)));
    });
    const overviewAt=firstDelay+hotspots.length*(cueLength+gap)+250;
    introTimers.push(setTimeout(showOverview,overviewAt));
  };

  const stopWhenAway=()=>{
    if(isRoom()){
      if(!introRan)setTimeout(runIntro,300);
      else scheduleReminder();
    }else{
      clearCue();
      clearOverview();
      clearTimeout(reminderTimer);
    }
  };

  // A person taking control gets immediate feedback and never has to wait for
  // the ambient sequence to explain the object.
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

  addEventListener('hashchange',()=>setTimeout(stopWhenAway,80));
  document.addEventListener('visibilitychange',stopWhenAway);

  setTimeout(runIntro,180);
}
