// TODO: Set up the application so that cors is only used for development
import cassandra from 'cassandra-driver';
import CassandraStore from 'cassandra-store';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import { routes } from './routes/index';
import { client } from './utils/client';

const app = express();
const port = process.env.PORT || 8081;

const cassandraStoreOptions = {
  table: 'sessions',
  client: null,
  clientOptions: {
    contactPoints: ['localhost'],
    keyspace: 'streams',
    queryOptions: { prepare: true },
  },
};

// TODO: Set up the app so that cors is only used for development
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
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
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Mount the routes
app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
