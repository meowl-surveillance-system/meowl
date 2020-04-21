import cassandra from 'cassandra-driver';
import {CASSANDRA_CLUSTER_IPS, CASSANDRA_CLUSTER_PORT} from './settings';

export const client = new cassandra.Client({
  contactPoints: CASSANDRA_CLUSTER_IPS,
  localDataCenter: 'datacenter1',
  keyspace: 'streams',
  protocolOptions: {
    port: CASSANDRA_CLUSTER_PORT,
  },
});
