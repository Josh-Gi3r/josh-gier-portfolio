export function PortionScale(){
 const sizes=[
  {ml:30,label:"concentrate cube",use:"DARK · intense mids",w:34,h:34},
  {ml:60,label:"small portion",use:"SAMBAL · marinades",w:46,h:38},
  {ml:150,label:"mid puck",use:"laksa · rendang · kari",w:70,h:42},
  {ml:225,label:"mother puck",use:"GOLD · REMPAH",w:88,h:46},
  {ml:350,label:"sauce puck",use:"RED",w:108,h:50},
  {ml:500,label:"stock puck",use:"CLEAR",w:132,h:54},
 ];
 return <section className="hm-viz-card hm-portion-scale-v3"><header><div><span className="hm-viz-kicker">FREEZER LANGUAGE</span><h3>See the portion before you grab it.</h3></div><span>relative footprint</span></header><div className="hm-portion-scale-track">{sizes.map((x,i)=><article key={x.ml} style={{animationDelay:`${i*55}ms`} as React.CSSProperties}><div className="shape" style={{width:x.w,height:x.h}}><i/><b>{x.ml}</b></div><strong>{x.ml} ml</strong><span>{x.label}</span><small>{x.use}</small></article>)}</div><p>We do not force every component into the same mould. Concentrates stay small; bulky mothers and stocks freeze as labelled pucks.</p></section>
}
