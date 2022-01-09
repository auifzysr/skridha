import puppeteer from 'puppeteer';
import express from 'express';
import bodyParser from 'body-parser';
import { Response } from 'express';

import { RequestWithQueryParams } from './types/request-with-query-params';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3000);
app.get("/api", (req: RequestWithQueryParams, res: Response) => {
  const url = req.query.url;
  const outDir = req.query.to;

  res.send("test");
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url || 'https://example.com');
    await page.screenshot({
      path: `${outDir || "."}example.png`
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