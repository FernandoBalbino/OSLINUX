// Deterministic fixture. App.jsx calls this only for isolated ?qa=extended data.
import {HOME,basename} from '../core/model.js';
import {missionCatalog} from './missions.js';
export function prepareExtendedQA(store,engine){
 for(let id=1;id<=10;id++){
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
  engine.answer(missionCatalog[id-1].quiz.correct);
 }
 engine.next();
}
