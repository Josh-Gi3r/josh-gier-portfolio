// One control owns both tracks. Unless the visitor previously switched it off, sound
// starts as soon as the browser allows: on load where autoplay is permitted, otherwise
// on the first tap, click, key press or touch anywhere in the room.
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
  async function start(quiet=false) {
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
      return true;
    } catch {
      if(attempt!==token)return false;
      wanted=false;
      tracks.forEach(track=>track.pause());
      if(context)context.suspend().catch(()=>{});
      if(quiet){state('off');return false;}
      state('error');
      document.querySelector('#announcer').textContent='Sound could not start. Use Retry sound to try again.';
      return false;
    }
  }
  // Some browsers allow sound without a gesture, e.g. for a site the visitor has used
  // before. Probe that silently on load; if it is refused, the first gesture starts it.
  async function tryAutoplay() {
    const volumes=tracks.map(track=>track.volume);
    tracks.forEach(track=>{track.volume=0;});
    try {
      await Promise.all(tracks.map(track=>track.play()));
      tracks.forEach((track,i)=>{track.volume=volumes[i];});
      if(!wanted)start(true);
    } catch {
      tracks.forEach((track,i)=>{track.volume=volumes[i];});
      if(!wanted)tracks.forEach(track=>track.pause());
    }
  }
  button.addEventListener('click',()=>wanted?stop():start());
  // Start on the first gesture the autoplay policy accepts. Clicks, taps and key presses
  // always count; mobile browsers may also accept the end of a touch, including a scroll
  // swipe. Mouse movement and scrolling alone never unlock audio in any browser. Refused
  // tries stay quiet and the listeners stay armed until sound is on. The Sound button
  // keeps its own click handling; a gesture on it disarms this.
  if(memory.get()!=='off'){
    const armed=['pointerdown','keydown','touchend'];
    let trying=false;
    const disarm=()=>armed.forEach(type=>document.removeEventListener(type,firstGesture,true));
    const firstGesture=event=>{
      if(button.contains(event.target)){disarm();return;}
      if(event.type==='keydown'&&['Shift','Control','Alt','Meta','Tab'].includes(event.key))return;
      if(trying||button.dataset.state==='on'){if(button.dataset.state==='on')disarm();return;}
      trying=true;
      start(true).then(ok=>{trying=false;if(ok)disarm();});
    };
    armed.forEach(type=>document.addEventListener(type,firstGesture,true));
    tryAutoplay();
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){token++;tracks.forEach(track=>track.pause());if(context)context.suspend().catch(()=>{});}
    else if(wanted)start();
  });
  window.addEventListener('pagehide',()=>{tracks.forEach(track=>track.pause());});
  state('off');
}
