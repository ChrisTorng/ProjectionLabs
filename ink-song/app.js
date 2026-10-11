'use strict';
const $=s=>document.querySelector(s),clamp=x=>Math.max(0,Math.min(1,x));
const pages=[{name:'前奏',sub:'一束微光',start:0,bars:2,lines:['光的筆跡','在每一次重來裡，遇見光。'],action:'落筆 · 星光與地平線'},{name:'主歌 01',sub:'夜裡的山徑',start:8,bars:4,lines:['我走過寂靜的山徑','把未說的祈禱交給風'],action:'續筆 · 山巒、足跡與微風'},{name:'主歌 02',sub:'河流的回應',start:24,bars:4,lines:['你在河流深處輕聲回應','讓一粒種子，學會等候光'],action:'流動 · 河水與萌芽'},{name:'副歌 01',sub:'光穿過雲',start:40,bars:4,lines:['願你的光，穿過我的荒野','讓沉睡的心，再一次盛開'],action:'盛放 · 擦去雲霧，繪入日光'},{name:'副歌 02',sub:'一起向光',start:56,bars:4,lines:['我向著你，張開小小的翅膀','在愛的風裡，唱成一片海'],action:'飛翔 · 花海、飛鳥與風'},{name:'回到標題',sub:'重新開始',start:72,bars:2,lines:['光的筆跡','在每一次重來裡，遇見光。'],action:'擦除 · 讓白紙迎接下一個故事'}];
const strokes=[],NS='http://www.w3.org/2000/svg';
let drawSpeed=3,playSpeed=1;
function stroke(d,start,duration=2,color='#50674e',width=5,end=Infinity,kind='',fill='none',group='shared'){
 const e=document.createElementNS(NS,'path');e.setAttribute('d',d);e.setAttribute('fill','none');e.setAttribute('stroke',color);e.setAttribute('stroke-width',width);e.setAttribute('stroke-linecap','round');e.setAttribute('stroke-linejoin','round');$('#art').appendChild(e);
 const len=Math.max(1,e.getTotalLength());e.setAttribute('stroke-dasharray',len+' '+len);e.setAttribute('stroke-dashoffset',len);
 let f=null,rect=null;if(fill!=='none'){const id='paint'+strokes.length,cp=document.createElementNS(NS,'clipPath');cp.id=id;rect=document.createElementNS(NS,'rect');rect.setAttribute('x',0);rect.setAttribute('y',0);rect.setAttribute('width',0);rect.setAttribute('height',640);cp.appendChild(rect);$('#drawing defs').appendChild(cp);f=document.createElementNS(NS,'path');f.setAttribute('d',d);f.setAttribute('fill',fill);f.setAttribute('clip-path','url(#'+id+')');$('#art').insertBefore(f,e);}
 strokes.push({e,f,rect,len,start,duration,end,kind,group});
}
// Shared elements continue across the verse / chorus transition.
stroke('M0 496 Q170 472 360 496 T700 489 T1200 490 L1200 640 H0Z',0,4,'#647658',5,Infinity,'','#d5d3ae');
stroke('M-20 508 Q200 525 440 510 T850 509 T1220 502',3,4,'#879275',5);
// Verse scene: a blue night valley, a winding river and a lone tree.
stroke('M0 50 Q230 12 440 55 T850 44 T1200 55 L1200 490 Q650 470 0 490Z',1,5,'#b2c8cc',0,40,'','#d8e3e0','verse');
stroke('M0 492 L115 318 L180 352 L284 219 L451 430 L520 347 L668 494Z',8,5,'#617b77',6,40,'','#90aaa2','verse');
stroke('M615 494 L754 306 L817 354 L925 230 L1098 404 L1200 311 L1200 498Z',10,5,'#65827b',6,41,'','#a3b5a0','verse');
stroke('M284 219 L249 314 L284 294 L325 306 M925 230 L890 316 L930 294 L969 310',12,3,'#e6e5c9',6,40,'','none','verse');
stroke('M980 83 C918 94 918 167 975 182 C939 157 943 112 980 83Z',2,4,'#bdab6b',4,40,'','#ead594','verse');
for(let i=0;i<15;i++){let x=50+i*77,y=84+(i*37)%106;stroke(`M${x-4} ${y}h8 M${x} ${y-4}v8`,2+i*.3,1,'#869f99',3,40,'','none','verse');}
stroke('M503 485 Q462 527 491 555 Q576 600 405 640 L647 640 Q635 587 560 552 Q520 521 529 485Z',24,5,'#66999b',5,Infinity,'river','#a3c8c2');
stroke('M515 509 Q487 529 530 553 M531 569 Q591 590 525 614',26,3,'#e8efe0',4,Infinity,'river');
stroke('M151 543 Q172 458 159 346 M160 428 L119 389 M166 462 L206 411',16,4,'#766e51',9,40,'','none','verse');
stroke('M159 351 C95 304 43 365 80 402 C34 454 113 487 159 438 C203 485 264 430 231 399 C268 342 196 316 159 351Z',18,4,'#668171',5,40,'','#92aa88','verse');
stroke('M752 514 Q745 469 758 436 M753 479 Q704 439 710 469 Q722 489 753 484 M752 462 Q795 424 800 448 Q787 471 752 466',32,4,'#637c46',6,Infinity,'flower','#b7c88a');
// Chorus changes the valley into an open meadow. The ground, river and seed persist.
stroke('M0 27 Q280 67 490 31 T950 40 T1200 20 L1200 490 Q600 475 0 494Z',40,4,'#dec57f',0,Infinity,'','#f2dfa4','chorus');
stroke('M0 468 Q150 325 348 458 Q585 319 770 458 Q975 295 1200 450 L1200 536 Q615 499 0 538Z',41,5,'#8a995e',6,Infinity,'','#bac584','chorus');
stroke('M843 146 C829 84 922 47 965 101 C1015 166 902 218 860 167Z',42,3,'#bc853c',7,Infinity,'ray','#eac266','chorus');
for(let i=0;i<12;i++){let a=i*Math.PI/6,x=914+83*Math.cos(a),y=132+83*Math.sin(a),xx=914+112*Math.cos(a),yy=132+112*Math.sin(a);stroke(`M${x} ${y}L${xx} ${yy}`,43+i*.15,1,'#c29848',6,Infinity,'ray','none','chorus');}
function flower(x,y,size,start){stroke(`M${x} ${y} Q${x-12} ${y-45} ${x} ${y-size}`,start,2,'#637e49',7,Infinity,'flower','none','chorus');stroke(`M${x} ${y-24}q-43 -47 -48 -11q22 25 48 11 M${x} ${y-35}q48 -41 49 -9q-21 18 -49 9Z`,start+.4,2,'#688451',4,Infinity,'flower','#9cab60','chorus');let cy=y-size;for(let k=0;k<5;k++){let a=k*Math.PI*2/5,px=x+22*Math.cos(a),py=cy+22*Math.sin(a);stroke(`M${x} ${cy} Q${px-22} ${py-29} ${px} ${py} Q${px+25} ${py+22} ${x} ${cy}Z`,start+.8+k*.12,1.5,'#b78853',4,Infinity,'flower',k%2?'#e7bc76':'#e6ce97','chorus');}}
flower(752,514,100,45);flower(166,560,121,47);flower(1020,560,103,49);flower(325,590,104,51);flower(72,613,84,56);flower(865,604,120,57);flower(1163,613,141,58);
for(let i=0;i<28;i++){let x=15+i*45,y=570+(i*37)%65;stroke(`M${x} ${y}q-8 -39 -23 -48 M${x} ${y}q18 -46 37 -56`,47+i*.35,1.5,'#849556',4,Infinity,'grass','none','chorus');}
for(let i=0;i<5;i++){let x=140+i*213,y=207-(i%3)*28;stroke(`M${x-25} ${y}q17 -28 25 0q17 -27 33 -4`,56+i*.7,2,'#627f7d',6,Infinity,'bird','none','chorus');}
for(let i=0;i<4;i++)stroke(`M${20+i*320} ${396-i*12}q64 -38 133 -7t103 -8`,58+i*.8,2,'#b2bc7c',5,Infinity,'wind','none','chorus');
// Keep both skies behind the shared river and seed during scene replacement.
for(const s of strokes.filter(s=>s.e.getAttribute('stroke-width')==='0').reverse()){const art=$('#art');art.insertBefore(s.e,art.firstChild);if(s.f)art.insertBefore(s.f,art.firstChild);}
const ground=strokes[0].f||strokes[0].e;for(const s of strokes.filter(s=>s.group==='chorus'&&s.start===41)){if(s.f)$('#art').insertBefore(s.f,ground);$('#art').insertBefore(s.e,ground);}
let t=0,playing=true,bpm=60,last=performance.now(),lastPage=-1,lastBeat=-1,audio=null,sound=false;
const format=s=>Math.floor(s/60).toString().padStart(2,'0')+':'+Math.floor(s%60).toString().padStart(2,'0');
$('#chapters').innerHTML=pages.map((p,i)=>`<button data-page="${i}"><strong>${p.name}</strong>${p.sub}<br><small>${p.bars} 小節 · ${p.bars*4} 拍</small></button>`).join('');
$('#chapters').addEventListener('click',e=>{const b=e.target.closest('button');if(b){t=pages[+b.dataset.page].start;lastPage=-1;render();}});
function render(){let index=0;for(let j=1;j<pages.length;j++)if(t>=pages[j].start)index=j;const p=pages[index],local=t-p.start;const erase=clamp((t-72)/7.5);
for(let i=0;i<strokes.length;i++){const s=strokes[i];let progress=clamp((t-s.start)*drawSpeed/s.duration),visibility=1;
if(t>=s.end)visibility=1-clamp((t-s.end)/2);if(t>=72){const order=(strokes.length-i)/strokes.length;visibility*=1-clamp((erase-order*.65)/.35);}
s.e.setAttribute('stroke-dashoffset',(1-progress*visibility)*s.len);s.e.setAttribute('opacity',progress>0?visibility:0);
if(s.f){s.rect.setAttribute('width',1200*clamp((progress-.12)/.88));s.f.setAttribute('opacity',visibility*.88);}
let dx=0,dy=0;if(s.kind==='bird'){dx=Math.sin(t*.4)*35;dy=Math.sin(t*1.2+i)*6;}if(s.kind==='river'||s.kind==='wind')dx=Math.sin(t*1.2+i)*4;if(s.kind==='flower'||s.kind==='grass')dx=Math.sin(t*.9+i*.025)*2.8;
s.e.setAttribute('transform',`translate(${dx} ${dy})`);if(s.f)s.f.setAttribute('transform',`translate(${dx} ${dy})`);
}
if(index!==lastPage){$('#sectionName').textContent=index===0?'原創詩歌範例':index===5?'終章 · 擦去，再開始':p.name;$('#line1').textContent=p.lines[0];$('#line2').textContent=p.lines[1];$('#sceneLabel').textContent=p.name+' / '+p.sub;$('#action').textContent=p.action;document.querySelectorAll('#chapters button').forEach((b,i)=>b.classList.toggle('active',i===index));lastPage=index;}
$('#line1').style.opacity=clamp(local/1.5)*(index===5?1-erase*.65:1);$('#line2').style.opacity=index===0||index===5?clamp((local-1)/2):clamp((local-8)/1.2);$('#bar').textContent=`第 ${Math.min(p.bars,Math.floor(local/4)+1)} / ${p.bars} 小節`;$('#seek').value=t;$('#time').textContent=format(t*60/bpm)+' / '+format(80*60/bpm);document.querySelectorAll('.beats i').forEach((e,i)=>e.classList.toggle('on',i===Math.floor(t)%4));}
function tick(now){if(playing){t+=(now-last)/1000*bpm/60*playSpeed;if(t>=80){t%=80;lastPage=-1;}const beat=Math.floor(t);if(beat!==lastBeat){if(sound&&audio){const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=beat%4===0?880:550;g.gain.setValueAtTime(.04,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.08);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.09);}lastBeat=beat;}}last=now;requestAnimationFrame(tick);try{render();}catch(error){console.error(error);$('#action').textContent='播放錯誤：'+error.message;}}
$('#play').onclick=()=>{last=performance.now();playing=!playing;$('#play').textContent=playing?'❚❚ 暫停':'▶ 播放';};$('#restart').onclick=()=>{t=0;lastPage=-1;render();};$('#seek').oninput=e=>{t=Math.min(79.999,+e.target.value);render();};$('#bpm').onchange=e=>{bpm=Math.max(30,Math.min(180,Number(e.target.value)||60));e.target.value=bpm;};$('#sound').onclick=async()=>{if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();await audio.resume();sound=!sound;$('#sound').textContent=sound?'♩ 節拍音：開':'♩ 節拍音：關';$('#sound').setAttribute('aria-pressed',sound);};$('#focus').onclick=()=>{document.body.classList.toggle('focus');$('#focus').textContent=document.body.classList.contains('focus')?'↙ 返回實驗室':'↗ 專注播放';};document.addEventListener('visibilitychange',()=>{last=performance.now();});document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.body.classList.remove('focus');$('#focus').textContent='↗ 專注播放';}if(e.code==='Space'&&!/INPUT|TEXTAREA|BUTTON|SUMMARY/.test(e.target.tagName)){e.preventDefault();$('#play').click();}});
$('#lyricInputs').innerHTML=pages.slice(1,5).map((p,i)=>`<label>${p.name}<textarea id="edit${i}" rows="2">${p.lines.join('\n')}</textarea></label>`).join('');$('#apply').onclick=()=>{const lines=pages.slice(1,5).map((p,i)=>$('#edit'+i).value.split('\n').map(s=>s.trim()).filter(Boolean));if(lines.some(l=>l.length!==2)){alert('主歌與副歌每頁請填入兩行歌詞。');return;}pages[0].lines[0]=pages[5].lines[0]=$('#titleEdit').value.trim()||'光的筆跡';pages.slice(1,5).forEach((p,i)=>p.lines=lines[i]);lastPage=-1;render();$('#apply').textContent='已套用 ✓';setTimeout(()=>$('#apply').textContent='套用歌詞',1800);};
$('#drawSpeed').onchange=e=>{drawSpeed=+e.target.value;render();};$('#playSpeed').onchange=e=>playSpeed=+e.target.value;
requestAnimationFrame(tick);
