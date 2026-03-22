const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE CONSOLE ERROR:', msg.text());
    } else {
      console.log('PAGE LOG:', msg.text());
    }
  });
  page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));
  
  const response = await page.goto('http://localhost:4173');
  console.log('Got response status:', response.status());
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const content = await page.content();
  if (content.indexOf('<div id="root"></div>') > -1 || content.length < 500) {
     console.log('Warning: Page looks empty or root div is empty.');
  } else {
     console.log('Page seems to have rendered successfully inside root.');
  }
  
  await browser.close();
})();
