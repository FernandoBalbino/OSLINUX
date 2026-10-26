from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'src/App.jsx';s=p.read_text(encoding='utf-8')
s=s.replace("import {QuickPanel,Calendar}","import {createMissionEngine} from './learning/missions.js';\nimport {MissionsApp,LearningRobot} from './learning/Learning.jsx';\nimport {QuickPanel,Calendar}")
s=s.replace('const store=createStore(localStorage,Boolean(qa));','const store=createStore(localStorage,Boolean(qa));\nconst lessons=createMissionEngine(store,localStorage,Boolean(qa));')
s=s.replace(' const state=useSyncExternalStore', ' const learning=useSyncExternalStore(lessons.subscribe,lessons.getSnapshot);\n const state=useSyncExternalStore')
s=s.replace('setDialogState(options);});','setDialogState(options);store.events.emit(\'ui:dialog-opened\',{title:options.title});});')
s=s.replace('function focus(id){setActive(id);', "function focus(id,data={}){const focused=windows.find(item=>item.id===id);if(focused)store.events.emit('app:opened',{appId:focused.app,windowId:id,...focused.data,...data});setActive(id);")
s=s.replace('focus(found.id);return;', 'focus(found.id,data);return;')
s=s.replace("store.events.emit('app:opened',{appId:id,windowId:win.id});", "store.events.emit('app:opened',{appId:id,windowId:win.id,...data});")
s=s.replace(' const appProps=win=>', ''' function startLearning(){setWindows(items=>items.map(win=>win.app==='missions'?{...win,minimized:true}:win));setActive(null);setMenu(null);}
 function highlightLearning(mission,context){document.querySelectorAll('.tutorial-highlight').forEach(node=>node.classList.remove('tutorial-highlight'));let target=null;const buttons=[...document.querySelectorAll('.files-sidebar button,.file-item')];if(mission.id===1)target=document.querySelector('[data-launch-app="files"]');else if(mission.id===2)target=buttons.find(node=>node.textContent.trim()==='Documentos');else if(mission.id===3)target=document.querySelector('[data-app="files"] [aria-label="Nova pasta"]');else if([4,5].includes(mission.id))target=buttons.find(node=>node.title===context.folderPath?.split('/').at(-1));else if([6,7,8].includes(mission.id))target=buttons.find(node=>node.title===(mission.id===8?context.copyPath:context.notePath)?.split('/').at(-1));else if(mission.id===9)target=document.querySelector('[data-app="settings"] [aria-label*="Papel de parede"]')||document.querySelector('[aria-label="Configurações rápidas"]');else target=document.querySelector('[data-launch-app="firefox"]');if(target){target.classList.add('tutorial-highlight');setTimeout(()=>target.classList.remove('tutorial-highlight'),4500);}else notify('Siga o passo indicado pelo robô. Use Dica para rever a demonstração.');}
 const appProps=win=>''')
s=s.replace('data-dragging={Boolean(drag.current)}', 'data-dragging={Boolean(drag.current)} data-learning={Boolean(learning.active&&!learning.active.suspended)}')
s=s.replace('<span>Pasta pessoal</span></button>{desktopFiles.map', '''<span>Pasta pessoal</span></button><button className="home-shortcut mission-desktop" data-launch-app="missions" onPointerDown={e=>e.stopPropagation()} onDoubleClick={()=>openApp('missions')} onKeyDown={e=>{if(e.key==='Enter')openApp('missions');}}><img src="assets/learning/linux-basics-icon.png" alt=""/><span>Primeiros passos no Linux</span></button>{desktopFiles.map''')
s=s.replace("w=Math.min(w,viewport.width-dockWidth);h=Math.min(h,viewport.height-y);", "w=Math.min(w,viewport.width-dockWidth);h=Math.min(h,viewport.height-y);")
s=s.replace('return <section key={win.id} className=', "if(learning.active&&!learning.active.suspended){const available=viewport.width-dockWidth-360;w=Math.min(w,available);x=Math.max(dockWidth+10,Math.min(x,viewport.width-350-w));}return <section key={win.id} className=")
s=s.replace(":win.app==='terminal'?<Terminal", ":win.app==='missions'?<MissionsApp engine={lessons} progress={learning} onStart={startLearning} dialog={dialog}/>:win.app==='terminal'?<Terminal")
s=s.replace(' {context&&<ContextMenu', ''' {learning.active&&!learning.active.suspended&&!['quick','calendar','power'].includes(menu)&&<LearningRobot engine={lessons} progress={learning} onOpenTrail={()=>openApp('missions')} onHighlight={highlightLearning}/>}
 {context&&<ContextMenu''')
p.write_text(s,encoding='utf-8')
p=root/'src/core/model.js';s=p.read_text(encoding='utf-8')
s=s.replace("next.history.filter(x=>x.url!==url)].slice(0,100);});", "next.history.filter(x=>x.url!==url)].slice(0,100);return {url};});")
p.write_text(s,encoding='utf-8')
p=root/'package-lock.json';import json;j=json.loads(p.read_text(encoding='utf-8'));j['name']='oslinux';j['packages']['']['name']='oslinux';p.write_text(json.dumps(j,indent=2)+'\n',encoding='utf-8')
