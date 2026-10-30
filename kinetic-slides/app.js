import { effects } from './effects.js';

const $ = id => document.getElementById(id);
const screen = $('screen');
const nativeReduced = matchMedia('(prefers-reduced-motion: reduce)');
let selected = effects[0], activeIndex = 0, lastPair = null, playing = false;
let finishTimer = 0, autoTimer = 0, filter = '全部效果';
let playbackVersion = 0;

let previewPaused = false;
let previewPage = 0;
const previewCycle = 3600;
const previewVisible = new Set();
const previewTexts = [
  {title:'光的旅程',subtitle:'從此刻出發'},
  {title:'嶄新的一頁',subtitle:'讓畫面說話'},
  {title:'一同向前',subtitle:'下一段故事'},
  {title:'此刻綻放',subtitle:'用光照亮'}
];
const previewObserver = ('IntersectionObserver' in window)
  ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        const card = entry.target;
        if (entry.isIntersecting) {
          previewVisible.add(card);
          ensurePreview(card);
        } else {
          previewVisible.delete(card);
          card.querySelector('.mini-screen')?.classList.remove('is-playing');
        }
      }
    }, {rootMargin:'120px 0px',threshold:0})
  : null;
let previewTimer = 0;

// Use exactly the same design-space dimensions for the full stage and each
// animated thumbnail. Scaling the entire stage is essential: film perforations,
// large numeral overlays, type, borders, and blur radii all scale together.
let previewDesignWidth = 960;
let previewDesignHeight = 540;
function updatePreviewDesignSize() {
  // Fullscreen is an alternate presentation size, not the card's 16:9 baseline.
  if (document.fullscreenElement === screen) return;
  const box = screen.getBoundingClientRect();
  if (box.width < 10 || box.height < 10) return;
  previewDesignWidth = box.width;
  previewDesignHeight = box.height;
}
function fitPreview(card) {
  if (!card?._mini) return;
  const {screen: miniature} = card._mini;
  const holder = card.querySelector('.thumb');
  const width = holder?.getBoundingClientRect().width || 0;
  if (width <= 0) return;
  miniature.style.width = previewDesignWidth + 'px';
  miniature.style.height = previewDesignHeight + 'px';
  miniature.style.transform = 'scale(' + (width / previewDesignWidth) + ')';
}
const previewResizeObserver = ('ResizeObserver' in window)
  ? new ResizeObserver(entries => {
      const stageChanged = entries.some(entry => entry.target === screen);
      if (stageChanged) {
        updatePreviewDesignSize();
        for (const card of previewVisible) fitPreview(card);
      } else {
        for (const entry of entries) {
          const card = entry.target.closest('.effect-card');
          if (card) fitPreview(card);
        }
      }
    })
  : null;

const pad = n => String(n).padStart(2, '0');

