import {groupA} from './cases-a.js';
import {groupB} from './cases-b.js';

const cases=[...groupA,...groupB];
const $=id=>document.getElementById(id);
const stage=$('stage');
let current=cases[0],mode='modern',filter='all',stress=1,playing=true;
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduceMotion) playing=false;

const baseCSS=`
*{box-sizing:border-box}
html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden}
body{background:#091523;color:#f3fbff;font-family:system-ui,"Microsoft JhengHei",sans-serif}
button{font:inherit}
.demo{position:relative;width:100%;height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;isolation:isolate;background:radial-gradient(ellipse 80% 85% at 50% 36%,#183450,#081622 74%);color:#f3fbff}
.demo::before{content:"";pointer-events:none;position:absolute;inset:0;background:linear-gradient(90deg,#34d9ba05 1px,transparent 1px),linear-gradient(#34d9ba05 1px,transparent 1px);background-size:8% 14%}
.demo>*{z-index:1}
html.stage-paused *,html.stage-paused *::before,html.stage-paused *::after{animation-play-state:paused!important;transition-duration:0s!important}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}
`;

function source(c,which){
  const modern=which==='modern';
  const css=modern?c.css:c.oldCSS;
  const html=(modern?c.html:c.oldHTML||c.html);
  const js=modern?(c.js||''):(c.oldJS||c.js||'');
  const load=c.load==='particles' ? particleSetup() : '';
  return {css,html,js,load};
}
function particleSetup(){
  const count=[12,24,48,88,144][stress-1];
  return `
  (function(){
    const field=document.querySelector("#particles");
    let seed=193137;
    const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const frag=document.createDocumentFragment();
    for(let i=0;i<${count};i++){
      const p=document.createElement("span");
      const a=(8+rand()*80).toFixed(2),b=(8+rand()*80).toFixed(2),c=(8+rand()*80).toFixed(2),d=(8+rand()*80).toFixed(2);
      const delay=(rand()*-3.8).toFixed(2);
      p.className="particle";
      p.style.setProperty("--x1",a+"vw");
      p.style.setProperty("--y1",b+"vh");
      p.style.setProperty("--x2",c+"vw");
      p.style.setProperty("--y2",d+"vh");
      p.style.setProperty("--delay",delay+"s");
      p.dataset.a=a;p.dataset.b=b;p.dataset.c=c;p.dataset.d=d;p.dataset.delay=delay;
      frag.append(p);
    }
    field.append(frag);
  })();
  `;
}
function stageHTML(c,which){
  const s=source(c,which);
  const script=`
    window.stagePaused=${!playing};
    addEventListener('message',event=>{
      if(event.data?.type==='labPause'){
        window.stagePaused=!!event.data.paused;
        document.documentElement.classList.toggle('stage-paused',window.stagePaused);
        document.getAnimations().forEach(a=>window.stagePaused?a.pause():a.play());
      }
    });
    ${s.load}
    ${s.js}
  `;
  const safeScript=script;
  return '<!doctype html><html lang="zh-Hant"'+(!playing?' class="stage-paused"':'')+'><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escapeHTML(c.title)+'</title><style>'+baseCSS+'\n'+s.css+'</style></head><body><div class="demo">'+s.html+'</div><script>'+safeScript+'</script></body></html>';
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function support(c){
  if(c.supportSpecial==='function') return null;
  try{return CSS.supports(c.probe[0],c.probe[1])}catch{return false}
}
function inspectFunctionSupport(){
  if(current.supportSpecial!=='function')return;
  try{
    const el=stage.contentDocument.querySelector('.f-panel.a');
    const value=getComputedStyle(el).backgroundImage;
    const ok=value.includes('gradient');
    updateSupportBadge(ok);
  }catch{updateSupportBadge(false);}
}
function updateSupportBadge(ok){
  const label=$('featureState');
  label.textContent=ok?'✓ 此瀏覽器支援 CSS 語法':'⚠ 此瀏覽器不支援／需更新版本';
  label.classList.toggle('no',!ok);
  $('unsupported').hidden=(mode==='legacy'||ok);
}
function renderList(){
  const q=$('search').value.trim().toLowerCase();
  const filtered=cases.filter(c=>(filter==='all'||c.group.includes(filter))&&
    (c.title+c.desc+c.id+c.why+c.year+c.group.join('')).toLowerCase().includes(q));
  $('caseList').replaceChildren(...filtered.map(c=>{
    const btn=document.createElement('button');
    btn.className='case-card'+(c.id===current.id?' active':'');
    btn.type='button';btn.setAttribute('aria-current',c.id===current.id?'true':'false');
    btn.innerHTML='<span class="case-index">'+String(cases.indexOf(c)+1).padStart(2,'0')+'</span><span><strong>'+escapeHTML(c.title)+'</strong><small>'+escapeHTML(c.year)+' ・ '+(c.group.includes('smooth')?'流暢度':c.group.includes('less-js')?'簡化 JS':'新視覺')+'</small></span>';
    btn.addEventListener('click',()=>select(c));
    return btn;
  }));
  if(!filtered.length)$('caseList').textContent='沒有符合條件的案例';
}
function select(c){
  current=c;
  $('caseNumber').textContent='CASE '+String(cases.indexOf(c)+1).padStart(2,'0')+' / '+cases.length;
  $('caseTitle').textContent=c.title;
  $('caseDesc').textContent=c.desc;
  const tags=[c.year,...c.group.map(g=>({'visual':'新視覺','less-js':'簡化 JS','smooth':'效能／流暢'}[g]))];
  $('caseTags').innerHTML=tags.map((t,i)=>'<span class="tag '+(i?'special':'')+'">'+escapeHTML(t)+'</span>').join('');
  $('caseWhy').textContent=c.why;
  $('benefitJS').textContent=c.jsSave;
  $('renderCost').textContent=c.cost;
  $('useCase').textContent=c.use;
  $('caseCaution').textContent='注意：'+c.caution;
  $('refs').innerHTML=c.links.map(([name,url])=>'<a target="_blank" rel="noopener noreferrer" href="'+escapeHTML(url)+'">'+escapeHTML(name)+' ↗</a>').join('');
  $('stress').disabled=c.load!=='particles';
  $('stress').title=c.load==='particles'?'調整舞台物件數':'此案例不提供物件量壓力測試';
  $('stressValue').textContent=c.load==='particles'?([12,24,48,88,144][stress-1]+' 個'):'不適用';
  renderList();renderMode();
}
function renderMode(){
  $('legacyBtn').classList.toggle('selected',mode==='legacy');
  $('modernBtn').classList.toggle('selected',mode==='modern');
  $('legacyBtn').setAttribute('aria-pressed',String(mode==='legacy'));
  $('modernBtn').setAttribute('aria-pressed',String(mode==='modern'));
  $('stageMethod').textContent=mode==='modern'?'NATIVE CSS / NEW':'LEGACY APPROACH';
  $('codeTitle').textContent=mode==='modern'?'新 CSS 核心程式碼':'傳統實作核心程式碼';
  const s=source(current,mode);
  let displayed='/* '+current.title+' - '+(mode==='modern'?'新 CSS':'傳統作法')+' */\n'+s.css;
  if(s.js)displayed+='\n\n/* JavaScript */\n'+s.js;
  if(s.load)displayed+='\n\n/* 舞台負載物件初始化（僅執行一次） */\n'+s.load;
  $('codeText').textContent=displayed;
  $('codeNote').textContent=mode==='modern'?'預覽只執行必要的互動 JS；單純的 CSS 效果不建立逐影格執行緒。':'傳統作法可能使用原生 CSS、額外 DOM 或 JS，依個別案例而定。';
  const heavy=mode==='legacy'&&current.id==='compositor';
  $('jsActivity').textContent=heavy?'每影格 × DOM':s.js?'事件／初始化':'0 持續更新';
  $('jsActivity').style.fontSize=heavy?'16px':'';
  const ok=support(current);
  $('featureState').textContent=ok===null?'CSS @function 渲染驗證中…':'能力確認中…';
  $('featureState').classList.remove('no');
  $('unsupported').hidden=true;
  stage.onload=()=>{
    if(current.supportSpecial==='function')inspectFunctionSupport();
    else updateSupportBadge(support(current));
    if(!playing)freezeStage();
  };
  stage.srcdoc=stageHTML(current,mode);
}
function freezeStage(){
  try{
    const doc=stage.contentDocument;
    if(!doc)return;
    doc.documentElement.classList.toggle('stage-paused',!playing);
    doc.getAnimations().forEach(a=>!playing?a.pause():a.play());
    stage.contentWindow.postMessage({type:'labPause',paused:!playing},'*');
  }catch{}
}
$('legacyBtn').onclick=()=>{mode='legacy';renderMode()};
$('modernBtn').onclick=()=>{mode='modern';renderMode()};
$('resetBtn').onclick=()=>renderMode();
$('playBtn').onclick=()=>{
  playing=!playing;
  $('playBtn').textContent=playing?'Ⅱ 暫停動畫':'▶ 繼續動畫';
  freezeStage();
};
$('playBtn').textContent=playing?'Ⅱ 暫停動畫':'▶ 繼續動畫';
$('fullBtn').onclick=()=>{
  const shell=$('stageShell');
  if(document.fullscreenElement)document.exitFullscreen?.();
  else shell.requestFullscreen?.().catch(()=>{});
};
$('stress').oninput=e=>{stress=Number(e.target.value);$('stressValue').textContent=[12,24,48,88,144][stress-1]+' 個';renderMode()};
$('search').oninput=renderList;
document.querySelectorAll('.filter').forEach(btn=>{
  btn.onclick=()=>{
    filter=btn.dataset.filter;
    document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===btn));
    renderList();
  };
});
$('copyBtn').onclick=async()=>{
  const text=$('codeText').textContent;
  try{await navigator.clipboard.writeText(text);$('copyBtn').textContent='✓ 已複製';setTimeout(()=>$('copyBtn').textContent='複製程式碼',1800)}
  catch{
    const range=document.createRange();range.selectNodeContents($('codeText'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);
    $('copyBtn').textContent='已選取文字';setTimeout(()=>$('copyBtn').textContent='複製程式碼',1800);
  }
};
$('exportBtn').onclick=()=>{
  const blob=new Blob([stageHTML(current,mode)],{type:'text/html;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='ProjectionLabs-new-css-'+current.id+'-'+mode+'.html';
  document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),5000);
};
document.addEventListener('keydown',e=>{
  if(['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement?.tagName))return;
  if(e.key==='ArrowDown'||e.key==='ArrowRight'){
    const i=cases.indexOf(current);select(cases[(i+1)%cases.length]);e.preventDefault();
  }else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){
    const i=cases.indexOf(current);select(cases[(i+cases.length-1)%cases.length]);e.preventDefault();
  }
});
const brands=navigator.userAgent.match(/Edg\/([\d.]+)|Chrome\/([\d.]+)/);
$('browser').textContent=brands?(brands[1]?'Edge ':'Chrome ')+(brands[1]||brands[2]).split('.')[0]+' · 即時偵測':'瀏覽器功能即時偵測';

// rAF observes the parent page event loop only. This is NOT a CPU utilization counter.
let prev=0,buf=[],lastUpdate=0,longEvents=[],longSupported=false;
try{
  if(PerformanceObserver.supportedEntryTypes?.includes('longtask')){
    longSupported=true;
    new PerformanceObserver(list=>{
      for(const item of list.getEntries()) longEvents.push(item.startTime);
    }).observe({entryTypes:['longtask']});
  }
}catch{}
function sample(now){
  if(prev&&document.visibilityState==='visible'){
    const d=now-prev;
    if(d>=3&&d<2000){buf.push(d);if(buf.length>240)buf.shift();}
  }
  prev=now;
  if(now-lastUpdate>=950){
    if(document.visibilityState==='visible'&&buf.length>=15){
      const sorted=[...buf].sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)],p95=sorted[Math.ceil(sorted.length*.95)-1];
      $('hz').textContent=(1000/median).toFixed(0)+' Hz';
      $('p95').textContent=p95.toFixed(1)+' ms';
    }else{
      $('hz').textContent='—';$('p95').textContent='—';
    }
    longEvents=longEvents.filter(t=>now-t<=10000);
    $('longTasks').textContent=longSupported?String(longEvents.length):'不支援';
    lastUpdate=now;
  }
  requestAnimationFrame(sample);
}
requestAnimationFrame(sample);
select(cases[0]);
