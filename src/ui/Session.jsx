import {store,qa} from '../core/runtime.js';
import {ProfileAvatar} from './ProfileAvatar.jsx';
import React,{useEffect,useState,useSyncExternalStore} from 'react';
import {App} from '../App.jsx';
import {Icon} from './Icon.jsx';
import {requestFullscreenNow} from '../core/fullscreen.js';
import './login.css';
export function Session(){
 const state=useSyncExternalStore(store.subscribe,store.getSnapshot),profile=state.profile;
 const[entered,setEntered]=useState(Boolean(qa&&qa!=='login')),[fullscreenBlocked,setFullscreenBlocked]=useState(false),[now,setNow]=useState(new Date());
 useEffect(()=>{if(entered)return;const timer=setInterval(()=>setNow(new Date()),15000);return()=>clearInterval(timer);},[entered]);
 function enter(){const attempt=requestFullscreenNow(document.documentElement);setEntered(true);attempt.then(success=>setFullscreenBlocked(!success));}
 const clock=qa?'26 de out 16:37':new Intl.DateTimeFormat('pt-BR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(now).replace('.','').replace(',','');
 if(entered)return <><App/>{fullscreenBlocked&&<aside className="fullscreen-retry" role="status"><span>Use a tela cheia para aproveitar o desktop.</span><button onClick={()=>requestFullscreenNow(document.documentElement).then(success=>setFullscreenBlocked(!success))}>Ativar tela cheia</button><button aria-label="Fechar aviso de tela cheia" onClick={()=>setFullscreenBlocked(false)}>×</button></aside>}</>;
 return <main className="ubuntu-greeter" aria-label="Tela de entrada do Ubuntu" onContextMenu={event=>event.preventDefault()} data-scene={qa||'login'}><header className="greeter-panel"><time>{clock}</time><div aria-label="Indicadores do sistema"><Icon name="network-wireless-signal-excellent"/><Icon name="audio-volume-high"/><Icon name="battery-full"/><Icon name="system-shutdown"/></div></header><section className="greeter-profile" aria-labelledby="profile-name"><div className="greeter-avatar"><ProfileAvatar profile={profile} size={160}/></div><h1 id="profile-name">{profile.name}</h1><button className="greeter-enter" onClick={enter} autoFocus>Entrar</button></section><img className="greeter-wordmark" src="assets/ubuntu-wordmark.svg" alt="Ubuntu"/></main>;
}
