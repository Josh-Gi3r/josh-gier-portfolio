// One opt-in control owns both tracks. No audio request or playback before a tap.
export function installSound() {
  const button=document.querySelector('#sound-toggle');
  const music=document.querySelector('#sound-music');
  const rain=document.querySelector('#sound-rain');
  const label=button.querySelector('.sound-label');
  const tracks=[music,rain];
  const levels=[.38,.055];
  let context, gains, wanted=false, token=0;

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
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){token++;tracks.forEach(track=>track.pause());if(context)context.suspend().catch(()=>{});}
    else if(wanted)start();
  });
  window.addEventListener('pagehide',()=>{tracks.forEach(track=>track.pause());});
  state('off');
}
