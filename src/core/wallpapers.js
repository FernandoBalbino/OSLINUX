export const wallpapers = [
  {id:'resolute',name:'Ubuntu claro',label:'Papel de parede claro',src:'assets/wallpapers/resolute.webp'},
  {id:'resolute-dark',name:'Ubuntu escuro',label:'Papel de parede escuro',src:'assets/wallpapers/resolute-dark.webp'},
  {id:'blue-lock',name:'Blue Lock',label:'Papel de parede Blue Lock',src:'assets/wallpapers/blue-lock.jpeg'},
  {id:'berserk',name:'Berserk',label:'Papel de parede Berserk',src:'assets/wallpapers/berserk.jpg'},
  {id:'futebol',name:'Futebol brasileiro',label:'Papel de parede Futebol brasileiro',src:'assets/wallpapers/futebol.jpeg'},
  {id:'pop-claro',name:'Pop • fundo claro',label:'Papel de parede Pop • fundo claro',src:'assets/wallpapers/pop-claro.jpg'},
  {id:'musica-assinaturas',name:'Música • assinaturas',label:'Papel de parede Música • assinaturas',src:'assets/wallpapers/musica-assinaturas.jpg'},
  {id:'arco-iris-rosa',name:'Arco-íris rosa',label:'Papel de parede Arco-íris rosa',src:'assets/wallpapers/arco-iris-rosa.jpg'},
  {id:'mascara-tatica',name:'Máscara tática',label:'Papel de parede Máscara tática',src:'assets/wallpapers/mascara-tatica.jpg'}
];
export const wallpaperById = id => wallpapers.find(wallpaper=>wallpaper.id===id)||wallpapers[0];
