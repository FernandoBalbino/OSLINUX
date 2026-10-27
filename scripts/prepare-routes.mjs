import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
const index=readFileSync('dist/client/index.html','utf8');
for(const route of ['slide','slide2']){mkdirSync('dist/client/'+route,{recursive:true});writeFileSync('dist/client/'+route+'/index.html',index.replace('<head>','<head>\n    <base href="../" />'));}
