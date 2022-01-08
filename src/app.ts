import puppeteer from 'puppeteer';
import express from 'express';
import { Response, Request } from 'express';

const url = "https://example.com";
const outDir = "./";

const app = express();
app.set("port", process.env.PORT || 3000);
app.get("/api", (req: Request, res: Response) => {
  res.send("test");
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({
      path: `${outDir}example.png`
    });
    await browser.close();
  })();
});

const server = app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode.",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press ctrl-c to stop.\n");
});

export default server;