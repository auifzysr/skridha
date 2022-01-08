// import puppeteer from 'puppeteer';
import express from 'express';

// if (process.argv.length !== 4){
//   process.exit(1);  
// }

// const url = process.argv[2];
// const outDir = process.argv[3];

const app = express();
app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode.",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press ctrl-c to stop.\n");
});

export default server;


// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(url);
//   await page.screenshot({
//     path: `${outDir}example.png`
//   });
//   await browser.close();
// })();