import * as dotenv from 'dotenv';

dotenv.config();

if (process.env.EMAIL_ADDRESS === undefined ||
  process.env.EMAIL_PASSWORD === undefined) {
  console.error('Email Address or Password is undefined.');
}

export const EMAIL_ADDRESS: string = process.env.EMAIL_ADDRESS || '';
export const EMAIL_PASSWORD: string = process.env.EMAIL_PASSWORD || '';

export const CASSANDRA_CLUSTER_IPS: string[] =
  process.env.CASSANDRA_CLUSTER_IPS ?
    process.env.CASSANDRA_CLUSTER_IPS.split(' ') :
    ['localhost'];

export const CASSANDRA_CLUSTER_PORT: number =
  process.env.CASSANDRA_CLUSTER_PORT ?
    Number(process.env.CASSANDRA_CLUSTER_PORT) :
    9042;

export const NOTIF_IMG_PATH: string = process.env.NOTIF_IMG_PATH || '/tmp';