# 互動敘事世界 — 協作指南

本實驗室以互動網頁取代單純投影片。所有功能在 index.html，無依賴、無建置步驟；從 ProjectionLabs 根目錄啟動 python -m http.server 8000，開啟 /interactive-worlds/。

## 修改內容

- 示範內容在 story-data JSON。六個節點以相同順序對應四種視覺隱喻；欄位包含 icon、title、body、action、notes。投影短文保持精簡，詳細講稿放 notes。
- 新視覺隱喻應新增 configs 項目、drawWorld 的 SVG 背景、對應 CSS 與模式按鈕；維持共用選取狀態，不複製內容資料。
- 不要把所有世界變成線性投影片；全貌、自由點選、返回、循序導覽都需保留。
- 不需變更其他實驗室、部署設定或引入框架。

## 驗收

- Chrome / Edge：四個世界各點六站，來回切換模式時保留目前節點與探索記錄。
- 確認傳統對照、Home、左右鍵、數字跳站、F 和全螢幕退出。
- 開啟獨立投影視窗，主控選站或編輯時投影同步，講員備忘不顯示在投影舞台；不同主控分頁應互相隔離。
- 匯入有效 JSON、拒絕無效 JSON；匯出 HTML 並離線開啟，確認已套用內容存在。不要把輸入內容當 HTML 執行。
- 16:9 舞台以寬螢幕和手機測試，文字不重疊；尊重 reduced motion。無持續 JS 動畫迴圈。
- 同源 HTTP(S) 雙視窗同步；file:// 的 BroadcastChannel 支援依瀏覽器而異。

靈感來源：https://www.breakingchange.blog/p/fewer-slides-more-dragons
