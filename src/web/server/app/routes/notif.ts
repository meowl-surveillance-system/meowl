import express from 'express';
import * as notifController from '../controllers/notif';

const app = express();

app.get(
  '/retrieveNotifications',
  async (req: express.Request, res: express.Response) => {
    notifController.retrieveNotifications(req, res);
  }
);

app.get(
  '/retrieveFrame/:frame_id',
  async (req: express.Request, res: express.Response) => {
    notifController.retrieveFrame(req, res);
  }
);
