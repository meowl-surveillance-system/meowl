import dotenv from "dotenv";

dotenv.config();

export const NGINX_HLS_SERVER_IP: string =
  process.env.NGINX_HLS_SERVER_IP || "127.0.0.1";

export const NGINX_HLS_SERVER_PORT: string =
  process.env.NGINX_HLS_SERVER_PORT || "8080";

export const ENABLE_HTTPS = false;
