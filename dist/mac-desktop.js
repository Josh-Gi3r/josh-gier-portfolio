const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Purpose labels and balloon help describe the product, not the file action.
export const macProjects={
 '4sight':{label:'Prediction markets',icon:'markets',color:'#3856be',description:'Predict sporting outcomes and swap stablecoins in one finance app. Funding and holdings stay connected across web, mobile and Telegram.',screen:'/assets/4sight-supplied.webp'},
 'effex-product':{label:'Stablecoin intelligence',icon:'news',color:'#216d51',description:'News and research on stablecoins and the companies moving money. Readers can explore assets, reserve backing and market infrastructure.',screen:'/assets/nextcurrency-supplied.webp'},
 esportz:{label:'Gaming discovery',icon:'game',color:'#227c6c',description:'Discover games, read guides and join competitions. Predictions and quests give players more ways to participate.'},
 lamuse:{label:'Jewellery discovery',icon:'jewel',color:'#ac8054',description:'Discover jewellery and try pieces on virtually. Merchants manage catalogues, content and customer enquiries.',screen:'/assets/lamuse-supplied.webp'},
 'savills-os':{label:'Property marketing',icon:'property',color:'#a26d24',description:'Connect property content to enquiries, opportunities and approvals. A working demo of the content-led real-estate business.'},
 yours:{label:'Marketing workspace',icon:'calendar',color:'#2f8c89',description:'Plan campaigns, produce content and manage approvals in one workspace. Publishing and performance review stay connected to the brief.'},
 blueballs:{label:'Banking software',icon:'bank',color:'#4b66ac',description:'A self-hostable neobank reference with accounts, cards, FX and a double-entry ledger. Developers can inspect and adapt the infrastructure.'},
 'pocket-t':{label:'Remote terminal',icon:'terminal',color:'#6a5796',description:'Use Mac terminal sessions and coding agents from your phone. Resume ongoing work and review agent output away from the desk.'},
 docshare:{label:'Document sharing',icon:'document',color:'#546fbd',description:'Share presentations through controlled links, with slide narration and page-level analytics. Teams can host the service themselves.'},
 buzz:{name:'Buzz / Preview',label:'Responsive previews',icon:'preview',color:'#8b6699',description:'My Live Preview Studio contribution to a community fork of Block Buzz. Review an artifact at desktop and mobile sizes alongside the work.'},
 atlas:{label:'Workplace planning',icon:'plan',color:'#76824c',description:'Model workplace scenarios using people, work patterns and space requirements. Evidence and assumptions remain visible alongside each option.'},
 'sera-agents':{label:'Agent payments',icon:'agent',color:'#5273aa',description:'Stablecoin currency conversion for AI-agent workflows. Developers can integrate FX into agents that move and manage money.'},
 'sera-payroll':{label:'Payroll operations',icon:'payroll',color:'#4c8d80',description:'Prepare, review and track payroll across employer, operator and employee workspaces. Includes Malaysia and Singapore calculation engines.'},
 serafx:{label:'Telegram finance',icon:'chat',color:'#4797b2',description:'Currency swaps, transfers and peer-to-peer offers inside Telegram. A mini-app connects the key steps in a finance journey.'},
 'creator-platform':{label:'Creator marketplace',icon:'creator',color:'#b17769',description:'Find creators, commission services and follow delivery. The marketplace connects a creator’s offer to the buyer’s brief.'},
 'whale-tracker':{label:'Transaction monitor',icon:'activity',color:'#477ca1',description:'Filter and investigate large on-chain transactions. This reference dashboard uses simulated activity and a replaceable data provider.'},
 'network-graph':{label:'Relationship mapping',icon:'network',color:'#946493',description:'Explore people, company clusters and introduction paths. The example network is fictional; the interface can be adapted to real relationship data.'},
 'launch-board':{label:'Product directory',icon:'directory',color:'#bf7951',description:'Browse launches, filter product listings and submit new entries. A configurable front end with a replaceable submission backend.'},
 'stablecoin-payroll':{name:'Payroll Reference',label:'Payroll software',icon:'payroll',color:'#4b8e84',description:'Open-source HR, payroll and employer-of-record workflows. Country calculations are implemented; payment settlement in this reference is mocked.'},
 linkhub:{label:'Team profiles',icon:'links',color:'#7375a9',description:'Create team link pages, digital business cards and branded QR codes. Track clicks across a self-hosted profile and sharing system.'},
 'tg-dex-miniapp':{name:'Telegram FX',label:'Finance client',icon:'chat',color:'#4797b2',description:'An open-source Telegram client for wallets, currency swaps, transfers and peer-to-peer flows. Settlement is configurable for the deployment.'},
 'prediction-fx-terminal':{name:'Prediction & FX',label:'Finance terminal',icon:'markets',color:'#526baf',description:'A self-custodial finance reference related to the later 4Sight product. Explore its market, wallet and transaction interfaces in the source.'},
 'ambassador-kit':{label:'Community programmes',icon:'community',color:'#9b8050',description:'Manage ambassador applications, contributions, XP, tiers and rewards. A toolkit for running and adapting community programmes.'},
 'creator-storefront':{label:'Service bookings',icon:'creator',color:'#aa7068',description:'Creator profiles, services and booking journeys in a reference marketplace. The fan-token ledger is simulated.'},
 'stablecoin-intelligence':{name:'Stablecoin Research',label:'Research infrastructure',icon:'research',color:'#447b62',description:'Research stablecoins through asset profiles, reserve data, comparisons and a documented methodology. Includes API and MCP access.'}
};

