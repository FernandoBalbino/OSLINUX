import test from 'node:test';
import assert from 'node:assert/strict';
import {requestFullscreenNow} from '../src/core/fullscreen.js';
test('a solicitação de tela cheia acontece imediatamente durante o clique',async()=>{let requested=false;const result=requestFullscreenNow({requestFullscreen(){requested=true;return Promise.resolve();}});assert.equal(requested,true);assert.equal(await result,true);});
test('rejeição do navegador é recuperável sem impedir a entrada',async()=>{assert.equal(await requestFullscreenNow({requestFullscreen(){return Promise.reject(Error('Blocked'));}}),false);assert.equal(await requestFullscreenNow({requestFullscreen(){throw Error('Blocked');}}),false);assert.equal(await requestFullscreenNow({}),false);});
test('uma sessão já em tela cheia não solicita novamente',async()=>{let requested=false;assert.equal(await requestFullscreenNow({ownerDocument:{fullscreenElement:{}},requestFullscreen(){requested=true;}}),true);assert.equal(requested,false);});
