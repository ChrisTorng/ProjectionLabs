# ProjectionLabs

一般 Web 投影效果實驗室。以同一段文字比較不同風格，從安靜的微動態，到華麗的光影與誇張的立體變形。

**網站入口：[christorng.idv.tw/ProjectionLabs/](https://christorng.idv.tw/ProjectionLabs/)**

本專案只收錄一般瀏覽器可用的實驗室，不包含 FreeShow 專用版本，也不修改其程式或網站。

## 所有實驗室入口

| 實驗室 | 線上入口 | 原始碼入口 | 簡介 |
| --- | --- | --- | --- |
| 歌詞文字效果 | [開啟](https://christorng.idv.tw/ProjectionLabs/lyrics/) | [lyrics/](lyrics/) | 48 種效果：低調呼吸、遮罩揭露、逐字動畫、光與材質、立體變形、誇張特效。 |
| 投影片轉場 | [開啟](https://christorng.idv.tw/ProjectionLabs/transitions/) | [transitions/](transitions/) | 24 種效果：淡化、推移、遮罩揭露、立體翻頁與彈性換頁；以兩張投影片展示真正的前後交接。 |
| 動態背景 | [開啟](https://christorng.idv.tw/ProjectionLabs/backgrounds/) | [backgrounds/](backgrounds/) | 24 種效果：柔光、色彩流動、幾何圖樣與抽象舞台；文字保留在前景。 |

共 **96 種效果**。三個實驗室各自是一個子目錄頁面，可從首頁切換。

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
├── lyrics/index.html    # 歌詞文字
├── transitions/index.html
├── backgrounds/index.html
└── assets/              # 共用介面、場景與各實驗室效果定義
```

新增實驗室時，建立 `<lab-id>/index.html` 與 `assets/<lab-id>.js`，在 `assets/catalog.js` 登錄，再同步首頁與本 README 的入口、簡介及效果數量。

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
