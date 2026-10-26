export const packages = [
  {id:'weather',name:'Tempo',icon:'assets/apps/org.gnome.Weather.png',summary:'Consulte uma previsão do tempo de exemplo.',category:'Utilitários',source:'Catálogo educativo',version:'1.0',size:'12 MB',description:'Uma previsão local de demonstração para explorar a instalação de aplicativos. Os valores são fictícios e não são atualizados pela internet.'},
  {id:'chrome',name:'Google Chrome',icon:'assets/apps/google-chrome.svg',summary:'Navegador de internet',category:'Internet',source:'Pacote .deb educativo',version:'1.0',size:'110 MB',description:'Instalação educativa do Google Chrome a partir de um pacote baixado no Firefox. A navegação permanece local, com as mesmas páginas de ajuda do simulador.'}
];
export const packageById=id=>packages.find(item=>item.id===id);
export const CHROME_PACKAGE='google-chrome-stable_amd64.deb';
