export const labs = [
  { id: 'lyrics', title: '歌詞文字效果', subtitle: '從輕柔呼吸，到霓虹、逐字波浪與故障字體', color: '#76e4df', icon: 'Aa', module: 'lyrics.js', description: '比較整句與逐字動畫、文字材質、遮罩揭露及立體變形，直接套用自己的歌詞。' },
  { id: 'lyrics-beat-sync', title: '逐字節拍同步', subtitle: '精準逐字字幕、節拍跳球與風格組合', color: '#84f0da', icon: '♪', description: '28 種獨立可疊加效果、11 組預設、長音逐拍拋物線跳球。' },
  { id: 'transitions', title: '投影片轉場效果', subtitle: '淡入、推進、百葉窗、翻頁與空間切換', color: '#ffc078', icon: '▱', module: 'transitions.js', description: '以相鄰投影片實際切換，觀察進場與退場如何搭配。適合歌詞、簡報與投影畫面。' },
  { id: 'backgrounds', title: '動態背景效果', subtitle: '安靜的光場，到流動色彩與幾何舞台', color: '#beabff', icon: '◌', module: 'backgrounds.js', description: '用純 CSS 漸層、遮罩與幾何圖樣建立背景，保持歌詞在前景清楚可讀。' },
  { id: 'composer', title: '效果組合室', subtitle: '七層效果、三頁接力與完整播放器匯出', color: '#7de4cd' },
  { id: 'html-in-canvas', title: 'HTML-in-Canvas 原生實驗室', subtitle: '7 個場景：Canvas 2D / WebGL 與原生 DOM 混合渲染', color: '#99caff' },
  { id: 'new-css', title: '新世代 CSS 技術實驗室', subtitle: '17 個實例：最新 CSS、JS 簡化與效能比較', color: '#80f4cf' },
  { id: 'kinetic-slides', title: '動態編排與轉場', subtitle: '12 種卡片、膠卷、景深與文字編排的完整投影片動態', color: '#8eb4ff', description: '多層畫面與文字構圖；16:9 即時比較、轉場參數調整及離線 HTML 匯出。' },
  { id: 'motion-atlas', title: 'Web Motion Atlas', subtitle: '48 種單效果圖鑑、時間軸與獨立 HTML', color: '#8baaff' },
  { id: 'music-motion', title: '音樂動態', subtitle: '聲音、頻段與節奏驅動的圖層組合', color: '#ffc078' },
  { id: 'ink-song', title: '詩歌手繪', subtitle: '隨拍逐筆繪製、累積與擦除', color: '#b9cd9e' },
];

export function effect(id, title, category, description, technique, level, css, support = '') {
  return { id, title, category, description, technique, level, css, support };
}

export function motion(id, title, category, description, technique, level, frames, declarations = '', options = {}) {
  const target = options.target || '.words';
  const timing = options.timing || 'var(--easing, ease-in-out)';
  const delay = options.stagger ? 'animation-delay:calc(var(--i, 0) * var(--stagger, .065s));' : '';
  const extras = options.extras || '';
  return effect(id, title, category, description, technique, level,
    `.fx-${id} ${target}{${declarations}animation:fx-${id} var(--duration, 4s) ${timing} infinite both;${delay}}\n@keyframes fx-${id}{${frames}}\n${extras}`, options.support || '');
}
