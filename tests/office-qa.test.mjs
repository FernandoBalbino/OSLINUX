import test from 'node:test';
import assert from 'node:assert/strict';
import {createStore} from '../src/core/model.js';
import {prepareOfficeQA} from '../src/learning/office-qa.js';
test('cenas Office QA mantêm dados do aluno isolados',()=>{let writes=0;const store=createStore({getItem(){throw Error('Não ler dados reais.');},setItem(){writes++;}},true);const path=prepareOfficeQA(store,'writer');assert.equal(store.fs.stat(path).officeKind,'writer');assert.equal(writes,0);assert.ok(store.getSnapshot().installed.includes('libreoffice'));});
