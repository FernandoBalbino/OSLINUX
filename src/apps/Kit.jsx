import React,{useEffect,useRef,useState} from 'react';
import {HOME,basename,parent} from '../core/model.js';
import {wallpaperById} from '../core/wallpapers.js';
import {HTML_TEMPLATE} from '../core/kit.js';
import './kit.css';

const mediaIn=(store,dir,media)=>{try{return store.fs.list(dir).filter(item=>media?item.media===media:true);}catch{return[];}};
function freeName(store,dir,name){const dot=name.lastIndexOf('.'),stem=dot>0?name.slice(0,dot):name,extension=dot>0?name.slice(dot):'';let count=1,candidate=name;while(store.fs.stat(dir+'/'+candidate))candidate=stem+(++count)+extension;return candidate;}
const clock=seconds=>{const value=Math.max(0,Math.floor(seconds||0));return Math.floor(value/60)+':'+String(value%60).padStart(2,'0');};
async function askName(store,dialog,title,dir,name){const answer=await dialog.prompt(title,freeName(store,dir,name));if(answer===null)return null;if(!answer.trim()||answer.includes('/')){dialog.alert('Digite só o nome do arquivo, sem barras.');return null;}return dir+'/'+answer.trim();}
function MenuButton({label,items}){
 const[open,setOpen]=useState(false);
 return <div className="kit-menu"><button aria-expanded={open} onClick={()=>setOpen(!open)}>{label}</button>{open&&<><div className="kit-menu-scrim" onPointerDown={()=>setOpen(false)}/><div className="kit-menu-list" role="menu">{items.map(item=><button role="menuitem" key={item.label} disabled={item.disabled} onClick={()=>{setOpen(false);item.action();}}>{item.label}</button>)}{!items.length&&<span>Nenhum item</span>}</div></>}</div>;
}

function Vlc({store,data,openApp}){
 const node=data?.path?store.fs.stat(data.path):null,video=useRef(null);
 const[playing,setPlaying]=useState(false),[time,setTime]=useState(0),[duration,setDuration]=useState(8);
 useEffect(()=>{setPlaying(false);setTime(0);setDuration(8);},[data?.path]);
 // Recordings and audio exist only in the virtual disk: a timer stands in for playback.
 useEffect(()=>{if(!playing||node?.src)return;const timer=setInterval(()=>setTime(value=>{if(value+1>=8)setPlaying(false);return Math.min(8,value+1);}),1000);return()=>clearInterval(timer);},[playing,node?.src]);
 function play(){if(!node)return;if(playing){video.current?.pause();setPlaying(false);return;}if(node.src)video.current?.play()?.catch(()=>{});else{if(time>=8)setTime(0);setPlaying(true);}store.events.emit('vlc:played',{path:data.path});}
 function stop(){if(video.current){video.current.pause();video.current.currentTime=0;}setPlaying(false);setTime(0);}
 const media=[...mediaIn(store,HOME+'/Vídeos','video'),...mediaIn(store,HOME+'/Música','audio')];
 return <div className="kit-app vlc-app"><nav className="kit-menubar"><MenuButton label="Mídia" items={media.map(item=>({label:'Abrir '+item.name,action:()=>openApp('vlc',{path:item.path})}))}/></nav>
  <div className="vlc-screen">{!node?<div className="vlc-empty"><img src="assets/apps/vlc.png" alt=""/><p>Nenhum vídeo aberto.</p><p>Em Arquivos, clique com o botão direito no vídeo e escolha <b>Abrir com VLC</b>.</p></div>:node.src?<video ref={video} src={node.src} playsInline preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onTimeUpdate={event=>setTime(event.currentTarget.currentTime)} onLoadedMetadata={event=>setDuration(event.currentTarget.duration||8)}/>:<div className={'vlc-placeholder '+(playing?'playing':'')}>{node.media==='audio'?<span className="vlc-note">♪</span>:<img src="assets/wallpapers/resolute.webp" alt=""/>}<p>{node.media==='audio'?basename(data.path):'Gravação da tela'}</p></div>}</div>
  <input className="vlc-seek" type="range" aria-label="Posição do vídeo" min="0" max={duration} step="0.1" value={time} disabled={!node} onChange={event=>{const value=Number(event.target.value);setTime(value);if(video.current)video.current.currentTime=value;}}/>
  <div className="vlc-controls"><button className="vlc-play" disabled={!node} onClick={play}>{playing?'❚❚ Pausar':'▶ Reproduzir'}</button><button aria-label="Parar" title="Parar" disabled={!node} onClick={stop}>■</button><span className="vlc-time">{clock(time)} / {clock(duration)}</span><strong>{node?basename(data.path):'VLC media player'}</strong></div>
 </div>;
}

