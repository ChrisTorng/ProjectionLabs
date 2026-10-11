export const sceneCSS = `
@property --sweep{syntax:'<angle>';inherits:false;initial-value:0deg}
.scene{position:relative;isolation:isolate;width:100%;height:100%;overflow:hidden;background:var(--canvas,#0e1825);color:#fff;display:grid;place-items:center;container-type:inline-size;perspective:850px}
.scene *, .scene *::before, .scene *::after{box-sizing:border-box}
.backdrop,.ornament{position:absolute;inset:0;z-index:-2;pointer-events:none}
.backdrop{background:radial-gradient(ellipse at 22% 10%,color-mix(in srgb,var(--accent,#76e4df) 15%,transparent),transparent 65%)}
.ornament{z-index:-1;display:none}
.content{width:90%;text-align:center;position:relative;transform-style:preserve-3d;line-height:1.4}
.words{position:relative;display:block;font-family:system-ui,'Noto Sans TC',sans-serif;font-size:clamp(1rem,var(--font-size,6cqw),8cqw);font-weight:750;line-height:1.55;overflow-wrap:anywhere;white-space:pre-wrap;text-wrap:balance;letter-spacing:.025em;transform-origin:center;backface-visibility:hidden}
.char{display:inline-block;white-space:pre;transform-origin:50% 75%;position:relative}
.secondary{font:500 clamp(.875rem,2.3cqw,1.5rem)/1.6 system-ui;margin:1rem 0 0;color:#c1cbd7;letter-spacing:.09em;text-wrap:balance}
.scene.compact .words{font-size:7cqw}.scene.compact .secondary{font-size:4cqw;margin:.5rem 0 0}
.scene .particle{position:absolute;width:var(--size,8px);height:var(--size,8px);left:var(--x,50%);top:var(--y,50%);background:var(--accent,#76e4df);border-radius:50%;opacity:.5}
.scene .slide-layer{position:absolute;inset:0;display:grid;place-items:center;background:var(--canvas,#0e1825)}
.scene .slide-layer.old{background:#18283a;z-index:1}.scene .slide-layer.new{z-index:2}
.scene .slide-layer .content{width:85%}.scene .slide-layer .slide-tag{font:500 2.2cqw/1.6 system-ui;color:var(--accent);letter-spacing:.12em;margin-bottom:1rem}
.scene.static *,.scene.static *::before,.scene.static *::after{animation:none!important;opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important;mask-image:none!important}
.scene.static .old{display:none}
@media(prefers-reduced-motion:reduce){.scene:not(.allow-motion) *,.scene:not(.allow-motion) *::before,.scene:not(.allow-motion) *::after{animation:none!important}.scene:not(.allow-motion) .words,.scene:not(.allow-motion) .char,.scene:not(.allow-motion) .new{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important;mask-image:none!important}.scene:not(.allow-motion) .old{display:none}}
`;

export function sceneHTML(effect, text, secondary, lab, previous = '讓每個字 都有自己的光') {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const words = s => `<div class="words" data-text="${esc(s)}" aria-label="${esc(s)}">${Array.from(s).map((c, i) => `<span class="char" aria-hidden="true" style="--i:${i}">${esc(c)}</span>`).join('')}</div>`;
  const content = (s, tag = '') => `<div class="content">${tag ? `<div class="slide-tag">${tag}</div>` : ''}${words(s)}<p class="secondary">${esc(secondary)}</p></div>`;
  const body = lab === 'transitions' ? `<div class="slide-layer old">${content(previous, '01 / PREVIOUS')}</div><div class="slide-layer new">${content(text, '02 / NEXT')}</div>` : `<div class="backdrop"></div><div class="ornament">${Array.from({length:16}, (_,i) => `<i class="particle" style="--i:${i};--x:${(i*37+7)%100}%;--y:${(i*23+12)%100}%;--size:${3+i%5*2}px"></i>`).join('')}</div>${content(text)}`;
  return `<div class="scene fx-${effect.id}" data-effect="${effect.id}">${body}</div>`;
}
