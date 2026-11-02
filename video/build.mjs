// Gera index.html (composição HyperFrames) e assets/sfx.mp3 a partir de roteiro.md e das narrações.
import {readFileSync,writeFileSync,mkdirSync,copyFileSync,existsSync,unlinkSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';

const W=1920,H=1080,SR=44100;
mkdirSync('assets',{recursive:true});
for(const[from,to]of [['wallpapers/resolute.webp','wallpaper.webp'],['fonts/UbuntuSans.ttf','UbuntuSans.ttf'],['fonts/UbuntuSansMono.ttf','UbuntuSansMono.ttf'],['fonts/BarlowCondensed-Bold.ttf','Barlow.ttf'],['learning/terminal-trail-icon.svg','trail.svg'],['learning/oslab-mascot-neutral.png','robot.png'],['learning/oslab-mascot-celebrate.png','robot-celebrate.png'],['learning/linux-basics-icon.png','basics.png'],['symbolic/text-x-generic.svg','text.svg'],['symbolic/go-previous.svg','back.svg'],['places/folder.png','folder.png'],['places/folder-documents.png','folder-documents.png'],['places/folder-download.png','folder-download.png'],['places/folder-pictures.png','folder-pictures.png'],['places/folder-music.png','folder-music.png'],['places/user-desktop.png','user-desktop.png'],['places/user-trash.png','trash.png'],...['firefox.svg','thunderbird.png','org.gnome.Nautilus.png','org.gnome.Rhythmbox3.png','libreoffice-writer.png','snap-store.png','org.gnome.Yelp.png','org.gnome.Ptyxis.png','org.gnome.TextEditor.png','disk-utility-app.png','net.nokyan.Resources.png','org.gnome.Settings.png','org.gnome.Calculator.png','org.gnome.Calendar.png','org.gnome.Loupe.png','org.gnome.clocks.png','libreoffice-calc.png','org.gnome.Weather.png'].map(name=>['apps/'+name,name])])copyFileSync('../public/assets/'+from,'assets/'+to);
copyFileSync('node_modules/gsap/dist/gsap.min.js','assets/gsap.min.js');

// Narração: texto do roteiro, duração medida no mp3 ou estimada enquanto o arquivo não existe.
const rows=Object.fromEntries([...readFileSync('roteiro.md','utf8').matchAll(/^\| (\d\d-[\w-]+)\.mp3 \| [^|]+ \| (.+) \|$/gm)].map(([,file,text])=>[file,text.trim()]));
const spoken=text=>text.replace(/\[[^\]]+\]\s*/g,'');
const caption=text=>spoken(text).replace(/[Pp]ê-dáblio-dê/g,'pwd').replace(/[ÉéEe]le-ésse/g,'ls').replace(/[CcÇ]ê-dê/g,'cd').replace(/[Mm]êique-dir/g,'mkdir').replace(/[Cc]ê-pê/g,'cp').replace(/[ÊêEe]me-vê/g,'mv').replace(/[ÉéEe]rre-ême/g,'rm').replace(/[Ww]ho am I/g,'whoami').replace(/[Hh]elp:/g,'help:').replace(/Touch/g,'touch').replace(/Echo/g,'echo').replace(/notas ponto tê-xis-tê/g,'notas.txt');
const duration=file=>{const path='narracao/'+file+'.mp3';if(!existsSync(path))return null;return Number(execFileSync(ffprobe.path,['-v','error','-show_entries','format=duration','-of','csv=p=0',path]).toString());};
// Mulberry32: digitação com ritmo humano, igual em todo render.
let seed=7;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const esc=text=>String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const at=n=>(+n).toFixed(3);

const camera=[],overlay=[],js=[],sfx=[],audio=[];let uid=0;
const tw=line=>js.push(line);
const id=prefix=>prefix+(uid++);
const show=(sel,t,from={opacity:0,y:30},dur=.5)=>tw(`tl.fromTo('${sel}',${JSON.stringify({...from,display:'block'})},{opacity:1,x:0,y:0,scale:1,rotationX:0,rotationY:0,duration:${dur},ease:'back.out(1.6)'},${at(t)});`);
const hide=(sel,t,dur=.35)=>{tw(`tl.to('${sel}',{opacity:0,duration:${dur},ease:'power1.in'},${at(t)});`);tw(`tl.set('${sel}',{display:'none'},${at(t+dur)});`);};
const sound=(type,t)=>sfx.push({type,t});
// Câmera: aproxima um ponto da cena e evita mostrar as bordas pretas.
const cam=(scale,px,py,t,dur=1.1,ease='power3.inOut')=>{const x=Math.min(0,Math.max(W*(1-scale),W/2-px*scale)),y=Math.min(0,Math.max(H*(1-scale),H/2-py*scale));tw(`tl.to('#camera',{scale:${scale},x:${x.toFixed(1)},y:${y.toFixed(1)},duration:${dur},ease:'${ease}'},${at(t)});`);};
// Cursor grande do Yaru, com anel e som em cada clique.
const move=(x,y,t,dur=.7)=>tw(`tl.to('#cursor',{x:${x},y:${y},duration:${dur},ease:'power2.inOut'},${at(t)});`);
const click=(x,y,t)=>{tw(`tl.to('#cursor',{scale:.82,duration:.07,yoyo:true,repeat:1,transformOrigin:'0 0'},${at(t)});`);tw(`tl.fromTo('#ring',{x:${x-40},y:${y-40},scale:.2,opacity:.95},{scale:1.6,opacity:0,duration:.55,ease:'power2.out'},${at(t)});`);sound('click',t);};
const letters=(prefix,text)=>[...text].map((c,k)=>`<span class="c" id="${prefix}${k}">${esc(c)}</span>`).join('');
const reveal=(prefix,text,t,step=.11)=>{let x=t;for(let k=0;k<text.length;k++){tw(`tl.set('#${prefix}${k}',{display:'inline'},${at(x)});`);if(text[k]!==' ')sound('key',x);x+=step+rnd()*.04;}return x;};
const keycap=(label,x,y,t)=>{const k=id('key');camera.push(`<div class="keycap" id="${k}" style="left:${x}px;top:${y}px">${esc(label)}</div>`);show('#'+k,t,{opacity:0,scale:.4,y:20},.35);hide('#'+k,t+1.3);sound('key',t);};