function Gimp({store,dialog,data}){
 const[path,setPath]=useState(null),[gray,setGray]=useState(false),[done,setDone]=useState(null);
 const node=path?store.fs.stat(path):null,images=mediaIn(store,HOME+'/Imagens','image');
 function open(target){setPath(target);setGray(false);setDone(null);store.events.emit('gimp:opened',{path:target});}
 useEffect(()=>{if(data?.path&&store.fs.stat(data.path)?.media==='image')open(data.path);},[data?.path]);
 function desaturate(){setGray(true);store.events.emit('gimp:filtered',{path,filter:'gray'});}
 async function exportImage(){const stem=basename(path).replace(/\.[^.]+$/,''),target=await askName(store,dialog,'Exportar imagem como',parent(path),stem+(gray?'-pb':'-copia')+'.png');if(!target)return;try{const filter=gray?'grayscale(1)':node.filter||'';store.fs.create(target,'file','Imagem exportada pelo GIMP.',{media:'image',src:node.src,filter});setDone(target);store.events.emit('gimp:exported',{path:target,gray:filter==='grayscale(1)'});}catch(error){dialog.alert(error.message);}}
 return <div className="kit-app gimp-app"><nav className="kit-menubar"><MenuButton label="Arquivo" items={[{label:'Abrir imagem…',action:()=>setPath(null)},{label:'Exportar como…',disabled:!node,action:exportImage}]}/><MenuButton label="Cores" items={[{label:'Preto e branco (Dessaturar)',disabled:!node,action:desaturate}]}/></nav>
  <div className="gimp-body"><aside className="gimp-tools" aria-hidden="true">{Array.from({length:8},(_,index)=><i key={index}/>)}</aside><main className="gimp-canvas">{node?<img src={node.src} style={{filter:gray?'grayscale(1)':node.filter||'none'}} alt={'Imagem '+basename(path)}/>:<div className="kit-start"><h2>Abra uma imagem</h2><p>Clique em uma foto da pasta Imagens.</p><div className="kit-thumbs">{images.map(item=><button key={item.path} onClick={()=>open(item.path)}><img src={item.src} style={{filter:item.filter||'none'}} alt=""/>{item.name}</button>)}</div>{!images.length&&<p>A pasta Imagens não tem fotos.</p>}</div>}</main></div>
  <footer className="app-status">{node?basename(path)+(gray?' • preto e branco':''):'Nenhuma imagem aberta'}{done&&<span role="status">Exportado: {basename(done)} ✓</span>}</footer>
 </div>;
}

