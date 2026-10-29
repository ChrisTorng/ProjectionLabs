import { effects } from './effects.js';

const $ = id => document.getElementById(id);
const screen = $('screen');
const nativeReduced = matchMedia('(prefers-reduced-motion: reduce)');
let selected = effects[0], activeIndex = 0, lastPair = null, playing = false;
let finishTimer = 0, autoTimer = 0, filter = '全部效果';
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
  let sequence = 0;
  for (const fragment of tokens(page.title)) {
    const span = document.createElement('span');
    span.className = 'token';
    span.textContent = fragment;
    span.style.setProperty('--i', sequence++);
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
  target.append(number, title, rule, subtitle, corner);
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
  clearTimeout(finishTimer);
  clearTimeout(autoTimer);
  playing = false;
  screen.classList.remove('is-playing');
}
function updateStatus(message) {
  $('status').textContent = message;
  $('previous').disabled = playing;
  $('next').disabled = playing;
}
function planAuto() {
  clearTimeout(autoTimer);
  if ($('auto').checked && !playing) autoTimer = setTimeout(() => playTo(activeIndex + 1), 3000);
}
function playTo(targetIndex, replayFrom = null) {
  const pages = parsePages();
  if (!pages.length) return;
  cancelPlayback();
  const source = replayFrom === null ? activeIndex : ((replayFrom % pages.length) + pages.length) % pages.length;
  const destination = ((targetIndex % pages.length) + pages.length) % pages.length;
  if ($('reduced').checked || pages.length === 1) {
    activeIndex = destination;
    lastPair = [source, destination];
    staticScene();
    updateStatus('靜態切換完成');
    planAuto();
    return;
  }
  lastPair = [source, destination];
  renderSlide($('fromSlide'), pages[source], source, pages.length);
  renderSlide($('toSlide'), pages[destination], destination, pages.length);
  playing = true;
  updateStatus('轉場播放中');
  screen.classList.remove('is-playing');
  void screen.offsetWidth;
  screen.classList.add('is-playing');
  const duration = +$('duration').value;
  finishTimer = setTimeout(() => {
    activeIndex = destination;
    playing = false;
    staticScene();
    updateStatus('顯示第 ' + (destination + 1) + ' 頁');
    planAuto();
  }, duration + 180);
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
  document.querySelectorAll('.effect-card').forEach(card =>
    card.setAttribute('aria-pressed', String(card.dataset.id === selected.id)));
  if (animate) replay();
}
function renderCards() {
  const keyword = $('search').value.trim().toLowerCase();
  const matches = effects.filter(effect =>
    (filter === '全部效果' || effect.category === filter)
    && [effect.name, effect.category, effect.technique, effect.description, effect.usage]
      .join(' ').toLowerCase().includes(keyword));
  $('cards').replaceChildren();
  matches.forEach(effect => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'effect-card';
    b.dataset.id = effect.id;
    b.setAttribute('aria-pressed', String(effect.id === selected.id));
    const head = document.createElement('div');
    const thumb = document.createElement('span');
    thumb.className = 'thumb';
    thumb.setAttribute('aria-hidden', 'true');
    for (let j = 0; j < 3; j++) thumb.append(document.createElement('i'));
    const detail = document.createElement('div');
    const title = document.createElement('b');
    title.textContent = effect.name;
    const sub = document.createElement('small');
    sub.textContent = effect.category + ' · ' + effect.level;
    const desc = document.createElement('p');
    desc.textContent = effect.description;
    detail.append(title, sub, desc);
    b.append(thumb, detail);
    b.addEventListener('click', () => {
      setEffect(effect.id);
      document.querySelector('.viewer').scrollIntoView({ block: 'start', behavior: $('reduced').checked ? 'instant' : 'smooth' });
    });
    $('cards').append(b);
  });
  $('resultCount').textContent = matches.length + ' / ' + effects.length + ' 種';
  $('empty').hidden = matches.length !== 0;
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
    clone.querySelectorAll('link[rel="stylesheet"]').forEach(link => link.remove());
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
      reduced: $('reduced').checked
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
  $('reduced').checked = defaults ? !!defaults.reduced : nativeReduced.matches;
  $('total').textContent = effects.length;
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
  renderCards();
  $('effect').addEventListener('change', () => setEffect($('effect').value));
  $('slides').addEventListener('input', () => { cancelPlayback(); lastPair = null; staticScene(); updateStatus('已更新投影片文字'); planAuto(); });
  ['duration', 'accent', 'easing', 'backdrop'].forEach(id => $(id).addEventListener('input', updateSettings));
  $('reduced').addEventListener('change', () => { updateSettings(); cancelPlayback(); staticScene(); updateStatus('已更新動態設定'); planAuto(); });
  $('auto').addEventListener('change', planAuto);
  $('previous').addEventListener('click', () => playTo(activeIndex - 1));
  $('next').addEventListener('click', () => playTo(activeIndex + 1));
  $('replay').addEventListener('click', replay);
  $('random').addEventListener('click', () => setEffect(effects[Math.floor(Math.random() * effects.length)].id));
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
