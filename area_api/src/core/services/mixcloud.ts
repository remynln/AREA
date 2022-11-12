import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import newComment from "~/areas/mixcloud/actions/newComment"
import like from "~/areas/mixcloud/reactions/like"
var MixcloudStrategy = require("passport-mixcloud").Strategy

const mixcloud: Service = {
    actions: new Map([
        ["newComment", newComment]
    ]),
    reactions: new Map([
        ["like", like]
    ]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new MixcloudStrategy(
        {
            clientID: process.env.MIXCLOUD_CLIENT_ID,
            clientSecret: process.env.MIXCLOUD_CLIENT_SECRET,
            callbackURL: process.env.DOMAIN + "/service/mixcloud/callback",
            passReqToCallback: true,
        },
        (req: any, accessToken: string, refreshToken: string, profile: any, callback: any) => {
            let cbObj: OAuthCallbackObj = {
                data: profile.username,
                accessToken: accessToken,
                refreshToken: '',
                username: profile.username
            }
            let accountToken = req.query.state;
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken, refreshToken, mail, 'mixcloud').then(() => {
                callback(null, cbObj)
            })
        }
    ),
    refreshToken: async (refreshToken) => {
        return ''
    }
}

export default mixcloud