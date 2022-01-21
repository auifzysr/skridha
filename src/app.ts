import express from 'express';
import bodyParser from 'body-parser';
import * as apiController from './controllers/api';
import dotenv from 'dotenv';
import path from 'path';

import puppeteer, { ScreenshotOptions } from 'puppeteer'
const { WebClient, LogLevel } = require("@slack/web-api");

const confResult = dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
if (confResult.error) {
  throw confResult.error
}

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("port", Number(process.env.PORT) || 9000);
app.get("/api", apiController.getApi(process.env.SLACK_BOT_TOKEN as string, process.env.SLACK_SIGNING_SECRET as string));

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN, {
  logLevel: LogLevel.DEBUG
});

app.post('/api/prtsc', async (req, res, next) => {
  if(!req.query.url || !req.query.channel_id){
    const err = new Error('url is required');
    res.status(400);
    return next(err);
  }

  const url = req.query.url as string;
  const channel_id = req.query.channel_id as string;
  const width = Number(req.query.width) || 1920;
  const height = Number(req.query.height) || 1080;
  const is_full_page = !!req.query.is_full_screen || false;

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

})

export default app;