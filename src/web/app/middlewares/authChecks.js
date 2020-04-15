"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
/**
 * Checks if a user is already logged in
 * @param req - The incoming HTTP request
 * @param res - The HTTP response to be sent
 * @param next - The next middleware in the chain
 */
function isLoggedIn(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    else {
        res.status(400).send('Not logged in');
    }
}
exports.isLoggedIn = isLoggedIn;
/**
 * Checks if a user is logged out
 * @param req - The incoming HTTP request
 * @param res - The HTTP response to be sent
 * @param next - The next middleware in the chain
 */
function isLoggedOut(req, res, next) {
    if (req.session.userId) {
        res.status(400).send('Not logged out');
    }
    else {
        return next();
    }
}
exports.isLoggedOut = isLoggedOut;
/**
 * Checks is username or password is empty
 * @param req - The incoming HTTP request
 * @param res - The HTTP response to be sent
 * @param next - The next middleware in the chain
 */
function isValidCred(req, res, next) {
    const { username, password } = req.body;
    if (username && password) {
        return next();
    }
    else {
        res.status(400).send('Bad username or password');
    }
}
exports.isValidCred = isValidCred;
/**
 * Checks if username already exists in database
 * @param req - The incoming HTTP request
 * @param res - The HTTP response to tbe sent
 * @param next - The next middleware in the chain
 */
async function isUsernameCollide(req, res, next) {
    const { username } = req.body;
    const result = await helpers_1.isCollideHelper(username);
    if (!result) {
        return next();
    }
    else {
        res.status(400).send('Bad username');
    }
}
exports.isUsernameCollide = isUsernameCollide;
//# sourceMappingURL=authChecks.js.map