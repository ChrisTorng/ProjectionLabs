// Regression for interruptible navigation and exact proportional 16:9 mini stages.
// Run in CI with the same Playwright installation and local HTTP server as browser tests.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const output = process.env.TEST_OUTPUT || 'test-results/kinetic-slides';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));

try {
  await page.goto((process.env.BASE_URL || 'http://127.0.0.1:4173')+'/kinetic-slides/', { waitUntil:'networkidle' });
  assert.equal(await page.locator('#effect option').count(), 60);
  assert.equal(await page.locator('#next, #previous, #nextEffect, #previousEffect, #random').count(), 0,
    'redundant transport and random effect actions must not be present');
  assert.equal(await page.locator('#stageNext, #stagePrevious, #effectNext, #effectPrevious').count(), 4);

  await page.locator('#slides').fill([
    '第一頁 | 頁一', '第二頁 | 頁二', '第三頁 | 頁三', '第四頁 | 頁四'
  ].join('\n'));
  await page.locator('#reduced').check();
  for (let i=0; i<4 && !(await page.locator('#pageLabel').innerText()).startsWith('01 /'); i++)
    await page.locator('#stageNext').click();
  assert.equal(await page.locator('#pageLabel').innerText(), '01 / 04');

  await page.selectOption('#effect', 'film-strip');
  await page.locator('#duration').evaluate(e => { e.value='2400'; e.dispatchEvent(new Event('input',{bubbles:true})); });
  await page.locator('#reduced').uncheck();
  for (const expected of ['02 / 04','03 / 04','04 / 04','03 / 04','02 / 04','03 / 04','02 / 04']) {
    await page.locator(expected==='03 / 04' && (await page.locator('#pageLabel').innerText())==='04 / 04' ? '#stagePrevious' :
      expected==='02 / 04' && (await page.locator('#pageLabel').innerText())==='03 / 04' ? '#stagePrevious' : '#stageNext').click();
    assert.equal(await page.locator('#pageLabel').innerText(), expected,
      'rapid navigation must commit exactly one new page per click');
    assert.equal(await page.locator('#stageNext').isEnabled(),true);
    assert.equal(await page.locator('#stagePrevious').isEnabled(),true);
    assert.equal(await page.locator('#screen').evaluate(el=>el.classList.contains('is-playing')),true);
  }
  await page.waitForTimeout(2650);
  assert.equal(await page.locator('#pageLabel').innerText(),'02 / 04','old completion timers must not overwrite latest page');
  assert.equal((await page.locator('#fromSlide .title').innerText()).trim(),'第二頁');
  assert.equal(await page.locator('#screen').evaluate(el=>el.classList.contains('is-playing')),false);
  console.log('PASS immediate 7-click forward/back interruptible navigation with no stale-page rollback');

  await page.locator('#search').fill('膠卷');
  const filmCard=page.locator('.effect-card[data-id="film-strip"]');
  await filmCard.scrollIntoViewIfNeeded();
  await filmCard.locator('.mini-screen').waitFor({state:'attached'});
  const film = await filmCard.evaluate(card=>{
    const main=document.getElementById('screen'), mini=card.querySelector('.mini-screen');
    const mainEffect=main.dataset.effect;
    main.dataset.effect='film-strip';
    main.classList.add('is-playing');mini.classList.add('is-playing');
    const mainThickness=parseFloat(getComputedStyle(main,'::after').borderTopWidth);
    const miniThickness=parseFloat(getComputedStyle(mini,'::after').borderTopWidth);
    const scale=parseFloat(mini.style.transform.match(/scale\(([\d.]+)\)/)?.[1]||0);
    main.classList.remove('is-playing');mini.classList.remove('is-playing');
    main.dataset.effect=mainEffect;
    return {mainThickness, miniThickness, scale, previewThickness:miniThickness*scale};
  });
  assert.ok(film.mainThickness>0 && film.miniThickness>0);
  assert.ok(Math.abs(film.mainThickness-film.miniThickness)<.5,'film perforation diameter must use same design pixels');
  assert.ok(film.previewThickness < 14,'film perforations should shrink in actual miniature');
  await filmCard.screenshot({path:path.join(output,'film-strip-proportional.png')});
  console.log('PASS film-strip perforations scaled proportionally:',film);

  await page.locator('#search').fill('倒數砸落');
  const numberCard=page.locator('.effect-card[data-id="number-slam"]');
  await numberCard.scrollIntoViewIfNeeded();
  await numberCard.locator('.mini-screen').waitFor({state:'attached'});
  const numeral=await numberCard.evaluate(card=>{
    const main=document.getElementById('screen'), mini=card.querySelector('.mini-screen');
    const old=main.dataset.effect;main.dataset.effect='number-slam';
    const m=getComputedStyle(main.querySelector('.to .corner-index')).fontSize;
    const p=getComputedStyle(mini.querySelector('.to .corner-index')).fontSize;
    const thumb=card.querySelector('.thumb').getBoundingClientRect();
    const numeral=mini.querySelector('.to .corner-index').getBoundingClientRect();
    main.dataset.effect=old;
    return {main:m,mini:p,box:{left:numeral.left,right:numeral.right},thumb:{left:thumb.left,right:thumb.right}};
  });
  assert.equal(numeral.main,numeral.mini,'giant numeral must use exactly the same design font-size');
  assert.ok(numeral.box.left>=numeral.thumb.left-1 && numeral.box.right<=numeral.thumb.right+1,
    'settled giant numeral must remain within miniature stage');
  await numberCard.screenshot({path:path.join(output,'number-slam-proportional.png')});
  console.log('PASS number-slam numeral full/mini size consistency:',numeral.main);

  // All 60 effects use a single ratio: main stage -> scaled whole-stage miniature.
  await page.locator('#search').fill('');
  let minMounted=0;
  for (let i=0;i<60;i++) {
    const card=page.locator('.effect-card').nth(i);
    await card.scrollIntoViewIfNeeded({timeout:10000});
    await card.locator('.mini-screen').waitFor({state:'attached',timeout:5000});
    const dims=await card.evaluate(card=>{
      const main=document.getElementById('screen'),mini=card.querySelector('.mini-screen');
      const holder=card.querySelector('.thumb');
      const previous=main.dataset.effect;
      main.dataset.effect=card.dataset.id;
      const mainBox=main.getBoundingClientRect();
      const thumbBox=holder.getBoundingClientRect();
      const miniBox=mini.getBoundingClientRect();
      const mainTitle=getComputedStyle(main.querySelector('.from .title')).fontSize;
      const miniTitle=getComputedStyle(mini.querySelector('.from .title')).fontSize;
      const mainCorner=getComputedStyle(main.querySelector('.to .corner-index')).fontSize;
      const miniCorner=getComputedStyle(mini.querySelector('.to .corner-index')).fontSize;
      const mainPadding=getComputedStyle(main.querySelector('.from')).paddingTop;
      const miniPadding=getComputedStyle(mini.querySelector('.from')).paddingTop;
      main.dataset.effect=previous;
      return {
        id:card.dataset.id,
        stageWidth:mainBox.width,
        designWidth:parseFloat(mini.style.width),
        thumbWidth:thumbBox.width,
        renderedWidth:miniBox.width,
        mainTitle,miniTitle,mainCorner,miniCorner,mainPadding,miniPadding
      };
    });
    assert.ok(Math.abs(dims.stageWidth-dims.designWidth)<1,dims.id+': miniature design width differs from full stage');
    assert.ok(Math.abs(dims.thumbWidth-dims.renderedWidth)<1,dims.id+': miniature must fill thumbnail without clipping/overflow');
    assert.equal(dims.mainTitle,dims.miniTitle,dims.id+': title font size mismatch');
    assert.equal(dims.mainCorner,dims.miniCorner,dims.id+': corner numeral font size mismatch');
    assert.equal(dims.mainPadding,dims.miniPadding,dims.id+': slide padding mismatch');
    minMounted++;
  }
  console.log('PASS identical stage geometry and type/overlay sizes for all',minMounted,'effects');
  await page.screenshot({path:path.join(output,'proportional-catalog.png'),fullPage:true});

  await page.setViewportSize({width:390,height:844});
  // The observer needs a frame after the stage and card width change.
  await page.locator('.effect-card').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const mobile=await page.locator('.effect-card').first().evaluate(card=>{
    const main=document.getElementById('screen');
    const mini=card.querySelector('.mini-screen');
    return {mainWidth:main.getBoundingClientRect().width,designWidth:parseFloat(mini.style.width),
      visibleWidth:mini.getBoundingClientRect().width,thumbWidth:card.querySelector('.thumb').getBoundingClientRect().width,
      pageWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth};
  });
  assert.ok(Math.abs(mobile.mainWidth-mobile.designWidth)<1,'responsive stage must refit all preview design dimensions');
  assert.ok(Math.abs(mobile.visibleWidth-mobile.thumbWidth)<1,'mobile miniature must fill card proportionally');
  assert.ok(mobile.pageWidth<=mobile.viewportWidth+2);
  console.log('PASS responsive mobile miniature geometry:',mobile);
  assert.deepEqual(errors,[]);
  console.log('RESULT: responsive 60-effect scaling and interruptible navigation accepted');
} catch (error) {
  await page.screenshot({path:path.join(output,'interrupt-preview-failure.png'),fullPage:true}).catch(()=>{});
  console.error('FAIL:',error.stack||error);
  process.exitCode=1;
} finally {
  await browser.close();
}
