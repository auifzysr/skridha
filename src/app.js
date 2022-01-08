const puppeteer = require('puppeteer');

if (process.argv.length !== 4){
  process.exit(1);  
}

const url = process.argv[2];
const outDir = process.argv[3];


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({
    path: `${outDir}example.png`
  });

  await browser.close();
})();