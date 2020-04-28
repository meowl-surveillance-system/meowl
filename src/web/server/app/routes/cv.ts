import express from 'express';
import { isLoggedIn } from '../middlewares/authChecks';
import { OPENCV_SERVICE_URL } from '../utils/settings';
import { createProxyMiddleware } from 'http-proxy-middleware';
const app = express();

app.put(
  '/upload/trainingData',
  isLoggedIn,
  createProxyMiddleware({
    onProxyReq: (proxyReq, req, res) => {
      console.log(req.session!.userId);
      proxyReq.setHeader('User-Id', req.session!.userId);
    },
    // changeOrigin: true,
    pathRewrite: {
      '^/cv/upload/trainingData': 'upload_training_data/',
    },
    target:
      OPENCV_SERVICE_URL,
  }));

module.exports = app;
