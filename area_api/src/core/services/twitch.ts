import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import axios from "axios";
var TwitchStrategy = require("passport-twitch-latest").Strategy

const twitch: Service = {
    actions: new Map([
    ]),
    reactions: new Map([
    ]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new TwitchStrategy({
            clientID: process.env.TWITCH_CLIENT_ID,
            clientSecret: process.env.TWITCH_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/service/twitch/callback",
            passReqToCallback: true,
            scope:  ['user_read', 'user:read:email', 'user:manage:whispers', 'channel:read:subscriptions', 'user:manage:blocked_users', 'user:edit:follows']
        },
        async (req: any, accessToken: string, refreshToken: string, profile: any, _:any, callback: any) => {
            const res = await axios.get("https://api.twitch.tv/helix/users", {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Client-Id': process.env.TWITCH_CLIENT_ID
                }
            })
            let cbObj: OAuthCallbackObj = {
                data: profile,
                accessToken: accessToken,
                refreshToken: refreshToken,
                username: res.data.login
            }
            console.log(cbObj)
            let accountToken = req.query.state;
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken, refreshToken, mail, 'twitch').then(() => {
                callback(null, cbObj)
            })
        }
    ),
    refreshToken: async (refreshToken) => {
        let res
        try {
            console.log("ref", refreshToken)
            res = await axios.post("https://id.twitch.tv/oauth2/token", new URLSearchParams({
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                client_id: process.env.TWITCH_CLIENT_ID || '',
                client_secret: process.env.TWITCH_CLIENT_SECRET || ''
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

export default twitch