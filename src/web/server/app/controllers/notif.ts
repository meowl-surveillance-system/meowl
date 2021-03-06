import { Request, Response } from 'express';
import * as notifServices from '../services/notif';

export const retrieveNotifications = async (req: Request, res: Response) => {
  const result = await notifServices.retrieveNotif();
  if (result === undefined) {
    res.status(400).json('No notifications found');
  } else {
    res.status(200).json(result.rows);
  }
};

export const retrieveFrame = async (req: Request, res: Response) => {
  const result = await notifServices.retrieveFrame(
    req.params.frame_id,
    req.params.stream_id
  );
  if (result === undefined) {
    res.status(400).json('Frame not found');
  } else {
    res.status(200).json(result.rows[0]);
  }
};
