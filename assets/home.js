import { effects as lyrics } from './lyrics.js';
import { effects as transitions } from './transitions.js';
import { effects as backgrounds } from './backgrounds.js';
import { sceneCSS, sceneHTML } from './scene.js';
const demos=[['lyrics',lyrics.find(e=>e.id==='gradient'),'讓每個字 有自己的光'],['transitions',transitions.find(e=>e.id==='circle'),'讓每一幕 成為回憶'],['backgrounds',backgrounds.find(e=>e.id==='aurora'),'讓光與文字 一起流動']];
const style=document.createElement('style');style.textContent=sceneCSS+'\n'+demos.map(d=>d[1].css).join('\n');document.head.append(style);
for(const [id,e,text] of demos){document.querySelector('#preview-'+id).innerHTML=sceneHTML(e,text,'',id,'從這一幕 開始');}
