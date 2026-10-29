# ProjectionLabs

十個一般 Web 投影效果實驗室，集中收錄既有的效果組合、CSS 圖鑑、音樂動態與詩歌手繪成品，以及三個分項效果工作台。以同一段文字比較不同風格，從安靜的微動態，到華麗的光影、聲音反應與逐筆繪畫。

**網站入口：[christorng.idv.tw/ProjectionLabs/](https://christorng.idv.tw/ProjectionLabs/)**

本專案只收錄一般瀏覽器可用的實驗室，不包含 FreeShow 專用版本，也不修改其程式或網站。

## 所有實驗室入口

| 實驗室 | 線上入口 | 原始碼入口 | 簡介 |
| --- | --- | --- | --- |
| 動態效果組合室 | [開啟](https://christorng.idv.tw/ProjectionLabs/composer/) | [composer/](composer/) | 移植原有 Motion Composer：七個獨立圖層、65 種非空效果、10 組預設、四種頁面排列／接力模式；三頁可編輯內容與完整播放器 HTML 匯出。 |
| HTML-in-Canvas 原生實驗室 | [開啟](https://christorng.idv.tw/ProjectionLabs/html-in-canvas/) | [html-in-canvas/](html-in-canvas/) | 7 個獨立場景：真實 HTML 排版、表單互動、2D 多層特效、卡片動畫、WebGL 原生 HTML 紋理、事件式重繪與 16:9 投影。偵測 Origin Trial 並區分原生/替代模式。 |
| 新世代 CSS 技術實驗室 | [開啟](https://christorng.idv.tw/ProjectionLabs/new-css/) | [new-css/](new-css/) | 17 個獨立案例，涵蓋 Chromium 2025–2026 已推出的新 CSS 與效能最佳實務。可切換傳統／新 CSS、複製程式碼、匯出單檔 HTML，並觀察前景影格間隔與長任務。 |
| Web Motion Atlas | [開啟](https://christorng.idv.tw/ProjectionLabs/motion-atlas/) | [motion-atlas/](motion-atlas/) | 移植原有 48 種 CSS 單效果圖鑑，含強度／技術分類、收藏、時間軸、互動及捲動效果、能力偵測與獨立 HTML 下載。 |
| 音樂動態實驗室 | [開啟](https://christorng.idv.tw/ProjectionLabs/music-motion/) | [music-motion/](music-motion/) | 移植原有七類、64 種非空效果及 12 組預設。以音量、頻段、節奏控制 Canvas 背景、文字、光影與換頁；支援示範音樂、本機檔案、麥克風與無聲模擬。 |
| 光的筆跡／詩歌手繪 | [開啟](https://christorng.idv.tw/ProjectionLabs/ink-song/) | [ink-song/](ink-song/) | 移植原有 80 秒、六段落的 SVG 詩歌播放器：逐筆落筆、色塊累積、場景延續、循環擦除，支援歌詞編輯、節拍音與繪畫／快轉倍率。 |
| 歌詞文字效果 | [開啟](https://christorng.idv.tw/ProjectionLabs/lyrics/) | [lyrics/](lyrics/) | 48 種效果：低調呼吸、遮罩揭露、逐字動畫、光與材質、立體變形、誇張特效。 |\n| 逐字節拍同步 | [開啟](https://christorng.idv.tw/ProjectionLabs/lyrics-beat-sync/) | [lyrics-beat-sync/](lyrics-beat-sync/) | 104 BPM 多種節奏示範、28 個獨立效果、11 組預設，WebVTT 優先、ASS 相容的單檔逐字時間匯入匯出，支援休止、長音與估算提示。 |
| 投影片轉場 | [開啟](https://christorng.idv.tw/ProjectionLabs/transitions/) | [transitions/](transitions/) | 24 種效果：淡化、推移、遮罩揭露、立體翻頁與彈性換頁；以兩張投影片展示真正的前後交接。 |
| 動態背景 | [開啟](https://christorng.idv.tw/ProjectionLabs/backgrounds/) | [backgrounds/](backgrounds/) | 24 種效果：柔光、色彩流動、幾何圖樣與抽象舞台；文字保留在前景。 |

共 **10 個已列於首頁的獨立子目錄頁面**。上面四個入口來自既有成品，下面三個分項工作台另提供 **96 種效果**。不同實驗室的技法有重疊，各頁的數量代表該頁可選效果，不將它們相加宣稱為不重複的效果總數。

## 既有成品的移植範圍

| 原有成品 | 原始碼版本 | 本 repo 路徑 |
| --- | --- | --- |
| 歌詞動畫實驗室的一般 Web 部分 | `fba73edc1da1528d23f71594556c0b2ddda009a3` | 原本 `dist/web/` 的組合播放器與圖鑑，分別放入 `composer/`、`motion-atlas/`；不複製 `dist/` 的 FreeShow 頁面。 |
| 音樂動態實驗室 | `7048dad26f66c2b9945a5643dcea6584e92314bd` | `music-motion/`，包含 Canvas 引擎、Web Audio 引擎與說明文件。 |
| 光的筆跡｜詩歌手繪實驗室 | `be29de765731b26ae9026abea981b28d57052624` | `ink-song/`，保留原有 SVG 繪畫腳本及播放控制。 |

移植保留原有互動與視覺，將站內入口調整為相對路徑、加入回首頁連結，並修正手繪專注模式的返回按鈕可見性；沒有帶入 Sites 的部署設定、認證資訊或 Git metadata，也沒有修改原有 Sites 的發布內容。

音樂檔在本機解碼；麥克風需使用者在 HTTPS 頁面主動授權，沒有自動收音。節奏起音是估測，不等於精確的 BPM／小節辨識。音樂頁與手繪頁保留各自的使用方式；以下共用控制說明主要適用於三個分項工作台。

## 動態編排與轉場實驗室（2026-10-29）

入口：[動態編排與轉場](https://christorng.idv.tw/ProjectionLabs/kinetic-slides/) · 程式碼：kinetic-slides/ · 參考：[Kittenjam Motion Library](https://kittenjam-motion-library.vercel.app/)。

新增 **60 個針對完整 16:9 投影片構圖的動態研究**，不修改既有 24 種轉場、48 種歌詞文字或 48 種 CSS 動態圖鑑：

- 頁面轉場（21 種）：層疊卡片交接、膠卷過片、景深三層接力、棋盤格折幕、畫中抽屜、稜角光閘、剪貼簿拼貼。
- 文字編排（30 種）：標題滾筒、逐詞字卡、閱讀焦點軌道、雙欄編輯式換位、重點色帶接力、海報印記、雷射切斷、倒數砸落、亂碼解讀、水面倒影、詞組動態堆疊。

手機版主預覽排列在參數面板之前，主舞台內提供上一／下一效果及換頁按鈕，全螢幕保留控制列；效果列表以真實 CSS 動畫縮圖呈現，使用單一共用計時器，透過 IntersectionObserver 限制到可視卡片，避免 60 張卡片同時執行動畫。支援暫停縮圖。

每種效果提供類別／強度／技術／適用情境、效果卡片、可修改的前後投影片文字、轉場時間／速度曲線／強調色／背景、上一頁／下一頁、重播、隨機切換、自動播放、鍵盤導覽與 Fullscreen。對比原有實驗室，此頁的動畫以**卡片／文字／背景等多物件協同構圖**為核心，不只是把單一元素做 transform 或 opacity 變化。

新實驗室由 kinetic-slides/index.html、style.css、effects.js、app.js 四個檔案構成，無框架、無外部套件；CSS 負責動畫，JS 負責控制、填字、觸發與匯出。**匯出離線 HTML** 會將 CSS、效果定義及控制腳本內嵌於單一檔案。已以 Chromium 瀏覽器讀取 Kittenjam 動態載入的 327 種項目（其中 CSS 194 種），新增 6 種明確對應原站編號的 CSS 範例：#002 Laser Cut、#008 Number Slam、#013 Scramble Decode、#017 Water Reflection、#045 Kinetic Stack、#187 Scrapbook。另新增 42 種獨立 CSS 效果，共有 60 種。這些包含四散聚合與爆破、字元洗牌、翻牌、紙張揭幕、焦點卡片輪播、流程線、長條圖、雷達與時間軸；其他技術參照原站的視覺概念或獨立設計。所有 CSS 均重新實作，**不是原站程式碼的直接移植**。

動態偏好：遵循 prefers-reduced-motion，預設採靜態換頁；使用者可於頁面中明確切換。transform 與 opacity 為主要動作，格片、遮罩、濾鏡與陰影仍可能增加 Paint，應在預定的投影裝置測試。

## 使用方式

1. 進入任一實驗室，選擇效果卡片。可依風格分類，或搜尋效果名稱、CSS 技術。
2. 在「預覽文字」輸入自己的內容，每一行是一張投影片；用「上一句／下一句」比較不同文字。
3. 調整循環時間、文字大小、逐字間隔、節奏、強調色及底色。部分效果有自己的固定步進／等速節奏；逐字間隔只影響逐字與粒子效果。
4. 開啟「自動換句」或「全螢幕投影」，觀察大畫面。卡片動畫可關閉，以降低同時播放的負擔。
5. 下載目前效果的 **獨立 HTML**，或展開程式碼區複製效果 CSS／完整 HTML。

獨立 HTML 包含目前文字、前一句（轉場用）、配色與動畫設定，無框架、無外部套件、無網路依賴，可直接離線開啟。它是單一效果的循環展示，不包含實驗室控制介面或自動換句播放器。複製效果 CSS 時需搭配程式碼區的 `.scene` / `.words` / `.char` HTML 結構。

快捷鍵：`←` / `→` 換句，空白鍵播放／暫停，`F` 切換全螢幕，`Esc` 離開全螢幕。編輯輸入欄位或操作按鈕時不攔截快捷鍵。

## 效果目錄

| 實驗室 | 分類 | 效果 |
| --- | --- | --- |
| 文字 | 低調 | 輕柔呼吸、微幅漂浮、柔和聚焦、字距舒展、暖色陰影、輕輕進場、微幅放大、底線生長 |
| 文字 | 揭露 | 水平揭露、中央展開、圓形光圈、斜角切入、羽化掃入、打字揭露、由下浮現、條紋揭露 |
| 文字 | 逐字 | 逐字波浪、逐字升起、逐字彈跳、逐字翻面、色彩接力、逐字清晰、逐字搖擺、逐字脈衝 |
| 文字 | 光與材質 | 流動彩虹、金屬掃光、霓虹呼吸、描邊文字、稜鏡折色、全息條紋、液態色流、餘燼光暈 |
| 文字 | 立體 | 立體傾斜、水平翻頁、側向翻頁、景深推近、立體字厚度、鐘擺文字、斜切變形、空間環繞 |
| 文字 | 誇張 | 橡皮拉伸、果凍扭動、故障錯位、逐字散開、旋入文字、巨幅壓縮、殘影拖曳、掃描裂片 |
| 轉場 | 低調 | 交叉淡化、經黑淡入、柔和推近、輕移交接 |
| 轉場 | 推移 | 向左推頁、向右推頁、向上推頁、覆蓋滑入 |
| 轉場 | 遮罩 | 水平擦除、垂直擦除、對開布幕、圓形展開、斜向揭露、菱形展開、百葉窗、羽化幕簾 |
| 轉場 | 立體 | 空間翻面、側邊翻頁、立方體旋轉、景深交替 |
| 轉場 | 誇張 | 旋轉切換、彈性飛入、拉伸換頁、像素階梯 |
| 背景 | 低調 | 安靜光場、晨光漸層、漂移柔光、呼吸暗角、地平線光帶、散景光點 |
| 背景 | 色彩 | 流動網格色、極光色帶、熔岩色流、深海流光、光譜流動、旋轉色盤 |
| 背景 | 幾何 | 漂移方格、斜紋移動、點陣漂移、同心環波、菱形網格、透視地板 |
| 背景 | 舞台 | 放射光束、掃動聚光燈、浮動粒子、旋轉隧道、光束掃描、路徑光點 |

CSS 效果能任意組合，不存在有限的「所有效果」清單；此目錄是可實際操作、持續擴充的代表集合，不宣稱窮盡 CSS 的全部可能。

## 瀏覽器與效能

- 介面使用原生 JavaScript ES Modules、CSS 動畫與 Container Query 單位，建議使用現代瀏覽器。
- `mask-image`、`offset-path` 及 `@property` 動畫依功能偵測顯示支援提示；不支援時主預覽與卡片改為靜態畫面。
- 遵循系統 `prefers-reduced-motion`，初始停用動態並保留可讀畫面。實驗室中的「啟用動畫」可由使用者主動播放；匯出檔仍遵循系統偏好。
- 全域暫停同時停止卡片與主預覽；畫面外的卡片也會暫停。發光、模糊與多重遮罩可能比單純 `transform` / `opacity` 花費更多繪圖成本。
- 全螢幕優先使用瀏覽器原生功能；若瀏覽器不允許，改用頁內滿版預覽，仍可用退出按鈕或 `Esc` 返回。
- 匯出檔保留原始 CSS 技術；請在預定投影的瀏覽器中確認畫面。設定只存在此頁，不傳送歌詞到伺服器。

## 本機預覽與部署

這是純靜態網站，無建置步驟、無套件安裝要求。所有內部網址使用相對路徑，可部署在 `/ProjectionLabs/`，也可放在其他子路徑。

在專案根目錄啟動 HTTP server（不要用 `file://` 開啟實驗室頁面，因 ES Modules 需要 HTTP）：

```sh
python -m http.server 8000
```

開啟 `http://localhost:8000/`。只有下載的獨立 HTML 可用 `file://` 離線開啟。

目前沿用 repo 既有的 GitHub Pages 根目錄部署。`.nojekyll` 讓 HTML、CSS、JavaScript 以靜態檔案直接提供；未新增 Actions、未修改自訂網域設定。將本專案根目錄發布到既有的 Pages 來源即可。

```text
ProjectionLabs/
├── index.html           # 實驗室總入口
├── kinetic-slides/       # 動態編排與多物件投影片轉場
├── html-in-canvas/index.html # HTML-in-Canvas 原生 API 與替代模式
├── new-css/index.html # 新 CSS／效能比較實驗室
├── composer/index.html  # 原有七層組合播放器
├── motion-atlas/index.html # 原有單效果圖鑑
├── music-motion/index.html # 音樂反應圖層
├── ink-song/index.html   # 詩歌手繪播放器
├── lyrics/index.html    # 歌詞文字\n├── lyrics-beat-sync/index.html # 逐字節拍同步
├── transitions/index.html
├── backgrounds/index.html
└── assets/              # 共用介面、場景與各實驗室效果定義
```

新增實驗室時，建立 `<lab-id>/index.html` 與 `assets/<lab-id>.js`，在 `assets/catalog.js` 登錄，再同步首頁與本 README 的入口、簡介及效果數量。

## 逐字節拍同步實驗室

[線上入口](https://christorng.idv.tw/ProjectionLabs/lyrics-beat-sync/) · [ASS 卡拉 OK 示範歌詞](lyrics-beat-sync/demo.ass)

- **連續八句，不留整頁空白**：104 BPM、4/4，八句各兩小節，共 36.923 秒，每句立即銜接。72 個字的音符時值分布包含十六分音群、半拍休止、二拍及四拍長音，各句旋律與節奏不同。
- Web Audio 依 ASS 音節時間排程合成示範旋律與不同小節變化鼓點；支援下載旋律＋節奏 WAV，或匯入本機音樂檔同步。ASS 不含標準的音高欄位，因此重新匯入時音高改採示範推導音階。
- **28 個獨立效果，分五類**：字體色彩與彈性、上下左右位移、空心字水平／垂直／圓形／中央／斜向填入、彩色字墜入與四散碎片組合、裝飾光環／光點／底線，以及跳球與撞擊。
- 每類都有「無效果」。揭露遮罩與球型效果在同類中互斥，其餘效果可跨類疊加，不將綁定的效果冒充獨立效果。
- **11 組成套預設**：輕柔、明顯、誇張、現代、科幻、電影感、復古歌球、能量灌注、碎片重組、色彩墜入、全無效果。
- 跳球以字元起音與長音內拍點建立事件序列，水平位移與垂直拋物線同時發生，跳到另一字時不會在最低點平移；長音仍在原字每拍重跳。落球爆裂及灌字為另兩種單項效果。
- 可單獨調字體大小、放大幅度、水平／垂直偏移、顏色、陰影、描邊、底線、球大小和跳高。點選時間軸字元可定位到起音點。
- **單一 ASS 卡拉 OK 檔**：Dialogue 記錄整句起迄，`\k`、`\kf` 等標準標記以百分之一秒記錄每個音節的持續時間；空音節的 `\k` 表示句中休止。匯入後不再估算每字時間，沒有時間標記的普通 ASS Dialogue 將明確拒絕。
- 純 HTML/CSS/JS，離線獨立播放器直接內嵌 ASS 字幕、樣式與聲音引擎，匯出可保留目前啟用的效果組合。

### 四字同步效果卡片（v6）

所有獨立效果卡片與預設組合卡片現在使用真正的同步歌詞動畫，而非互相獨立的靜態縮圖或隨機 CSS 無限循環。範例四字為 **「一二三四」**，短循環設定 **120 BPM、4/4、2 秒**（每字 0.5 秒），沒有空白段落。

- **44 張同拍預覽**：28 個單項、五組「無效果」及 11 組成套預設。每張使用相同的四個字、起音時間、循環起點，便於比較效果強弱。
- **共用時鐘**：所有卡片由單一 `requestAnimationFrame` 時間原點推算進度；單項卡片和預設卡片不會各自漂移。螢幕外的卡片以 `IntersectionObserver` 暫停 DOM 更新，回到可視區時依全域時鐘直接追上。
- **真實效果引擎**：每張使用主投影相同的 `.glyph`、描邊、填色、陰影、底線、碎片、發光及字形位移 CSS 層，依每字起音與進度設定 CSS 變數；「無效果」保持原始文字，不自行變色。
- **彈性球與撞擊**：逐字跳球按拋物線運動，四字最後一拍直接連回第一字；碰撞、碎片及填入文字效果也可在卡片中觀察。
- **播放器**：「暫停預覽」、「全部重新開始」、「開啟節拍聲」是共用控制，播放中切換主投影效果不影響其他預覽進度。節拍音由使用者點擊後以 Web Audio 排程，不會未經允許自動播放。
- **離線保留**：完整播放器 HTML 匯出包含新版同步預覽，引入／匯出 WebVTT 與 ASS 的原功能不受影響。

### WebVTT 與 ASS 雙格式（v5）

實驗室優先使用 [demo.vtt](lyrics-beat-sync/demo.vtt) 作為示範來源；保留 [demo.ass](lyrics-beat-sync/demo.ass) 相容。兩種檔案均可獨立承載字幕時間，不需要 SRT + JSON 或外掛。它們解析到相同的內部 `lines[].words[].start/end` 時間軸，原本所有動畫與跳球不必重寫。

- **WebVTT**：支援帶行內 `<00:00:01.500>` karaoke 時間標記的句型；也支援只有整句起迄的 OBS/Whisper 一般 VTT。後者逐字時間並非真實辨識結果，使用均分估算並標示「逐字時間為估算」。每個字獨立一個 Cue 時也能讀取，但會以各 Cue 作為一行，使用本實驗室的行內標記格式更容易重建整句。
- **長音及休止**：匯出 WebVTT 時以合法的行內時間標記，搭配零寬空白音節，將休止區間和發聲時間分開；其他軟體可能忽略休止的特殊區分，但字幕文字與時間標記仍有效。WebVTT 時間精度為毫秒，ASS `\\k` 為百分之一秒。
- **ASS**：仍支援 `\\k`、`\\K`、`\\kf`、`\\ko`，作為專業卡拉 OK 製作流程的交換格式。
- **節拍 metadata**：WebVTT 使用合法 `NOTE ProjectionLabs BPM=104 BeatsPerBar=4 BeatOffset=0 Alignment=estimated|precise`（其中 `Alignment` 用來保留逐字時間是否估算）；ASS 使用註解。它們不是 WebVTT / ASS 標準的節拍欄位，外部工具可忽略；歌詞與逐字時間不依賴 metadata。
- 匯出 HTML 時，內嵌 WebVTT 及完整播放器，不依賴原始字幕檔或網路。

### 跳球的時值與跨頁運動（v3）

- **相對尺寸**：球直徑以當前字形寬度百分比設定，預設約 20%，並會隨字級與 16:9 投影畫面調整。
- **時值決定跳高**：四分音符為跳高基準；八分音符一半、十六分音符四分之一。長音跨越多拍時，同一個字每拍再跳。另可切換整體低跳、高跳或高低交替。
- **碰撞彈性**：每次到達字頂依起音時間壓扁，再恢復圓形，動畫不取決於螢幕影格率。
- **連續跨頁**：預先量測每頁字形的固定位置，球沿同一段拋物線從前頁末字飛到後頁首字，歌詞 DOM 更新不會中斷球；播放循環時，最後一字同樣連回第一頁第一字。
- **示範卡片**：球縮小並展示高低交錯的跳躍，避免與主播放器不同步的視覺印象。

### 單檔 ASS 卡拉 OK 結構（v4）

V4 曾僅使用 .ass；自 V5 起同時支援 WebVTT（優先）與 ASS。[demo.ass](lyrics-beat-sync/demo.ass) 是完整可在 Aegisub 等 ASS 字幕編輯器使用的範例。

```ass
[Script Info]
Title: 逐字節拍歌詞
ScriptType: v4.00+
; BPM: 104
; BeatsPerBar: 4

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.00,0:00:03.38,Default,,0,0,0,,{\kf25}祢{\kf25}的{\k50}{\kf50}光{\kf188}芒
```

- `{\kf25}` 表示該音節 0.25 秒的左至右卡拉 OK 填色時間；`{\k50}` 不附文字代表休止 0.5 秒；`{\kf188}` 是延長 1.88 秒。
- 時間精度為 0.01 秒。ASS 能精確交換音節的開始和持續時間，但不是完整記譜格式，無法標準化交換 MIDI 音高、節拍器 BPM 與拍號。
- `; BPM:`、`; BeatsPerBar:`、`; BeatOffset:` 是本工具用的**選填註解**，不是 ASS 卡拉 OK 標準欄位；其他 ASS 軟體可安全忽略。
- ASS 的傳統 `\k`、`\K`、`\kf`、`\ko` 均可讀取；頁面將每個標記的文字當成可動畫化的音節，支援單個中文字和多字母音節。其餘 ASS 排版特效不由本實驗室直接複製。
- 載入自己的 ASS 後，BPM 滑桿只影響拍點，不擅自拉伸原有逐字時間；內建示範修改 BPM 才會按音樂比例縮放。
- 下載的獨立 HTML 內嵌 ASS 內容，無需在瀏覽器旁放第二份 JSON。


## 設計與技術參考

效果程式碼為本專案自行撰寫；下列來源用於研究動畫種類與 CSS 技術，不在執行時載入這些動畫套件。

- [Animate.css](https://animate.style/)：淡入、翻轉、彈性與其他常見動畫分類。
- [Animista](https://animista.net/)：文字聚焦、字距、進出場等動畫參考。
- [MDN — CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations)
- [MDN — clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/clip-path)
- [MDN — CSS Masking](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Masking)
- [MDN — background-clip](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/background-clip)
- [MDN — text-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-shadow)
- [MDN — @property](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@property)
- [MDN — CSS Motion Path](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Motion_path)

授權：[MIT](LICENSE)。
\n## 新世代 CSS 技術實驗室（2026-10-22）\n\n入口：[新 CSS 實驗室](https://christorng.idv.tw/ProjectionLabs/new-css/)；程式碼位於 `new-css/`，不修改既有效果定義。\n\n包含 **17 個案例**：非圓形轉角、異形框線、CSS 自訂函式、Grid gap decorations、原生錨點定位、scroll-triggered 動畫、scroll-state、sibling-index 逐字延遲、text-fit、text-decoration-inset、contrast-color、自動進場樣式、Popover、View Transition、離屏 content-visibility、CSS transform 與 JS left/top 對照、原生 scroll-marker 分頁。\n\n每一項均提供個別技術特性、JS 簡化效益、預期 Layout／Paint／Compositor 取捨、Chrome／Edge 相關支援偵測、示範預覽、舊／新切換與可匯出的單檔範例。效能面板測量的是**目前頁面 requestAnimationFrame 的更新頻率與影格間隔 P95、全頁近 10 秒 Long Tasks 次數**；不是 CPU 百分比，也不是獨立 iframe 的 Paint／GPU 次數。真正比較 CPU 與 rendering workload，請用同一台電腦的 DevTools Performance 逐一錄製兩種模式。\n\n`content-visibility`、GPU 友善 `transform` 對照是刻意保留的舊技術效能最佳實務，不冒充 2026 新推出功能。`@function`、`corner-shape` 等新能力不保證一定降低 CPU；CSS 渲染操作仍可能有主執行緒 Paint 成本。\n\n技術來源：[Chrome Release Notes](https://developer.chrome.com/release-notes/) · [Chrome 149 Gap Decorations](https://developer.chrome.com/blog/gap-decorations-stable) · [Josh W. Comeau — Interop 2027](https://www.joshwcomeau.com/css/interop-2027/) · [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)。\n
## HTML-in-Canvas 原生實驗室（2026-10-24）

線上入口：[HTML-in-Canvas](https://christorng.idv.tw/ProjectionLabs/html-in-canvas/) · 原始碼 `html-in-canvas/`。

這是以 [Chrome HTML-in-Canvas Origin Trial](https://developer.chrome.com/blog/html-in-canvas-origin-trial?hl=zh-tw) 為主題的實驗。**此功能仍是實驗性 Origin Trial，不能因為 Chrome／Edge 版本較新就推論一定可以使用。** 需要自行啟用對應 Chrome/Edge 實驗旗標，或將已註冊網域的 Origin Trial Token 部署於頁面。此專案不包含網域專用 token。

### 場景與切換

1. 真實 HTML/CSS 歌詞：保留多行中文字型、樣式、區塊語意。
2. 互動表單：測試 input、按鈕及 2D 座標命中。
3. Canvas 2D 多次繪製：模糊光暈、剪裁與合成。
4. 2D 卡片旋轉：使用 `drawElementImage()` 與 Canvas 變形。
5. WebGL2 波紋：將 HTML 快照繪入紋理，透過 GLSL 製造扭曲與色差。
6. 事件式重繪：比較內容改變才畫與逐影格不停畫的架構差異。
7. 16:9 投影舞台：文字 HTML 與 Canvas 光束的概念驗證。

**三種路徑**：原生實驗性 HTML-in-Canvas（僅在功能偵測成功時開放）、標準 DOM 疊層（不是新 API）、傳統 Canvas 2D 手繪（不是新 API）。畫面左側提供功能偵測，舞台下方提供 JS 呼叫次數、`paint` 事件次數、同步 JS 繪製耗時 P95 與前景頁面影格間隔 P95。這些指標**不是 CPU 或 GPU 使用率**，需搭配 DevTools Performance 診斷 Layout／Paint／Compositor／GPU 的實際成本。

### 版本相容性

- 新版 Canvas 入口 `<canvas content="drawable">`、可畫節點 `drawable`；舊版使用 `layoutsubtree`。實驗室採雙屬性進行過渡期相容。
- 2D 使用 `CanvasRenderingContext2D.drawElementImage`；舊版會回傳需要同步的 DOMMatrix，Chrome 155+ 改為自動同步。
- WebGL2：Chrome 155+ `texElementSubImage2D` 必須先分配紋理儲存空間；較舊試用版使用 `texElementImage2D` 不同參數簽章。WebGPU 目前僅提供官方資源參考，這個實驗室沒有冒充已實作 WebGPU。
- 2D 靜態案例只在 `paint` 或需要更新時繪製；旋轉、光學變形與 WebGL shader 則仍有連續重繪或 GPU 計算成本。對固定字幕而言，一般 DOM 加 CSS 合成動畫可能更節省資源。
- WebGL shader 產生的紋理扭曲不等於 DOM 命中區域自動扭曲。此案例標示為視覺示範，不宣稱真實 3D 命中測試已同步。

參考：[官方 API 介紹](https://developer.chrome.com/blog/html-in-canvas-origin-trial?hl=zh-tw)、[官方 2026 年 9 月變更](https://developer.chrome.com/blog/html-in-canvas-ot-changes?hl=zh-tw)、[WICG 提案](https://github.com/WICG/html-in-canvas)、[Edge Origin Trial](https://developer.microsoft.com/en-us/microsoft-edge/origin-trials/trials/a297467e-0030-4c4c-8739-48e130026c03)。
