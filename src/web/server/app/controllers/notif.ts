import { Request, Response } from 'express';
import * as notifServices from '../services/notif';

export const retrieveNotifications = async (req: Request, res: Response) => {
    const result = await notifServices.retrieveNotif();
    if (result === undefined) {
      res.status(400).send('No notifications found');
    } 
    else {
      res.status(200).json(result);
    }
  };