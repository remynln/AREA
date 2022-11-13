import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import axios from "axios";
var PinterestStrategy = require("passport-pinterest").Strategy

const pinterest: Service = {
    actions: new Map([
    ]),
    reactions: new Map([
    ]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new PinterestStrategy({
            clientID: process.env.PINTEREST_CLIENT_ID,
            clientSecret: process.env.PINTEREST_CLIENT_SECRET,
            callbackURL: process.env.DOMAIN + "/service/pinterest/callback",
            passReqToCallback: true,
            scope:  ['read_public', 'read_relationships']
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
            db.setToken(accessToken, refreshToken, mail, 'pinterest').then(() => {
                callback(null, cbObj)
            }).catch((err) => callback(err))
        }
    ),
    refreshToken: async (refreshToken) => {
        let res
        try {
            console.log("ref", refreshToken)
            res = await axios.post("https://api.pinterest.com/v5/oauth/token", new URLSearchParams({
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                client_id: process.env.PINTEREST_CLIENT_ID || '',
                client_secret: process.env.PINTEREST_CLIENT_SECRET || ''
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

export default pinterest