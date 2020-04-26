import * as sendEmail from './sendEmail';
import handleNotif from '.';
import * as cassandra from 'cassandra-driver';
import * as kafka from 'kafka-node';

const message: kafka.Message = {
    topic: 'notif',
    value: '{"detections": { "faces": ["Joe"]},"camera_id": 1,"frame_id": 2}'
}

it('should query the DB for useful info and store notification to DB', () => {
    const cassClient = new cassandra.Client({
        contactPoints: ['127.0.0.1'],
        localDataCenter: 'datacenter1',
        keyspace: 'streams',
    });
    cassClient.execute = jest.fn();
    //const spy = jest.spyOn(cassClient, 'execute');
    handleNotif(message, cassClient);
    expect(cassClient.execute).toHaveBeenCalled();
})