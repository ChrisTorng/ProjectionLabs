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
const cuesTime = t => {
  const ms = Math.round(t * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;
};
const ALL_FX = [
  {id:'scale', title:'逐字放大', desc:'起音瞬間增大，隨後平順回復'},
  {id:'color', title:'唱到變色', desc:'依時間碼讓當前字轉為指定重點色'},
  {id:'shadow', title:'逐字陰影', desc:'字體陰影於起音時擴散並回落'},
  {id:'underline', title:'逐字底線', desc:'每字唱到後從左向右延展'},
  {id:'ball', title:'節拍跳動圓球', desc:'跟隨當前字；長音每拍原地跳'},
  {id:'fill', title:'空心滑入實心', desc:'描邊字依演唱進度水平填色'},
  {id:'lift', title:'逐字上浮', desc:'起音時短促抬升，融入原句'},
  {id:'glow', title:'柔光暈染', desc:'疊加可調整強度的文字光暈'},
  {id:'pulse', title:'持續節拍脈衝', desc:'長音也能跟每拍做微幅縮放'},
  {id:'trail', title:'科幻色彩殘影', desc:'青／紫雙色邊緣形成數位質感'}
];
const PRESETS = {
  gentle: {name:'輕柔',desc:'淡色、微幅字體變化與柔和陰影',accentColor:'#c2f1dd',baseColor:'#dce5ee',bgColor:'#08182a',fontSize:7.5,scale:8,shadow:8,stroke:1.2,underline:2,ballSize:13,bounce:16,fx:['scale','color','shadow']},
  obvious: {name:'明顯',desc:'清楚的逐字強調、底線與跳動圓球',accentColor:'#ffe1a1',baseColor:'#dce7f0',bgColor:'#091b2e',fontSize:7.6,scale:25,shadow:15,stroke:1.4,underline:4,ballSize:17,bounce:34,fx:['scale','color','shadow','underline','ball']},
  exaggerated: {name:'誇張',desc:'放大躍起、強烈發光、重節拍反應',accentColor:'#ff9ecf',baseColor:'#eef3ff',bgColor:'#1c102c',fontSize:8.1,scale:54,shadow:33,stroke:2.1,underline:6,ballSize:23,bounce:64,fx:['scale','color','shadow','underline','ball','lift','glow','pulse']},
  modern: {name:'現代',desc:'空心文字掃入實心，精準低調的底線',accentColor:'#77f2da',baseColor:'#d1e1ed',bgColor:'#071d29',fontSize:7.9,scale:13,shadow:6,stroke:1.7,underline:3,ballSize:13,bounce:25,fx:['fill','color','underline','scale']},
  scifi: {name:'科幻',desc:'全息描邊、霓虹光暈與雙色殘影',accentColor:'#74eaff',baseColor:'#b8c9de',bgColor:'#080c24',fontSize:8.0,scale:20,shadow:30,stroke:1.5,underline:2,ballSize:16,bounce:39,fx:['fill','color','glow','shadow','ball','trail','pulse','scale']},
  cinematic: {name:'電影感',desc:'金色光澤、厚實陰影、漸進式起音',accentColor:'#ffe1a3',baseColor:'#d4dce8',bgColor:'#181522',fontSize:8.1,scale:19,shadow:24,stroke:1.5,underline:2,ballSize:14,bounce:27,fx:['color','shadow','glow','lift','scale']}
};
const state = {data:null, originalDemo:null, bpm:96, beatsPerBar:4, beatOffset:0, duration:45, wordAlignment:'manual-demo',
  preset:'obvious', settings:{}, fx:new Set(), playing:false, position:0, loop:true, clicks:true,
  media:null, mediaUrl:null, context:null, origin:0, scheduler:null, raf:0, nextBeat:0, sources:[],
  displayedLine:-2, activeWord:-2, displayedBeat:-2, isSeeking:false};
const ids = ['fontSize','scale','shadow','stroke','underline','ballSize','bounce','baseColor','accentColor','bgColor'];
let glyphs = [], chipButtons = [], toastTimer;
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
  stage.style.setProperty('--ball-size',o.ballSize+'px');
  document.documentElement.style.setProperty('--accent',o.accentColor);
  for(const id of ids){const e=$('#'+id);if(e)e.value=o[id];const v=$('#'+id+'-val');if(v)v.textContent=id==='fontSize'?o[id]+' cqw':id==='scale'?o[id]+'%':id==='shadow'||id==='ballSize'||id==='bounce'||id==='underline'?o[id]+' px':id==='stroke'?o[id]+' px':'';}
  $$('#preset-select [data-preset],#preset-grid [data-preset]').forEach(e=>e.classList.toggle('active',e.dataset.preset===state.preset));
  $$('#fx-grid .fx-card').forEach(e=>{const selected=state.fx.has(e.dataset.fx);e.classList.toggle('enabled',selected);e.setAttribute('aria-pressed',String(selected));e.querySelector('.fx-indicator').textContent=selected?'● 已啟用':'○ 未啟用';});
  if(state.displayedLine>=0)buildStage(state.displayedLine);
  renderAt(position());
}
function usePreset(id){
  const p=PRESETS[id];if(!p)return;
  state.preset=id;
  state.settings=Object.fromEntries(ids.map(k=>[k,p[k]]));
  state.fx=new Set(p.fx);
  setStyle();
}
function renderSelectors(){
  $('#preset-select').innerHTML=Object.entries(PRESETS).map(([id,p])=>`<button type="button" data-preset="${id}">${p.name}</button>`).join('');
  $('#fx-grid').innerHTML=ALL_FX.map(f=>`<button type="button" class="fx-card" data-fx="${f.id}" aria-pressed="false"><span class="fx-preview" data-fx="${f.id}"><span class="fx-demo-word">歌詞</span></span><span class="fx-card-heading"><span>${f.title}</span><span class="fx-indicator">○ 未啟用</span></span><span class="fx-desc">${f.desc}</span></button>`).join('');
  $('#preset-grid').innerHTML=Object.entries(PRESETS).map(([id,p])=>`<button type="button" class="preset-card" data-preset="${id}" style="--preset-color:${p.accentColor};--preset-glow:${p.accentColor}55"><span class="preset-card-preview"><span class="preset-text">祢的光 照亮我</span></span><span class="preset-card-detail"><strong>${p.name}</strong><p>${p.desc}</p></span></button>`).join('');
  $('#preset-select').addEventListener('click',e=>{const b=e.target.closest('[data-preset]');if(b)usePreset(b.dataset.preset);});
  $('#preset-grid').addEventListener('click',e=>{const b=e.target.closest('[data-preset]');if(b){usePreset(b.dataset.preset);$('#projection').scrollIntoView({behavior:'smooth',block:'center'});}});
  $('#fx-grid').addEventListener('click',e=>{const b=e.target.closest('[data-fx]');if(!b)return;const key=b.dataset.fx;state.fx.has(key)?state.fx.delete(key):state.fx.add(key);state.preset=null;setStyle();});
  for(const key of ids){$('#'+key).addEventListener('input',e=>{state.settings[key]=e.target.type==='color'?e.target.value:Number(e.target.value);state.preset=null;setStyle();});}
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
      words=line.words.map(w=>({text:String(w.text??''),start:Number(w.start),end:Number(w.end)}));
      for(const w of words)if(!w.text||!Number.isFinite(w.start)||!Number.isFinite(w.end)||w.end<=w.start||w.start<start-0.001||w.end>end+0.001)throw Error('某字的 start/end 超出所在句或不合法');
      words.sort((a,b)=>a.start-b.start);
    }else words=estimateWords(text,start,end);
    return {text,start,end,words};
  }).sort((a,b)=>a.start-b.start);
  if(!lines.length)throw Error('檔案中沒有歌詞');
  const bpm=Number(raw.bpm)||96;
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
  const estimate=alignment==='estimated';
  const badge=$('#alignment-status');badge.textContent=estimate?'逐字時間為估算':alignment==='manual-demo'?'手工逐字對位':'精確逐字時間碼';badge.classList.toggle('estimated',estimate);
  $('#word-count').textContent=state.data.lines.reduce((n,l)=>n+l.words.length,0);
  $('#stage-counter').textContent=`${state.bpm} BPM · ${state.beatsPerBar}/4`;
  if(estimate)$('#data-note').innerHTML='目前載入的是一般 <b>SRT</b>，只有整句時間；逐字時間是<b>線性估算</b>，並不是辨識到的實際演唱起音。請載入精確 JSON 取代。';
  else $('#data-note').textContent='已載入含逐字 start/end 的時間碼。長音字跨越多拍時，圓球會以拍點在原字上方重複跳動；節拍與歌詞共用時間軸。';
  buildTimeline();renderAt(0);
}
function buildTimeline(){
  const target=$('#timeline');target.replaceChildren();chipButtons=[];
  state.data.lines.forEach((line,li)=>{
    const el=document.createElement('div');el.className='timing-line';el.dataset.line=li;
    const head=document.createElement('div');head.className='timing-title';
    const name=document.createElement('span');name.textContent=`${String(li+1).padStart(2,'0')} · ${line.text}`;
    const times=document.createElement('span');times.textContent=`${secText(line.start)} – ${secText(line.end)}`;
    head.append(name,times);el.append(head);
    const chips=document.createElement('div');chips.className='word-chips';
    const row=[];
    line.words.forEach((w,wi)=>{
      const b=document.createElement('button');b.type='button';b.className='word-chip';b.textContent=w.text;
      b.title=`${w.text}：${secText(w.start)} ～ ${secText(w.end)}`;
      b.addEventListener('click',()=>seekTo(w.start));chips.append(b);row.push(b);
    });el.append(chips);target.append(el);chipButtons.push(row);
  });
}
function currentLineIndex(t){const lines=state.data.lines;for(let i=0;i<lines.length;i++)if(t>=lines[i].start&&t<lines[i].end)return i;return -1;}
function buildStage(index){
  const stage=$('#projection-lyrics');stage.replaceChildren();glyphs=[];
  if(index<0){stage.textContent='　';return;}
  const line=state.data.lines[index];let wi=0;
  for(const ch of Array.from(line.text)){
    if(/^\s$/u.test(ch)){const s=document.createElement('span');s.className='glyph space';s.textContent=' ';stage.append(s);continue;}
    const word=line.words[wi++];if(!word)break;
    const span=document.createElement('span');span.className='glyph';span.dataset.drawn=state.fx.has('fill')?'outline':'fill';
    const outline=document.createElement('span');outline.className='glyph-outline';outline.textContent=ch;
    const solid=document.createElement('span');solid.className='glyph-solid';solid.textContent=ch;
    const under=document.createElement('span');under.className='underline';under.setAttribute('aria-hidden','true');
    span.append(outline,solid,under);stage.append(span);glyphs.push(span);
  }
}
function renderAt(t){
  if(!state.data)return;
  const time=clamp(t,0,state.duration),lineIndex=currentLineIndex(time);
  $('#clock-readout').textContent=`${secText(time)} / ${secText(state.duration)}`;
  $('#seek-time').textContent=secText(time);
  if(!state.isSeeking)$('#seek').value=time;
  if(lineIndex!==state.displayedLine){state.displayedLine=lineIndex;state.activeWord=-2;buildStage(lineIndex);}
  const beatDuration=60/state.bpm;
  const beats=(time-state.beatOffset)/beatDuration;
  const beatIndex=Math.max(0,Math.floor(beats));
  const phase=((beats%1)+1)%1;
  const activeBeat=beatIndex%state.beatsPerBar;
  if(state.displayedBeat!==activeBeat){state.displayedBeat=activeBeat;$('#bar-num').textContent=`第 ${Math.floor(beatIndex/state.beatsPerBar)+1} 小節`;$('#beat-num').textContent=`第 ${activeBeat+1} 拍`;}
  $$('#beat-points span').forEach((span,i)=>{span.classList.toggle('hot',i===activeBeat && phase<.28);});
  let activeWord=-1;
  if(lineIndex>=0){
    const line=state.data.lines[lineIndex];
    line.words.forEach((w,i)=>{if(time>=w.start&&time<w.end)activeWord=i;});
    const o=state.settings;
    glyphs.forEach((el,i)=>{
      const w=line.words[i];if(!w)return;
      const onset=time-w.start;
      const p=clamp(onset/(w.end-w.start),0,1);
      const running=onset>=0 && time<w.end;
      const impulse=running?Math.exp(-Math.max(0,onset)*5):0;
      const baseScale=state.fx.has('scale')?o.scale/100*impulse:0;
      const beatPulse=running&&state.fx.has('pulse')?0.085*Math.pow(Math.max(0,Math.sin(Math.PI*phase)),2):0;
      const lift=running&&state.fx.has('lift')?-15*impulse:0;
      el.style.setProperty('--scale',(1+baseScale+beatPulse).toFixed(4));
      el.style.setProperty('--lift',lift.toFixed(2)+'px');
      el.style.setProperty('--reveal',state.fx.has('fill')?(p*100).toFixed(2)+'%':'100%');
      el.style.setProperty('--under-progress',state.fx.has('underline')?p.toFixed(3):'0');
      el.style.setProperty('--under-opacity',state.fx.has('underline')&&onset>=0?'1':'0');
      const color=(running&&(state.fx.has('color')||state.fx.has('fill')))?o.accentColor:(onset>=0&&state.fx.has('fill')?o.accentColor:o.baseColor);
      el.style.setProperty('--active',color);
      const glow=state.fx.has('glow')?(running?o.shadow*1.8:o.shadow*.5):0;
      const shadow=state.fx.has('shadow')?(running?o.shadow*(.4+.6*impulse):o.shadow*.2):0;
      const blur=Math.max(shadow,glow);
      const trail=state.fx.has('trail')&&running?`,-2px 0 0 #5fd9ff,2px 0 0 #e073f8`:'';
      el.style.setProperty('--letter-shadow',blur?`0 0 ${blur.toFixed(1)}px ${o.accentColor}${trail}`:(trail?'-2px 0 #5fd9ff,2px 0 #e073f8':'none'));
      el.dataset.drawn=state.fx.has('fill')?'outline':'fill';
    });
  }
  if(activeWord!==state.activeWord){
    state.activeWord=activeWord;
    $('#now-word').textContent=activeWord<0?(lineIndex<0?'前奏 / 間奏':'停頓'):state.data.lines[lineIndex].words[activeWord].text;
    chipButtons.forEach((row,li)=>row.forEach((chip,wi)=>{const w=state.data.lines[li].words[wi];chip.classList.toggle('active',li===lineIndex&&wi===activeWord);chip.classList.toggle('sung',time>=w.end);}));
    $$('#timeline .timing-line').forEach((e,li)=>e.classList.toggle('current',li===lineIndex));
  }
  const ball=$('#ball');
  if(activeWord>=0&&state.fx.has('ball')&&lineIndex>=0){
    ball.hidden=false;
    const glyph=glyphs[activeWord], content=$('#projection-content');
    if(glyph){const gr=glyph.getBoundingClientRect(),cr=content.getBoundingClientRect();
      const x=gr.left-cr.left+gr.width/2;
      const hop=state.settings.bounce*Math.pow(Math.sin(Math.PI*phase),2);
      const y=gr.top-cr.top-13-state.settings.ballSize/2-hop;
      ball.style.setProperty('--ball-x',x.toFixed(2)+'px');ball.style.setProperty('--ball-y',y.toFixed(2)+'px');}
  }else ball.hidden=true;
}
function position(){if(state.media&&state.playing)return state.media.currentTime;if(state.playing&&state.context)return Math.max(0,state.context.currentTime-state.origin);return state.position;}
function stopSources(){for(const osc of state.sources){try{osc.stop();}catch{}}state.sources=[];}
function stopScheduler(){if(state.scheduler){clearInterval(state.scheduler);state.scheduler=null;}stopSources();}
function playClick(beat,when){
  const ctx=state.context;if(!ctx||!state.clicks)return;
  const high=beat%state.beatsPerBar===0;
  const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=high?1000:700;
  gain.gain.setValueAtTime(0.0001,when);gain.gain.exponentialRampToValueAtTime(high?0.36:0.19,when+.002);gain.gain.exponentialRampToValueAtTime(.0001,when+.09);
  osc.connect(gain);gain.connect(ctx.destination);osc.start(when);osc.stop(when+.1);
  state.sources.push(osc);osc.onended=()=>{state.sources=state.sources.filter(s=>s!==osc);osc.disconnect();gain.disconnect();};
}
function schedulerTick(){
  if(!state.context||!state.playing||state.media)return;
  const ctx=state.context,beatDuration=60/state.bpm,now=ctx.currentTime;
  while(state.beatOffset+state.nextBeat*beatDuration<=now-state.origin+.16){
    const beatAt=state.beatOffset+state.nextBeat*beatDuration;
    const when=state.origin+beatAt;
    if(when>=now-.025&&when<state.origin+state.duration)playClick(state.nextBeat,Math.max(when,now+.003));
    state.nextBeat++;if(state.nextBeat>Math.ceil((state.duration-state.beatOffset)/beatDuration)+1)break;
  }
}
function reseedClock(){
  if(!state.context)return;
  stopScheduler();state.origin=state.context.currentTime-state.position;
  state.nextBeat=Math.max(0,Math.ceil((state.position-state.beatOffset)/(60/state.bpm)-.00001));
  if(state.playing&&!state.media){schedulerTick();state.scheduler=setInterval(schedulerTick,40);}
}
async function start(){
  if(state.playing)return;
  if(state.position>=state.duration-.01)state.position=0;
  try{
    if(!state.media){state.context??=new (window.AudioContext||window.webkitAudioContext)();await state.context.resume();}
    else {state.media.currentTime=clamp(state.position,0,Math.max(0,state.media.duration-.01)||state.position);await state.media.play();}
  }catch(e){toast('無法啟動音訊：'+e.message);return;}
  state.playing=true;reseedClock();$('#play').textContent='Ⅱ 暫停';$('#stage-state').textContent=state.media?'LOCAL AUDIO':'LIVE METRONOME';
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
    if(state.loop){seekTo(0);if(state.media&&state.media.paused)state.media.play().catch(()=>pause());state.raf=requestAnimationFrame(tick);return;}
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
function toggleClick(){state.clicks=!state.clicks;$('#click-toggle').setAttribute('aria-pressed',String(state.clicks));$('#click-toggle').textContent='節拍音：'+(state.clicks?'開':'關');if(!state.clicks)stopSources();}
function parseSrt(text){
  const blocks=text.replace(/^\uFEFF/,'').replace(/\r/g,'').split(/\n\s*\n/);
  const lines=[];const re=/(\d\d):(\d\d):(\d\d)[,.](\d{1,3})/g;
  const seconds=s=>{const m=Array.from(s.matchAll(re))[0];return m?Number(m[1])*3600+Number(m[2])*60+Number(m[3])+Number(m[4].padEnd(3,'0'))/1000:NaN;};
  for(const block of blocks){const rows=block.trim().split('\n');const idx=rows.findIndex(r=>r.includes('-->'));if(idx<0)continue;
    const halves=rows[idx].split('-->');const start=seconds(halves[0]),end=seconds(halves[1]);const lyric=rows.slice(idx+1).join(' ').replace(/<[^>]*>/g,'').trim();
    if(lyric&&Number.isFinite(start)&&Number.isFinite(end)&&end>start)lines.push({text:lyric,start,end});
  }
  if(!lines.length)throw Error('SRT 沒有有效的字幕時間碼');
  return {title:'匯入 SRT',bpm:state.bpm,beatsPerBar:state.beatsPerBar,beatOffset:0,duration:Math.max(...lines.map(l=>l.end))+1,lines};
}
function downloadText(text,name,mime){
  const url=URL.createObjectURL(new Blob([text],{type:mime}));const link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function downloadSrt(){const text=state.data.lines.map((l,i)=>`${i+1}\r\n${cuesTime(l.start)} --> ${cuesTime(l.end)}\r\n${l.text}\r\n`).join('\r\n');downloadText('\uFEFF'+text,'lyrics-demo.srt','text/plain;charset=utf-8');}
function downloadJson(){
  const result={...state.data,bpm:state.bpm,beatsPerBar:state.beatsPerBar,beatOffset:state.beatOffset,duration:state.duration,alignment:state.wordAlignment};
  downloadText(JSON.stringify(result,null,2),'lyrics-word-timing.json','application/json;charset=utf-8');
}
function generateWav(){
  const rate=22050,frames=Math.ceil(state.duration*rate),bytes=new ArrayBuffer(44+frames*2),view=new DataView(bytes);
  const writeStr=(at,s)=>{for(let i=0;i<s.length;i++)view.setUint8(at+i,s.charCodeAt(i));};
  writeStr(0,'RIFF');view.setUint32(4,36+frames*2,true);writeStr(8,'WAVEfmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);writeStr(36,'data');view.setUint32(40,frames*2,true);
  const beatLength=60/state.bpm;
  for(let b=0;state.beatOffset+b*beatLength<state.duration;b++){
    const start=Math.max(0,Math.round((state.beatOffset+b*beatLength)*rate)),end=Math.min(frames,start+Math.round(rate*.10));
    const freq=b%state.beatsPerBar===0?1000:700,amp=b%state.beatsPerBar===0?.35:.19;
    for(let i=start;i<end;i++){
      const tt=(i-start)/rate;
      const sample=Math.sin(2*Math.PI*freq*tt)*Math.exp(-tt*42)*amp;
      const old=view.getInt16(44+i*2,true)/32767;
      view.setInt16(44+i*2,Math.round(clamp(old+sample,-1,1)*32767),true);
    }
  }
  downloadText(bytes,`beat-${state.bpm}bpm.wav`,'audio/wav');
}
async function importFile(input,kind){
  const file=input.files?.[0];if(!file)return;
  try{const text=await file.text();const result=kind==='srt'?parseSrt(text):JSON.parse(text);const inferred=kind==='srt'||!result.lines?.every(l=>Array.isArray(l.words)&&l.words.length);useData(result,inferred?'estimated':'precise');toast(inferred?'匯入完成；逐字起迄為估算':'精確逐字 JSON 匯入完成');}
  catch(e){toast('匯入失敗：'+e.message);}finally{input.value='';}
}
async function exportStandalone(){
  try{
    const base=new URL('../',location.href);
    const paths=['assets/theme.css','assets/lyrics-sync.css','assets/lyrics-sync.js'];
    const fetched=await Promise.all(paths.map(p=>fetch(new URL(p,base)).then(r=>{if(!r.ok)throw Error('取得 '+p+' 失敗');return r.text();})));
    const html=document.implementation.createHTMLDocument('逐字節拍同步播放');
    html.documentElement.lang='zh-Hant';
    html.head.innerHTML='<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>逐字節拍同步播放 · 離線版</title>';
    const style=html.createElement('style');style.textContent=fetched[0]+'\n'+fetched[1];html.head.append(style);
    // Use the original static controls; the embedded JSON replaces the fetch in bootstrap.
    const source=document.querySelector('main').cloneNode(true);
    html.body.append(document.querySelector('.site-header').cloneNode(true),source,document.querySelector('.site-footer').cloneNode(true),document.querySelector('#toast').cloneNode(true));
    const dataScript=html.createElement('script');dataScript.type='application/json';dataScript.id='embedded-demo';dataScript.textContent=JSON.stringify({...state.data,bpm:state.bpm,beatOffset:state.beatOffset,duration:state.duration}).replace(/<\//g,'<\\/');html.body.append(dataScript);
    const js=html.createElement('script');js.type='module';js.textContent=fetched[2].replace('const PRESETS =', 'const PRESETS =');html.body.append(js);
    downloadText('<!doctype html>\n'+html.documentElement.outerHTML,'lyrics-beat-sync-player.html','text/html;charset=utf-8');
    toast('已輸出完整離線 HTML');
  }catch(e){toast('匯出失敗：'+e.message);}
}
function setupTransport(){
  $('#play').addEventListener('click',()=>state.playing?pause():start());
  $('#restart').addEventListener('click',()=>seekTo(0));
  $('#loop-toggle').addEventListener('click',()=>{state.loop=!state.loop;if(state.media)state.media.loop=state.loop;$('#loop-toggle').textContent='循環：'+(state.loop?'開':'關');$('#loop-toggle').setAttribute('aria-pressed',String(state.loop));});
  $('#click-toggle').addEventListener('click',toggleClick);
  $('#seek').addEventListener('pointerdown',()=>state.isSeeking=true);
  $('#seek').addEventListener('input',e=>seekTo(e.target.value));
  $('#seek').addEventListener('change',e=>{state.isSeeking=false;seekTo(e.target.value);});
  $('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('#projection').requestFullscreen();}catch{$('#projection').classList.toggle('is-expanded');}});
  $('#exit-fullscreen').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen();else $('#projection').classList.remove('is-expanded');});
  $('#srt-file').addEventListener('change',e=>importFile(e.target,'srt'));
  $('#json-file').addEventListener('change',e=>importFile(e.target,'json'));
  $('#audio-file').addEventListener('change',e=>{
    const file=e.target.files?.[0];if(!file)return;
    pause();if(state.mediaUrl)URL.revokeObjectURL(state.mediaUrl);
    state.mediaUrl=URL.createObjectURL(file);state.media=new Audio(state.mediaUrl);state.media.loop=state.loop;
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
      state.data=normalizeData(source,'manual-demo');state.duration=state.data.duration;state.displayedLine=-2;state.activeWord=-2;
      $('#seek').max=state.duration;buildTimeline();seekTo(current);
    }
    if(state.playing&&!state.media){reseedClock();}
  });
  $('#download-srt').addEventListener('click',downloadSrt);
  $('#download-json').addEventListener('click',downloadJson);
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
  const embedded=$('#embedded-demo');
  let demo;
  try{demo=embedded?JSON.parse(embedded.textContent):await fetch('./demo-timing.json').then(r=>{if(!r.ok)throw Error('範例資料載入失敗');return r.json();});}
  catch(e){const note=document.createElement('p');note.className='error-box';note.textContent=e.message;$('#projection-lyrics').replaceChildren(note);return;}
  renderSelectors();setupTransport();state.originalDemo=structuredClone(demo);useData(demo,'manual-demo');usePreset('obvious');initialized=true;
}
main();
