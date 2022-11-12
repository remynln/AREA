import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import newComment from "~/areas/notion/actions/newComment"
import addTodo from "~/areas/notion/reactions/addTodo"
import addComment from "~/areas/notion/reactions/addComment"
import { Strategy } from "~/strategies/notion/lib/passport-notion/index"
import { Request } from "express";
const notion: Service = {
    actions: new Map([
        ["newComment", newComment]
    ]),
    reactions: new Map([
        ["addTodo", addTodo],
        ["addComment", addComment]
    ]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new Strategy(
        {
            clientID: process.env.NOTION_CLIENT_ID || '',
            clientSecret: process.env.NOTION_CLIENT_SECRET || '',
            callbackURL: process.env.DOMAIN + "/service/notion/callback"
        },
        (reqUkn, accessToken, refreshToken, oauthData, profile, callback: any) => {
            let req = reqUkn as any
            let cbObj: OAuthCallbackObj = {
                data: profile.id,
                accessToken: accessToken,
                refreshToken: '',
                username: profile.name || ''
            }
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