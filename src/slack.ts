import { App } from '@slack/bolt';
//import puppeteer from 'puppeteer'
import dotenv from 'dotenv';
import path from 'path';
import { createModal } from './modal';
import axios, { AxiosRequestConfig } from "axios";


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

  console.log(body.view?.state.values);

  const url = body.view?.state.values.block_url.action_url.value as string;
  const width = Number(body.view?.state.values.block_width.action_width.value);
  const height = Number(body.view?.state.values.block_height.action_height.value);
  const is_full_page = !!body.view?.state.values.block_is_full_page.action_is_full_page.selected_options?.length;

  const options: AxiosRequestConfig = {
    params: {
        url: url,
        channel_id: process.env.DEFAULT_SLACK_CHANNEL_ID,
        width: width,
        height: height,
        is_full_page: is_full_page
    }
  }

  axios.post("http://localhost:9000/api/prtsc", null, options)
      .then((res) => {
          console.log(res.data)
      })
      .catch((error) => {
          console.log(error)
      })
      .then(() => {
          console.log("completed")
      });

  // let screenshot_options;
  // if (is_full_page) {
  //   screenshot_options = {
  //     fullPage: is_full_page
  //   };
  // } else {
  //   screenshot_options = {
  //     clip: {
  //       x: 0,
  //       y: 0,
  //       width: width,
  //       height: height
  //     }
  //   };
  // }

  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.goto(url);
  // const buf = await page.screenshot(screenshot_options) as Buffer;
  // await browser.close();

  // const channel_id = JSON.parse(view.private_metadata).channel_id;
  
  // try {
  //   const result = client.files.upload({
  //     channels: channel_id,
  //     initial_comment: "uploaded file",
  //     file: buf
  //   });
  //   console.log(result);
  // }
  // catch (error) {
  //   console.log(error);
  // }
});

slackApp.action("action_is_full_page", async ({ack}) => {
  await ack();
});

(async () => {
    await slackApp.start();
    console.log("waiting for requests from slack API");
})();