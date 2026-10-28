export const defaultProfile=Object.freeze({name:'Aluno',avatar:'default'});
export const profileAvatars=[
 {id:'fox',name:'Raposa',src:'assets/profiles/avatar-fox.png'},
 {id:'cat',name:'Gato',src:'assets/profiles/avatar-cat.png'},
 {id:'owl',name:'Coruja',src:'assets/profiles/avatar-owl.png'},
 {id:'panda',name:'Panda',src:'assets/profiles/avatar-panda.png'},
 {id:'raccoon',name:'Guaxinim',src:'assets/profiles/avatar-raccoon.png'}
];
export const avatarById=id=>profileAvatars.find(avatar=>avatar.id===id)||null;
export function validateProfileName(value){if(typeof value!=='string'||/[\u0000-\u001f\u007f]/.test(value))throw Error('Digite um nome ou apelido válido.');const name=value.normalize('NFC').trim().replace(/\s+/g,' ');if(!name)throw Error('Digite um nome ou apelido.');if(Array.from(name).length>40)throw Error('Use até 40 caracteres no nome.');return name;}
export function resolveProfile(value){let name=defaultProfile.name;try{name=validateProfileName(value?.name);}catch{}return {name,avatar:value?.avatar==='default'||avatarById(value?.avatar)?value.avatar:defaultProfile.avatar};}
