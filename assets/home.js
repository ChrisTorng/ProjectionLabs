import { effects as lyrics } from './lyrics.js';
import { effects as transitions } from './transitions.js';
import { effects as backgrounds } from './backgrounds.js';
import { sceneCSS, sceneHTML } from './scene.js';
const demos=[['lyrics',lyrics.find(e=>e.id==='gradient'),'讓每個字 有自己的光','lyrics'],['transitions',transitions.find(e=>e.id==='circle'),'讓每一幕 成為回憶','transitions'],['backgrounds',backgrounds.find(e=>e.id==='aurora'),'讓光與文字 一起流動','backgrounds'],['composer',backgrounds.find(e=>e.id==='mesh'),'一層一層，組合你的風格','backgrounds'],['motion-atlas',lyrics.find(e=>e.id==='gold'),'看見每一格的變化','lyrics'],['music-motion',lyrics.find(e=>e.id==='wave'),'讓聲音，有了形狀','lyrics'],['ink-song',lyrics.find(e=>e.id==='wipe'),'一筆一畫，跟著節拍','lyrics']];
const style=document.createElement('style');style.textContent=sceneCSS+'\n'+demos.map(d=>d[1].css).join('\n');document.head.append(style);
for(const [id,e,text,lab] of demos){document.querySelector('#preview-'+id).innerHTML=sceneHTML(e,text,'',lab,'從這一幕 開始');}
