const products = [
  {
    id:"savills-os",
    name:"Savills OS",
    kind:"Commercial brokerage",
    short:"Research, relationships, property work, CRM and transactions in one brokerage workspace.",
    accent:"#c72636",
    ink:"#221d19",
    paper:"#f3efe7",
    views:[
      {title:"Today",label:"Command centre",type:"dashboard",note:"Priorities, meetings, enquiries and deal movement for one working day.",metrics:[["7","priority actions"],["3","client meetings"],["6","new enquiries"],["S$1.8M","weighted fees"]],bars:[["Pipeline",78],["Client work",64],["Content",42],["Approvals",31]],rows:[["09:00","Marina Crest landlord review","Owner: Sarah Ng"],["11:30","Veridian Cloud requirement","18–24k sq ft"],["14:00","Raffles Place viewing","3 buildings"],["16:30","Deck approval","Straits Anchor REIT"]]},
      {title:"Intelligence",label:"Emerging demand",type:"signals",note:"Source-backed account signals become owned broker actions, not automatic outreach.",metrics:[["30","prospects"],["6","act now"],["11","warm"],["13","watch"]],rows:[["AtlasPay","Act now","Funding + hiring + ACRA + COO move"],["Veridian Cloud","Act now","18–24k sq ft requirement hypothesis"],["Northstar Labs","Warm","New Singapore entity + hiring"],["Morrow Health","Watch","Regional expansion signal"]]},
      {title:"Property 360",label:"Landlord & building",type:"property",note:"Property, landlord, availability, relationship history and active work share one record.",metrics:[["38","floors"],["92%","occupied"],["4","active requirements"],["S$14.20","asking / psf"]],facts:[["Owner","Straits Anchor REIT"],["Leasing lead","Wei Ling Tan"],["Next expiry","18,400 sq ft · Q1 2027"],["Open mandate","Levels 38–39"]],rows:[["L38","9,800 sq ft","Fitted","Veridian shortlist"],["L39","10,200 sq ft","Fitted","Available"],["L41","18,400 sq ft","Bare","Q1 2027"]]},
      {title:"Requirement Lens",label:"Occupier matching",type:"compare",note:"A confirmed brief is matched against inventory with the reasons visible.",metrics:[["22,000","target sq ft"],["120","people"],["Q1 2027","move date"],["3","shortlist"]],compare:[["Marina Crest","92","S$13.80","MRT 3 min","2 contiguous floors"],["One Raffles Place","86","S$14.60","MRT 2 min","single floor"],["Asia Square 1","81","S$15.10","MRT 5 min","premium fit-out"]]},
      {title:"Opportunity CRM",label:"Account & deal",type:"crm",note:"Relationship context stays attached from first signal through enquiry and transaction.",metrics:[["S$420k","expected fee"],["70%","probability"],["12","activities"],["4","stakeholders"]],facts:[["Account","Veridian Cloud"],["Stage","Shortlist"],["Lead broker","Michelle Tan"],["Next step","CFO review · Friday"]],rows:[["Aisha Rahman","COO","Decision maker"],["Darren Koh","CFO","Economic buyer"],["Wei Ling Tan","Landlord lead","Warm route"],["Michelle Tan","Tenant rep","Owner"]]},
      {title:"Visibility & Growth",label:"Demand generation",type:"bars",note:"Search demand, answer ownership and commissioned content connect to measurable enquiries.",metrics:[["17","opportunities"],["5","commissioned"],["8","owned answers"],["6","qualified enquiries"]],bars:[["Office rental rates",96],["Fit-out cost calculator",88],["Raffles Place offices",79],["Lease vs flex",71],["Workplace density",62]],rows:[["Office rental rates","Build calculator","Adrian"],["Fit-out cost","Update guide + tool","Research"],["Raffles Place","Expert page + inventory","Leasing"]]},
      {title:"PropViz Studio",label:"Property media",type:"studio",note:"Plans, source imagery, concepts, rights and approvals stay tied to the property record.",metrics:[["12","source assets"],["4","concepts"],["2","approved"],["1","client deck"]],facts:[["Property","Marina Crest · L38"],["Source plan","Rev 07 · landlord supplied"],["Rights","Internal + client presentation"],["Approval","Wei Ling · 16:42"]]},
      {title:"Deal Room",label:"Transaction workflow",type:"timeline",note:"One account context moves from requirement to viewing, proposal, negotiation and close.",metrics:[["46","days active"],["3","viewings"],["2","offers"],["1","preferred"]],timeline:[["12 Aug","Requirement confirmed"],["18 Aug","Three-building shortlist"],["27 Aug","Viewing feedback captured"],["03 Sep","Landlord proposal received"],["11 Sep","Commercial terms revised"],["18 Sep","Heads of terms agreed"]]}
    ]
  },
  {
    id:"spotnook",
    name:"Spotnook",
    kind:"Property discovery",
    short:"A map-first commercial-property search and decision workspace for occupiers.",
    accent:"#2f64ff",
    ink:"#13213a",
    paper:"#f6f8ff",
    views:[
      {title:"Discovery",label:"Map + Nook",type:"map",note:"Describe the requirement once, then explore the same decision through map, list and conversation.",metrics:[["45","people"],["CBD","preferred"],["S$25k","monthly budget"],["49,605","market observations"]],pins:["Raffles Place","Tanjong Pagar","Marina Bay","Suntec"],rows:[["One Raffles Place","92","4 source offers"],["Capital Tower","88","7 source offers"],["Ocean Financial Centre","84","5 source offers"],["Republic Plaza","80","3 source offers"]]},
      {title:"Business Brief",label:"Requirement",type:"brief",note:"Headcount, attendance, growth, location, budget and timing remain editable throughout the search.",metrics:[["45","headcount"],["3.2","office days"],["12%","growth"],["Jan 2027","move-in"]],facts:[["Location","CBD · east fringe acceptable"],["Workspace","Client-facing + project rooms"],["Term","3–5 years"],["Budget","S$25k / month"],["Priority","Transit + contiguous floor"]]},
      {title:"Building Intelligence",label:"One Raffles Place",type:"building",note:"Building activity, asking evidence, area distribution, agents, transit and evidence coverage in one workspace.",metrics:[["104","source offers"],["S$14.30","median ask"],["87%","evidence coverage"],["2 min","MRT"]],bars:[["Asking evidence",82],["Area coverage",91],["Contact coverage",74],["Media coverage",68]],facts:[["Building","One Raffles Place"],["Submarket","Raffles Place"],["Observed agents","18"],["Brokerages","7"]]},
      {title:"Source Offers",label:"Listings & history",type:"table",note:"Advertisements remain source observations; histories and evidence sit below the building record.",metrics:[["104","observations"],["31","listing histories"],["18","agents"],["7","sources"]],rows:[["L24 · 8,100 sf","S$14.20","PropNex","Seen 2d ago"],["L31 · 12,600 sf","S$14.80","CBRE","Seen 4d ago"],["L36 · 9,400 sf","S$13.90","ERA","Seen 1d ago"],["L42 · 18,200 sf","Ask","JLL","Seen 6d ago"]]},
      {title:"Agent Network",label:"People & brokerages",type:"people",note:"Published agent and brokerage identity sits beside the offers each person is observed marketing.",metrics:[["18","agents"],["7","brokerages"],["31","listing histories"],["76%","contact coverage"]],rows:[["Rachel Lim","PropNex","9 offers","CEA verified"],["Daniel Ong","ERA","6 offers","Profile linked"],["Marcus Lee","CBRE","5 offers","Broker bio"],["Alicia Tan","JLL","4 offers","Profile linked"]]},
      {title:"Compare",label:"Buildings",type:"compare",note:"Alternatives are compared on economics, access, evidence and open questions.",metrics:[["3","buildings"],["5 yr","lease case"],["S$4.9M","lowest NPV"],["2","open checks"]],compare:[["One Raffles Place","92","S$14.30","MRT 2m","Evidence 87%"],["Capital Tower","88","S$13.70","MRT 4m","Evidence 81%"],["Ocean Financial","84","S$15.00","MRT 3m","Evidence 79%"]]},
      {title:"Lease vs Flex",label:"Occupancy economics",type:"underwrite",note:"Monthly, full-term and per-person costs use explicit assumptions instead of hidden thresholds.",metrics:[["S$23.8k","lease / month"],["S$27.4k","flex / month"],["S$635","lease / person"],["S$731","flex / person"]],facts:[["Term","5 years"],["Deposit","3 months"],["Rent free","2 months"],["Fit-out","S$420k"],["Escalation","3% / yr"]],bars:[["Lease NPV",72],["Flex NPV",84],["Upfront cash",58],["Flexibility",94]]},
      {title:"Decision Memory",label:"Shortlist & enquiry",type:"timeline",note:"Shortlisted offers, saved scenarios and unresolved checks survive view changes and reloads.",metrics:[["4","saved findings"],["2","cost scenarios"],["3","open checks"],["1","draft enquiry"]],timeline:[["Today","Kept One Raffles Place · L24"],["Today","Saved five-year lease scenario"],["Today","Flagged after-hours AC as unknown"],["Yesterday","Compared Capital Tower"],["Yesterday","Prepared enquiry · unsent"]]}
    ]
  },
  {
    id:"atlas",
    name:"ATLAS",
    kind:"Workplace transformation",
    short:"A deterministic workplace planning system with scenario, spatial and capital workbenches.",
    accent:"#0b8f79",
    ink:"#0f2723",
    paper:"#eef7f4",
    views:[
      {title:"Portfolio Command",label:"Engagements",type:"portfolio",note:"Every engagement shows stage, utilisation, confidence and the current recommendation.",metrics:[["4","engagements"],["1","active run"],["1","approval"],["1","reconciliation"]],rows:[["Northgate","3 → 2 sites","71% peak","Run 07"],["Halvorsen","HQ redesign","78% peak","Approval"],["Cascadia","4 → 3 sites","44% mean","Needs evidence"],["Veritas","2 → 1 site","83% peak","Reconcile"]]},
      {title:"Engagement",label:"Decision lifecycle",type:"lifecycle",note:"One record moves from frame and baseline through options, case, delivery, decision and performance.",metrics:[["4,280","people"],["61,400 m²","current estate"],["3 → 2","sites"],["67","recommendation confidence"]],timeline:[["1","Frame"],["2","Baseline"],["3","Options"],["4","Case"],["5","Delivery"],["6","Decision"],["7","Performance"]]},
      {title:"Buildings & Stack",label:"Singapore shortlist",type:"map",note:"Candidate buildings, lease assumptions, floor stacks and market context sit in one workbench.",metrics:[["4","candidates"],["55k","rsf / floor"],["S$78","model ask"],["1.12","load factor"]],pins:["Meridian One","Harbor Yards","Foundry Block","Cedar Exchange"],rows:[["Meridian One","55,000 rsf","12 floors"],["Harbor Yards","46,000 rsf","14 floors"],["Foundry Block","40,000 rsf","10 floors"],["Cedar Exchange","32,000 rsf","8 floors"]]},
      {title:"Scenario Engine",label:"Options",type:"compare",note:"Two to four scenarios run through the same sizing engine before one is selected.",metrics:[["4","options"],["2,568","expected daily"],["0.62","seats / person"],["18%","area reduction"]],compare:[["A · Hold","61.4k m²","3 sites","Baseline"],["B · Consolidate","50.2k m²","2 sites","Preferred"],["C · Hub + flex","46.8k m²","2 + flex","Higher flexibility"]]},
      {title:"Layout Planner",label:"2D test-fit",type:"floor",note:"Zones, teams, seats and sharing are edited on the floor plate and rechecked by the capacity engine.",metrics:[["388","seats"],["52","rooms"],["9","neighbourhoods"],["84,200","sq ft"]],zones:[["Focus","28%"],["Collaboration","24%"],["Meet","18%"],["Social","14%"],["Support","10%"],["Circulation","6%"]]},
      {title:"Spatial Review",label:"3D",type:"three",note:"The 3D view reads the same selected layout and revision as the 2D workbench.",metrics:[["1","layout revision"],["9","zones"],["4","team anchors"],["0","geometry drift"]],facts:[["Floor","Meridian One · L09"],["Plan revision","SP-014"],["Published","18 Sep · 14:32"],["Geometry","Controlled demo"]]},
      {title:"Portfolio & Capital",label:"CRE economics",type:"capital",note:"Site consolidation, cost per seat, lease decisions and move sequencing are reviewed together.",metrics:[["10 → 7","sites"],["S$-7.3M","portfolio NPV"],["3","handbacks"],["4","live cases"]],rows:[["Northgate","3 → 2","S$-18.4M","Consolidate"],["Halvorsen","1 → 1","S$6.2M","Redesign"],["Cascadia","4 → 3","—","Collect evidence"],["Veritas","2 → 1","S$4.9M","Consolidate"]]},
      {title:"Experience",label:"People + space",type:"dashboard",note:"Measured utilisation, density and workplace intent feed the experience and amenity case.",metrics:[["71%","peak utilisation"],["48%","mean utilisation"],["4,280","population"],["67","recommendation confidence"]],bars:[["Focus support",84],["Collaboration",76],["Amenity fit",68],["Change readiness",61]],facts:[["Archetype","The Connected"],["Office days","3"],["Collaboration","Most"],["Basis","Illustrative scenario"]]}
    ]
  },
  {
    id:"property-intelligence",
    name:"Property Intelligence",
    kind:"Investment & asset management",
    short:"Acquisition, underwriting, asset plans, refinancing, portfolio and LP reporting.",
    accent:"#b58a45",
    ink:"#183027",
    paper:"#f4f1e8",
    views:[
      {title:"Investment Dashboard",label:"Portfolio",type:"portfolio",note:"Acquisitions, capital deployment, portfolio returns and asset plans share one investment view.",metrics:[["S$128M","portfolio value"],["S$42M","equity deployed"],["16.8%","gross IRR"],["1.72x","MOIC"]],rows:[["Keong Saik 42","S$28.4M","17.6% IRR","Reposition"],["Stanley 18–22","S$41.2M","15.9% IRR","Stabilise"],["Duxton 71","S$19.8M","18.8% IRR","Underwrite"],["Neil Road 9","S$38.6M","14.7% IRR","Refinance"]]},
      {title:"Acquisition Screening",label:"Deal pipeline",type:"table",note:"Incoming assets are ranked on price, entry yield, CapEx, upside and fit with the strategy.",metrics:[["14","active deals"],["S$214M","gross pipeline"],["4","IC review"],["2","exclusivity"]],rows:[["Duxton 71","S$19.8M","4.2%","18.8% IRR"],["Telok Ayer 96","S$31.5M","3.8%","16.9% IRR"],["Amoy 128","S$24.1M","4.0%","15.7% IRR"],["Tanjong Pagar 54","S$36.8M","3.6%","14.9% IRR"]]},
      {title:"Underwriting",label:"Deal model",type:"underwrite",note:"Purchase price, debt, CapEx, NOI, exit and hold assumptions update the investment case.",metrics:[["17.6%","levered IRR"],["1.90x","equity multiple"],["62%","LTV"],["1.58x","DSCR"]],facts:[["Purchase price","S$19.8M"],["CapEx","S$2.6M"],["Entry yield","4.2%"],["Exit cap","4.0%"],["Hold","5 years"]],bars:[["Equity",38],["Senior debt",62],["Year 1 NOI",54],["Stabilised NOI",76]]},
      {title:"Sensitivity",label:"Risk",type:"heatmap",note:"Exit cap and NOI changes show the return range before the case reaches investment committee.",metrics:[["12.1%","downside IRR"],["17.6%","base IRR"],["22.4%","upside IRR"],["8.9%","stress IRR"]],matrix:[[22.4,20.8,19.1,17.4],[20.1,18.7,17.6,15.9],[17.9,16.4,14.8,13.2],[14.7,13.1,11.5,8.9]]},
      {title:"Asset Business Plan",label:"Repositioning",type:"timeline",note:"Lease events, refurbishment, CapEx and NOI milestones are managed against the asset plan.",metrics:[["S$2.6M","CapEx"],["14 mo","programme"],["92%","stabilised occupancy"],["S$1.42M","stabilised NOI"]],timeline:[["Q4 2026","Vacant possession + surveys"],["Q1 2027","Conservation + authority approvals"],["Q2 2027","Core refurbishment"],["Q3 2027","Ground-floor F&B handover"],["Q4 2027","Office leasing complete"],["Q1 2028","Stabilised refinance"]]},
      {title:"Refinance",label:"Capital recycling",type:"flow",note:"The flywheel shows what is acquired, improved, refinanced and returned for the next acquisition.",metrics:[["S$6.8M","equity invested"],["S$11.4M","new debt"],["S$3.2M","equity released"],["47%","capital recycled"]],flow:["Acquire","Reposition","Stabilise","Refinance","Recycle + scale"]},
      {title:"Fund & LP",label:"Reporting",type:"dashboard",note:"Capital calls, deployment, distributions and property-level performance roll into the fund view.",metrics:[["S$80M","committed"],["S$51M","deployed"],["S$7.4M","distributed"],["1.36x","net TVPI"]],bars:[["Deployed",64],["Reserved CapEx",14],["Available",22],["Called capital",71]],rows:[["Atlas Family Office","S$12M","S$8.4M called"],["Northbank Partners","S$10M","S$7.1M called"],["Orchid Trust","S$8M","S$5.7M called"]]},
      {title:"Portfolio Strategy",label:"Allocation",type:"compare",note:"Asset type, risk, yield, operating intensity and capital needs can be reviewed side by side.",metrics:[["4","asset models"],["6.1%","stabilised yield"],["S$12.8M","planned CapEx"],["3","district clusters"]],compare:[["Traditional lease","6.1%","Medium CapEx","Low ops"],["Flex office","8.4%","High CapEx","High ops"],["F&B + office","7.6%","Medium CapEx","Medium ops"]]}
    ]
  },
  {
    id:"operation-re",
    name:"OPERATION-RE",
    kind:"Property intelligence infrastructure",
    short:"Canonical property identity, evidence, history, market state, geometry and provenance.",
    accent:"#d56a3a",
    ink:"#202624",
    paper:"#f1f2ed",
    views:[
      {title:"Canonical Property",label:"Identity",type:"record",note:"Source observations resolve to a persistent development → building → floor → space hierarchy.",metrics:[["229","canonical buildings"],["348","floors"],["2,187","source-building links"],["59","reviewed floorplate jobs"]],facts:[["Development","One Raffles Place"],["Building ID","OPRE-BLD-202F0D75FED223A9"],["Address","1 Raffles Place · Singapore"],["Knowledge state","Confirmed building identity"],["Geometry grade","B · massing"]]},
      {title:"Source Lineage",label:"Evidence",type:"graph",note:"Every material claim can be traced to the source observation and review decision behind it.",metrics:[["7","market source families"],["104","observations"],["31","listing histories"],["87%","evidence coverage"]],nodes:["Commercial portal","Broker listing","Landlord page","Raw snapshot","Normalised observation","Building claim","Public packet"]},
      {title:"Availability History",label:"Time",type:"timeline",note:"First seen, price changes, agents and stale states are history; they do not overwrite each other.",metrics:[["31","histories"],["6","price changes"],["4","agent changes"],["3","stale"]],timeline:[["02 Jul","Offer first observed · L24"],["19 Jul","Ask S$14.60 → S$14.20"],["03 Aug","Agent changed · same source history"],["28 Aug","New media observed"],["14 Sep","Last positive observation"]]},
      {title:"Ownership & Occupancy",label:"Relationships",type:"graph",note:"Owner, manager, registered address, operating location, occupier and lease remain separate relationship types.",metrics:[["1","owner"],["1","manager"],["18","occupier observations"],["6","lease events"]],nodes:["Property owner","Asset manager","Building","Registered address","Operating location","Occupier","Lease evidence"]},
      {title:"Market Evidence",label:"Pricing",type:"bars",note:"Asking evidence, achieved evidence and modelled market range are kept distinct.",metrics:[["S$14.30","median asking"],["S$13.70","achieved evidence"],["S$13.6–14.1","market range"],["S$13.8","clearing midpoint"]],bars:[["Asking evidence",86],["Achieved comps",68],["Street context",74],["Model confidence",71]],rows:[["L24 ask","S$14.20","Observed"],["Comparable 01","S$13.60","Achieved"],["Comparable 02","S$13.80","Achieved"]]},
      {title:"Geometry & Twin",label:"Spatial evidence",type:"three",note:"Geometry carries source, accuracy, rights and grade before it can drive spatial decisions.",metrics:[["B","geometry grade"],["38","floors observed"],["4","plan sources"],["2","rights cleared"]],facts:[["Massing","Authoritative footprint + modelled height"],["Floorplate","Typical plan · source bound"],["Unit geometry","Unknown"],["Interior BIM","Not admitted"]]},
      {title:"Coverage",label:"Data quality",type:"coverage",note:"Completeness, source health, conflicts and review queues are operating metrics, not hidden exceptions.",metrics:[["49,605","market observations"],["4,928","agent records"],["37,608","usable prices"],["9,801","with photos"]],bars:[["Identity",94],["Market",82],["Contacts",65],["Media",53],["Ownership",41],["Geometry",28]],rows:[["Confirmed building links","207","Good"],["Proposed links","207","Review"],["Ambiguous links","44","Blocked"],["Unmatched","1,729","Open"]]}
    ]
  }
];

