import test from 'node:test';
import assert from 'node:assert/strict';
import {createStore,executeTerminal,HOME} from '../src/core/model.js';
import {createMissionEngine,missionView} from '../src/learning/missions.js';
import {extraTrails,terminalCatalog} from '../src/learning/trails.js';
const definition=extraTrails.find(trail=>trail.id==='terminallab');
function setup(){const data=new Map(),storage={getItem:key=>data.get(key),setItem:(key,value)=>data.set(key,value)},store=createStore(storage),engine=createMissionEngine(store,storage,false,definition);let cwd=HOME;const type=(...commands)=>{for(const command of commands){const result=executeTerminal(store,command,cwd);assert.ok(!result.error,command+': '+result.output);cwd=result.cwd;}};return{store,engine,type,data};}
const labels=engine=>engine.getSnapshot().context.labels;
function practice(id,{store,engine,type}){const l=labels(engine)||{};
 switch(id){case 1:store.events.emit('app:opened',{appId:'terminal'});type('help');break;case 2:type('whoami','pwd');break;case 3:type('ls');break;case 4:type('cd Documentos','ls');break;case 5:type('cd ..');break;
  case 6:type('cd Documentos','mkdir '+l.folder);store.events.emit('files:navigated',{path:HOME+'/Documentos'});break;case 7:type('cd '+l.folder,'touch notas.txt','ls');break;
  case 8:type('echo Eu sei usar o Terminal > notas.txt','cat notas.txt');break;case 9:type('cp notas.txt '+l.copy,'ls');break;case 10:type(`mv ${l.copy} ${l.renamed}`,'ls');break;case 11:type('rm '+l.renamed,'ls');break;
  case 12:type('cd');store.events.emit('terminal:completed',{value:'cd Documentos/'});type('clear');store.events.emit('terminal:history',{value:'clear'});break;}
}
test('Terminal: 12 missões em sequência com comandos reais do simulador',()=>{const env=setup(),{engine,store}=env;assert.equal(terminalCatalog.length,12);for(const mission of terminalCatalog){assert.equal(mission.quiz.choices.length,3);assert.equal(mission.example.type,'terminal');engine.start(mission.id);engine.beginPractice();practice(mission.id,env);assert.equal(engine.getSnapshot().active.phase,'review','missão '+mission.id+': '+JSON.stringify(engine.getSnapshot().active));engine.answer(mission.quiz.correct);engine.next();}
 assert.deepEqual(engine.getSnapshot().completed,terminalCatalog.map(mission=>mission.id));assert.equal(store.fs.read(HOME+'/Documentos/treino/notas.txt'),'Eu sei usar o Terminal\n');assert.ok(!store.fs.stat(HOME+'/Documentos/treino/resumo.txt'));assert.ok(env.data.has('oslinux.learning.terminal.v1'));});
test('Terminal: refazer escolhe nomes livres e mkdir fora de Documentos não conclui',()=>{const env=setup(),{engine,store,type}=env;store.fs.create(HOME+'/Documentos/treino','folder');for(let id=1;id<=5;id++){engine.start(id);engine.beginPractice();practice(id,env);engine.answer(terminalCatalog[id-1].quiz.correct);}engine.start(6);engine.beginPractice();assert.equal(labels(engine).folder,'treino2');assert.match(missionView(terminalCatalog[5],engine.getSnapshot().context).example.lines[1][1],/mkdir treino2/);type('mkdir treino2');assert.ok(!engine.getSnapshot().active.checks.includes('created'));type('cd Documentos','mkdir Treino2');assert.ok(engine.getSnapshot().active.checks.includes('created'));assert.equal(labels(engine).folder,'Treino2');});
