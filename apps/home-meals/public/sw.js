const CACHE='home-meals-v8';
const CORE=['/','/cook','/prep','/kitchen','/plan','/learn','/scan','/manifest.webmanifest','/icon.svg'];

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).catch(()=>undefined));
 self.skipWaiting();
});

self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE&&key.startsWith('home-meals-')).map(key=>caches.delete(key)))));
 self.clients.claim();
});

self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));return res}).catch(async()=>await caches.match(req)||await caches.match('/')||Response.error()));
  return;
 }
 if(req.destination==='image'){
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));return res}).catch(()=>hit)));
  return;
 }
 if(url.origin===self.location.origin&&(req.destination==='style'||req.destination==='script'||req.destination==='font')){
  event.respondWith(caches.match(req).then(hit=>{
   const fresh=fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));return res}).catch(()=>hit);
   return hit||fresh;
  }));
 }
});
