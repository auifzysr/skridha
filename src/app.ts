import express, { Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import prtscHandler from './controllers/api';
import dotenv from 'dotenv';
import path from 'path';
import { RequestWithQueryParams } from './types/request-with-query-params';

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

const paramRequirementCheck = (requiredParams: string[]) => (req: RequestWithQueryParams, res: Response, next: NextFunction) => {
  if (!requiredParams.every((param: string) => {
    return Object.keys(req.query).includes(param);
  })) {
    res.status(400).send("missing params");
    return;
  }
  next();
};

app.post('/api/prtsc', paramRequirementCheck(['url','channel_id']), prtscHandler(process.env.SLACK_BOT_TOKEN as string));

export default app;