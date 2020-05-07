import * as cassandra from 'cassandra-driver';
import * as fs from 'fs';
import * as kafka from 'kafka-node';

import sendEmail from './sendEmail';
import { v4 as uuidv4 } from 'uuid';
import { CASSANDRA_CLUSTER_IPS, CASSANDRA_CLUSTER_PORT, NOTIF_IMG_PATH } from './settings';

const client = new kafka.KafkaClient();
const consumer = new kafka.Consumer(
  client, [{
    topic: 'notif',
    partition: 0,
  }],
  {
    autoCommit: false,
  });

const getBlacklisted = 'SELECT * FROM blacklist WHERE name = ?';
const getUserID = 'SELECT user_id FROM camera_users WHERE camera_id = ?';
const getEmail = 'SELECT email FROM users_id WHERE user_id = ?';
const getImg = 'SELECT frame FROM cv_frames WHERE frame_id = ? AND stream_id = ?';
const storeNotif =
  'INSERT INTO notif (date, type, email, name, frame_id, stream_id) VALUES (?, ?, ?, ?, ?, ?)';

consumer.on('message', async function (message: kafka.Message) {
  const cassClient = new cassandra.Client({
    contactPoints: CASSANDRA_CLUSTER_IPS,
    localDataCenter: 'datacenter1',
    keyspace: 'streams',
    protocolOptions: {
      port: CASSANDRA_CLUSTER_PORT,
    }
  });
  handleNotif(message, cassClient);
})

export default async function handleNotif(
  message: any, cassClient: cassandra.Client) {
  try {
    message = JSON.parse(message.value);

    message.detections.faces.forEach((person: string) => {
      cassClient.execute(
        getBlacklisted, [person], { prepare: true },
        async (err: Error, result: cassandra.types.ResultSet) => {
          if (result.rows && result.rows.length !== 0) {
            const owner =
              await cassClient
                .execute(getUserID, [message.camera_id], { prepare: true })
                .then((result: any) => {
                  return result.rows[0].user_id;
                });
            const userEmail =
              await cassClient.execute(getEmail, [owner], { prepare: true })
                .then((result: any) => {
                  return result.rows[0].email;
                });
            const img =
              await cassClient
                .execute(getImg, [message.frame_id, message.stream_id], { prepare: true })
                .then((result: any) => {
                  return result.rows[0].frame;
                });
            const imageName = `${NOTIF_IMG_PATH}/${uuidv4()}.jpg`;
            fs.writeFileSync(imageName, img, 'binary');
            const req = {
              template: 'blacklist',
              recipient: userEmail,
              locals: {
                name: person,
                img: imageName,
              }
            };
            sendEmail(req);
            await cassClient.execute(
              storeNotif,
              [Date.now(), req.template, userEmail, person,
              message.frame_id, message.stream_id],
              { prepare: true });
          }
        });
    });
  } catch (error) {
    console.error(error);
  }
}