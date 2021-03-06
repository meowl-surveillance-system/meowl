import dotenv from 'dotenv';

dotenv.config();

export const CASSANDRA_FLASK_SERVICE_URL: string =
  process.env.CASSANDRA_FLASK_SERVICE_URL || 'http://localhost:5000/';

export const WEB_SERVER_PORT: number =
  Number(process.env.WEB_SERVER_PORT) || 8081;

export const CASSANDRA_CLUSTER_IPS: string[] = process.env.CASSANDRA_CLUSTER_IPS
  ? process.env.CASSANDRA_CLUSTER_IPS.split(' ')
  : ['localhost'];

export const CASSANDRA_CLUSTER_PORT: number = process.env.CASSANDRA_CLUSTER_PORT
  ? Number(process.env.CASSANDRA_CLUSTER_PORT)
  : 9042;

export const OPENCV_SERVICE_URL: string =
  process.env.OPENCV_SERVICE_URL || 'http://localhost:5000/';

export const SESSION_SECRET: string =
  process.env.SESSION_SECRET || 'likeasomebooody';

export const NGINX_HLS_SERVER_IP: string =
  process.env.NGINX_HLS_SERVER_IP || '127.0.0.1';

export const NGINX_HLS_SERVER_PORT: string =
  process.env.NGINX_HLS_SERVER_PORT || '8080';

// TODO: Create HTTPS for web server
export const ENABLE_HTTPS = false;

export const NODE_ENV: string = process.env.NODE_ENV || 'development';

export const REACT_SERVER_URL: string =
  process.env.REACT_SERVER_URL || 'http://localhost:3000';

export const EMAIL: string = process.env.EMAIL_ADDRESS || 'something@example.com';

export const EMAIL_PASSWORD: string = process.env.EMAIL_PASSWORD || 'yes';
