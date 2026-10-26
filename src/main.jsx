import React from "react";
import { createRoot } from "react-dom/client";
import {Session} from './ui/Session.jsx';
import {Slides} from './slides/Slides.jsx';
import "./desktop.css";
import "./refinements.css";
import "./motion.css";
import "./learning/learning.css";
import "./apps/app-center.css";

if (import.meta.env.PROD && !new URLSearchParams(location.search).has('qa') && 'serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').then(() => navigator.serviceWorker.ready).then(() => { document.documentElement.dataset.offlineReady = 'true'; }).catch(error => console.error('Falha ao preparar o modo offline:', error)));
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/\/slide\/?$/.test(location.pathname)?<Slides/>:<Session />}
  </React.StrictMode>,
);
