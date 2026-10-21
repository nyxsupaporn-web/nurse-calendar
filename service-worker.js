const CACHE='nurse-calendar-static-v30-20261021-layout';
const ROOT=new URL('./',self.registration.scope);
const SCOPE_PATH=ROOT.pathname;
const files=['./','./index.html','./manifest.webmanifest','./medical-calendar.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./favicon-48.png','./login-logo-v30.jpg','./login-bg-top.jpg','./login-bg-bottom.jpg','./login-screen.css','./login-screen.js','./login-medical-decor.svg','./vendor/jszip.min.js','./roster-import.js','./roster.js','./holiday-data.js','./holiday-data.json','./cloud.js','./email-cloud.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(files.map(x=>new URL(x,ROOT).href))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('nurse-calendar-static-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin||!url.pathname.startsWith(SCOPE_PATH))return;
  const route=url.pathname.slice(SCOPE_PATH.length);
  if(route==='config.js'||route==='holiday-data.json'){
    event.respondWith(fetch(req,{cache:'no-store'}));return;
  }
  if(req.mode==='navigate'){
    event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{
      if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(new URL('./index.html',ROOT),copy));}
      return res;
    }).catch(()=>caches.match(new URL('./index.html',ROOT))));return;
  }
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return res;
  })));
});