function VsCode({store,dialog,openApp,data,registerGuard,windowId}){
 const read=target=>{try{return store.fs.read(target);}catch{return'';}};
 const[path,setPath]=useState(data?.path||null),[text,setText]=useState(()=>data?.path?read(data.path):''),[saved,setSaved]=useState(text);
 const dirty=Boolean(path)&&text!==saved,docs=HOME+'/Documentos',pages=mediaIn(store,docs).filter(item=>item.type==='file'&&/\.html?$/i.test(item.name));
 function load(target){const content=read(target);setPath(target);setText(content);setSaved(content);}
 useEffect(()=>{if(data?.path&&data.path!==path&&!dirty)load(data.path);},[data?.path]);
 function create(){try{const target=docs+'/'+freeName(store,docs,'ola.html');store.fs.create(target,'file',HTML_TEMPLATE);load(target);store.events.emit('vscode:created',{path:target});}catch(error){dialog.alert(error.message);}}
 function save(){try{store.fs.write(path,text);setSaved(text);return true;}catch(error){dialog.alert(error.message);return false;}}
 function preview(){if(dirty&&!save())return;store.events.emit('vscode:previewed',{path});openApp('firefox',{url:'file://'+path});}
 async function guard(){if(!dirty)return true;const answer=await dialog.choose('Salvar alterações?',`O arquivo ${basename(path)} tem alterações não salvas.`,['Cancelar','Descartar','Salvar']);return answer==='Salvar'?save():answer==='Descartar';}
 useEffect(()=>registerGuard(windowId,guard),[dirty,text,path]);
 const lines=text.split('\n').length;
 return <div className="kit-app vscode-app" onKeyDown={event=>{if(event.ctrlKey&&event.key.toLowerCase()==='s'&&path){event.preventDefault();save();}}}>
  <aside className="vscode-explorer"><small>EXPLORADOR • DOCUMENTOS</small>{pages.map(item=><button key={item.path} aria-pressed={item.path===path} onClick={()=>dirty?dialog.alert('Salve o arquivo aberto antes de trocar.'):load(item.path)}><img src="assets/mimetypes/text-html.png" alt=""/>{item.name}</button>)}<button className="vscode-new" onClick={create}>+ Novo arquivo HTML</button></aside>
  <main className="vscode-main">{path?<><header className="vscode-tabs"><span className="vscode-tab">{dirty?'● ':''}{basename(path)}</span><button onClick={save}>Salvar</button><button className="suggested" onClick={preview}>▶ Ver no navegador</button></header><div className="vscode-editor"><pre className="vscode-lines" aria-hidden="true">{Array.from({length:lines},(_,index)=>index+1).join('\n')}</pre><textarea aria-label="Código da página" spellCheck="false" rows={lines+1} value={text} onChange={event=>setText(event.target.value)}/></div></>:<div className="kit-start vscode-welcome"><img src="assets/apps/vscode.svg" alt=""/><h2>Visual Studio Code</h2><p>Crie sua primeira página da internet.</p><button className="suggested" onClick={create}>Novo arquivo HTML</button></div>}</main>
  <footer className="vscode-status">{path?(dirty?'Não salvo • ':'Salvo • ')+'HTML • UTF-8':'Pronto'}</footer>
 </div>;
}

function Obs({store,state,dialog,openApp}){
 const[screen,setScreen]=useState(false),[adding,setAdding]=useState(false),[started,setStarted]=useState(null),[now,setNow]=useState(0),[last,setLast]=useState(null);
 useEffect(()=>{if(!started)return;const timer=setInterval(()=>setNow(Date.now()),250);return()=>clearInterval(timer);},[started]);
 function add(){setScreen(true);setAdding(false);store.events.emit('obs:source-added',{kind:'screen'});}
 function toggle(){if(!started){const value=Date.now();setStarted(value);setNow(value);setLast(null);return;}const seconds=(Date.now()-started)/1000,date=new Date(),pad=n=>String(n).padStart(2,'0'),dir=HOME+'/Vídeos',name=`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}.mkv`;setStarted(null);try{const path=dir+'/'+freeName(store,dir,name);store.fs.create(path,'file','Gravação da tela feita no OBS Studio.',{media:'video',recording:true});setLast(path);store.events.emit('obs:recorded',{path,seconds,screen});}catch(error){dialog.alert(error.message);}}
 const elapsed=started?(now-started)/1000:0;
 return <div className="kit-app obs-app"><div className="obs-preview">{screen?<img src={wallpaperById(state.preferences.wallpaper).src} alt="Prévia da captura de tela"/>:<p>Tela preta: ainda não há fontes.<br/>Em Fontes, clique em + e escolha Captura de tela.</p>}{started&&<span className="obs-rec">● REC {clock(elapsed)}</span>}</div>
  <div className="obs-docks"><section><h3>Cenas</h3><p className="obs-item selected">Cena</p></section><section><h3>Fontes</h3>{screen?<p className="obs-item">Captura de tela</p>:<p className="obs-hint">Nenhuma fonte</p>}<div className="obs-add"><button aria-label="Adicionar fonte" title="Adicionar fonte" onClick={()=>setAdding(!adding)}>+</button>{adding&&<div className="kit-menu-list"><button onClick={add}>Captura de tela</button></div>}</div></section><section><h3>Controles</h3><button className={'obs-record '+(started?'recording':'')} onClick={toggle}>{started?'Parar gravação':'Iniciar gravação'}</button><button disabled={!last} onClick={()=>openApp('files',{path:HOME+'/Vídeos'})}>Mostrar gravações</button></section></div>
  <footer className="app-status">{started?'Gravando… '+clock(elapsed):last?'Gravação salva em Vídeos: '+basename(last):'Pronto'}</footer>
 </div>;
}

