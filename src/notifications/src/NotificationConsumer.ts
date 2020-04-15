import * as fs from "fs";
import sendEmail from './index';
import * as cassandra from 'cassandra-driver';
import * as kafka from 'kafka-node';
    
const client = new kafka.KafkaClient();
const consumer = new kafka.Consumer(
    client,
    [
        { topic: 'notif', partition: 0 }
    ],
    {
        autoCommit: false
    }
);

const getBlacklisted = 'SELECT * FROM blacklist WHERE name = ?';
const getUserID = 'SELECT user_id FROM camera_users WHERE camera_id = ?';
const getEmail = 'SELECT email FROM users_id WHERE user_id = ?';
const getImg = 'SELECT frame FROM cv_frames WHERE frame_id = ?';
const storeNotif = 'INSERT INTO notif (date, type, email, name, frame_id) VALUES (%s, %s, %s, %s, %s)';

consumer.on('message', async function(message:any){
    handleNotif(message);
})

export default async function handleNotif(message: any) {
    try {
        message = JSON.parse(message.value);
        const cassClient = new cassandra.Client({
            contactPoints: ['127.0.0.1'],
            localDataCenter: 'datacenter1',
            keyspace: 'streams',
        });

        message.detections.faces.forEach((person:any) => {
            cassClient.execute(getBlacklisted, [person])
            .then(async function(result: any) {
                if(result.rows.length !== 0)
                {
                    const owner = await cassClient.execute(getUserID, [message.camera_id], {prepare:true}).then((result:any) => {return result.rows[0].user_id;})
                    const userEmail = await cassClient.execute(getEmail, [owner], {prepare:true}).then((result:any) => {return result.rows[0].email;});
                    const img = await cassClient.execute(getImg, [message.frame_id], {prepare:true}).then((result:any) => {return result.rows[0].frame});
                    var imageName = '../img/tmp.jpg';
                    fs.createWriteStream(imageName).write(img);
                    const req = {
                        template: 'blacklist',
                        recipient: userEmail,
                        locals: {
                            name: person,
                            img: imageName
                        }
                    }
                    sendEmail(req)
                    await cassClient.execute(storeNotif, (Date.now(),req.template, userEmail, person, message.frame_id), {prepare:true});
                }
            })
        });
    } catch (error) {
        console.error(error);
    }
}