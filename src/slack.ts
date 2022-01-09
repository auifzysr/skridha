import { App } from '@slack/bolt';

import dotenv from 'dotenv';
import path from 'path';

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

slackApp.command('/skr', async({ack, say}) => {
    ack();
    say(`get request`);
});

(async () => {
    await slackApp.start();
    console.log("waiting for requests from slack API");
})();