const WAVE=Array.from({length:72},(_,index)=>index<22?2+index%3:10+Math.round(28*Math.abs(Math.sin(index*1.7))*(.5+.5*Math.abs(Math.cos(index*.37)))));
function Audacity({store,dialog,data}){
 const[path,setPath]=useState(null),[trimmed,setTrimmed]=useState(false),[done,setDone]=useState(null);
 const node=path?store.fs.stat(path):null,audios=mediaIn(store,HOME+'/Música','audio');
 function open(target){setPath(target);setTrimmed(Boolean(store.fs.stat(target)?.trimmed));setDone(null);store.events.emit('audacity:opened',{path:target});}
 useEffect(()=>{if(data?.path&&store.fs.stat(data.path)?.media==='audio')open(data.path);},[data?.path]);
 function trim(){setTrimmed(true);store.events.emit('audacity:trimmed',{path});}
 async function exportMp3(){const target=await askName(store,dialog,'Exportar áudio como MP3',parent(path),basename(path).replace(/\.[^.]+$/,'')+'.mp3');if(!target)return;try{store.fs.create(target,'file','Áudio exportado pelo Audacity.',{media:'audio',trimmed});setDone(target);store.events.emit('audacity:exported',{path:target,trimmed});}catch(error){dialog.alert(error.message);}}
 const bars=trimmed?WAVE.slice(22):WAVE;
 return <div className="kit-app audacity-app"><nav className="kit-menubar"><MenuButton label="Arquivo" items={[{label:'Abrir…',action:()=>setPath(null)},{label:'Exportar como MP3…',disabled:!node,action:exportMp3}]}/><MenuButton label="Efeito" items={[{label:'Truncar silêncio',disabled:!node||trimmed,action:trim}]}/></nav>
  {node?<div className="audacity-project"><div className="audacity-ruler">{Array.from({length:trimmed?8:11},(_,second)=><span key={second}>{second}</span>)}</div><div className="audacity-track"><div className="audacity-label"><strong>{basename(path).replace(/\.[^.]+$/,'')}</strong><small>Mono, 44100 Hz</small></div><div className="audacity-wave">{!trimmed&&<span className="audacity-silence">silêncio</span>}<svg viewBox={`0 0 ${bars.length*6} 80`} preserveAspectRatio="none" aria-label={trimmed?'Onda sonora sem o silêncio':'Onda sonora com silêncio no começo'}>{bars.map((height,index)=><rect key={index} x={index*6} y={40-height} width="4" height={height*2} rx="1"/>)}</svg></div></div></div>:<div className="kit-start"><h2>Abra uma gravação</h2><p>Clique em um áudio da pasta Música.</p><div className="kit-list">{audios.map(item=><button key={item.path} onClick={()=>open(item.path)}><img src="assets/mimetypes/audio-x-generic.png" alt=""/>{item.name}</button>)}</div>{!audios.length&&<p>A pasta Música não tem gravações.</p>}</div>}
  <footer className="app-status">{node?(trimmed?'Silêncio removido • ':'')+'Duração: 0:'+(trimmed?'07':'10'):'Nenhum áudio aberto'}{done&&<span role="status">Exportado: {basename(done)} ✓</span>}</footer>
 </div>;
}

