import express from 'express';
import bodyParser from 'body-parser';
import * as apiController from './controllers/api';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3000);
app.get("/api", apiController.getApi);

export default app;