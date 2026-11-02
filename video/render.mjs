// Renderiza o vídeo com o FFmpeg/FFprobe locais da pasta do projeto: `node render.mjs [draft|high|publicar]`.
// No render final (high), também publica a cópia web e a capa usadas pela /slide3.
import {spawnSync,execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';
const mode=process.argv[2]||'high';
const env={...process.env,PATH:[path.dirname(ffmpeg),path.dirname(ffprobe.path),process.env.PATH].join(path.delimiter)};
const output=`renders/terminal-oslinux${mode==='draft'?'-rascunho':''}.mp4`;
if(mode!=='publicar'){const result=spawnSync('npx',['hyperframes','render','--quality',mode,'--output',output],{stdio:'inherit',env,shell:true});if(result.status!==0)process.exit(result.status??1);}
if(mode!=='draft'){
 const target='../public/assets/video';mkdirSync(target,{recursive:true});
 // faststart: o navegador começa a tocar antes de baixar o arquivo inteiro.
 execFileSync(ffmpeg,['-y','-loglevel','error','-i',output,'-c','copy','-movflags','+faststart',target+'/terminal-oslinux.mp4']);
 execFileSync(ffmpeg,['-y','-loglevel','error','-ss','4.5','-i',output,'-frames:v','1','-vf','scale=1280:-1','-q:v','4',target+'/terminal-oslinux.jpg']);
 console.log('Publicado em public/assets/video/');
}