// Terminal: cada cena tem sua tela; as letras aparecem uma a uma com som de tecla.
const screens=[];
function screen(){const sid=id('scr'),lines=[];screens.push({sid,lines});let last=null;return{sid,lines,
 input(where,command,t,{cps=10,tab='',instant=false,enter=true}={}){const shownAt=typeof instant==='number'?instant:t;const lid=id('ln');const chars=[...command].map((c,k)=>`<span class="c" id="${lid}c${k}">${esc(c)}</span>`).join('');lines.push(`<div class="ln" id="${lid}"><span class="pr">aluno@ubuntu:<i>${esc(where)}</i>$</span> <span class="cmd">${chars}${tab?`<span class="c" id="${lid}tab">${esc(tab)}</span>`:''}</span><span class="caret" id="${lid}k"></span></div>`);tw(`tl.set('#${lid}',{display:'block'},${at(t)});`);let x=t+(instant?0:.35);
  if(instant!==false){x=shownAt;tw(`tl.set('#${lid} .c',{display:'inline'},${at(x)});`);}else for(let k=0;k<command.length;k++){tw(`tl.set('#${lid}c${k}',{display:'inline'},${at(x)});`);if(command[k]!==' ')sound('key',x);x+=(1/cps)*(.7+rnd()*.6);}
  if(tab){x+=.45;tw(`tl.set('#${lid}tab',{display:'inline'},${at(x)});`);tw(`tl.fromTo('#${lid}tab',{color:'#ffd27a'},{color:'#8ae234',duration:.8},${at(x)});`);x+=.2;}
  if(!enter)return{lid,end:x};x+=.35;sound('enter',x);tw(`tl.set('#${lid}k',{display:'none'},${at(x)});`);last=lid;return{lid,end:x+.15};},
 output(text,t,cls=''){const oid=id('out');lines.push(`<div class="out ${cls}" id="${oid}">${esc(text)}</div>`);show('#'+oid,t,{opacity:0,y:12},.35);return t+.4;},
 prompt(where,t){const lid=id('ln');lines.push(`<div class="ln" id="${lid}"><span class="pr">aluno@ubuntu:<i>${esc(where)}</i>$</span> <span class="caret blink" id="${lid}k"></span></div>`);tw(`tl.set('#${lid}',{display:'block'},${at(t)});`);return lid;},
 clear(t){tw(`tl.set('#${sid} .ln, #${sid} .out',{display:'none'},${at(t)});`);}};}
let current=null,flip=1;
// Giro 3D do Terminal antes de cada comando, com zoom chegando perto da linha de digitação.
function spinTo(scr,t,{zoom=1.22,focusY=410}={}){flip=-flip;tw(`tl.to('#term',{rotationY:${88*flip},scale:.86,x:0,opacity:1,duration:.42,ease:'power2.in'},${at(t)});`);if(current)tw(`tl.set('#${current}',{display:'none'},${at(t+.42)});`);tw(`tl.set('#${scr.sid}',{display:'block'},${at(t+.42)});`);tw(`tl.fromTo('#term',{rotationY:${-88*flip}},{rotationY:0,scale:1,duration:.85,ease:'back.out(1.3)'},${at(t+.42)});`);current=scr.sid;sound('whoosh',t);cam(zoom,1004,focusY,t+.5,1.2);return t+1.45;}

// Cartão "Sem o Terminal × Com o Terminal".
function compare(t,end,{title='Sem o Terminal',steps=[],icon='',count='',withLine='',body=''}){const c=id('cmp');camera.push(`<section class="compare" id="${c}"><h3>${esc(title)}</h3>${icon?`<img class="cmp-icon" src="assets/${icon}" alt="">`:''}${body}${steps.length?`<ol>${steps.map((s,k)=>`<li id="${c}s${k}">${s}</li>`).join('')}</ol>`:''}<footer>${count?`<b class="bad">${esc(count)}</b>`:''}${withLine?`<b class="good"><small>Com o Terminal</small>${esc(withLine)}</b>`:''}</footer></section>`);
 cam(1,960,540,t,.9);tw(`tl.to('#term',{x:-300,scale:.74,duration:.9,ease:'power3.inOut'},${at(t)});`);show('#'+c,t+.3,{opacity:0,x:260},.7);sound('pop',t+.35);steps.forEach((_,k)=>show(`#${c}s${k}`,t+.9+k*.55,{opacity:0,x:40},.4));hide('#'+c,end-.45);tw(`tl.to('#term',{x:0,scale:1,duration:.45,ease:'power2.inOut'},${at(end-.5)});`);return c;}
// Janela do app Arquivos simulada dentro do cartão.
function filesWindow(c,places,items){return `<div class="files" id="${c}files"><header><img src="assets/back.svg" alt="">${places.map((p,k)=>`<span id="${c}p${k}"${k?' style="display:none"':''}>${esc(p)}</span>`).join('')}</header><div class="grid" id="${c}grid">${items.map(([name,icon],k)=>`<figure id="${c}i${k}"><img src="assets/${icon}" alt=""><figcaption>${esc(name)}</figcaption></figure>`).join('')}</div></div>`;}

// Cenas: a narração é dividida em frases para sincronizar as animações (sem legenda na tela).
const scenes=[];let clock=0;
function scene(file,minLen,build){const text=rows[file];if(!text)throw Error('Narração ausente no roteiro: '+file);const real=duration(file),narr=real??spoken(text).length/16.5;const len=Math.max(minLen,narr+1.1),t0=clock;clock+=len;
 const sentences=caption(text).match(/.+?[.!?](?=\s|$)/g).map(s=>s.trim()),total=sentences.reduce((a,s)=>a+s.length,0);let acc=0;const starts=sentences.map(s=>{const v=t0+.4+narr*acc/total;acc+=s.length;return v;});
 if(real!==null)audio.push(`<audio id="a${file.slice(0,2)}" src="narracao/${file}.mp3" data-start="${at(t0+.4)}" data-duration="${real.toFixed(3)}" data-track-index="2" data-volume="1"></audio>`);
 scenes.push({file,t0,len,real:real!==null});build({t0,len,end:t0+len,sent:k=>starts[Math.min(k,starts.length-1)]});}
