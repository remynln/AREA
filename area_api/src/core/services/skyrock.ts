import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import axios from "axios";
import { OAuth } from "oauth";
import addPost from "~/areas/skyrock/reactions/addPost"
import newPost from "~/areas/skyrock/actions/newPost"
import newComment from "~/areas/skyrock/actions/newComment"
var SkyrockStrategy = require("~/strategies/skyrock");

const skyrock: Service = {
    actions: new Map([
        ["newPost", newPost],
        ["newComment", newComment]
    ]),
    reactions: new Map([
        ["addPost", addPost]
    ]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force',
        stateInQuery: true
    },
    strategy: new SkyrockStrategy(
        {
            consumerKey: process.env.SKYROCK_CLIENT_ID,
            consumerSecret: process.env.SKYROCK_CLIENT_SECRET,
            callbackURL: process.env.DOMAIN + "/service/skyrock/callback",
            passReqToCallback: true,
            trelloParams: {
                scope: "read,write",
                name: "MyApp",
                expiration: "never"
            },
        },
        (req: any, accessToken: string, refreshToken: string, profile: any, callback: any) => {
            let oauth = new OAuth(
                "",
                "",
                process.env.SKYROCK_CLIENT_ID || '',
                process.env.SKYROCK_CLIENT_SECRET || '',
                "1.0",
                null,
                "HMAC-SHA1"
            )
            axios.get("https://api.skyrock.com/v2/user/get.json", {
                headers: {
                    "authorization": oauth.authHeader("https://api.skyrock.com/v2/user/get.json",
                        accessToken, refreshToken, "GET")
                }
            }).then((res) => {
                let cbObj: OAuthCallbackObj = {
                    data: res.data.id_user.toString(),
                    accessToken: accessToken + " " + refreshToken,
                    refreshToken: '',
                    username: res.data.username
                }
                let accountToken = req.query.state;
                if (!accountToken || !accountToken.includes(' ')) {
                    callback(null, cbObj)
                    return
                }
                let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
                db.setToken(accessToken + " " + refreshToken, "", mail, 'skyrock').then(() => {
                    callback(null, cbObj)
                })    
            }).catch((err) => {
                callback(err)
            })
        }
    ) as any,
    refreshToken: async (refreshToken) => {
        return ''
    }
}

export default skyrock