// TODO: Set up the application so that cors is only used for development
const cors = require('cors');
const express = require('express');
const cassandra = require('cassandra-driver');
const CassandraStore = require('cassandra-store');
const session = require('express-session');
const uuid = require('uuid');
const routes = require('./routes');
const client = require('./utils/client');

const app = express();
const port = process.env.PORT || 8081;

const cassandraStoreOptions = {
  "table": "sessions",
  "client": null,
  "clientOptions": {
    "contactPoints": [ "localhost" ],
    "keyspace": "streams",
    "queryOptions": {
      "prepare": true
    }
  }
};


// TODO: Set up the app so that cors is only used for development
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'likeasomebooody',
  genid: function(req) {
    return uuid.v4();
  },
  cookie: {
    maxAge: 60000000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: true
  },
  resave: false,
  saveUninitialized: true,
  store: new CassandraStore(cassandraStoreOptions)
}));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

// Mount the routes
app.use(routes);

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
});