const robotIn=(t,src='robot.png')=>{tw(`tl.set('#robot',{attr:{src:'assets/${src}'}},${at(t)});`);tw(`tl.fromTo('#robot',{y:420,rotation:-12,opacity:1},{y:0,rotation:0,duration:.8,ease:'back.out(1.7)'},${at(t)});`);sound('pop',t+.1);};
const robotOut=t=>tw(`tl.to('#robot',{y:420,duration:.5,ease:'power2.in'},${at(t)});`);
const home=[['Área de Trabalho','user-desktop.png'],['Documentos','folder-documents.png'],['Downloads','folder-download.png'],['Imagens','folder-pictures.png'],['Música','folder-music.png']];

scene('01-abertura',12,({t0,end})=>{tw(`tl.fromTo('#camera',{scale:1.12,x:-115,y:-65},{scale:1,x:0,y:0,duration:6,ease:'power2.out'},${at(t0)});`);robotIn(t0+.6);
 camera.push(`<div class="title" id="title"><h1>${[...'O TERMINAL'].map(c=>`<span>${c===' '?'&nbsp;':c}</span>`).join('')}</h1><p>o chat com o computador</p></div>`);tw(`tl.set('#title',{display:'block'},${at(t0+1)});`);tw(`tl.fromTo('#title h1 span',{y:140,opacity:0,rotationX:-90},{y:0,opacity:1,rotationX:0,duration:.7,stagger:.07,ease:'back.out(1.8)'},${at(t0+1)});`);show('#title p',t0+2,{opacity:0,y:30},.6);sound('whoosh',t0+1);
 const s=screen();s.prompt('~',t0);tw(`tl.set('#term',{opacity:0},0);`);tw(`tl.set('#robot',{y:420},0);`);tw(`tl.to('#title',{y:-280,scale:.5,duration:1,ease:'power3.inOut'},${at(t0+6.2)});`);tw(`tl.set('#${s.sid}',{display:'block'},${at(t0+6)});`);tw(`tl.fromTo('#term',{rotationY:-75,rotationX:18,scale:.4,opacity:0},{rotationY:0,rotationX:0,scale:.8,opacity:1,y:90,duration:1.3,ease:'back.out(1.2)'},${at(t0+6.4)});`);sound('whoosh',t0+6.4);current=s.sid;
 hide('#title',end-.4);robotOut(end-.5);});
scene('02-o-que-e',10,({t0,end,sent})=>{tw(`tl.to('#term',{x:270,y:0,scale:.72,duration:.9,ease:'power3.inOut'},${at(t0)});`);
 camera.push(`<div class="chat" id="chat"><header>Chat</header><p class="me" id="b1">quem sou eu?</p><p class="pc" id="b2">aluno</p><p class="me" id="b3">onde estou?</p><p class="pc" id="b4">/home/aluno</p></div><b class="equal" id="eq">=</b>`);show('#chat',t0+.4,{opacity:0,x:-200},.6);
 const s=screen();tw(`tl.set('#${current}',{display:'none'},${at(t0+.5)});`);tw(`tl.set('#${s.sid}',{display:'block'},${at(t0+.5)});`);current=s.sid;
 let t=sent(1);show('#b1',t,{opacity:0,scale:.5},.35);sound('pop',t);let r=s.input('~','whoami',t+.2);show('#b2',r.end,{opacity:0,scale:.5},.35);sound('pop',r.end);s.output('aluno',r.end);
 t=Math.max(r.end+.8,sent(2));show('#b3',t,{opacity:0,scale:.5},.35);sound('pop',t);r=s.input('~','pwd',t+.2);show('#b4',r.end,{opacity:0,scale:.5},.35);s.output('/home/aluno',r.end);show('#eq',r.end+.3,{opacity:0,scale:3},.5);
 camera.push(`<div class="tag" id="tagcmd">comando ↓</div>`);show('#tagcmd',sent(3),{opacity:0,y:-30},.45);sound('pop',sent(3));
 hide('#chat',end-1.4);hide('#eq',end-1.4);hide('#tagcmd',end-1.4);tw(`tl.to('#term',{x:0,y:0,scale:1,duration:1.1,ease:'power2.inOut'},${at(end-1.1)});`);});
scene('03-anatomia',12,({t0,end,sent})=>{const s=screen();tw(`tl.set('#${current}',{display:'none'},${at(t0)});`);tw(`tl.set('#${s.sid}',{display:'block'},${at(t0)});`);current=s.sid;
 const parts=[['aluno','seu usuário'],['@ubuntu','nome do computador'],[':~','pasta pessoal'],['$','pode digitar!']];
 s.lines.push(`<div class="ln anat" style="display:block">${parts.map(([p,l],k)=>`<span class="part" id="part${k}">${esc(p)}<small id="lab${k}">${esc(l)}</small></span>`).join('')}<span class="caret"></span></div>`);
 tw(`tl.to('#term .body',{opacity:0,duration:.25},${at(t0-.25)});`);tw(`tl.to('#term .body',{opacity:1,duration:.4},${at(t0)});`);tw(`tl.to('#term',{rotationX:-6,rotationY:5,duration:1,ease:'sine.inOut'},${at(t0)});`);tw(`tl.to('#term',{rotationX:0,rotationY:0,duration:1.2,ease:'sine.inOut'},${at(t0+1)});`);cam(2.05,700,300,t0+.2,2.2,'power2.inOut');sound('whoosh',t0+.3);
 parts.forEach((_,k)=>{const t=sent(k+1);tw(`tl.to('#part${k}',{color:'#ffd27a',duration:.3},${at(t)});`);show('#lab'+k,t,{opacity:0,y:-20,scale:.6},.45);sound('pop',t);if(k)tw(`tl.to('#part${k-1}',{color:'#8ae234',duration:.3},${at(t)});`);});
 cam(1,960,540,end-1,1);});
scene('04-para-que-serve',13,({t0,end,sent})=>{tw(`tl.to('#term',{scale:.6,opacity:.25,y:60,duration:.8},${at(t0)});`);robotIn(t0+.2);
 const cards=[['disk-utility-app.png','Consertar problemas'],['snap-store.png','Instalar programas'],['net.nokyan.Resources.png','Cuidar de servidores'],['org.gnome.Ptyxis.png','Fazer rápido']];
 camera.push(`<div class="uses">${cards.map(([icon,label],k)=>`<article id="use${k}"><img src="assets/${icon}" alt=""><h3>${esc(label)}</h3></article>`).join('')}</div><div class="badge" id="pro">Coisa de profissional!</div>`);
 cards.forEach((_,k)=>{const t=sent(1)+k*.7;show('#use'+k,t,{opacity:0,y:120,rotationX:-60},.6);sound('pop',t);});show('#pro',sent(3),{opacity:0,scale:.3},.6);sound('pop',sent(3));
 cards.forEach((_,k)=>hide('#use'+k,end-.5));hide('#pro',end-.5);robotOut(end-.6);});
