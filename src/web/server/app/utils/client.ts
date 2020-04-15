import cassandra from 'cassandra-driver';

export const client = new cassandra.Client({
  contactPoints: process.env.CASSANDRA_CLUSTER_IPS ?
      process.env.CASSANDRA_CLUSTER_IPS.split(' ') :
      ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'streams',
  protocolOptions: {
    port: process.env.CASSANDRA_CLUSTER_PORT ?
        Number(process.env.CASSANDRA_CLUSTER_PORT) :
        9042,
  },
});