const glyphs={
 markets:'<path d="M9 22h3v-5h3v5h3V12h3v10h3" fill="none"/><path d="m9 14 6-4 4 2 5-4" fill="none"/>',
 news:'<path d="M9 11h15v3H9zM9 17h5v7H9z"/><path d="M17 17h7m-7 3h7m-7 4h7" fill="none"/>',
 game:'<path d="M9 14h14l3 10h-5l-3-3h-4l-3 3H6z"/><path d="M10 16v5m-2-3h5m7-1h2m0 3h2" stroke="#fff" fill="none"/>',
 jewel:'<path d="m8 14 4-5h9l4 5-9 12z" fill-opacity=".45"/><path d="M8 14h17m-13-5 4 17 5-17m-9 0 4 5 5-5" fill="none"/>',
 property:'<path d="m7 15 9-7 10 7M10 14v12h13V14" fill="none"/><path d="M14 19h5v7m-7-10h2m5 0h2" fill="none"/>',
 calendar:'<path d="M8 10h17v16H8z" fill-opacity=".25"/><path d="M8 15h17M12 8v5m9-5v5m-10 5h3m4 0h3m-10 4h3m4 0h3" fill="none"/>',
 bank:'<path d="m7 13 9-5 10 5zM8 25h17M10 16v7m6-7v7m7-7v7" fill="none"/>',
 terminal:'<path d="M7 10h19v16H7z"/><path d="m10 14 4 3-4 3m7 1h6" stroke="#fff" fill="none"/>',
 document:'<path d="M9 8h11l4 4v15H9z" fill-opacity=".18"/><path d="M19 8v5h5m-12 3h9m-9 4h9m-9 4h6" fill="none"/>',
 preview:'<path d="M7 10h16v13H7z" fill-opacity=".25"/><path d="M9 13h12m-12 3h8m-4 10h5" fill="none"/><path d="M21 16h6v12h-6z" fill="#eee"/><path d="M23 25h2" fill="none"/>',
 plan:'<path d="M8 9h17v17H8z" fill-opacity=".15"/><path d="M8 18h8V9m0 9h9m-9 3v5m4-17v6" fill="none"/>',
 agent:'<path d="M8 13h17v12H8z" fill-opacity=".35"/><path d="M16 8v5m-5 5h3m5 0h3m-10 4h9M5 17v5m23-5v5" fill="none"/>',
 payroll:'<path d="M9 8h13v18H9z" fill-opacity=".2"/><path d="M12 12h7m-7 4h5m-5 4h5" fill="none"/><path d="M20 20h7v7h-7z"/><path d="M23 21v5m-2-2h4" stroke="#fff" fill="none"/>',
 chat:'<path d="M7 10h19v13H15l-5 4v-4H7z" fill-opacity=".3"/><path d="m11 17 10-4-4 7-2-3z"/>',
 creator:'<path d="M8 11h17v15H8z" fill-opacity=".2"/><path d="M8 11v5h17v-5M11 9v4m10-4v4" fill="none"/><path d="M13 20h7v6h-7z"/>',
 activity:'<path d="M7 10h19v16H7z" fill-opacity=".15"/><path d="M8 20h4l3-7 4 11 3-6h4" fill="none"/>',
 network:'<path d="m11 12 10 11m0-11L11 23m0-11h10m-10 11h10" fill="none"/><path d="M8 9h6v6H8zM19 9h6v6h-6zM8 21h6v6H8zM19 21h6v6h-6z"/>',
 directory:'<path d="M8 9h17v18H8z" fill-opacity=".2"/><path d="M11 13h2m3 0h6m-11 5h2m3 0h6m-11 5h2m3 0h6" fill="none"/>',
 links:'<path d="M8 15v-5h11v9h-5m11-1v9H14v-9h5m-7 5 10-10" fill="none"/>',
 community:'<path d="M13 9h7v7h-7zM10 19h13v8H10z" fill-opacity=".4"/><path d="M6 12h4v5H6m17-5h4v5h-4M5 21h3v6m17-6h3v6" fill="none"/>',
 research:'<path d="M8 9h13v17H8z" fill-opacity=".2"/><path d="M11 13h7m-7 4h5m-5 5h3" fill="none"/><path d="M18 18h7v7h-7z" fill="#eee"/><path d="m24 25 4 4" fill="none"/>'
};
export function macIcon(p){
 const m=macProjects[p.id];
 return `<svg viewBox="0 0 32 34" class="mac-file-icon" aria-hidden="true" shape-rendering="crispEdges"><path d="M5 2h17l6 6v24H5z" fill="#fcfcf4" stroke="#292a30"/><path d="M22 2v6h6" fill="#b9bdc6" stroke="#292a30"/><path d="M6 32h23V9" fill="none" stroke="#696d79"/><g stroke="${m.color}" fill="${m.color}" stroke-width="1.4">${glyphs[m.icon]}</g></svg>`;
}
const folderIcon='<svg viewBox="0 0 24 19" aria-hidden="true" shape-rendering="crispEdges"><path d="M1 4V1h8l3 3h11v14H1z" fill="#a8c7e4" stroke="#313847"/><path d="M2 5h20M2 6v10" fill="none" stroke="#e7f2fc"/></svg>';
let collection='Products',page=0;
const pageSize=()=>innerWidth<370?2:innerWidth<=760?3:6;
export function renderMacDesktop(products){
 const size=pageSize(),items=products.filter(p=>p.collection===collection), pages=Math.ceil(items.length/size);
 page=Math.min(page,pages-1);
 const visible=items.slice(page*size,page*size+size);
 return `<div class="mac-desktop">
 <nav class="mac-menubar" aria-label="Studio menu"><details class="mac-system-menu"><summary aria-label="Open studio menu">⌘</summary><div><a href="#room">Back to the room</a><a href="#work">Work index</a><a href="#about">About & CV</a></div></details><b>Finder</b><span class="mac-menu-divider"></span><span class="mac-menu-name">Josh’s Studio</span><details class="mac-help-menu"><summary>Help</summary><div><b>Exploring the studio</b><p>Hover or focus on an icon for a short description. Click once to open the project.</p><p>Use the ⓘ button for details on touch screens. Escape dismisses a description.</p></div></details></nav>
 <section class="mac-window" aria-label="${esc(collection)} folder">
 <div class="mac-titlebar"><a href="#room" class="mac-close-box" aria-label="Close computer and return to room"></a><strong>${esc(collection)}</strong><a class="mac-zoom-box" href="#project-directory" data-directory aria-label="Browse the full project directory">↗</a></div>
 <nav class="mac-folders" aria-label="Computer folders">${['Products','Open source','Experiments'].map(c=>`<button data-mac-collection="${c}" aria-pressed="${c===collection}">${folderIcon}<span>${c}</span></button>`).join('')}</nav>
 <div class="mac-files">${visible.map(p=>{const m=macProjects[p.id];return `<div class="mac-item" data-mac-item="${p.id}"><a href="#product/${p.id}" class="mac-project" aria-describedby="mac-desc-${p.id}">${macIcon(p)}<strong>${esc(m.name||p.name)}</strong><small>${esc(m.label)}</small></a><button class="mac-info-trigger" data-mac-info="${p.id}" aria-label="About ${esc(p.name)}" aria-haspopup="dialog">i</button><span class="sr-only" id="mac-desc-${p.id}">${esc(m.description)}</span></div>`}).join('')}</div>
 <div class="mac-status"><span>${page*size+1}–${Math.min(page*size+size,items.length)} of ${items.length} items</span><div class="mac-pagination"><button data-mac-page="-1" aria-label="Previous projects" ${page===0?'disabled':''}>◀</button><span>${page+1} / ${pages}</span><button data-mac-page="1" aria-label="Next projects" ${page===pages-1?'disabled':''}>▶</button></div><a href="#project-directory" data-directory>All projects ↓</a></div>
 </section><aside class="mac-balloon" hidden aria-label="Project description"></aside></div>`;
}

