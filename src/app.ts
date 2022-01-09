import express from 'express';
import bodyParser from 'body-parser';
import * as apiController from './controllers/api';
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
app.set("port", Number(process.env.PORT) || 9000);
app.get("/api", apiController.getApi(process.env.SLACK_BOT_TOKEN as string, process.env.SLACK_SIGNING_SECRET as string));

export default app;