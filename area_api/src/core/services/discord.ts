import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import axios from "axios";

import userChanged from '~/areas/discord/action/userChanged'
var DiscordStrategy = require("passport-discord").Strategy

const discord: Service = {
    actions: new Map([
        ["userChanged", userChanged],
    ]),
    reactions: new Map([
    ]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new DiscordStrategy({
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.DOMAIN + "/service/discord/callback",
            passReqToCallback: true,
            scope:  [
                "identify",
                "email",
                "guilds",
                "connections",
                "rpc"
            ]
        },
        (req: any, accessToken: string, refreshToken: string, profile: any, callback: any) => {
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
            db.setToken(accessToken, refreshToken, mail, 'discord').then(() => {
                callback(null, cbObj)
            })
        }
    ),
    refreshToken: async (refreshToken) => {
        let res
        try {
            console.log("ref", refreshToken)
            res = await axios.post("https://discord.com/oauth2/authorize", new URLSearchParams({
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                client_id: process.env.DISCORD_CLIENT_ID || '',
                client_secret: process.env.DISCORD_CLIENT_SECRET || ''
            }), {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            })
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

export default discord