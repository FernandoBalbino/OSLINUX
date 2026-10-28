export const wallpapers = [
  {id:'resolute',name:'Ubuntu claro',label:'Papel de parede claro',src:'assets/wallpapers/resolute.webp'},
  {id:'resolute-dark',name:'Ubuntu escuro',label:'Papel de parede escuro',src:'assets/wallpapers/resolute-dark.webp'},
  {id:'blue-lock',name:'Blue Lock',label:'Papel de parede Blue Lock',src:'assets/wallpapers/blue-lock.jpeg'},
  {id:'berserk',name:'Berserk',label:'Papel de parede Berserk',src:'assets/wallpapers/berserk.jpg'}
];
export const wallpaperById = id => wallpapers.find(wallpaper=>wallpaper.id===id)||wallpapers[0];
