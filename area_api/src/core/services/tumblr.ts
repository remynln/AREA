import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import axios from "axios";
var TumblrStrategy = require("passport-tumblr").Strategy

const tumblr: Service = {
    actions: new Map([
    ]),
    reactions: new Map([
    ]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new TumblrStrategy({
            consumerKey: process.env.TUMBLR_CLIENT_ID,
            consumerSecret: process.env.TUMBLR_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/service/tumblr/callback",
            passReqToCallback: true,
            scope:  []
        },
        (req: any, accessToken: string, refreshToken: string, profile: any, _:any, callback: any) => {
            console.log("profile",profile)
            console.log("access token",accessToken)
            console.log("refresh token",refreshToken)
            let cbObj: OAuthCallbackObj = {
                data: profile,
                accessToken: accessToken,
                refreshToken: refreshToken,
                username: profile.displayName
            }
            console.log(cbObj)
            let accountToken = req.query.state;
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken, refreshToken, mail, 'tumblr').then(() => {
                callback(null, cbObj)
            })
        }
    ),
    refreshToken: async (refreshToken) => {
        let res
        try {
            console.log("ref", refreshToken)
            res = await axios.post("https://www.tumblr.com/oauth/request_token", new URLSearchParams({
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                client_id: process.env.TUMBLR_CLIENT_ID || '',
                client_secret: process.env.TUMBLR_CLIENT_SECRET || ''
            }))
            console.log(res)
            if (!res.data.access_token)
                return null
            return res.data.access_token
        } catch (err: any) {
            if (err.response && err.response.status == 401)
                return null
            throw err
        }
    }
}

export default tumblr