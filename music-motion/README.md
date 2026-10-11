# 音樂動態實驗室

獨立的聲音視覺工作台，與其他 Web 實驗室各自獨立。

## 使用

開啟 `index.html` 即可使用無聲模擬與示範音樂。部署到 HTTPS 後可用麥克風。

- 64 種非空效果：24 背景、8 字色、8 微動、6 光影、6 裝飾、8 換頁、4 多頁排列。
- 六個效果分類提供無效果；多頁排列提供單頁舞台作為基準。
- 12 組預設分為柔和、現代、奇幻、誇張。
- 七類可獨立選擇映射到音量、低／中／高頻或節奏起音。
- 三頁：組合說明，以及兩頁可編輯文字。
- 專注瀏覽採 1:1 預覽，手機固定上方預覽與下方獨立捲動選單。
- 示範音樂為自行合成的循環；所有音訊效果共用 AnalyserNode 訊號。
- MP3/WAV 等音樂檔使用本機 Object URL，不傳送至伺服器。
- 麥克風不連接輸出；切換來源、離開頁面或背景收音時會停止音軌。

起音為頻譜正向差異與低頻能量門檻估測，並非精確的 BPM 或小節辨識。

## 實作

不依賴外部套件、字型或執行時網路請求。Canvas 2D 背景與裝飾，DOM/CSS 文字，Web Animations 換頁。DOM 各層分開控制排列、進場與文字微動，避免 transform 互相覆蓋。音訊分析、粒子與歷史切片有固定容量；畫布限制解析度，畫面約 30 FPS。支援 reduced-motion。僅瀏覽記錄保存在裝置 localStorage，儲存不可用時以記憶體運作。

## 靈感與來源

- https://github.com/kaganin/iwrzwr-visual-archive
- https://www.kagan.in/iwrzwr/visual-archive/
- https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
- https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

本工作台的視覺與音樂程式為重新撰寫。原專案提供波形、粒子、頻譜、訊號記憶與機械動態的設計靈感。原專案以 MIT License 發布，作者 Kagan Yaldizkaya；授權見原儲存庫 LICENSE。

研究時的原專案版本：`794af320e89ebb1db545de5a977ad4cfda3628f0`。原成品移植版本為 `7048dad26f66c2b9945a5643dcea6584e92314bd`；裝置麥克風、音樂檔解碼與效能仍需在使用裝置確認。
