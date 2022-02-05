import { Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import prtscHandler from './controllers/api';
import dotenv from 'dotenv';
import path from 'path';
import { RequestWithQueryParams } from './types/request-with-query-params';
import createSlackAppReceiver from './slack';

const confResult = dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
if (confResult.error) {
  throw confResult.error
}

const { receiver } = createSlackAppReceiver(
  process.env.SLACK_BOT_TOKEN as string,
  process.env.SLACK_SIGNING_SECRET as string,
);
receiver.app.use(bodyParser.urlencoded({ extended: false }));
receiver.app.use(bodyParser.json());
receiver.app.set("port", Number(process.env.SLACK_APP_SERVER_PORT) || 3000);
receiver.app.use(receiver.router);

const paramRequirementCheck = (requiredParams: string[]) => (req: RequestWithQueryParams, res: Response, next: NextFunction) => {
  if (!requiredParams.every((param: string) => {
    return Object.keys(req.query).includes(param);
  })) {
    res.status(400).send("missing params");
    return;
  }
  next();
};

receiver.app.post('/api/prtsc', paramRequirementCheck(['url','channel_id']), prtscHandler(process.env.SLACK_BOT_TOKEN as string));

const app = receiver.app;
export default app;