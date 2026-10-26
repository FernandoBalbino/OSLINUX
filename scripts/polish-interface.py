from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'src/apps/Essentials.jsx';s=p.read_text(encoding='utf-8')
s=s.replace('<textarea aria-label="Conteúdo do documento"','<textarea autoFocus aria-label="Conteúdo do documento"')
s=s.replace('<input aria-label="Expressão da calculadora"','<input autoFocus aria-label="Expressão da calculadora"')
s=s.replace('export function Settings({store,state,dialog})','export function Settings({store,state,dialog,data})')
s=s.replace("useState('Aparência');const p=", "useState(data?.section||'Aparência');useEffect(()=>{if(data?.section)setSection(data.section);},[data?.section]);const p=")
p.write_text(s,encoding='utf-8')
p=root/'src/App.jsx';s=p.read_text(encoding='utf-8')
s=s.replace("else if(overlay)setOverlay(null);else setMenu(null);", "else if(overlay)setOverlay(null);else setMenu(null);setContext(null);")
s=s.replace('type="button" key={label} className={index===dialogState.buttons.length-1?', 'type="button" key={label} autoFocus={!dialogState.input&&index===dialogState.buttons.length-1} className={index===dialogState.buttons.length-1?')
p.write_text(s,encoding='utf-8')
