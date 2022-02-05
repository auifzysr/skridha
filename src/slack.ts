import { App, ExpressReceiver, LogLevel } from '@slack/bolt';
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

const prtscServerURL = `${process.env.PRTSC_APP_SERVER_HOST || "https://localhost"}:${process.env.PRTSC_APP_SERVER_PORT || "3000"}`

// integrates endpoint against Slack API with local server
// https://github.com/slackapi/bolt-js/issues/212
// https://github.com/slackapi/bolt-js/blob/main/src/receivers/ExpressReceiver.ts
export default function createSlackAppReceiver (
    token: string, 
    signingSecret: string,
  ) {
  const receiver = new ExpressReceiver({ 
    signingSecret,
  });
  const app = new App({ 
    token, 
    receiver,
    logLevel: LogLevel.DEBUG,
   });

  app.command('/skr', async({ack, client, say, body}) => {
    console.log("coming");
    await ack();

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

  app.view("submit", async ({body, ack}) => {
    ack();

    const url = body.view?.state.values.block_url.action_url.value as string;
    const channel_id = JSON.parse(body.view?.private_metadata).channel_id as string;
    const width = Number(body.view?.state.values.block_width.action_width.value);
    const height = Number(body.view?.state.values.block_height.action_height.value);
    const is_full_page = !!body.view?.state.values.block_is_full_page.action_is_full_page.selected_options?.length;

    const options: AxiosRequestConfig = {
      params: {
          url: url,
          channel_id: channel_id,
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

  app.action("action_is_full_page", async ({ack}) => {
    await ack();
  });
  return { receiver, app };
}