scene('05-abrir',10,({t0,end})=>{tw(`tl.to('#term',{scale:.2,opacity:0,duration:.5,ease:'power2.in'},${at(t0)});`);tw(`tl.set('#cursor',{x:900,y:620,opacity:1},${at(t0)});`);
 move(44,1036,t0+.4,1);click(44,1036,t0+1.5);show('#grid',t0+1.6,{opacity:0,scale:1.08},.4);
 let x=t0+2.3;const word='Terminal';for(let k=0;k<word.length;k++){tw(`tl.set('#q${k}',{display:'inline'},${at(x)});`);sound('key',x);x+=.11+rnd()*.05;}
 tw(`tl.to('#gridall',{opacity:0,duration:.2},${at(x)});`);show('#gridres',x+.1,{opacity:0,scale:.8},.4);move(972,415,x+.3,.8);click(972,415,x+1.2);
 hide('#grid',x+1.35,.3);const s=screen();s.prompt('~',x+1.4);tw(`tl.set('#${current}',{display:'none'},${at(x+1.4)});`);tw(`tl.set('#${s.sid}',{display:'block'},${at(x+1.4)});`);current=s.sid;
 tw(`tl.fromTo('#term',{scale:.08,x:-32,y:-115,opacity:0,rotationY:0,rotationX:0},{scale:1,x:0,y:0,opacity:1,duration:.75,ease:'back.out(1.2)'},${at(x+1.4)});`);sound('whoosh',x+1.4);tw(`tl.to('#cursor',{opacity:0,duration:.3},${at(end-.4)});`);});
const cmd=(file,minLen,fn)=>scene(file,minLen,({t0,end,sent})=>{const s=screen();const t=spinTo(s,t0);fn({s,t,end,sent});});
cmd('06-help',10,({s,t,end,sent})=>{const r=s.input('~','help',t);s.output('pwd  ls  cd  mkdir  touch  cat\necho  cp  mv  rm  clear  whoami  help',r.end);compare(Math.max(r.end+1.5,sent(2)),end,{title:'Sem o Terminal',icon:'org.gnome.Yelp.png',steps:['Abrir o app Ajuda','Procurar o assunto'],withLine:'help'});});
cmd('07-whoami-pwd',10,({s,t,end,sent})=>{let r=s.input('~','whoami',t);s.output('aluno',r.end);r=s.input('~','pwd',Math.max(r.end+.6,sent(2)-.6));s.output('/home/aluno',r.end);compare(Math.max(r.end+1,sent(3)),end,{steps:['Olhar o nome na tela de entrada','Abrir Arquivos e ler o caminho'],icon:'org.gnome.Nautilus.png',count:'2 lugares diferentes',withLine:'whoami e pwd'});});
cmd('08-ls',10.5,({s,t,end,sent})=>{const r=s.input('~','ls',t);s.output('Área de Trabalho/  Documentos/\nDownloads/  Imagens/  Música/',r.end);const c=id('cmp');compare(Math.max(r.end+1.2,sent(2)),end,{title:'É o mesmo que…',body:filesWindow(c,['Pasta pessoal'],home),withLine:'ls'});});
cmd('09-cd',10,({s,t,end,sent})=>{const r=s.input('~','cd Documentos',t);const p=s.prompt('~/Documentos',r.end);tw(`tl.fromTo('#${p} i',{color:'#ffd27a',textShadow:'0 0 24px #ffd27a'},{color:'#8fb8ff',textShadow:'0 0 0px #ffd27a',duration:1.6},${at(r.end+.1)});`);
 const tc=Math.max(r.end+1.4,sent(1));const c=compare(tc,end,{title:'Sem o Terminal',body:filesWindow('f09',['Pasta pessoal','Documentos'],[...home,['Boas-vindas.txt','text.svg']]),count:'Dois cliques na pasta',withLine:'cd Documentos'});tw(`tl.set('#cursor',{x:1500,y:900,opacity:1},${at(tc+.8)});`);tw(`tl.set('#f09i5',{display:'none'},0);`);move(1545,398,tc+1,.8);click(1545,398,tc+1.9);click(1545,398,tc+2.1);tw(`tl.set('#f09grid figure, #f09p0',{display:'none'},${at(tc+2.3)});`);tw(`tl.set('#f09p1, #f09i5',{display:'block'},${at(tc+2.3)});`);tw(`tl.fromTo('#${p} i',{color:'#ffd27a'},{color:'#8fb8ff',duration:1.4},${at(sent(2))});`);tw(`tl.to('#cursor',{opacity:0,duration:.3},${at(end-.6)});`);});
cmd('10-cd-voltar',9,({s,t,end,sent})=>{const r=s.input('~/Documentos','cd ..',t);const p=s.prompt('~',r.end);tw(`tl.fromTo('#${p} i',{color:'#ffd27a'},{color:'#8fb8ff',duration:1.4},${at(r.end+.1)});`);
 const tc=Math.max(r.end+1.2,sent(2));compare(tc,end,{title:'Sem o Terminal',body:filesWindow('f10',['Documentos','Pasta pessoal'],[['Boas-vindas.txt','text.svg'],...home]),count:'Botão Voltar ←',withLine:'cd ..'});tw(`tl.set('#cursor',{x:1700,y:900,opacity:1},${at(tc+.8)});`);tw(`tl.set('#f10i1, #f10i2, #f10i3, #f10i4, #f10i5',{display:'none'},0);`);move(1292,303,tc+1,.8);click(1292,303,tc+1.9);tw(`tl.set('#f10p0, #f10i0',{display:'none'},${at(tc+2)});`);tw(`tl.set('#f10p1, #f10i1, #f10i2, #f10i3, #f10i4, #f10i5',{display:'block'},${at(tc+2)});`);tw(`tl.to('#cursor',{opacity:0,duration:.3},${at(end-.6)});`);});