let state={product:null,slide:0,view:null,keyboard:false};

const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const productById=id=>products.find(p=>p.id===id);
const pct=n=>Math.max(4,Math.min(100,Number(n)||0));

function metricGrid(items){
  return '<div class="re-ui-metrics">'+items.map(x=>'<div><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></div>').join('')+'</div>';
}
function bars(items){
  return '<div class="re-ui-bars">'+items.map(x=>'<div><span>'+esc(x[0])+'</span><i><em style="width:'+pct(x[1])+'%"></em></i><b>'+esc(x[1])+'%</b></div>').join('')+'</div>';
}
function table(rows){
  return '<div class="re-ui-table">'+rows.map((r,i)=>'<div class="re-ui-row"><span class="re-ui-row-num">'+String(i+1).padStart(2,'0')+'</span>'+r.map((c,j)=>'<span class="'+(j===0?'primary':'')+'">'+esc(c)+'</span>').join('')+'</div>').join('')+'</div>';
}
function facts(items){
  return '<div class="re-ui-facts">'+items.map(x=>'<div><span>'+esc(x[0])+'</span><b>'+esc(x[1])+'</b></div>').join('')+'</div>';
}
function miniLine(){
  return '<svg class="re-ui-line" viewBox="0 0 360 120" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".24"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><path d="M0 95 C35 90 48 62 80 70 S130 98 158 63 S208 37 232 49 S276 76 304 42 S338 28 360 17 L360 120 L0 120Z" fill="url(#g)"/><path d="M0 95 C35 90 48 62 80 70 S130 98 158 63 S208 37 232 49 S276 76 304 42 S338 28 360 17" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
}
function mapUI(slide){
  const pins=(slide.pins||[]).map((p,i)=>'<button class="re-map-pin p'+(i+1)+'" aria-label="'+esc(p)+'"><i></i><span>'+esc(p)+'</span></button>').join('');
  return '<div class="re-ui-split re-map-layout"><section class="re-ui-panel re-ui-list"><p class="re-ui-label">SHORTLIST</p>'+table(slide.rows||[])+'</section><section class="re-ui-map"><div class="re-map-grid"></div>'+pins+'<div class="re-map-compass">N</div><div class="re-map-scale">1 km</div></section></div>';
}
function dashboardUI(slide){
  return '<div class="re-ui-dashboard"><section class="re-ui-panel re-chart-card"><div class="re-ui-panel-head"><span>PERFORMANCE</span><b>Last 12 weeks</b></div>'+miniLine()+'</section><section class="re-ui-panel">'+bars(slide.bars||[["Active",72],["Progress",56],["Review",34]])+'</section></div>'+(slide.rows?table(slide.rows):'')+(slide.facts?facts(slide.facts):'');
}
function compareUI(slide){
  return '<div class="re-compare-grid">'+(slide.compare||[]).map((x,i)=>'<article class="'+(i===1?'selected':'')+'"><span>OPTION '+String.fromCharCode(65+i)+'</span><h4>'+esc(x[0])+'</h4><strong>'+esc(x[1])+'</strong>'+x.slice(2).map(v=>'<p>'+esc(v)+'</p>').join('')+'<button type="button">'+(i===1?'Selected':'Review')+'</button></article>').join('')+'</div>';
}
function propertyUI(slide){
  return '<div class="re-ui-split"><section class="re-ui-panel re-property-hero"><div class="re-property-building"><i></i><i></i><i></i><i></i><i></i><i></i></div><div><p class="re-ui-label">SELECTED PROPERTY</p><h4>'+esc(slide.title)+'</h4><small>Commercial property record</small></div></section><section class="re-ui-panel">'+facts(slide.facts||[])+'</section></div>'+(slide.rows?table(slide.rows):'');
}
function signalsUI(slide){
  return '<div class="re-signal-list">'+(slide.rows||[]).map((r,i)=>'<article><div><span class="re-signal-dot s'+i+'"></span><h4>'+esc(r[0])+'</h4><small>'+esc(r[2])+'</small></div><b>'+esc(r[1])+'</b><button type="button">Open</button></article>').join('')+'</div>';
}
function crmUI(slide){
  return '<div class="re-ui-split"><section class="re-ui-panel"><p class="re-ui-label">ACCOUNT</p>'+facts(slide.facts||[])+'</section><section class="re-ui-panel re-pipeline"><p class="re-ui-label">PIPELINE</p><div class="re-pipeline-track"><i class="done"></i><i class="done"></i><i class="active"></i><i></i><i></i></div><div class="re-pipeline-labels"><span>Signal</span><span>Qualify</span><span>Shortlist</span><span>Offer</span><span>Close</span></div></section></div>'+table(slide.rows||[]);
}
function studioUI(slide){
  return '<div class="re-studio"><aside>'+facts(slide.facts||[])+'</aside><section><div class="re-plan-sheet"><div class="room r1"></div><div class="room r2"></div><div class="room r3"></div><div class="room r4"></div><div class="core"></div><span>PLAN · REV 07</span></div><div class="re-studio-thumbs"><i></i><i></i><i></i><i></i></div></section><aside class="re-approval"><span>APPROVAL</span><b>Approved</b><small>Client deck</small></aside></div>';
}
function timelineUI(slide){
  return '<div class="re-timeline">'+(slide.timeline||[]).map((x,i)=>'<div><i class="'+(i===0?'active':'')+'"></i><span>'+esc(x[0])+'</span><b>'+esc(x[1])+'</b></div>').join('')+'</div>';
}
function briefUI(slide){
  return '<div class="re-brief-grid">'+facts(slide.facts||[])+'<section class="re-ui-panel"><p class="re-ui-label">REQUIREMENT</p><div class="re-input-row"><label>People<input value="45" readonly></label><label>Office days<input value="3.2" readonly></label></div><label>Location<input value="CBD · east fringe acceptable" readonly></label><label>Move-in<input value="January 2027" readonly></label><button type="button" class="re-ui-primary">Update brief</button></section></div>';
}
function peopleUI(slide){
  return '<div class="re-people">'+(slide.rows||[]).map((r,i)=>'<article><div class="re-avatar">'+esc(r[0].split(' ').map(s=>s[0]).slice(0,2).join(''))+'</div><div><h4>'+esc(r[0])+'</h4><p>'+esc(r[1])+'</p><small>'+esc(r[2])+'</small></div><b>'+esc(r[3])+'</b></article>').join('')+'</div>';
}
function underwriteUI(slide){
  return '<div class="re-ui-split re-underwrite"><section class="re-ui-panel"><p class="re-ui-label">ASSUMPTIONS</p>'+facts(slide.facts||[])+'</section><section class="re-ui-panel"><p class="re-ui-label">OUTPUT</p>'+bars(slide.bars||[["Equity",38],["Debt",62],["NOI",74]])+'</section></div>';
}
function lifecycleUI(slide){
  return '<div class="re-lifecycle">'+(slide.timeline||[]).map((x,i)=>'<div class="'+(i<3?'done':i===3?'active':'')+'"><span>'+esc(x[0])+'</span><b>'+esc(x[1])+'</b></div>').join('')+'</div>';
}
function floorUI(slide){
  return '<div class="re-floor-wrap"><aside>'+bars((slide.zones||[]).map(x=>[x[0],parseInt(x[1],10)]))+'</aside><section class="re-floor"><div class="z focus">FOCUS</div><div class="z collab">COLLAB</div><div class="z meet">MEET</div><div class="z social">SOCIAL</div><div class="z support">SUPPORT</div><div class="core">CORE</div><span class="seat s1"></span><span class="seat s2"></span><span class="seat s3"></span><span class="seat s4"></span><span class="seat s5"></span></section></div>';
}
function threeUI(slide){
  return '<div class="re-3d-layout"><section class="re-model-stage"><div class="re-building-3d"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="re-model-ground"></span><div class="re-model-controls"><button>Orbit</button><button>Floor 09</button><button>Fit</button></div></section><aside class="re-ui-panel">'+facts(slide.facts||[])+'</aside></div>';
}
function capitalUI(slide){
  return '<div class="re-capital"><section class="re-ui-panel">'+table(slide.rows||[])+'</section><section class="re-ui-panel"><p class="re-ui-label">CAPITAL CASE</p>'+miniLine()+'<div class="re-waterfall"><i style="height:45%"></i><i style="height:68%"></i><i style="height:54%"></i><i style="height:82%"></i><i style="height:74%"></i></div></section></div>';
}
function heatmapUI(slide){
  const m=slide.matrix||[];
  return '<div class="re-heatmap"><div class="re-heat-axis">NOI →</div>'+m.map((row,r)=>row.map((v,c)=>'<div style="--heat:'+(Number(v)/25)+'"><b>'+esc(v)+'%</b><span>'+(r===0?'Upside':r===m.length-1?'Stress':'')+'</span></div>').join('')).join('')+'<div class="re-heat-y">EXIT CAP →</div></div>';
}
function flowUI(slide){
  return '<div class="re-flow">'+(slide.flow||[]).map((x,i)=>'<div><span>'+String(i+1).padStart(2,'0')+'</span><b>'+esc(x)+'</b></div>'+(i<(slide.flow||[]).length-1?'<i>→</i>':'')).join('')+'</div>';
}
function graphUI(slide){
  const nodes=slide.nodes||[];
  return '<div class="re-graph">'+nodes.map((x,i)=>'<div class="n n'+(i+1)+'"><i></i><b>'+esc(x)+'</b></div>').join('')+'<svg viewBox="0 0 800 360" preserveAspectRatio="none" aria-hidden="true"><path d="M80 80 L260 80 L400 180 L610 80 L740 180 M80 280 L260 280 L400 180 L610 280 L740 180" /></svg></div>';
}
function coverageUI(slide){
  return '<div class="re-ui-split"><section class="re-ui-panel">'+bars(slide.bars||[])+'</section><section class="re-ui-panel">'+table(slide.rows||[])+'</section></div>';
}
function recordUI(slide){
  return '<div class="re-record"><aside class="re-record-tree"><span>PLACE</span><b>Singapore</b><span>DEVELOPMENT</span><b>One Raffles Place</b><span>BUILDING</span><b class="active">Tower 1</b><span>FLOOR</span><b>38 floors</b><span>SPACE</span><b>Evidence required</b></aside><section class="re-ui-panel">'+facts(slide.facts||[])+'</section></div>';
}
function defaultUI(slide){
  return dashboardUI(slide);
}
function screenBody(slide){
  const map={dashboard:dashboardUI,signals:signalsUI,property:propertyUI,compare:compareUI,crm:crmUI,bars:dashboardUI,studio:studioUI,timeline:timelineUI,map:mapUI,brief:briefUI,building:propertyUI,table:s=>table(s.rows||[]),people:peopleUI,underwrite:underwriteUI,portfolio:s=>'<div class="re-ui-panel">'+table(s.rows||[])+'</div>',lifecycle:lifecycleUI,floor:floorUI,three:threeUI,capital:capitalUI,heatmap:heatmapUI,flow:flowUI,record:recordUI,graph:graphUI,coverage:coverageUI};
  return (map[slide.type]||defaultUI)(slide);
}
function screenShell(product,slide){
  return '<div class="re-software" style="--re-accent:'+product.accent+';--re-ink:'+product.ink+';--re-paper:'+product.paper+'"><header><div class="re-software-brand"><i></i><b>'+esc(product.name)+'</b></div><nav><span>Overview</span><span>Work</span><span>Data</span><span>Reports</span></nav><div class="re-software-user"><i>JG</i><span>Prototype</span></div></header><div class="re-software-body"><aside class="re-software-nav"><button class="active">01</button><button>02</button><button>03</button><button>04</button><button>05</button><span></span><button>?</button></aside><main><div class="re-ui-heading"><div><span>'+esc(slide.label)+'</span><h3>'+esc(slide.title)+'</h3></div><div class="re-ui-actions"><button>Export</button><button class="primary">Review</button></div></div>'+metricGrid(slide.metrics||[])+screenBody(slide)+'</main></div></div>';
}
function productCard(p,i){
  const s=p.views[0];
  return '<a class="re-system-card re-theme-'+esc(p.id)+'" href="#real-estate/'+esc(p.id)+'" style="--re-accent:'+p.accent+';--re-ink:'+p.ink+';--re-paper:'+p.paper+'"><div class="re-system-preview">'+screenShell(p,s)+'</div><div class="re-system-copy"><span>'+String(i+1).padStart(2,'0')+' · '+esc(p.kind)+'</span><h2>'+esc(p.name)+'</h2><p>'+esc(p.short)+'</p><b>'+String(p.views.length).padStart(2,'0')+' feature views <i>↗</i></b></div></a>';
}
function landing(backHtml){
  return '<article class="re-landing">'+backHtml+'<header class="re-landing-head"><p class="eyebrow">REAL ESTATE & PROPTECH</p><h1>Real estate systems.</h1><p>Brokerage, investment, workplace and property intelligence. The products below are prototypes and product R&D; the interface data is illustrative.</p><div class="re-career-line"><span>2013–16 · D’Perception</span><span>2016–21 · CBRE APAC</span><span>2021–now · Aier Studios</span></div></header><section class="re-system-grid">'+products.map(productCard).join('')+'</section><footer class="re-landing-foot"><div><span>13 years</span><b>Commercial real estate, workplace and technology</b></div><div><span>Selected work</span><b>Owners · investors · brokers · occupiers</b></div><a href="https://technical-cv.josh-gier.com/?ref=real-estate" target="_blank" rel="noopener">Technical CV ↗</a></footer></article>';
}
function productPage(p,backHtml){
  const slide=p.views[state.slide]||p.views[0];
  return '<article class="re-showcase" style="--re-accent:'+p.accent+';--re-ink:'+p.ink+';--re-paper:'+p.paper+'">'+backHtml+'<header class="re-product-head"><div><p class="eyebrow">'+esc(p.kind)+'</p><h1>'+esc(p.name)+'</h1><p>'+esc(p.short)+'</p></div><div class="re-prototype-note"><b>Prototype</b><span>Illustrative interface data</span></div></header><div class="re-stage-wrap"><div class="re-stage-toolbar"><div><span class="re-stage-count">'+String(state.slide+1).padStart(2,'0')+' / '+String(p.views.length).padStart(2,'0')+'</span><b>'+esc(slide.label)+'</b></div><div><button data-re-action="prev" aria-label="Previous feature">←</button><button data-re-action="next" aria-label="Next feature">→</button><button data-re-action="fullscreen">Full screen ↗</button></div></div><div class="re-stage" data-re-stage>'+screenShell(p,slide)+'</div></div><div class="re-feature-meta"><div><span>'+String(state.slide+1).padStart(2,'0')+'</span><h2>'+esc(slide.title)+'</h2></div><p>'+esc(slide.note)+'</p></div><nav class="re-thumbs" aria-label="'+esc(p.name)+' feature views">'+p.views.map((v,i)=>'<button data-re-slide="'+i+'" class="'+(i===state.slide?'active':'')+'" aria-pressed="'+(i===state.slide)+'"><span>'+String(i+1).padStart(2,'0')+'</span><b>'+esc(v.title)+'</b><small>'+esc(v.label)+'</small></button>').join('')+'</nav><footer class="re-product-footer"><a href="#real-estate">All real-estate systems</a><div>'+products.filter(x=>x.id!==p.id).slice(0,4).map(x=>'<a href="#real-estate/'+esc(x.id)+'">'+esc(x.name)+' ↗</a>').join('')+'</div></footer></article>';
}
function rerender(){
  if(!state.view||!state.product)return;
  const p=productById(state.product);
  if(!p)return;
  state.view.innerHTML=productPage(p,'<a class="back-link" href="#real-estate"><span>←</span> Real estate systems</a>');
  state.view.querySelector('h1')?.setAttribute('tabindex','-1');
}
function openFullscreen(p,slide){
  const d=document.createElement('dialog');
  d.className='re-fullscreen-dialog';
  d.innerHTML='<div class="re-fullscreen-top"><div><b>'+esc(p.name)+'</b><span>'+esc(slide.title)+' · Prototype / illustrative data</span></div><button type="button" data-re-dialog-close>Close ×</button></div><div class="re-fullscreen-stage">'+screenShell(p,slide)+'</div>';
  document.body.append(d);
  d.querySelector('[data-re-dialog-close]').onclick=()=>d.close();
  d.addEventListener('click',e=>{if(e.target===d)d.close();});
  d.addEventListener('close',()=>d.remove());
  d.showModal();
}
export function renderRealEstateShowcase(view,route){
  state.view=view;
  const parts=route.split('/');
  const p=parts.length>1?productById(parts[1]):null;
  if(!p){
    state.product=null;state.slide=0;
    view.innerHTML=landing('<a class="back-link" href="#room"><span>←</span> Back to the room</a>');
  }else{
    if(state.product!==p.id){state.product=p.id;state.slide=0;}
    view.innerHTML=productPage(p,'<a class="back-link" href="#real-estate"><span>←</span> Real estate systems</a>');
  }
  if(!state.keyboard){
    state.keyboard=true;
    document.addEventListener('keydown',e=>{
      if(document.body.dataset.view!=='real-estate'||!state.product||document.querySelector('dialog[open]'))return;
      const p=productById(state.product);if(!p)return;
      if(e.key==='ArrowRight'){state.slide=(state.slide+1)%p.views.length;rerender();}
      if(e.key==='ArrowLeft'){state.slide=(state.slide-1+p.views.length)%p.views.length;rerender();}
    });
  }
}
export function handleRealEstateClick(e){
  const action=e.target.closest('[data-re-action]');
  const thumb=e.target.closest('[data-re-slide]');
  if(!action&&!thumb)return false;
  const p=productById(state.product);if(!p)return false;
  if(thumb){state.slide=Number(thumb.dataset.reSlide)||0;rerender();return true;}
  const a=action.dataset.reAction;
  if(a==='next'){state.slide=(state.slide+1)%p.views.length;rerender();return true;}
  if(a==='prev'){state.slide=(state.slide-1+p.views.length)%p.views.length;rerender();return true;}
  if(a==='fullscreen'){openFullscreen(p,p.views[state.slide]);return true;}
  return false;
}
