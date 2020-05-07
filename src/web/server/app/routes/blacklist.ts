import express from 'express';
import * as blacklistController from '../controllers/blacklist';

const app = express();

app.post(
  '/insertBlacklist',
  async (req: express.Request, res: express.Response) => {
    blacklistController.insertBlacklist(req, res);
  }
);

module.exports = app;