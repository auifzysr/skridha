import { RequestWithQueryParams } from "../types/request-with-query-params";
import puppeteer from 'puppeteer';
import { Response } from 'express';

export const getApi = (req: RequestWithQueryParams, res: Response) => {
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
};