import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve('dist/client');
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
const files=walk(root).filter(file=>!['service-worker.js','precache-manifest.json'].includes(path.basename(file))).map(file=>'./'+path.relative(root,file).replaceAll('\\','/'));
const hash=createHash('sha256').update('oslinux-routes-v2').update(files.map(file=>createHash('sha256').update(readFileSync(path.resolve(root,file))).digest('hex')).join('')).digest('hex').slice(0,12);
const source=`const CACHE='oslinux-offline-${hash}';
const FILES=${JSON.stringify(['./',...files])};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('oslinux-offline-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
event.respondWith(event.request.mode==='navigate'?fetch(event.request).catch(()=>caches.match(new URL(new URL(event.request.url).pathname.split('/').filter(Boolean).at(-1)==='slide'?'./slide/index.html':'./index.html',self.location).href)):caches.match(event.request).then(cached=>cached||fetch(event.request)));});
`;
writeFileSync(path.join(root,'service-worker.js'),source);
writeFileSync(path.join(root,'precache-manifest.json'),JSON.stringify({cache:`oslinux-offline-${hash}`,files},null,2));
console.log(`Offline: ${files.length} arquivos locais, cache ${hash}`);
