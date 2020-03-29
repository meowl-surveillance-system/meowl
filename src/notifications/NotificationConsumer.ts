require('dotenv').config({ path: './keys.env'});
import * as fs from 'fs';
import sendEmail from './src/index';
import * as cassandra from 'cassandra-driver';
var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient(),
    consumer = new Consumer(
        client,
        [
            { topic: 'notif', partition: 0 }
        ],
        {
            autoCommit: false
        }
    );

    consumer.on('message', async function(message:any){
    message = JSON.parse(message.value);
    const cassClient = new cassandra.Client({
        contactPoints: ['127.0.0.1'],
        localDataCenter: 'datacenter1',
        keyspace: 'streams',
    });
    const getBlacklisted = 'SELECT * FROM blacklist WHERE name = ?';
    const getUserID = 'SELECT user_id FROM user_cameras WHERE camera_id = ?';
    const getEmail = 'SELECT email FROM users_id WHERE user_id = ?';
    const getImg = 'SELECT frame FROM cv_frames WHERE frame_id = ?';
   
    message.detections.faces.forEach((person:any) => {console.log(person);
        cassClient.execute(getBlacklisted, [person])
        .then(async function(result: any) {
            if(result.rows.length !== 0)
            {
                const owner = await cassClient.execute(getUserID, [message.camera_id], {prepare:true}).then((result:any) => {return result.rows[0].user_id;})
                const userEmail = await cassClient.execute(getEmail, [owner], {prepare:true}).then((result:any) => {return result.rows[0].email;});
                const img = await cassClient.execute(getImg, [message.frame_id], {prepare:true}).then((result:any) => {return result.rows[0].frame});
                var imageName = './img/tmp.jpg';
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
            }
        })
    });
})
