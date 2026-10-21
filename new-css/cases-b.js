export const groupB = [
  {
    "id": "text-fit",
    "title": "大字自動填滿寬度",
    "year": "Chrome 150+",
    "group": [
      "less-js",
      "visual"
    ],
    "desc": "字型大小由 CSS 依容器空間調整，無須每次換句都量字寬。",
    "why": "text-fit: grow 可由瀏覽器自動依容器寬度放大單行文字，避免在 ResizeObserver 或換字時反覆計算字寬。",
    "jsSave": "移除 Canvas measureText／ResizeObserver",
    "cost": "字級影響文字版面；變化時可能 Layout",
    "use": "大字歌詞、標題滿版",
    "caution": "對於一秒幾十次的字級連續動畫，仍應優先 transform:scale；這裡用途是換句或尺寸改變。",
    "probe": [
      "text-fit",
      "grow"
    ],
    "links": [
      [
        "Chrome 150",
        "https://developer.chrome.com/release-notes/150"
      ],
      [
        "MDN text-fit",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-fit"
      ]
    ],
    "html": "<div class=\"fit-demo\"><span class=\"caption\">RESPONSIVE / NO JS MEASUREMENT</span><div class=\"fit-line\" id=\"fitLine\">祢的信實永不改變</div><p>調整瀏覽器寬度，觀察文字維持滿版</p></div>",
    "oldCSS": ".fit-demo{width:80%;text-align:center}.fit-demo .caption{font-size:11px;letter-spacing:.2em;color:#8dc7c3}.fit-line{width:100%;font-size:24px;line-height:1.35;white-space:nowrap;font-weight:900;color:#f6f7ff;border-top:1px solid #295571;border-bottom:1px solid #295571;margin:22px auto;padding:15px 0}.fit-demo p{font-size:12px;color:#8aa3b1}",
    "css": ".fit-demo{width:80%;text-align:center}.fit-demo .caption{font-size:11px;letter-spacing:.2em;color:#8dc7c3}.fit-line{width:100%;font-size:24px;text-fit:grow;line-height:1.35;white-space:nowrap;font-weight:900;color:#f6f7ff;border-top:1px solid #295571;border-bottom:1px solid #295571;margin:22px auto;padding:15px 0}.fit-demo p{font-size:12px;color:#8aa3b1}",
    "oldJS": "const line=document.querySelector(\"#fitLine\");function fit(){const max=line.clientWidth;let size=24;line.style.fontSize=size+\"px\";while(size<120 && line.scrollWidth<=max){line.style.fontSize=(++size)+\"px\"}line.style.fontSize=(size-1)+\"px\"}new ResizeObserver(fit).observe(line.parentElement);fit();"
  },
  {
    "id": "underline-inset",
    "title": "原生裝飾線縮排",
    "year": "Chrome 154+",
    "group": [
      "visual",
      "less-js"
    ],
    "desc": "原生文字底線能縮短起迄，不需額外的 ::after 繪製線段。",
    "why": "text-decoration-inset 避免額外偽元素與手算底線尺寸，文字換行和無障礙語意更自然。",
    "jsSave": "縮短 CSS；通常不涉及 JS",
    "cost": "文本裝飾 Paint，非 GPU 動畫優化",
    "use": "歌詞關鍵字、講道重點",
    "caution": "不應把靜態底線誤標成 CPU 加速技巧。",
    "probe": [
      "text-decoration-inset",
      "20px"
    ],
    "links": [
      [
        "Chrome 154",
        "https://developer.chrome.com/release-notes/154"
      ],
      [
        "MDN text-decoration-inset",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration-inset"
      ]
    ],
    "html": "<div class=\"deco-group\"><span class=\"minor\">NATIVE TEXT DECORATION</span><div class=\"decorated\">祢的應許不改變</div><span class=\"minor\">INSET / 0.5em BOTH SIDES</span></div>",
    "oldCSS": ".deco-group{text-align:center}.minor{color:#81b2b7;letter-spacing:.22em;font-size:11px}.decorated{position:relative;font-size:clamp(27px,5vw,64px);font-weight:900;padding:10px 4px 22px;color:#f7faff;margin:30px 0}.decorated:after{content:\"\";position:absolute;height:5px;left:.5em;right:.5em;bottom:7px;background:#6effd1;border-radius:5px}",
    "css": ".deco-group{text-align:center}.minor{color:#81b2b7;letter-spacing:.22em;font-size:11px}.decorated{font-size:clamp(27px,5vw,64px);font-weight:900;padding:10px 4px 22px;color:#f7faff;margin:30px 0;text-decoration:underline 5px #6effd1;text-underline-offset:16px;text-decoration-inset:.5em}"
  },
  {
    "id": "contrast-color",
    "title": "智慧文字對比",
    "year": "Chrome 147+",
    "group": [
      "visual",
      "less-js"
    ],
    "desc": "不同亮度的色彩卡，文字自動選用黑色或白色。",
    "why": "contrast-color() 依背景自動選擇黑或白字，避免 JS 逐次讀取 RGB 計算亮度，適合動態主題色。",
    "jsSave": "移除對比色計算函式與 inline style",
    "cost": "靜態色彩決策；幾乎無動畫負擔",
    "use": "臨時字幕標籤、色彩分類",
    "caution": "僅在黑／白間選擇，不是完整的 WCAG 對比驗證器；仍需測試設計色彩。",
    "probe": [
      "color",
      "contrast-color(#ffe27b)"
    ],
    "links": [
      [
        "Chrome 147",
        "https://developer.chrome.com/release-notes/147"
      ]
    ],
    "html": "<div class=\"contrast-row\"><div class=\"contrast one\">SUN<br>LIGHT</div><div class=\"contrast two\">OCEAN<br>BLUE</div><div class=\"contrast three\">PURPLE<br>LIGHT</div><div class=\"contrast four\">DEEP<br>NIGHT</div></div>",
    "oldCSS": ".contrast-row{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}.contrast{width:138px;height:165px;display:grid;place-items:center;text-align:center;font-size:19px;font-weight:900;letter-spacing:.05em;border-radius:17px}.one{background:#ffe37f}.two{background:#106bac}.three{background:#c0a1e8}.four{background:#202348}",
    "css": ".contrast-row{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}.contrast{width:138px;height:165px;display:grid;place-items:center;text-align:center;font-size:19px;font-weight:900;letter-spacing:.05em;border-radius:17px}.one{background:#ffe37f;color:contrast-color(#ffe37f)}.two{background:#106bac;color:contrast-color(#106bac)}.three{background:#c0a1e8;color:contrast-color(#c0a1e8)}.four{background:#202348;color:contrast-color(#202348)}",
    "oldJS": "function textColor(hex){const rgb=hex.match(/[0-9a-f]{2}/gi).map(v=>parseInt(v,16)/255);const y=rgb.map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return y[0]*.2126+y[1]*.7152+y[2]*.0722>.179?\"#101620\":\"white\"}document.querySelectorAll(\".contrast\").forEach((n,i)=>{const colors=[\"#ffe37f\",\"#106bac\",\"#c0a1e8\",\"#202348\"];n.style.color=textColor(colors[i])});"
  },
  {
    "id": "starting-style",
    "title": "新增內容也能 Transition",
    "year": "Chrome 117+ / Edge",
    "group": [
      "less-js",
      "smooth"
    ],
    "desc": "點擊新增提示卡，無須先插入再下一影格補上 class。",
    "why": "@starting-style 可定義元素首次顯示的起始值，把兩階段 JS 動畫初始化交給 CSS。",
    "jsSave": "移除雙層 requestAnimationFrame／動畫 class",
    "cost": "opacity + transform 通常合成友善",
    "use": "字幕提示、臨時經文卡",
    "caution": "建立 DOM 本身仍需要 JS；僅動畫初始化簡化。",
    "probe": [
      "transition-behavior",
      "allow-discrete"
    ],
    "links": [
      [
        "MDN @starting-style",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style"
      ]
    ],
    "html": "<div class=\"entry-demo\"><div class=\"entry-anchor\"><button id=\"addToast\">＋ 顯示通知</button></div><div class=\"entry-box\" id=\"toastBox\"></div></div>",
    "oldCSS": ".entry-demo{height:100%;width:100%;display:grid;place-items:center}.entry-anchor button{padding:13px 21px;border:1px solid #76f4d4;border-radius:10px;background:#173f4a;color:#baf7ed;font-size:18px;cursor:pointer}.entry-box{position:absolute;bottom:13%;left:50%;transform:translate(-50%,35px);opacity:0;transition:opacity .55s,transform .55s}.entry-toast{white-space:nowrap;padding:14px 20px;border-radius:11px;background:#e1fff5;color:#19333b;font-weight:800;font-size:19px}.entry-box.visible{transform:translate(-50%,0);opacity:1}",
    "css": ".entry-demo{height:100%;width:100%;display:grid;place-items:center}.entry-anchor button{padding:13px 21px;border:1px solid #76f4d4;border-radius:10px;background:#173f4a;color:#baf7ed;font-size:18px;cursor:pointer}.entry-box{position:absolute;bottom:13%;left:50%;translate:-50% 0}.entry-toast{white-space:nowrap;padding:14px 20px;border-radius:11px;background:#e1fff5;color:#19333b;font-weight:800;font-size:19px;opacity:1;transform:translateY(0);transition:opacity .55s,transform .55s;@starting-style{opacity:0;transform:translateY(35px)}}",
    "oldJS": "document.querySelector(\"#addToast\").addEventListener(\"click\",()=>{const box=document.querySelector(\"#toastBox\");box.classList.remove(\"visible\");box.replaceChildren();const note=document.createElement(\"div\");note.className=\"entry-toast\";note.textContent=\"通知已顯示｜以 CSS 漸現\";box.append(note);requestAnimationFrame(()=>requestAnimationFrame(()=>box.classList.add(\"visible\")))});",
    "js": "document.querySelector(\"#addToast\").addEventListener(\"click\",()=>{document.querySelector(\"#toastBox\").innerHTML=\"<div class=\\\"entry-toast\\\">通知已顯示｜以 CSS 漸現</div>\"})"
  },
  {
    "id": "native-popover",
    "title": "原生 Popover 進退場",
    "year": "Chrome 117+ / Edge",
    "group": [
      "visual",
      "less-js"
    ],
    "desc": "點擊按鈕顯示與關閉提示，交給瀏覽器處理 top layer、ESC 與焦點。",
    "why": "Popover API 加上 @starting-style 與 allow-discrete 進退場，取代一部分顯示狀態、ESC 與收起事件的 JS。",
    "jsSave": "顯示開關 0 行 JS（HTML popovertarget）",
    "cost": "opacity／transform 動畫；top layer 仍需合成／繪圖",
    "use": "投影操作選單、曲目資訊",
    "caution": "Popover 是 HTML 功能與新 CSS 的組合，不是單一 CSS 功能。",
    "probe": [
      "transition-behavior",
      "allow-discrete"
    ],
    "links": [
      [
        "MDN popover",
        "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API"
      ],
      [
        "MDN @starting-style",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style"
      ]
    ],
    "html": "<div class=\"pop-demo\"><button class=\"pop-button\" id=\"popBtn\" popovertarget=\"popPanel\">開啟浮動選單 ⤴</button><div popover id=\"popPanel\" class=\"pop-menu\"><strong>投影選單</strong><p>下一首歌 · 空白畫面 · 全螢幕</p><button popovertarget=\"popPanel\" popovertargetaction=\"hide\">關閉 ✕</button></div></div>",
    "oldHTML": "<div class=\"pop-demo\"><button class=\"pop-button\" id=\"popBtn\">開啟浮動選單 ⤴</button><div id=\"popPanel\" class=\"pop-menu\" hidden><strong>投影選單</strong><p>下一首歌 · 空白畫面 · 全螢幕</p><button id=\"popClose\">關閉 ✕</button></div></div>",
    "oldCSS": ".pop-demo{display:grid;place-items:center;width:100%;height:100%}.pop-button,.pop-menu button{border:1px solid #72efcf;background:#20495a;color:#e0fff7;border-radius:10px;padding:14px 24px;cursor:pointer}.pop-menu{position:absolute;inset:0;margin:auto;width:max-content;max-width:80%;height:max-content;background:#28435a;color:#eafbf8;border:1px solid #93ffe2;border-radius:18px;padding:25px 33px;box-shadow:0 15px 90px #000b;text-align:center}.pop-menu[hidden]{display:none}.pop-menu strong{font-size:24px}.pop-menu p{font-size:14px;color:#acc9ce}",
    "css": ".pop-demo{display:grid;place-items:center;width:100%;height:100%}.pop-button,.pop-menu button{border:1px solid #72efcf;background:#20495a;color:#e0fff7;border-radius:10px;padding:14px 24px;cursor:pointer}.pop-menu{inset:0;margin:auto;width:max-content;max-width:80%;height:max-content;background:#28435a;color:#eafbf8;border:1px solid #93ffe2;border-radius:18px;padding:25px 33px;box-shadow:0 15px 90px #000b;text-align:center;opacity:0;transform:scale(.88);transition:opacity .35s,transform .35s,overlay .35s allow-discrete,display .35s allow-discrete}.pop-menu:popover-open{opacity:1;transform:scale(1)}@starting-style{.pop-menu:popover-open{opacity:0;transform:scale(.88)}}.pop-menu strong{font-size:24px}.pop-menu p{font-size:14px;color:#acc9ce}",
    "oldJS": "const b=document.querySelector(\"#popBtn\"),p=document.querySelector(\"#popPanel\");b.addEventListener(\"click\",()=>p.hidden=false);document.querySelector(\"#popClose\").addEventListener(\"click\",()=>p.hidden=true);addEventListener(\"keydown\",e=>{if(e.key===\"Escape\")p.hidden=true});"
  },
  {
    "id": "view-transition",
    "title": "View Transition 元素變形",
    "year": "Chrome 111+ / Edge",
    "group": [
      "less-js",
      "smooth"
    ],
    "desc": "點擊卡片在小卡／大型聚焦之間切換，由瀏覽器處理畫面快照銜接。",
    "why": "View Transition API 讓瀏覽器協調新舊渲染快照，可取代大量手算 FLIP 位置的 JS，但仍需一個 DOM 更新回呼。",
    "jsSave": "免手寫 FLIP 座標插值／逐影格 JS",
    "cost": "快照圖層可能耗 GPU 記憶體；非萬用 CPU 最佳化",
    "use": "詩歌選曲卡 → 投影主畫面",
    "caution": "此項是 CSS 加上 document.startViewTransition()，不是零 JavaScript。",
    "probe": [
      "view-transition-name",
      "stage-card"
    ],
    "links": [
      [
        "Chrome View Transitions",
        "https://developer.chrome.com/blog/view-transitions-in-2025"
      ],
      [
        "MDN View Transition API",
        "https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API"
      ]
    ],
    "html": "<div class=\"vt-wrap\"><button id=\"vtCard\" class=\"vt-card\"><span class=\"vt-icon\">✦</span><strong>祢的光照亮我心</strong><small>點擊切換主投影 ↗</small></button></div>",
    "oldCSS": ".vt-wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:center}.vt-card{background:linear-gradient(140deg,#1f5566,#313f75);border:2px solid #68f1cf;border-radius:22px;width:270px;height:180px;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;cursor:pointer;transition:width .6s,height .6s,background .6s}.vt-card.expanded{width:80%;height:72%;background:linear-gradient(140deg,#163653,#5d468a)}.vt-card strong{font-size:clamp(16px,2vw,30px)}.vt-card small{color:#9bd7d5}.vt-icon{font-size:32px;color:#96efdd}",
    "css": ".vt-wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:center}.vt-card{view-transition-name:stage-card;background:linear-gradient(140deg,#1f5566,#313f75);border:2px solid #68f1cf;border-radius:22px;width:270px;height:180px;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;cursor:pointer}.vt-card.expanded{width:80%;height:72%;background:linear-gradient(140deg,#163653,#5d468a)}.vt-card strong{font-size:clamp(16px,2vw,30px)}.vt-card small{color:#9bd7d5}.vt-icon{font-size:32px;color:#96efdd}::view-transition-old(stage-card),::view-transition-new(stage-card){animation-duration:.58s;animation-timing-function:cubic-bezier(.2,.8,.2,1)}",
    "oldJS": "const card=document.querySelector(\"#vtCard\");card.addEventListener(\"click\",()=>card.classList.toggle(\"expanded\"));",
    "js": "const card=document.querySelector(\"#vtCard\");card.addEventListener(\"click\",()=>{const update=()=>card.classList.toggle(\"expanded\");if(document.startViewTransition)document.startViewTransition(update);else update()});"
  },
  {
    "id": "content-visibility",
    "title": "離屏節點跳過渲染",
    "year": "Chrome 85+ / Edge",
    "group": [
      "smooth"
    ],
    "desc": "捲動 80 個卡片，觀察未進視野區域是否能跳過部分渲染作業。",
    "why": "content-visibility: auto 搭配 contain-intrinsic-size，讓瀏覽器避免處理部分離屏節點的 Layout/Paint，改善長頁面的初始成本。",
    "jsSave": "無需複雜虛擬捲動即可做初步優化",
    "cost": "降低離屏渲染工作，不代表動畫變快",
    "use": "大量歌詞／效果卡片預覽列表",
    "caution": "這是 2020 年已推出、但原實驗室未專門示範的效能技巧，並非 2026 新屬性；不可取代真正的大量資料虛擬列表。",
    "probe": [
      "content-visibility",
      "auto"
    ],
    "links": [
      [
        "MDN content-visibility",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility"
      ],
      [
        "web.dev content-visibility",
        "https://web.dev/articles/content-visibility"
      ]
    ],
    "html": "<div class=\"cv-wrap\"><p>↓ 在此捲動 80 張卡片</p><div id=\"cvItems\"></div></div>",
    "oldCSS": ".cv-wrap{height:100%;width:78%;max-width:620px;overflow-y:auto;text-align:center;padding:8px 15px}.cv-wrap>p{color:#afc9da}.cv-item{height:78px;margin:10px;border-radius:12px;background:linear-gradient(120deg,#1b4156,#27365d);border:1px solid #486c84;display:flex;align-items:center;justify-content:space-around}.cv-item b{font-size:25px;color:#aef4e7}.cv-item i{display:block;width:70px;height:20px;background:linear-gradient(90deg,#7bf1cc,#777dec);border-radius:15px}",
    "css": ".cv-wrap{height:100%;width:78%;max-width:620px;overflow-y:auto;text-align:center;padding:8px 15px}.cv-wrap>p{color:#afc9da}.cv-item{height:78px;margin:10px;border-radius:12px;background:linear-gradient(120deg,#1b4156,#27365d);border:1px solid #486c84;display:flex;align-items:center;justify-content:space-around;content-visibility:auto;contain-intrinsic-size:auto 78px}.cv-item b{font-size:25px;color:#aef4e7}.cv-item i{display:block;width:70px;height:20px;background:linear-gradient(90deg,#7bf1cc,#777dec);border-radius:15px}",
    "js": "const root=document.querySelector(\"#cvItems\");root.innerHTML=Array.from({length:80},(_,i)=>`<div class=\"cv-item\"><b>第 ${String(i+1).padStart(2,\"0\")} 段</b><i></i><span>離屏渲染</span></div>`).join(\"\");"
  },
  {
    "id": "compositor",
    "title": "CSS 合成動畫 vs JS 改座標",
    "year": "現代 Chromium 長期支援",
    "group": [
      "less-js",
      "smooth"
    ],
    "desc": "比較傳統每影格修改 left 與 CSS transform 動畫。可調整物件量做壓力測試。",
    "why": "讓時間軸由 CSS 管理，使用 transform/opacity，比 JS rAF 每幀寫 left 更有機會減少主執行緒 Layout/Paint。",
    "jsSave": "每影格 JS DOM 寫入 → 0",
    "cost": "transform/opacity 通常可合成；高物件量仍耗 GPU／記憶體",
    "use": "發光粒子、漂浮裝飾、文字平移",
    "caution": "這是效能最佳實務對照組，而非 2026 新語法；P95 是全頁 rAF 取樣，不能當成 CPU 百分比。",
    "probe": [
      "transform",
      "translateX(10px)"
    ],
    "links": [
      [
        "web.dev animations performance",
        "https://web.dev/articles/animations-guide"
      ],
      [
        "MDN CSS performance",
        "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance"
      ]
    ],
    "html": "<div class=\"particle-field\" id=\"particles\"></div><div class=\"particle-caption\">COMPOSITOR / STRESS LAB<br><small>觀察粒子繞行與影格穩定度</small></div>",
    "oldCSS": ".particle-field{position:absolute;inset:0}.particle{position:absolute;top:0;left:0;display:block;width:8px;height:8px;border-radius:50%;background:#6bffe0;box-shadow:0 0 10px #5bf9e9}.particle-caption{position:relative;z-index:2;text-align:center;pointer-events:none;font-size:24px;font-weight:800;letter-spacing:.1em;text-shadow:0 3px 20px #000}.particle-caption small{font-size:12px;color:#accddb}",
    "css": ".particle-field{position:absolute;inset:0}.particle{position:absolute;top:0;left:0;display:block;width:8px;height:8px;border-radius:50%;background:#6bffe0;box-shadow:0 0 10px #5bf9e9;animation:particleMove 3.8s ease-in-out infinite alternate;animation-delay:var(--delay)}@keyframes particleMove{from{transform:translate3d(var(--x1),var(--y1),0);opacity:.4}to{transform:translate3d(var(--x2),var(--y2),0);opacity:1}}.particle-caption{position:relative;z-index:2;text-align:center;pointer-events:none;font-size:24px;font-weight:800;letter-spacing:.1em;text-shadow:0 3px 20px #000}.particle-caption small{font-size:12px;color:#accddb}",
    "load": "particles",
    "oldJS": "const field=document.querySelector(\"#particles\");let handle=null,begin=performance.now();function draw(now){if(window.stagePaused){handle=null;return}const t=(now-begin)/3800;field.querySelectorAll(\".particle\").forEach((p,i)=>{const a=Number(p.dataset.a),b=Number(p.dataset.b),c=Number(p.dataset.c),d=Number(p.dataset.d);const f=(1-Math.cos(Math.PI*2*t+Number(p.dataset.delay)))/2;p.style.left=(a+(c-a)*f)+\"%\";p.style.top=(b+(d-b)*f)+\"%\"});handle=requestAnimationFrame(draw)}handle=requestAnimationFrame(draw);addEventListener(\"pagehide\",()=>cancelAnimationFrame(handle));"
  },
  {
    "id": "scroll-markers",
    "title": "捲動標記變原生 Tab",
    "year": "Chrome 154+ / Edge",
    "group": [
      "visual",
      "less-js"
    ],
    "desc": "不用自行同步 Carousel 分頁按鈕，scroll-marker-group 新 tabs 模式含原生鍵盤語意。",
    "why": "::scroll-marker 與 scroll-marker-group: after tabs 提供分頁導覽、焦點順序與 ARIA 語意，減少 JS 分頁與選取狀態同步。",
    "jsSave": "省去自行處理 Tab 狀態、鍵盤焦點事件",
    "cost": "CSS scroll snap 由瀏覽器處理；沒有高頻 scroll JS",
    "use": "圖片幻燈、投影片縮圖列表",
    "caution": "Chrome 154 的 tabs 模式是新增加的無障礙語意；可用滑動及分頁圓點測試。",
    "probe": [
      "scroll-marker-group",
      "after tabs"
    ],
    "links": [
      [
        "Chrome 154",
        "https://developer.chrome.com/blog/new-in-chrome-154"
      ],
      [
        "MDN scroll-marker-group",
        "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-marker-group"
      ]
    ],
    "html": "<div class=\"scroll-carousel\" id=\"scrollCarousel\"><div class=\"slide a\">01<br><span>新的開始</span></div><div class=\"slide b\">02<br><span>信實不改變</span></div><div class=\"slide c\">03<br><span>重新得力</span></div></div>",
    "oldHTML": "<div class=\"old-wrap\"><div class=\"scroll-carousel\" id=\"scrollCarousel\"><div class=\"slide a\">01<br><span>新的開始</span></div><div class=\"slide b\">02<br><span>信實不改變</span></div><div class=\"slide c\">03<br><span>重新得力</span></div></div><div class=\"old-dots\"><button data-n=\"0\" aria-label=\"第一頁\">●</button><button data-n=\"1\" aria-label=\"第二頁\">●</button><button data-n=\"2\" aria-label=\"第三頁\">●</button></div></div>",
    "oldCSS": ".old-wrap{width:75%;max-width:560px}.scroll-carousel{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;width:75%;max-width:560px;border-radius:16px;scrollbar-width:none}.old-wrap .scroll-carousel{width:100%}.slide{flex:0 0 100%;height:260px;scroll-snap-align:center;display:grid;place-content:center;text-align:center;font-size:50px;font-weight:800}.slide span{font-size:25px}.slide.a{background:#15535d}.slide.b{background:#3d367b}.slide.c{background:#5a3d52}.old-dots{display:flex;justify-content:center;gap:10px;margin:15px}.old-dots button{color:#8dcdb8;background:transparent;border:0;cursor:pointer;font-size:18px}",
    "css": ".scroll-carousel{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;width:75%;max-width:560px;border-radius:16px;scrollbar-width:none;scroll-marker-group:after tabs}.slide{flex:0 0 100%;height:260px;scroll-snap-align:center;display:grid;place-content:center;text-align:center;font-size:50px;font-weight:800}.slide span{font-size:25px}.slide.a{background:#15535d}.slide.b{background:#3d367b}.slide.c{background:#5a3d52}.slide::scroll-marker{content:\"\";width:12px;height:12px;border-radius:100%;background:#708696;display:block}.slide::scroll-marker:target-current{background:#86ffe0;box-shadow:0 0 0 3px #86ffe040}.scroll-carousel::scroll-marker-group{display:flex;justify-content:center;gap:11px;padding-top:15px}",
    "oldJS": "const el=document.querySelector(\"#scrollCarousel\");document.querySelectorAll(\".old-dots button\").forEach(b=>b.addEventListener(\"click\",()=>el.children[+b.dataset.n].scrollIntoView({behavior:\"smooth\",block:\"nearest\",inline:\"center\"})));"
  }
];
