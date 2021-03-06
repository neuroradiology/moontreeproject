"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("../utils"));
const model = __importStar(require("../model"));
const queryString = __importStar(require("querystring"));
async function handleLoginPost(url, query, req, res, body, cookies) {
    let { user, password } = queryString.parse(body);
    user = user + "@" + utils.serverAddress;
    let userObject = await model.getUserByName(user);
    if (userObject
        && !userObject.banned
        && userObject.local
        && userObject.local
        && await utils.hashPassword(password, userObject.passwordSalt) == userObject.passwordHashed) {
        let session = await model.createSession();
        await model.loginSession(session, userObject);
        res.setHeader("Set-Cookie", utils.stringifyCookies({
            session: session.id
        }));
        utils.endWithRedirect(res, "/");
    }
    else {
        console.log("Error, no such user", user);
        res.end("Could not login");
    }
}
exports.handleLoginPost = handleLoginPost;
