import {campaignCopy,productCopy} from './editorial.js?v=4';
import {campaigns as originalCampaigns, products as originalProducts} from './data.js';
import {productDetails} from './product-details.js';
import {openSource} from './open-source.js';
import {nextCurrencyCampaignOverride,nextCurrencyProductOverride} from './nextcurrency-overrides.js';
export const products=[...originalProducts.map(p=>({...p,collection:'Products',...productDetails[p.id]})),...openSource]
  .map(p=>({...p,...productCopy[p.id],...(p.id==='effex-product'?{...nextCurrencyProductOverride,name:'NextCurrency',brand:'NextCurrency',logo:'nextcurrency-logo',demo:'nextcurrency',url:'https://nextcurrency.news'}:{})}));
const order=['4sight','effex-product','esportz','lamuse','savills-os','yours','blueballs','pocket-t','docshare','buzz'];
products.sort((a,b)=>(order.includes(a.id)?order.indexOf(a.id):99)-(order.includes(b.id)?order.indexOf(b.id):99));
const changes={
 lego:{color:'#0052c9',image:'lego-sculpture',hero:'lego-sculpture',gallery:[],logo:'lego-logo',art:'lego',budget:['US$300K–800K','Modelled Aier workstream scope'],budgetNote:'Planning range in the supplied portfolio; not a verified spend total.'},
 revolut:{color:'#2256f2',image:'revolut-metal',hero:'revolut-metal',gallery:[],logo:'revolut-logo',art:'revolut',budget:['€400K–1.2M','Modelled Aier workstream scope'],budgetNote:'Planning range in the supplied portfolio; not a verified spend total.'},
 bosch:{logo:'bosch-logo',color:'#e32636',budget:['€300K–700K','Modelled Aier workstream scope'],budgetNote:'Planning range in the supplied portfolio; not a verified spend total.'},
 tiger:{logo:'tiger-logo',budget:['RM600K–1.5M','Modelled Aier workstream scope'],budgetNote:'Planning range in the supplied portfolio; not a verified spend total.'},
 veve:{logo:'veve-logo'},
 cbre:{logo:'cbre-logo'},
 cult:{metrics:[['US$150M','Reported market cap · under 2 months']],metricNote:'Historical ecosystem valuation supplied in the portfolio; not agency revenue or a solely attributed result.'},
 immortal:{metrics:[['~50K','Registered players'],['US$15.5M','Company funding']],metricNote:'Company-scale outcomes recorded in the supplied portfolio; funding is not revenue attributed to a campaign.'},
 sera:{metrics:[['40+','Stablecoins supported'],['59+','Issuer pipeline']],metricNote:'Product coverage and issuer pipeline supplied in the portfolio; pipeline is not the number of completed integrations.'},
 effex:{...nextCurrencyCampaignOverride,brand:'NextCurrency',logo:'nextcurrency-logo'},
 aier:{metrics:[['US$1.2M','ARR built'],['US$1M+','Paid acquisition managed'],['25','Team members'],['30+','Markets']]}
};
export const campaigns=originalCampaigns.map(p=>({...p,...changes[p.id],...(p.id==='effex'?{}:campaignCopy[p.id])}));
