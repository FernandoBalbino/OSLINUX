import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist/client'),port=Number(process.env.PORT||4391);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.cur':'image/x-icon'};
http.createServer(async(request,response)=>{try{let pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);if(pathname==='/slide'){response.writeHead(302,{Location:'/slide/'});return response.end();}const file=path.resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));if(file!==root&&!file.startsWith(root+path.sep)){response.writeHead(403);return response.end();}const data=await readFile(file);response.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});response.end(data);}catch{response.writeHead(404);response.end('Arquivo não encontrado.');}}).listen(port,'127.0.0.1',()=>console.log(`OSLINUX disponível em http://127.0.0.1:${port}/`));
