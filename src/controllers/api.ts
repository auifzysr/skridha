import { RequestWithQueryParams } from "../types/request-with-query-params";
import puppeteer from 'puppeteer';
import { Response } from 'express';

const scFilename = 'example.png';

export const getApi = (token: string, signingSecret: string) => (req: RequestWithQueryParams, res: Response) => {
    const url = req.query.url;
    const outDir = req.query.to;

    res.send("test");

    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url || 'https://example.com');
        await page.screenshot({
        path: `${outDir || "./"}${scFilename}`
        });
        await browser.close();
    })();
};