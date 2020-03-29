import { Request, Response } from 'express';

import * as apiServices from '../services/api';

export const retrieveStreamIds = async (req: Request, res: Response) => {
  const canView = await apiServices.verifyUserCamera(
    req.session!.userId,
    req.params.cameraId
  );
  if (canView) {
    const cameraId = req.params.cameraId;
    const result = await apiServices.retrieveStreamIds(cameraId);
    if (result === undefined) {
      res.status(400).send('Invalid cameraId');
    } else {
      const streamIds = result.rows.map(row => {
        const key = Object.keys(row)[0];
        return row[key];
      });
      console.log(streamIds);
      res.status(200).json(streamIds);
    }
  } else {
    res.status(400).send('Cant view this camera');
  }
};

export const retrieveLiveStreamId = async (req: Request, res: Response) => {
  const cameraId = req.params.cameraId;
  const result = await apiServices.retrieveLiveStreamId(cameraId);
  if (result === undefined) {
    res.status(400).send('Invalid cameraId');
  } else {
    const key = Object.keys(result.rows[0])[0];
    const streamId = result.rows[0][key];
    res.status(200).json(streamId);
  }
};

export const retrieveLiveCameraStreamIds = async (req: Request, res: Response) => {
  const result = await apiServices.retrieveLiveCameraStreamIds(req.session!.userId);
  if (result === undefined) {
    res.status(400).send('Unable to retrieve camera streams');
  } else {
    res.status(200).json(result);
  }
};

export const storeStreamId = async (req: Request, res: Response) => {
  const { cameraId, streamId } = req.body;
  try {
    await apiServices.storeStreamId(cameraId, streamId);
    res.status(200).send('OK');
  } catch (e) {
    console.log(e);
    res.status(500).send('Server error');
  }
};

export const retrieveCameraIds = async (req: Request, res: Response) => {
  const result = await apiServices.retrieveCameraIds(req.session!.userId);
  if (result === undefined) {
    res.status(400).send('Invalid cameraId');
  } else {
    const streamIds = result.rows.map(row => {
      const key = Object.keys(row)[0];
      return row[key];
    });
    console.log(streamIds);
    res.status(200).send(streamIds);
  }
};
