if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let o={};const f=e=>n(e,t),d={module:{uri:t},exports:o,require:f};i[t]=Promise.all(s.map((e=>d[e]||f(e)))).then((e=>(r(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-BdnCr98J.css",revision:null},{url:"assets/index-CTdaTtxC.js",revision:null},{url:"index.html",revision:"feb7f49da329c1e1314b404d8b5c4096"},{url:"registerSW.js",revision:"a655560d925c29e5506fd0eb6393f2b8"},{url:"icon-192.png",revision:"7b9955565fbf5d19fd18206bb0ba01bf"},{url:"icon-512.png",revision:"e4441de625fb38261f6aeb4df08adb63"},{url:"manifest.webmanifest",revision:"8cb848c511432003337c369bf6a1f557"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
