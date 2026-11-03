import test from 'node:test';
import assert from 'node:assert/strict';
import {createStore,executeTerminal,HOME} from '../src/core/model.js';
import {createMissionEngine,missionView} from '../src/learning/missions.js';
import {extraTrails,kitCatalog} from '../src/learning/trails.js';
import {HTML_TEMPLATE} from '../src/core/kit.js';
const definition=extraTrails.find(trail=>trail.id==='kitlab');
function setup(){const data=new Map(),storage={getItem:key=>data.get(key),setItem:(key,value)=>data.set(key,value)},store=createStore(storage),engine=createMissionEngine(store,storage,false,definition);const type=(...commands)=>{for(const command of commands){const result=executeTerminal(store,command);assert.ok(!result.error,command+': '+result.output);}};return{store,engine,type,storage};}
const emit=(store,type,detail)=>store.events.emit(type,detail);
function practice(id,{store,engine,type}){const c=engine.getSnapshot().context;
 switch(id){
  case 1:emit(store,'app:opened',{appId:'terminal'});type('sudo apt update');break;
  case 2:type('sudo apt install vlc');emit(store,'app:opened',{appId:'vlc',source:'grid'});break;
  case 3:emit(store,'file:opened-with',{path:c.videoPath,appId:'vlc'});emit(store,'vlc:played',{path:c.videoPath});break;
  case 4:{store.installPackage('gimp');emit(store,'gimp:opened',{path:c.imagePath});emit(store,'gimp:filtered',{path:c.imagePath,filter:'gray'});const path=HOME+'/Imagens/foto-ubuntu-pb.png';store.fs.create(path,'file','',{media:'image',filter:'grayscale(1)'});emit(store,'gimp:exported',{path,gray:true});break;}
  case 5:{const{path}=store.downloadPackage('vscode');emit(store,'app:opened',{appId:'software',packageId:'vscode',path});store.installPackage('vscode',path);emit(store,'app:opened',{appId:'vscode'});break;}
  case 6:{const path=HOME+'/Documentos/ola.html';store.fs.create(path,'file',HTML_TEMPLATE);emit(store,'vscode:created',{path});store.fs.write(path,HTML_TEMPLATE);assert.ok(!engine.getSnapshot().active.checks.includes('saved'),'modelo sem nome não conclui');store.fs.write(path,HTML_TEMPLATE.replace('Escreva seu nome aqui','Ana'));emit(store,'vscode:previewed',{path});break;}
  case 7:{store.installPackage('obs');emit(store,'obs:source-added',{kind:'screen'});const path=HOME+'/Vídeos/2026-11-03 10-00-00.mkv';store.fs.create(path,'file','',{media:'video',recording:true});emit(store,'obs:recorded',{path,seconds:1,screen:true});assert.ok(!engine.getSnapshot().active.checks.includes('recorded'),'gravação curta não conclui');emit(store,'obs:recorded',{path,seconds:3.2,screen:true});emit(store,'app:opened',{appId:'files',path:HOME+'/Vídeos'});break;}
  case 8:type('sudo apt install audacity');emit(store,'audacity:opened',{path:c.audioPath});emit(store,'audacity:trimmed',{path:c.audioPath});emit(store,'audacity:exported',{path:HOME+'/Música/gravacao.mp3',trimmed:true});break;
  case 9:type('sudo apt install fastfetch','fastfetch');break;
  case 10:store.installPackage('keepassxc');emit(store,'app:opened',{appId:'keepassxc'});emit(store,'keepassxc:created',{path:HOME+'/Documentos/Senhas.kdbx'});emit(store,'keepassxc:entry-saved',{title:'Escola',length:20});break;
  case 11:type('sudo apt install timeshift');emit(store,'app:opened',{appId:'timeshift'});emit(store,'timeshift:created',{count:1});break;
  case 12:type('sudo apt upgrade','sudo apt remove vlc');emit(store,'files:navigated',{path:HOME+'/Vídeos'});break;
 }
}
test('Kit essencial: 12 missões em sequência com Terminal, Central e site',()=>{const env=setup(),{engine,store}=env;assert.equal(kitCatalog.length,12);
 for(const mission of kitCatalog){assert.equal(mission.quiz.choices.length,3);assert.ok(mission.steps.length>=2);engine.start(mission.id);engine.beginPractice();practice(mission.id,env);assert.equal(engine.getSnapshot().active.phase,'review','missão '+mission.id+': '+JSON.stringify(engine.getSnapshot().active));engine.answer(mission.quiz.correct);engine.next();}
 assert.deepEqual(engine.getSnapshot().completed,kitCatalog.map(mission=>mission.id));
 assert.equal(store.fs.stat(HOME+'/Vídeos/video-aula.mp4').media,'video','remover o VLC preserva o vídeo');
 assert.ok(!store.getSnapshot().installed.includes('vlc'));
});
test('apt exige sudo, minúsculas, nome conhecido e internet',()=>{const{store}=setup();
 assert.match(executeTerminal(store,'apt install vlc').output,/Permissão negada/);
 assert.match(executeTerminal(store,'sudo apt install VLC').output,/minúsculas/);
 assert.match(executeTerminal(store,'sudo apt install inventado').output,/Impossível encontrar/);
 assert.match(executeTerminal(store,'fastfetch').output,/não encontrado/);
 store.setPreferences({airplane:true});assert.match(executeTerminal(store,'sudo apt install vlc').output,/sem internet/);
 assert.deepEqual(store.getSnapshot().installed,[]);
 store.setPreferences({airplane:false,wifi:true});assert.equal(executeTerminal(store,'sudo apt install vlc').error,undefined);assert.match(executeTerminal(store,'sudo apt install vlc').output,/mais recente/);
 assert.match(executeTerminal(store,'sudo apt install code').output,/Impossível encontrar/,'VS Code vem do site, não do repositório');
});
test('instalações pelo apt persistem e o pacote .deb do VS Code segue a regra do Chrome',()=>{const{store,storage,type}=setup();type('sudo apt install vlc fastfetch');assert.throws(()=>store.installPackage('vscode'),/Baixe/);const{path}=store.downloadPackage('vscode');store.installPackage('vscode',path);assert.deepEqual(createStore(storage).getSnapshot().installed,['vlc','fastfetch','vscode']);});
test('a prática não substitui um arquivo do aluno com o mesmo nome',()=>{const{store,engine}=setup();store.fs.create(HOME+'/Vídeos/video-aula.mp4','file','meu texto');const progress={version:1,completed:[1,2],active:null,context:{},attempts:{}};const storage=new Map([[definition.key,JSON.stringify(progress)]]),next=createMissionEngine(store,{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},false,definition);next.start(3);const c=next.getSnapshot().context;assert.equal(store.fs.read(HOME+'/Vídeos/video-aula.mp4'),'meu texto');assert.equal(c.videoPath,HOME+'/Vídeos/video-aula2.mp4');assert.match(missionView(kitCatalog[2],c).steps[0][1],/video-aula2\.mp4/);engine.dispose?.();});
