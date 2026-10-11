/* Each category owns an independent DOM layer; a selection never overwrites another layer's transform. */
(function(global){
'use strict';
const item=(id,name,description)=>({id,name,description});
const groups=[
{id:'background',name:'背景空間',hint:'獨立的舞台底層，持續播放。',items:[item('none','無效果','純色背景'),item('aurora','極光潮汐','柔和的青紫色霧緩慢漂移'),item('nebula','星雲花園','點狀星群穿過多層星雲'),item('ocean','深海折光','水色光帶折射在深海底部'),item('prism','稜鏡萬花筒','多色幾何扇面緩慢旋轉'),item('grid','星際網格','透視網格延伸到地平線'),item('tunnel','無限幾何門','層層框線向遠方延伸'),item('eclipse','日蝕光環','巨大的暗色圓盤與流動光冠'),item('bloom','異星花瓣','半透明花瓣在中心展開'),item('portal','星門渦流','偏心光環形成多層空間入口'),item('topography','夢境等高線','環形線紋交錯成流動地形'),item('ribbons','絲帶宇宙','大型光帶交叉穿越舞台'),item('fireflies','螢火森林','小型光點在暗色森林中浮動'),item('rain','霓虹光雨','垂直光絲從夜空緩緩落下'),item('bokeh','失焦城市','大小不一的彩色光斑輕輕漂移'),item('silk','液態緞面','金屬般的流動柔色漸層'),item('horizon','雙重日落','兩顆異色太陽沉入夢幻地平線'),item('orrery','天體機械','傾斜軌道環繞中心旋轉'),item('paper','晨光紙頁','米白紙面上的淡色光影') ]},
{id:'ink',name:'文字色彩',hint:'只處理字形內部，不改動位置。',items:[item('none','無效果','使用固定文字色'),item('accent','主色文字','套用主題色'),item('gradient','極光流色','青紫漸層緩慢流動'),item('gold','香檳金屬','暖金色反光穿過字形'),item('holo','全息薄膜','粉紫與青色流動交織'),item('pearl','珍珠光澤','白色與淡藍之間緩慢流轉'),item('sunset','日落光譜','橘紅到紫色的暖色漸層'),item('outline','空心描邊','保留外框的實驗性字形'),item('duotone','雙色墨水','兩種柔色交替') ]},
{id:'entrance',name:'進場動作',hint:'只在頁面進入時執行。',items:[item('none','無效果','直接顯示'),item('fade','淡入','透明度從零到完整'),item('rise','柔和上浮','短距離上浮淡入'),item('focus','柔焦顯影','模糊逐漸變清楚'),item('wipe','水平揭露','從左至右揭開'),item('diagonal','斜向展開','斜切遮罩向外推進'),item('circle','圓形聚光','由中心擴大可見區'),item('flip','立體翻入','沿水平軸翻到正面'),item('zoom','遠方聚合','由略小的字體放大到正常'),item('curtain','雙幕拉開','上下遮幕向外展開'),item('scatter','字元聚合','每個字從不同位置聚攏'),item('char-rise','逐字上浮','以短延遲依序出現'),item('vortex','漩渦入場','旋轉縮放後停在正面') ]},
{id:'exit',name:'退場動作',hint:'單頁模式使用；連續多頁模式由整體換頁接手。',items:[item('none','無效果','直接換頁'),item('fade','淡出','文字逐漸消失'),item('rise','向上離場','上移並淡出'),item('sink','向下沉落','下移並淡出'),item('blur','化為霧氣','模糊後消失'),item('wipe','遮幕收合','由右側收回文字'),item('zoom','遠去縮小','向遠方縮小淡出') ]},
{id:'idle',name:'停留微動',hint:'文字不消失；只使用低幅度位移。',items:[item('none','無效果','文字位置保持完全穩定'),item('float','輕微漂浮','上下最多移動 0.06em'),item('sway','輕微搖曳','旋轉幅度不超過 0.4 度'),item('breathe','尺寸呼吸','尺度變化不超過 1%'),item('drift','緩慢橫移','左右最多移動 0.04em'),item('wave','細微字浪','字元依序移動 0.04em'),item('depth','呼吸景深','小幅透視傾斜'),item('orbit','微型環行','以非常小的圓形軌跡移動') ]},
{id:'glow',name:'光影層次',hint:'光暈包在字形之外，可與漸層文字相疊。',items:[item('none','無效果','不加陰影'),item('soft','柔和陰影','穩定的細緻暗影'),item('breathe','光暈呼吸','亮度緩慢增減，字體不變暗'),item('neon','柔霓虹','雙層青色光暈'),item('halo','月光外暈','白色與主色形成柔亮外緣'),item('chromatic','雙色殘影','細小的青紅色偏移'),item('extrude','立體厚度','多層陰影堆疊字體厚度'),item('ember','暖光餘燼','暖色光暈緩慢起伏') ]},
{id:'decoration',name:'周邊裝飾',hint:'獨立框線與圖形，不佔用文字動畫。',items:[item('none','無效果','不加裝飾'),item('underline','流光底線','細線沿著文字下方流動'),item('brackets','漂浮括號','兩側細框輕微漂移'),item('frame','漸層框線','彩色框線緩慢變色'),item('orbit','衛星環','傾斜的橢圓光環環繞文字'),item('glass','玻璃底板','文字下方加入半透明面板'),item('corners','取景四角','四角刻度營造精準構圖'),item('spark','星芒標記','兩側星芒緩慢旋轉') ]}
];
const modes=[item('single','單頁進退場','進場 → 可讀停留 → 退場 → 下一頁'),item('scroll','上下接力捲動','下一段先在下方縮小淡顯；換頁時上移放大'),item('depth','三段景深','前一段、當前段、下一段同時排列'),item('horizontal','左右接力','下一段先出現在右側，再滑入中央')];
const defaults={background:'nebula',ink:'pearl',entrance:'rise',exit:'fade',idle:'float',glow:'breathe',decoration:'none',mode:'scroll',orientation:'landscape',inTime:1.4,holdTime:7,outTime:1.2,speed:1,dim:45,fontSize:100,accent:'#7de4cd',secondary:'#ab83ff',textColor:'#ffffff',loop:true,reduce:false,page2:'讓光，隨文字流動\n每一個字，都有自己的節奏',page3:'下一段故事，正在靠近\n把此刻的溫柔，留在眼裡'};
const presets=[
{name:'星海接力',desc:'下段預告 · 柔和流色',values:{background:'nebula',ink:'pearl',entrance:'rise',exit:'fade',idle:'float',glow:'breathe',decoration:'none',mode:'scroll'}},
{name:'安靜閱讀',desc:'清晰固定 · 低調呼吸',values:{background:'aurora',ink:'none',entrance:'fade',exit:'fade',idle:'none',glow:'soft',decoration:'none',mode:'single'}},
{name:'月蝕詩篇',desc:'光冠 · 三段景深',values:{background:'eclipse',ink:'gold',entrance:'focus',exit:'blur',idle:'breathe',glow:'halo',decoration:'none',mode:'depth'}},
{name:'異星植物園',desc:'花瓣 · 全息文字',values:{background:'bloom',ink:'holo',entrance:'circle',exit:'fade',idle:'sway',glow:'neon',decoration:'spark',mode:'single'}},
{name:'霓虹航道',desc:'透視網格 · 左右接力',values:{background:'grid',ink:'gradient',entrance:'rise',exit:'rise',idle:'none',glow:'chromatic',decoration:'corners',mode:'horizontal'}},
{name:'無限之門',desc:'幾何深處 · 星門光暈',values:{background:'tunnel',ink:'pearl',entrance:'zoom',exit:'zoom',idle:'depth',glow:'breathe',decoration:'frame',mode:'depth'}},
{name:'海底書信',desc:'水色折光 · 玻璃底板',values:{background:'ocean',ink:'none',entrance:'diagonal',exit:'wipe',idle:'drift',glow:'soft',decoration:'glass',mode:'single'}},
{name:'天體觀測站',desc:'軌道機械 · 金屬光澤',values:{background:'orrery',ink:'gold',entrance:'flip',exit:'fade',idle:'orbit',glow:'halo',decoration:'brackets',mode:'scroll'}},
{name:'螢火夜語',desc:'光點 · 逐字微浪',values:{background:'fireflies',ink:'accent',entrance:'char-rise',exit:'sink',idle:'wave',glow:'ember',decoration:'underline',mode:'single'}},
{name:'晨光留白',desc:'暖白紙面 · 深色文字',values:{background:'paper',ink:'none',entrance:'fade',exit:'fade',idle:'none',glow:'none',decoration:'underline',mode:'single',textColor:'#263448',dim:0}}
];
function normalize(input={}){const out={...defaults};for(const g of groups)if(g.items.some(x=>x.id===input[g.id]))out[g.id]=input[g.id];for(const k of ['mode','orientation']){const allowed=k==='mode'?modes.map(x=>x.id):['landscape','portrait','square'];if(allowed.includes(input[k]))out[k]=input[k]}
for(const [k,min,max]of [['inTime',.3,4],['holdTime',2,30],['outTime',.3,4],['speed',.25,2],['dim',0,80],['fontSize',60,135]])if(Number.isFinite(Number(input[k])))out[k]=Math.max(min,Math.min(max,Number(input[k])));
for(const k of ['accent','secondary','textColor'])if(/^#[0-9a-f]{6}$/i.test(input[k]||''))out[k]=input[k];for(const k of ['loop','reduce'])if(typeof input[k]==='boolean')out[k]=input[k];for(const k of ['page2','page3'])if(typeof input[k]==='string')out[k]=input[k].slice(0,160);return out}
function label(group,id){return groups.find(g=>g.id===group)?.items.find(i=>i.id===id)?.name||id}
const api={groups,modes,defaults,presets,normalize,label};global.MotionData=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
