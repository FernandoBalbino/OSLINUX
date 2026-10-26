import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
const index=readFileSync('dist/client/index.html','utf8');
mkdirSync('dist/client/slide',{recursive:true});
writeFileSync('dist/client/slide/index.html',index.replace('<head>','<head>\n    <base href="../" />'));
