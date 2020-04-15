"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cassandra_driver_1 = __importDefault(require("cassandra-driver"));
exports.client = new cassandra_driver_1.default.Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1',
    keyspace: 'streams',
});
//# sourceMappingURL=client.js.map