import {HOME} from '../core/model.js';
export function prepareOfficeQA(store,kind){
 store.installPackage('libreoffice');
 const payloads={writer:{html:'<p style="text-align: center; font-size:24px"><strong>Minha rotina de estudos</strong></p><p>Eu estudo informática e aprendo a usar o Ubuntu com meus colegas.</p><p>Com o Writer posso organizar um texto, formatar o título e salvar meu trabalho.</p>'},calc:{cells:{A1:'Material',B1:'Quantidade',C1:'Valor',A2:'Cadernos',A3:'Canetas',A4:'Pastas',B2:'15',B3:'20',B4:'30',C2:'8',C3:'2',C4:'4',D1:'Resumo',E1:'Resultado',D2:'Total',E2:'=SOMA(B2:B4)',D3:'Média',E3:'=MÉDIA(B2:B4)'}},impress:{theme:'roxo',slides:[{title:'Minha escola',body:'Aprendemos juntos no laboratório de informática.'},{title:'Meus estudos',body:'Escrever no Writer\nCalcular no Calc\nApresentar no Impress'}]}};
 const extensions={writer:'odt',calc:'ods',impress:'odp'};for(const [app,payload]of Object.entries(payloads))store.fs.saveOffice(app,HOME+'/Documentos/Exemplo '+app+'.'+extensions[app],payload);
 return extensions[kind]?HOME+'/Documentos/Exemplo '+kind+'.'+extensions[kind]:null;
}