cmd('11-mkdir',12,({s,t,end,sent})=>{const r=s.input('~/Documentos','mkdir treino',t);
 const tc=Math.max(r.end+.5,sent(2));const body=filesWindow('f11',['Documentos'],[['Boas-vindas.txt','text.svg'],['treino','folder.png']])+`<div class="menu" id="f11menu"><p>Nova pasta</p><p>Novo documento</p><p>Colar</p></div><div class="dialog" id="f11dlg"><b>Nova pasta</b><span class="field">${letters('f11f','treino')}</span><i>Criar</i></div>`;
 compare(tc,end,{title:'Sem o Terminal',body,count:'4 passos',withLine:'1 linha'});tw(`tl.set('#f11i1',{display:'none'},0);`);tw(`tl.set('#cursor',{x:1750,y:950,opacity:1},${at(tc+.8)});`);
 const steps=[];let x=tc+1;move(1640,600,x,.7);x+=.8;click(1640,600,x);show('#f11menu',x+.05,{opacity:0,scale:.7},.2);steps.push(x);
 move(1720,624,x+.4,.45);x+=1;click(1720,624,x);hide('#f11menu',x+.1,.15);tw(`tl.fromTo('#f11dlg',{opacity:0,scale:.8,display:'flex'},{opacity:1,scale:1,duration:.25},${at(x+.15)});`);steps.push(x);
 x=reveal('f11f','treino',x+.5,.12);steps.push(x-.12);
 move(1664,471,x+.1,.5);x+=.7;click(1664,471,x);hide('#f11dlg',x+.1,.2);show('#f11i1',x+.25,{opacity:0,scale:.3},.4);steps.push(x);
 camera.push(`<div class="steps" id="f11steps">${[1,2,3,4].map(n=>`<span id="f11n${n}">${n}</span>`).join('')}</div>`);show('#f11steps',tc+.9,{opacity:0},.3);steps.forEach((v,k)=>tw(`tl.to('#f11n${k+1}',{backgroundColor:'#ff8a3d',color:'#fff',scale:1.15,duration:.25},${at(v)});`));hide('#f11steps',end-.45);
 const glow=Math.max(x+.6,sent(3));tw(`tl.fromTo('#term',{boxShadow:'0 30px 80px #0008, 0 0 0 0px #8ae234'},{boxShadow:'0 30px 80px #0008, 0 0 0 12px #8ae234',duration:.4,yoyo:true,repeat:3},${at(glow)});`);tw(`tl.to('#cursor',{opacity:0,duration:.3},${at(end-.6)});`);});
cmd('12-touch',11,({s,t,end,sent})=>{let r=s.input('~/Documentos/treino','touch notas.txt',t);r=s.input('~/Documentos/treino','ls',r.end+.4);s.output('notas.txt',r.end);compare(r.end+1,end,{title:'Sem o Terminal',icon:'org.gnome.Nautilus.png',steps:['Botão direito','Novo documento','Digitar o nome'],count:'3 passos',withLine:'1 linha'});});
cmd('13-echo-cat',11,({s,t,end,sent})=>{let r=s.input('~/Documentos/treino','echo Eu sei usar o Terminal > notas.txt',t,{cps:13});r=s.input('~/Documentos/treino','cat notas.txt',Math.max(r.end+.5,sent(2)-.8));s.output('Eu sei usar o Terminal',r.end,'big');compare(Math.max(r.end+1.2,sent(3)),end,{title:'Sem o Terminal',icon:'org.gnome.TextEditor.png',steps:['Abrir o Editor de Texto','Escrever o texto','Salvar o arquivo','Abrir de novo para ler'],count:'4 passos',withLine:'echo e cat'});});
cmd('14-cp',11,({s,t,end,sent})=>{let r=s.input('~/Documentos/treino','cp notas.txt copia.txt',t,{cps:12});r=s.input('~/Documentos/treino','ls',r.end+.4);s.output('copia.txt  notas.txt',r.end);compare(Math.max(r.end+.8,sent(2)),end,{title:'Sem o Terminal',icon:'org.gnome.Nautilus.png',steps:['Copiar (Ctrl+C)','Colar (Ctrl+V)','Renomear a cópia'],count:'3 passos',withLine:'1 linha'});});
cmd('15-mv',11,({s,t,end,sent})=>{let r=s.input('~/Documentos/treino','mv copia.txt resumo.txt',t,{cps:12});r=s.input('~/Documentos/treino','ls',r.end+.4);s.output('notas.txt  resumo.txt',r.end);compare(Math.max(r.end+.8,sent(2)),end,{title:'Sem o Terminal',icon:'org.gnome.Nautilus.png',steps:['Botão direito no arquivo','Renomear','Digitar o nome novo'],count:'3 passos',withLine:'1 linha'});});
cmd('16-rm',9,({s,t,end,sent})=>{const r=s.input('~/Documentos/treino','rm resumo.txt',t,{enter:false});camera.push(`<div class="warn" id="warn">⚠ Confira o nome!</div>`);show('#warn',r.end+.1,{opacity:0,scale:2.5},.4);sound('pop',r.end+.1);tw(`tl.to('#warn',{scale:1.08,duration:.35,yoyo:true,repeat:3},${at(r.end+.5)});`);hide('#warn',r.end+2.2);
 const e=r.end+2.3;sound('enter',e);tw(`tl.set('#${r.lid}k',{display:'none'},${at(e)});`);let r2=s.input('~/Documentos/treino','ls',e+.4);s.output('notas.txt',r2.end);compare(Math.max(r2.end+.8,sent(2)),end,{title:'Atenção',icon:'trash.png',steps:['Apagar pelo Arquivos: vai para a Lixeira','rm: some na hora, sem Lixeira'],count:'Confira antes do Enter',withLine:'rm'});});
cmd('17-atalhos',10,({s,t,end,sent})=>{let r=s.input('~/Documentos/treino','cd',t);r=s.input('~','cd Doc',Math.max(r.end+.3,sent(1)-.4),{tab:'umentos/'});keycap('Tab',1180,540,r.end-.7);
 const tc=Math.max(r.end+.6,sent(2));s.clear(tc);r=s.input('~/Documentos','clear',tc+.1);s.clear(r.end+.1);const up=Math.max(r.end+.9,sent(3));s.input('~/Documentos','clear',r.end+.15,{instant:up,enter:false});keycap('↑',1180,540,up-.1);});
