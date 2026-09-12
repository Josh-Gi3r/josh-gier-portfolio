const CACHE='home-meals-v11';
const IMAGE_CACHE='home-meals-images-v2';
const CORE=['/','/cook','/cook/builder','/prep','/prep/day','/prep/mids','/kitchen','/plan','/learn','/scan','/manifest.webmanifest','/icon.svg'];

async function trim(cacheName,maxEntries){
 const cache=await caches.open(cacheName);const keys=await cache.keys();
 if(keys.length<=maxEntries)return;
 await Promise.all(keys.slice(0,keys.length-maxEntries).map(key=>cache.delete(key)));
}

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).catch(()=>undefined));
});

self.addEventListener('message',event=>{
 if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE&&key!==IMAGE_CACHE&&key.startsWith('home-meals-')).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(req.mode==='navigate'){
  event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));return res}).catch(async()=>await caches.match(req)||await caches.match('/')||Response.error()));
  return;
 }
 if(req.destination==='image'){
  event.respondWith(caches.open(IMAGE_CACHE).then(async cache=>{const hit=await cache.match(req);if(hit)return hit;try{const res=await fetch(req);if(res.ok||res.type==='opaque'){cache.put(req,res.clone()).then(()=>trim(IMAGE_CACHE,100));}return res}catch{return hit||Response.error()}}));
  return;
 }
 if(url.origin===self.location.origin&&(req.destination==='style'||req.destination==='script'||req.destination==='font')){
  event.respondWith((async()=>{
   const hit=await caches.match(req);
   try{
    const res=await fetch(req,{cache:'no-store'});
    if(res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}
    return res;
   }catch{
    return hit||Response.error();
   }
  })());
 }
});
