"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../utils/client");
const queries_1 = require("../utils/queries");
async function isCollideHelper(username) {
    const result = await client_1.client.execute(queries_1.SELECT_USERSNAME_USERID, [username], {
        prepare: true,
    });
    return result.rows.length !== 0;
}
exports.isCollideHelper = isCollideHelper;
//# sourceMappingURL=helpers.js.map