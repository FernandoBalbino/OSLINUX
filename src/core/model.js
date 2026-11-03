import {defaultProfile,resolveProfile,validateProfileName,avatarById} from './profile.js';
import {validateOffice,officeText} from './office.js';
import {favorites as defaultFavorites} from './catalog.js';
import {packages,packageById} from './packages.js';
export const randomId=()=>crypto.randomUUID?.()||Array.from(crypto.getRandomValues(new Uint8Array(16)),value=>value.toString(16).padStart(2,'0')).join('');
export const HOME = '/home/aluno';
export const STORAGE_KEY = 'oslinux.state.v1';
export function normalize(path, cwd = HOME) {
  if (!String(path).trim()) throw Error('Informe um caminho.');
  const value = String(path).replace(/^~(?=\/|$)/, HOME);
  const parts = (value.startsWith('/') ? value : cwd + '/' + value).split('/');
  const result = [];
  for (const part of parts) { if (!part || part === '.') continue; if (part === '..') result.pop(); else result.push(part); }
  return '/' + result.join('/');
}
export const basename = path => path.split('/').filter(Boolean).at(-1) || '/';
export const parent = path => path.slice(0, path.lastIndexOf('/')) || '/';
const preferences = { dark: false, wallpaper: 'resolute', dockSize: 48, volume: 65, brightness: 100, wifi: true, ssid: 'Orion', bluetooth: false, airplane: false, night: false, quiet: false, power: 'Equilibrado' };
export function seedState() {
  const nodes = { '/': { type: 'folder' }, '/home': { type: 'folder' }, [HOME]: { type: 'folder' } };
  for (const dir of ['Área de Trabalho','Documentos','Downloads','Música','Imagens','Público','snap','Modelos','Vídeos']) nodes[HOME + '/' + dir] = { type: 'folder' };
  nodes[HOME + '/Documentos/Boas-vindas.txt'] = { type: 'file', content: 'Bem-vindo ao OSLINUX!\n\nEste é o seu computador Ubuntu simulado.\nCrie uma pasta em Arquivos ou experimente mkdir no Terminal.\nOs arquivos são compartilhados entre os aplicativos.\n' };
  return { version: 1, nodes, trash: [], preferences: { ...preferences }, profile:{...defaultProfile}, history: [], installed: [], favorites:[...defaultFavorites] };
}
export function createEventBus() {
  const handlers = new Map();
  return { emit(type, detail = {}) { const event = { type, detail, occurredAt: new Date().toISOString() }; for (const callback of handlers.get(type) || []) callback(event); for (const callback of handlers.get('*') || []) callback(event); }, subscribe(type, callback) { if (!handlers.has(type)) handlers.set(type, new Set()); handlers.get(type).add(callback); return () => handlers.get(type).delete(callback); } };
}
export function createStore(storage, isolated = false) {
  let state = seedState();
  if (!isolated) { try { const saved = JSON.parse(storage?.getItem(STORAGE_KEY) || 'null'); if (saved?.version === 1 && saved.nodes?.[HOME]?.type === 'folder' && Array.isArray(saved.trash) && Array.isArray(saved.history)) state = { ...saved, preferences: { ...preferences, ...saved.preferences } }; } catch { /* Invalid saved data cannot prevent boot. */ } }
  state.profile=resolveProfile(state.profile);
  state.installed=Array.isArray(state.installed)?state.installed.filter(id=>packageById(id)):[];
  state.favorites=Array.isArray(state.favorites)?state.favorites.filter(id=>typeof id==='string'):[...defaultFavorites];
  const listeners = new Set(); const events = createEventBus();
  function update(type, action) {
    const next = structuredClone(state); const result = action(next);
    if (!isolated) { try { storage?.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { throw Error('Não foi possível salvar: o armazenamento do navegador está cheio ou indisponível.'); } }
    state = next; listeners.forEach(cb => cb()); events.emit(type, result); return result;
  }
  function writable(path) { if (!path.startsWith(HOME + '/')) throw Error('Esta pasta do sistema é protegida. Use sua pasta pessoal.'); }
  function validName(name) { if (!String(name).trim() || /[\/\u0000]/.test(name) || ['.','..'].includes(name)) throw Error('Nome inválido. Use um nome sem barras.'); }
  function ensureParent(nodes, path) { if (nodes[parent(path)]?.type !== 'folder') throw Error('A pasta de destino não existe.'); }
  const fs = {
    stat(path) { return state.nodes[normalize(path)]; },
    list(path) { const dir = normalize(path); if (state.nodes[dir]?.type !== 'folder') throw Error('Pasta não encontrada.'); return Object.entries(state.nodes).filter(([p]) => p !== dir && parent(p) === dir).map(([p,n]) => ({ path:p, name:basename(p), ...n })).sort((a,b) => (b.type === 'folder') - (a.type === 'folder') || a.name.localeCompare(b.name,'pt-BR')); },
    read(path) { const node = state.nodes[normalize(path)]; if (!node) throw Error('Arquivo não encontrado.'); if (node.type !== 'file') throw Error('O caminho é uma pasta.'); return node.content; },
    create(path, type='file', content='', extra={}) { path=normalize(path); writable(path); validName(basename(path)); return update('file:created', next => { if (next.nodes[path]) throw Error('Já existe um item com esse nome.'); ensureParent(next.nodes,path); next.nodes[path] = type === 'folder' ? { type } : { ...extra, type, content }; return {path}; }); },
    // Keeps a file's metadata (media, vault entries) that write() would replace.
    update(path, patch) { path=normalize(path); writable(path); return update('file:changed', next => { if (next.nodes[path]?.type !== 'file') throw Error('Arquivo não encontrado.'); Object.assign(next.nodes[path], patch); return {path}; }); },
    write(path, content) { path=normalize(path); writable(path); return update('file:changed', next => { ensureParent(next.nodes,path); if (next.nodes[path]?.type === 'folder') throw Error('O destino é uma pasta.'); next.nodes[path] = { type:'file', content:String(content) }; return {path}; }); },
    transfer(source, target, copy=false) { source=normalize(source); target=normalize(target); writable(source); writable(target); validName(basename(target)); return update(copy?'file:copied':'file:moved', next => { if (!next.nodes[source]) throw Error('Item não encontrado.'); if (target === source || target.startsWith(source + '/')) throw Error('Não é possível colocar uma pasta dentro dela mesma.'); if (next.nodes[target]) throw Error('Já existe um item com esse nome no destino.'); ensureParent(next.nodes,target); const group=Object.entries(next.nodes).filter(([p])=>p===source||p.startsWith(source+'/')); for (const [p,node] of group) { next.nodes[target+p.slice(source.length)]={...node}; if(!copy) delete next.nodes[p]; } return {source,path:target}; }); },
    remove(path, recursive=false) { path=normalize(path); writable(path); return update('file:deleted', next => { if(!next.nodes[path]) throw Error('Item não encontrado.'); const group=Object.entries(next.nodes).filter(([p])=>p===path||p.startsWith(path+'/')); if(group.length>1&&!recursive) throw Error('A pasta não está vazia. Use -r para remoção recursiva.'); next.trash.push({ id:randomId(),path,nodes:Object.fromEntries(group) }); group.forEach(([p])=>delete next.nodes[p]); return {path}; }); },
    restore(id) { return update('trash:restored', next => { const entry=next.trash.find(x=>x.id===id); if(!entry) throw Error('Item não encontrado na Lixeira.'); if(Object.keys(entry.nodes).some(p=>next.nodes[p])) throw Error('Já existe um item com esse nome. Renomeie-o antes de restaurar.'); ensureParent(next.nodes,entry.path); Object.assign(next.nodes,entry.nodes); next.trash=next.trash.filter(x=>x.id!==id); return {path:entry.path}; }); },
    emptyTrash() { return update('trash:emptied',next=>{ next.trash=[]; }); },
    saveOffice(kind,path,payload) { path=normalize(path);writable(path);validName(basename(path));const document=validateOffice(kind,payload);return update('office:saved',next=>{ensureParent(next.nodes,path);if(next.nodes[path]?.type==='folder')throw Error('O destino é uma pasta.');next.nodes[path]={type:'file',officeKind:kind,document,content:officeText(kind,document)};return {kind,path,payload:document};}); },
    rename(path,name) { validName(name); return fs.transfer(path,parent(normalize(path))+'/'+name); }
  };
  return { getSnapshot:()=>state, subscribe(callback) { listeners.add(callback); return ()=>listeners.delete(callback); }, fs, events,
    downloadPackage(id) {
      const item=packageById(id);if(!item?.deb)throw Error('Este programa não tem pacote para baixar.');
      if(!state.preferences.wifi||state.preferences.airplane)throw Error('Conecte-se ao Wi-Fi para baixar o aplicativo.');
      return update('package:downloaded',next=>{const path=HOME+'/Downloads/'+item.deb;if(next.nodes[HOME+'/Downloads']?.type!=='folder')throw Error('Crie a pasta Downloads antes de baixar.');if(next.nodes[path]&&next.nodes[path].packageId!==id)throw Error('Já existe outro arquivo com esse nome em Downloads.');next.nodes[path]={type:'file',packageId:id,content:'Pacote educativo do '+item.name+'. Abra com a Central de Aplicativos.'};return {packageId:id,path};});
    },
    downloadChrome() { return this.downloadPackage('chrome'); },
    installPackage(id,path) {
      const item=packageById(id);if(!item)throw Error('Aplicativo não encontrado.');
      if(item.deb&&state.nodes[normalize(path||HOME+'/Downloads/'+item.deb)]?.packageId!==id)throw Error('Baixe o pacote do '+item.name.replace('Google ','')+' no Firefox e abra-o em Downloads.');
      if(!item.deb&&(!state.preferences.wifi||state.preferences.airplane))throw Error('Conecte-se ao Wi-Fi para instalar aplicativos do catálogo.');
      return update('app:installed',next=>{if(!next.installed.includes(id))next.installed.push(id);return {appId:id,packageId:id};});
    },
    uninstallPackage(id) { if(!packageById(id))throw Error('Aplicativo não encontrado.');return update('app:uninstalled',next=>{next.installed=next.installed.filter(item=>item!==id);const ids=packageById(id).apps||[id];next.favorites=next.favorites.filter(item=>!ids.includes(item));return {appId:id,packageId:id};}); },
    setFavorite(appId,value) { return update('favorite:changed',next=>{next.favorites=next.favorites.filter(id=>id!==appId);if(value)next.favorites.push(appId);return {appId,value};}); },
    setProfile(patch,metadata={}) { const current=state.profile;const name=validateProfileName(patch.name??current.name),avatar=patch.avatar??current.avatar;if(avatar!=='default'&&!avatarById(avatar))throw Error('Escolha um avatar disponível.');return update('profile:changed',next=>{const changed=['name','avatar'].filter(key=>next.profile[key]!==({name,avatar})[key]);next.profile={name,avatar};return{source:metadata.source,section:metadata.section,windowId:metadata.windowId,name,avatar,changed};}); },
    setPreferences(patch,metadata={}) { return update('preferences:changed',next=>{ Object.assign(next.preferences,patch); if(patch.airplane===true){next.preferences.wifi=false;next.preferences.bluetooth=false;} return {...patch,source:metadata.source,section:metadata.section,windowId:metadata.windowId}; }); }, visit(url) { return update('browser:visited',next=>{next.history=[{url,date:Date.now()},...next.history.filter(x=>x.url!==url)].slice(0,100);return {url};}); }, reset() { return update('system:reset',next=>Object.assign(next,seedState())); } };
}
function tokenize(input) {
  const tokens=[]; let token='', quote=null, active=false;
  for(let i=0;i<input.length;i++){const c=input[i]; if(quote){if(c===quote) quote=null; else token+=c; active=true;} else if(c==='"'||c==="'"){quote=c;active=true;} else if(/\s/.test(c)){if(active){tokens.push(token);token='';active=false;}} else if(c==='>'){if(active){tokens.push(token);token='';active=false;} if(input[i+1]==='>'){tokens.push('>>');i++;}else tokens.push('>');} else {token+=c;active=true;}}
  if(quote)throw Error('Aspas não fechadas.');if(active)tokens.push(token);return tokens;
}
export function executeTerminal(store, input, cwd=HOME) {
  const result=runTerminal(store,input,cwd);let args=[];try{args=tokenize(input);}catch{}
  if(args.length)store.events.emit('terminal:command',{command:args[0],args:args.slice(1),from:cwd,cwd:result.cwd,error:Boolean(result.error)});
  return result;
}
function runTerminal(store, input, cwd) {
  try {
    const args=tokenize(input); let command=args.shift(),admin=false; if(!command)return{output:'',cwd};
    if(command==='sudo'){admin=true;command=args.shift();if(!command)throw Error('Escreva um comando depois do sudo. Exemplo: sudo apt update');}
    const path=(value='.')=>normalize(value,cwd); const need=()=>{if(!args[0])throw Error('Informe um caminho.');}; let output='';
    switch(command){
      case 'pwd': output=cwd;break;
      case 'whoami': output='aluno';break;
      case 'help': output='Comandos: pwd, ls [-a], cd, mkdir, touch, cat, echo [> ou >> arquivo], cp [-r], mv, rm [-r], clear, whoami, help.\nProgramas: sudo apt update, sudo apt install programa, sudo apt remove programa, sudo apt upgrade, fastfetch.\nUse aspas em nomes com espaços. Todos os comandos operam apenas no sistema simulado.';break;
      case 'apt':case 'apt-get':output=apt(store,args,admin);break;
      case 'fastfetch':if(!store.getSnapshot().installed.includes('fastfetch'))throw Error('fastfetch: comando não encontrado. Para instalar, digite: sudo apt install fastfetch');output=FASTFETCH;break;
      case 'clear':return{output:'',cwd,clear:true};
      case 'cd': {const target=path(args[0]||HOME);if(store.fs.stat(target)?.type!=='folder')throw Error('Pasta não encontrada.');cwd=target;break;}
      case 'ls': output=store.fs.list(path(args.find(x=>!x.startsWith('-'))||'.')).filter(n=>args.includes('-a')||!n.name.startsWith('.')).map(n=>n.name+(n.type==='folder'?'/':'')).join('  ');break;
      case 'mkdir':need();args.forEach(p=>store.fs.create(path(p),'folder'));break;
      case 'touch':need();args.forEach(p=>{if(!store.fs.stat(path(p)))store.fs.create(path(p));});break;
      case 'cat':need();output=args.map(p=>store.fs.read(path(p))).join('\n');break;
      case 'echo': {const index=args.findIndex(x=>x==='>'||x==='>>');if(index>=0){if(!args[index+1]||args.length>index+2)throw Error('Informe um único arquivo de destino.'); const target=path(args[index+1]);store.fs.write(target,(args[index]==='>>'&&store.fs.stat(target)?store.fs.read(target):'')+args.slice(0,index).join(' ')+'\n');}else output=args.join(' ');break;}
      case 'cp':case 'mv': {const recursive=args.includes('-r')||args.includes('-R');const p=args.filter(x=>x!=='-r'&&x!=='-R');if(p.length!==2)throw Error('Informe origem e destino.');const source=path(p[0]);let target=path(p[1]);if(store.fs.stat(target)?.type==='folder')target+='/'+basename(source);if(command==='cp'&&store.fs.stat(source)?.type==='folder'&&!recursive)throw Error('Use cp -r para copiar pastas.');store.fs.transfer(source,target,command==='cp');break;}
      case 'rm': {const recursive=args.includes('-r')||args.includes('-rf');const p=args.filter(x=>!x.startsWith('-'));if(!p.length)throw Error('Informe um caminho.');p.forEach(x=>store.fs.remove(path(x),recursive));break;}
      default:throw Error(`${command}: comando não encontrado. Digite help para ver os comandos disponíveis.`);
    } return{output,cwd};
  } catch(error){return{output:error.message,cwd,error:true};}
}
const FASTFETCH=`aluno@ubuntu
------------
OS: Ubuntu 26.04 LTS x86_64
Host: Chromebook do laboratório
Kernel: Linux 6.17.0-5-generic
Packages: 1842 (dpkg), 9 (snap)
Shell: bash 5.2.37
DE: GNOME 50
CPU: Intel(R) Celeron(R) N4500 (2) @ 2.80 GHz
GPU: Intel(R) UHD Graphics
Memory: 1.62 GiB / 3.72 GiB (43%)
Disk (/): 21.40 GiB / 58.00 GiB (37%)
Battery: 87% [AC Connected]
Locale: pt_BR.UTF-8`;
// Fixed, short outputs: the lesson is the command and its effect, not real dependency resolution.
function apt(store,args,admin){
  const[action,...rest]=args,names=rest.filter(name=>!name.startsWith('-')),state=store.getSnapshot();
  if(!['update','install','remove','purge','upgrade','autoremove'].includes(action))throw Error('Use: sudo apt update, sudo apt install programa, sudo apt remove programa ou sudo apt upgrade.');
  if(!admin)throw Error('Permissão negada: instalar e remover programas exige administrador. Comece com sudo. Exemplo: sudo apt '+args.join(' '));
  if(['update','install','upgrade'].includes(action)&&(!state.preferences.wifi||state.preferences.airplane))throw Error('Falha ao conectar a br.archive.ubuntu.com: sem internet. Conecte-se ao Wi-Fi e tente de novo.');
  if(action==='update')return'Atingido:1 http://br.archive.ubuntu.com/ubuntu resolute InRelease\nObter:2 http://security.ubuntu.com/ubuntu resolute-security InRelease\nLendo listas de pacotes... Pronto\nPronto! A lista de programas foi atualizada.';
  if(action==='upgrade')return'Lendo listas de pacotes... Pronto\nCalculando atualização... Pronto\n3 pacotes atualizados, 0 novos instalados, 0 a serem removidos.\nPronto! Seus programas estão atualizados.';
  if(action==='autoremove')return'Lendo listas de pacotes... Pronto\n0 pacotes atualizados, 0 novos instalados, 0 a serem removidos.';
  if(!names.length)throw Error('Escreva o nome do programa. Exemplo: sudo apt '+action+' vlc');
  const found=names.map(name=>{const item=packages.find(entry=>entry.apt===name);if(item)return item;if(packages.some(entry=>entry.apt===name.toLowerCase()))throw Error('Use letras minúsculas: sudo apt '+action+' '+name.toLowerCase());throw Error('E: Impossível encontrar o pacote '+name+'. Confira o nome e tente de novo.');});
  return found.map(item=>{const installed=store.getSnapshot().installed.includes(item.id),open=item.cli?'Digite '+item.apt+' para usar.':'Abra o '+item.name+' pela grade de aplicativos.';
    if(action==='install'){if(installed)return item.apt+' já está na versão mais recente.\n'+open;store.installPackage(item.id);return'Lendo listas de pacotes... Pronto\nOs NOVOS pacotes a seguir serão instalados:\n  '+item.apt+'\nObter:1 http://br.archive.ubuntu.com/ubuntu resolute/universe '+item.apt+' ['+item.size+']\nDesempacotando '+item.apt+'...\nConfigurando '+item.apt+'...\nPronto! '+open;}
    if(!installed)return'O pacote '+item.apt+' não está instalado, então não foi removido.';store.uninstallPackage(item.id);return'Removendo '+item.apt+'...\nPronto! O programa foi removido. Seus arquivos (vídeos, fotos e documentos) continuam no lugar.';}).join('\n');
}
export function completePath(store,text,cwd){
  let start=0,quote=null;
  for(let index=0;index<text.length;index++){const character=text[index];if(quote){if(character===quote)quote=null;}else if(character==='"'||character==="'")quote=character;else if(/\s/.test(character))start=index+1;}
  const part=text.slice(start).replace(/^["']/,'');const folder=part.includes('/')?part.slice(0,part.lastIndexOf('/')+1):'';
  try{const prefix=part.slice(folder.length);const matches=store.fs.list(normalize(folder||'.',cwd)).filter(node=>node.name.startsWith(prefix));if(matches.length===1){const value=folder+matches[0].name+(matches[0].type==='folder'?'/':'');return text.slice(0,start)+(/\s/.test(value)||quote?'"'+value+'"':value);}}catch{}
  return text;
}
export function calculate(expression) {
  const source=String(expression).replace(/,/g,'.').replace(/×/g,'*').replace(/÷/g,'/'); const tokens=source.match(/\d*\.?\d+(?:e[+-]?\d+)?|[()+\-*/%]/gi)||[];
  if(tokens.join('')!==source.replace(/\s/g,''))throw Error('Expressão inválida.');let i=0;
  function atom(){let value;if(tokens[i]==='-'){i++;return-atom();}if(tokens[i]==='+'){i++;return atom();}if(tokens[i]==='('){i++;value=sum();if(tokens[i++]!==')')throw Error('Feche os parênteses.');}else {value=Number(tokens[i++]);if(!Number.isFinite(value))throw Error('Expressão incompleta.');}while(tokens[i]==='%'){i++;value/=100;}return value;}
  function product(){let value=atom();while(['*','/'].includes(tokens[i])){const op=tokens[i++],right=atom();if(op==='/'&&right===0)throw Error('Não é possível dividir por zero.');value=op==='*'?value*right:value/right;}return value;}
  function sum(){let value=product();while(['+','-'].includes(tokens[i])){const op=tokens[i++],right=product();value=op==='+'?value+right:value-right;}return value;}
  const value=sum();if(i!==tokens.length||!Number.isFinite(value))throw Error('Expressão inválida.');return Number(value.toPrecision(12));
}