export function installMacDesktop(root,products){
 let showTimer,hideTimer,current=null,pinned=false,dismissed=null;
 const balloon=()=>root.querySelector('.mac-balloon');
 function details(id){
  hide();const p=products.find(p=>p.id===id),m=macProjects[id];if(!p||!m)return;
  const preview=m.screen||(p.image?`/assets/${p.image}.webp`:null),dialog=document.createElement('dialog');
  dialog.className='mac-info-dialog';dialog.setAttribute('aria-labelledby','mac-info-title');
  dialog.innerHTML=`<div class="mac-titlebar"><button class="mac-close-box" aria-label="Close project information" data-info-close></button><strong id="mac-info-title">About ${esc(p.name)}</strong></div><div class="mac-info-body">${preview?`<img class="mac-info-preview" src="${preview}" alt="${esc(p.name)} interface preview">`:macIcon(p)}<span class="mac-info-kind">${esc(m.label)}</span><p>${esc(m.description)}</p><a href="#product/${p.id}" class="mac-info-open">Open project ↗</a></div>`;
  document.body.append(dialog);
  dialog.addEventListener('click',e=>{if(e.target===dialog||e.target.closest('[data-info-close],.mac-info-open'))dialog.close();});
  dialog.addEventListener('close',()=>dialog.remove());dialog.showModal();
 }
 function hide(){clearTimeout(showTimer);clearTimeout(hideTimer);const b=balloon();if(b)b.hidden=true;current=null;pinned=false;}
 function show(id,pin=false){
  if(innerWidth<=760)return;
  clearTimeout(showTimer);clearTimeout(hideTimer);
  const p=products.find(p=>p.id===id),item=root.querySelector(`[data-mac-item="${id}"]`),b=balloon();
  if(!p||!item||!b||dismissed===id)return;
  current=id;pinned=pin;
  const m=macProjects[id],preview=m.screen||(p.image?`/assets/${p.image}.webp`:null);
  b.innerHTML=`<button class="mac-balloon-close" aria-label="Close project description" data-mac-dismiss>×</button><div class="mac-balloon-heading">${esc(p.name)}</div><div class="mac-balloon-content">${preview?`<img src="${preview}" alt="${esc(p.name)} interface preview" class="mac-balloon-preview">`:''}<p>${esc(m.description)}</p></div><a href="#product/${p.id}" class="mac-balloon-open">Open project ↗</a>`;
  b.hidden=false;b.style.visibility='hidden';
  const frame=root.querySelector('.mac-desktop').getBoundingClientRect(),r=item.getBoundingClientRect();
  const width=b.offsetWidth,height=b.offsetHeight;
  const left=Math.max(12,Math.min(r.left-frame.left+r.width/2-width/2,frame.width-width-12));
  const below=r.bottom-frame.top+7,above=r.top-frame.top-height-7;
  const fits=below+height<=frame.height-12;
  b.dataset.placement=fits?'below':'above';
  b.style.left=left+'px';b.style.top=Math.max(12,Math.min(fits?below:above,frame.height-height-12))+'px';
  b.style.setProperty('--nub',Math.max(18,Math.min(width-28,r.left-frame.left+r.width/2-left))+'px');
  b.style.visibility='visible';

 }
 const deferHide=()=>{clearTimeout(hideTimer);if(!pinned)hideTimer=setTimeout(hide,200);};
 root.addEventListener('pointerover',e=>{
  if(e.pointerType==='touch')return;
  if(e.target.closest('.mac-balloon')){clearTimeout(hideTimer);return;}
  const item=e.target.closest('[data-mac-item]');
  if(!item||item.contains(e.relatedTarget))return;
  dismissed=null;clearTimeout(hideTimer);clearTimeout(showTimer);
  if(!pinned)showTimer=setTimeout(()=>show(item.dataset.macItem),220);
 });
 root.addEventListener('pointerout',e=>{
  const item=e.target.closest('[data-mac-item]'),b=e.target.closest('.mac-balloon');
  if(item&&!item.contains(e.relatedTarget)){clearTimeout(showTimer);dismissed=null;if(!e.relatedTarget?.closest('.mac-balloon'))deferHide();}
  if(b&&!b.contains(e.relatedTarget))deferHide();
 });
 root.addEventListener('focusin',e=>{const item=e.target.closest('[data-mac-item]');if(item){dismissed=null;show(item.dataset.macItem);}else if(!e.target.closest('.mac-balloon'))hide();});
 root.addEventListener('focusout',e=>{if(!e.relatedTarget?.closest('.mac-item,.mac-balloon'))deferHide();});
 root.addEventListener('click',e=>{
  const folder=e.target.closest('[data-mac-collection]'),step=e.target.closest('[data-mac-page]');
  if(folder||step){
   hide();dismissed=null;if(folder){collection=folder.dataset.macCollection;page=0;}else page+=Number(step.dataset.macPage);
   root.querySelector('#computer-screen').innerHTML=renderMacDesktop(products);
   root.querySelector(folder?`[data-mac-collection="${collection}"]`:`[data-mac-page="${step.dataset.macPage}"]:not(:disabled)`)?.focus({preventScroll:true});return;
  }
  const info=e.target.closest('[data-mac-info]');
  if(info){e.preventDefault();dismissed=info.dataset.macInfo;details(info.dataset.macInfo);return;}
  if(e.target.closest('[data-mac-dismiss]')){dismissed=current;hide();return;}
  if(e.target.closest('.mac-project')||!e.target.closest('.mac-balloon'))hide();
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&balloon()&&!balloon().hidden){e.preventDefault();e.stopImmediatePropagation();dismissed=current;hide();}},true);
 window.addEventListener('hashchange',hide);
 let previousSize=pageSize();
 window.addEventListener('resize',()=>{hide();if(previousSize!==pageSize()){previousSize=pageSize();page=0;const screen=root.querySelector('#computer-screen');if(screen)screen.innerHTML=renderMacDesktop(products);}});
}
