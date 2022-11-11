import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import GeniusStrategy from "~/strategies/genius"

const genius: Service = {
    actions: new Map([]),
    reactions: new Map([]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new GeniusStrategy(
        {
            clientID: process.env.GENIUS_CLIENT_ID || '',
            clientSecret: process.env.GENIUS_CLIENT_SECRET || '',
            callbackURL: "http://localhost:8080/service/genius/callback",
            scope: ["me", "create_annotation", "manage_annotation", "vote"]
        },
        (req: any, accessToken: string, refreshToken: any, profile: any, callback: any) => {
            let cbObj: OAuthCallbackObj = {
                data: profile.id.toString(),
                accessToken: accessToken,
                refreshToken: '',
                username: profile.name
            }
            let accountToken = req.query.state;
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken, refreshToken, mail, 'genius').then(() => {
                callback(null, cbObj)
            })
        }
    ),
    refreshToken: async (refreshToken) => {
        return ''
    }
}

export default genius