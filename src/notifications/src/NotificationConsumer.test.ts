import * as fs from "fs";
import sendEmail from './index';
import * as cassandra from 'cassandra-driver';
import * as kafka from 'kafka-node';

jest.mock('kafka-node');

let client: kafka.KafkaClient;
let consumer: kafka.Consumer;
const message = {
    detections: ['Joe'],
    camera_id: 1,
    frame_id: 2
}

beforeEach(() => {
    client = new kafka.KafkaClient();
    const producer = new kafka.Producer(client);
    consumer = new kafka.Consumer(
        client,
        [
            { topic: 'notif', partition: 0 }
        ],
        {
            autoCommit: false
        }
    );
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

    consumer.on('message', (message) => {
        data = message.value;
        expect(data).toEqual(message);
    });
});

// Can't import specific consumer to emulate the specific behavior being performed
it.skip('should query the DB for useful info and store notification to DB', () => {
    const cassClient = new cassandra.Client({
        contactPoints: ['127.0.0.1'],
        localDataCenter: 'datacenter1',
        keyspace: 'streams',
    });
    cassClient.execute = jest.fn();

    consumer.on('message', (message) => {

    })
})