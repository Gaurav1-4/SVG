const puppeteer = require('puppeteer');
(async () => {
try {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => { if (msg.type() === 'error') console.log('ERR:', msg.text()); });
  page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));
  await page.goto('https://tr-traders.vercel.app');
  await new Promise(r => setTimeout(r, 3000));
  const html = await page.content();
  if (html.includes('hero-logo-wrap')) {
    console.log('OUTPUT: React rendered successfully on Vercel.');
  } else {
    console.log('OUTPUT: React failed to render.');
  }
  await browser.close();
} catch (e) {
  console.log('SCR ERROR:', e.message);
}
})();
