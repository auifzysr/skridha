import axios, { AxiosRequestConfig } from "axios";
import dotenv from "dotenv";
import path from "path";

const confResult = dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
if (confResult.error) {
  throw confResult.error
}

const options: AxiosRequestConfig = {
    params: {
        url: process.env.DEFAULT_PRTSC_URL,
        channel_id: process.env.DEFAULT_SLACK_CHANNEL_ID
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