function parsePages() {
  const pages = $('slides').value.split(/\r?\n/).map(line => {
    const [heading, ...rest] = line.split('|');
    return { title: (heading || '').trim(), subtitle: rest.join('|').trim() };
  }).filter(page => page.title);
  return pages.length ? pages : [{ title: '讓文字動起來', subtitle: '自訂你的投影片文字' }];
}
function tokens(s) {
  return s.match(/[\u3400-\u9fff]|[^\u3400-\u9fff\s]+|\s+/gu) || [s];
}
function renderSlide(target, page, index, count) {
  target.replaceChildren();
  const number = document.createElement('span');
  number.className = 'number';
  number.textContent = 'MOTION / ' + pad(index + 1);
  const title = document.createElement('h2');
  title.className = 'title';
  // CSS pseudo-elements consume static text snapshots; no per-frame string updates.
  title.dataset.plain = page.title;
  title.dataset.scramble = Array.from(page.title).map(char => /\s/u.test(char) ? char : /[a-z0-9]/iu.test(char) ? '0' : '▒').join('');
  let sequence = 0;
  for (const fragment of tokens(page.title)) {
    const span = document.createElement('span');
    span.className = 'token';
    span.textContent = fragment;
    const n = sequence++;
    span.style.setProperty('--i', Math.min(n, 10));
    const orbit = n % 8;
    const angles = [0,45,90,135,180,225,270,315];
    span.style.setProperty('--dx', (Math.cos(angles[orbit]*Math.PI/180)*4.7).toFixed(2)+'em');
    span.style.setProperty('--dy', (Math.sin(angles[orbit]*Math.PI/180)*3.7).toFixed(2)+'em');
    span.style.setProperty('--angle', (n % 2 ? 135 : -125)+'deg');
    title.append(span);
  }
  const rule = document.createElement('span');
  rule.className = 'rule';
  const subtitle = document.createElement('p');
  subtitle.className = 'subtitle';
  (page.subtitle.split('/').map(x => x.trim()).filter(Boolean).slice(0, 3).length
    ? page.subtitle.split('/').map(x => x.trim()).filter(Boolean).slice(0, 3)
    : ['從此刻，開始新的畫面']
  ).forEach((line, i) => {
    const el = document.createElement('span');
    el.className = 'line';
    el.style.setProperty('--i', i);
    el.textContent = line;
    subtitle.append(el);
  });
  const corner = document.createElement('span');
  corner.className = 'corner-index';
  corner.textContent = pad(index + 1);
  corner.setAttribute('aria-hidden', 'true');
  const visual = document.createElement('div');
  visual.className = 'visual-layer';
  visual.setAttribute('aria-hidden', 'true');
  for(let i=0;i<9;i++){
    const sh=document.createElement('i');
    sh.className='shape';
    sh.style.setProperty('--i',i);
    sh.style.setProperty('--dx', ((i%3-1)*95)+'%');
    sh.style.setProperty('--dy', ((Math.floor(i/3)-1)*95)+'%');
    sh.dataset.day=String(i+1);
    visual.append(sh);
  }
  target.append(number,title,rule,subtitle,visual,corner);
}
function updatePageLabel() {
  $('pageLabel').textContent = pad(activeIndex + 1) + ' / ' + pad(parsePages().length);
}
function staticScene() {
  const pages = parsePages();
  activeIndex = ((activeIndex % pages.length) + pages.length) % pages.length;
  screen.classList.remove('is-playing');
  renderSlide($('fromSlide'), pages[activeIndex], activeIndex, pages.length);
  renderSlide($('toSlide'), pages[(activeIndex + 1) % pages.length], (activeIndex + 1) % pages.length, pages.length);
  updatePageLabel();
}
function cancelPlayback() {
  // Invalidate the previous completion callback and its auto-advance timer.
  playbackVersion++;
  clearTimeout(finishTimer);
  clearTimeout(autoTimer);
  playing = false;
  screen.classList.remove('is-playing');
}
function updateStatus(message) {
  $('status').textContent = message;
}
function planAuto() {
  clearTimeout(autoTimer);
  if ($('auto').checked && !playing) autoTimer = setTimeout(() => playTo(activeIndex + 1), 3000);
}
function playTo(targetIndex, replayFrom = null) {
  const pages = parsePages();
  if (!pages.length) return;
  const normalize = n => ((n % pages.length) + pages.length) % pages.length;
  // activeIndex is the committed destination *even during* an animation.
  // A second click thus starts from the previous destination, not the stale source.
  const source = replayFrom === null ? normalize(activeIndex) : normalize(replayFrom);
  const destination = normalize(targetIndex);
  cancelPlayback(); // Previous animation immediately snaps to its final logical page.
  const version = playbackVersion;
  activeIndex = destination;
  lastPair = [source, destination];
  if ($('reduced').checked || pages.length === 1) {
    staticScene();
    updateStatus('靜態切換完成');
    planAuto();
    return;
  }
  renderSlide($('fromSlide'), pages[source], source, pages.length);
  renderSlide($('toSlide'), pages[destination], destination, pages.length);
  updatePageLabel();
  playing = true;
  updateStatus('轉場播放中');
  screen.classList.remove('is-playing');
  void screen.offsetWidth;
  screen.classList.add('is-playing');
  finishTimer = setTimeout(() => {
    if (version !== playbackVersion) return;
    playing = false;
    staticScene();
    updateStatus('顯示第 ' + (destination + 1) + ' 頁');
    planAuto();
  }, +$('duration').value + 180);
}
function replay() {
  const pair = lastPair || [activeIndex, activeIndex + 1];
  playTo(pair[1], pair[0]);
}
function setEffect(id, animate = true) {
  selected = effects.find(effect => effect.id === id) || effects[0];
  $('effect').value = selected.id;
  screen.dataset.effect = selected.id;
  $('effectLabel').textContent = selected.name;
  $('effectName').textContent = selected.name;
  $('effectCategory').textContent = selected.category;
  $('effectLevel').textContent = selected.level;
  $('effectDesc').textContent = selected.description;
  $('technique').textContent = selected.technique;
  $('usage').textContent = selected.usage;
  $('reference').hidden = !selected.reference;
  if (selected.reference) $('reference').textContent = 'Kittenjam 參考：' + selected.reference;
  document.querySelectorAll('.effect-card').forEach(card =>
    card.setAttribute('aria-pressed', String(card.dataset.id === selected.id)));
  if (animate) replay();
}
function makePreviewLayer(id, count, className, screen) {
  const layer=document.createElement('div');
  layer.className=className;
  layer.setAttribute('aria-hidden','true');
  for(let i=0;i<count;i++){
    const el=document.createElement('div');
    el.className=className==='tile-layer'?'tile':'blade';
    el.style.setProperty('--i',className==='tile-layer'?i%4+Math.floor(i/4):i);
    layer.append(el);
  }
  screen.append(layer);
}
function ensurePreview(card){
  if(card._mini)return card._mini;
  const mini=document.createElement('div');
  mini.className='screen mini-screen';
  mini.dataset.effect=card.dataset.id;
  mini.dataset.backdrop='night';
  mini.style.setProperty('--dur','1750ms');
  mini.style.setProperty('--ease','cubic-bezier(.22,1,.36,1)');
  mini.style.setProperty('--accent','#8eb4ff');
  mini.classList.toggle('user-motion',!$('reduced').checked);
  const from=document.createElement('div');
  const to=document.createElement('div');
  from.className='slide from';
  to.className='slide to';
  mini.append(from,to);
  makePreviewLayer('tiles',12,'tile-layer',mini);
  makePreviewLayer('blades',6,'blade-layer',mini);
  const thumb=card.querySelector('.thumb');
  thumb.replaceChildren(mini);
  card._mini={screen:mini,from,to};
  fitPreview(card);
  previewResizeObserver?.observe(thumb);
  const page=previewTexts[previewPage%previewTexts.length];
  renderSlide(from,page,previewPage%previewTexts.length,previewTexts.length);
  renderSlide(to,previewTexts[(previewPage+1)%previewTexts.length],(previewPage+1)%previewTexts.length,previewTexts.length);
  return card._mini;
}
function advancePreviews(){
  if(previewPaused||$('reduced').checked||document.hidden) return;
  previewPage=(previewPage+1)%previewTexts.length;
  const cards=[...previewVisible].filter(card=>card.isConnected);
  for(const card of cards){
    const mini=ensurePreview(card);
    mini.screen.classList.remove('is-playing');
    renderSlide(mini.from,previewTexts[(previewPage+previewTexts.length-1)%previewTexts.length],(previewPage+previewTexts.length-1)%previewTexts.length,previewTexts.length);
    renderSlide(mini.to,previewTexts[previewPage],previewPage,previewTexts.length);
  }
  // One shared timestamp starts all visible animations simultaneously.
  requestAnimationFrame(()=>{if(!previewPaused&&!$('reduced').checked)for(const card of cards)card._mini?.screen.classList.add('is-playing');});
  $('previewStatus').textContent='同步第 '+(previewPage+1)+' / '+previewTexts.length+' 頁';
}
function renderCards() {
  const keyword=$('search').value.trim().toLowerCase();
  const matches=effects.filter(effect=>
    (filter==='全部效果'||effect.category===filter)
    && [effect.name,effect.category,effect.technique,effect.description,effect.usage,effect.reference||'']
      .join(' ').toLowerCase().includes(keyword));
  previewObserver?.disconnect();
  previewResizeObserver?.disconnect();
  previewResizeObserver?.observe(screen);
  previewVisible.clear();
  $('cards').replaceChildren();
  for(const effect of matches){
    const card=document.createElement('button');
    card.type='button';
    card.className='effect-card';
    card.dataset.id=effect.id;
    card.setAttribute('aria-pressed',String(effect.id===selected.id));
    card.setAttribute('aria-label','以完整投影片預覽 '+effect.name);
    const thumb=document.createElement('span');
    thumb.className='thumb';
    thumb.setAttribute('aria-hidden','true');
    const detail=document.createElement('div');
    detail.className='card-detail';
    const name=document.createElement('b');
    name.textContent=effect.name;
    const sub=document.createElement('small');
    sub.textContent=effect.category+' · '+effect.level;
    const desc=document.createElement('p');
    desc.textContent=effect.description;
    detail.append(name,sub,desc);
    card.append(thumb,detail);
    card.addEventListener('click',()=>{
      setEffect(effect.id);
      document.querySelector('.viewer').scrollIntoView({block:'start',behavior:$('reduced').checked?'instant':'smooth'});
    });
    $('cards').append(card);
    if(previewObserver)previewObserver.observe(card);
    else{previewVisible.add(card);ensurePreview(card);}
  }
  $('resultCount').textContent=matches.length+' / '+effects.length+' 種';
  $('empty').hidden=matches.length!==0;
}
function selectAdjacentEffect(delta){
  const index=effects.findIndex(effect=>effect.id===selected.id);
  setEffect(effects[(index+delta+effects.length)%effects.length].id);
}
function updateSettings() {
  const duration = +$('duration').value;
  $('durationValue').textContent = (duration / 1000).toFixed(1) + ' 秒';
  screen.style.setProperty('--dur', duration + 'ms');
  screen.style.setProperty('--ease', $('easing').value);
  screen.style.setProperty('--accent', $('accent').value);
  screen.dataset.backdrop = $('backdrop').value;
  screen.classList.toggle('user-motion', !$('reduced').checked);
}
async function exportOffline() {
  const button = $('download');
  button.disabled = true;
  updateStatus('建立離線 HTML');
  try {
    const paths = ['style.css', 'effects.js', 'app.js'];
    const response = await Promise.all(paths.map(path => fetch(new URL(path, location.href))));
    if (response.some(r => !r.ok)) throw new Error('無法讀取本機 CSS / JavaScript');
    const [cssRaw, effectsJs, appJs] = await Promise.all(response.map(r => r.text()));
    const css = cssRaw.replace(/^@import[^;]*;\s*/gm, '');
    const moduleCode = effectsJs.replace(/\bexport\s+const\s+/g, 'const ') +
      '\n' + appJs.replace(/^import\s*\{\s*effects\s*\}\s*from\s*['"]\.\/effects\.js['"];\s*/m, '');
    const clone = document.documentElement.cloneNode(true);
    clone.querySelector('textarea#slides').textContent = $('slides').value;
    clone.querySelectorAll('link[rel="stylesheet"], link[rel="icon"]').forEach(link => link.remove());
    const style = document.createElement('style');
    style.textContent = css;
    clone.querySelector('head').append(style);
    clone.querySelectorAll('script[src]').forEach(script => script.remove());
    const defaults = {
      effect: selected.id,
      slides: $('slides').value,
      duration: $('duration').value,
      accent: $('accent').value,
      easing: $('easing').value,
      backdrop: $('backdrop').value,
      reduced: $('reduced').checked,
      activeIndex
    };
    const bootstrap = document.createElement('script');
    bootstrap.textContent = 'window.__kineticDefaults = ' + JSON.stringify(defaults).replace(/</g, '\\u003c') + ';';
    clone.querySelector('head').append(bootstrap);
    const inline = document.createElement('script');
    inline.type = 'module';
    inline.textContent = moduleCode.replace(/<\/script/gi, '<\\/script');
    clone.querySelector('body').append(inline);
    const blob = new Blob(['<!doctype html>\n', clone.outerHTML], { type: 'text/html;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'projectionlabs-kinetic-slides.html';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(href), 2000);
    updateStatus('已匯出離線 HTML');
  } catch (err) {
    updateStatus('匯出失敗：' + err.message);
  } finally {
    button.disabled = location.protocol === 'file:';
  }
}
function init() {
  const defaults = window.__kineticDefaults;
  if (defaults) {
    $('slides').value = defaults.slides;
    $('duration').value = defaults.duration;
    $('accent').value = defaults.accent;
    $('easing').value = defaults.easing;
    $('backdrop').value = defaults.backdrop;
  }
  if (defaults && Number.isInteger(defaults.activeIndex) && defaults.activeIndex >= 0) activeIndex = defaults.activeIndex;
  $('reduced').checked = defaults ? !!defaults.reduced : nativeReduced.matches;
  $('total').textContent = effects.length;
  // Exported offline HTML contains the rendered DOM; initialize from a clean state.
  $('effect').replaceChildren();
  $('tiles').replaceChildren();
  $('blades').replaceChildren();
  effects.forEach(effect => $('effect').add(new Option(effect.name + ' / ' + effect.category, effect.id)));
  for (let i = 0; i < 12; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.style.setProperty('--i', (i % 4) + Math.floor(i / 4));
    $('tiles').append(tile);
  }
  for (let i = 0; i < 6; i++) {
    const blade = document.createElement('div');
    blade.className = 'blade';
    blade.style.setProperty('--i', i);
    $('blades').append(blade);
  }
  updateSettings();
  staticScene();
  setEffect(defaults?.effect || effects[0].id, false);
  updatePreviewDesignSize();
  renderCards();
  if (!previewResizeObserver) window.addEventListener('resize', () => { updatePreviewDesignSize(); for (const card of previewVisible) fitPreview(card); });
  document.addEventListener('fullscreenchange', () => { updatePreviewDesignSize(); for (const card of previewVisible) fitPreview(card); });
  $('effect').addEventListener('change', () => setEffect($('effect').value));
  $('slides').addEventListener('input', () => { cancelPlayback(); lastPair = null; staticScene(); updateStatus('已更新投影片文字'); planAuto(); });
  ['duration', 'accent', 'easing', 'backdrop'].forEach(id => $(id).addEventListener('input', updateSettings));
  $('reduced').addEventListener('change', () => { updateSettings(); for(const card of previewVisible) {card._mini?.screen.classList.toggle('user-motion',!$('reduced').checked); if($('reduced').checked) card._mini?.screen.classList.remove('is-playing'); } cancelPlayback(); staticScene(); updateStatus('已更新動態設定'); if(!$('reduced').checked)advancePreviews(); planAuto(); });
  $('auto').addEventListener('change', planAuto);
  $('effectPrevious').addEventListener('click', () => selectAdjacentEffect(-1));
  $('effectNext').addEventListener('click', () => selectAdjacentEffect(1));
  $('stagePrevious').addEventListener('click', () => playTo(activeIndex - 1));
  $('stageNext').addEventListener('click', () => playTo(activeIndex + 1));
  $('stageFullscreen').addEventListener('click', () => $('fullscreen').click());
  $('previewToggle').addEventListener('click', () => {
    previewPaused=!previewPaused;
    $('previewToggle').textContent=previewPaused?'播放縮圖':'暫停縮圖';
    $('previewToggle').setAttribute('aria-pressed', String(previewPaused));
    $('previewStatus').textContent=previewPaused?'預覽已暫停':'同步自動預覽中';
    if(previewPaused)for(const card of previewVisible)card._mini?.screen.classList.remove('is-playing');
    else advancePreviews();
  });
  if(!previewTimer)previewTimer=setInterval(advancePreviews,previewCycle);
  $('replay').addEventListener('click', replay);
  $('search').addEventListener('input', renderCards);
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    renderCards();
  }));
  $('fullscreen').addEventListener('click', async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (screen.requestFullscreen) {
      try { await screen.requestFullscreen(); } catch { updateStatus('瀏覽器未允許全螢幕'); }
    }
  });
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest('input, textarea, select, button, [contenteditable="true"]')) return;
    if (event.key === 'ArrowUp') {event.preventDefault();selectAdjacentEffect(-1);}
    if (event.key === 'ArrowDown') {event.preventDefault();selectAdjacentEffect(1);}
    if (event.key === 'ArrowRight') { event.preventDefault(); playTo(activeIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); playTo(activeIndex - 1); }
    if (event.code === 'Space') { event.preventDefault(); replay(); }
    if (event.key.toLowerCase() === 'f' && !event.repeat) { event.preventDefault(); $('fullscreen').click(); }
  });
  $('download').addEventListener('click', exportOffline);
  if (location.protocol === 'file:') {
    $('download').disabled = true;
    $('download').title = '目前已是可離線使用的 HTML';
  }
}
init();
