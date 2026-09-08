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
  .map(p=>({...p,...productCopy[p.id],...productDetails[p.id],...(p.id==='effex-product'?nextCurrencyProduct:{})}));
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
  metrics:[['500+','Stablecoins graded'],['10K+','X followers from zero'],['1.2M','Top post views'],['5 figures','Monthly recurring sponsorship revenue']],
  commercial:'Media sponsorship plus an owned acquisition and intelligence channel for Sera’s issuer, bank and PSP pipeline.',measurement:['Qualified readership','Issuer and PSP SQLs','Sponsorship revenue','Search visibility','CRM attribution']
};

const changes={
 lego:{color:'#0052c9',image:'lego-sculpture',hero:'lego-sculpture',gallery:['lego-detail','lego-film','lego-gift','lego-hero','lego-interior','lego-journey','lego-oob','lego-social','lego-board'],logo:'lego-logo',art:'lego',
  budget:['US$800K','Creators, hero film distribution, ecommerce and localisation'],
  metrics:[['120M','Video views'],['45M','Completed views'],['1.2% → 2.2%','Ecommerce click-through'],['3x → 5x','Retargeted purchase ROAS']],
  credit:'Aier Studios owned creators, video distribution, localisation and the ecommerce journey as activation partner to the lead agency.'},
 revolut:{color:'#2256f2',image:'revolut-metal',hero:'revolut-metal',gallery:['revolut-creator','revolut-funnel','revolut-hero','revolut-journey','revolut-metro','revolut-payment','revolut-social','revolut-tiktok','revolut-board'],logo:'revolut-logo',art:'revolut',
  budget:['€1.2M','Paid social, creators, search and app store, measurement and production'],
  metrics:[['€35 → €20','Funded-account CAC'],['€6.50 → €3.50','Cost per install'],['35% → 50%','KYC to funded account'],['150M+','Impressions']],
  credit:'Aier Studios owned the French-market acquisition scope from creative through funded account, as AI-native activation partner to the lead agency.'},
 bosch:{logo:'bosch-logo',color:'#e32636',
  budget:['€700K','Participation platform, creator mechanics, paid social, CRM and operations'],
  metrics:[['12K','Qualified professional participants'],['8K','User-generated posts'],['€180 → €80','Cost per qualified participant'],['85%','CRM capture']],
  credit:'Aier Studios owned the participation platform, creator mechanics, paid distribution and CRM for the programme.'},
 tiger:{logo:'tiger-logo',
  budget:['RM1.5M','Campaign technology, social video, artists and creators, production and measurement'],
  metrics:[['250K','AR and QR interactions'],['25M','Social video views'],['80M','Impressions'],['RM5M','Earned media value']],
  credit:'Aier Studios owned campaign technology, social distribution and measurement for the lead agency’s integrated campaign.'},
 pif:{image:'pif-cover',hero:'pif-cover',gallery:['pif-arena','pif-briefing','pif-linkedin','pif-newsroom','pif-studio','pif-board'],
  budget:['US$500K','Narrative adaptation, paid LinkedIn, PR and newsroom, stakeholder briefing and reporting'],
  metrics:[['150M','People reached'],['700','Media placements'],['30M','Video views'],['400','Qualified industry enquiries']],
  credit:'Aier Studios owned narrative adaptation, paid and social distribution, newsroom operations and stakeholder follow-up for the institutional communications team.'},
 veve:{logo:'veve-logo',
  budget:['US$650K','Creators and drop content, app install campaigns, collector lifecycle and production'],
  metrics:[['350K','Active users · 2021'],['1.4M','Collectibles sold · 2021'],['US$8 → US$3','Activated-user acquisition cost']],
  credit:'Aier Studios owned GTM and social strategy, drop campaigns, creators, paid app acquisition and collector lifecycle for the platform’s licensed-IP releases.'},
 ygg:{image:'ygg-cover',hero:'ygg-cover',gallery:['ygg-creator','ygg-guild','ygg-markets','ygg-onboarding','ygg-tournament','ygg-board'],
  budget:['US$1.2M','Community operations, local creators, paid and regional events across four markets'],
  metrics:[['110K+','Community followers from zero'],['US$2–5','Cost per member'],['US$15M','Raised across two rounds'],['4','Southeast Asian markets']],
  credit:'Aier Studios was the embedded growth team, owning country positioning, local-language community operations, creators and the fundraise narrative.'},
 saitama:{image:'saitama-cover',hero:'saitama-cover',gallery:['saitama-clippers','saitama-holders','saitama-kol','saitama-spaces','saitama-board'],
  budget:['US$1.2M','Tiered KOL waves, clipping network, Telegram and Spaces operations, paid and production'],
  metrics:[['370K+','Token holders'],['US$6 → US$2','Holder acquisition cost'],['US$7.5B','Peak value'],['Top 40','Global position']],
  credit:'Aier Studios was the project’s growth agency, owning positioning, the KOL programme, the clipping network, Telegram and Spaces operations and PR.'},
 bubblemaps:{image:'bubblemaps-cover',hero:'bubblemaps-cover',gallery:['bubblemaps-analyst','bubblemaps-investigation','bubblemaps-launch','bubblemaps-mobile','bubblemaps-board'],
  budget:['US$500K','Category education, credibility seeding and launch operations'],
  metrics:[['10 sec','Target reached'],['202,990 BNB','Committed'],['13,500%','Oversubscribed'],['15.9x','TGE price']],
  credit:'Aier Studios owned category education, the pre-launch community, the KOL programme and launch communications for the BMT token generation event.'},
 jedstar:{image:'jedstar-cover',hero:'jedstar-cover',gallery:['jedstar-investor','jedstar-platform','jedstar-presale','jedstar-tokenomics','jedstar-board'],
  budget:['US$1.2M','Brand and product scope, KOL programme, community and paid, investor go-to-market'],
  metrics:[['50K+','Community members from zero'],['US$10–20','Acquisition cost per member'],['US$3M','Pre-seed raised'],['US$2M','KRED presale filled']],
  credit:'Aier Studios was engaged from inception and owned the brand, product proposition, community, presale and investor go-to-market.'},
 coliseum:{image:'coliseum-cover',hero:'coliseum-cover',gallery:['coliseum-community','coliseum-creator','coliseum-growth','coliseum-board'],
  budget:['US$1M+','Operating budget across Asia Pacific, Europe, the United States and Latin America'],
  metrics:[['200K','Active users from 4M members'],['US$1.20 → US$0.40','Member acquisition cost'],['90%','Onboarding friction removed'],['US$15M','Raised']]},
 cbre:{logo:'cbre-logo',image:'cbre-cover',hero:'cbre-cover',gallery:['cbre-pipeline','cbre-research','cbre-studio'],
  metrics:[['2 → 50+','Team growth'],['7','APAC markets'],['US$100M','Annual revenue line'],['US$1B','NTT transaction']]},
 sera:{image:'sera-cover',hero:'sera-cover',gallery:['sera-corridor','sera-desk','sera-treasury','sera-board'],
  metrics:[['30','Signed agreements in year one'],['70+','Issuer and counterparty relationships'],['15','Liquidity counterparties'],['US$6M','Institutional and investor funds committed']]},
 aier:{image:'aier-cover',hero:'aier-cover',gallery:['aier-production','aier-review','aier-team','aier-board'],
  metrics:[['US$1.2M','ARR built'],['US$9M+','Client campaign budgets managed'],['US$3M','Sold to Coliseum'],['30+','Markets']]},
 effex:nextCurrencyCampaign,
 cult:{image:'cult-cover',hero:'cult-cover',gallery:['cult-manifesto','cult-seeding','cult-spread','cult-board'],
  budget:['US$250K','Positioning and manifesto material, micro-KOL seeding and crypto media'],
  metrics:[['US$150M','Market capitalisation within two months'],['Fair launch','No venture round, no presale']],
  credit:'Aier Studios was the launch’s growth partner, owning positioning, the manifesto material, micro-KOL seeding and crypto media.'},
 immortal:{image:'immortal-cover',hero:'immortal-cover',gallery:['immortal-grandmaster','immortal-stream','immortal-token2049','immortal-tournament','immortal-board'],
  budget:['US$600K','Grandmaster and creator partnerships, tournament campaigns and community operations'],
  metrics:[['3M+','Community followers from zero'],['~50K','Registered players'],['US$25 → US$12','Registered-player acquisition cost'],['€15.7M','Seed and Series A raised']],
  credit:'Aier Studios was the client’s growth agency, owning positioning, grandmaster and creator partnerships, tournament campaigns and community operations.'}
};
export const campaigns=originalCampaigns.map(p=>({...p,...changes[p.id],...(p.id==='effex'?{}:campaignCopy[p.id])}));
