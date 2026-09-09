const mq=window.matchMedia('(max-width:760px)');
if(mq.matches){
  const header=document.querySelector('.site-header');
  const sound=document.querySelector('#sound-toggle');
  const motion=document.querySelector('#motion-toggle');
  const music=document.querySelector('#sound-music');
  const rain=document.querySelector('#sound-rain');

  // Preload the atmosphere on phones so the first permitted interaction can
  // start it without waiting for the MP3 request. Respect data-saver mode.
  if(!navigator.connection?.saveData){
    [music,rain].forEach(track=>{if(track){track.preload='auto';track.load();}});
  }

  // Make the audio control recognisable at a glance.
  if(sound&&!sound.querySelector('.mobile-sound-icon')){
    const icon=document.createElement('span');
    icon.className='mobile-sound-icon';
    icon.setAttribute('aria-hidden','true');
    icon.textContent='♪';
    sound.prepend(icon);
  }

  if(header&&!header.querySelector('.mobile-menu-toggle')){
    const toggle=document.createElement('button');
    toggle.className='mobile-menu-toggle';
    toggle.type='button';
    toggle.setAttribute('aria-label','Open menu');
    toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML='<span></span><span></span><span></span>';

    const menu=document.createElement('div');
    menu.className='mobile-menu';
    menu.hidden=true;
    menu.innerHTML=`
      <div class="mobile-menu-top"><span>Menu</span><button type="button" class="mobile-menu-close" aria-label="Close menu">×</button></div>
      <nav aria-label="Mobile navigation">
        <a href="#work"><span>01</span><strong>Work index</strong></a>
        <a href="#campaigns"><span>02</span><strong>Campaigns</strong></a>
        <a href="#products"><span>03</span><strong>Products</strong></a>
        <a href="#about"><span>04</span><strong>About & CV</strong></a>
        <a href="#contact"><span>05</span><strong>Get in touch</strong></a>
      </nav>
      <div class="mobile-menu-section">
        <span class="mobile-menu-label">Documents</span>
        <a href="/assets/Josh-Gier-CV.docx" download>Download CV <b>↓</b></a>
        <a href="/assets/Josh-Gier-Portfolio.docx" download>Download portfolio <b>↓</b></a>
      </div>
      <div class="mobile-menu-section mobile-menu-links">
        <span class="mobile-menu-label">Elsewhere</span>
        <a href="https://github.com/Josh-Gi3r" target="_blank" rel="noopener noreferrer">GitHub <b>↗</b></a>
        <a href="https://x.com/Josh_Gier" target="_blank" rel="noopener noreferrer">X <b>↗</b></a>
        <a href="https://www.linkedin.com/in/joshgier" target="_blank" rel="noopener noreferrer">LinkedIn <b>↗</b></a>
      </div>
      <button type="button" class="mobile-motion-control">Pause room motion</button>`;

    header.append(toggle);
    document.body.append(menu);

    const close=()=>{
      menu.hidden=true;
      document.body.classList.remove('mobile-menu-open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open menu');
    };
    const open=()=>{
      if(!mq.matches)return;
      menu.hidden=false;
      document.body.classList.add('mobile-menu-open');
      toggle.setAttribute('aria-expanded','true');
      toggle.setAttribute('aria-label','Close menu');
      menu.querySelector('.mobile-menu-close')?.focus({preventScroll:true});
    };
    const syncBreakpoint=()=>{
      toggle.hidden=!mq.matches;
      if(!mq.matches)close();
    };

    toggle.addEventListener('click',()=>menu.hidden?open():close());
    menu.querySelector('.mobile-menu-close')?.addEventListener('click',close);
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    menu.querySelector('.mobile-motion-control')?.addEventListener('click',e=>{
      motion?.click();
      const paused=document.body.classList.contains('paused');
      e.currentTarget.textContent=paused?'Play room motion':'Pause room motion';
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden)close();});
    document.addEventListener('pointerdown',e=>{
      if(menu.hidden||menu.contains(e.target)||toggle.contains(e.target))return;
      close();
    });
    mq.addEventListener?.('change',syncBreakpoint);
    syncBreakpoint();
  }
}
