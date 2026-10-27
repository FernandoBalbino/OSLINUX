import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const read=file=>readFileSync(file,'utf8');
test('as duas apresentações geradas possuem base de assets correta',()=>{for(const route of ['slide','slide2']){const html=read('dist/client/'+route+'/index.html');assert.match(html,/<base href="\.\.\/"/);assert.match(html,/assets\/index-/);}});
test('precache inclui slide2 e todas as imagens da aula',()=>{const manifest=JSON.parse(read('dist/client/precache-manifest.json'));assert.ok(manifest.files.includes('./slide2/index.html'));for(const name of ['apps','overview','files','hidden','center','writer','calc','impress']){const file='./assets/learning/lesson2-'+name+'.jpg';assert.ok(manifest.files.includes(file),file);assert.ok(existsSync('dist/client/'+file));}const worker=read('dist/client/service-worker.js');assert.match(worker,/'slide2':'.\/slide2\/index.html'/);assert.match(worker,/cache:'no-store'/);});
test('slide2 tem 19 slides e links distintos para as novas trilhas',()=>{const source=read('src/slides/Slides2.jsx'),match=source.match(/export const slide2Titles=(\[[^;]+\]);/);assert.equal(JSON.parse(match[1].replaceAll("'",'"')).length,19);assert.match(source,/<Invite number=\{2\}/);assert.match(source,/<Invite number=\{3\}/);assert.match(read('src/main.jsx'),/slide2/);});
