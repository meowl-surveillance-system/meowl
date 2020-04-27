import express from 'express';
import { isLoggedIn } from '../middlewares/authChecks';
import axios from 'axios';
import formidible from 'formidable';
import url from 'url';
import { OPENCV_SERVICE_URL } from '../utils/settings';
const app = express();

app.put(
  '/upload/trainingData',
  isLoggedIn,
  (req: express.Request, res: express.Response) => {
    const openCVServiceUrl: string = url.resolve(
      OPENCV_SERVICE_URL,
      ''
    );
    const form = new formidible.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(400).send(err);
      }
      else {
        axios.put(openCVServiceUrl, files, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        res.status(200).send(`Successfully recieved ${Object.keys(files).toString()}`);
      }
    });
  }
);

module.exports = app;
