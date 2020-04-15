import * as sendEmail from './index';
import handleNotif from './NotificationConsumer';
import * as cassandra from 'cassandra-driver';


const message = {
    detections: ['Joe'],
    camera_id: 1,
    frame_id: 2
}

// Requires actual connection to DB which would be more of an integration test rather than unit test
it.skip('should query the DB for useful info and store notification to DB', () => {
    const cassClient = new cassandra.Client({
        contactPoints: ['127.0.0.1'],
        localDataCenter: 'datacenter1',
        keyspace: 'streams',
    });
    // cassClient.execute = jest.fn();
    const spy = jest.spyOn(sendEmail, 'default');
    handleNotif(message);
    expect(spy).toHaveBeenCalled();
})