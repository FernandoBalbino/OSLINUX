export const packages = [
  {id:'libreoffice',name:'LibreOffice',apps:['libreoffice','writer','calc','impress'],icon:'assets/apps/libreoffice-main.png',summary:'Writer, Calc e Impress: textos, planilhas e apresentações.',category:'Produtividade',source:'Catálogo educativo',version:'1.0',size:'350 MB',description:'Suíte educativa com três aplicativos funcionais: Writer para documentos, Calc para planilhas e Impress para apresentações. Seus trabalhos ficam no sistema de arquivos deste simulador.'},
  {id:'weather',name:'Tempo',icon:'assets/apps/org.gnome.Weather.png',summary:'Consulte uma previsão do tempo de exemplo.',category:'Utilitários',source:'Catálogo educativo',version:'1.0',size:'12 MB',description:'Uma previsão local de demonstração para explorar a instalação de aplicativos. Os valores são fictícios e não são atualizados pela internet.'},
  {id:'chrome',name:'Google Chrome',icon:'assets/apps/google-chrome.svg',summary:'Navegador de internet',category:'Internet',source:'Pacote .deb educativo',version:'1.0',size:'110 MB',description:'Instalação educativa do Google Chrome a partir de um pacote baixado no Firefox. A navegação permanece local, com as mesmas páginas de ajuda do simulador.'}
];
export const packageById=id=>packages.find(item=>item.id===id);
export const CHROME_PACKAGE='google-chrome-stable_amd64.deb';
