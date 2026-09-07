import {campaignCopy,productCopy} from './editorial.js?v=4';
import {campaigns as originalCampaigns, products as originalProducts} from './data.js';
import {productDetails} from './product-details.js';
import {openSource} from './open-source.js';

const nextCurrencyProduct={
  name:'NextCurrency',brand:'NextCurrency',title:'NextCurrency',
  summary:'A production stablecoin research and publishing platform combining daily news, market intelligence, permanent reference pages, public data access and an MCP server.',
  problem:'Stablecoin information is fragmented across news, issuers, regulators, payment companies and market datasets. NextCurrency turns that fragmented market into a navigable research product and a continuous publishing system.',
  commercial:'The publication earns sponsorship revenue and also acts as an owned demand-generation system, connecting relevant readers and companies to target accounts and CRM attribution.',
  state:'Production',status:'Production',source:'https://nextcurrency.news',url:'https://nextcurrency.news',logo:'nextcurrency-logo',image:'nextcurrency-market',demo:null
};

export const products=[...originalProducts.map(p=>({...p,collection:'Products',...productDetails[p.id]})),...openSource]
  .map(p=>({...p,...productCopy[p.id],...(p.id==='effex-product'?nextCurrencyProduct:{})}));
const order=['4sight','effex-product','esportz','lamuse','savills-os','yours','blueballs','pocket-t','docshare','buzz'];
products.sort((a,b)=>(order.includes(a.id)?order.indexOf(a.id):99)-(order.includes(b.id)?order.indexOf(b.id):99));

const nextCurrencyCampaign={
  brand:'NextCurrency',title:'Building a stablecoin intelligence and publishing engine',category:'Growth & launches',tag:'AI publishing, market intelligence & pipeline generation',color:'#0f766e',logo:'nextcurrency-logo',
  image:'nextcurrency-news',hero:'nextcurrency-news',gallery:['nextcurrency-news','nextcurrency-market','nextcurrency-peg-map','nextcurrency-directory','nextcurrency-fx','nextcurrency-knowledge'],
  summary:'Built NextCurrency as a stablecoin news, research and market-intelligence product that also acts as a commercial acquisition engine for Sera.',
  brief:'Create a credible trade publication and data product for stablecoins that can monitor the market, publish quickly, build repeat readership and turn relevant companies into scored commercial opportunities.',
  audience:'Stablecoin issuers, banks, payment companies, PSPs, wallets, investors, regulators and infrastructure teams.',
  role:'Product specification, information architecture, editorial system, market intelligence, AI agent architecture, publishing workflow, audience growth, lead scoring, CRM handoff and commercialisation.',
  strategy:'Use market coverage and permanent reference pages to earn attention from the exact companies Sera wants to reach, then connect readership and company activity to scoring, attribution and CRM.',
  channels:['nextcurrency.news','X','Instagram','Research','Market data','CRM'],
  execution:[['Publishing system','Monitoring agents track issuers, regulators, banks and payment networks; research and drafting agents turn that activity into daily coverage against a defined house style.'],['Market intelligence','The product includes stablecoin profiles, market data, grading, indices, currency and corridor views, research and machine-readable access.'],['Commercial handoff','Readers and covered companies are matched against Sera’s target-account map and passed into CRM with scoring and first-touch attribution.']],
  metrics:[['500+','Stablecoins graded'],['5 figures','Monthly sponsorship revenue']],metricNote:'Current NextCurrency product and commercial outcomes supplied in the portfolio source material.',
  commercial:'Media sponsorship plus an owned acquisition and intelligence channel for Sera’s issuer, bank and PSP pipeline.',measurement:['Qualified readership','Issuer and PSP SQLs','Sponsorship revenue','Search visibility','CRM attribution']
};

const changes={
 lego:{color:'#0052c9',image:'lego-sculpture',hero:'lego-sculpture',gallery:[],logo:'lego-logo',art:'lego',budget:['US$300K–800K','Modelled Aier workstream scope'],budgetNote:'Planning range in the supplied portfolio; not a verified spend total.'},
 revolut:{color:'#2256f2',image:'revolut-metal',hero:'revolut-metal',gallery:[],logo:'revolut-logo',art:'revolut',budget:['€400K–1.2M','Modelled Aier workstream scope'],budgetNote:'Planning range in the supplied portfolio; not a verified spend total.'},
 bosch:{logo:'bosch-logo',color:'#e32636',budget:['€300K–700K','Modelled Aier workstream scope'],budgetNote:'Planning range in the supplied portfolio; not a verified spend total.'},
 tiger:{logo:'tiger-logo',budget:['RM600K–1.5M','Modelled Aier workstream scope'],budgetNote:'Planning range in the supplied portfolio; not a verified spend total.'},
 veve:{logo:'veve-logo'},
 jedstar:{image:'jedstar-cover',hero:'jedstar-cover'},
 cbre:{logo:'cbre-logo',image:'cbre-cover',hero:'cbre-cover'},
 sera:{image:'sera-cover',hero:'sera-cover',metrics:[['40+','Stablecoins supported'],['59+','Issuer pipeline']],metricNote:'Product coverage and issuer pipeline supplied in the portfolio; pipeline is not the number of completed integrations.'},
 aier:{image:'aier-cover',hero:'aier-cover',metrics:[['US$1.2M','ARR built'],['US$1M+','Paid acquisition managed'],['25','Team members'],['30+','Markets']]},
 effex:nextCurrencyCampaign,
 cult:{metrics:[['US$150M','Reported market cap · under 2 months']],metricNote:'Historical ecosystem valuation supplied in the portfolio; not agency revenue or a solely attributed result.'},
 immortal:{metrics:[['~50K','Registered players'],['US$15.5M','Company funding']],metricNote:'Company-scale outcomes recorded in the supplied portfolio; funding is not revenue attributed to a campaign.'}
};
export const campaigns=originalCampaigns.map(p=>({...p,...changes[p.id],...(p.id==='effex'?{}:campaignCopy[p.id])}));
