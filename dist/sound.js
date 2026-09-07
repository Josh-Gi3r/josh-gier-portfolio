// One control owns both tracks. Browsers refuse audio before a user gesture, so sound
// starts on the visitor's first tap, click or key press anywhere in the room unless
// they previously switched it off. No audio request or playback before that gesture.
export function installSound() {
  const button=document.querySelector('#sound-toggle');
  const music=document.querySelector('#sound-music');
  const rain=document.querySelector('#sound-rain');
  const label=button.querySelector('.sound-label');
  const tracks=[music,rain];
  const levels=[.38,.055];
  let context, gains, wanted=false, token=0;
  const memory={
    get(){try{return localStorage.getItem('jg-sound');}catch{return null;}},
    set(value){try{localStorage.setItem('jg-sound',value);}catch{}}
  };

  function state(value) {
    button.dataset.state=value;
    button.setAttribute('aria-pressed',String(value==='on'));
    button.setAttribute('aria-label',value==='on'?'Turn off music and rain':value==='loading'?'Cancel loading music and rain':'Turn on music and rain');
    label.textContent={off:'Sound off',loading:'Loading sound',on:'Sound on',error:'Retry sound'}[value];
  }
  function graph() {
    if(gains)return;
    const AudioGraph=window.AudioContext||window.webkitAudioContext;
    if(!AudioGraph){tracks.forEach((track,i)=>{track.volume=levels[i];});return;}
    context=new AudioGraph();
    gains=tracks.map(track=>{
      const source=context.createMediaElementSource(track);
      const gain=context.createGain();
      gain.gain.value=0;
      source.connect(gain).connect(context.destination);
      return gain;
    });
  }
  function stop() {
    wanted=false; token++;
    tracks.forEach(track=>track.pause());
    if(context)context.suspend().catch(()=>{});
    state('off');
    memory.set('off');
  }
  async function start() {
    const attempt=++token;
    wanted=true; state('loading');
    try {
      graph();
      // These calls all start in the click handler's activation context.
      const resume=context?context.resume():Promise.resolve();
      const plays=tracks.map(track=>track.play());
      await Promise.all([resume,...plays]);
      if(attempt!==token){if(!wanted)tracks.forEach(track=>track.pause());return;}
      if(gains)gains.forEach((gain,i)=>{
        gain.gain.cancelScheduledValues(context.currentTime);
        gain.gain.setValueAtTime(0,context.currentTime);
        gain.gain.linearRampToValueAtTime(levels[i],context.currentTime+.8);
      });
      state('on');
      memory.set('on');
    } catch {
      if(attempt!==token)return;
      wanted=false;
      tracks.forEach(track=>track.pause());
      if(context)context.suspend().catch(()=>{});
      state('error');
      document.querySelector('#announcer').textContent='Sound could not start. Use Retry sound to try again.';
    }
  }
  button.addEventListener('click',()=>wanted?stop():start());
  // Start on the first gesture anywhere, which is what the autoplay policy allows.
  // The Sound button keeps its own click handling; a gesture on it is left alone.
  if(memory.get()!=='off'){
    const armed=['pointerdown','keydown'];
    const firstGesture=event=>{
      armed.forEach(type=>document.removeEventListener(type,firstGesture,true));
      if(button.contains(event.target))return;
      if(event.type==='keydown'&&['Shift','Control','Alt','Meta','Tab'].includes(event.key))return;
      if(!wanted)start();
    };
    armed.forEach(type=>document.addEventListener(type,firstGesture,true));
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){token++;tracks.forEach(track=>track.pause());if(context)context.suspend().catch(()=>{});}
    else if(wanted)start();
  });
  window.addEventListener('pagehide',()=>{tracks.forEach(track=>track.pause());});
  state('off');
}
