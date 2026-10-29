// Browser acceptance tests for the self-contained, static ProjectionLabs lab.
// Run: npm install --no-save playwright && npx playwright install chromium && node tests/kinetic-slides-browser.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const out = process.env.TEST_OUTPUT || 'test-results/kinetic-slides';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const failures = [];
const issues = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
page.on('pageerror', error => failures.push(error.message));
page.on('console', message => { if (message.type() === 'error') issues.push(message.text()); });

try {
  const response = await page.goto(base + '/kinetic-slides/', { waitUntil: 'networkidle', timeout: 30000 });
  assert.equal(response.status(), 200, 'lab must be available over HTTP');
  await page.waitForFunction(() => document.querySelectorAll('#effect option').length === 12);
  assert.equal(await page.locator('.effect-card').count(), 12, 'all 12 motion cards visible');
  const names = await page.locator('#effect option').allTextContents();
  console.log('Available effects:', names.join(' | '));

  // Standard motion tests are deterministic regardless of runner's OS preference.
  await page.locator('#reduced').uncheck();
  await page.locator('#duration').evaluate(el => { el.value = '900'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  for (const effect of await page.locator('#effect option').evaluateAll(list => list.map(node => node.value))) {
    await page.selectOption('#effect', effect);
    await page.click('#replay');
    await page.waitForTimeout(120);
    assert.equal(await page.locator('#screen').getAttribute('data-effect'), effect);
    assert.equal(await page.locator('#screen').evaluate(el => el.classList.contains('is-playing')), true);
    const animationName = await page.locator('#toSlide').evaluate(el => getComputedStyle(el).animationName);
    assert.notEqual(animationName, 'none', 'missing animation: ' + effect);
    const start = await page.locator('#screen').screenshot();
    await page.waitForTimeout(280);
    const midpoint = await page.locator('#screen').screenshot();
    assert.equal(Buffer.compare(start, midpoint) !== 0, true, 'visual frame did not change: ' + effect);
    await page.waitForTimeout(700);
    assert.equal(await page.locator('#screen').evaluate(el => el.classList.contains('is-playing')), false);
    console.log('PASS animation:', effect, '(' + animationName + ')');
  }
  await page.screenshot({ path: path.join(out, 'desktop.png'), fullPage: true });

  // Search, category filter, and manual slide navigation.
  await page.locator('#search').fill('膠卷');
  assert.equal(await page.locator('.effect-card').count(), 1);
  await page.locator('#search').fill('');
  await page.locator('[data-filter="文字編排"]').click();
  assert.equal(await page.locator('.effect-card').count(), 6);
  await page.locator('[data-filter="全部效果"]').click();
  await page.locator('#slides').fill('台北的夜景 | 第一頁\n新的投影 | 第二頁\n最後一幕 | 第三頁');
  await page.locator('#reduced').check();
  // Editing should preserve the currently selected slide; navigate to page 1 explicitly.
  for (let step = 0; step < 3 && !(await page.locator('#pageLabel').innerText()).startsWith('01 /'); step++) await page.click('#previous');
  assert.match(await page.locator('#pageLabel').innerText(), /01 \/ 03/);
  await page.click('#next');
  assert.match(await page.locator('#pageLabel').innerText(), /02 \/ 03/);
  await page.click('#previous');
  assert.match(await page.locator('#pageLabel').innerText(), /01 \/ 03/);
  await page.locator('#screen').focus();
  await page.keyboard.press('ArrowRight');
  assert.match(await page.locator('#pageLabel').innerText(), /02 \/ 03/);
  assert.equal(await page.locator('#status').innerText(), '靜態切換完成');
  console.log('PASS filter/navigation/reduced-motion');

  // A standalone file is required to run without server and without imported modules.
  const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
  await page.click('#download');
  const download = await downloadPromise;
  const target = path.join(out, 'projectionlabs-kinetic-slides.html');
  await download.saveAs(target);
  const artifact = await fs.readFile(target, 'utf8');
  assert.ok(artifact.includes('window.__kineticDefaults'), 'settings must be embedded');
  assert.ok(artifact.includes('台北的夜景'), 'edited slides must be embedded');
  assert.ok(!artifact.includes('src="app.js"'), 'no external module');
  assert.ok(!artifact.includes('href="style.css"'), 'no external CSS');
  const offline = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  offline.on('pageerror', error => failures.push('Offline: ' + error.message));
  await offline.goto('file://' + path.resolve(target), { waitUntil: 'load' });
  await offline.waitForFunction(() => document.querySelectorAll('#effect option').length === 12, { timeout: 10000 });
  assert.equal(await offline.locator('#slides').inputValue(), '台北的夜景 | 第一頁\n新的投影 | 第二頁\n最後一幕 | 第三頁');
  assert.equal(await offline.locator('#effect').inputValue(), await page.locator('#effect').inputValue());
  await offline.locator('#next').click();
  assert.match(await offline.locator('#pageLabel').innerText(), /03 \/ 03/);
  await offline.screenshot({ path: path.join(out, 'offline.png'), fullPage: true });
  await offline.close();
  console.log('PASS standalone HTML file:// playback');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(out, 'mobile.png'), fullPage: true });
  const dimensions = await page.evaluate(() => ({
    viewport: innerWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  assert.ok(dimensions.scrollWidth <= dimensions.viewport + 2, 'mobile horizontal overflow: ' + JSON.stringify(dimensions));
  console.log('PASS mobile layout:', dimensions);
  assert.deepEqual(failures, [], 'browser JavaScript failures');
  console.log('Console warnings/errors:', issues.slice(0, 10));
  console.log('RESULT: all kinetic-slides browser checks passed');
} catch (error) {
  await page.screenshot({ path: path.join(out, 'failure.png'), fullPage: true }).catch(() => {});
  console.error('FAIL:', error.stack || error);
  process.exitCode = 1;
} finally {
  await page.close();
  // Reference exploration must not fail acceptance checks for our own site.
  const reference = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    const response = await reference.goto('https://kittenjam-motion-library.vercel.app/', { waitUntil: 'domcontentloaded', timeout: 25000 });
    await reference.waitForTimeout(5000);
    const info = await reference.evaluate(() => ({
      title: document.title,
      text: document.body.innerText.slice(0, 9000),
      cards: document.querySelectorAll('article, [data-motion-id]').length
    }));
    const matches = await reference.evaluate(() => [...document.querySelectorAll('article')]
      .map(article => article.innerText.replace(/\\s+/g, ' ').slice(0, 260))
      .filter(text => text.includes('CSS') && /轉場切換|標題・Hero|版面・頁面|數字資訊/.test(text)));
    info.cssCandidates = matches;
    console.log('REFERENCE_CSS_CANDIDATES', JSON.stringify(matches.slice(0, 85)));
    await fs.writeFile(path.join(out, 'reference-inspection.json'), JSON.stringify(info, null, 2));
    await reference.screenshot({ path: path.join(out, 'reference.png'), fullPage: true });
    console.log('REFERENCE http', response.status(), 'items', info.cards, info.text.slice(0, 2000));
  } catch (error) {
    console.log('REFERENCE inspection not reachable from runner:', error.message);
  } finally {
    await reference.close();
    await browser.close();
  }
}
