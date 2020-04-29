import express from 'express';
import * as blacklistController from '../controllers/blacklist';

const app = express();

app.get(
  '/retrieveBlacklist',
  async (req: express.Request, res: express.Response) => {
    blacklistController.retrieveBlacklist(req, res);
  }
);

