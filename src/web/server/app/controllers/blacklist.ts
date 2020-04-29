import { Request, Response } from 'express';
import * as blacklistServices from '../services/blacklist';

export const retrieveBlacklist = async (req: Request, res: Response) => {
  const result = await blacklistServices.retrieveBlacklist();
  if (result === undefined) {
    res.status(400).send('No blacklist found');
  } else {
    res.status(200).json(result.rows);
  }
};

