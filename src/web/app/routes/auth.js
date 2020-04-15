"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authChecks_1 = require("../middlewares/authChecks");
const authController = __importStar(require("../controllers/auth"));
const app = express_1.default();
app.get('/isLoggedIn', (req, res) => {
    authController.isLoggedIn(req, res);
});
/**
 * Register a new user
 */
app.post('/register', [authChecks_1.isLoggedOut, authChecks_1.isValidCred, authChecks_1.isUsernameCollide], (req, res) => {
    authController.register(req, res);
});
/**
 * Login a user
 */
app.post('/login', [authChecks_1.isLoggedOut, authChecks_1.isValidCred], (req, res) => {
    authController.login(req, res);
});
/**
 * Logout a user
 */
app.post('/logout', authChecks_1.isLoggedIn, (req, res) => {
    authController.logout(req, res);
});
/**
 * Extract sessionID and userId from cookie and send it back in the response body
 */
app.post('/rtmpRequest', authChecks_1.isLoggedIn, (req, res) => {
    authController.rtmpRequest(req, res);
});
/**
 * Authenticate a user for RTMP streaming and start saving
 */
app.post('/rtmpAuthPublishStart', async (req, res) => {
    authController.rtmpAuthPublishStart(req, res);
});
/**
 * Authenticate a user for RTMP streaming and stop saving
 */
app.post('/rtmpAuthPublishStop', async (req, res) => {
    authController.rtmpAuthPublishStop(req, res);
});
/**
 * Authenticate a user for RTMP stream viewing
 */
app.post('/rtmpAuthPlay', async (req, res) => {
    authController.rtmpAuthPlay(req, res);
});
module.exports = app;
//# sourceMappingURL=auth.js.map