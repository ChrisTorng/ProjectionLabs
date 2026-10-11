import { effect } from './catalog.js';
function t(id,title,category,description,technique,level,enter,exit,extra='',timing='var(--easing,ease-in-out)') {
  const css=`.fx-${id} .new{animation:enter-${id} var(--duration,4s) ${timing} infinite both}.fx-${id} .old{animation:exit-${id} var(--duration,4s) ${timing} infinite both}\n@keyframes enter-${id}{0%,8%{${enter[0]}}42%,86%{${enter[1]}}100%{${enter[0]}}}\n@keyframes exit-${id}{0%,8%{${exit[0]}}42%,86%{${exit[1]}}100%{${exit[0]}}}\n${extra}`;
  return effect(id,title,category,description,technique,level,css);
}
const still=['opacity:1','opacity:1'];
export const effects=[
  t('crossfade','交叉淡化','低調','前後畫面透明度互換，保持平穩。','opacity',1,['opacity:0','opacity:1'],['opacity:1','opacity:0']),
  t('fade-through','經黑淡入','低調','舊畫面先退去，新畫面稍晚淡入。','opacity · hold',1,['opacity:0','opacity:1'],['opacity:1','opacity:0'],'.fx-fade-through .new{animation-name:through-new}@keyframes through-new{0%,28%,100%{opacity:0}50%,86%{opacity:1}}'),
  t('soft-zoom','柔和推近','低調','新畫面微幅放大並淡入。','scale · opacity',1,['opacity:0;transform:scale(.96)','opacity:1;transform:scale(1)'],['opacity:1','opacity:0']),
  t('soft-lift','輕移交接','低調','僅以短距離上下移動切換畫面。','translateY · opacity',1,['opacity:0;transform:translateY(15px)','opacity:1;transform:translateY(0)'],['opacity:1;transform:translateY(0)','opacity:0;transform:translateY(-15px)']),
  t('push-left','向左推頁','推移','新投影片從右側推走舊投影片。','translateX',2,['transform:translateX(100%)','transform:translateX(0)'],['transform:translateX(0)','transform:translateX(-100%)']),
  t('push-right','向右推頁','推移','新投影片從左側進入。','translateX',2,['transform:translateX(-100%)','transform:translateX(0)'],['transform:translateX(0)','transform:translateX(100%)']),
  t('push-up','向上推頁','推移','下一句從畫面下方接續向上。','translateY',2,['transform:translateY(100%)','transform:translateY(0)'],['transform:translateY(0)','transform:translateY(-100%)']),
  t('cover','覆蓋滑入','推移','舊畫面不動，新畫面從右側覆蓋。','translateX · layering',2,['transform:translateX(100%)','transform:translateX(0)'],still),
  t('wipe-left','水平擦除','遮罩','裁切邊界由左到右揭露新畫面。','clip-path: inset',2,['clip-path:inset(0 100% 0 0)','clip-path:inset(0)'],still),
  t('wipe-down','垂直擦除','遮罩','新畫面從上方向下揭露。','clip-path: inset',2,['clip-path:inset(0 0 100% 0)','clip-path:inset(0)'],still),
  t('split','對開布幕','遮罩','新畫面由中央向兩邊展開。','clip-path: inset',3,['clip-path:inset(0 50%)','clip-path:inset(0)'],still),
  t('circle','圓形展開','遮罩','圓形開口從中心擴大到整張投影片。','clip-path: circle',3,['clip-path:circle(0% at 50% 50%)','clip-path:circle(75% at 50% 50%)'],still),
  t('corner','斜向揭露','遮罩','沿著三角形斜線從角落展開。','clip-path: polygon',3,['clip-path:polygon(0 0,0 0,0 0)','clip-path:polygon(0 0,200% 0,0 200%)'],still),
  t('diamond','菱形展開','遮罩','由小菱形漸漸擴大成整個畫面。','clip-path: polygon',4,['clip-path:polygon(50% 50%,50% 50%,50% 50%,50% 50%)','clip-path:polygon(50% -100%,200% 50%,50% 200%,-100% 50%)'],still),
  t('blinds','百葉窗','遮罩','多條平行窗格揭露下一張投影片。','mask-image · @property',4,['--slat:0%','--slat:100%'],still,'@property --slat{syntax:"<percentage>";inherits:false;initial-value:0%}.fx-blinds .new{mask-image:repeating-linear-gradient(90deg,#000 0 var(--slat),transparent var(--slat) 100%);mask-size:12.5% 100%}'),
  t('feather','羽化幕簾','遮罩','柔軟的漸層遮罩掃過整個畫面。','mask-position',3,['mask-position:100% 0','mask-position:0 0'],still,'.fx-feather .new{mask-image:linear-gradient(90deg,#000 40%,transparent 60%);mask-size:250% 100%}'),
  t('flip','空間翻面','立體','新舊投影片像卡片一樣交換正反面。','rotateY · perspective',4,['transform:perspective(900px) rotateY(-90deg);opacity:0','transform:perspective(900px) rotateY(0);opacity:1'],['transform:perspective(900px) rotateY(0);opacity:1','transform:perspective(900px) rotateY(90deg);opacity:0'],'.fx-flip .slide-layer{backface-visibility:hidden}'),
  t('page','側邊翻頁','立體','從左緣轉入新的一頁。','transform-origin · rotateY',4,['transform:perspective(900px) rotateY(-95deg);opacity:0','transform:perspective(900px) rotateY(0);opacity:1'],['transform:perspective(900px) rotateY(0)','transform:perspective(900px) rotateY(95deg);opacity:0'],'.fx-page .slide-layer{transform-origin:left;backface-visibility:hidden}'),
  t('cube','立方體旋轉','立體','兩個畫面以相反旋轉方向交換，形成立方體感。','rotateY · translate',4,['transform:translateX(70%) perspective(900px) rotateY(-75deg);opacity:0','transform:translateX(0) perspective(900px) rotateY(0);opacity:1'],['transform:translateX(0) perspective(900px) rotateY(0);opacity:1','transform:translateX(-70%) perspective(900px) rotateY(75deg);opacity:0']),
  t('depth-swap','景深交替','立體','舊畫面後退，新畫面從遠方推近。','scale · blur',4,['transform:scale(.4);filter:blur(8px);opacity:0','transform:scale(1);filter:blur(0);opacity:1'],['transform:scale(1);filter:blur(0);opacity:1','transform:scale(1.4);filter:blur(8px);opacity:0']),
  t('spin','旋轉切換','誇張','畫面縮小旋出，再旋入下一張。','rotate · scale',5,['transform:rotate(-120deg) scale(.2);opacity:0','transform:rotate(0) scale(1);opacity:1'],['transform:rotate(0) scale(1);opacity:1','transform:rotate(120deg) scale(.2);opacity:0']),
  t('elastic','彈性飛入','誇張','新畫面快速彈入，短暫超出再回正。','translateX · cubic-bezier',5,['transform:translateX(110%)','transform:translateX(0)'],['transform:translateX(0)','transform:translateX(-110%)'],'','cubic-bezier(.34,1.3,.64,1)'),
  t('stretch-page','拉伸換頁','誇張','把畫面壓成薄片，再展開下一張。','scaleX/Y',5,['transform:scaleX(.05) scaleY(1.4);opacity:0','transform:scale(1);opacity:1'],['transform:scale(1);opacity:1','transform:scaleX(1.4) scaleY(.05);opacity:0']),
  t('pixel-wipe','像素階梯','誇張','裁切邊緣以固定格數推進。','steps · clip-path',4,['clip-path:inset(0 100% 0 0)','clip-path:inset(0)'],still,'','steps(12,end)'),
];
effects.find(e=>e.id==='blinds').support='registered-property';
effects.find(e=>e.id==='feather').support='mask-image:linear-gradient(black,transparent)';
