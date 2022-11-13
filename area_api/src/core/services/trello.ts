import { OAuthCallbackObj, Service } from "../types";
import jwt from "jsonwebtoken"
import db from "~/database/db";
import JwtFormat from "~/routes/auth/jwtFormat";
import newList from "~/areas/trello/actions/newList"
import newCard from "~/areas/trello/actions/newCard"
import addCard from "~/areas/trello/reactions/addCard"
import addList from "~/areas/trello/reactions/addList"
import TrelloStrategy from "~/strategies/trello";

const trello: Service = {
    actions: new Map([
        ["newList", newList],
        ["newCard", newCard]
    ]),
    reactions: new Map([
        ["addList", addList],
        ["addCard", addCard]
    ]),
    authParams: {
        accessType: 'offline',
        approvalPrompt: 'force'
    },
    strategy: new TrelloStrategy(
        {
            consumerKey: process.env.TRELLO_CLIENT_ID,
            consumerSecret: process.env.TRELLO_CLIENT_SECRET,
            callbackURL: process.env.DOMAIN + "/service/trello/callback",
            passReqToCallback: true,
            trelloParams: {
                scope: "read,write",
                name: "MyApp",
                expiration: "never"
            },
            state: true
        },
        (req: any, accessToken: string, refreshToken: string, profile: any, callback: any) => {
            req.query.state = profile.state
            let cbObj: OAuthCallbackObj = {
                data: profile.id.toString(),
                accessToken: accessToken,
                refreshToken: refreshToken,
                username: profile.displayName
            }
            let accountToken = req.query.state;
            if (!accountToken || !accountToken.includes(' ')) {
                callback(null, cbObj)
                return
            }
            let mail = (jwt.decode(accountToken.split(' ')[1]) as JwtFormat).email
            db.setToken(accessToken, refreshToken, mail, 'trello').then(() => {
                callback(null, cbObj)
            }).catch((err) => callback(err))
        }
    ) as any,
    refreshToken: async (refreshToken) => {
        return ''
    }
}

export default trello