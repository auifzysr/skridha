import { App } from '@slack/bolt';
import puppeteer from 'puppeteer'
import dotenv from 'dotenv';
import path from 'path';
import { createModal } from './modal';

const confResult = dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
if (confResult.error) {
  throw confResult.error
}

const slackApp = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    port: 3000,
});

const url = "http://example.com";

slackApp.command('/skr', async({ack, client, say, body}) => {
  ack();

  let modal_ui = createModal(JSON.stringify({
    channel_id: body.channel_id
  }));
  
  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: modal_ui
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  say(`get request`);
});

slackApp.view("submit", async ({client, body, ack, view}) => {
  ack();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url || 'https://example.com');
  const buf = await page.screenshot() as Buffer;
  await browser.close();

  const channel_id = JSON.parse(view.private_metadata).channel_id;
  
  try {
    const result = client.files.upload({
      channels: channel_id,
      initial_comment: "uploaded file",
      file: buf
    });
    console.log(result);
  }
  catch (error) {
    console.log(error);
  }
});

(async () => {
    await slackApp.start();
    console.log("waiting for requests from slack API");
})();