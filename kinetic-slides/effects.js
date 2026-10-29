export const effects = [
  { id: 'stack-deck', name: '層疊卡片交接', category: '頁面轉場', level: '鮮明', technique: 'transform · perspective · box-shadow', description: '上一頁像卡片退到堆疊底層，新頁傾斜落到前景；不是傳統單張翻頁。', usage: '章節交接、系列標題' },
  { id: 'film-strip', name: '膠卷過片', category: '頁面轉場', level: '鮮明', technique: 'translateX · repeating-linear-gradient', description: '兩頁沿同一條膠卷橫向前進，外側齒孔提供連續過片的視覺節奏。', usage: '照片、故事、歷程簡報' },
  { id: 'depth-relay', name: '景深三層接力', category: '頁面轉場', level: '柔和', technique: 'translate3d · scale · opacity', description: '背景光暈、資訊框與文字以不同速度交替，強調層次而非整張推頁。', usage: '沉浸式投影、意象文字' },
  { id: 'tile-fold', name: '棋盤格折幕', category: '頁面轉場', level: '華麗', technique: 'CSS Grid · rotateY · stagger', description: '十二個遮幕格片依對角線接續折動，在中段交棒給下一頁，與百葉窗、像素階梯不同。', usage: '段落斷點、視覺高潮' },
  { id: 'drawer', name: '畫中抽屜', category: '頁面轉場', level: '柔和', technique: 'inset · border-radius · scale · shadow', description: '下一頁縮成內嵌面板滑出，再展開為完整畫面，保留上一頁空間感。', usage: '補充資訊、深入內容' },
  { id: 'angular-iris', name: '稜角光閘', category: '頁面轉場', level: '華麗', technique: 'clip-path polygon · rotate · opacity', description: '多片稜角遮板環繞中心閉合再打開，與圓形光圈和水平擦除不同。', usage: '舞台開場、章節轉折' },
  { id: 'title-reel', name: '標題滾筒', category: '文字編排', level: '鮮明', technique: 'overflow hidden · rotateX · translateY', description: '整個詞組像資訊看板的滾筒從下方滾入，適合替換標題而不是逐字打字。', usage: '歌名、主題、標語切換' },
  { id: 'word-chips', name: '逐詞字卡', category: '文字編排', level: '活潑', technique: 'inline-flex · stagger · rotate · scale', description: '每個詞成為有色底的獨立字卡，錯拍落位；能比較中文單字與英文詞組。', usage: '標語、重點詞、兒童教材' },
  { id: 'focus-lane', name: '閱讀焦點軌道', category: '文字編排', level: '柔和', technique: 'translateY · opacity · transform', description: '三行內容沿縱軸依次移向閱讀焦點，其他行退至周邊，不是一般逐行淡入。', usage: '逐句說明、詩歌段落' },
  { id: 'split-editorial', name: '雙欄編輯式換位', category: '文字編排', level: '鮮明', technique: 'CSS Grid · independent transforms', description: '序號／分類與主文從相反方向匯合，保留排版網格的動態張力。', usage: '資訊型簡報、章節首頁' },
  { id: 'accent-rail', name: '重點色帶接力', category: '文字編排', level: '柔和', technique: 'scaleX · clip-path · mix-blend', description: '色帶先跨過標題容器，再揭出下一行；重點在色塊與文字的時間交錯。', usage: '講述重點、字幕提示' },
  { id: 'poster-stamp', name: '海報印記', category: '文字編排', level: '華麗', technique: 'perspective · rotateZ · scale · shadow', description: '標題以海報印章的手感進場，最後微震定格，維持後續閱讀清晰。', usage: '活動主題、宣傳大字' },

  { id: 'laser-cut', name: '雷射切斷', category: '文字編排', level: '華麗', technique: 'clip-path · pseudo-elements · transform', description: '一束亮線切過標題，文字上半與下半分別退場，帶出下一幕。', usage: '章節結束、強烈換頁', reference: '#002 Laser Cut' },
  { id: 'number-slam', name: '倒數砸落', category: '文字編排', level: '鮮明', technique: 'scale · translateY · impact line', description: '巨型頁碼高速砸入、輕微回彈，再收斂到投影片資訊層。', usage: '倒數、章節編號', reference: '#008 Number Slam' },
  { id: 'scramble-decode', name: '亂碼解讀', category: '文字編排', level: '鮮明', technique: 'CSS steps · content attr · clip-path', description: '模擬錯誤字元逐步退去，清晰標題分段還原；動畫無逐影格 JavaScript。', usage: '科技主題、數字資訊', reference: '#013 Scramble Decode' },
  { id: 'water-reflection', name: '水面倒影', category: '文字編排', level: '柔和', technique: 'scaleY · mask-image · blur', description: '標題在下方呈現隨波紋微動的淡化倒影，完成換頁後仍清楚可讀。', usage: '詩歌、抒情畫面', reference: '#017 Water Reflection' },
  { id: 'kinetic-stack', name: '詞組動態堆疊', category: '文字編排', level: '鮮明', technique: 'CSS custom stagger · translate · rotate', description: '詞組先重疊在畫面中央，再依序滑出成為正常標題排列；不同於彩色字卡。', usage: '大標題、逐詞強調', reference: '#045 Kinetic Stack' },
  { id: 'scrapbook', name: '剪貼簿拼貼', category: '頁面轉場', level: '活潑', technique: 'pseudo-element collage · transform · shadow', description: '紙卡、膠帶與標題以不同時序落到舞台上，組成像手工拼貼的投影片。', usage: '活動回顧、照片故事', reference: '#187 Scrapbook' }
];

export const groups = ['全部效果', '頁面轉場', '文字編排'];
export const referenceUrl = 'https://kittenjam-motion-library.vercel.app/';
