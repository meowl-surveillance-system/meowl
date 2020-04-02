import * as fs from "fs";
import sendEmail from './index';
import * as cassandra from 'cassandra-driver';
import * as kafka from 'kafka-node';

jest.mock('kafka-node');

let client: kafka.KafkaClient;
const message = {
    detections: ['Joe'],
    camera_id: 1,
    frame_id: 2
}

beforeEach(() => {
    client = new kafka.KafkaClient();
    const producer = new kafka.Producer(client);
    const msg = [{
        topic: 'notif',
        messages: [message],
        partition: 0 
    }]
    producer.on('ready', () => {
        producer.send(msg, (err, data) => {
            console.log(data)
        })
    })
})

it('should consume correct message', () => {
    let data: any;
    const consumer = new kafka.Consumer(
        client,
        [
            { topic: 'notif', partition: 0 }
        ],
        {
            autoCommit: false
        }
    );

    consumer.on('message', (message) => {
        data = message.value;
    });
    console.log(data)
    console.log(message)
    expect(data).toEqual(message);
});