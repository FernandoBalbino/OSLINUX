import {createStore} from './model.js';
export const qa=new URLSearchParams(location.search).get('qa');
export const store=createStore(localStorage,Boolean(qa));
