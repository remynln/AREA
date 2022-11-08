import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import { Strategy } from "~/strategies/notion/lib/passport-notion/index"
import { Request } from "express";
const notion: Service = {
    actions: new Map([]),
    reactions: new Map([]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new Strategy(
        {
            clientID: process.env.NOTION_CLIENT_ID || '',
            clientSecret: process.env.NOTION_CLIENT_SECRET || '',
            callbackURL: "http://localhost:8080/service/notion/callback"
        },
        (reqUkn, accessToken, refreshToken, oauthData, profile, callback: any) => {
            let req = reqUkn as any
            console.log(accessToken, refreshToken, profile)
            let cbObj: OAuthCallbackObj = {
                data: profile.id,
                accessToken: accessToken,
                refreshToken: '',
                username: profile.name || ''
            }
            console.log(cbObj)
            let accountToken = req.query.state;
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken, '', mail, 'notion').then(() => {
                callback(null, cbObj)
            })
        }
    ),
    refreshToken: async (refreshToken) => {
        return ''
    }
}

export default notion