scene('18-resumo',14,({t0,end,sent})=>{tw(`tl.to('#term',{rotationY:90,scale:.6,opacity:0,duration:.6,ease:'power2.in'},${at(t0)});`);sound('whoosh',t0);cam(1,960,540,t0,.6);
 const items=[['help','ajuda'],['whoami','quem sou eu'],['pwd','onde estou'],['ls','listar'],['cd','entrar'],['cd ..','voltar'],['mkdir','criar pasta'],['touch','criar arquivo'],['echo','escrever'],['cat','ler'],['cp','copiar'],['mv','renomear'],['rm','apagar'],['Tab ↑ clear','truques']];
 camera.push(`<div class="recap" id="recap">${items.map(([c,m],k)=>`<article id="rc${k}"><code>${esc(c)}</code><p>${esc(m)}</p></article>`).join('')}</div>`);tw(`tl.set('#recap',{display:'grid'},${at(t0+.3)});`);
 const map=[0,1,1,2,3,3,4,5,6,6,7,8,9,9];items.forEach((_,k)=>{const v=sent(1+map[k])+(k&&map[k]===map[k-1]?.4:0);show('#rc'+k,v,{opacity:0,scale:.3,rotationY:-90},.45);sound('pop',v);});tw(`tl.fromTo('#recap',{scale:1},{scale:1.04,duration:${(end-t0).toFixed(2)},ease:'none'},${at(t0)});`);hide('#recap',end-.5);});
scene('19-final',13.5,({t0,end,sent})=>{robotIn(t0+.3,'robot-celebrate.png');camera.push(`<div class="final" id="final"><img src="assets/trail.svg" alt=""><h2>Primeiros passos no Terminal</h2><p>12 missões no OSLINUX</p><div class="bora" id="bora"><span class="pr">aluno@ubuntu:~$</span> <span>${letters('bora','bora digitar!')}</span><span class="caret blink"></span></div></div>`);
 tw(`tl.set('#final',{display:'block'},${at(t0+.2)});`);tw(`tl.fromTo('#final img',{rotationY:-180,scale:.2,opacity:0},{rotationY:0,scale:1,opacity:1,duration:1.2,ease:'back.out(1.4)'},${at(t0+.2)});`);sound('whoosh',t0+.2);show('#final h2',t0+1,{opacity:0,y:40},.6);show('#final p',t0+1.4,{opacity:0,y:30},.6);
 show('#bora',sent(2)-.3,{opacity:0,y:30},.4);reveal('bora','bora digitar!',sent(2)+.4,.1);
 tw(`tl.to('#fade',{opacity:1,duration:.8},${at(end-.8)});`);});

const total=clock;
// Caret piscando: repetição finita, sem relógio do navegador.
tw(`tl.to('.caret.blink',{opacity:0,duration:.45,repeat:${Math.floor(total/.45)-1},yoyo:true,ease:'steps(1)'},0);`);

// Sons sintetizados: clique do mouse, teclas, Enter, giro (whoosh) e "pop".
const pcm=new Float32Array(Math.ceil((total+1)*SR));
function add(t,len,fn){const start=Math.floor(t*SR);for(let i=0;i<len*SR&&start+i<pcm.length;i++)pcm[start+i]+=fn(i/SR);}
const noise=()=>rnd()*2-1;
for(const{type,t}of sfx){
 if(type==='key'){const a=.22+rnd()*.12,f=1800+rnd()*900;let lp=0;add(t,.035,x=>{lp+=.5*(noise()-lp);return a*Math.exp(-x*190)*(lp*.7+.5*Math.sin(2*Math.PI*f*x));});}
 if(type==='enter'){add(t,.06,x=>.42*Math.exp(-x*120)*(noise()*.5+.6*Math.sin(2*Math.PI*140*x)));}
 if(type==='click'){for(const[d,a]of [[0,.55],[.075,.35]])add(t+d,.02,x=>a*Math.exp(-x*420)*(noise()*.6+.6*Math.sin(2*Math.PI*3800*x)));}
 if(type==='whoosh'){let lp=0;add(t,.7,x=>{lp+=(.02+.25*Math.sin(Math.PI*x/.7)**2)*(noise()-lp);return .55*Math.sin(Math.PI*x/.7)**2*lp;});}
 if(type==='pop'){add(t,.09,x=>.2*Math.exp(-x*45)*Math.sin(2*Math.PI*(520+3200*x)*x));}}
