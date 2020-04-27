import cassandra from 'cassandra-driver';
import CassandraStore from 'cassandra-store';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { routes } from './routes/index';
import { client } from './utils/client';
import {
  CASSANDRA_CLUSTER_IPS,
  CASSANDRA_CLUSTER_PORT,
  ENABLE_HTTPS,
  NODE_ENV,
  SESSION_SECRET,
  WEB_SERVER_PORT,
  NGINX_HLS_SERVER_PORT,
  NGINX_HLS_SERVER_IP,
} from './utils/settings';

const app = express();
const port = WEB_SERVER_PORT;

const cassandraStoreOptions = {
  table: 'sessions',
  client: null,
  clientOptions: {
    contactPoints: CASSANDRA_CLUSTER_IPS,
    keyspace: 'streams',
    queryOptions: { prepare: true },
    protocolOptions: {
      port: CASSANDRA_CLUSTER_PORT,
    },
  },
};

const corsOptions = {
  origin: `http${
    ENABLE_HTTPS ? 's' : ''
  }://${NGINX_HLS_SERVER_IP}:${NGINX_HLS_SERVER_PORT}`,
  optionsSuccessStatus: 200,
};

if (NODE_ENV === 'production') {
  app.use(cors(corsOptions));
} else {
  app.use(cors());
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: SESSION_SECRET,
    genid: req => uuidv4(),
    cookie: {
      maxAge: 60000000,
      secure: ENABLE_HTTPS,
      sameSite: true,
    },
    resave: false,
    saveUninitialized: true,
    store: new CassandraStore(cassandraStoreOptions),
  })
);

// Mount the routes
app.use(routes);

if (NODE_ENV === 'production') {
  console.log('Meowl Web Server now in production mode!');
  app.use(compression());
  // Serve any static files
  app.use(express.static(path.join(__dirname, './../../../client/build')));
  // Handle React routing, return all requests to React app
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './../../../client/build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Meowl Web Server listening on port ${port}!`);
});
