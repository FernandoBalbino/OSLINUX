export const normalizeGoalText=value=>String(value??'').normalize('NFC').trim().replace(/\s+/g,' ').toLocaleLowerCase('pt-BR');
export const sameGoalText=(actual,expected)=>normalizeGoalText(actual)===normalizeGoalText(expected);
export function matchesGoalPath(actual,expected){if(typeof actual!=='string'||typeof expected!=='string')return false;const a=actual.lastIndexOf('/'),b=expected.lastIndexOf('/');return actual.slice(0,a)===expected.slice(0,b)&&sameGoalText(actual.slice(a+1),expected.slice(b+1));}
export function findGoalPath(store,expected){if(!expected)return null;if(store.fs.stat(expected))return expected;const slash=expected.lastIndexOf('/');try{return store.fs.list(expected.slice(0,slash)).find(node=>sameGoalText(node.name,expected.slice(slash+1)))?.path||null;}catch{return null;}}
export function queryMatchesName(query,name){const normalized=normalizeGoalText(query);return Boolean(normalized)&&normalizeGoalText(name).includes(normalized);}
