import { Request, Response } from 'express';

import * as apiServices from '../services/api';

export const retrieveStreamIds = async (req: Request, res: Response) => {
  const cameraId = req.params.cameraId;
  const result = await apiServices.retrieveStreamIds(cameraId);
  if (result === undefined) {
    res.status(400).send('Invalid cameraId');
  } else {
    const streamIds = result.rows.map((row) => {
      const key = Object.keys(row)[0];
      return row[key]; 
    });
    console.log(streamIds);
    res.status(200).json(streamIds);
  }
};

export const storeStreamId = async (req: Request, res: Response) => {
  const { cameraId, streamId } = req.body;
  try {
    await apiServices.storeStreamId(cameraId, streamId);
    res.status(200).send('OK');
  }
  catch(e) {
    console.log(e);
    res.status(500).send('Server error');
  }
};
