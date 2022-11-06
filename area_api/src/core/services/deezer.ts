import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
var DeezerStrategy = require("passport-deezer").Strategy

const deezer: Service = {
    actions: new Map([]),
    reactions: new Map([]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new DeezerStrategy(
        {
            clientID: process.env.DEEZER_CLIENT_ID,
            clientSecret: process.env.DEEZER_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/service/deezer/callback",
            passReqToCallback: true,
            scope: ["manage_library", "offline_access", "listening_history"]
        },
        (req: any, accessToken: string, refreshToken: string, profile: any, callback: any) => {
            let cbObj: OAuthCallbackObj = {
                data: profile.id.toString(),
                accessToken: accessToken,
                refreshToken: '',
                username: profile.displayName
            }
            console.log(cbObj)
            let accountToken = req.query.state;
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken, refreshToken, mail, 'deezer').then(() => {
                callback(null, cbObj)
            })
        }
    ),
    refreshToken: async (refreshToken) => {
        return ''
    }
}

export default deezer