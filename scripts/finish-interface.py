from pathlib import Path
p=Path(__file__).resolve().parents[1]/'src/App.jsx'
s=p.read_text(encoding='utf-8')
s=s.replace("data-scene={qa||'normal'}", "data-scene={qa||'normal'} data-dragging={Boolean(drag.current)} onContextMenu={systemContext}")
s=s.replace("onContextMenu={e=>{e.preventDefault();setMenu('desktop');}}", '')
s=s.replace('key={id} className=', 'key={id} data-launch-app={id} className=')
s=s.replace('key={app.id} className=', 'key={app.id} data-launch-app={app.id} className=')
s=s.replace("className={'app-window '+", "className={'app-window '+(win.closing?'closing ':'')+(win.minimizing?'minimizing ':'')+")
s=s.replace('onPointerUp={()=>drag.current=null}', 'onPointerUp={endDrag}')
s=s.replace('<Files {...props}/>', '''<Files {...props} controls={controls(win)} dragHandlers={{onPointerDown:e=>startDrag(e,win),onPointerMove:move,onPointerUp:endDrag,onDoubleClick:e=>{if(!e.target.closest('button,input'))maximize(win.id);}}}/>''')
s=s.replace(' {toast&&', ' {context&&<ContextMenu {...context} items={contextItems()} onClose={()=>setContext(null)}/>}\n {toast&&')
p.write_text(s,encoding='utf-8')
p=p.parent/'apps/Essentials.jsx';s=p.read_text(encoding='utf-8')
s=s.replace('export function Terminal({store})','export function Terminal({store,data})')
s=s.replace('useState(HOME),[input', 'useState(data?.path||HOME),[input')
# The Nautilus implementation now lives in its own component.
s=s[:s.index('export function Files(')]+s[s.index('export function Terminal('):]
p.write_text(s,encoding='utf-8')
