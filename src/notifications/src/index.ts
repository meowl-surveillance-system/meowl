import * as fs from "fs";
import sendEmail from './sendEmail';
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
const storeNotif = 'INSERT INTO notif (date, type, email, name, frame_id) VALUES (?, ?, ?, ?, ?)';

consumer.on('message', async function(message: kafka.Message){
    const cassClient = new cassandra.Client({
        contactPoints: ['127.0.0.1'],
        localDataCenter: 'datacenter1',
        keyspace: 'streams',
    });
    handleNotif(message, cassClient);
})

export default async function handleNotif(message: any, cassClient: cassandra.Client) {
    try {
        message = JSON.parse(message.value);

        message.detections.faces.forEach((person:string) => {
            cassClient.execute(getBlacklisted, [person], {prepare:true}, async function(err, result) {
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
                    await cassClient.execute(storeNotif, [Date.now(),req.template, userEmail, person, message.frame_id], {prepare:true});
                }
            })    
        });
    } catch (error) {
        console.error(error);
    }
}