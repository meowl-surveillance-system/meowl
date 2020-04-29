import express from 'express';
import * as blacklistController from '../controllers/blacklist';

const app = express();

app.get(
  '/insertBlacklist',
  async (req: express.Request, res: express.Response) => {
    blacklistController.insertBlacklist(req, res);
  }
);

