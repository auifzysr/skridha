import { RequestWithQueryParams } from "../types/request-with-query-params";
import { NextFunction, Response } from 'express';
import puppeteer, { ScreenshotOptions } from 'puppeteer'
const { WebClient, LogLevel } = require("@slack/web-api");

// TODO: typedef Request with params
export const prtscHandler = (slackBotToken: string) => (req: RequestWithQueryParams, res: Response , next: NextFunction) => {
  const slackClient = new WebClient(slackBotToken, {
    logLevel: LogLevel.DEBUG
  });
  if(!req.query.url || !req.query.channel_id){
  const err = new Error('url is required');
    res.status(400);
    return next(err);
  }

  const url = req.query.url as string;
  const channel_id = req.query.channel_id as string;
  const width = Number(req.query.width) || 1920;
  const height = Number(req.query.height) || 1080;
  const is_full_page = !!req.query.is_full_page || false;

  res.status(201).json();

  let screenshot_options: ScreenshotOptions;
  if (is_full_page) {
    screenshot_options = {
      fullPage: is_full_page
    };
  } else {
    screenshot_options = {
      clip: {
        x: 0,
        y: 0,
        width: width,
        height: height
      }
    };
  }

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const buf = await page.screenshot(screenshot_options) as Buffer;
    await browser.close();

    try {
        const result = await slackClient.files.upload({
        channels: channel_id,
        initial_comment: "prtsc invoked by api",
        file: buf
        });
        console.log(result);
    } catch (error) {
        console.error(error);
    }
  })();
};

export default prtscHandler;