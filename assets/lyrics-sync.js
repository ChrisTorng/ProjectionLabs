// ProjectionLabs: word-accurate karaoke typography and beat-driven motion.
// All times below are media seconds; requestAnimationFrame never accumulates time.
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const secText = value => {
  const t = Math.max(0, value || 0);
  const minutes = Math.floor(t / 60);
  const seconds = Math.floor(t % 60);
  const milliseconds = Math.floor((t - Math.floor(t)) * 1000 + 0.0001);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
};
const assTime = t => {
  const cs = Math.max(0,Math.round(t*100));
  const h=Math.floor(cs/360000),m=Math.floor(cs/6000)%60,s=Math.floor(cs/100)%60;
  return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs%100).padStart(2,'0')}`;
};

const GROUPS = [
 {id:'appearance', title:'01 · 字體與色彩', desc:'每一項皆可獨立疊加，放大、變色、陰影、淡入淡出互不綁定。'},
 {id:'movement', title:'02 · 位置與動作', desc:'左右、上下移動及彈性變形可與其他層共同執行。'},
 {id:'reveal', title:'03 · 字面揭露／成形', desc:'同組採單選，避免兩種遮罩互相覆蓋；可與其他組自由堆疊。'},
 {id:'accent', title:'04 · 裝飾與能量', desc:'逐字底線、光環、光點、掃光、節拍脈衝。'},
 {id:'ball', title:'05 · 跳球與碰撞', desc:'同組採單選。跳球真正走拋物線，落點與每字起音一致。'}
];
const FX_CATALOG = [
 ['scale','逐字放大','起音放大，迅速回彈','appearance'],
 ['color','逐字變色','唱到時變成重點色','appearance'],
 ['shadow','逐字陰影','起音時凝聚文字陰影','appearance'],
 ['fade','逐字淡入淡出','音頭淡入，唱完保留低亮度','appearance'],
 ['squash','字體彈性縮放','字面微壓扁再回彈','appearance'],
 ['glow','霓虹柔光','重點字有柔亮的暈光','appearance'],
 ['trail','雙色分光','青紫偏移形成科幻色差','appearance'],
 ['lift','向上抬起','唱到時從下向上抬起','movement'],
 ['drop','由上落下','文字由上方落到定位','movement'],
 ['slide-left','左側滑入','文字從左側滑到原位','movement'],
 ['slide-right','右側滑入','文字從右側滑到原位','movement'],
 ['tilt','逐字旋擺','左右輕旋，回到水平','movement'],
 ['shift','位置位移','用 X / Y 滑桿獨立調整位移','movement'],
 ['fill','空心 → 水平實心','逐字從左向右填入','reveal'],
 ['fill-down','空心 → 垂直實心','逐字從上向下灌滿','reveal'],
 ['fill-circle','空心 → 圓形填入','從字的中央擴張成實心','reveal'],
 ['fill-center','空心 → 兩側展開','由中央同時朝左右填入','reveal'],
 ['fill-diagonal','空心 → 斜向掃過','斜切邊界通過字面','reveal'],
 ['glyph-fall','彩色字墜入空心字','彩色實心字由上掉進描邊輪廓','reveal'],
 ['assemble','四散碎片聚合','四個字形分片飛回組成整字','reveal'],
 ['underline','逐字生長底線','從左至右伸展的細線','accent'],
 ['pulse','拍點縮放','長音按每拍再次脈衝','accent'],
 ['spark','撞擊星光','起音時短暫放射光點','accent'],
 ['halo','圓形光環','起音時展開一圈細光環','accent'],
 ['shimmer','字面掃光','細窄光線沿文字移動','accent'],
 ['ball','連續拋物線跳球','跳球在空中移到下一字、落下後自然反彈；長音在原字重跳','ball'],
 ['ball-impact','落球爆裂','球從上落到字頂，撞擊時分裂成發光粒子','ball'],
 ['ball-ink','落球灌入字形','球落下消失，同時由上往下為空心字填色','ball']
];
const ALL_FX = FX_CATALOG.map(([id,title,desc,group])=>({id,title,desc,group}));
const EXCLUSIVE = new Set(['reveal','ball']);
const PRESETS = {
 gentle:{name:'輕柔',desc:'淡入、微光與柔和的逐字底線',accentColor:'#c2f1dd',baseColor:'#dce5ee',bgColor:'#08182a',fontSize:7.2,scale:9,shadow:8,stroke:1.3,underline:2,ballSize:19,bounce:20,moveX:0,moveY:0,fx:['fade','color','shadow','underline']},
 obvious:{name:'明顯',desc:'逐字強調、底線與連續拋物線跳球',accentColor:'#ffe1a1',baseColor:'#dce7f0',bgColor:'#091b2e',fontSize:7.6,scale:27,shadow:13,stroke:1.4,underline:4,ballSize:20,bounce:39,moveX:0,moveY:0,fx:['scale','color','shadow','underline','ball']},
 exaggerated:{name:'誇張',desc:'彈性變形、強光、落球爆裂與粒子',accentColor:'#ffa3cf',baseColor:'#eef3ff',bgColor:'#1c102c',fontSize:8,scale:56,shadow:30,stroke:1.9,underline:5,ballSize:24,bounce:60,moveX:0,moveY:0,fx:['scale','squash','color','glow','spark','ball-impact']},
 modern:{name:'現代',desc:'水平填色、乾淨底線與側向滑入',accentColor:'#79f2dc',baseColor:'#d1e1ed',bgColor:'#071d29',fontSize:7.7,scale:15,shadow:5,stroke:1.6,underline:3,ballSize:19,bounce:25,moveX:0,moveY:0,fx:['fill','slide-left','color','underline']},
 scifi:{name:'科幻',desc:'圓形揭露、雙色分光與脈衝光環',accentColor:'#74eaff',baseColor:'#c7d4e7',bgColor:'#080c24',fontSize:7.8,scale:22,shadow:26,stroke:1.7,underline:2,ballSize:21,bounce:37,moveX:0,moveY:0,fx:['fill-circle','trail','glow','pulse','halo']},
 cinematic:{name:'電影感',desc:'垂直填滿，層次光影與緩緩上浮',accentColor:'#ffe1a3',baseColor:'#d4dce8',bgColor:'#181522',fontSize:7.9,scale:15,shadow:21,stroke:1.4,underline:2,ballSize:19,bounce:26,moveX:0,moveY:0,fx:['fill-down','fade','shadow','glow','lift']},
 retro:{name:'復古歌球',desc:'傳統跳球在整句上方按字跳躍',accentColor:'#ffc974',baseColor:'#eee1cc',bgColor:'#221b18',fontSize:7.7,scale:15,shadow:9,stroke:1.7,underline:2,ballSize:23,bounce:45,moveX:0,moveY:0,fx:['ball','color','scale']},
 impact:{name:'能量灌注',desc:'落球碰撞空心字，墨色從上往下流入',accentColor:'#7ce8ff',baseColor:'#c2d8e5',bgColor:'#071d2c',fontSize:8,scale:9,shadow:20,stroke:2,underline:3,ballSize:22,bounce:49,moveX:0,moveY:0,fx:['ball-ink','fill-down','glow','spark']},
 fragments:{name:'碎片重組',desc:'零件從四周高速匯聚，組成發光文字',accentColor:'#b9a1ff',baseColor:'#d7d1e9',bgColor:'#12112a',fontSize:7.9,scale:12,shadow:22,stroke:1.3,underline:3,ballSize:19,bounce:42,moveX:0,moveY:0,fx:['assemble','shadow','glow','underline']},
 gravity:{name:'色彩墜入',desc:'彩色實心字從上方掉下，落入空心文字',accentColor:'#f9b77c',baseColor:'#dbe0e8',bgColor:'#172333',fontSize:8,scale:16,shadow:12,stroke:2,underline:2,ballSize:20,bounce:38,moveX:0,moveY:0,fx:['glyph-fall','spark','shadow']},
 pure:{name:'全無效果',desc:'整句維持靜態；用於確認疊加前後差異',accentColor:'#fff2d8',baseColor:'#e5edf8',bgColor:'#091625',fontSize:7.6,scale:0,shadow:0,stroke:1.3,underline:2,ballSize:19,bounce:35,moveX:0,moveY:0,fx:[]}
};
const state = {data:null, originalDemo:null, bpm:96, beatsPerBar:4, beatOffset:0, duration:45, wordAlignment:'manual-demo',
  preset:'obvious', settings:{}, fx:new Set(), playing:false, position:0, loop:true, clicks:true,
  media:null, mediaUrl:null, context:null, origin:0, scheduler:null, raf:0, nextBeat:0, sources:[],
  displayedLine:-2, activeWord:-2, displayedBeat:-2, isSeeking:false, ballEvents:[], melodyEvents:[], nextNote:0};
const ids = ['fontSize','scale','shadow','stroke','underline','ballSize','bounce','moveX','moveY','baseColor','accentColor','bgColor'];
let glyphs = [], chipButtons = [], toastTimer;
const landingCache = new Map(); // Stable glyph geometry; never follow animated glyph transforms.
let initialized = false;
function toast(message){const node=$('#toast');node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),3200);}
function setStyle(){
  const o=state.settings, stage=$('#projection');
  stage.style.setProperty('--stage-bg',o.bgColor);
  stage.style.setProperty('--highlight',o.accentColor);
  stage.style.setProperty('--inactive',o.baseColor);
  stage.style.setProperty('--active',o.accentColor);
  stage.style.setProperty('--lyric-font',o.fontSize+'cqw');
  stage.style.setProperty('--stroke-size',o.stroke+'px');
  stage.style.setProperty('--underline-size',o.underline+'px');
  // Diameter follows the glyph width, not a fixed pixel radius. The physical engine sets the final diameter.
  stage.style.setProperty('--shift-x',state.fx.has('shift')?o.moveX+'px':'0px');
  stage.style.setProperty('--shift-y',state.fx.has('shift')?o.moveY+'px':'0px');
  document.documentElement.style.setProperty('--accent',o.accentColor);
  for(const id of ids){const e=$('#'+id);if(e)e.value=o[id];const v=$('#'+id+'-val');if(v)v.textContent=id==='fontSize'?o[id]+' cqw':id==='scale'?o[id]+'%':id==='ballSize'?o[id]+'% 字寬':id==='shadow'||id==='bounce'||id==='underline'||id==='moveX'||id==='moveY'?o[id]+' px':id==='stroke'?o[id]+' px':'';}
  $$('#preset-select [data-preset],#preset-grid [data-preset]').forEach(e=>e.classList.toggle('active',e.dataset.preset===state.preset));
  $$('#fx-grid [data-fx]').forEach(e=>{const selected=state.fx.has(e.dataset.fx);e.classList.toggle('enabled',selected);e.setAttribute('aria-pressed',String(selected));e.querySelector('.fx-indicator').textContent=selected?'● 已啟用':'○ 未啟用';});
  $$('#fx-grid .fx-none').forEach(e=>{const members=ALL_FX.filter(f=>f.group===e.dataset.group);const none=!members.some(f=>state.fx.has(f.id));e.classList.toggle('enabled',none);e.setAttribute('aria-pressed',String(none));});
  landingCache.clear();
  $('#jumpStyle').value=o.jumpStyle||'auto';
  if(state.displayedLine>=0)buildStage(state.displayedLine);
  renderAt(position());
}
function usePreset(id){
  const p=PRESETS[id];if(!p)return;
  state.preset=id;
  state.settings={...Object.fromEntries(ids.map(k=>[k,p[k]])),jumpStyle:p.jumpStyle||'auto'};
  state.fx=new Set(p.fx);
  setStyle();
}
function renderSelectors(){
  $('#preset-select').innerHTML=Object.entries(PRESETS).map(([id,p])=>`<button type="button" data-preset="${id}">${p.name}</button>`).join('');
  $('#fx-grid').innerHTML=GROUPS.map(g=>`<section class="fx-group" data-group="${g.id}"><div class="fx-group-header"><h3>${g.title}</h3><p>${g.desc}</p></div><div class="fx-group-grid"><button type="button" class="fx-card fx-none" data-group="${g.id}" aria-pressed="false"><span class="fx-preview demo-none"><span class="fx-demo-word">原樣</span></span><span class="fx-card-heading"><span>無效果</span><span class="fx-indicator">○ 保留原樣</span></span><span class="fx-desc">清空本類別，其他類別完全保留</span></button>${ALL_FX.filter(f=>f.group===g.id).map(f=>`<button type="button" class="fx-card" data-fx="${f.id}" aria-pressed="false"><span class="fx-preview sample-${f.id}"><span class="fx-demo-word">歌詞</span><i class="fx-sample-dot"></i></span><span class="fx-card-heading"><span>${f.title}</span><span class="fx-indicator">○ 未啟用</span></span><span class="fx-desc">${f.desc}</span></button>`).join('')}</div></section>`).join('');
  $('#preset-grid').innerHTML=Object.entries(PRESETS).map(([id,p])=>`<button type="button" class="preset-card" data-preset="${id}" style="--preset-color:${p.accentColor};--preset-glow:${p.accentColor}55"><span class="preset-card-preview preset-${id}"><span class="preset-text">祢的光 照亮我</span></span><span class="preset-card-detail"><strong>${p.name}</strong><p>${p.desc}</p><small>${p.fx.length?p.fx.map(id=>ALL_FX.find(f=>f.id===id)?.title).join(' + '):'無動態'}</small></span></button>`).join('');
  $('#preset-select').addEventListener('click',e=>{const b=e.target.closest('[data-preset]');if(b)usePreset(b.dataset.preset);});
  $('#preset-grid').addEventListener('click',e=>{const b=e.target.closest('[data-preset]');if(b){usePreset(b.dataset.preset);$('#projection').scrollIntoView({behavior:'smooth',block:'center'});}});
  $('#fx-grid').addEventListener('click',e=>{
    const none=e.target.closest('.fx-none');if(none){for(const f of ALL_FX.filter(f=>f.group===none.dataset.group))state.fx.delete(f.id);state.preset=null;setStyle();return;}
    const b=e.target.closest('[data-fx]');if(!b)return;
    const id=b.dataset.fx,f=ALL_FX.find(x=>x.id===id),enabled=state.fx.has(id);
    if(!enabled&&EXCLUSIVE.has(f.group))for(const other of ALL_FX.filter(x=>x.group===f.group))state.fx.delete(other.id);
    enabled?state.fx.delete(id):state.fx.add(id);
    state.preset=null;setStyle();
  });
  for(const key of ids){$('#'+key)?.addEventListener('input',e=>{state.settings[key]=e.target.type==='color'?e.target.value:Number(e.target.value);state.preset=null;setStyle();});}
  $('#jumpStyle').addEventListener('change',e=>{state.settings.jumpStyle=e.target.value;state.preset=null;setStyle();});
  $('#reset-style').addEventListener('click',()=>usePreset('obvious'));
}
function normalizeData(raw,mode='precise'){
  if(!raw || !Array.isArray(raw.lines))throw Error('找不到 lines 歌詞陣列');
  const lines=raw.lines.map(line=>{
    const text=String(line.text??'').trim();
    const start=Number(line.start), end=Number(line.end);
    if(!text||!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<=start)throw Error('某句歌詞的 start/end 無效');
    let words;
    if(Array.isArray(line.words)&&line.words.length){
      words=line.words.map(w=>({text:String(w.text??''),start:Number(w.start),end:Number(w.end),note:Number(w.note)||undefined}));
      for(const w of words)if(!w.text||!Number.isFinite(w.start)||!Number.isFinite(w.end)||w.end<=w.start||w.start<start-0.001||w.end>end+0.001)throw Error('某字的 start/end 超出所在句或不合法');
      words.sort((a,b)=>a.start-b.start);
    }else words=estimateWords(text,start,end);
    return {text,start,end,words,rhythm:String(line.rhythm||'')};
  }).sort((a,b)=>a.start-b.start);
  if(!lines.length)throw Error('檔案中沒有歌詞');
  const bpm=Number(raw.bpm)||104;
  const beatsPerBar=Number(raw.beatsPerBar)||4;
  const duration=Math.max(Number(raw.duration)||0,...lines.map(l=>l.end));
  return {title: String(raw.title||'自訂歌詞'),bpm:clamp(bpm,30,300),beatsPerBar:clamp(Math.round(beatsPerBar),1,12),
    beatOffset:Number(raw.beatOffset)||0, duration,alignment:mode,lines};
}
function estimateWords(text,start,end){
  const chars=Array.from(text).filter(c=>!/^\s$/u.test(c));
  return chars.map((ch,i)=>({text:ch,start:start+(end-start)*i/chars.length,end:start+(end-start)*(i+1)/chars.length}));
}
function useData(data,alignment='precise'){
  pause();state.data=normalizeData(data,alignment);state.duration=state.data.duration;state.bpm=state.data.bpm;state.beatsPerBar=state.data.beatsPerBar;state.beatOffset=state.data.beatOffset;state.wordAlignment=alignment;
  state.position=0;state.displayedLine=-2;state.activeWord=-2;
  $('#bpm').value=state.bpm;$('#bpm-val').textContent=state.bpm+' BPM';
  $('#seek').max=state.duration;$('#seek').value=0;
  const badge=$('#alignment-status');badge.textContent=alignment==='manual-demo'?'ASS 示範逐字對位':'ASS 卡拉 OK 精準時間';badge.classList.remove('estimated');
  $('#word-count').textContent=state.data.lines.reduce((n,l)=>n+l.words.length,0);
  $('#stage-counter').textContent=`${state.bpm} BPM · ${state.beatsPerBar}/4`;
  $('#data-note').innerHTML='單一 <b>ASS</b> 檔案包含整句起迄、每個音節的 <code>\\kf</code> 時值，以及空音節休止。匯入後依精確音節時間驅動效果；無須 SRT 或外部 JSON。BPM 註解是本實驗室額外使用的選填資訊。';
  landingCache.clear();rebuildEvents();buildTimeline();renderAt(0);
}
function buildTimeline(){
  const target=$('#timeline');target.replaceChildren();chipButtons=[];
  state.data.lines.forEach((line,li)=>{
    const el=document.createElement('div');el.className='timing-line';el.dataset.line=li;
    const head=document.createElement('div');head.className='timing-title';
    const name=document.createElement('span');name.textContent=`${String(li+1).padStart(2,'0')} · ${line.text}`;
    const times=document.createElement('span');times.textContent=`${secText(line.start)} – ${secText(line.end)}`;
    head.append(name,times);el.append(head);if(line.rhythm){const rh=document.createElement('div');rh.className='timing-rhythm';rh.textContent=line.rhythm;el.append(rh);}
    const chips=document.createElement('div');chips.className='word-chips';
    const row=[];
    line.words.forEach((w,wi)=>{
      const b=document.createElement('button');b.type='button';b.className='word-chip';b.textContent=w.text;
      b.title=`${w.text}：${secText(w.start)} ～ ${secText(w.end)}${w.note?' · MIDI '+w.note:''}`;if(w.end-w.start>=3*60/state.bpm)b.classList.add('long-note');
      b.addEventListener('click',()=>seekTo(w.start));chips.append(b);row.push(b);
    });el.append(chips);target.append(el);chipButtons.push(row);
  });
}
function currentLineIndex(t){const lines=state.data.lines;for(let i=0;i<lines.length;i++)if(t>=lines[i].start&&t<lines[i].end)return i;return -1;}
// Split displayed text into the original timed ASS syllables and untimed separators.
// Supports one Chinese character per syllable as well as multi-character English words.
function lineParts(line){
  const parts=[];let offset=0;
  line.words.forEach((w,wi)=>{
    const index=line.text.indexOf(w.text,offset);
    if(index<0)throw Error(`歌詞「${line.text}」找不到 ASS 音節「${w.text}」`);
    if(index>offset)parts.push({text:line.text.slice(offset,index),wi:-1});
    parts.push({text:w.text,wi});offset=index+w.text.length;
  });
  if(offset<line.text.length)parts.push({text:line.text.slice(offset),wi:-1});
  return parts;
}
function buildStage(index){
  const stage=$('#projection-lyrics');stage.replaceChildren();glyphs=[];
  if(index<0){stage.textContent='';return;}
  const line=state.data.lines[index];
  for(const part of lineParts(line)){
    const ch=part.text;
    if(part.wi<0){const s=document.createElement('span');s.className='glyph space';s.textContent=ch;stage.append(s);continue;}
    const span=document.createElement('span');span.className='glyph';
    const reveal=ALL_FX.find(f=>f.group==='reveal'&&state.fx.has(f.id));
    span.dataset.drawn=reveal?reveal.id:'none';
    const outline=document.createElement('span');outline.className='glyph-outline';outline.textContent=ch;
    const solid=document.createElement('span');solid.className='glyph-solid';solid.textContent=ch;
    const under=document.createElement('span');under.className='underline';under.setAttribute('aria-hidden','true');
    const halo=document.createElement('span');halo.className='glyph-halo';halo.setAttribute('aria-hidden','true');
    span.append(outline,solid,under,halo);
    if(reveal?.id==='assemble'){
      const offsets=[[-1.1,-1.3,-36], [1.25,-.9,48],[-1.35,1.2,27],[1.05,1.35,-32]];
      offsets.forEach(([x,y,r],i)=>{const piece=document.createElement('span');piece.className='glyph-fragment part-'+i;piece.textContent=ch;piece.style.setProperty('--dx',x+'em');piece.style.setProperty('--dy',y+'em');piece.style.setProperty('--rot',r+'deg');span.append(piece);});
    }
    stage.append(span);glyphs.push(span);
  }
}
function rebuildEvents(){
  const beat=60/state.bpm;
  const events=[],melody=[];
  state.data.lines.forEach((line,li)=>line.words.forEach((w,wi)=>{
    melody.push({...w,li,wi,pitch:Number(w.note)||[64,67,69,72,74,76,72,69][(li+wi)%8]});
    events.push({time:w.start,li,wi,onset:true});
    // Every beat inside a long word produces another bounce at the SAME glyph.
    for(let bi=Math.floor((w.start-state.beatOffset)/beat)+1;state.beatOffset+bi*beat<w.end-0.04;bi++){
      const time=state.beatOffset+bi*beat;
      if(time>w.start+.075)events.push({time,li,wi,onset:false});
    }
  }));
  // The last hop of the song has a real landing on the first character at loop rollover.
  // This creates an uninterrupted arc rather than teleporting at the playback boundary.
  if(events.length && state.duration>events.at(-1).time+0.015)
    events.push({time:state.duration,li:0,wi:0,onset:false,loopBoundary:true});
  state.ballEvents=events.sort((a,b)=>a.time-b.time||Number(b.onset)-Number(a.onset));
  state.melodyEvents=melody.sort((a,b)=>a.start-b.start);
}
// Build an invisible line using the exact same typography and centering as the live line.
// Positions for ALL lyric pages are available even before the incoming page is shown.
// This avoids jumping or hiding the ball when the lyric DOM is replaced at a page change.
function landingFor(li,wi){
  const line=state.data?.lines[li];if(!line)return null;
  const content=$('#projection-content');
  const key=`${li}|${state.settings.fontSize}|${content.clientWidth}|${content.clientHeight}`;
  let positions=landingCache.get(key);
  if(!positions){
    const probe=document.createElement('div');
    probe.className='projection-lyrics lyric-metric-probe';
    probe.setAttribute('aria-hidden','true');
    for(const part of lineParts(line)){
      const glyph=document.createElement('span');
      glyph.className=part.wi<0?'glyph space':'glyph';
      glyph.textContent=part.text;
      probe.append(glyph);
    }
    content.append(probe);
    const cr=content.getBoundingClientRect();
    positions=Array.from(probe.children).filter(el=>!el.classList.contains('space')).map(el=>{
      const r=el.getBoundingClientRect();
      return {x:r.left-cr.left+r.width/2,y:r.top-cr.top-3,width:r.width,height:r.height};
    });
    probe.remove();
    landingCache.set(key,positions);
  }
  return positions[wi]||null;
}
function landing(index){return landingFor(state.displayedLine,index);}
function ballDiameter(point){
  // 20% of one character: responsive, naturally much smaller than the text.
  return clamp(point.width*(state.settings.ballSize||20)/100,4,22);
}
function setBallDiameter(point){
  const size=ballDiameter(point);
  $('#projection').style.setProperty('--ball-size',size.toFixed(2)+'px');
  return size;
}
function showImpact(t,lineIndex,mode){
  const ball=$('#ball'),impact=$('#impact'),beat=60/state.bpm;
  const line=state.data.lines[lineIndex];
  let nearest=null;
  for(let i=0;i<line.words.length;i++){
    const w=line.words[i];const dt=t-w.start;
    if(dt>=-.28&&dt<.45&&(!nearest||Math.abs(dt)<Math.abs(t-nearest.at)))nearest={at:w.start,wi:i,dt};
  }
  if(!nearest){ball.hidden=true;impact.hidden=true;return;}
  const p=landing(nearest.wi);if(!p){ball.hidden=true;impact.hidden=true;return;}
  const size=setBallDiameter(p);
  const {dt}=nearest;
  if(dt<0){
    ball.hidden=false;impact.hidden=true;
    const q=clamp((dt+.28)/.28,0,1);
    ball.style.setProperty('--ball-x',p.x+'px');
    ball.style.setProperty('--ball-y',(p.y-size/2-state.settings.bounce*2.3*(1-q*q))+'px');
    ball.style.opacity='1';ball.style.transform='translate(-50%,-50%) scale(1)';
  }else{
    ball.hidden=true;impact.hidden=dt>.36;
    impact.style.left=p.x+'px';impact.style.top=(p.y-size/2)+'px';
    const q=clamp(dt/.36,0,1);impact.style.opacity=(1-q).toFixed(3);
    impact.style.setProperty('--impact-spread',(5+q*state.settings.bounce*.85)+'px');
    impact.style.setProperty('--impact-scale',(1+q*1.8).toFixed(2));
  }
}
function renderBall(t,lineIndex){
  const ball=$('#ball'),impact=$('#impact');
  const mode=['ball','ball-impact','ball-ink'].find(id=>state.fx.has(id));
  if(!mode){ball.hidden=true;impact.hidden=true;return;}
  if(mode!=='ball'){
    if(lineIndex<0){ball.hidden=true;impact.hidden=true;return;}
    showImpact(t,lineIndex,mode);return;
  }
  impact.hidden=true;
  const events=state.ballEvents;
  if(!events.length){ball.hidden=true;return;}
  let lo=0,hi=events.length;
  while(lo<hi){const mid=(lo+hi)>>1;if(events[mid].time<=t)lo=mid+1;else hi=mid;}
  const index=Math.max(0,lo-1),previous=events[index];
  const next=events[Math.min(index+1,events.length-1)];
  const from=landingFor(previous.li,previous.wi);
  const to=landingFor(next.li,next.wi)||from;
  if(!from||!to){ball.hidden=true;return;}
  const size=setBallDiameter(from);
  const duration=Math.max(.012,next.time-previous.time);
  const phase=clamp((t-previous.time)/duration,0,1);
  const ease=.5-.5*Math.cos(Math.PI*phase);
  const x=from.x+(to.x-from.x)*ease;
  const baseline=from.y+(to.y-from.y)*ease;
  // Physical arc: the hop time is one note/rest until the next actual landing.
  // For equal settings, an eighth-note hop rises EXACTLY half a quarter-note hop.
  const noteBeats=duration/(60/state.bpm);
  const modeScale={auto:1,low:.62,high:1.42,alternate:index%2===0?1.34:.68}[state.settings.jumpStyle||'auto']||1;
  let height=state.settings.bounce*clamp(noteBeats,.25,1.5)*modeScale;
  height=Math.min(height,$('#projection-content').clientHeight*.34);
  // y(t) starts at the previous word, reaches its apex mid-flight, and lands on
  // the next word. No baseline-horizontal movement is possible.
  const arc=4*phase*(1-phase);
  const y=baseline-height*arc-size/2;
  // Impact response is computed from seconds since landing, not from the frame
  // rate. It elastically compresses and recovers on every note/beat, including
  // the 4-beat sustained notes that repeatedly bounce above one glyph.
  const since=Math.max(0,t-previous.time);
  const contact=Math.max(0,1-since/.105);
  const squash=.31*Math.pow(contact,1.25);
  const scaleX=1+.32*squash/.31,scaleY=1-.27*squash/.31;
  ball.hidden=false;
  ball.style.opacity='1';
  ball.style.setProperty('--ball-x',x.toFixed(2)+'px');
  ball.style.setProperty('--ball-y',(y+size*.1*contact).toFixed(2)+'px');
  ball.style.transform=`translate(-50%,-50%) scale(${scaleX.toFixed(3)},${scaleY.toFixed(3)})`;
  ball.dataset.hopHeight=height.toFixed(2);
  ball.dataset.hopDuration=duration.toFixed(4);
  ball.dataset.fromLine=String(previous.li);
  ball.dataset.toLine=String(next.li);
}
function renderAt(t){
  if(!state.data)return;
  const time=clamp(t,0,state.duration),lineIndex=currentLineIndex(Math.min(time,Math.max(0,state.duration-.00001)));
  $('#clock-readout').textContent=`${secText(time)} / ${secText(state.duration)}`;
  $('#seek-time').textContent=secText(time);if(!state.isSeeking)$('#seek').value=time;
  if(lineIndex!==state.displayedLine){state.displayedLine=lineIndex;state.activeWord=-2;buildStage(lineIndex);}
  const beatDuration=60/state.bpm;
  const beats=(time-state.beatOffset)/beatDuration;
  const beatIndex=Math.max(0,Math.floor(beats));
  const phase=((beats%1)+1)%1;const activeBeat=beatIndex%state.beatsPerBar;
  if(state.displayedBeat!==activeBeat){state.displayedBeat=activeBeat;$('#bar-num').textContent=`第 ${Math.floor(beatIndex/state.beatsPerBar)+1} 小節`;$('#beat-num').textContent=`第 ${activeBeat+1} 拍`;}
  $$('#beat-points span').forEach((span,i)=>span.classList.toggle('hot',i===activeBeat&&phase<.28));
  let activeWord=-1;
  if(lineIndex>=0){
    const line=state.data.lines[lineIndex];
    line.words.forEach((w,i)=>{if(time>=w.start&&time<w.end)activeWord=i;});
    const o=state.settings;
    const reveal=ALL_FX.find(f=>f.group==='reveal'&&state.fx.has(f.id))?.id||'none';
    glyphs.forEach((el,i)=>{
      const w=line.words[i];if(!w)return;
      const onset=time-w.start,duration=w.end-w.start,p=clamp(onset/duration,0,1);
      const singing=onset>=0&&time<w.end;
      const impulse=singing?Math.exp(-Math.max(0,onset)*7):0;
      const entrance=clamp(onset/.32,0,1);
      const ease=1-Math.pow(1-entrance,3);
      const fadeOut=clamp((time-w.end)/.22,0,1);
      const scale=1+(state.fx.has('scale')?o.scale/100*impulse:0)+(singing&&state.fx.has('pulse')?.09*(1-phase)*(1-phase):0);
      const squash=state.fx.has('squash')?Math.sin(Math.min(1,Math.max(0,onset)/.4)*Math.PI*2)*impulse*.24:0;
      let x=0,y=0;
      if(state.fx.has('lift'))y+=-22*impulse;
      if(state.fx.has('drop'))y+=onset<0?-45:(1-ease)*-45;
      if(state.fx.has('slide-left'))x+=onset<0?-37:-(1-ease)*37;
      if(state.fx.has('slide-right'))x+=onset<0?37:(1-ease)*37;
      const tilt=state.fx.has('tilt')?Math.sin(Math.min(1,Math.max(0,onset)/.5)*Math.PI*2)*impulse*18:0;
      el.style.setProperty('--scale',scale.toFixed(4));el.style.setProperty('--scale-x',(1+squash).toFixed(4));
      el.style.setProperty('--motion-x',x.toFixed(2)+'px');el.style.setProperty('--motion-y',y.toFixed(2)+'px');el.style.setProperty('--tilt',tilt.toFixed(1)+'deg');
      el.style.setProperty('--alpha',state.fx.has('fade')?(onset<0?0:(Math.min(1,onset/.22)*(1-.62*fadeOut))):1);
      const fillProgress=reveal==='glyph-fall'?ease:reveal==='assemble'?clamp(onset/.48,0,1):p;
      el.style.setProperty('--reveal',(fillProgress*100).toFixed(2)+'%');
      el.style.setProperty('--piece-p',clamp(onset/.48,0,1).toFixed(4));
      el.style.setProperty('--piece-opacity',clamp(onset/.25,0,1).toFixed(4));
      el.style.setProperty('--fall',(Math.pow(1-ease,2)*-1.8).toFixed(3)+'em');
      el.style.setProperty('--under-progress',state.fx.has('underline')?p.toFixed(3):'0');
      el.style.setProperty('--under-opacity',state.fx.has('underline')&&onset>=0?'1':'0');
      const color=(singing||onset>=0&&(reveal!=='none'||state.fx.has('color')))?o.accentColor:o.baseColor;
      el.style.setProperty('--active',color);
      const glow=state.fx.has('glow')?(singing?o.shadow*1.8:o.shadow*.35):0;
      const shadow=state.fx.has('shadow')?(singing?o.shadow*(.4+.6*impulse):o.shadow*.17):0;
      const blur=Math.max(shadow,glow);
      const trail=state.fx.has('trail')&&singing?',-2px 0 #5fd9ff,2px 0 #e073f8':'';
      el.style.setProperty('--letter-shadow',blur?`0 0 ${blur.toFixed(1)}px ${o.accentColor}${trail}`:(trail?'-2px 0 #5fd9ff,2px 0 #e073f8':'none'));
      el.style.setProperty('--halo-scale',state.fx.has('halo')&&onset>=0?(1+Math.min(1,onset/.45)*1.15).toFixed(3):'0');
      el.style.setProperty('--halo-alpha',state.fx.has('halo')&&singing?Math.max(0,1-onset/.5).toFixed(3):'0');
      el.style.setProperty('--shimmer',state.fx.has('shimmer')?Math.max(0,Math.min(1,onset/.5))*170-35+'%':'-50%');
      el.dataset.drawn=reveal;
      const burst=(state.fx.has('spark')&&onset>=0&&onset<.3)?Math.max(0,1-onset/.3):0;
      el.style.setProperty('--spark-alpha',burst.toFixed(3));
      el.style.setProperty('--spark-radius',((1-burst)*.7).toFixed(3)+'em');
      if(state.fx.has('ball-ink')&&onset>=0)el.style.setProperty('--reveal',(clamp(onset/.46,0,1)*100).toFixed(2)+'%');
    });
    if($('#phrase-rhythm'))$('#phrase-rhythm').textContent=line.rhythm||'逐字演唱';
  }
  if(activeWord!==state.activeWord){
    state.activeWord=activeWord;
    $('#now-word').textContent=activeWord<0?'句中休止':state.data.lines[lineIndex].words[activeWord].text;
    chipButtons.forEach((row,li)=>row.forEach((chip,wi)=>{const w=state.data.lines[li].words[wi];chip.classList.toggle('active',li===lineIndex&&wi===activeWord);chip.classList.toggle('sung',time>=w.end);}));
    $$('#timeline .timing-line').forEach((e,li)=>e.classList.toggle('current',li===lineIndex));
  }
  renderBall(time,lineIndex);
}
function position(){if(state.media&&state.playing)return state.media.currentTime;if(state.playing&&state.context)return Math.max(0,state.context.currentTime-state.origin);return state.position;}
function stopSources(){for(const osc of state.sources){try{osc.stop();}catch{}}state.sources=[];}
function stopScheduler(){if(state.scheduler){clearInterval(state.scheduler);state.scheduler=null;}stopSources();}
function scheduleVoice(midi,duration,when){
  const ctx=state.context;if(!ctx||!state.clicks)return;
  const freq=440*Math.pow(2,(midi-69)/12);
  const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='triangle';osc.frequency.value=freq;
  const release=Math.min(duration*.32,.14),attack=Math.min(.016,duration*.25);
  gain.gain.setValueAtTime(.0001,when);
  gain.gain.linearRampToValueAtTime(.16,when+attack);
  gain.gain.setValueAtTime(.135,Math.max(when+attack,when+duration-release));
  gain.gain.linearRampToValueAtTime(.0001,when+duration);
  osc.connect(gain);gain.connect(ctx.destination);osc.start(when);osc.stop(when+duration+.008);
  state.sources.push(osc);osc.onended=()=>{state.sources=state.sources.filter(s=>s!==osc);osc.disconnect();gain.disconnect();};
}
function playDrum(beat,when){
  const ctx=state.context;if(!ctx||!state.clicks)return;
  const beatInPhrase=beat%8,phrase=Math.floor(beat/8);
  const kick=beatInPhrase%4===0||(phrase%3===0&&beatInPhrase===6),snare=beatInPhrase%4===2;
  const osc=ctx.createOscillator(),gain=ctx.createGain();
  osc.type=kick?'sine':'triangle';osc.frequency.value=kick?125:snare?210:3200;
  if(kick)osc.frequency.exponentialRampToValueAtTime(48,when+.12);
  gain.gain.setValueAtTime(.0001,when);gain.gain.linearRampToValueAtTime(kick?.34:snare?.16:.055,when+.003);
  gain.gain.exponentialRampToValueAtTime(.0001,when+(kick?.17:snare?.095:.04));
  osc.connect(gain);gain.connect(ctx.destination);osc.start(when);osc.stop(when+.18);
  state.sources.push(osc);osc.onended=()=>{state.sources=state.sources.filter(s=>s!==osc);osc.disconnect();gain.disconnect();};
}
function schedulerTick(){
  if(!state.context||!state.playing||state.media)return;
  const ctx=state.context,step=60/state.bpm,now=ctx.currentTime,horizon=now+.18;
  while(state.beatOffset+state.nextBeat*step<=horizon-state.origin){
    const t=state.beatOffset+state.nextBeat*step;
    if(t>=state.duration)break;
    const when=state.origin+t;
    if(when>=now-.025)playDrum(state.nextBeat,Math.max(when,now+.002));
    state.nextBeat++;
  }
  while(state.nextNote<state.melodyEvents.length){
    const w=state.melodyEvents[state.nextNote];
    if(w.start>horizon-state.origin)break;
    const when=state.origin+w.start;
    if(when>=now-.025){const duration=Math.max(.05,w.end-w.start);scheduleVoice(w.pitch,duration,Math.max(when,now+.003));}
    state.nextNote++;
  }
}
function reseedClock(){
  if(!state.context)return;
  stopScheduler();state.origin=state.context.currentTime-state.position;
  state.nextBeat=Math.max(0,Math.ceil((state.position-state.beatOffset)/(60/state.bpm)-.00001));
  state.nextNote=state.melodyEvents.findIndex(w=>w.start>=state.position-.00001);
  if(state.nextNote<0)state.nextNote=state.melodyEvents.length;
  if(state.playing&&!state.media){schedulerTick();state.scheduler=setInterval(schedulerTick,40);}
}
async function start(){
  if(state.playing)return;
  if(state.position>=state.duration-.01)state.position=0;
  try{
    if(!state.media){state.context??=new (window.AudioContext||window.webkitAudioContext)();await state.context.resume();}
    else {state.media.currentTime=clamp(state.position,0,Math.max(0,state.media.duration-.01)||state.position);await state.media.play();}
  }catch(e){toast('無法啟動音訊：'+e.message);return;}
  state.playing=true;reseedClock();$('#play').textContent='Ⅱ 暫停';$('#stage-state').textContent=state.media?'LOCAL AUDIO':'MELODY + RHYTHM';
  state.raf=requestAnimationFrame(tick);
}
function pause(){
  if(state.playing)state.position=Math.min(state.duration,position());
  state.playing=false;stopScheduler();if(state.raf)cancelAnimationFrame(state.raf);state.raf=0;
  if(state.media)state.media.pause();
  $('#play').textContent='▶ 播放示範';
}
function tick(){
  if(!state.playing)return;
  const t=position();
  if(t>=state.duration-.001 || (state.media&&state.media.ended)){
    if(state.loop){seekTo(0);state.raf=requestAnimationFrame(tick);return;}
    state.position=state.duration;pause();renderAt(state.duration);return;
  }
  renderAt(t);state.raf=requestAnimationFrame(tick);
}
function seekTo(value){
  const t=clamp(Number(value)||0,0,state.duration);
  state.position=t;
  if(state.media){const available=Number.isFinite(state.media.duration)?state.media.duration:state.duration;state.media.currentTime=clamp(t,0,available);}
  else if(state.playing)reseedClock();
  renderAt(t);
}
function toggleClick(){state.clicks=!state.clicks;$('#click-toggle').setAttribute('aria-pressed',String(state.clicks));$('#click-toggle').textContent='伴奏：'+(state.clicks?'開':'關');if(!state.clicks)stopSources();}
// Advanced SubStation Alpha (ASS) karaoke import. Durations are in centiseconds.
// The optional BPM/BeatsPerBar/BeatOffset comment metadata is local to this app;
 // karaoke tags and Dialogue timing remain standard ASS.
function parseAss(source){
  const text=String(source).replace(/^\uFEFF/,'').replace(/\r/g,'');
  if(!/^\[Script Info\]/im.test(text)||!/^\[Events\]/im.test(text))throw Error('不是有效 ASS：缺少 [Script Info] 或 [Events]');
  const readMeta=(label,defaultValue)=>{
    const match=text.match(new RegExp('^\\s*;\\s*'+label+'\\s*[:=]\\s*([-+\\d.]+)','im'));
    return match?Number(match[1]):defaultValue;
  };
  const title=text.match(/^Title\s*:\s*(.+)$/im)?.[1]?.trim()||'ASS 卡拉 OK 歌詞';
  const bpm=readMeta('BPM',state.bpm||104),beatsPerBar=readMeta('BeatsPerBar',state.beatsPerBar||4),beatOffset=readMeta('BeatOffset',0);
  const assSec=stamp=>{
    const m=stamp.trim().match(/^(\d+):(\d{1,2}):(\d{1,2})\.(\d{1,3})$/);
    if(!m)throw Error('ASS 時間格式錯誤：'+stamp);
    return Number(m[1])*3600+Number(m[2])*60+Number(m[3])+Number(m[4])/10**m[4].length;
  };
  let section='',format=[],lines=[];
  for(const row of text.split('\n')){
    const line=row.trim();
    if(/^\[[^\]]+\]$/.test(line)){section=line.toLowerCase();continue;}
    if(section!=='[events]')continue;
    if(/^Format\s*:/i.test(line)){format=line.replace(/^Format\s*:/i,'').split(',').map(x=>x.trim().toLowerCase());continue;}
    if(!/^Dialogue\s*:/i.test(line))continue;
    if(!format.length)throw Error('ASS [Events] 缺少 Format 欄位');
    const src=row.replace(/^\s*Dialogue\s*:/i,'');
    const fields=[];let remain=src;
    for(let i=0;i<format.length-1;i++){
      const pos=remain.indexOf(',');if(pos<0)throw Error('Dialogue 欄位數不足');
      fields.push(remain.slice(0,pos));remain=remain.slice(pos+1);
    }
    fields.push(remain);
    const byName=name=>fields[format.indexOf(name)];
    if(format.at(-1)!=='text')throw Error('目前要求 ASS 的 Text 是最後一欄（Aegisub 標準排列）');
    const start=assSec(byName('start')||''),end=assSec(byName('end')||'');
    if(end<=start)continue;
    const input=byName('text')||'';
    let cursor=0,shown='',words=[],count=0,found=false;
    // Capture each override block and the following lyric characters.
    const re=/\{([^{}]*)\}([^{}]*)/g;
    let m,previousEnd=0;
    while((m=re.exec(input))!==null){
      if(m.index>previousEnd)shown+=input.slice(previousEnd,m.index).replace(/\\h/g,' ').replace(/\\N/g,' ');
      previousEnd=re.lastIndex;
      const tags=m[1],syllable=m[2].replace(/\\h/g,' ').replace(/\\N/g,' ');
      const timeTag=[...tags.matchAll(/\\(?:kf|ko|kt|k|K)(\d+)/g)];
      const absolute=timeTag.find(a=>a[0].startsWith('\\kt'));
      if(absolute)cursor=Number(absolute[1]);
      const duration=timeTag.filter(a=>!a[0].startsWith('\\kt')).at(-1);
      if(!duration){shown+=syllable;continue;}
      found=true;const cs=Number(duration[1]);
      const clean=syllable.trim();shown+=syllable;
      if(clean&&cs>0){
        const ws=start+cursor/100,we=Math.min(end,start+(cursor+cs)/100);
        if(we>ws)words.push({text:clean,start:Number(ws.toFixed(4)),end:Number(we.toFixed(4))});
        count++;
      }
      cursor+=cs;
    }
    if(previousEnd<input.length)shown+=input.slice(previousEnd).replace(/\\h/g,' ').replace(/\\N/g,' ');
    if(!found)throw Error(`第 ${lines.length+1} 句缺少 ASS 卡拉 OK \\k 時值；無法推算逐字時間`);
    if(words.length)lines.push({text:shown.trim(),start,end,words,rhythm:''});
  }
  if(!lines.length)throw Error('ASS 沒有有效的 Dialogue 卡拉 OK 歌詞');
  const duration=Math.max(...lines.map(l=>l.end));
  return {title,bpm,beatsPerBar,beatOffset,duration,lines};
}
function exportAss(data=state.data){
  const cs=t=>Math.max(0,Math.round(t*100));
  const output=['[Script Info]',`Title: ${data.title||'逐字歌詞'}`,'ScriptType: v4.00+','WrapStyle: 2','PlayResX: 1920','PlayResY: 1080',
    `; BPM: ${data.bpm??state.bpm}`,`; BeatsPerBar: ${data.beatsPerBar??state.beatsPerBar}`,`; BeatOffset: ${data.beatOffset??state.beatOffset}`,
    '','[V4+ Styles]','Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    'Style: Default,Noto Sans TC,85,&H00FFFFFF,&H00808080,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,2,0,5,40,40,40,1','',
    '[Events]','Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text'];
  for(const line of data.lines){
    let lineText='',cursor=cs(line.start),index=0;
    for(const word of line.words){
      const found=line.text.indexOf(word.text,index);
      if(found<0)throw Error('ASS 匯出失敗：歌詞與時間碼不一致');
      lineText+=line.text.slice(index,found).replace(/ /g,'\\h');
      const start=cs(word.start),end=Math.max(start+1,cs(word.end));
      if(start>cursor)lineText+=`{\\k${start-cursor}}`;// Empty syllable: explicit rest, no extra visible glyph.
      lineText+=`{\\kf${end-start}}`+word.text;
      cursor=end;index=found+word.text.length;
    }
    lineText+=line.text.slice(index).replace(/ /g,'\\h');
    output.push(`Dialogue: 0,${assTime(line.start)},${assTime(line.end)},Default,,0,0,0,,${lineText}`);
  }
  return output.join('\r\n')+'\r\n';
}
function downloadText(text,name,mime){
  const url=URL.createObjectURL(new Blob([text],{type:mime}));const link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function downloadAss(){downloadText('\uFEFF'+exportAss({...state.data,bpm:state.bpm,beatsPerBar:state.beatsPerBar,beatOffset:state.beatOffset}),'lyrics-karaoke.ass','text/plain;charset=utf-8');}
function generateWav(){
  const rate=22050,frames=Math.ceil(state.duration*rate),buf=new Float32Array(frames),step=60/state.bpm;
  function add(at,dur,callback){const start=Math.round(at*rate),n=Math.min(frames-start,Math.round(dur*rate));for(let i=0;i<n;i++)buf[start+i]+=callback(i/rate,i/n);}
  for(const w of state.melodyEvents){
    const freq=440*Math.pow(2,(w.pitch-69)/12),dur=w.end-w.start;
    add(w.start,dur,(t,p)=>Math.sin(2*Math.PI*freq*t)*(.75+.25*Math.sin(4*Math.PI*freq*t))*Math.min(1,t/.02)*Math.min(1,(dur-t)/.08)*.22);
  }
  for(let b=0;state.beatOffset+b*step<state.duration;b++){
    const time=state.beatOffset+b*step,local=b%8,phrase=Math.floor(b/8);
    const kick=local%4===0||(phrase%3===0&&local===6),snare=local%4===2;
    add(time,kick?.16:snare?.09:.05,t=>kick?Math.sin(2*Math.PI*(90*t+90*t*Math.exp(-t*22)))*Math.exp(-t*33)*.26:snare?Math.sin(2*Math.PI*200*t)*Math.exp(-t*47)*.16:Math.sin(2*Math.PI*4500*t)*Math.exp(-t*88)*.065);
  }
  const bytes=new ArrayBuffer(44+frames*2),view=new DataView(bytes);
  const str=(at,v)=>{for(let i=0;i<v.length;i++)view.setUint8(at+i,v.charCodeAt(i));};
  str(0,'RIFF');view.setUint32(4,36+frames*2,true);str(8,'WAVEfmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);str(36,'data');view.setUint32(40,frames*2,true);
  for(let i=0;i<frames;i++)view.setInt16(44+i*2,Math.round(clamp(buf[i],-1,1)*32767),true);
  downloadText(bytes,`melody-rhythm-${state.bpm}bpm.wav`,'audio/wav');
}
async function importAssFile(input){
  const file=input.files?.[0];if(!file)return;
  try{const data=parseAss(await file.text());state.originalDemo=null;useData(data,'precise');toast('已載入 ASS：'+state.data.lines.length+' 句、'+state.data.lines.reduce((n,l)=>n+l.words.length,0)+' 個音節');}
  catch(e){toast('匯入 ASS 失敗：'+e.message);}finally{input.value='';}
}
async function exportStandalone(){
  try{
    const embeddedCss=$('#sync-embedded-style')?.textContent;
    const embeddedJs=$('#sync-embedded-script')?.textContent;
    let fetched;
    if(embeddedCss&&embeddedJs)fetched=[embeddedCss,'',embeddedJs];
    else {const base=new URL('../',location.href);const paths=['assets/theme.css','assets/lyrics-sync.css','assets/lyrics-sync.js'];
      fetched=await Promise.all(paths.map(p=>fetch(new URL(p,base)).then(r=>{if(!r.ok)throw Error('取得 '+p+' 失敗');return r.text();})));}
    const html=document.implementation.createHTMLDocument('逐字節拍同步播放');
    html.documentElement.lang='zh-Hant';
    html.head.innerHTML='<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>逐字節拍同步播放 · 離線版</title>';
    const style=html.createElement('style');style.id='sync-embedded-style';style.textContent=fetched[0]+'\n'+fetched[1];html.head.append(style);
    // Export the current timing as a single interoperable ASS file embedded in the HTML.
    const source=document.querySelector('main').cloneNode(true);
    html.body.append(document.querySelector('.site-header').cloneNode(true),source,document.querySelector('.site-footer').cloneNode(true));
    const dataScript=html.createElement('script');dataScript.type='text/plain';dataScript.id='embedded-ass';dataScript.textContent=exportAss({...state.data,bpm:state.bpm,beatOffset:state.beatOffset,duration:state.duration}).replace(/<\//g,'<\\/');html.body.append(dataScript);
    const config=html.createElement('script');config.id='embedded-configuration';config.type='application/json';config.textContent=JSON.stringify({preset:state.preset,settings:state.settings,fx:[...state.fx],position:state.position}).replace(/<\//g,'<\\/');html.body.append(config);
    const js=html.createElement('script');js.type='module';js.id='sync-embedded-script';js.textContent=fetched[2];html.body.append(js);
    downloadText('<!doctype html>\n'+html.documentElement.outerHTML,'lyrics-beat-sync-player.html','text/html;charset=utf-8');
    toast('已輸出完整離線 HTML');
  }catch(e){toast('匯出失敗：'+e.message);}
}
function setupTransport(){
  $('#play').addEventListener('click',()=>state.playing?pause():start());
  $('#restart').addEventListener('click',()=>seekTo(0));
  $('#loop-toggle').addEventListener('click',()=>{state.loop=!state.loop;$('#loop-toggle').textContent='循環：'+(state.loop?'開':'關');$('#loop-toggle').setAttribute('aria-pressed',String(state.loop));});
  $('#click-toggle').addEventListener('click',toggleClick);
  $('#seek').addEventListener('pointerdown',()=>state.isSeeking=true);
  $('#seek').addEventListener('input',e=>seekTo(e.target.value));
  $('#seek').addEventListener('change',e=>{state.isSeeking=false;seekTo(e.target.value);});
  $('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('#projection').requestFullscreen();}catch{$('#projection').classList.toggle('is-expanded');}});
  $('#exit-fullscreen').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen();else $('#projection').classList.remove('is-expanded');});
  $('#ass-file').addEventListener('change',e=>importAssFile(e.target));
  $('#audio-file').addEventListener('change',e=>{
    const file=e.target.files?.[0];if(!file)return;
    pause();if(state.mediaUrl)URL.revokeObjectURL(state.mediaUrl);
    state.mediaUrl=URL.createObjectURL(file);state.media=new Audio(state.mediaUrl);
    state.media.addEventListener('loadedmetadata',()=>{if(Number.isFinite(state.media.duration)){
      state.duration=Math.max(state.media.duration,state.data.lines.at(-1)?.end||0);$('#seek').max=state.duration;renderAt(state.position);
    }});
    state.media.addEventListener('error',()=>toast('無法播放此音樂檔'));
    $('#stage-state').textContent='LOCAL AUDIO';toast(`已載入 ${file.name}，使用音樂 currentTime 同步`);e.target.value='';
  });
  $('#bpm').value=96;$('#bpm').addEventListener('input',e=>{
    const bpm=Number(e.target.value);state.bpm=bpm;$('#bpm-val').textContent=bpm+' BPM';
    $('#stage-counter').textContent=`${bpm} BPM · ${state.beatsPerBar}/4`;
    // Demo timestamps were manually authored on a beat grid; preserve exact relationship on tempo changes.
    if(state.wordAlignment==='manual-demo'&&state.originalDemo){
      const factor=state.originalDemo.bpm/bpm;
      const source=structuredClone(state.originalDemo);
      source.lines.forEach(l=>{l.start*=factor;l.end*=factor;l.words.forEach(w=>{w.start*=factor;w.end*=factor;});});
      source.duration*=factor;source.bpm=bpm;
      const current=position()*factor;
      state.data=normalizeData(source,'manual-demo');state.duration=state.data.duration;state.displayedLine=-2;state.activeWord=-2;rebuildEvents();
      $('#seek').max=state.duration;buildTimeline();seekTo(current);
    }
    if(state.playing&&!state.media){state.position=position();reseedClock();}
  });
  $('#download-ass').addEventListener('click',downloadAss);
  $('#download-audio').addEventListener('click',generateWav);
  $('#download-html')?.addEventListener('click',exportStandalone);
  document.addEventListener('keydown',e=>{
    if(e.target.closest('input,textarea,select,button,a,[contenteditable]')||e.ctrlKey||e.metaKey||e.altKey)return;
    if(e.code==='Space'){e.preventDefault();state.playing?pause():start();}
    if(e.code==='ArrowRight'){e.preventDefault();seekTo(position()+60/state.bpm);}
    if(e.code==='ArrowLeft'){e.preventDefault();seekTo(position()-60/state.bpm);}
    if(e.key.toLowerCase()==='f')$('#fullscreen').click();
    if(e.key==='Escape')$('#projection').classList.remove('is-expanded');
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.playing)pause();});
}
async function main(){
  const embedded=$('#embedded-ass');
  let demo;
  try{demo=parseAss(embedded?embedded.textContent:await fetch('./demo.ass').then(r=>{if(!r.ok)throw Error('ASS 範例載入失敗');return r.text();}));}
  catch(e){const note=document.createElement('p');note.className='error-box';note.textContent=e.message;$('#projection-lyrics').replaceChildren(note);return;}
  renderSelectors();setupTransport();state.originalDemo=structuredClone(demo);useData(demo,'manual-demo');usePreset('obvious');
  const saved=$('#embedded-configuration');if(saved){try{const options=JSON.parse(saved.textContent);if(options.preset&&PRESETS[options.preset])usePreset(options.preset);else if(options.settings){state.settings={...state.settings,...options.settings};state.fx=new Set((options.fx||[]).filter(id=>ALL_FX.some(f=>f.id===id)));state.preset=null;setStyle();}seekTo(options.position||0);}catch(e){console.warn('載入匯出樣式失敗',e);}}
  initialized=true;
}
main();
