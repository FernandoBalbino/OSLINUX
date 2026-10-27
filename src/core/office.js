export const officeKinds = ['writer', 'calc', 'impress'];
export const officeExtensions = {writer: '.odt', calc: '.ods', impress: '.odp'};
export const officeThemes = {claro: {background:'#ffffff',color:'#253044',accent:'#1767ad'},roxo:{background:'#352043',color:'#ffffff',accent:'#efb6ff'},laranja:{background:'#fff3e5',color:'#582a15',accent:'#df6024'}};
export function blankOffice(kind) {
  if(kind==='writer') return {html:'<p><br></p>'};
  if(kind==='calc') return {cells:{}};
  if(kind==='impress') return {theme:'claro',slides:[{title:'',body:''}]};
  throw Error('Tipo de documento desconhecido.');
}
export function officeText(kind,payload) {
  if(kind==='writer') return String(payload.html||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').trim();
  if(kind==='calc') return Object.entries(payload.cells||{}).map(([cell,value])=>cell+'\t'+value).join('\n');
  return (payload.slides||[]).map(slide=>slide.title+'\n'+slide.body).join('\n\n');
}
export function validateOffice(kind,payload) {
  if(!officeKinds.includes(kind)||!payload||typeof payload!=='object')throw Error('Documento educativo inválido.');
  if(kind==='writer'&&typeof payload.html!=='string')throw Error('Texto inválido.');
  if(kind==='calc'&&(!payload.cells||Array.isArray(payload.cells)||typeof payload.cells!=='object'||Object.entries(payload.cells).some(([key,value])=>!validCell(key)||typeof value!=='string')))throw Error('Planilha inválida.');
  if(kind==='impress'&&(!officeThemes[payload.theme]||!Array.isArray(payload.slides)||!payload.slides.length||payload.slides.some(slide=>typeof slide.title!=='string'||typeof slide.body!=='string')))throw Error('Apresentação inválida.');
  return structuredClone(payload);
}
export const validCell = key=>/^[A-Z](?:[1-9]|[1-9]\d|100)$/.test(key);
export function rangeCells(from,to){
  if(!validCell(from)||!validCell(to))throw Error('Referência fora da planilha.');
  const cells=[];for(let row=Math.min(+from.slice(1),+to.slice(1));row<=Math.max(+from.slice(1),+to.slice(1));row++)for(let column=Math.min(from.charCodeAt(0),to.charCodeAt(0));column<=Math.max(from.charCodeAt(0),to.charCodeAt(0));column++)cells.push(String.fromCharCode(column)+row);
  return cells;
}
// Small recursive-descent spreadsheet parser. User text is never evaluated as JavaScript.
export function evaluateCell(cells,key,ancestors=new Set()){
  if(!validCell(key))throw Error('Referência fora da planilha.');
  if(ancestors.has(key))throw Error('Referência circular.');
  const raw=String(cells[key]??'').trim();if(!raw)return 0;
  if(!raw.startsWith('=')){const number=Number(raw.replace(',','.'));return Number.isFinite(number)?number:raw;}
  const branch=new Set(ancestors);branch.add(key);
  const source=raw.slice(1).toUpperCase().replace(/\s/g,'');
  const tokens=source.match(/\d+(?:[.,]\d+)?|[A-ZÁÉÍÓÚÃÕÇ]+\d*|[()+\-*/:;]/g)||[];
  if(tokens.join('')!==source)throw Error('Fórmula inválida.');let index=0;
  const numeric=value=>{if(typeof value!=='number'||!Number.isFinite(value))throw Error('A fórmula precisa de valores numéricos.');return value;};
  function atom(){
    const token=tokens[index++];if(token==='-')return -numeric(atom());if(token==='+')return numeric(atom());
    if(token==='('){const value=sum();if(tokens[index++]!==')')throw Error('Feche os parênteses.');return value;}
    if(/^\d+(?:[.,]\d+)?$/.test(token||''))return Number(token.replace(',','.'));
    if(validCell(token||''))return numeric(evaluateCell(cells,token,branch));
    if(['SOMA','MÉDIA','MEDIA'].includes(token)){
      if(tokens[index++]!=='(')throw Error('Abra os parênteses da função.');const values=[];
      if(tokens[index]===')')throw Error('Informe valores para a função.');
      do{
        if(validCell(tokens[index]||'')&&tokens[index+1]===':'){
          const from=tokens[index];index+=2;const to=tokens[index++];
          for(const cell of rangeCells(from,to)){const value=evaluateCell(cells,cell,branch);if(String(cells[cell]??'').trim()&&typeof value==='number')values.push(value);}
        }else values.push(numeric(sum()));
        if(tokens[index]!==';')break;index++;
      }while(index<tokens.length);
      if(tokens[index++]!==')')throw Error('Feche os parênteses da função.');
      if(token!=='SOMA'&&!values.length)throw Error('A média precisa de números.');
      return values.reduce((total,value)=>total+value,0)/(token==='SOMA'?1:values.length);
    }
    throw Error('Nome ou referência inválida.');
  }
  function product(){let value=atom();while(['*','/'].includes(tokens[index])){const op=tokens[index++],right=numeric(atom());if(op==='/'&&right===0)throw Error('Divisão por zero.');value=op==='*'?numeric(value)*right:numeric(value)/right;}return value;}
  function sum(){let value=product();while(['+','-'].includes(tokens[index])){const op=tokens[index++],right=numeric(product());value=op==='+'?numeric(value)+right:numeric(value)-right;}return value;}
  const result=sum();if(index!==tokens.length||!Number.isFinite(result))throw Error('Fórmula inválida.');return Number(result.toPrecision(12));
}
export function displayCell(cells,key){try{const value=evaluateCell(cells,key);return !String(cells[key]??'').trim()?'':typeof value==='number'?value.toLocaleString('pt-BR',{maximumFractionDigits:8}):value;}catch(error){return 'Erro: '+error.message;}}
