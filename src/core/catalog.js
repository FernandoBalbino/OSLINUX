const rows = [
 ['software','Central de Aplicativos','snap-store'],['archive','Gerenciador de Arquivos Compactados','file-roller'],['calculator','Calculadora','org.gnome.Calculator'],['calendar','Calendário','org.gnome.Calendar'],['camera','Câmera','org.gnome.Snapshot'],['characters','Caracteres','org.gnome.Characters'],['clocks','Relógios','org.gnome.clocks'],
 ['usage','Analisador de Uso de Disco','disk-usage-app'],['disks','Discos','disk-utility-app'],['documents','Visualizador de Documentos','org.gnome.Papers'],['files','Arquivos','org.gnome.Nautilus'],['firefox','Firefox','firefox'],['gparted','GParted','gparted'],['help','Ajuda','org.gnome.Yelp'],
 ['images','Visualizador de Imagens','org.gnome.Loupe'],['libreoffice','LibreOffice','libreoffice-main'],['calc','LibreOffice Calc','libreoffice-calc'],['draw','LibreOffice Draw','libreoffice-draw'],['impress','LibreOffice Impress','libreoffice-impress'],['writer','LibreOffice Writer','libreoffice-writer'],['logs','Registros','log-viewer-app'],
 ['rhythmbox','Rhythmbox','org.gnome.Rhythmbox3'],['settings','Configurações','org.gnome.Settings'],['shotwell','Shotwell','org.gnome.Shotwell'],['sources','Programas e Atualizações','software-properties'],['updater','Atualizador de Programas','software-updater'],['startup','Criador de Disco de Inicialização','usb-creator-gtk'],['monitor','Monitor do Sistema','net.nokyan.Resources'],
 ['terminal','Terminal','org.gnome.Ptyxis'],['editor','Editor de Texto','org.gnome.TextEditor'],['thunderbird','Thunderbird','thunderbird'],['transmission','Transmission','transmission'],['videos','Vídeos','org.gnome.Showtime']
];
export const apps=rows.map(([id,name,icon])=>({id,name,icon:`assets/apps/${icon}.${icon==='firefox'?'svg':'png'}`,implemented:['files','firefox','terminal','settings','calculator','editor','software'].includes(id)}));
apps.push({id:'missions',name:'Primeiros passos no Linux',icon:'assets/learning/linux-basics-icon.png',implemented:true});
apps.push({id:'weather',name:'Tempo',icon:'assets/apps/org.gnome.Weather.png',implemented:true,installable:true},{id:'chrome',name:'Google Chrome',icon:'assets/apps/google-chrome.svg',implemented:true,installable:true});
export const favorites=['firefox','thunderbird','files','rhythmbox','writer','software','help','missions'];
export const appById=id=>apps.find(app=>app.id===id);
export const dimensions={firefox:[940,640],files:[890,550],terminal:[740,480],settings:[980,680],calculator:[330,470],editor:[700,500],missions:[1010,680],software:[980,680],weather:[530,590],chrome:[940,640]};
