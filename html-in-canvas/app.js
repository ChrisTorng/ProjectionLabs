import {scenes,sceneCode} from './scenes.js';
import {LaboratoryEngine} from './engine.js';
const $=id=>document.getElementById(id);
const stage=$('stage');
let current=scenes[0],selected='dom',playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,intensity=.46,fault='',faultPending=false;
const engine=new LaboratoryEngine(stage,reason=>{
  if(faultPending)return;
  fault=reason;faultPending=true;
  queueMicrotask(()=>{
    faultPending=false;
    selected='dom';
    renderScene();
    $('rendererState').textContent='⚠ 原生繪製發生錯誤，已切換 DOM 替代：'+fault;
  });
});
selected=engine.supported(current)?'native':'dom';

function label(text,type=''){return '<span class="'+type+'">'+text+'</span>';}
function renderSceneList(){
  $('sceneList').replaceChildren(...scenes.map((scene,i)=>{
    const b=document.createElement('button');
    b.type='button';b.className='scene-choice'+(scene===current?' active':'');
    b.setAttribute('aria-current',String(scene===current));
    const num=document.createElement('span');num.className='index';num.textContent=String(i+1).padStart(2,'0');
    const part=document.createElement('span'),title=document.createElement('strong'),note=document.createElement('small');
    title.textContent=scene.name;note.textContent=scene.caption;
    part.append(title,note);b.append(num,part);
    b.onclick=()=>{current=scene;fault='';if(selected==='native'&&!engine.supported(current))selected='dom';renderScene();};
    return b;
  }));
}
function renderCapabilities(){
  const cap=[
    ['Canvas 2D · drawElementImage',engine.features.twoD],
    ['WebGL2',engine.features.webgl2],
    ['HTML → WebGL 紋理',engine.features.htmlTexture],
    ['captureElementImage',engine.features.snapshot],
    ['updateElementGeometry',engine.features.geometry],
    ['新 content 屬性',engine.features.content]
  ];
  $('capabilities').replaceChildren(...cap.map(([name,yes])=>{
    const tile=document.createElement('div');tile.className='cap-tile'+(yes?'':' fail');
    const a=document.createElement('b');a.textContent=name;
    const b=document.createElement('span');b.textContent=yes?'✓ 可呼叫':'— 尚未提供';
    tile.append(a,b);return tile;
  }));
  const available=engine.features.twoD;
  $('supportText').textContent=available?'此瀏覽器已開啟原生 HTML-in-Canvas':'尚未啟用原生 HTML-in-Canvas';
  $('supportDetail').textContent=available?'Canvas 2D API 可用，WebGL 依獨立偵測':'可使用 DOM 與 Canvas 2D 替代展示；啟用旗標或 Origin Trial 後重新整理';
}
function $(id){return document.getElementById(id)}
function renderModeSwitch(){
  document.querySelectorAll('[data-mode]').forEach(b=>{
    const m=b.dataset.mode;
    b.classList.toggle('active',m===selected);
    b.setAttribute('aria-pressed',String(m===selected));
    b.disabled=m==='native'&&!engine.supported(current);
    b.title=b.disabled?'此場景的原生 API 尚未開啟':'切換渲染作法';
  });
}
function codeForCurrent(){
  if(selected==='native')return sceneCode[current.id]||'// 參見 engine.js';
  if(selected==='dom')return `<!-- 標準 DOM 疊層，沒有使用 HTML-in-Canvas -->
<div class="stage">
  <section class="fallback-source">
    <h2>${$('displayText').value}</h2>
    <p>普通 HTML 與 CSS</p>
  </section>
</div>
/* transform、opacity 可以由 CSS 管理動畫。
   這是對照用替代方案，並不是 HTML-in-Canvas。 */`;
  return `// 傳統 Canvas 2D，不包含可互動的 HTML 子樹
const ctx = canvas.getContext('2d');
ctx.font = 'bold 40px system-ui';
ctx.textAlign = 'center';
ctx.fillText('歌詞文字', canvas.width/2, canvas.height/2);
// 換行、字級、自訂表單、焦點與文字選取需自行實作。`;
}
function renderScene(){
  renderSceneList();
  $('sceneIndex').textContent=String(scenes.indexOf(current)+1).padStart(2,'0')+' / '+String(scenes.length).padStart(2,'0')+' · '+(current.kind==='webgl'?'WEBGL':'CANVAS 2D');
  $('sceneTitle').textContent=current.name;
  $('sceneDesc').textContent=current.desc;
  $('sceneChips').replaceChildren(...current.tags.map(x=>{
    const chip=document.createElement('span');chip.textContent=x;return chip;
  }));
  $('howText').textContent=current.how;$('lessJS').textContent=current.less;
  $('cost').textContent=current.cost;$('fit').textContent=current.fit;$('warning').textContent='設計注意：'+current.warning;
  if(selected==='native'&&!engine.supported(current))selected='dom';
  engine.start(current,selected,$('displayText').value,playing,intensity);
  renderModeSwitch();
  $('frameBadge').textContent=selected==='native'?'EXPERIMENTAL NATIVE':selected==='dom'?'STANDARD DOM FALLBACK':'CLASSIC CANVAS 2D';
  $('rendererState').textContent=fault?'⚠ 前次原生渲染失敗：'+fault:selected==='native'?'✓ 正在使用實驗性原生 API':selected==='dom'?'目前使用一般 HTML/CSS 疊層（非新 API）':'目前使用手動 Canvas 2D 排字（非新 API）';
  $('code').textContent=codeForCurrent();
  updateStats();
}
function updateStats(){
  const stats=engine.metrics();$('drawCalls').textContent=stats.draws.toLocaleString();
  $('paintEvents').textContent=stats.paints.toLocaleString();
  $('drawP95').textContent=stats.p95;
}
renderCapabilities=function(){
  const cap=[
    ['Canvas 2D · drawElementImage',engine.features.twoD],
    ['WebGL2',engine.features.webgl2],
    ['HTML → WebGL 紋理',engine.features.htmlTexture],
    ['captureElementImage',engine.features.snapshot],
    ['updateElementGeometry',engine.features.geometry],
    ['新 content 屬性',engine.features.content]
  ];
  $('capabilities').replaceChildren(...cap.map(([name,yes])=>{
    const tile=document.createElement('div');tile.className='cap-tile'+(yes?'':' fail');
    const a=document.createElement('b');a.textContent=name;
    const b=document.createElement('span');b.textContent=yes?'✓ 可呼叫':'— 尚未提供';
    tile.append(a,b);return tile;
  }));
  const available=engine.features.twoD;
  const card=document.querySelector('.status-card');card.classList.toggle('no',!available);
  $('supportText').textContent=available?'已啟用原生 HTML-in-Canvas API':'原生 HTML-in-Canvas 尚未啟用';
  const ua=navigator.userAgent.match(/Edg\/([\d.]+)|Chrome\/([\d.]+)/);
  $('supportDetail').textContent=(ua?(ua[1]?'Edge ':'Chrome ')+(ua[1]||ua[2]).split('.')[0]+' · ':'')+
    (available?'2D 可用；WebGL 紋理仍需獨立支援':'可使用替代模式；啟用 Origin Trial 或 Flag 後重新整理');
};
document.querySelectorAll('[data-mode]').forEach(b=>{
  b.onclick=()=>{
    const m=b.dataset.mode;if(m==='native'&&!engine.supported(current))return;
    selected=m;fault='';renderScene();
  };
});
$('displayText').addEventListener('input',()=>{
  engine.updateText($('displayText').value);
  $('code').textContent=codeForCurrent();
});
const samples=['祢的光照亮我心','主，我願意，請差我去','暴風雨中祢仍作王','讓文字在光中自由飛翔','祢的信實直到永遠'];
let sampleIndex=0;
$('randomText').onclick=()=>{
  sampleIndex=(sampleIndex+1)%samples.length;$('displayText').value=samples[sampleIndex];
  engine.updateText(samples[sampleIndex]);$('code').textContent=codeForCurrent();
};
$('intensity').oninput=e=>{
  intensity=Number(e.target.value)/100;
  $('intensityValue').textContent=e.target.value+'%';
  engine.updateIntensity(intensity);
};
$('playBtn').onclick=()=>{
  playing=!playing;
  $('playBtn').textContent=playing?'Ⅱ 暫停動態':'▶ 繼續動態';
  engine.setPlaying(playing);
};
$('playBtn').textContent=playing?'Ⅱ 暫停動態':'▶ 繼續動態';
$('refreshBtn').onclick=()=>{fault='';renderScene();};
$('fullscreenBtn').onclick=()=>{
  if(document.fullscreenElement)document.exitFullscreen?.();
  else stage.requestFullscreen?.().catch(()=>{});
};
$('copyCode').onclick=async()=>{
  try{
    await navigator.clipboard.writeText($('code').textContent);
    $('copyCode').textContent='已複製';
  }catch{
    const sel=getSelection(),range=document.createRange();
    range.selectNodeContents($('code'));sel.removeAllRanges();sel.addRange(range);
    $('copyCode').textContent='已選取';
  }
  setTimeout(()=>$('copyCode').textContent='複製',1600);
};
$('copyFlag').onclick=async()=>{
  try{await navigator.clipboard.writeText('chrome://flags/#canvas-draw-element');$('copyFlag').textContent='✓ 已複製網址';}
  catch{$('copyFlag').textContent='請手動複製上方網址';}
  setTimeout(()=>$('copyFlag').textContent='複製 Chrome Flag 網址',1600);
};
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){engine.setPlaying(false);}
  else engine.setPlaying(playing);
});
document.addEventListener('keydown',e=>{
  if(['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement?.tagName))return;
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
    const ix=scenes.indexOf(current),next=e.key==='ArrowRight'?1:-1;
    current=scenes[(ix+next+scenes.length)%scenes.length];
    fault='';renderScene();e.preventDefault();
  }
});
let last=0,intervals=[],lastReport=0;
function observe(now){
  if(last&&document.visibilityState==='visible'){
    const d=now-last;if(d>3&&d<180)intervals.push(d);
    if(intervals.length>180)intervals.shift();
  }
  last=now;
  if(now-lastReport>=750){
    updateStats();
    const ordered=[...intervals].sort((a,b)=>a-b);
    $('frameP95').textContent=ordered.length>=15?ordered[Math.ceil(ordered.length*.95)-1].toFixed(1)+' ms':'—';
    lastReport=now;
  }
  requestAnimationFrame(observe);
}
renderCapabilities();
renderScene();
requestAnimationFrame(observe);
