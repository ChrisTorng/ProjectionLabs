export const groupA = [
  {
    "id": "corners",
    "title": "非圓形轉角",
    "year": "Chrome 139+",
    "group": [
      "visual"
    ],
    "desc": "同一張資訊卡快速比較 squircle、bevel、notch、scoop 四種邊角。",
    "why": "corner-shape 讓邊框、外框、陰影沿著轉角形狀顯示；傳統 clip-path 只有裁切內容，框線與陰影處理較麻煩。",
    "jsSave": "本來就不需要 JS；縮短 CSS 與 SVG 工作",
    "cost": "靜態幾何繪製；不適合每幀大量變形",
    "use": "歌詞標籤、提示卡、投影 UI",
    "caution": "corner-shape 不等於更低 CPU；主要改善外觀與開發複雜度。",
    "probe": [
      "corner-shape",
      "squircle"
    ],
    "links": [
      [
        "MDN corner-shape",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape"
      ]
    ],
    "html": "<div class=\"shape-row\"><div class=\"tile sq\"><b>01</b><span>SQUIRCLE</span></div><div class=\"tile bev\"><b>02</b><span>BEVEL</span></div><div class=\"tile notch\"><b>03</b><span>NOTCH</span></div><div class=\"tile scoop\"><b>04</b><span>SCOOP</span></div></div>",
    "oldCSS": ".shape-row{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}.tile{width:145px;height:155px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(160deg,#28466b,#182337);border:2px solid #62ebd0;color:#bdfbee;box-shadow:0 15px 22px #0006}.tile b{font-size:40px}.tile span{font-size:12px;letter-spacing:.1em}.sq{border-radius:25px}.bev{clip-path:polygon(16% 0,84% 0,100% 16%,100% 84%,84% 100%,16% 100%,0 84%,0 16%)}.notch{clip-path:polygon(0 0,35% 0,35% 16%,65% 16%,65% 0,100% 0,100% 100%,0 100%)}.scoop{border-radius:44% 18% 40% 14%}",
    "css": ".shape-row{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}.tile{width:145px;height:155px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(160deg,#28466b,#182337);border:2px solid #62ebd0;box-shadow:0 15px 22px #0006;border-radius:26px;color:#bdfbee}.tile b{font-size:40px}.tile span{font-size:12px;letter-spacing:.1em}.sq{corner-shape:squircle}.bev{corner-shape:bevel}.notch{corner-shape:notch}.scoop{corner-shape:scoop}"
  },
  {
    "id": "border-shape",
    "title": "真正的異形框線",
    "year": "Chrome 147+",
    "group": [
      "visual",
      "less-js"
    ],
    "desc": "不是單純 clip-path 裁切，而是讓整個異形邊框與陰影沿輪廓呈現。",
    "why": "border-shape 直接定義邊框的幾何輪廓；可減少額外 SVG、遮罩以及疊加 DOM。",
    "jsSave": "減少自製 SVG／額外 DOM；通常本就 0 JS",
    "cost": "複雜曲線與動畫可能增加 Paint",
    "use": "異形舞台標籤、科技感面板",
    "caution": "這是渲染能力與 DOM 簡化，不保證 GPU 加速。",
    "probe": [
      "border-shape",
      "polygon(0% 0%,100% 0%,100% 70%,78% 100%,0% 100%)"
    ],
    "links": [
      [
        "MDN border-shape",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-shape"
      ],
      [
        "Chrome 147",
        "https://developer.chrome.com/release-notes/147"
      ]
    ],
    "html": "<div class=\"irregular\"><span class=\"mini\">ARCHITECTURE / 2026</span><strong>突破矩形框架</strong><small>異形邊緣 · 原生描邊 · 陰影</small></div>",
    "oldCSS": ".irregular{display:flex;flex-direction:column;gap:12px;align-items:flex-start;justify-content:center;padding:40px 50px;width:70%;min-width:270px;height:235px;background:#1e3850;border:6px solid #7fffd9;clip-path:polygon(0 0,100% 0,100% 68%,79% 100%,0 100%);box-shadow:10px 12px 25px #00ffe877}.irregular strong{font-size:clamp(24px,4vw,46px)}.irregular .mini{font-size:12px;color:#97cdbd}.irregular small{color:#a7b9c9}",
    "css": ".irregular{display:flex;flex-direction:column;gap:12px;align-items:flex-start;justify-content:center;padding:40px 50px;width:70%;min-width:270px;height:235px;background:#1e3850;border:6px solid #7fffd9;border-shape:polygon(0% 0%,100% 0%,100% 68%,79% 100%,0% 100%);box-shadow:10px 12px 25px #00ffe877}.irregular strong{font-size:clamp(24px,4vw,46px)}.irregular .mini{font-size:12px;color:#97cdbd}.irregular small{color:#a7b9c9}"
  },
  {
    "id": "css-functions",
    "title": "CSS 自訂函式",
    "year": "Chrome 139+",
    "group": [
      "less-js",
      "visual"
    ],
    "desc": "一個 @function 產生可重複使用的漸層，而非到處貼上色彩計算。",
    "why": "CSS 函式直接封裝可重用的樣式邏輯。可減少 JS 產生 style 物件與手動拼接字串。",
    "jsSave": "可移除純樣式計算／組字串 JS",
    "cost": "與輸出的漸層渲染成本相近",
    "use": "佈景主題、動態樣式模板",
    "caution": "函式本身不會讓背景動畫變得可合成；仍應避免持續改 background-position。",
    "probe": [
      "background",
      "--stage-tone(#00c9b7)"
    ],
    "supportSpecial": "function",
    "links": [
      [
        "MDN @function",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@function"
      ]
    ],
    "html": "<div class=\"function-wrap\"><div class=\"f-panel a\">天空色 / 01</div><div class=\"f-panel b\">晨光色 / 02</div><div class=\"f-panel c\">紫羅蘭 / 03</div></div>",
    "oldCSS": ".function-wrap{display:flex;gap:15px;flex-wrap:wrap;justify-content:center}.f-panel{width:175px;height:180px;border-radius:22px;padding:26px;display:flex;align-items:end;font-weight:800;box-shadow:0 15px 20px #0004}.a{background:linear-gradient(150deg,#03b9c7,#4273ad)}.b{background:linear-gradient(150deg,#e4a76e,#84517c)}.c{background:linear-gradient(150deg,#9762d8,#44358f)}",
    "css": "@function --stage-tone(--first <color>, --last <color>: #4273ad) { result: linear-gradient(150deg, var(--first), var(--last)); }\n.function-wrap{display:flex;gap:15px;flex-wrap:wrap;justify-content:center}.f-panel{width:175px;height:180px;border-radius:22px;padding:26px;display:flex;align-items:end;font-weight:800;box-shadow:0 15px 20px #0004}.a{background:--stage-tone(#03b9c7)}.b{background:--stage-tone(#e4a76e,#84517c)}.c{background:--stage-tone(#9762d8,#44358f)}"
  },
  {
    "id": "gap-decor",
    "title": "Grid 間隔線",
    "year": "Chrome / Edge 149+",
    "group": [
      "visual",
      "less-js"
    ],
    "desc": "不用塞入空格 DOM，也能畫出完整的 3×3 舞台分割線。",
    "why": "CSS gap decorations 原生在 Grid/Flex 的間隔描繪線條，減少虛設節點與複雜相鄰選取器。",
    "jsSave": "減少 DOM 建置；不需 JS 補空格",
    "cost": "較少節點，但仍需繪製分隔線",
    "use": "多視窗預覽、九宮格切換",
    "caution": "DOM 變少有助於大型畫面維護，少量 Grid 不一定能量測出效能差異。",
    "probe": [
      "rule",
      "1px solid red"
    ],
    "links": [
      [
        "Chromium Gap decorations",
        "https://developer.chrome.com/blog/gap-decorations-stable"
      ]
    ],
    "html": "<div class=\"nine-grid\"><div class=\"nine-item\">A</div><div class=\"nine-item\">B</div><div class=\"nine-item\">C</div><div class=\"nine-item\">D</div></div>",
    "oldHTML": "<div class=\"nine-grid old-nine\"><div class=\"nine-item\">A</div><div class=\"nine-item\">B</div><div class=\"nine-item\">C</div><div class=\"nine-item\">D</div><div></div><div></div><div></div><div></div><div></div></div>",
    "oldCSS": ".nine-grid{width:min(72%,450px);aspect-ratio:1.3;display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);gap:2px;padding:2px;background:#66dbd5;border:2px solid #66dbd5}.nine-grid>div{background:#10283e;display:grid;place-items:center;color:#cafdf1;font-size:35px;font-weight:800}.nine-grid .nine-item{background:#245474}",
    "css": ".nine-grid{width:min(72%,450px);aspect-ratio:1.3;display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);gap:8px;border:2px solid #66dbd5;rule:2px solid #66dbd5}.nine-grid .nine-item{background:#245474;display:grid;place-items:center;color:#cafdf1;font-size:35px;font-weight:800}"
  },
  {
    "id": "anchor",
    "title": "原生錨點定位",
    "year": "Chrome 125+ / Edge",
    "group": [
      "less-js"
    ],
    "desc": "提示框依附按鈕定位，視窗縮放時由 CSS 處理位置。",
    "why": "anchor-name／position-anchor／anchor() 取代反覆量測 getBoundingClientRect 的手寫定位。",
    "jsSave": "定位與 ResizeObserver／scroll 計算 → CSS",
    "cost": "定位涉及版面配置；不宜當作動畫路徑",
    "use": "控制面板提示、浮動字幕標籤",
    "caution": "可點擊中間按鈕檢查；現代版的錨點定位不意味著每幀動畫 GPU 加速。",
    "probe": [
      "position-anchor",
      "--control"
    ],
    "links": [
      [
        "MDN CSS anchor positioning",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning"
      ]
    ],
    "html": "<div class=\"anchor-scene\"><button class=\"anchor-target\">祢的光 · 設定提示</button><div class=\"anchored-bubble\">原生錨點定位<br><small>自動與按鈕對齊</small></div></div>",
    "oldCSS": ".anchor-scene{width:100%;height:100%;display:grid;place-items:center;position:relative}.anchor-target{padding:20px 27px;background:#65edcc;border:0;border-radius:12px;font-size:20px;font-weight:800;color:#122d39}.anchored-bubble{position:absolute;background:#1d4561;border:1px solid #80e5e4;color:#e7ffff;border-radius:12px;padding:15px 23px;text-align:center;min-width:190px;box-shadow:0 18px 35px #0005}.anchored-bubble small{color:#9bbbc8}",
    "css": ".anchor-scene{width:100%;height:100%;display:grid;place-items:center;position:relative}.anchor-target{anchor-name:--control;padding:20px 27px;background:#65edcc;border:0;border-radius:12px;font-size:20px;font-weight:800;color:#122d39}.anchored-bubble{position:absolute;position-anchor:--control;top:anchor(bottom);left:anchor(center);translate:-50% 16px;position-try-fallbacks:flip-block;background:#1d4561;border:1px solid #80e5e4;color:#e7ffff;border-radius:12px;padding:15px 23px;text-align:center;min-width:190px;box-shadow:0 18px 35px #0005}.anchored-bubble small{color:#9bbbc8}",
    "oldJS": "const target=document.querySelector(\".anchor-target\"),bubble=document.querySelector(\".anchored-bubble\"),root=document.querySelector(\".anchor-scene\");function sync(){const a=target.getBoundingClientRect(),b=root.getBoundingClientRect();bubble.style.left=a.left-b.left+a.width/2-bubble.offsetWidth/2+\"px\";bubble.style.top=a.bottom-b.top+16+\"px\"}addEventListener(\"resize\",sync);sync();"
  },
  {
    "id": "scroll-trigger",
    "title": "捲到才觸發動畫",
    "year": "Chrome 146+ / Edge",
    "group": [
      "less-js",
      "smooth"
    ],
    "desc": "在舞台內捲動，元素進入視野才播放一次 0.8 秒的動態。",
    "why": "timeline-trigger 與 animation-trigger 用宣告式規則取代 IntersectionObserver 與 JS class 控制；事件可交由瀏覽器內部管理。",
    "jsSave": "移除 IntersectionObserver callback／狀態 class",
    "cost": "transform + opacity 動畫適合合成；仍依引擎判斷",
    "use": "節目表捲動、資訊卡進場",
    "caution": "不同於原圖鑑的 scroll-driven：這次是一般時間軸動畫『觸發』，不會隨捲動逆向拖曳進度。",
    "probe": [
      "animation-trigger",
      "--arrival play-once"
    ],
    "links": [
      [
        "Chrome 146",
        "https://developer.chrome.com/release-notes/146"
      ],
      [
        "MDN scroll-triggered animations",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animation_triggers/Using_scroll-triggered_animations"
      ]
    ],
    "html": "<div class=\"inner-scroll\"><div class=\"scroll-lead\">↓ 在這個框內向下捲動</div><div class=\"trigger-card\">每一次相遇<br><span>都能重新開始</span></div><div class=\"scroll-end\">已抵達底部 · 向上再試</div></div>",
    "oldCSS": ".inner-scroll{height:100%;width:100%;overflow-y:auto;overscroll-behavior:contain;text-align:center;scrollbar-color:#648da2 transparent}.scroll-lead{height:95%;display:grid;place-items:center;color:#96b9c6;font-size:19px}.trigger-card{margin:0 auto;width:60%;padding:36px 18px;background:linear-gradient(120deg,#216073,#392f61);border:1px solid #7fe4c6;border-radius:22px;font-size:38px;font-weight:800;opacity:0;transform:translateY(48px)}.trigger-card span{font-size:20px;color:#92f5da}.trigger-card.played{animation:arrive .8s ease-out forwards}.scroll-end{height:90%;display:grid;place-items:center;color:#98b4c4}@keyframes arrive{to{opacity:1;transform:translateY(0)}}",
    "css": ".inner-scroll{height:100%;width:100%;overflow-y:auto;overscroll-behavior:contain;text-align:center;scrollbar-color:#648da2 transparent}.scroll-lead{height:95%;display:grid;place-items:center;color:#96b9c6;font-size:19px}.trigger-card{margin:0 auto;width:60%;padding:36px 18px;background:linear-gradient(120deg,#216073,#392f61);border:1px solid #7fe4c6;border-radius:22px;font-size:38px;font-weight:800;animation:arrive .8s ease-out both;animation-trigger:--arrival play-once;timeline-trigger:--arrival view() contain}.trigger-card span{font-size:20px;color:#92f5da}.scroll-end{height:90%;display:grid;place-items:center;color:#98b4c4}@keyframes arrive{from{opacity:0;transform:translateY(48px)}to{opacity:1;transform:translateY(0)}}",
    "oldJS": "const card=document.querySelector(\".trigger-card\");const io=new IntersectionObserver(entries=>{if(entries[0]?.isIntersecting){card.classList.add(\"played\");io.disconnect()}},{root:document.querySelector(\".inner-scroll\"),threshold:1});io.observe(card);"
  },
  {
    "id": "scroll-state",
    "title": "黏附狀態直接套色",
    "year": "Chrome 133+ / Edge",
    "group": [
      "less-js"
    ],
    "desc": "向下捲動，頂端黏附的標頭自動切換亮色，不需要 scroll 事件。",
    "why": "scroll-state container query 直接判斷 sticky 是否 stuck。免用 scroll 監聽及座標推論。",
    "jsSave": "移除 scroll handler／getBoundingClientRect",
    "cost": "版面狀態依瀏覽器更新，非逐格 JS",
    "use": "長篇資訊、曲目清單標頭",
    "caution": "CSS container query 樣式作用於子元素，不是容器元素本身。",
    "probe": [
      "container-type",
      "scroll-state"
    ],
    "links": [
      [
        "MDN scroll-state queries",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_conditional_rules/Container_scroll-state_queries"
      ]
    ],
    "html": "<div class=\"sticky-scroll\"><div class=\"sticky-intro\">往下捲動<br>↓</div><header class=\"sticky-head\"><div class=\"sticky-face\">目前段落：詩歌清單<br><small>STICKY STATE INDICATOR</small></div></header><div class=\"sticky-content\">01　敬拜開始<br><br>02　唱出盼望<br><br>03　喜樂泉源<br><br>04　信實不改變<br><br>05　願祢掌權</div></div>",
    "oldCSS": ".sticky-scroll{height:100%;overflow-y:auto;text-align:center}.sticky-intro{height:48%;display:grid;place-items:center;color:#b0c2cb;font-size:25px}.sticky-head{position:sticky;top:0;padding:10px 20px;z-index:2}.sticky-face{border:1px solid #366082;background:#172e42;padding:17px;border-radius:13px;transition:background .2s,color .2s;font-size:19px;font-weight:800}.sticky-face small{font-size:10px;letter-spacing:.2em}.sticky-head.stuck .sticky-face{background:#7be7cc;color:#122c38}.sticky-content{padding:20px 0 230px;color:#b0cede;font-size:19px;line-height:1.4}",
    "css": ".sticky-scroll{height:100%;overflow-y:auto;text-align:center}.sticky-intro{height:48%;display:grid;place-items:center;color:#b0c2cb;font-size:25px}.sticky-head{position:sticky;top:0;padding:10px 20px;z-index:2;container-type:scroll-state}.sticky-face{border:1px solid #366082;background:#172e42;padding:17px;border-radius:13px;transition:background .2s,color .2s;font-size:19px;font-weight:800}.sticky-face small{font-size:10px;letter-spacing:.2em}@container scroll-state(stuck:top){.sticky-face{background:#7be7cc;color:#122c38}}.sticky-content{padding:20px 0 230px;color:#b0cede;font-size:19px;line-height:1.4}",
    "oldJS": "const panel=document.querySelector(\".sticky-scroll\"),head=document.querySelector(\".sticky-head\");function update(){head.classList.toggle(\"stuck\",panel.scrollTop>=panel.clientHeight*.48)}panel.addEventListener(\"scroll\",update,{passive:true});"
  },
  {
    "id": "sibling-index",
    "title": "免 JS 的逐字延遲",
    "year": "Chrome 138+ / Edge",
    "group": [
      "less-js",
      "smooth"
    ],
    "desc": "使用 sibling-index() 為七字自動分配動畫 delay，新增文字節點不必改索引。",
    "why": "從 DOM 位置計算延遲，省去 JS 遍歷與每個字的 inline style，適合大量規則性動畫。",
    "jsSave": "不再 querySelectorAll + 寫入 --i / delay",
    "cost": "transform + opacity 合成友善；每個字仍是動畫節點",
    "use": "逐字歌詞、進場接力",
    "caution": "相比原圖鑑的 JS 逐字 stagger，這例的不同處是 CSS 自己依 sibling-index 計算順序。",
    "probe": [
      "animation-delay",
      "calc(sibling-index() * 100ms)"
    ],
    "links": [
      [
        "MDN sibling-index()",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/sibling-index"
      ]
    ],
    "html": "<div class=\"lyric-letters\"><span>祢</span><span>的</span><span>光</span><span>照</span><span>亮</span><span>我</span><span>心</span></div>",
    "oldCSS": ".lyric-letters{display:flex;gap:.05em;font-weight:900;font-size:clamp(32px,6.3vw,82px);white-space:nowrap}.lyric-letters span{animation:letterIn 2.7s ease-in-out infinite both;animation-delay:calc(var(--i,0) * 110ms);color:#cafdec;text-shadow:0 0 17px #4affda40}@keyframes letterIn{0%,12%{opacity:.18;transform:translateY(30px)}45%,80%{opacity:1;transform:translateY(0)}100%{opacity:.18;transform:translateY(30px)}}",
    "css": ".lyric-letters{display:flex;gap:.05em;font-weight:900;font-size:clamp(32px,6.3vw,82px);white-space:nowrap}.lyric-letters span{animation:letterIn 2.7s ease-in-out infinite both;animation-delay:calc((sibling-index() - 1) * 110ms);color:#cafdec;text-shadow:0 0 17px #4affda40}@keyframes letterIn{0%,12%{opacity:.18;transform:translateY(30px)}45%,80%{opacity:1;transform:translateY(0)}100%{opacity:.18;transform:translateY(30px)}}",
    "oldJS": "document.querySelectorAll(\".lyric-letters span\").forEach((el,i)=>el.style.setProperty(\"--i\",i));"
  }
];
