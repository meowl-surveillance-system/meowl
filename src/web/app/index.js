"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cassandra_store_1 = __importDefault(require("cassandra-store"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const uuid_1 = require("uuid");
const index_1 = require("./routes/index");
const app = express_1.default();
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
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_session_1.default({
    secret: process.env.SESSION_SECRET || 'likeasomebooody',
    genid: req => uuid_1.v4(),
    cookie: {
        maxAge: 60000000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: true,
    },
    resave: false,
    saveUninitialized: true,
    store: new cassandra_store_1.default(cassandraStoreOptions),
}));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Mount the routes
app.use(index_1.routes);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
//# sourceMappingURL=index.js.map