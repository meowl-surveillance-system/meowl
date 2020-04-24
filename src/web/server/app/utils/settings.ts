import dotenv from 'dotenv';

dotenv.config();

export const CASSANDRA_FLASK_SERVER_URL: string =
    process.env.CASSANDRA_FLASK_SERVER_URL || 'http://localhost:5000/';

export const WEB_SERVER_PORT: number =
    Number(process.env.WEB_SERVER_PORT) || 8081;

export const CASSANDRA_CLUSTER_IPS: string[] =
    process.env.CASSANDRA_CLUSTER_IPS ?
    process.env.CASSANDRA_CLUSTER_IPS.split(' ') :
    ['localhost'];

export const CASSANDRA_CLUSTER_PORT: number =
    process.env.CASSANDRA_CLUSTER_PORT ?
    Number(process.env.CASSANDRA_CLUSTER_PORT) :
    9042;

export const SESSION_SECRET: string =
    process.env.SESSION_SECRET || 'likeasomebooody';

// TODO: Create HTTPS for web server
export const ENABLE_HTTPS: boolean = false;

export const NODE_ENV: string = process.env.NODE_ENV || 'development';