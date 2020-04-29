import { Request, Response } from 'express';
import * as blacklistServices from '../services/blacklist';

export const insertBlacklist = async (req: Request, res: Response) => {
  await blacklistServices.insertBlacklist(req.params.name);
  res.status(200).send('Successfully added to blacklist');
};

