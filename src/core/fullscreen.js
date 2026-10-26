// Call directly from the user's click, before state updates or any await.
export function requestFullscreenNow(target){
 if(target?.ownerDocument?.fullscreenElement)return Promise.resolve(true);
 try{if(typeof target?.requestFullscreen!=='function')return Promise.resolve(false);return Promise.resolve(target.requestFullscreen()).then(()=>true,()=>false);}catch{return Promise.resolve(false);}
}
