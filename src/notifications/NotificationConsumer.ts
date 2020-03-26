import fs from "fs";
const index = require('./index');
const cassandra = require('cassandra-driver');
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

consumer.on('message', function(message){
    console.log(message);
    const cassClient = new cassandra.Client({
        contactPoints: ['127.0.0.1'],
        localDataCenter: 'datacenter1',
        keyspace: 'streams',
    });
    const getBlacklisted = 'SELECT name FROM blacklist WHERE key = ?';
    const getUserID = 'SELECT user_id FROM user_cameras WHERE camera_id = ?';
    const getEmail = 'SELECT email FROM users_id WHERE user_id = ?';
    const getImg = 'SELECT frame FROM cv_frames WHERE frame_id = ?';
    message.list.array.forEach(person => {
        client.execute(getBlacklisted, [person])
        .then(result => {
            if(result.rows.length !== 0)
            {
                const owner = client.execute(getUserID, [message.camera_id]).then(result => {return result});
                const userEmail = client.execute(getEmail, [owner]).then(result => {return result});
                const img = client.execute(getImg, [message.frame_id]).then(result => {return result});
                var imageBuffer = img.file.buffer;
                var imageName = '/img/tmp.jpg';
                fs.createWriteStream(imageName).write(imageBuffer);
                const req = {
                    template: 'blacklist',
                    recipient: userEmail,
                    locals: {
                        name: person,
                        img: message.img
                    }
                }
                index.sendEmail(req)
            }
        })
    });
})

    