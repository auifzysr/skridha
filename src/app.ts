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

app.post('/api/prtsc', prtscHandler(process.env.SLACK_BOT_TOKEN as string));

export default app;