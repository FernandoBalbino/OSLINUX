// Deterministic fixture. App.jsx calls this only for isolated ?qa=extended data.
import {HOME,basename} from '../core/model.js';
import {missionCatalog} from './missions.js';
export function prepareExtendedQA(store,engine,through=10){
 for(let id=1;id<=through;id++){
  engine.start(id);engine.beginPractice();const c=engine.getSnapshot().context;
  if(id===1)store.events.emit('app:opened',{appId:'files'});
  if(id===2)store.events.emit('files:navigated',{path:HOME+'/Documentos'});
  if(id===3){store.events.emit('ui:dialog-opened',{title:'Nova pasta'});store.fs.create(c.folderPath,'folder');}
  if(id===4){store.events.emit('ui:dialog-opened',{title:'Renomear'});store.fs.rename(c.folderPath,basename(c.renamedPath));}
  if(id===5){store.events.emit('ui:dialog-opened',{title:'Novo documento'});store.fs.create(c.notePath,'file');}
  if(id===6){store.events.emit('app:opened',{appId:'editor',path:c.notePath});store.fs.write(c.notePath,'Estou aprendendo Linux.');}
  if(id===7)store.fs.transfer(c.notePath,c.copyPath,true);
  if(id===8){store.fs.remove(c.copyPath);store.fs.restore(store.getSnapshot().trash[0].id);}
  if(id===9)store.setPreferences({wallpaper:c.wallpaper});
  if(id===10){store.events.emit('app:opened',{appId:'firefox'});store.visit('https://www.google.com/search?q=Ubuntu');store.visit('https://ajuda.ubuntu.local/primeiros-passos');}
  if(id===11)store.setPreferences({wifi:true,airplane:false,ssid:'Laboratório'});
  if(id===12)store.setPreferences({brightness:40});
  if(id===13){store.events.emit('app:opened',{appId:'calculator'});store.events.emit('calculator:calculated',{expression:'7+5',result:12});}
  if(id===14){store.events.emit('app:opened',{appId:'software'});store.installPackage('weather');store.events.emit('app:opened',{appId:'weather'});}
  if(id===15){const{path}=store.downloadChrome();store.events.emit('app:opened',{appId:'software',packageId:'chrome',path});store.installPackage('chrome',path);store.events.emit('app:opened',{appId:'chrome'});}
  engine.answer(missionCatalog[id-1].quiz.correct);
 }
 engine.next();
}
