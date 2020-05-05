import express from 'express';
import { isLoggedIn } from '../middlewares/authChecks';
import { retrieveUsernameFromUserId } from '../services/auth';
import { OPENCV_SERVICE_URL } from '../utils/settings';
import { createProxyMiddleware } from 'http-proxy-middleware';
const app = express();

/**
 * Redirects trainingData uploads to OpenCV app by proxying
 */
app.put(
  '/upload/trainingData',
  isLoggedIn,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const username = await retrieveUsernameFromUserId(req.session!.userId);
    res.locals.username = username;
    return next();
  },
  createProxyMiddleware({
    onProxyReq: (proxyReq, req, res) => {
      // Adds the user-name on the header of the proxy
      proxyReq.setHeader('User-Name', res.locals.username);
    },
    pathRewrite: {
      '^/cv/upload/trainingData': 'upload_training_data/',
    },
    target:
      OPENCV_SERVICE_URL,
  }));

module.exports = app;