const wav=Buffer.alloc(44+pcm.length*2);wav.write('RIFF',0);wav.writeUInt32LE(36+pcm.length*2,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(SR,24);wav.writeUInt32LE(SR*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(pcm.length*2,40);
pcm.forEach((v,i)=>wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+i*2));
writeFileSync('assets/sfx.wav',wav);execFileSync(ffmpeg,['-y','-loglevel','error','-i','assets/sfx.wav','-b:a','160k','assets/sfx.mp3']);unlinkSync('assets/sfx.wav');

const dock=['firefox.svg','thunderbird.png','org.gnome.Nautilus.png','org.gnome.Rhythmbox3.png','libreoffice-writer.png','snap-store.png','org.gnome.Yelp.png','basics.png'];
const gridApps=['org.gnome.Calculator.png','org.gnome.Calendar.png','org.gnome.clocks.png','org.gnome.Loupe.png','org.gnome.Settings.png','snap-store.png','org.gnome.TextEditor.png','libreoffice-calc.png','org.gnome.Weather.png','firefox.svg','org.gnome.Nautilus.png','org.gnome.Yelp.png'];
const html=`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=${W}, height=${H}"/>
<script src="assets/gsap.min.js"></script>
<style>
@font-face{font-family:'Ubuntu Sans';src:url('assets/UbuntuSans.ttf');font-weight:100 900}
@font-face{font-family:'Ubuntu Sans Mono';src:url('assets/UbuntuSansMono.ttf');font-weight:100 900}
@font-face{font-family:'Barlow';src:url('assets/Barlow.ttf');font-weight:700}
*{box-sizing:border-box}body{margin:0;background:#000}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#000;font-family:'Ubuntu Sans',sans-serif;color:#fff}
#camera{position:absolute;inset:0;transform-origin:0 0}
.wall{position:absolute;inset:0;background:url('assets/wallpaper.webp') center/cover}
.topbar{position:absolute;left:0;right:0;top:0;height:40px;background:#131313;display:flex;justify-content:center;align-items:center;font-size:20px;font-weight:600}
.topbar span{position:absolute;right:24px;letter-spacing:10px;font-size:16px;opacity:.9}
.dock{position:absolute;left:0;top:40px;bottom:0;width:88px;background:#131313;display:flex;flex-direction:column;align-items:center;gap:16px;padding-top:16px}
.dock img{width:58px;height:58px;object-fit:contain}.dock .apps{position:absolute;bottom:22px;width:44px;height:44px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:4px}.dock .apps i{width:8px;height:8px;border-radius:50%;background:#fff}
#termwrap{position:absolute;left:364px;top:160px;width:1280px;height:740px;perspective:2200px}
#term{width:100%;height:100%;border-radius:18px;overflow:hidden;background:#300a24;box-shadow:0 30px 80px #0008;will-change:transform}
#term>header{height:56px;background:#2b2b2b;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:600;color:#eee;position:relative}
#term>header b{position:absolute;right:18px;display:flex;gap:12px}#term>header b i{width:22px;height:22px;border-radius:50%;background:#555}#term>header b i:last-child{background:#e95420}
.body{padding:30px 40px;font-family:'Ubuntu Sans Mono',monospace;font-size:46px;line-height:1.36}
.scr{display:none}.ln{display:none;white-space:pre-wrap;overflow-wrap:anywhere}.ln .pr{color:#8ae234;font-weight:700}.ln .pr i{font-style:normal;color:#8fb8ff}
.c{display:none}.caret{display:inline-block;width:.58em;height:1.05em;background:#fff;vertical-align:-.18em;margin-left:2px}
.out{display:none;white-space:pre-wrap;color:#f3f3f3}.out.big{font-size:54px;color:#ffd27a}
.anat .part{position:relative;display:inline-block;color:#8ae234;font-weight:700}.anat .part:nth-child(3){color:#8fb8ff}.anat .part:nth-child(4){color:#fff}
.anat .part{margin-right:34px}.anat .part:nth-child(even) small{top:calc(100% + 70px)}.anat small{display:none;position:absolute;top:100%;left:50%;margin-left:-110px;width:220px;text-align:center;font:600 21px/1.2 'Ubuntu Sans',sans-serif;color:#ffd27a;padding-top:8px;border-top:3px solid #ffd27a}
#cursor{position:absolute;left:0;top:0;width:58px;height:84px;opacity:0;z-index:50;filter:drop-shadow(0 6px 8px #0008)}
#ring{position:absolute;left:0;top:0;width:80px;height:80px;border-radius:50%;border:6px solid #ffd27a;opacity:0;z-index:49}
.title{display:none;position:absolute;left:88px;right:0;top:250px;text-align:center}.title h1{font:700 230px/1 Barlow,sans-serif;margin:0;letter-spacing:8px;text-shadow:0 12px 40px #000a;perspective:800px}.title h1 span{display:inline-block}
.title p{display:none;font-size:64px;margin:12px 0 0;color:#ffd27a;font-weight:600;text-shadow:0 6px 24px #000a}
#robot{position:absolute;left:110px;bottom:120px;height:330px;z-index:40}
.chat{display:none;position:absolute;left:150px;top:200px;width:560px;padding:26px;border-radius:28px;background:#f4f2f8;box-shadow:0 30px 70px #0007}.chat header{color:#555;font-weight:700;font-size:26px;text-align:center;margin-bottom:20px}
.chat p{display:none;margin:14px 0;padding:16px 26px;border-radius:26px;font-size:38px;width:max-content;max-width:90%}.chat .me{margin-left:auto;background:#5e2ca5;color:#fff;border-bottom-right-radius:6px}.chat .pc{background:#fff;color:#222;border-bottom-left-radius:6px;font-family:'Ubuntu Sans Mono',monospace}
.equal{display:none;position:absolute;left:712px;top:430px;font:700 150px Barlow,sans-serif;color:#ffd27a;text-shadow:0 8px 30px #000a}
.tag,.badge,.warn{display:none;position:absolute;font-weight:700;border-radius:18px;padding:12px 28px;box-shadow:0 14px 40px #0008}
.tag{left:1100px;top:250px;font-size:42px;background:#ffd27a;color:#2b183e}
.uses{position:absolute;left:150px;right:60px;top:270px;display:flex;gap:34px;justify-content:center;perspective:1200px}.uses article{display:none;width:370px;padding:36px 20px;border-radius:30px;background:#ffffffee;color:#2b183e;text-align:center;box-shadow:0 26px 60px #0007}.uses img{width:150px;height:150px}.uses h3{font:700 54px/1.05 Barlow,sans-serif;margin:16px 0 0}
.badge{left:50%;top:740px;margin-left:-330px;width:660px;text-align:center;font-size:56px;background:#e95420;color:#fff}
#grid{display:none;position:absolute;left:88px;top:40px;right:0;bottom:0;background:#000000b8}#grid .search{position:absolute;left:50%;top:60px;width:560px;margin-left:-280px;padding:16px 26px;border-radius:40px;background:#ffffff26;font-size:34px;border:3px solid #e95420;min-height:76px}
#grid .search .c{display:none}#gridall{position:absolute;left:220px;right:220px;top:220px;display:grid;grid-template-columns:repeat(6,1fr);gap:50px;justify-items:center}#gridall img{width:120px;height:120px}
#gridres{display:none;position:absolute;left:0;right:0;top:300px;display:none}#gridres figure{position:absolute;margin:0;width:260px;text-align:center;font-size:30px;font-weight:600}#gridres img{width:150px;height:150px}
.compare{display:none;position:absolute;left:1220px;top:150px;width:650px;min-height:760px;padding:30px 34px;border-radius:30px;background:#fbf9fd;color:#251a35;box-shadow:0 30px 80px #0009}
.compare h3{margin:0 0 14px;font:700 64px/1 Barlow,sans-serif;color:#e95420}.compare .cmp-icon{position:absolute;right:30px;top:24px;width:96px;height:96px}
.compare ol{margin:24px 0 0;padding:0;list-style:none;counter-reset:step}.compare li{display:none;counter-increment:step;font-size:38px;line-height:1.25;margin:0 0 20px;padding-left:66px;position:relative}.compare li::before{content:counter(step);position:absolute;left:0;top:-2px;width:48px;height:48px;border-radius:50%;background:#e95420;color:#fff;font-size:30px;font-weight:700;display:grid;place-items:center}
.compare footer{position:absolute;left:34px;right:34px;bottom:30px;display:flex;flex-direction:column;gap:14px}.compare footer b{font-size:36px;padding:14px 20px;border-radius:16px;text-align:center}.compare .bad{background:#ffe6d8;color:#b3400f}.compare .good{background:#e2f6df;color:#226b2b;font-family:'Ubuntu Sans Mono',monospace}.compare .good small{display:block;font:600 24px 'Ubuntu Sans',sans-serif;margin-bottom:2px}
.files{position:relative;margin-top:16px;border-radius:16px;overflow:visible;background:#fff;border:2px solid #ddd;color:#222;height:380px}.files header{height:58px;display:flex;align-items:center;gap:18px;padding:0 16px;background:#ececec;border-radius:14px 14px 0 0;font-size:28px;font-weight:700}.files header img{width:44px;height:44px;padding:6px;border-radius:10px;background:#fff}
.files .grid{display:grid;grid-template-columns:repeat(3,1fr);padding:16px}.files figure{margin:0;height:150px;text-align:center}.files figure img{display:block;margin:0 auto 6px;width:100px;height:100px;object-fit:contain}.files figcaption{font-size:24px;text-align:center;line-height:1.1}
.menu,.dialog{display:none;position:absolute;background:#fff;color:#222;border-radius:14px;box-shadow:0 14px 40px #0006;z-index:5}.menu{left:400px;top:440px;width:290px;padding:8px}.menu p{margin:0;padding:12px 16px;font-size:28px;border-radius:8px}.menu p:first-child{background:#f1e6ff}
.dialog{left:70px;top:150px;width:460px;padding:22px;display:none;flex-direction:column;gap:14px}.dialog b{font-size:30px}.dialog .field{display:block;height:58px;border:3px solid #e95420;border-radius:10px;padding:8px 14px;font-size:32px}.dialog i{align-self:flex-end;font-style:normal;background:#3a9d5d;color:#fff;padding:10px 26px;border-radius:10px;font-size:28px;font-weight:700}
.steps{display:none;position:absolute;left:1650px;top:180px}.steps span{display:inline-grid;place-items:center;width:50px;height:50px;margin-right:8px;border-radius:50%;background:#eee;color:#555;font-size:32px;font-weight:700}
.keycap{display:none;position:absolute;min-width:150px;padding:20px 30px;border-radius:20px;background:linear-gradient(#fff,#ddd);color:#222;font-size:64px;font-weight:700;text-align:center;box-shadow:0 10px 0 #999,0 24px 50px #0009;z-index:30}
.warn{left:560px;top:520px;font-size:64px;background:#d93025;color:#fff;z-index:30}
.recap{display:none;position:absolute;left:150px;right:60px;top:110px;grid-template-columns:repeat(5,1fr);gap:24px;perspective:1400px}.recap article{display:none;padding:22px 20px;border-radius:22px;background:#300a24ee;border:3px solid #ffffff2a;box-shadow:0 18px 40px #0007}
.recap code{display:block;font:700 54px 'Ubuntu Sans Mono',monospace;color:#8ae234}.recap p{margin:6px 0 0;font-size:34px;font-weight:600}
.final{display:none;position:absolute;left:88px;right:0;top:120px;text-align:center;perspective:1200px}.final img{width:340px;height:340px}.final h2{display:none;font:700 110px/1 Barlow,sans-serif;margin:20px 0 10px;text-shadow:0 10px 30px #000a}.final p{display:none;font-size:52px;margin:0;color:#ffd27a;font-weight:600}
.bora{display:none;margin:34px auto 0;width:max-content;padding:18px 34px;border-radius:18px;background:#300a24;font:700 60px 'Ubuntu Sans Mono',monospace;box-shadow:0 20px 50px #0009}.bora .pr{color:#8ae234}
#fade{position:absolute;inset:0;background:#000;opacity:0;z-index:100}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${total.toFixed(2)}" data-width="${W}" data-height="${H}" data-fps="30">
<div id="camera">
<div class="wall"></div>
<div class="topbar">2 de nov 16:14<span>◉ ◉ ◉</span></div>
<div class="dock">${dock.map(icon=>`<img src="assets/${icon}" alt="">`).join('')}<div class="apps">${'<i></i>'.repeat(9)}</div></div>
<div id="termwrap"><div id="term"><header>aluno@ubuntu: ~<b><i></i><i></i><i></i></b></header><div class="body">${screens.map(({sid,lines})=>`<div class="scr" id="${sid}">${lines.join('')}</div>`).join('')}</div></div></div>
<div id="grid"><div class="search">${[...'Terminal'].map((c,k)=>`<span class="c" id="q${k}">${c}</span>`).join('')}<span class="caret"></span></div><div id="gridall">${gridApps.map(icon=>`<img src="assets/${icon}" alt="">`).join('')}</div><div id="gridres"><figure style="left:754px"><img src="assets/org.gnome.Ptyxis.png" alt=""><figcaption>Terminal</figcaption></figure><figure style="left:1034px"><img src="assets/trail.svg" alt=""><figcaption>Primeiros passos no Terminal</figcaption></figure></div></div>
${camera.join('\n')}
<img id="robot" src="assets/robot.png" alt="">
<div id="ring"></div>
<svg id="cursor" viewBox="0 0 29 42"><path d="M2 2 L2 33 L9.5 26 L14.5 38 L19.5 36 L14.5 24.5 L25 24.5 Z" fill="#fff" stroke="#111" stroke-width="2.2" stroke-linejoin="round"/></svg>
</div>
${overlay.join('\n')}
<div id="fade"></div>
<audio id="sfx" src="assets/sfx.mp3" data-start="0" data-duration="${total.toFixed(2)}" data-track-index="3" data-volume="0.7"></audio>
${audio.join('\n')}
</div>
<script>
window.__timelines=window.__timelines||{};
const tl=gsap.timeline({paused:true,defaults:{immediateRender:false}});
${js.join('\n')}
tl.set({},{},${total.toFixed(2)});
window.__timelines.main=tl;
</script>
</body>
</html>
`;
writeFileSync('index.html',html);
console.log(`index.html: ${total.toFixed(1)} s, ${scenes.length} cenas, ${scenes.filter(s=>s.real).length} narrações reais, ${sfx.length} sons`);
for(const s of scenes)console.log(`${s.real?'✔':'…'} ${s.file.padEnd(18)} início ${s.t0.toFixed(1).padStart(6)} s  duração ${s.len.toFixed(1)} s`);
