export const scenes=[
{id:'lyrics',name:'富排版歌詞',caption:'Canvas 2D / DOM typography',api:'2D · drawElementImage',tags:['多層 HTML','排版','CSS'],desc:'以真正的 HTML 排版與 CSS 文字進入 Canvas，保持中文字型、換行與樣式的彈性。',how:'原生模式會將帶有結構化標題、說明與徽章的 HTML 節點直接畫進 Canvas 2D，而不是先擷取成圖片。一般 Canvas 2D 手繪模式只能用 fillText 重新拼出近似畫面。',less:'保留 HTML/CSS 排版邏輯，減少自行測字寬、排版與換行的 JS。',cost:'DOM 仍需 Layout／Paint；若每影格 requestPaint 會付出主執行緒成本。此案例只在有內容變更時繪製。',fit:'歌詞、經文、具多層字型排版的投影頁。',warning:'新 API 不是「自動把整個網頁影格率提高」；靜態字幕仍可優先使用普通 DOM。',kind:'2d',effect:'static',variant:'lyric'},
{id:'form',name:'Canvas 內互動表單',caption:'Live DOM / input / accessibility',api:'2D · input & focus',tags:['互動','可選取','無障礙'],desc:'在 Canvas 裡放入真實 input、button 與 output，測試鍵盤操作和命中區域同步。',how:'傳統 Canvas 內的表單必須自己實作事件與文字游標。原生 HTML-in-Canvas 將表單保留為實際 DOM；2D drawElementImage 在新 API 中自動同步互動座標，舊版需要使用返回的 DOMMatrix。',less:'免維護自製 Canvas 表單控件、游標、文字選取與焦點邏輯。',cost:'瀏覽器仍會執行 DOM/表單 Layout。對輸入區域不代表比純 DOM 更省 CPU。',fit:'操作室參數選單、投影員自訂控制面板。',warning:'在傳統 Canvas 2D 模式無法直接點擊畫入的文字：這是刻意保留的比較。',kind:'2d',effect:'static',variant:'interactive'},
{id:'glass',name:'同一 HTML 多重繪製',caption:'2D clip / filter / layered rendering',api:'2D · clip + filter',tags:['折射感','重複取樣','光暈'],desc:'對同一個 HTML 子樹進行不同透明度、模糊及裁切的分層繪製。',how:'2D Canvas 的 ctx.filter、globalAlpha、clip() 可以配合 drawElementImage 同時重繪一份 DOM 版面，建立柔光與多層效果；不需要複製 HTML 到多個疊層節點。',less:'相同畫面多重特效可重複取用 DOM 原生快照。',cost:'blur／多次 drawElementImage 會提高繪製成本；對 CPU 與 GPU 都不保證較省。',fit:'詩歌標題折射、玻璃反光、強調光影。',warning:'本場景偏向視覺實驗。重複繪製與模糊比單純 DOM opacity/transform 費時。',kind:'2d',effect:'glass',variant:'billboard'},
{id:'tilt',name:'HTML 卡片 2D 空間運動',caption:'Rotate / matrix / hit testing',api:'2D · canvas transform',tags:['旋轉','動態繪製','座標同步'],desc:'讓畫入 Canvas 的 HTML 面板緩緩傾斜與旋轉，觀察渲染方式與互動幾何。',how:'Canvas 繪圖座標系可對 DOM 生成的快照做旋轉、位移。新 2D API 能自動更新 DOM 命中座標；較舊版本需要用 drawElementImage 的回傳矩陣手動同步。',less:'不再需要把 CSS 面板轉成位圖、每次手動重新截圖。',cost:'需要持續重繪的場景會有 JS requestPaint 與 2D Paint 成本。單純轉動卡片時 CSS transform 可能更適合。',fit:'選曲頁投影特效、提示卡旋轉。',warning:'持續動畫不一定比普通 CSS transform 平滑；相同效果請先使用合成友善 CSS。',kind:'2d',effect:'tilt',variant:'billboard'},
{id:'webgl',name:'WebGL 曲面字幕材質',caption:'WebGL2 / DOM texture / GLSL',api:'WebGL2 · HTML texture',tags:['GPU 材質','波紋','實驗性'],desc:'將一張 HTML 卡片作為 WebGL 紋理，交給片段著色器產生彎曲與色散。',how:'HTML 子樹被瀏覽器擷取為 GPU 紋理，WebGL 在像素著色器處理。Chrome 155+ 使用 texElementSubImage2D 與預先配置紋理；較舊試用版使用 texElementImage2D。',less:'不需要用 html2canvas 截圖或重新刻文字紋理。',cost:'持續 shader 動畫耗 GPU；DOM 文字有變更時也可能重新上傳紋理。真正 VRAM/CPU 情形應用 Performance 與 GPU 工具分析。',fit:'舞台光幕、3D 歌詞看板、波紋字幕。',warning:'WebGL 扭曲不自動對應 DOM 點擊區域。本案例只展示材質效果，不宣稱扭曲的卡片可互動。',kind:'webgl',effect:'shader',variant:'shader'},
{id:'economy',name:'paint 事件式重繪',caption:'Change driven vs frame driven',api:'2D · onpaint / requestPaint',tags:['CPU 取捨','事件式','效能'],desc:'刻意將場景保持靜止；編輯文字時才重繪，觀察 paint 事件數與繪製次數。',how:'HTML-in-Canvas 的 paint 事件在 DOM 視覺改變時通知重繪；不一定要每秒呼叫 60 次 requestAnimationFrame。對靜態投影或低頻更新字幕，事件式繪製可減少不必要的 JS 工作。',less:'避免用永久的逐影格輪詢來同步靜態文字。',cost:'更少 JS 呼叫通常有利，但 DOM 變更仍可能觸發 Paint；節省幅度需量測。',fit:'低頻換句、講道字幕、靜態經文頁。',warning:'paint 事件只通知快照可能改變，實作也可能在未變更時觸發；不要把事件數量直接換算 CPU 百分比。',kind:'2d',effect:'static',variant:'economy'},
{id:'projection',name:'投影雙層折射舞台',caption:'Stage design / transform / projection',api:'2D · advanced composition',tags:['16:9 投影','多層合成','光束'],desc:'用 16:9 固定舞台與大字歌詞，示範 HTML/CSS 內容融入 Canvas 光影與畫面合成。',how:'CSS 維持歌詞的文字排版，Canvas 2D 再加入大面積光帶、局部遮罩與柔光，可依場景搭配獨立輸出控制。',less:'分離文字版面邏輯與視覺合成邏輯。',cost:'高解析度 16:9 舞台需要考量 DPR、光暈半徑與重繪次數。',fit:'教會全螢幕投影背景與文字融合的概念驗證。',warning:'實務上持續播影片加上普通 DOM 字幕可能更省資源。這裡是 Canvas 混合渲染實驗。',kind:'2d',effect:'projection',variant:'portal'}
];
export function escapeHTML(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function makeMarkup(scene,headline){
const text=escapeHTML(headline);
const variant=scene.variant;
const first='<section class="canvas-source '+variant+'" id="liveDOM" drawable><span class="eyeline">UP WORSHIP / HTML-IN-CANVAS</span>';
const last='</section>';
switch(scene.id){
case 'form':return '<section class="canvas-source interactive" id="liveDOM" drawable><span class="eyeline">INTERACTIVE DOM / REAL INPUT</span><h3 class="big" data-title>'+text+'</h3><div class="formrow"><label for="sceneName">姓名</label><input id="sceneName" value="來賓" autocomplete="off" aria-label="輸入姓名"><button class="action" type="button" data-action="greet">送出</button></div><output data-greeting aria-live="polite">請輸入姓名並按送出</output></section>';
case 'glass':return first+'<span class="orb" aria-hidden="true"></span><h3 class="big" data-title>'+text+'</h3><p class="fine">讓相同的排版成為畫面的不同光學層次</p>'+last;
case 'tilt':return first+'<span class="orb" aria-hidden="true"></span><h3 class="big" data-title>'+text+'</h3><p class="fine">即時 DOM 繪製與旋轉座標</p>'+last;
case 'webgl':return first+'<h3 class="big" data-title>'+text+'</h3><div class="chipset"><span>HTML TEXTURE</span><span>WEBGL2 SHADER</span><span>DOM SNAPSHOT</span></div><p class="fine">原生字體佈局 → GPU 紋理 → 著色器</p>'+last;
case 'economy':return first+'<h3 class="big" data-title>'+text+'</h3><p class="fine">靜止畫面：更新文字時才需要重繪</p><div class="chipset"><span>paint</span><span>change driven</span><span>low frequency</span></div>'+last;
case 'projection':return first+'<span class="eyeline">✦ 生命力教會 / LYRICS</span><h3 class="big" data-title>'+text+'</h3><p class="fine">以祢的信實為我們的盼望</p>'+last;
default:return first+'<span class="orb" aria-hidden="true"></span><h3 class="big" data-title>'+text+'</h3><p class="verse">縱使黑夜圍繞，祢的應許永不改變，<br>祢是我們永遠的盼望。</p><div class="chipset"><span>CSS 排版</span><span>原生中文字</span><span>語意結構</span></div>'+last;
}}
export const common2DCode=`const canvas = document.querySelector('canvas');
const element = canvas.querySelector('[drawable]');
const ctx = canvas.getContext('2d');

// 支援 Chrome 新版與舊版 Origin Trial
canvas.onpaint = () => {
  ctx.reset();
  const matrix = ctx.drawElementImage(element, x, y);
  if (matrix?.toString) {        // 舊版必須自己同步
    element.style.transform = matrix.toString();
  }
  // 新版自動同步 hit testing / focus
};
canvas.requestPaint(); // 需要動畫或刷新時再請求
`;
export const sceneCode={
lyrics:`<canvas content="drawable" layoutsubtree>
  <section drawable><h2>祢的光照亮我心</h2><p>真正 CSS 排版</p></section>
</canvas>
${common2DCode}`,
form:`<canvas content="drawable" layoutsubtree>
  <form drawable>
    <label>姓名 <input /></label><button>送出</button>
  </form>
</canvas>
${common2DCode}
// drawElementImage 會保留可互動的 DOM 語意
// 新版自動同步 hit testing / focus
`,
glass:`ctx.reset();
ctx.save();
ctx.filter = 'blur(22px)';
ctx.globalAlpha = 0.65;
ctx.drawElementImage(element, x + 10, y + 10);
ctx.restore();
ctx.save();
ctx.beginPath(); ctx.roundRect(x, y, w, h, 24); ctx.clip();
const result = ctx.drawElementImage(element, x, y);
ctx.restore();
// 舊版需處理回傳矩陣；多重 draw 的 hit-test 區域要另行驗證
`,
tilt:`ctx.reset();
ctx.translate(centerX, centerY);
ctx.rotate(Math.sin(time) * 0.12);
const transform = ctx.drawElementImage(element, -w / 2, -h / 2);
// 舊版透過 transform 同步座標，新版自動同步
canvas.requestPaint(); // 動畫才連續重繪
`,
webgl:`// WebGL 2 / 版本相容處理
const gl = canvas.getContext('webgl2');
gl.bindTexture(gl.TEXTURE_2D, texture);
if (typeof gl.texElementSubImage2D === 'function') {
  // Chrome 155+：先保留 GPU 紋理空間
  const snapshot = canvas.captureElementImage(element);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,
    Math.ceil(snapshot.width), Math.ceil(snapshot.height),
    0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  gl.texElementSubImage2D(gl.TEXTURE_2D,0,0,0,element);
} else if (typeof gl.texElementImage2D === 'function') {
  // Chrome 150+ 或更舊的試用介面
  if (gl.texElementImage2D.length === 3)
    gl.texElementImage2D(gl.TEXTURE_2D,gl.RGBA8,element);
  else
    gl.texElementImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,element);
}
// GLSL shader 只處理已存在 GPU 的 DOM 紋理；
// 不需每幀重新上傳無變更的 HTML。
`,
economy:`// 對靜態投影內容：只在內容更新時繪製
canvas.onpaint = () => {
  ctx.reset();
  const matrix = ctx.drawElementImage(element, x, y);
  if(matrix?.toString) element.style.transform=matrix.toString();
};
// 文字 input 變更 → HTML snapshot changed → paint event
// 免除空轉 requestAnimationFrame(draw)。
`,
projection:`canvas.onpaint = () => {
  ctx.reset();
  // 使用 Canvas 繪製背景光影，再把 HTML 作為語意圖層繪入
  const halo = ctx.createRadialGradient(cx,cy,20,cx,cy,400);
  halo.addColorStop(0,'#84ffe455');halo.addColorStop(1,'#00000000');
  ctx.fillStyle=halo;ctx.fillRect(0,0,canvas.width,canvas.height);
  const matrix=ctx.drawElementImage(lyrics,x,y);
  if(matrix?.toString) lyrics.style.transform=matrix.toString();
};`
};