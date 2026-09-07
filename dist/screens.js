// All measurements use the original 1672 × 941 photographs. The photograph and
// the interactive glass share a single plane; responsive styles crop that plane
// without changing its proportions or giving the glass a separate scale.
const photo = {width:1672,height:941};
export const screenGeometry = {
  television: {
    image:'room-tv', id:'tv-screen', className:'tv-screen',
    alt:'The television in Josh’s bedroom',
    bounds:[413,116,835,568],
    outline:[['M',445,139],['C',640,109,1010,109,1220,139],['Q',1236,141,1239,158],['C',1250,275,1250,540,1239,646],['Q',1237,660,1220,665],['C',1010,689,645,689,440,665],['Q',425,663,423,647],['C',410,516,410,290,423,162],['Q',425,143,445,139],['Z']]
  },
  computer: {
    image:'room-computer', id:'computer-screen', className:'computer-screen',
    alt:'The beige computer in Josh’s bedroom',
    bounds:[438,102,791,573],
    outline:[['M',462,120],['C',655,97,1010,97,1199,120],['Q',1212,122,1215,141],['C',1228,292,1230,513,1218,650],['Q',1217,661,1206,662],['C',1000,677,665,677,457,662],['Q',445,661,445,650],['C',437,503,438,292,449,145],['Q',450,124,462,120],['Z']]
  }
};

const roomScreens = [
  {
    selector:'.tv-idle', mask:'room-tv-glass',
    corners:[[1223,404],[1370,427],[1362,601],[1217,555]],
    outline:[['M',1230,407],['Q',1292,410,1367,430],['L',1362,596],['Q',1288,582,1221,553],['Q',1214,482,1224,414],['Q',1225,406,1230,407],['Z']]
  },
  {
    selector:'.computer-idle', mask:'room-computer-glass',
    corners:[[840,253],[974,254],[971,356],[839,353]],
    outline:[['M',846,255],['Q',908,252,972,256],['L',969,354],['Q',905,355,843,351],['Q',838,303,842,261],['Q',843,255,846,255],['Z']]
  }
];

function normalizedPath(commands,[x,y,width,height]) {
  return commands.map(([command,...values]) => command + values.map((n,i) =>
    ((n-(i%2?y:x))/(i%2?height:width)).toFixed(7)
  ).join(' ')).join(' ');
}

export function deviceFrame(kind,content) {
  const s=screenGeometry[kind], [x,y,w,h]=s.bounds;
  return `<div class="device-stage ${kind}"><div class="device-plane"><img src="/assets/${s.image}.webp" alt="${s.alt}" class="device-image" width="1672" height="941" fetchpriority="high" decoding="async"><div class="device-screen ${s.className}" id="${s.id}" style="left:${x/photo.width*100}%;top:${y/photo.height*100}%;width:${w/photo.width*100}%;height:${h/photo.height*100}%;clip-path:url(#${kind}-glass)">${content}</div></div></div>`;
}

// Solve the projective map for all four corners, including the angled TV in the
// room. A rotation plus a trapezoid clip cannot align its text or its scanlines.
export function projectiveMatrix(width,height,corners) {
  const from=[[0,0],[width,0],[width,height],[0,height]];
  const rows=[];
  from.forEach(([x,y],i)=>{
    const [u,v]=corners[i];
    rows.push([x,y,1,0,0,0,-u*x,-u*y,u]);
    rows.push([0,0,0,x,y,1,-v*x,-v*y,v]);
  });
  for(let col=0;col<8;col++) {
    let pivot=col;
    for(let row=col+1;row<8;row++) if(Math.abs(rows[row][col])>Math.abs(rows[pivot][col]))pivot=row;
    [rows[col],rows[pivot]]=[rows[pivot],rows[col]];
    const divisor=rows[col][col];
    if(Math.abs(divisor)<1e-12)throw new Error('Degenerate screen geometry');
    for(let i=col;i<9;i++)rows[col][i]/=divisor;
    for(let row=0;row<8;row++)if(row!==col){
      const factor=rows[row][col];
      for(let i=col;i<9;i++)rows[row][i]-=factor*rows[col][i];
    }
  }
  const [a,b,c,d,e,f,g,h]=rows.map(row=>row[8]);
  return [a,d,0,g,b,e,0,h,0,0,1,0,c,f,0,1];
}

export function installScreenGeometry(plane) {
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.classList.add('screen-clip-definitions');
  svg.setAttribute('aria-hidden','true');
  svg.innerHTML='<defs>'+Object.entries(screenGeometry).map(([kind,s])=>
    `<clipPath id="${kind}-glass" clipPathUnits="objectBoundingBox"><path d="${normalizedPath(s.outline,s.bounds)}"/></clipPath>`
  ).join('')+roomScreens.map(s=>
    `<clipPath id="${s.mask}" clipPathUnits="objectBoundingBox"><path d="${normalizedPath(s.outline,[0,0,photo.width,photo.height])}"/></clipPath>`
  ).join('')+'</defs>';
  document.body.prepend(svg);
  const fit=()=>{
    const sx=plane.clientWidth/photo.width, sy=plane.clientHeight/photo.height;
    for(const s of roomScreens){
      const element=plane.querySelector(s.selector);
      const corners=s.corners.map(([x,y])=>[x*sx,y*sy]);
      element.style.transform=`matrix3d(${projectiveMatrix(400,300,corners).join(',')})`;
      element.parentElement.style.clipPath=`url(#${s.mask})`;
    }
    plane.classList.add('screens-fitted');
  };
  new ResizeObserver(fit).observe(plane);
  fit();
}
