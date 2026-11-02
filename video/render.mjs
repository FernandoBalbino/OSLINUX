// Renderiza o vídeo com o FFmpeg/FFprobe locais da pasta do projeto: `node render.mjs [draft|high]`.
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';
const quality=process.argv[2]||'high';
const env={...process.env,PATH:[path.dirname(ffmpeg),path.dirname(ffprobe.path),process.env.PATH].join(path.delimiter)};
const output=`renders/terminal-oslinux${quality==='draft'?'-rascunho':''}.mp4`;
const result=spawnSync('npx',['hyperframes','render','--quality',quality,'--output',output],{stdio:'inherit',env,shell:true});
process.exit(result.status??1);
