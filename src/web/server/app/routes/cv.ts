import express from 'express';
import { isLoggedIn } from '../middlewares/authChecks';
import { OPENCV_SERVICE_URL } from '../utils/settings';
import { createProxyMiddleware } from 'http-proxy-middleware';
const app = express();

/**
 * Redirects trainingData uploads to OpenCV app by proxying
 */
app.put(
  '/upload/trainingData',
  isLoggedIn,
  createProxyMiddleware({
    onProxyReq: (proxyReq, req, res) => {
      // Adds the user-id on the header of the proxy
      proxyReq.setHeader('User-Id', req.session!.userId);
    },
    pathRewrite: {
      '^/cv/upload/trainingData': 'upload_training_data',
    },
    target:
      OPENCV_SERVICE_URL,
  }));

module.exports = app;
