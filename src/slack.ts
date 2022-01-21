import { App } from '@slack/bolt';
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

const prtscServerURL = `${process.env.PRTSC_APP_SERVER_HOST || "https://localhost"}:${process.env.PRTSC_APP_SERVER_PORT || "9000"}`

const slackApp = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    port: Number(process.env.SLACK_APP_SERVER_PORT) || 3000,
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

  axios.post(`${prtscServerURL}/api/prtsc`, null, options)
      .then((res) => {
          console.log(res.data)
      })
      .catch((error) => {
          console.log(error)
      })
      .then(() => {
          console.log("completed")
      });

  });

slackApp.action("action_is_full_page", async ({ack}) => {
  await ack();
});

(async () => {
    await slackApp.start();
    console.log("waiting for requests from slack API");
})();