const VAULT=HOME+'/Documentos/Senhas.kdbx';
function strongPassword(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?';return Array.from(crypto.getRandomValues(new Uint32Array(20)),value=>chars[value%chars.length]).join('');}
function KeePass({store,state,dialog}){
 const vault=state.nodes[VAULT],entries=vault?.entries||[],[open,setOpen]=useState(false),[form,setForm]=useState(null);
 function create(){try{store.fs.create(VAULT,'file','Cofre de senhas simulado do KeePassXC. Abra com o KeePassXC.',{opener:'keepassxc',entries:[]});setOpen(true);store.events.emit('keepassxc:created',{path:VAULT});}catch(error){dialog.alert(error.message);}}
 function save(){if(!form.title.trim()||!form.password)return dialog.alert('Escreva um título e clique em Gerar senha.');try{store.fs.update(VAULT,{entries:[...entries,{title:form.title.trim(),user:form.user.trim(),password:form.password}]});store.events.emit('keepassxc:entry-saved',{title:form.title.trim(),length:form.password.length});setForm(null);}catch(error){dialog.alert(error.message);}}
 if(!open||!vault?.entries)return <div className="kit-app keepass-app"><div className="kit-start"><img src="assets/apps/keepassxc.svg" alt=""/><h2>KeePassXC</h2><p>Guarde suas senhas em um cofre.</p>{vault?.entries?<button className="suggested" onClick={()=>{setOpen(true);store.events.emit('keepassxc:opened',{path:VAULT});}}>Abrir cofre Senhas.kdbx</button>:<button className="suggested" onClick={create}>Criar novo cofre</button>}<p className="kit-note">Neste laboratório o cofre não pede senha mestra. No programa de verdade, você cria uma senha mestra forte e não pode esquecê-la.</p></div></div>;
 return <div className="kit-app keepass-app"><header className="kit-toolbar"><strong>Senhas.kdbx</strong><button className="suggested" onClick={()=>setForm({title:'',user:'',password:''})}>Nova entrada</button></header>
  {form?<form className="keepass-form" onSubmit={event=>{event.preventDefault();save();}}><label>Título<input autoFocus value={form.title} onChange={event=>setForm({...form,title:event.target.value})}/></label><label>Usuário<input value={form.user} onChange={event=>setForm({...form,user:event.target.value})}/></label><label>Senha<output className="keepass-password">{form.password||'Clique em Gerar senha'}</output></label><div className="kit-actions"><button type="button" onClick={()=>setForm({...form,password:strongPassword()})}>Gerar senha</button>{form.password&&<span className="keepass-strength">Muito forte • {form.password.length} caracteres</span>}</div><div className="kit-actions"><button type="button" onClick={()=>setForm(null)}>Cancelar</button><button className="suggested">Salvar</button></div><p className="kit-note">Nunca digite suas senhas de verdade neste simulador.</p></form>
  :<table className="kit-table"><thead><tr><th>Título</th><th>Usuário</th><th>Senha</th></tr></thead><tbody>{entries.map((entry,index)=><tr key={index}><td>{entry.title}</td><td>{entry.user||'—'}</td><td>••••••••••</td></tr>)}{!entries.length&&<tr><td colSpan="3">O cofre está vazio. Clique em Nova entrada.</td></tr>}</tbody></table>}
 </div>;
}

function Timeshift({store,state,dialog}){
 const snapshots=state.preferences.snapshots||[],[busy,setBusy]=useState(false),timer=useRef(null);
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 function create(){setBusy(true);timer.current=setTimeout(()=>{const list=[...(store.getSnapshot().preferences.snapshots||[]),{date:new Date().toISOString(),comment:'Ponto criado na aula'}];try{store.setPreferences({snapshots:list});store.events.emit('timeshift:created',{count:list.length});}catch(error){dialog.alert(error.message);}setBusy(false);},1200);}
 return <div className="kit-app timeshift-app"><header className="kit-toolbar"><button className="suggested" disabled={busy} onClick={create}>Criar</button><button disabled={!snapshots.length} onClick={()=>dialog.alert('Restaurar faz o sistema voltar a como estava neste ponto. Seus arquivos pessoais não mudam. Neste laboratório, nada é restaurado de verdade.')}>Restaurar</button></header>
  {busy&&<div className="install-progress" role="status"><span/>Criando ponto de restauração…</div>}
  <table className="kit-table"><thead><tr><th>Ponto de restauração</th><th>Sistema</th><th>Tipo</th><th>Comentário</th></tr></thead><tbody>{snapshots.map(item=><tr key={item.date}><td>{new Date(item.date).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}</td><td>Ubuntu 26.04</td><td>Sob demanda</td><td>{item.comment}</td></tr>)}{!snapshots.length&&<tr><td colSpan="4">Nenhum ponto de restauração ainda. Clique em Criar.</td></tr>}</tbody></table>
  <footer className="app-status">Local: /timeshift (simulado) • Modo RSYNC</footer>
 </div>;
}

export function Kit({appId,...props}){const Component={vlc:Vlc,gimp:Gimp,vscode:VsCode,obs:Obs,audacity:Audacity,keepassxc:KeePass,timeshift:Timeshift}[appId];return Component?<Component {...props}/>:null;}
