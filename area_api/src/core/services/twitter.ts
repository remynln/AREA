import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import { Strategy as TwitterStartegy } from "passport-twitter";

const twitter: Service = {
    actions: new Map([]),
    reactions: new Map([]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new TwitterStartegy(
        {
            consumerKey: process.env.TWITTER_CLIENT_ID || '',
            consumerSecret: process.env.TWITTER_CLIENT_SECRET || '',
            callbackURL: "http://localhost:8080/service/twitter/callback",
            passReqToCallback: true,
            includeStatus: true
        },
        (req, accessToken, refreshToken, profile, callback) => {
            console.log("tok", req.query.state)
            let cbObj: OAuthCallbackObj = {
                data: profile.id.toString(),
                accessToken: accessToken,
                refreshToken: refreshToken,
                username: profile.displayName
            }
            console.log(cbObj)
            let accountToken = req.query.state as string;
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken, refreshToken, mail, 'twitter').then(() => {
                callback(null, cbObj)
            })
        }
    ),
    refreshToken: async (refreshToken) => {
        return ''
    }
}

export default twitter