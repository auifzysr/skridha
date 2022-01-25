import express from 'express';
import bodyParser from 'body-parser';
import prtscHandler from './controllers/api';
import dotenv from 'dotenv';
import path from 'path';

const confResult = dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
if (confResult.error) {
  throw confResult.error
}

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("port", Number(process.env.PRTSC_APP_SERVER_PORT) || 9000);

<<<<<<< HEAD
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

  // TODO: fix ambiguous conditions: width, height, fullPage
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

  const browser = await puppeteer.launch({defaultViewport: null});
  const page = await browser.newPage();
  await page.setViewport({
    width: width,
    height: height
  })
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
=======
app.post('/api/prtsc', prtscHandler(process.env.SLACK_BOT_TOKEN as string));
>>>>>>> Move controllers

export default app;