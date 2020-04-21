import cassandra from 'cassandra-driver';
import CassandraStore from 'cassandra-store';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import path from 'path';
import {v4 as uuidv4} from 'uuid';

import {routes} from './routes/index';
import {client} from './utils/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

const cassandraStoreOptions = {
  table: 'sessions',
  client: null,
  clientOptions: {
    contactPoints: process.env.CASSANDRA_CLUSTER_IPS ?
        process.env.CASSANDRA_CLUSTER_IPS.split(' ') :
        ['localhost'],
    keyspace: 'streams',
    queryOptions: {prepare: true},
    protocolOptions: {
      port: process.env.CASSANDRA_CLUSTER_PORT ?
          Number(process.env.CASSANDRA_CLUSTER_PORT) :
          9042,
    }
  },
};

if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'likeasomebooody',
  genid: req => uuidv4(),
  cookie: {
    maxAge: 60000000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new CassandraStore(cassandraStoreOptions),
}));

// Mount the routes
app.use(routes);

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  // Serve any static files
  app.use(express.static(path.join(__dirname, './../../../client/build')));
  // Handle React routing, return all requests to React app
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, './../../../client/build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
